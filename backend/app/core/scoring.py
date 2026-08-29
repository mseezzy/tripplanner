from typing import List, Dict, Any

def get_age_group(age: int) -> str:
    if age <= 3:
        return "toddlers"
    elif age <= 8:
        return "kids"
    elif age <= 12:
        return "tweens"
    elif age <= 17:
        return "teens"
    else:
        return "adults"

def calculate_destination_score(
    destination: Dict[str, Any],
    family_members: List[Dict[str, Any]],
    likes: List[str],
    dislikes: List[str],
    budget_tier: str = "moderate"
) -> Dict[str, Any]:
    score = 70.0  # Base score
    reasons: List[str] = []

    # 1. Age group compatibility
    family_age_groups = [get_age_group(m.get("age", 25)) for m in family_members]
    dest_target_ages = destination.get("target_age_groups", [])

    age_matches = sum(1 for ag in family_age_groups if ag in dest_target_ages)
    age_ratio = age_matches / max(len(family_age_groups), 1)
    age_score_delta = (age_ratio - 0.5) * 20
    score += age_score_delta

    if "toddlers" in family_age_groups:
        if destination.get("stroller_friendly", False):
            score += 8
            reasons.append("Stroller-friendly and accessible for toddlers")
        else:
            score -= 10
            reasons.append("Challenging terrain with strollers")

    if "teens" in family_age_groups:
        if any(cat in ["theme_parks", "adventure", "water_parks"] for cat in destination.get("primary_categories", [])):
            score += 8
            reasons.append("Exciting attractions and thrills for teens")

    # 2. Likes / Interests alignment
    dest_categories = destination.get("primary_categories", [])
    like_matches = []
    for like in likes:
        like_norm = like.lower().replace(" ", "_").replace("&", "").strip()
        for cat in dest_categories:
            if like_norm in cat or cat in like_norm:
                like_matches.append(like)
                score += 7

    if like_matches:
        reasons.append(f"Matches family interests: {', '.join(set(like_matches))}")

    # 3. Dislikes & constraints
    for dislike in dislikes:
        dis_norm = dislike.lower()
        if "crowd" in dis_norm and destination.get("crowd_level") == "high":
            score -= 12
            reasons.append("High crowd levels (matches dislike)")
        if "heat" in dis_norm and destination.get("climate_type") in ["tropical", "subtropical", "arid"]:
            score -= 8
            reasons.append("Warm/hot climate (matches dislike)")
        if "hiking" in dis_norm and "hiking" in dest_categories:
            score -= 6

    # 4. Budget alignment
    dest_avg_lodging = destination.get("lodging_daily_usd", {}).get("family_suite", 250)
    if budget_tier == "budget" and dest_avg_lodging > 300:
        score -= 10
    elif budget_tier == "luxury" and dest_avg_lodging > 300:
        score += 5

    # Normalize between 50 and 99
    final_score = int(max(55, min(99, score)))

    return {
        "match_score": final_score,
        "score_reasons": reasons[:4],
        "age_suitability": f"{int(age_ratio * 100)}% family age match"
    }

def filter_and_rank_activities(
    activities: List[Dict[str, Any]],
    destination_id: str,
    family_members: List[Dict[str, Any]],
    likes: List[str],
    dislikes: List[str]
) -> List[Dict[str, Any]]:
    dest_activities = [a for a in activities if a.get("destination_id") == destination_id]
    ages = [m.get("age", 25) for m in family_members]
    min_family_age = min(ages) if ages else 0
    family_age_groups = [get_age_group(a) for a in ages]

    ranked = []
    for act in dest_activities:
        act_score = 70.0
        act_target_ages = act.get("target_ages", [])

        # Check if safe for youngest child
        if act.get("min_age", 0) <= min_family_age:
            act_score += 15
        else:
            act_score -= 25

        # Check age group overlap
        overlap = any(ag in act_target_ages for ag in family_age_groups)
        if overlap:
            act_score += 10

        # Likes boost
        act_cat = act.get("category", "")
        for like in likes:
            if like.lower() in act_cat.lower() or any(like.lower() in lbl.lower() for lbl in act.get("labels", [])):
                act_score += 10

        act_copy = dict(act)
        act_copy["relevance_score"] = int(act_score)
        
        # Build dynamic age label
        if act.get("min_age", 0) == 0:
            act_copy["family_tag"] = "Great for All Ages"
        elif "toddlers" in act_target_ages:
            act_copy["family_tag"] = "Toddler & Young Child Friendly"
        elif "teens" in act_target_ages:
            act_copy["family_tag"] = "Teen & Tween Favorite"
        else:
            act_copy["family_tag"] = "Family Adventure"

        ranked.append(act_copy)

    ranked.sort(key=lambda x: x["relevance_score"], reverse=True)
    return ranked
