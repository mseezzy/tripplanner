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
from app.services.ai_service import generate_ai_itinerary_expansion, generate_chat_response

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_destinations() -> List[Dict[str, Any]]:
    with open(os.path.join(DATA_DIR, "destinations.json"), "r", encoding="utf-8") as f:
        return json.load(f)

def load_activities() -> List[Dict[str, Any]]:
    with open(os.path.join(DATA_DIR, "activities.json"), "r", encoding="utf-8") as f:
        return json.load(f)

def load_events() -> List[Dict[str, Any]]:
    events_path = os.path.join(DATA_DIR, "events.json")
    if os.path.exists(events_path):
        with open(events_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

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

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = Field(default_factory=list)
    trip_data: Dict[str, Any] = Field(default_factory=dict)
    api_key: Optional[str] = None

class TripStop(BaseModel):
    id: Optional[str] = None
    destination: str
    duration_days: int = Field(default=3, ge=1, le=30)
    order: Optional[int] = 0

class RecommendationRequest(BaseModel):
    family_members: List[FamilyMember] = Field(default_factory=list)
    likes: List[str] = Field(default_factory=list)
    dislikes: List[str] = Field(default_factory=list)
    destinations: Optional[List[TripStop]] = None
    travel_month: Optional[int] = None
    month_period: Optional[str] = "all"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration_days: Optional[int] = 5
    preferred_destination: Optional[str] = None
    origin_city: Optional[str] = "Chicago (ORD)"
    budget_tier: Optional[str] = "moderate"
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None

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

@router.post("/chat")
async def chat_with_concierge(req: ChatRequest):
    reply = await generate_chat_response(
        message=req.message,
        history=req.history,
        trip_data=req.trip_data,
        api_key=req.api_key
    )
    if reply:
        return {"reply": reply, "source": "gemini_backend"}
    raise HTTPException(status_code=503, detail="Gemini service unavailable. Please check API key.")

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "gemini_active": bool(settings.GEMINI_API_KEY),
        "version": settings.VERSION
    }

from app.services.ai_service import discover_dynamic_destinations_ai
from app.services.wiki_service import enrich_destination_with_wiki, fetch_wikipedia_summary

@router.post("/recommendations")
async def get_recommendations(req: RecommendationRequest):
    all_destinations = load_destinations()
    all_activities = load_activities()

    family_dicts = [m.model_dump() for m in req.family_members] or [{"name": "Adult", "age": 35}, {"name": "Child", "age": 8}]
    num_family_members = len(family_dicts)

    # Resolve origin coordinates for distance-aware budget scoring
    origin_name = req.origin_city or "Chicago (ORD)"
    origin_coords = {"lat": 41.9742, "lng": -87.9073}
    origin_geo = await geocode_query(origin_name)
    if origin_geo:
        origin_coords = {"lat": origin_geo["lat"], "lng": origin_geo["lng"]}

    # 1. Normalize trip stops
    raw_stops = []
    if req.destinations and len(req.destinations) > 0:
        raw_stops = [s.model_dump() for s in req.destinations if s.destination.strip()]
    elif req.preferred_destination and req.preferred_destination.strip():
        raw_stops = [{"destination": req.preferred_destination.strip(), "duration_days": req.duration_days or 5, "order": 0}]

    candidate_pool = all_destinations

    # If open search, attempt dynamic AI discovery first
    if not raw_stops:
        dynamic_ai = await discover_dynamic_destinations_ai(
            family_members=family_dicts,
            likes=req.likes,
            dislikes=req.dislikes,
            origin_airport=origin_name,
            budget_tier=req.budget_tier or "moderate",
            travel_month=req.travel_month,
            budget_min=req.budget_min,
            budget_max=req.budget_max
        )
        if dynamic_ai and isinstance(dynamic_ai, list) and len(dynamic_ai) > 0:
            dyn_ids = set(d.get("id") or d.get("name") for d in dynamic_ai)
            candidate_pool = dynamic_ai + [d for d in all_destinations if d.get("id") not in dyn_ids and d.get("name") not in dyn_ids]

    # Score all candidates with origin distance & budget weighting
    scored_all = []
    for d in candidate_pool:
        sc = calculate_destination_score(
            d, family_dicts, req.likes, req.dislikes, req.budget_tier or "moderate",
            origin_coords=origin_coords,
            budget_min=req.budget_min,
            budget_max=req.budget_max,
            duration_days=req.duration_days or 5
        )
        d_copy = dict(d)
        d_copy.update(sc)
        scored_all.append(d_copy)
    scored_all.sort(key=lambda x: x["match_score"], reverse=True)

    # Hard budget filter: if budget_min or budget_max is specified, only include candidates within budget
    if req.budget_min is not None or req.budget_max is not None:
        valid_budget_destinations = [
            d for d in scored_all 
            if not d.get("budget_violation", False) and d.get("match_score", 0) > 0
        ]
        if valid_budget_destinations:
            scored_all = valid_budget_destinations

    # Enrich top candidates with live Wikipedia photography if missing
    for top_d in scored_all[:5]:
        await enrich_destination_with_wiki(top_d)

    if not raw_stops:
        raw_stops = [{"destination": scored_all[0]["name"], "duration_days": req.duration_days or 5, "order": 0}]

    total_trip_duration = sum(s.get("duration_days", 3) for s in raw_stops)

    # 2. Process each destination stop in sequence
    processed_stops = []
    all_itinerary_days = []
    total_lodging_low = 0
    total_lodging_avg = 0
    total_lodging_peak = 0
    total_food_est = 0
    total_act_est = 0
    total_transport_est = 0
    day_counter = 1

    for stop_idx, stop in enumerate(raw_stops):
        dest_name_query = stop.get("destination", "").strip().lower()
        stop_duration = stop.get("duration_days", 3)

        # Match destination
        matched_dest = None
        for d in all_destinations:
            if (dest_name_query in d["name"].lower() or 
                dest_name_query in d["country"].lower() or 
                dest_name_query in d.get("region", "").lower() or
                dest_name_query in d["id"].lower()):
                matched_dest = d
                break

        # Dynamic geocoding fallback if custom location
        if not matched_dest:
            geo = await geocode_query(stop.get("destination", ""))
            if geo:
                matched_dest = {
                    "id": f"custom-{dest_name_query[:10]}",
                    "name": geo["name"].split(",")[0] + f", {geo.get('country', '')}",
                    "country": geo.get("country", "Global"),
                    "region": "Custom Stop",
                    "coordinates": {"lat": geo["lat"], "lng": geo["lng"]},
                    "airport_code": "INTL",
                    "hero_image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
                    "short_description": f"Family destination stop exploring {geo['name']}.",
                    "primary_categories": ["nature", "history_culture", "food_culinary"],
                    "target_age_groups": ["toddlers", "kids", "tweens", "teens", "adults"],
                    "pacing": "moderate",
                    "best_seasons": ["Spring", "Summer", "Autumn"],
                    "stroller_friendly": True,
                    "crowd_level": "moderate",
                    "climate_type": "temperate",
                    "flight_base_usd": {"low": 280, "avg": 450, "peak": 750},
                    "lodging_daily_usd": {"budget_inn": 110, "vacation_rental": 200, "family_suite": 280, "luxury_resort": 550},
                    "daily_food_per_person_usd": 45,
                    "local_transport_daily_usd": 35,
                    "highlight_features": ["Local cultural discoveries", "Family walking tours", "Regional scenery"]
                }
            else:
                matched_dest = all_destinations[stop_idx % len(all_destinations)]

        # Score destination and compute member enjoyment meters
        score_info = calculate_destination_score(
            matched_dest, family_dicts, req.likes, req.dislikes, req.budget_tier or "moderate",
            budget_min=req.budget_min,
            budget_max=req.budget_max,
            duration_days=stop_duration
        )
        scored_dest = dict(matched_dest)
        scored_dest.update(score_info)

        # Weather for stop
        coords = scored_dest.get("coordinates", {"lat": 28.5383, "lng": -81.3792})
        weather_info = await get_weather_forecast(coords["lat"], coords["lng"])

        # Lodging for stop duration
        lodging_data = calculate_lodging_estimates(
            scored_dest, family_dicts, stop_duration, req.budget_tier or "moderate"
        )
        total_lodging_low += lodging_data["price_range"]["total_trip_low"]
        total_lodging_avg += lodging_data["price_range"]["total_trip_avg"]
        total_lodging_peak += lodging_data["price_range"]["total_trip_peak"]

        # Activities for stop
        ranked_activities = filter_and_rank_activities(
            all_activities, scored_dest["id"], family_dicts, req.likes, req.dislikes
        )
        if not ranked_activities:
            ranked_activities = [
                {
                    "id": f"act-custom-{stop_idx}-1",
                    "destination_id": scored_dest["id"],
                    "name": f"Explore {scored_dest['name']} Historic Center & Plazas",
                    "category": "history_culture",
                    "labels": ["Historic Sights", "Walkable", "All Ages", "Half Day"],
                    "target_ages": ["toddlers", "kids", "tweens", "teens", "adults"],
                    "min_age": 0,
                    "price_per_person_usd": 0,
                    "price_tier": "Free",
                    "duration_hours": 3,
                    "best_time_of_day": "Morning",
                    "family_tag": "Great for All Ages",
                    "matched_members": [m.get("name") for m in family_dicts],
                    "description": "Stroll scenic walkways, vibrant neighborhood squares, and family-friendly markets.",
                    "tips": "Great walking route with plenty of shaded gelato and snack stops."
                },
                {
                    "id": f"act-custom-{stop_idx}-2",
                    "destination_id": scored_dest["id"],
                    "name": f"{scored_dest['name']} Parks & Nature Trail",
                    "category": "nature",
                    "labels": ["Nature & Play", "Stroller Friendly", "Budget Friendly"],
                    "target_ages": ["toddlers", "kids", "tweens", "teens", "adults"],
                    "min_age": 0,
                    "price_per_person_usd": 12,
                    "price_tier": "$",
                    "duration_hours": 3,
                    "best_time_of_day": "Afternoon",
                    "family_tag": "Toddler & Child Friendly",
                    "matched_members": [m.get("name") for m in family_dicts if m.get("age", 20) <= 12],
                    "description": "Scenic green spaces with playgrounds, fountains, and picnic grounds for family relaxation.",
                    "tips": "Pack sunscreen and a light picnic."
                }
            ]

        # Stop food & transport
        daily_food = scored_dest.get("daily_food_per_person_usd", 45)
        total_food_est += daily_food * num_family_members * stop_duration
        total_transport_est += scored_dest.get("local_transport_daily_usd", 35) * stop_duration

        avg_act_cost = sum(a.get("price_per_person_usd", 0) for a in ranked_activities[:3]) / max(len(ranked_activities[:3]), 1)
        total_act_est += int(avg_act_cost * num_family_members * min(stop_duration, 3))

        # Generate Day-by-Day itinerary for this stop
        stop_pool = list(ranked_activities)
        for d_in_stop in range(1, stop_duration + 1):
            m_act = stop_pool.pop(0) if stop_pool else ranked_activities[0]
            a_act = stop_pool.pop(0) if stop_pool else (ranked_activities[1] if len(ranked_activities) > 1 else ranked_activities[0])
            
            all_itinerary_days.append({
                "day": day_counter,
                "stop_number": stop_idx + 1,
                "destination_name": scored_dest["name"],
                "title": f"Day {day_counter} ({scored_dest['name'].split(',')[0]}): {m_act.get('name', 'Exploration')}",
                "morning": {
                    "activity": m_act.get("name"),
                    "time": "9:00 AM - 12:30 PM",
                    "description": m_act.get("description"),
                    "price": f"${m_act.get('price_per_person_usd', 0)}/person" if m_act.get("price_per_person_usd", 0) > 0 else "Free",
                    "tag": m_act.get("family_tag")
                },
                "afternoon": {
                    "activity": a_act.get("name"),
                    "time": "2:00 PM - 5:30 PM",
                    "description": a_act.get("description"),
                    "price": f"${a_act.get('price_per_person_usd', 0)}/person" if a_act.get("price_per_person_usd", 0) > 0 else "Free",
                    "tag": a_act.get("family_tag")
                },
                "evening": {
                    "activity": f"Family Dinner in {scored_dest['name'].split(',')[0]}",
                    "time": "6:30 PM - 8:30 PM",
                    "description": f"Enjoy dinner at a local family-friendly restaurant near your lodging.",
                    "price": f"~${daily_food * num_family_members // 2} total",
                    "tag": "Dining"
                }
            })
            day_counter += 1

        processed_stops.append({
            "stop_number": stop_idx + 1,
            "duration_days": stop_duration,
            "destination": scored_dest,
            "weather": weather_info,
            "lodging": lodging_data,
            "activities": ranked_activities
        })

    # 3. Multi-Stop Flights & Inter-City Transit Calculation
    primary_stop_dest = processed_stops[0]["destination"]
    flight_data = calculate_flight_estimates(
        req.origin_city or "Chicago (ORD)", primary_stop_dest, family_dicts, total_trip_duration
    )
    
    # If multiple stops, add inter-city transport / multi-hop flight buffer
    num_stops = len(processed_stops)
    if num_stops > 1:
        inter_city_transfer_family = (num_stops - 1) * (180 * num_family_members)
        flight_data["price_range"]["total_family_low"] += int(inter_city_transfer_family * 0.7)
        flight_data["price_range"]["total_family_avg"] += inter_city_transfer_family
        flight_data["price_range"]["total_family_peak"] += int(inter_city_transfer_family * 1.3)
        flight_data["price_range"]["avg_per_person"] = flight_data["price_range"]["total_family_avg"] // num_family_members
        flight_data["multi_destination_route"] = " ➔ ".join([req.origin_city.split()[0] if req.origin_city else "Origin"] + [s["destination"]["name"].split(",")[0] for s in processed_stops] + [req.origin_city.split()[0] if req.origin_city else "Origin"])
        flight_data["family_travel_tip"] = f"Multi-city route: Includes roundtrip flights plus {num_stops - 1} inter-city train/flight transfer(s)."

    # 4. Overall Combined Budget Summary
    budget_low = int(flight_data["price_range"]["total_family_low"] + total_lodging_low + (total_food_est * 0.75) + total_transport_est + (total_act_est * 0.6))
    budget_realistic = int(flight_data["price_range"]["total_family_avg"] + total_lodging_avg + total_food_est + total_transport_est + total_act_est)
    budget_peak = int(flight_data["price_range"]["total_family_peak"] + total_lodging_peak + (total_food_est * 1.35) + (total_transport_est * 1.5) + (total_act_est * 1.4))

    budget_summary = {
        "duration_days": total_trip_duration,
        "total_stops": num_stops,
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
            "lodging": total_lodging_avg,
            "activities": total_act_est,
            "food_and_dining": total_food_est,
            "local_transport": total_transport_est,
            "emergency_buffer": int(budget_realistic * 0.08)
        }
    }

    # Primary destination is the first stop (or composite summary)
    primary_dest = processed_stops[0]["destination"]
    primary_weather = processed_stops[0]["weather"]
    primary_lodging = processed_stops[0]["lodging"]
    primary_activities = processed_stops[0]["activities"]

    all_events = load_events()
    target_month = req.travel_month
    if not target_month and req.start_date:
        try:
            target_month = datetime.strptime(req.start_date, "%Y-%m-%d").month
        except Exception:
            target_month = datetime.utcnow().month

    dest_lower = primary_dest["name"].lower()
    matched_events = [
        ev for ev in all_events
        if any(kw in dest_lower for kw in ev.get("destination_keywords", []))
        and (target_month is None or target_month in ev.get("months", []))
    ]

    return {
        "is_multi_destination": num_stops > 1,
        "total_stops": num_stops,
        "stops": processed_stops,
        "destination": primary_dest,
        "all_ranked_destinations": scored_all if not (req.destinations and len(req.destinations) > 1) else [s["destination"] for s in processed_stops],
        "flights": flight_data,
        "lodging": primary_lodging,
        "activities": primary_activities,
        "events": matched_events,
        "weather": primary_weather,
        "budget_summary": budget_summary,
        "itinerary": all_itinerary_days,
        "family_profile_summary": {
            "total_travelers": num_family_members,
            "age_groups": list(set(get_age_group(m["age"]) for m in family_dicts)),
            "likes": req.likes,
            "dislikes": req.dislikes
        }
    }
