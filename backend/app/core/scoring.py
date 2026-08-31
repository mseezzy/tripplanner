from typing import List, Dict, Any, Optional

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

def calculate_member_enjoyment(
    destination: Dict[str, Any],
    member: Dict[str, Any],
    dislikes: List[str]
) -> Dict[str, Any]:
    name = member.get("name", "Family Member")
    age = member.get("age", 25)
    ag = get_age_group(age)
    likes = member.get("likes", [])
    
    score = 75.0
    dest_categories = destination.get("primary_categories", [])
    dest_target_ages = destination.get("target_age_groups", [])

    # 1. Age appropriateness
    if ag in dest_target_ages:
        score += 10
    else:
        score -= 8

    if ag == "toddlers":
        if destination.get("stroller_friendly", False):
            score += 10
            highlight = "Stroller-friendly paved paths and gentle shallow splash areas"
        else:
            score -= 12
            highlight = "Uneven terrain may require carrier rather than stroller"
    elif ag == "kids":
        highlight = "Interactive kid discovery zones, character meets & easy pacing"
    elif ag == "tweens":
        highlight = "Hands-on exploration, water fun & engaging family tours"
    elif ag == "teens":
        if any(c in ["theme_parks", "adventure", "water_parks"] for c in dest_categories):
            score += 12
            highlight = "Exciting thrill attractions, outdoor sports & freedom to explore"
        else:
            highlight = "Scenic sightseeing, food sampling & cultural photo spots"
    else: # adults
        highlight = "Relaxing resort atmosphere, scenic vistas & quality dining"

    # 2. Individual Likes Match
    matched_likes = []
    for lk in likes:
        norm_like = lk.lower().replace(" ", "_")
        for cat in dest_categories:
            if norm_like in cat or cat in norm_like:
                matched_likes.append(lk.replace("_", " ").title())
                score += 8

    if matched_likes:
        highlight = f"Excited for {', '.join(matched_likes[:2])} and fun activities"

    # 3. Dislikes / Weather Penalty
    for dis in dislikes:
        if "heat" in dis.lower() and destination.get("climate_type") in ["tropical", "subtropical", "arid"]:
            score -= 6
        if "crowd" in dis.lower() and destination.get("crowd_level") == "high":
            score -= 8

    final_score = int(max(60, min(99, score)))

    sentiment = "😍 Super Excited" if final_score >= 90 else ("😊 Very Happy" if final_score >= 80 else "👍 Good Time")

    return {
        "name": name,
        "age": age,
        "age_group": ag,
        "enjoyment_score": final_score,
        "sentiment": sentiment,
        "highlight": highlight,
        "matched_interests": matched_likes
    }

import math

def calculate_haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 3958.8  # Earth radius in miles
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
    c = 2 * math.asin(math.sqrt(max(0.0, min(1.0, a))))
    return r * c

def calculate_destination_score(
    destination: Dict[str, Any],
    family_members: List[Dict[str, Any]],
    likes: List[str],
    dislikes: List[str],
    budget_tier: str = "moderate",
    origin_coords: Optional[Dict[str, float]] = None,
    budget_min: Optional[int] = None,
    budget_max: Optional[int] = None,
    duration_days: int = 5
) -> Dict[str, Any]:
    score = 70.0  # Base score
    reasons: List[str] = []

    # Calculate enjoyment meter for each family member
    member_enjoyment = [
        calculate_member_enjoyment(destination, m, dislikes)
        for m in family_members
    ]

    # Aggregate both individual member likes and shared likes
    all_individual_likes = []
    for m in family_members:
        all_individual_likes.extend(m.get("likes", []))
    combined_likes = list(set(likes + all_individual_likes))

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
    for like in combined_likes:
        like_norm = like.lower().replace(" ", "_").replace("&", "").strip()
        for cat in dest_categories:
            if like_norm in cat or cat in like_norm:
                like_matches.append(like)
                score += 6

    if like_matches:
        reasons.append(f"Matches family interests: {', '.join(list(set(like_matches))[:3])}")

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

    # 4. Explicit Budget Range Evaluation (Story #1)
    num_family = max(len(family_members), 1)
    dur = max(duration_days, 1)
    flight_per_person = destination.get("flight_base_usd", {}).get("avg", 450)
    lodging_daily = destination.get("lodging_daily_usd", {}).get("family_suite", destination.get("lodging_daily_usd", {}).get("vacation_rental", 200))
    food_daily = destination.get("daily_food_per_person_usd", 45) * num_family
    transport_daily = destination.get("local_transport_daily_usd", 35)

    est_trip_cost = (flight_per_person * num_family) + (lodging_daily * dur) + (food_daily * dur) + (transport_daily * dur)

    if budget_min is not None or budget_max is not None:
        if budget_min is not None and budget_max is not None:
            if budget_min <= est_trip_cost <= budget_max:
                score += 25
                reasons.insert(0, f"Fits your custom budget range (${budget_min:,} - ${budget_max:,})")
            elif est_trip_cost > budget_max:
                overage_pct = (est_trip_cost - budget_max) / budget_max
                penalty = min(50, int(30 + overage_pct * 30))
                score -= penalty
                reasons.append(f"Estimated trip cost (~${est_trip_cost:,}) exceeds maximum budget of ${budget_max:,}")
            elif est_trip_cost < budget_min:
                underage_pct = (budget_min - est_trip_cost) / budget_min
                penalty = min(40, int(25 + underage_pct * 25))
                score -= penalty
                reasons.append(f"Estimated trip cost (~${est_trip_cost:,}) is below requested minimum of ${budget_min:,}")
        elif budget_max is not None:
            if est_trip_cost <= budget_max:
                score += 20
                reasons.insert(0, f"Under maximum budget limit of ${budget_max:,}")
            else:
                overage_pct = (est_trip_cost - budget_max) / budget_max
                penalty = min(50, int(30 + overage_pct * 30))
                score -= penalty
                reasons.append(f"Estimated trip cost (~${est_trip_cost:,}) exceeds maximum budget of ${budget_max:,}")
        elif budget_min is not None:
            if est_trip_cost >= budget_min:
                score += 20
                reasons.insert(0, f"Meets minimum budget target of ${budget_min:,}")
            else:
                underage_pct = (budget_min - est_trip_cost) / budget_min
                penalty = min(45, int(25 + underage_pct * 25))
                score -= penalty
                reasons.append(f"Estimated trip cost (~${est_trip_cost:,}) is below requested minimum of ${budget_min:,}")
    else:
        # Fallback to standard budget tier logic
        dest_coords = destination.get("coordinates", {})
        dest_avg_lodging = destination.get("lodging_daily_usd", {}).get("family_suite", 250)
        
        if origin_coords and dest_coords and "lat" in dest_coords and "lat" in origin_coords:
            dist_miles = calculate_haversine_miles(
                origin_coords["lat"], origin_coords["lng"],
                dest_coords["lat"], dest_coords["lng"]
            )
            if budget_tier in ["budget", "economy"]:
                if dist_miles <= 550:
                    score += 24
                    reasons.insert(0, f"Regional / short-haul distance (~{int(dist_miles)} miles) - optimal for economy budget")
                elif dist_miles <= 1200:
                    score += 10
                elif dist_miles > 2800:
                    score -= 28  # Heavy penalty for intercontinental flights on a budget
                    reasons.append("Long-haul international flight cost exceeds budget tier")
            elif budget_tier == "luxury":
                if dist_miles > 2500 or dest_avg_lodging > 300:
                    score += 10
        else:
            if budget_tier in ["budget", "economy"] and dest_avg_lodging > 300:
                score -= 15
            elif budget_tier == "luxury" and dest_avg_lodging > 300:
                score += 8

    # Normalize between 50 and 99
    final_score = int(max(55, min(99, score)))

    return {
        "match_score": final_score,
        "score_reasons": reasons[:4],
        "age_suitability": f"{int(age_ratio * 100)}% family age match",
        "member_enjoyment": member_enjoyment,
        "estimated_trip_cost": est_trip_cost
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
        act_cat = act.get("category", "")
        act_labels = [lbl.lower() for lbl in act.get("labels", [])]

        # Identify which specific family members match this activity
        matching_members = []
        for m in family_members:
            m_name = m.get("name", "Traveler")
            m_age = m.get("age", 25)
            m_ag = get_age_group(m_age)
            m_likes = m.get("likes", [])

            # Check if member age matches activity
            age_ok = m_age >= act.get("min_age", 0) and (m_ag in act_target_ages or not act_target_ages)

            # Check if member's individual interest matches activity
            member_interest_match = any(
                lk.lower().replace(" ", "_") in act_cat.lower() or 
                any(lk.lower() in lbl for lbl in act_labels)
                for lk in m_likes
            )

            if member_interest_match and age_ok:
                matching_members.append(f"{m_name}")
                act_score += 15
            elif age_ok and m_ag in act_target_ages:
                act_score += 4

        # Check shared likes boost
        for like in likes:
            if like.lower().replace(" ", "_") in act_cat.lower() or any(like.lower() in lbl for lbl in act_labels):
                act_score += 10

        # Safety for youngest member
        if act.get("min_age", 0) <= min_family_age:
            act_score += 10
        else:
            act_score -= 20

        act_copy = dict(act)
        act_copy["relevance_score"] = int(act_score)
        act_copy["matched_members"] = matching_members
        
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
