import httpx
import urllib.parse
from typing import Dict, Any, List, Optional

WIKI_HEADERS = {
    "User-Agent": "FamilyTravelPlannerBot/1.0 (https://github.com/travelplanner; contact@travelplanner.local)"
}

async def fetch_wikipedia_summary(query: str) -> Optional[Dict[str, Any]]:
    """
    Fetches real-time summary, high-resolution photography, and GPS coordinates
    from Wikipedia REST API for any city, landmark, national park, or island on Earth.
    """
    if not query or not query.strip():
        return None

    # Clean query for Wikipedia lookup (e.g. "Kansas City, Missouri" -> "Kansas_City,_Missouri")
    cleaned = query.split("(")[0].strip()
    encoded = urllib.parse.quote(cleaned.replace(" ", "_"))

    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}"

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url, headers=WIKI_HEADERS)
            if resp.status_code == 200:
                data = resp.json()
                thumb = data.get("thumbnail", {}).get("source") or data.get("originalimage", {}).get("source")
                coords = data.get("coordinates")
                return {
                    "title": data.get("title", cleaned),
                    "extract": data.get("extract", ""),
                    "thumbnail": thumb,
                    "coordinates": coords,
                    "description": data.get("description", "")
                }
            # Fallback search if direct title lookup missed
            search_url = f"https://en.wikipedia.org/w/api.php?action=opensearch&search={urllib.parse.quote(cleaned)}&limit=1&namespace=0&format=json"
            search_resp = await client.get(search_url, headers=WIKI_HEADERS)
            if search_resp.status_code == 200:
                search_data = search_resp.json()
                if len(search_data) > 1 and search_data[1]:
                    first_match = search_data[1][0]
                    match_encoded = urllib.parse.quote(first_match.replace(" ", "_"))
                    match_resp = await client.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{match_encoded}", headers=WIKI_HEADERS)
                    if match_resp.status_code == 200:
                        m_data = match_resp.json()
                        return {
                            "title": m_data.get("title", first_match),
                            "extract": m_data.get("extract", ""),
                            "thumbnail": m_data.get("thumbnail", {}).get("source") or m_data.get("originalimage", {}).get("source"),
                            "coordinates": m_data.get("coordinates"),
                            "description": m_data.get("description", "")
                        }
    except Exception as e:
        print(f"Wikipedia API error for {query}: {e}")
    return None

async def fetch_wikipedia_geosearch(lat: float, lon: float, radius_meters: int = 350000) -> List[Dict[str, Any]]:
    """
    Discovers notable cities, national parks, and landmarks within a radius (in meters)
    around any departure origin GPS coordinate on Earth.
    """
    radius = min(radius_meters, 500000)  # Max 500km per Wikipedia geosearch call
    url = f"https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord={lat}|{lon}&gsradius={radius}&gslimit=10&format=json"

    results = []
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url, headers=WIKI_HEADERS)
            if resp.status_code == 200:
                data = resp.json()
                places = data.get("query", {}).get("geosearch", [])
                for place in places[:8]:
                    title = place.get("title")
                    summary = await fetch_wikipedia_summary(title)
                    if summary and summary.get("extract"):
                        results.append({
                            "title": title,
                            "lat": place.get("lat"),
                            "lon": place.get("lon"),
                            "extract": summary.get("extract"),
                            "thumbnail": summary.get("thumbnail")
                        })
    except Exception as e:
        print(f"Wikipedia GeoSearch error: {e}")
    return results

async def enrich_destination_with_wiki(dest: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enriches a destination with live Wikipedia photography and authentic summary details.
    """
    dest_name = dest.get("name", "")
    wiki_info = await fetch_wikipedia_summary(dest_name)
    if wiki_info:
        if wiki_info.get("thumbnail"):
            dest["hero_image"] = wiki_info["thumbnail"]
        if wiki_info.get("extract") and len(wiki_info["extract"]) > 40:
            # Provide authentic Wikipedia summary if short_description is default/empty
            if not dest.get("short_description") or "exploring" in dest.get("short_description", "").lower():
                dest["short_description"] = wiki_info["extract"][:220] + "..."
        if wiki_info.get("coordinates") and ("lat" not in dest.get("coordinates", {}) or not dest["coordinates"]["lat"]):
            dest["coordinates"] = {
                "lat": wiki_info["coordinates"]["lat"],
                "lng": wiki_info["coordinates"]["lon"]
            }
    return dest
