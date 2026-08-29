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
