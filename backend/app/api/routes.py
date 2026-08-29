import os
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.core.scoring import calculate_destination_score, filter_and_rank_activities, get_age_group
from app.services.external_apis import get_weather_forecast, geocode_query, get_wikipedia_summary
from app.services.flight_service import calculate_flight_estimates
from app.services.lodging_service import calculate_lodging_estimates
from app.services.ai_service import generate_ai_itinerary_expansion

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_destinations() -> List[Dict[str, Any]]:
    with open(os.path.join(DATA_DIR, "destinations.json"), "r", encoding="utf-8") as f:
        return json.load(f)

def load_activities() -> List[Dict[str, Any]]:
    with open(os.path.join(DATA_DIR, "activities.json"), "r", encoding="utf-8") as f:
        return json.load(f)

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

class FamilyMember(BaseModel):
    name: Optional[str] = "Family Member"
    age: int = Field(default=30, ge=0, le=120)
    role: Optional[str] = "Adult"
    likes: List[str] = Field(default_factory=list)

class SendEmailRequest(BaseModel):
    to_email: str
    subject: Optional[str] = None
    message: Optional[str] = None
    trip_url: Optional[str] = None
    trip_summary: Optional[Dict[str, Any]] = None

class SendSmsRequest(BaseModel):
    phone_number: str
    message: Optional[str] = None
    trip_url: Optional[str] = None

class RecommendationRequest(BaseModel):
    family_members: List[FamilyMember] = Field(default_factory=list)
    likes: List[str] = Field(default_factory=list)
    dislikes: List[str] = Field(default_factory=list)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration_days: Optional[int] = 5
    preferred_destination: Optional[str] = None
    origin_city: Optional[str] = "Chicago"
    budget_tier: Optional[str] = "moderate"

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "Family Travel Planner API", "timestamp": datetime.utcnow().isoformat()}

@router.get("/destinations")
def get_destinations():
    return load_destinations()

@router.get("/geocode")
async def geocode(q: str = Query(..., min_length=2)):
    result = await geocode_query(q)
    if not result:
        raise HTTPException(status_code=404, detail="Location not found")
    return result

@router.get("/weather")
async def get_weather(lat: float, lng: float):
    return await get_weather_forecast(lat, lng)

@router.post("/share/send-email")
async def send_email_itinerary(req: SendEmailRequest):
    """
    Directly sends itinerary email with link to destination.
    Uses SMTP server if configured, or prepares structured payload.
    """
    to_emails = [e.strip() for e in req.to_email.split(",") if e.strip()]
    if not to_emails:
        raise HTTPException(status_code=400, detail="Please provide a valid recipient email address.")

    subject = req.subject or "Your Family Vacation Itinerary & Budget"
    
    # Construct clean email message
    content = req.message or ""
    if req.trip_url:
        content += f"\n\n🔗 View & interact with the complete family vacation plan here:\n{req.trip_url}\n"

    # If SMTP is configured in environment, send directly via smtplib
    if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            msg["To"] = ", ".join(to_emails)
            msg["Subject"] = subject

            # Plain text body + link
            msg.attach(MIMEText(content, "plain"))

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_FROM_EMAIL, to_emails, msg.as_string())

            return {
                "status": "sent",
                "message": f"Direct email successfully sent to {', '.join(to_emails)}!",
                "recipients": to_emails
            }
        except Exception as e:
            return {
                "status": "smtp_error",
                "message": f"SMTP attempt failed ({str(e)}). You can also use client dispatch.",
                "fallback_content": content
            }

    # If no custom SMTP credentials provided, return formatted payload for direct client mailto / web dispatch
    return {
        "status": "ready_for_client_dispatch",
        "message": f"Email prepared for {', '.join(to_emails)}. Configure SMTP_HOST in .env for automated SMTP delivery.",
        "subject": subject,
        "recipients": to_emails,
        "content": content
    }

@router.post("/share/send-sms")
async def send_sms_itinerary(req: SendSmsRequest):
    """
    Formats and prepares direct SMS message with direct vacation link.
    """
    phone = req.phone_number.strip()
    if not phone:
        raise HTTPException(status_code=400, detail="Please provide a valid phone number.")

    sms_text = req.message or ""
    if req.trip_url and req.trip_url not in sms_text:
        sms_text += f" Link: {req.trip_url}"

    return {
        "status": "ready",
        "recipient": phone,
        "message": sms_text
    }

@router.post("/recommendations")
async def get_recommendations(req: RecommendationRequest):
    destinations = load_destinations()
    activities = load_activities()

    # Calculate duration
    duration = req.duration_days or 5
    if req.start_date and req.end_date:
        try:
            d1 = datetime.strptime(req.start_date, "%Y-%m-%d")
            d2 = datetime.strptime(req.end_date, "%Y-%m-%d")
            diff = (d2 - d1).days
            if diff > 0:
                duration = diff
        except Exception:
            pass

    family_dicts = [m.model_dump() for m in req.family_members] or [{"name": "Adult", "age": 35}, {"name": "Child", "age": 8}]
    num_family_members = len(family_dicts)

    # 1. Filter or Rank Destinations
    matched_destinations = []
    preferred = (req.preferred_destination or "").strip().lower()

    if preferred:
        # Search matching destination in database
        for d in destinations:
            if (preferred in d["name"].lower() or 
                preferred in d["country"].lower() or 
                preferred in d.get("region", "").lower() or
                preferred in d["id"].lower()):
                matched_destinations.append(d)
        
        # If not in built-in list, try geocoding dynamically
        if not matched_destinations:
            geo = await geocode_query(req.preferred_destination)
            if geo:
                dynamic_dest = {
                    "id": f"custom-{preferred[:10]}",
                    "name": geo["name"].split(",")[0] + f", {geo.get('country', '')}",
                    "country": geo.get("country", "Global"),
                    "region": "Custom Destination",
                    "coordinates": {"lat": geo["lat"], "lng": geo["lng"]},
                    "airport_code": "INTL",
                    "hero_image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
                    "short_description": f"Custom family destination exploring {geo['name']}.",
                    "primary_categories": ["nature", "history_culture", "food_culinary"],
                    "target_age_groups": ["toddlers", "kids", "tweens", "teens", "adults"],
                    "pacing": "moderate",
                    "best_seasons": ["Spring", "Summer", "Autumn"],
                    "stroller_friendly": True,
                    "crowd_level": "moderate",
                    "climate_type": "temperate",
                    "flight_base_usd": {"low": 300, "avg": 500, "peak": 850},
                    "lodging_daily_usd": {"budget_inn": 110, "vacation_rental": 200, "family_suite": 280, "luxury_resort": 550},
                    "daily_food_per_person_usd": 45,
                    "local_transport_daily_usd": 35,
                    "highlight_features": ["Local family exploration", "Scenic landscapes", "Cultural landmarks"]
                }
                matched_destinations.append(dynamic_dest)

    if not matched_destinations:
        matched_destinations = destinations

    # 2. Score each destination
    scored_destinations = []
    for d in matched_destinations:
        score_info = calculate_destination_score(
            d, family_dicts, req.likes, req.dislikes, req.budget_tier or "moderate"
        )
        dest_copy = dict(d)
        dest_copy.update(score_info)
        scored_destinations.append(dest_copy)

    # Sort by match score descending
    scored_destinations.sort(key=lambda x: x["match_score"], reverse=True)

    # Pick primary selected destination
    primary_dest = scored_destinations[0]

    # 3. Fetch live weather
    coords = primary_dest.get("coordinates", {"lat": 28.5383, "lng": -81.3792})
    weather_info = await get_weather_forecast(coords["lat"], coords["lng"])

    # 4. Generate Flights recommendations
    flight_data = calculate_flight_estimates(
        req.origin_city or "Chicago", primary_dest, family_dicts, duration
    )

    # 5. Generate Lodging recommendations
    lodging_data = calculate_lodging_estimates(
        primary_dest, family_dicts, duration, req.budget_tier or "moderate"
    )

    # 6. Activities tailored and ranked
    ranked_activities = filter_and_rank_activities(
        activities, primary_dest["id"], family_dicts, req.likes, req.dislikes
    )

    # If dynamic/custom destination with no direct activities, generate smart generic activities
    if not ranked_activities:
        ranked_activities = [
            {
                "id": "act-gen-1",
                "destination_id": primary_dest["id"],
                "name": f"Explore {primary_dest['name']} Historic Old Town & Plaza",
                "category": "history_culture",
                "labels": ["Free Entry", "Walkable", "All Ages", "Half Day"],
                "target_ages": ["toddlers", "kids", "tweens", "teens", "adults"],
                "min_age": 0,
                "price_per_person_usd": 0,
                "price_tier": "Free",
                "duration_hours": 3,
                "best_time_of_day": "Morning",
                "family_tag": "Great for All Ages",
                "description": "Stroll picturesque cobblestone streets, local artisan markets, and family-friendly cafes.",
                "tips": "Pick up a local map at the visitor information center."
            },
            {
                "id": "act-gen-2",
                "destination_id": primary_dest["id"],
                "name": f"{primary_dest['name']} City Botanical Gardens & Park",
                "category": "nature",
                "labels": ["Nature & Play", "Stroller Friendly", "Budget Friendly", "All Ages"],
                "target_ages": ["toddlers", "kids", "tweens", "teens", "adults"],
                "min_age": 0,
                "price_per_person_usd": 12,
                "price_tier": "$",
                "duration_hours": 3,
                "best_time_of_day": "Afternoon",
                "family_tag": "Toddler & Child Friendly",
                "description": "Expansive green spaces, shaded picnic spots, playground for children, and exotic plants.",
                "tips": "Pack snacks and a picnic blanket for lunch."
            },
            {
                "id": "act-gen-3",
                "destination_id": primary_dest["id"],
                "name": "Local Family Interactive Science & Discovery Center",
                "category": "science_museums",
                "labels": ["Interactive", "Hands-on", "Kids & Tweens", "Indoor"],
                "target_ages": ["kids", "tweens", "teens", "adults"],
                "min_age": 3,
                "price_per_person_usd": 25,
                "price_tier": "$$",
                "duration_hours": 4,
                "best_time_of_day": "Morning",
                "family_tag": "Kid & Tween Favorite",
                "description": "Engaging hands-on science exhibits, optical illusions, planetarium, and engineering build zones.",
                "tips": "Great rainy-day or midday option when temperatures are high."
            }
        ]

    # 7. Total Price Ranges & Budget Breakdown
    daily_food_pp = primary_dest.get("daily_food_per_person_usd", 45)
    total_food_est = daily_food_pp * num_family_members * duration

    local_trans_daily = primary_dest.get("local_transport_daily_usd", 35)
    total_transport_est = local_trans_daily * duration

    # Activities total estimate (assume family does 1 major + 1 minor per day)
    avg_act_cost_pp = sum(a.get("price_per_person_usd", 0) for a in ranked_activities[:4]) / max(len(ranked_activities[:4]), 1)
    total_act_est = int(avg_act_cost_pp * num_family_members * min(duration, 4))

    # Low, Realistic, and Peak budgets
    budget_low = int(flight_data["price_range"]["total_family_low"] + lodging_data["price_range"]["total_trip_low"] + (total_food_est * 0.75) + total_transport_est + (total_act_est * 0.6))
    budget_realistic = int(flight_data["price_range"]["total_family_avg"] + lodging_data["price_range"]["total_trip_avg"] + total_food_est + total_transport_est + total_act_est)
    budget_peak = int(flight_data["price_range"]["total_family_peak"] + lodging_data["price_range"]["total_trip_peak"] + (total_food_est * 1.35) + (total_transport_est * 1.5) + (total_act_est * 1.4))

    budget_summary = {
        "duration_days": duration,
        "family_size": num_family_members,
        "total_budget_range": {
            "low": budget_low,
            "realistic": budget_realistic,
            "peak": budget_peak
        },
        "per_person_range": {
            "low": budget_low // num_family_members,
            "realistic": budget_realistic // num_family_members,
            "peak": budget_peak // num_family_members
        },
        "breakdown_realistic": {
            "flights": flight_data["price_range"]["total_family_avg"],
            "lodging": lodging_data["price_range"]["total_trip_avg"],
            "activities": total_act_est,
            "food_and_dining": total_food_est,
            "local_transport": total_transport_est,
            "emergency_buffer": int(budget_realistic * 0.08)
        }
    }

    # 8. Suggested Day-by-Day Itinerary
    itinerary_days = []
    act_pool = list(ranked_activities)
    for day_num in range(1, duration + 1):
        morning_act = act_pool.pop(0) if act_pool else ranked_activities[0]
        afternoon_act = act_pool.pop(0) if act_pool else (ranked_activities[1] if len(ranked_activities) > 1 else ranked_activities[0])
        
        itinerary_days.append({
            "day": day_num,
            "title": f"Day {day_num}: {morning_act.get('name', 'Exploration')}",
            "morning": {
                "activity": morning_act.get("name"),
                "time": "9:00 AM - 12:30 PM",
                "description": morning_act.get("description"),
                "price": f"${morning_act.get('price_per_person_usd', 0)}/person" if morning_act.get("price_per_person_usd", 0) > 0 else "Free",
                "tag": morning_act.get("family_tag")
            },
            "afternoon": {
                "activity": afternoon_act.get("name"),
                "time": "2:00 PM - 5:30 PM",
                "description": afternoon_act.get("description"),
                "price": f"${afternoon_act.get('price_per_person_usd', 0)}/person" if afternoon_act.get("price_per_person_usd", 0) > 0 else "Free",
                "tag": afternoon_act.get("family_tag")
            },
            "evening": {
                "activity": "Family Dinner & Sunset Relaxation",
                "time": "6:30 PM - 8:30 PM",
                "description": f"Enjoy dinner at a local family-friendly restaurant near your lodging.",
                "price": f"~${daily_food_pp * num_family_members // 2} total",
                "tag": "Relaxing"
            }
        })

    return {
        "destination": primary_dest,
        "all_ranked_destinations": scored_destinations,
        "flights": flight_data,
        "lodging": lodging_data,
        "activities": ranked_activities,
        "weather": weather_info,
        "budget_summary": budget_summary,
        "itinerary": itinerary_days,
        "family_profile_summary": {
            "total_travelers": num_family_members,
            "age_groups": list(set(get_age_group(m["age"]) for m in family_dicts)),
            "likes": req.likes,
            "dislikes": req.dislikes
        }
    }
