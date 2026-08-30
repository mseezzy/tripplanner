import json
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings

async def generate_ai_itinerary_expansion(
    destination_name: str,
    family_members: List[Dict[str, Any]],
    likes: List[str],
    dislikes: List[str],
    duration_days: int
) -> Optional[Dict[str, Any]]:
    """
    Optional enhancement: Uses Google Gemini Free API tier if GEMINI_API_KEY is present in env.
    If no key is configured or an error occurs, returns None to smoothly use built-in curated knowledge.
    """
    if not settings.GEMINI_API_KEY:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
    
    prompt = f"""
You are a family travel planning expert.
Destination: {destination_name}
Duration: {duration_days} days
Family members: {family_members}
Interests/Likes: {likes}
Dislikes/Constraints: {dislikes}

Provide a JSON object with:
1. "overview_tips": ["tip1", "tip2", "tip3"]
2. "day_by_day_theme": [
   {{"day": 1, "title": "...", "morning": "...", "afternoon": "...", "evening": "...", "meal_recommendation": "..."}}
]

Return strictly valid JSON only.
"""
    try:
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
    except Exception as e:
        print(f"AI Service fallback: {e}")
    return None

async def discover_dynamic_destinations_ai(
    family_members: List[Dict[str, Any]],
    likes: List[str],
    dislikes: List[str],
    origin_airport: str = "ORD",
    budget_tier: str = "moderate",
    travel_month: Optional[int] = None,
    api_key: Optional[str] = None
) -> Optional[List[Dict[str, Any]]]:
    """
    Dynamically discovers and synthesizes 8-12 worldwide destination candidates on the fly
    tailored specifically to the family travelers, interests, month, and budget tier.
    """
    active_key = api_key or settings.GEMINI_API_KEY
    if not active_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={active_key}"

    prompt = f"""
You are an expert global travel discovery algorithm.
Analyze this family travel profile and dynamically discover 8 to 12 diverse, exciting travel destinations ANYWHERE across the world (spanning different continents, including famous capitals and scenic gems).

FAMILY TRAVEL PROFILE:
- Travelers: {family_members}
- Interests/Likes: {likes}
- Constraints/Dislikes: {dislikes}
- Departure Origin: {origin_airport}
- Budget Tier: {budget_tier}
- Travel Month: {travel_month or 'Flexible'}

Return a JSON ARRAY of 8 to 12 destination objects with these exact fields:
- "id": unique string slug (e.g. "azores-portugal", "kyushu-japan")
- "name": Full name (e.g. "Azores & São Miguel, Portugal")
- "country": Country name
- "continent": One of ["Asia & Pacific", "Europe", "North America", "Latin America & Caribbean", "Middle East & Africa"]
- "region": Regional area
- "coordinates": {{"lat": float, "lng": float}}
- "airport_code": 3-letter IATA code
- "hero_image": Unsplash travel photo URL
- "short_description": 1-2 sentence compelling summary for this family
- "primary_categories": array of matching categories from ["theme_parks", "beaches", "nature", "animals_wildlife", "science_museums", "food_culinary", "history_culture", "adventure", "relaxing"]
- "target_age_groups": array from ["toddlers", "kids", "tweens", "teens", "adults"]
- "pacing": "relaxed" or "moderate" or "active"
- "best_seasons": ["Spring", "Summer", "Autumn", "Winter"]
- "stroller_friendly": boolean
- "crowd_level": "low" or "moderate" or "high"
- "climate_type": "mediterranean", "tropical", "temperate", "alpine", or "subtropical"
- "flight_base_usd": {{"low": int, "avg": int, "peak": int}}
- "lodging_daily_usd": {{"budget_inn": int, "vacation_rental": int, "family_suite": int, "luxury_resort": int}}
- "daily_food_per_person_usd": int
- "local_transport_daily_usd": int
- "highlight_features": array of 4 bullet points

Return strictly valid JSON array only.
"""
    try:
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        async with httpx.AsyncClient(timeout=14.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                results = json.loads(text)
                if isinstance(results, list) and len(results) > 0:
                    return results
    except Exception as e:
        print(f"Dynamic Discovery AI Error: {e}")
    return None

async def generate_chat_response(
    message: str,
    history: List[Dict[str, Any]],
    trip_data: Dict[str, Any],
    api_key: Optional[str] = None
) -> Optional[str]:
    """
    Sends conversation and trip context to Google Gemini Flash.
    """
    active_key = api_key or settings.GEMINI_API_KEY
    if not active_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={active_key}"

    dest_name = trip_data.get("destination", {}).get("name", "Unknown Destination")
    budget = trip_data.get("budget_summary", {})
    family = trip_data.get("family_profile_summary", {})
    stops = trip_data.get("stops", [])
    members = trip_data.get("destination", {}).get("member_enjoyment", [])

    system_instruction = f"""
You are the personal AI Family Travel Concierge for an upcoming vacation to {dest_name}.
You have complete knowledge of this family's planned itinerary, budget, and member profiles.

TRIP OVERVIEW:
- Destination(s): {[s.get('destination', {}).get('name') for s in stops] or dest_name}
- Total Duration: {budget.get('duration_days', 5)} Days
- Total Budget: ${budget.get('total_budget_range', {}).get('realistic', 0):,}
- Family Members: {[f"{m.get('name')} ({m.get('age')} yrs)" for m in members] or f"{family.get('total_travelers', 4)} travelers"}
- Likes: {family.get('likes', [])}
- Dislikes/Constraints: {family.get('dislikes', [])}

INSTRUCTIONS:
1. Answer ANY question the user asks warmly, accurately, and supportively (e.g. accessibility, special needs, disabilities, culture, etiquette, packing, pacing, food, activities, transit, medical, safety).
2. Reference specific family members and destination specifics whenever relevant.
3. Use bullet points and emoji to make advice clear for parents.
"""

    contents = []
    for msg in history[-8:]:
        role = "user" if msg.get("sender") == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg.get("text", "")}]})

    contents.append({"role": "user", "parts": [{"text": message}]})

    try:
        payload = {
            "system_instruction": {"parts": [{"text": system_instruction}]},
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 1000
            }
        }
        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Gemini Chat Service error: {e}")
    return None
