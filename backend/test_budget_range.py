import asyncio
import pytest
import httpx
from app.main import app

@pytest.mark.asyncio
async def test_budget_range_support():
    """
    TDD Test Suite for User Story #1: Budget Range Support
    Tests acceptance criteria:
    1. min budget only -> lower bound
    2. max budget only -> upper bound
    3. min and max budget -> bounded range
    """
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # 1. Test only maximum budget ($2,200 max)
        payload_max_only = {
            "family_members": [
                {"name": "Adult 1", "age": 35, "role": "Adult", "likes": ["history_culture", "nature"]},
                {"name": "Child", "age": 7, "role": "Child", "likes": ["nature"]}
            ],
            "origin_city": "Chicago (ORD)",
            "duration_days": 3,
            "budget_max": 2200
        }

        res_max = await client.post("/api/recommendations", json=payload_max_only)
        assert res_max.status_code == 200, f"Expected 200, got {res_max.status_code}: {res_max.text}"
        data_max = res_max.json()
        assert "budget_summary" in data_max, f"Missing budget_summary: {data_max}"
        realistic_cost_max = data_max["budget_summary"]["total_budget_range"]["realistic"]
        assert realistic_cost_max <= 2300, f"Expected total budget <= 2200 (+tolerance), got {realistic_cost_max} (Dest: {data_max['destination']['name']})"
        print(f"[PASS] Test Max Budget Only Passed (Requested Max: $2,200, Selected: {data_max['destination']['name']}, Result: ${realistic_cost_max})")

        # 2. Test only minimum budget ($5,500 min)
        payload_min_only = {
            "family_members": [
                {"name": "Adult 1", "age": 38, "role": "Adult", "likes": ["luxury", "food_culinary"]},
                {"name": "Adult 2", "age": 36, "role": "Adult", "likes": ["beaches", "relaxing"]}
            ],
            "origin_city": "Chicago (ORD)",
            "duration_days": 7,
            "budget_min": 5500
        }

        res_min = await client.post("/api/recommendations", json=payload_min_only)
        assert res_min.status_code == 200, f"Expected 200, got {res_min.status_code}: {res_min.text}"
        data_min = res_min.json()
        assert "budget_summary" in data_min, f"Missing budget_summary: {data_min}"
        realistic_cost_min = data_min["budget_summary"]["total_budget_range"]["realistic"]
        assert realistic_cost_min >= 5400, f"Expected total budget >= 5500 (-tolerance), got {realistic_cost_min} (Dest: {data_min['destination']['name']})"
        print(f"[PASS] Test Min Budget Only Passed (Requested Min: $5,500, Selected: {data_min['destination']['name']}, Result: ${realistic_cost_min})")

        # 3. Test explicit bounded range ($3,000 to $4,800)
        payload_bounded = {
            "family_members": [
                {"name": "Parent", "age": 40, "role": "Adult", "likes": ["history_culture", "food_culinary"]},
                {"name": "Teen", "age": 14, "role": "Teen", "likes": ["adventure", "theme_parks"]}
            ],
            "origin_city": "Chicago (ORD)",
            "duration_days": 5,
            "budget_min": 3000,
            "budget_max": 4800
        }

        res_bounded = await client.post("/api/recommendations", json=payload_bounded)
        assert res_bounded.status_code == 200, f"Expected 200, got {res_bounded.status_code}: {res_bounded.text}"
        data_bounded = res_bounded.json()
        assert "budget_summary" in data_bounded, f"Missing budget_summary: {data_bounded}"
        realistic_cost_bounded = data_bounded["budget_summary"]["total_budget_range"]["realistic"]
        assert 2900 <= realistic_cost_bounded <= 4900, f"Expected total budget within [$3000, $4800] (+tolerance), got {realistic_cost_bounded} (Dest: {data_bounded['destination']['name']})"
        print(f"[PASS] Test Bounded Range Passed (Requested: $3,000 - $4,800, Selected: {data_bounded['destination']['name']}, Result: ${realistic_cost_bounded})")

if __name__ == "__main__":
    asyncio.run(test_budget_range_support())
    print("\nALL TDD BUDGET RANGE TESTS COMPLETED!")
