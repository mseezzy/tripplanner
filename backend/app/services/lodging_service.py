from typing import Dict, Any, List

def calculate_lodging_estimates(
    destination: Dict[str, Any],
    family_members: List[Dict[str, Any]],
    duration_nights: int = 4,
    budget_tier: str = "moderate"
) -> Dict[str, Any]:
    prices = destination.get("lodging_daily_usd", {
        "budget_inn": 100,
        "vacation_rental": 190,
        "family_suite": 260,
        "luxury_resort": 500
    })
    
    num_people = max(len(family_members), 1)
    needs_extra_beds = num_people > 4

    # Generate options tailored for families
    options = [
        {
            "id": "opt-vacation-home",
            "name": f"Spacious {3 if needs_extra_beds else 2}-Bedroom Vacation Home / Villa",
            "category": "Vacation Rental (Airbnb / VRBO)",
            "nightly_rate_usd": prices["vacation_rental"] + (40 if needs_extra_beds else 0),
            "total_trip_usd": (prices["vacation_rental"] + (40 if needs_extra_beds else 0)) * duration_nights,
            "rating": 4.88,
            "reviews_count": 142,
            "family_amenities": [
                "Full Kitchen (save on meals)",
                "Washer & Dryer in unit",
                "Private Patio / Backyard",
                "Self Check-in",
                "Crib & High Chair on request"
            ],
            "bed_layout": f"{2 if not needs_extra_beds else 3} Queen Beds + 2 Twin Bunks",
            "best_for": "Families who want space, home cooking, and laundry"
        },
        {
            "id": "opt-family-suite",
            "name": "Family Resort Suite with Kid Water Playground",
            "category": "Resort / Hotel Suite",
            "nightly_rate_usd": prices["family_suite"],
            "total_trip_usd": prices["family_suite"] * duration_nights,
            "rating": 4.75,
            "reviews_count": 310,
            "family_amenities": [
                "Complimentary Hot Breakfast",
                "Heated Pool & Splash Pad",
                "Kids Club & Arcade Room",
                "Shuttle Service to Key Attractions",
                "Mini Fridge & Microwave"
            ],
            "bed_layout": "2 Queen Beds + Pull-out Sofa Sleeper",
            "best_for": "Stress-free resort amenities, pools, and easy breakfasts"
        },
        {
            "id": "opt-budget-inn",
            "name": "Comfort Inn & Suites (Connecting Rooms)",
            "category": "Budget-Friendly Hotel",
            "nightly_rate_usd": prices["budget_inn"] * (2 if needs_extra_beds else 1),
            "total_trip_usd": (prices["budget_inn"] * (2 if needs_extra_beds else 1)) * duration_nights,
            "rating": 4.42,
            "reviews_count": 265,
            "family_amenities": [
                "Free Hot Waffle Breakfast",
                "Indoor Heated Pool",
                "Free Parking & High-Speed WiFi",
                "24/7 Front Desk"
            ],
            "bed_layout": "2 Double/Queen Beds",
            "best_for": "Value-focused family budget optimization"
        },
        {
            "id": "opt-luxury-resort",
            "name": "Luxury Ocean/Mountain View Spa & Family Resort",
            "category": "5-Star Luxury Resort",
            "nightly_rate_usd": prices["luxury_resort"],
            "total_trip_usd": prices["luxury_resort"] * duration_nights,
            "rating": 4.93,
            "reviews_count": 520,
            "family_amenities": [
                "Private Beach / Mountain Access",
                "Full-service Spa & Concierge",
                "Children's Camp & Babysitting",
                "Fine Dining & Room Service",
                "Luxury Linens & Bathrobes"
            ],
            "bed_layout": "Multi-room Executive Suite with Balcony",
            "best_for": "Ultimate comfort, pampered service, and top-tier amenities"
        }
    ]

    # Price range summary
    low_daily = min(opt["nightly_rate_usd"] for opt in options)
    avg_daily = prices["family_suite"]
    peak_daily = max(opt["nightly_rate_usd"] for opt in options)

    return {
        "price_range": {
            "low_per_night": low_daily,
            "avg_per_night": avg_daily,
            "peak_per_night": peak_daily,
            "total_trip_low": low_daily * duration_nights,
            "total_trip_avg": avg_daily * duration_nights,
            "total_trip_peak": peak_daily * duration_nights
        },
        "duration_nights": duration_nights,
        "options": options,
        "family_lodging_tip": "Booking a vacation rental with a full kitchen can save $100-$150/day on family breakfasts and dinners."
    }
