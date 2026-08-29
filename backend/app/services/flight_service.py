from typing import Dict, Any, List

def calculate_flight_estimates(
    origin_city: str,
    destination: Dict[str, Any],
    family_members: List[Dict[str, Any]],
    duration_days: int = 5
) -> Dict[str, Any]:
    base_usd = destination.get("flight_base_usd", {"low": 220, "avg": 360, "peak": 600})
    dest_airport = destination.get("airport_code", "DEST")
    origin_airport = "ORD" if not origin_city else origin_city.upper()[:3]

    num_people = max(len(family_members), 1)
    
    # Calculate price per person
    low_pp = base_usd["low"]
    avg_pp = base_usd["avg"]
    peak_pp = base_usd["peak"]

    # Family total
    low_total = low_pp * num_people
    avg_total = avg_pp * num_people
    peak_total = peak_pp * num_people

    # Major airlines by destination region
    region = destination.get("region", "North America")
    if region == "Europe":
        sample_airlines = ["British Airways", "Virgin Atlantic", "Delta", "United"]
        flight_duration = "7h 45m"
        stops_options = ["1 stop (Economy saver)", "Direct / Non-stop"]
    elif region == "Asia":
        sample_airlines = ["ANA", "Japan Airlines", "United", "Singapore Airlines"]
        flight_duration = "11h 30m"
        stops_options = ["1 stop (Connecting)", "Direct non-stop"]
    elif region == "Central America":
        sample_airlines = ["Copa Airlines", "American Airlines", "Delta"]
        flight_duration = "4h 15m"
        stops_options = ["Direct non-stop", "1 stop"]
    else:
        sample_airlines = ["Southwest (2 free bags)", "Delta Air Lines", "United Airlines", "American Airlines"]
        flight_duration = "2h 45m - 4h 30m"
        stops_options = ["Direct / Non-stop", "1 Quick layover"]

    options = [
        {
            "tier": "Budget Carrier / Economy Saver",
            "airline": sample_airlines[0],
            "price_per_person": low_pp,
            "total_family_price": low_total,
            "type": stops_options[0],
            "duration": flight_duration,
            "baggage_policy": "Carry-on included, checked bags $35-$40",
            "family_seating_tip": "Check in exactly 24h in advance or select seats together during booking."
        },
        {
            "tier": "Standard Main Cabin (Recommended)",
            "airline": sample_airlines[1] if len(sample_airlines) > 1 else sample_airlines[0],
            "price_per_person": avg_pp,
            "total_family_price": avg_total,
            "type": "Direct / Non-stop",
            "duration": flight_duration,
            "baggage_policy": "1 free personal + 1 carry-on + free seat assignment together",
            "family_seating_tip": "Airline guarantees free adjacent seating for children under 13."
        },
        {
            "tier": "Flexible / Premium Economy",
            "airline": sample_airlines[2] if len(sample_airlines) > 2 else sample_airlines[0],
            "price_per_person": peak_pp,
            "total_family_price": peak_total,
            "type": "Direct / Priority Boarding",
            "duration": flight_duration,
            "baggage_policy": "2 free checked bags per passenger + early family boarding",
            "family_seating_tip": "Priority family boarding allows stress-free stroller gate checking."
        }
    ]

    return {
        "origin_code": origin_airport,
        "destination_code": dest_airport,
        "price_range": {
            "low_per_person": low_pp,
            "avg_per_person": avg_pp,
            "peak_per_person": peak_pp,
            "total_family_low": low_total,
            "total_family_avg": avg_total,
            "total_family_peak": peak_total
        },
        "options": options,
        "family_travel_tip": "Book flights on Tuesdays/Wednesdays 6-8 weeks in advance for lowest family fares."
    }
