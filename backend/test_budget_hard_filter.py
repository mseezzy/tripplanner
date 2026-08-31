import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))
sys.path.insert(0, os.path.dirname(__file__))

from app.core.scoring import calculate_destination_score
from app.api.routes import get_recommendations, RecommendationRequest, FamilyMember

def test_calculate_destination_score_hard_filter_max_budget():
    """
    Acceptance Criteria:
    - Only recommend locations when Realistic Standard Cost <= maximum budget (if specified)
    - Serengeti & Zanzibar ($8,747) must be rejected with budget_violation=True and match_score <= 0 when budget_max=$2,000
    """
    expensive_dest = {
        "id": "serengeti_zanzibar",
        "name": "Serengeti & Zanzibar, Tanzania",
        "target_age_groups": ["adults", "teens"],
        "primary_categories": ["wildlife", "safari", "nature"],
        "flight_base_usd": {"avg": 1450},
        "lodging_daily_usd": {"family_suite": 480},
        "daily_food_per_person_usd": 65,
        "local_transport_daily_usd": 85
    }
    family = [{"name": "Adult", "age": 35}, {"name": "Teen", "age": 15}]
    
    score_info = calculate_destination_score(
        destination=expensive_dest,
        family_members=family,
        likes=["wildlife", "safari"],
        dislikes=[],
        budget_max=2000,
        duration_days=7
    )
    
    assert score_info.get("budget_violation") is True, f"Expected budget_violation=True, got {score_info}"
    assert score_info["match_score"] <= 0, f"Expected match_score <= 0, got {score_info['match_score']}"
    assert any("exceeds maximum budget" in r.lower() for r in score_info["reasons"])


def test_calculate_destination_score_hard_filter_min_budget():
    """
    Acceptance Criteria:
    - Only recommend locations when Realistic Standard Cost >= minimum budget (if specified)
    """
    budget_dest = {
        "id": "wisconsin_dells",
        "name": "Wisconsin Dells, WI",
        "target_age_groups": ["kids", "tweens", "teens", "adults"],
        "primary_categories": ["water_parks", "theme_parks"],
        "flight_base_usd": {"avg": 120},
        "lodging_daily_usd": {"family_suite": 150},
        "daily_food_per_person_usd": 35,
        "local_transport_daily_usd": 25
    }
    family = [{"name": "Adult", "age": 35}, {"name": "Child", "age": 8}]
    
    score_info = calculate_destination_score(
        destination=budget_dest,
        family_members=family,
        likes=["water_parks"],
        dislikes=[],
        budget_min=6000,
        duration_days=3
    )
    
    assert score_info.get("budget_violation") is True, f"Expected budget_violation=True, got {score_info}"
    assert score_info["match_score"] <= 0, f"Expected match_score <= 0, got {score_info['match_score']}"
    assert any("below requested minimum" in r.lower() for r in score_info["reasons"])


@pytest.mark.asyncio
async def test_recommendations_endpoint_excludes_overbudget_destinations():
    """
    Integration test:
    When user requests maximum budget of $2,000 with wildlife/nature interests,
    Serengeti should NOT be recommended. Only destinations fitting under $2,000 must be returned.
    """
    req = RecommendationRequest(
        family_members=[
            FamilyMember(name="Adult 1", age=35),
            FamilyMember(name="Child 1", age=9)
        ],
        likes=["wildlife", "nature", "safari"],
        dislikes=[],
        duration_days=4,
        budget_max=2000,
        origin_city="Chicago (ORD)"
    )
    
    res = await get_recommendations(req)
    primary_name = res["destination"]["name"]
    assert "Serengeti" not in primary_name, f"Serengeti was recommended despite $2000 max budget! Got: {primary_name}"
    
    realistic_total = res["budget_summary"]["total_budget_range"]["realistic"]
    assert realistic_total <= 2500, f"Realistic total ${realistic_total} exceeded budget limit"


@pytest.mark.asyncio
async def test_recommendations_endpoint_bounded_range():
    """
    Integration test:
    When user requests budget range $3,000 - $6,000,
    the returned destination realistic budget must fit within the range.
    """
    req = RecommendationRequest(
        family_members=[
            FamilyMember(name="Adult 1", age=38),
            FamilyMember(name="Adult 2", age=36),
            FamilyMember(name="Teen", age=14)
        ],
        likes=["history", "culture", "sightseeing"],
        dislikes=[],
        duration_days=5,
        budget_min=3000,
        budget_max=7000,
        origin_city="New York (JFK)"
    )
    
    res = await get_recommendations(req)
    primary_name = res["destination"]["name"]
    realistic_total = res["budget_summary"]["total_budget_range"]["realistic"]
    assert realistic_total >= 2500, f"Realistic total ${realistic_total} was below min range"
    assert realistic_total <= 7500, f"Realistic total ${realistic_total} was above max range"
