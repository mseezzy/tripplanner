import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))
sys.path.insert(0, os.path.dirname(__file__))

from app.api.routes import get_recommendations, RecommendationRequest, FamilyMember

@pytest.mark.asyncio
async def test_zero_or_negative_scores_are_excluded_from_all_ranked_destinations():
    """
    Acceptance Criteria (Story #3):
    - Locations that have a recommendation score of <= 0% should not be displayed in all_ranked_destinations.
    """
    req = RecommendationRequest(
        family_members=[
            FamilyMember(name="Adult 1", age=35),
            FamilyMember(name="Teen", age=15)
        ],
        likes=["water_parks", "theme_parks"],
        dislikes=["crowds", "heat"],
        duration_days=4,
        budget_max=2500,
        origin_city="Chicago (ORD)"
    )

    res = await get_recommendations(req)
    all_ranked = res.get("all_ranked_destinations", [])
    
    # Assert that all items in all_ranked_destinations have match_score > 0
    assert len(all_ranked) > 0, "Expected at least one valid destination"
    for dest in all_ranked:
        score = dest.get("match_score", 0)
        assert score > 0, f"Found destination '{dest.get('name')}' with non-positive score ({score}) in all_ranked_destinations"
        assert dest.get("budget_violation", False) is False, f"Found budget violating destination in all_ranked_destinations: {dest.get('name')}"


@pytest.mark.asyncio
async def test_no_budget_matches_returns_indicator_and_near_budget_alternatives():
    """
    Acceptance Criteria (Story #3):
    - If no locations meet criteria, display an indicator that no trips are within budget,
      but provide a list of places that could be within budget with an additional budget allocation.
    """
    # Extremely low budget of $400 for a family of 4 (impossible to meet with flights & lodging)
    req = RecommendationRequest(
        family_members=[
            FamilyMember(name="Adult 1", age=35),
            FamilyMember(name="Adult 2", age=34),
            FamilyMember(name="Child 1", age=8),
            FamilyMember(name="Child 2", age=5)
        ],
        likes=["nature", "beaches"],
        dislikes=[],
        duration_days=4,
        budget_max=400,
        origin_city="Chicago (ORD)"
    )

    res = await get_recommendations(req)
    
    # Must flag no_budget_matches
    assert res.get("no_budget_matches") is True, f"Expected no_budget_matches=True for $400 budget, got {res.get('no_budget_matches')}"
    
    # Must provide near_budget_alternatives
    alternatives = res.get("near_budget_alternatives", [])
    assert len(alternatives) > 0, f"Expected near_budget_alternatives list, got {alternatives}"
    
    # Each alternative must specify additional_budget_needed > 0
    for alt in alternatives:
        assert "additional_budget_needed" in alt, f"Missing additional_budget_needed in {alt}"
        assert alt["additional_budget_needed"] > 0, f"Expected positive additional budget needed, got {alt['additional_budget_needed']}"
        assert alt["estimated_cost"] > 400


@pytest.mark.asyncio
async def test_normal_budget_request_has_no_zero_score_destinations():
    """
    Regression check:
    Normal budget range request ($3000-$5000) does not return zero or negative scores in all_ranked_destinations.
    """
    req = RecommendationRequest(
        family_members=[
            FamilyMember(name="Adult", age=30),
            FamilyMember(name="Child", age=6)
        ],
        likes=["nature", "history"],
        dislikes=[],
        duration_days=5,
        budget_min=2000,
        budget_max=5000,
        origin_city="Chicago (ORD)"
    )

    res = await get_recommendations(req)
    assert res.get("no_budget_matches") is False or res.get("no_budget_matches") is None
    all_ranked = res.get("all_ranked_destinations", [])
    for dest in all_ranked:
        assert dest.get("match_score", 0) > 0
