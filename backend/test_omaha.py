import asyncio
from app.api.routes import get_recommendations, RecommendationRequest, FamilyMember

async def main():
    req = RecommendationRequest(
        origin_city="Omaha (OMA)",
        budget_tier="budget",
        family_members=[
            FamilyMember(name="Parent 1", age=38, likes=["food_culinary", "science_museums"]),
            FamilyMember(name="Parent 2", age=36, likes=["relaxing", "theme_parks"]),
            FamilyMember(name="Child 1", age=8, likes=["theme_parks", "animals_wildlife"]),
            FamilyMember(name="Toddler", age=2, likes=["animals_wildlife"])
        ],
        likes=["theme_parks", "science_museums", "animals_wildlife"],
        dislikes=[]
    )
    res = await get_recommendations(req)
    print("\n--- TOP RANKED VACATIONS FOR OMAHA (OMA) ON AN ECONOMY BUDGET ---")
    for idx, d in enumerate(res["all_ranked_destinations"][:8]):
        print(f"{idx+1}. {d['name']} - Score: {d['match_score']}%")
        print(f"   Reasons: {d.get('score_reasons', [])}")

if __name__ == "__main__":
    asyncio.run(main())
