import asyncio
import httpx
from app.main import app
from app.api.routes import load_destinations, load_activities

async def test_backend():
    print("Testing backend data loading...")
    destinations = load_destinations()
    activities = load_activities()
    assert len(destinations) > 0, "Destinations database is empty!"
    assert len(activities) > 0, "Activities database is empty!"
    print(f"Loaded {len(destinations)} destinations and {len(activities)} curated activities.")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Test 1: Health check
        res_health = await client.get("/api/health")
        assert res_health.status_code == 200, f"Health check failed: {res_health.text}"
        print("Test 1: Health check PASSED")

        # Test 2: Destinations list
        res_dest = await client.get("/api/destinations")
        assert res_dest.status_code == 200
        print("Test 2: Destinations list PASSED")

        # Test 3: Recommendation for family with toddler & young kid in Orlando
        payload_orlando = {
            "family_members": [
                {"name": "Mom", "age": 36, "role": "Adult"},
                {"name": "Dad", "age": 37, "role": "Adult"},
                {"name": "Emma", "age": 6, "role": "Child"},
                {"name": "Leo", "age": 2, "role": "Toddler"}
            ],
            "likes": ["theme_parks", "animals_wildlife", "water_parks"],
            "dislikes": ["stroller_friendly"],
            "duration_days": 5,
            "preferred_destination": "Orlando, Florida",
            "origin_city": "Chicago (ORD)",
            "budget_tier": "moderate"
        }
        res_rec1 = await client.post("/api/recommendations", json=payload_orlando)
        assert res_rec1.status_code == 200, f"Recommendation 1 failed: {res_rec1.text}"
        data1 = res_rec1.json()
        assert "destination" in data1
        assert "flights" in data1
        assert "lodging" in data1
        assert "activities" in data1
        assert "budget_summary" in data1
        assert len(data1["activities"]) > 0
        assert data1["budget_summary"]["total_budget_range"]["realistic"] > 0
        print(f"Test 3: Orlando family recommendation PASSED (Match score: {data1['destination']['match_score']}%, Realistic Budget: ${data1['budget_summary']['total_budget_range']['realistic']})")

        # Test 4: Open search (no preferred destination) with individualized member interests
        payload_open = {
            "family_members": [
                {"name": "Dad (David)", "age": 45, "role": "Adult", "likes": ["nature", "hiking"]},
                {"name": "Teen Jack", "age": 16, "role": "Teen", "likes": ["adventure", "theme_parks"]},
                {"name": "Tween Maya", "age": 12, "role": "Tween", "likes": ["animals_wildlife", "science_museums"]}
            ],
            "likes": ["adventure"],
            "dislikes": ["avoid_heat", "avoid_crowds"],
            "duration_days": 7,
            "origin_city": "Denver",
            "budget_tier": "moderate"
        }
        res_rec2 = await client.post("/api/recommendations", json=payload_open)
        assert res_rec2.status_code == 200
        data2 = res_rec2.json()
        print(f"Test 4: Open search recommendation PASSED (Selected destination: {data2['destination']['name']}, Match score: {data2['destination']['match_score']}%)")

        # Test 5: Direct Email Share endpoint
        res_email = await client.post("/api/share/send-email", json={
            "to_email": "family@example.com",
            "subject": "Our Family Trip to Orlando",
            "message": "Here is our family trip itinerary!",
            "trip_url": "http://localhost:5173/#plan=test12345"
        })
        assert res_email.status_code == 200
        print("Test 5: Share Email endpoint PASSED")

        # Test 6: Direct SMS Share endpoint
        res_sms = await client.post("/api/share/send-sms", json={
            "phone_number": "+15550192834",
            "message": "Check out our vacation plan!",
            "trip_url": "http://localhost:5173/#plan=test12345"
        })
        assert res_sms.status_code == 200
        print("Test 6: Share SMS endpoint PASSED")

    print("\nALL BACKEND AUTOMATED TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(test_backend())
