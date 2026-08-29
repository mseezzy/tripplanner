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
