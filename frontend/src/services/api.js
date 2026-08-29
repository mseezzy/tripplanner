// API service with live backend connection and resilient fallback

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fallbackDestinations = [
  {
    id: "orlando-fl",
    name: "Orlando, Florida",
    country: "United States",
    region: "North America",
    coordinates: { lat: 28.5383, lng: -81.3792 },
    airport_code: "MCO",
    hero_image: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?auto=format&fit=crop&w=1000&q=80",
    short_description: "The world's premier family entertainment capital featuring Walt Disney World, Universal Studios, and endless interactive water parks.",
    primary_categories: ["theme_parks", "entertainment", "water_parks", "relaxing"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "moderate",
    best_seasons: ["Spring", "Autumn", "Winter"],
    stroller_friendly: true,
    crowd_level: "high",
    climate_type: "subtropical",
    flight_base_usd: { low: 180, avg: 320, peak: 550 },
    lodging_daily_usd: { budget_inn: 95, vacation_rental: 185, family_suite: 240, luxury_resort: 480 },
    daily_food_per_person_usd: 45,
    local_transport_daily_usd: 40,
    highlight_features: [
      "World-class theme parks (Magic Kingdom, Islands of Adventure, Epcot)",
      "Hundreds of family resort pools and lazy rivers",
      "Kennedy Space Center day trip proximity",
      "Stroller-friendly infrastructure everywhere"
    ]
  },
  {
    id: "san-diego-ca",
    name: "San Diego, California",
    country: "United States",
    region: "North America",
    coordinates: { lat: 32.7157, lng: -117.1611 },
    airport_code: "SAN",
    hero_image: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1000&q=80",
    short_description: "Perfect year-round coastal weather, renowned world-class zoo, Balboa Park museums, and family-friendly beaches like La Jolla Shores.",
    primary_categories: ["animals_wildlife", "beaches", "science_museums", "nature"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "relaxed",
    best_seasons: ["Spring", "Summer", "Autumn", "Winter"],
    stroller_friendly: true,
    crowd_level: "moderate",
    climate_type: "mediterranean",
    flight_base_usd: { low: 190, avg: 340, peak: 580 },
    lodging_daily_usd: { budget_inn: 120, vacation_rental: 220, family_suite: 280, luxury_resort: 520 },
    daily_food_per_person_usd: 50,
    local_transport_daily_usd: 35,
    highlight_features: [
      "San Diego Zoo and Safari Park",
      "Gentle wave beaches at Coronado and La Jolla",
      "USS Midway Aircraft Carrier interactive museum",
      "Legoland California nearby in Carlsbad"
    ]
  },
  {
    id: "yellowstone-wy",
    name: "Yellowstone & Grand Teton, Wyoming",
    country: "United States",
    region: "North America",
    coordinates: { lat: 44.4280, lng: -110.5885 },
    airport_code: "JAC",
    hero_image: "https://images.unsplash.com/photo-1533497197925-c64639906669?auto=format&fit=crop&w=1000&q=80",
    short_description: "America's first national park packed with geysers, grizzly bears, bison herds, thermal hot springs, and dramatic mountain peaks.",
    primary_categories: ["nature", "hiking", "animals_wildlife", "scenery"],
    target_age_groups: ["kids", "tweens", "teens", "adults"],
    pacing: "active",
    best_seasons: ["Summer", "Autumn"],
    stroller_friendly: false,
    crowd_level: "high",
    climate_type: "alpine",
    flight_base_usd: { low: 280, avg: 450, peak: 720 },
    lodging_daily_usd: { budget_inn: 130, vacation_rental: 260, family_suite: 310, luxury_resort: 590 },
    daily_food_per_person_usd: 40,
    local_transport_daily_usd: 65,
    highlight_features: [
      "Old Faithful and Grand Prismatic Spring boardwalks",
      "Lamar Valley wildlife safaris (bison, wolves, elk)",
      "Snake River scenic raft floats for all ages",
      "Junior Ranger educational badge programs"
    ]
  },
  {
    id: "london-uk",
    name: "London, United Kingdom",
    country: "United Kingdom",
    region: "Europe",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    airport_code: "LHR",
    hero_image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
    short_description: "Historic palaces, world-class free national museums, West End family theatre, and Harry Potter wizarding adventures.",
    primary_categories: ["history_culture", "science_museums", "entertainment", "food_culinary"],
    target_age_groups: ["kids", "tweens", "teens", "adults"],
    pacing: "moderate",
    best_seasons: ["Spring", "Summer", "Autumn"],
    stroller_friendly: true,
    crowd_level: "high",
    climate_type: "temperate",
    flight_base_usd: { low: 480, avg: 750, peak: 1200 },
    lodging_daily_usd: { budget_inn: 140, vacation_rental: 240, family_suite: 320, luxury_resort: 600 },
    daily_food_per_person_usd: 55,
    local_transport_daily_usd: 25,
    highlight_features: [
      "Free entry to Natural History Museum and Science Museum",
      "Tower of London and Crown Jewels with Beefeater tours",
      "Warner Bros. Studio Tour London - Harry Potter",
      "Iconic double-decker buses and Thames River clippers"
    ]
  },
  {
    id: "tokyo-japan",
    name: "Tokyo, Japan",
    country: "Japan",
    region: "Asia",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    airport_code: "HND",
    hero_image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    short_description: "Ultra-modern, incredibly safe, and vibrant city blending cutting-edge tech, anime pop-culture, Tokyo Disney, and ancient shrines.",
    primary_categories: ["science_museums", "theme_parks", "food_culinary", "history_culture"],
    target_age_groups: ["kids", "tweens", "teens", "adults"],
    pacing: "active",
    best_seasons: ["Spring", "Autumn"],
    stroller_friendly: true,
    crowd_level: "high",
    climate_type: "temperate",
    flight_base_usd: { low: 650, avg: 980, peak: 1550 },
    lodging_daily_usd: { budget_inn: 110, vacation_rental: 210, family_suite: 290, luxury_resort: 550 },
    daily_food_per_person_usd: 40,
    local_transport_daily_usd: 20,
    highlight_features: [
      "Tokyo DisneySea & Disneyland Resort",
      "teamLab Planets immersive digital art museum",
      "Ghibli Museum and Akihabara gaming districts",
      "Immaculately clean, kid-friendly public transport"
    ]
  },
  {
    id: "costa-rica",
    name: "Arenal & Manuel Antonio, Costa Rica",
    country: "Costa Rica",
    region: "Central America",
    coordinates: { lat: 9.7489, lng: -83.7534 },
    airport_code: "SJO",
    hero_image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    short_description: "Lush rainforests, active volcano thermal springs, wildlife reserves filled with sloths and monkeys, plus family zipline adventures.",
    primary_categories: ["nature", "animals_wildlife", "adventure", "beaches"],
    target_age_groups: ["kids", "tweens", "teens", "adults"],
    pacing: "active",
    best_seasons: ["Winter", "Spring"],
    stroller_friendly: false,
    crowd_level: "moderate",
    climate_type: "tropical",
    flight_base_usd: { low: 290, avg: 480, peak: 750 },
    lodging_daily_usd: { budget_inn: 85, vacation_rental: 170, family_suite: 220, luxury_resort: 420 },
    daily_food_per_person_usd: 35,
    local_transport_daily_usd: 50,
    highlight_features: [
      "Rainforest hanging bridges and sloth sanctuaries",
      "Volcanic natural hot spring water parks (Baldi / Tabacon)",
      "Manuel Antonio National Park beach and monkey trails",
      "Chocolate making tours and beginner surf schools"
    ]
  },
  {
    id: "cancun-riviera-maya",
    name: "Cancun & Riviera Maya, Mexico",
    country: "Mexico",
    region: "North America",
    coordinates: { lat: 20.6296, lng: -87.0739 },
    airport_code: "CUN",
    hero_image: "https://images.unsplash.com/photo-1512815046278-8bc611c0dc89?auto=format&fit=crop&w=1000&q=80",
    short_description: "Turquoise Caribbean beaches, all-inclusive family eco-parks (Xcaret, Xel-Há), underground cenote swimming, and Mayan ruins.",
    primary_categories: ["beaches", "water_parks", "relaxing", "nature", "history_culture"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "relaxed",
    best_seasons: ["Winter", "Spring", "Autumn"],
    stroller_friendly: true,
    crowd_level: "moderate",
    climate_type: "tropical",
    flight_base_usd: { low: 220, avg: 380, peak: 620 },
    lodging_daily_usd: { budget_inn: 90, vacation_rental: 160, family_suite: 260, luxury_resort: 480 },
    daily_food_per_person_usd: 35,
    local_transport_daily_usd: 30,
    highlight_features: [
      "Xcaret & Xel-Ha all-inclusive eco-archaeological water parks",
      "Crystal clear natural cenote swimming for all skill levels",
      "Calm shallow beach zones in Puerto Morelos and Isla Mujeres",
      "Tulum cliffside ocean ruins"
    ]
  },
  {
    id: "maui-hi",
    name: "Maui & Oahu, Hawaii",
    country: "United States",
    region: "North America",
    coordinates: { lat: 20.7984, lng: -156.3319 },
    airport_code: "OGG",
    hero_image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=1000&q=80",
    short_description: "Tropical paradise with protected sea turtle snorkeling bays, Haleakalā volcanic sunrise, authentic luaus, and scenic coastal road trips.",
    primary_categories: ["beaches", "nature", "relaxing", "adventure", "animals_wildlife"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "relaxed",
    best_seasons: ["Spring", "Summer", "Autumn", "Winter"],
    stroller_friendly: true,
    crowd_level: "moderate",
    climate_type: "tropical",
    flight_base_usd: { low: 350, avg: 580, peak: 950 },
    lodging_daily_usd: { budget_inn: 160, vacation_rental: 290, family_suite: 380, luxury_resort: 680 },
    daily_food_per_person_usd: 55,
    local_transport_daily_usd: 65,
    highlight_features: [
      "Molokini Crater catamaran snorkel trip with green sea turtles",
      "Road to Hana family waterfall discoveries",
      "Kaanapali & Baby Beach calm wading waters",
      "Polynesian Cultural Center and oceanfront luau"
    ]
  }
];

export async function sendDirectEmail(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/share/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend email endpoint unavailable, using client-side mailto:", err);
  }
  return {
    status: 'client_fallback',
    message: 'Opened in your email app.'
  };
}

export async function sendDirectSms(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/share/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend sms endpoint unavailable:", err);
  }
  return { status: 'ready', message: payload.message };
}

// Utility to encode a trip configuration into a shareable URL
export function generateShareableUrl(tripParams) {
  try {
    const compact = {
      m: tripParams.family_members?.map(m => ({ n: m.name, a: m.age, r: m.role, l: m.likes || [] })),
      l: tripParams.likes || [],
      d: tripParams.dislikes || [],
      dur: tripParams.duration_days || 5,
      dest: tripParams.preferred_destination || '',
      stops: tripParams.destinations?.map(s => ({ d: s.destination, dur: s.duration_days, o: s.order })),
      orig: tripParams.origin_city || '',
      b: tripParams.budget_tier || 'moderate'
    };
    const encoded = encodeURIComponent(btoa(JSON.stringify(compact)));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#plan=${encoded}`;
  } catch (e) {
    console.error("Error generating shareable URL:", e);
    return window.location.href;
  }
}

// Utility to decode trip configuration from URL hash
export function parseShareableUrl() {
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('plan=')) {
      const encoded = hash.split('plan=')[1];
      const decoded = JSON.parse(atob(decodeURIComponent(encoded)));
      return {
        family_members: decoded.m?.map(m => ({ name: m.n, age: m.a, role: m.r, likes: m.l || [] })) || [],
        likes: decoded.l || [],
        dislikes: decoded.d || [],
        duration_days: decoded.dur || 5,
        preferred_destination: decoded.dest || '',
        destinations: decoded.stops?.map((s, idx) => ({ id: `stop-${idx}`, destination: s.d, duration_days: s.dur, order: s.o || idx })) || null,
        origin_city: decoded.orig || '',
        budget_tier: decoded.b || 'moderate'
      };
    }
  } catch (e) {
    console.error("Error parsing shareable URL:", e);
  }
  return null;
}

export async function fetchRecommendations(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend API request failed or running standalone, generating client recommendations:", err);
  }

  // Resilient client-side fallback calculation
  return generateClientRecommendations(payload);
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return response.ok;
  } catch {
    return false;
  }
}

function generateClientRecommendations(req) {
  const family = req.family_members && req.family_members.length > 0
    ? req.family_members
    : [{ name: "Adult", age: 35 }, { name: "Child", age: 8 }];
  
  const likes = req.likes || [];
  const dislikes = req.dislikes || [];
  const numPeople = family.length;

  // Process stops
  let stops = [];
  if (req.destinations && req.destinations.length > 0) {
    stops = req.destinations.filter(s => s.destination.trim());
  } else if (req.preferred_destination && req.preferred_destination.trim()) {
    stops = [{ destination: req.preferred_destination.trim(), duration_days: req.duration_days || 5 }];
  } else {
    stops = [{ destination: fallbackDestinations[0].name, duration_days: req.duration_days || 5 }];
  }

  const totalDuration = stops.reduce((sum, s) => sum + (parseInt(s.duration_days, 10) || 3), 0);

  // Score destinations for each stop
  const processedStops = stops.map((stop, stopIdx) => {
    const q = (stop.destination || '').toLowerCase().trim();
    const matched = fallbackDestinations.find(d => 
      d.name.toLowerCase().includes(q) || 
      d.country.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q)
    ) || fallbackDestinations[stopIdx % fallbackDestinations.length];

    const memberEnjoyment = family.map((m) => {
      let mScore = 78;
      const mAge = m.age || 20;
      const mLikes = m.likes || [];
      const mName = m.name || 'Member';

      if (mAge <= 3) {
        if (matched.stroller_friendly) mScore += 14;
        else mScore -= 10;
      } else if (mAge <= 12) {
        mScore += 10;
      } else if (mAge <= 17) {
        if (matched.primary_categories.some(c => ["theme_parks", "adventure", "water_parks"].includes(c))) mScore += 14;
      }

      mLikes.forEach(lk => {
        if (matched.primary_categories.some(cat => cat.includes(lk.replace(' ', '_')))) {
          mScore += 8;
        }
      });

      const finalMScore = Math.min(99, Math.max(65, mScore));
      let highlight = "Great overall experience and easy pacing";
      if (mAge <= 3) highlight = matched.stroller_friendly ? "Stroller-friendly walking and gentle splash zones" : "Uneven paths, best with a carrier";
      else if (mAge <= 12) highlight = "Excited for interactive discovery zones and character meets";
      else if (mAge <= 17) highlight = "Loves thrill rides, adventure sports and photo spots";
      else if (mLikes.length > 0) highlight = `Looking forward to ${mLikes.map(l => l.replace('_', ' ')).slice(0, 2).join(', ')}`;
      else highlight = "Relaxing atmosphere, scenic dining & family time";

      return {
        name: mName,
        age: mAge,
        enjoyment_score: finalMScore,
        sentiment: finalMScore >= 90 ? "😍 Super Excited" : finalMScore >= 80 ? "😊 Very Happy" : "👍 Good Time",
        highlight
      };
    });

    const stopLodgingPrices = matched.lodging_daily_usd;
    const stopDuration = parseInt(stop.duration_days, 10) || 3;

    return {
      stop_number: stopIdx + 1,
      duration_days: stopDuration,
      destination: {
        ...matched,
        match_score: 92,
        score_reasons: [`Matches family interests in ${matched.primary_categories[0]}`],
        member_enjoyment: memberEnjoyment
      },
      lodging: {
        price_range: {
          low_per_night: stopLodgingPrices.budget_inn,
          avg_per_night: stopLodgingPrices.family_suite,
          peak_per_night: stopLodgingPrices.luxury_resort,
          total_trip_low: stopLodgingPrices.budget_inn * stopDuration,
          total_trip_avg: stopLodgingPrices.family_suite * stopDuration,
          total_trip_peak: stopLodgingPrices.luxury_resort * stopDuration,
        },
        duration_nights: stopDuration,
        options: [
          {
            id: `opt-vacation-${stopIdx}`,
            name: `Spacious Family Vacation Rental in ${matched.name.split(',')[0]}`,
            category: "Vacation Rental (Airbnb / VRBO)",
            nightly_rate_usd: stopLodgingPrices.vacation_rental,
            total_trip_usd: stopLodgingPrices.vacation_rental * stopDuration,
            rating: 4.88,
            reviews_count: 120,
            family_amenities: ["Full Kitchen", "Washer & Dryer", "Fenced Yard", "Crib on request"],
            bed_layout: "2 Queen Beds + 2 Twin Bunks",
            best_for: "Family comfort & home-cooked meals"
          },
          {
            id: `opt-resort-${stopIdx}`,
            name: `Family Resort Suite with Splash Pool (${matched.name.split(',')[0]})`,
            category: "Resort / Hotel Suite",
            nightly_rate_usd: stopLodgingPrices.family_suite,
            total_trip_usd: stopLodgingPrices.family_suite * stopDuration,
            rating: 4.76,
            reviews_count: 280,
            family_amenities: ["Free Hot Breakfast", "Heated Pool & Splash Pad", "Kids Club", "Shuttle"],
            bed_layout: "2 Queen Beds + Pull-out Sofa",
            best_for: "Resort amenities & hassle-free breakfast"
          }
        ]
      }
    };
  });

  const primaryDest = processedStops[0].destination;
  const numStops = processedStops.length;

  // Flights
  const flightBase = primaryDest.flight_base_usd;
  const flightLowTotal = flightBase.low * numPeople;
  const flightAvgTotal = flightBase.avg * numPeople;
  const flightPeakTotal = flightBase.peak * numPeople;

  const flights = {
    origin_code: req.origin_city ? req.origin_city.toUpperCase().slice(0, 3) : "ORD",
    destination_code: primaryDest.airport_code,
    price_range: {
      low_per_person: flightBase.low,
      avg_per_person: flightBase.avg,
      peak_per_person: flightBase.peak,
      total_family_low: flightLowTotal,
      total_family_avg: flightAvgTotal,
      total_family_peak: flightPeakTotal,
    },
    options: [
      {
        tier: "Budget Carrier / Economy Saver",
        airline: "Southwest / Economy Saver",
        price_per_person: flightBase.low,
        total_family_price: flightLowTotal,
        type: "1 Quick stop",
        duration: "4h 15m",
        baggage_policy: "Carry-on included, checked bags $35",
        family_seating_tip: "Check in 24h early to get adjacent boarding positions."
      },
      {
        tier: "Standard Main Cabin (Recommended)",
        airline: "Delta / United Main Cabin",
        price_per_person: flightBase.avg,
        total_family_price: flightAvgTotal,
        type: "Direct / Non-stop",
        duration: "3h 10m",
        baggage_policy: "Carry-on + free seat selection together",
        family_seating_tip: "Guaranteed adjacent seating for children under 13."
      },
      {
        tier: "Flexible / Premium Economy",
        airline: "American Airlines Premium",
        price_per_person: flightBase.peak,
        total_family_price: flightPeakTotal,
        type: "Direct / Priority Boarding",
        duration: "3h 05m",
        baggage_policy: "2 free checked bags + early family boarding",
        family_seating_tip: "Priority family boarding enables smooth stroller gate checks."
      }
    ],
    family_travel_tip: "Booking 6-8 weeks ahead typically unlocks the best family fare tiers."
  };

  // Lodging
  const lodgingPrices = primaryDest.lodging_daily_usd;
  const lodging = {
    price_range: {
      low_per_night: lodgingPrices.budget_inn,
      avg_per_night: lodgingPrices.family_suite,
      peak_per_night: lodgingPrices.luxury_resort,
      total_trip_low: lodgingPrices.budget_inn * duration,
      total_trip_avg: lodgingPrices.family_suite * duration,
      total_trip_peak: lodgingPrices.luxury_resort * duration,
    },
    duration_nights: duration,
    options: [
      {
        id: "opt-vacation-home",
        name: "Spacious 2-3 Bedroom Family Vacation Home",
        category: "Vacation Rental (Airbnb / VRBO)",
        nightly_rate_usd: lodgingPrices.vacation_rental,
        total_trip_usd: lodgingPrices.vacation_rental * duration,
        rating: 4.88,
        reviews_count: 120,
        family_amenities: ["Full Kitchen", "Washer & Dryer", "Fenced Yard", "Crib on request"],
        bed_layout: "2 Queen Beds + 2 Twin Bunk Beds",
        best_for: "Spacious family comfort & home-cooked meals"
      },
      {
        id: "opt-family-suite",
        name: "Family Resort Suite with Splash Pool & Arcade",
        category: "Resort / Hotel Suite",
        nightly_rate_usd: lodgingPrices.family_suite,
        total_trip_usd: lodgingPrices.family_suite * duration,
        rating: 4.76,
        reviews_count: 280,
        family_amenities: ["Free Hot Breakfast", "Heated Pool & Splash Pad", "Kids Club", "Shuttle"],
        bed_layout: "2 Queen Beds + Pull-out Sofa",
        best_for: "Resort amenities & hassle-free breakfast"
      },
      {
        id: "opt-budget-inn",
        name: "Comfort Suites & Inn",
        category: "Budget-Friendly Hotel",
        nightly_rate_usd: lodgingPrices.budget_inn,
        total_trip_usd: lodgingPrices.budget_inn * duration,
        rating: 4.40,
        reviews_count: 215,
        family_amenities: ["Free Breakfast", "Indoor Pool", "Free Parking", "WiFi"],
        bed_layout: "2 Double/Queen Beds",
        best_for: "Maximum budget efficiency"
      }
    ]
  };

  // Activities
  const allIndividualLikes = family.flatMap(m => m.likes || []);
  const combinedLikes = Array.from(new Set([...likes, ...allIndividualLikes]));

  const activities = [
    {
      id: "act-1",
      name: `${primaryDest.name} Signature Family Highlight Experience`,
      category: primaryDest.primary_categories[0] || "entertainment",
      labels: ["Must See", "All Ages", "Top Rated"],
      family_tag: "Great for All Ages",
      matched_members: family.map(m => m.name),
      price_per_person_usd: 45,
      price_tier: "$$",
      duration_hours: 5,
      best_time_of_day: "Morning",
      description: `Experience the top-rated family attraction in ${primaryDest.name} designed with engaging sights and accessible walking paths.`,
      tips: "Arrive 15 minutes before opening to avoid entrance queues."
    },
    {
      id: "act-2",
      name: "Scenic Coastal / Park Exploration & Wildlife Trail",
      category: "nature",
      labels: ["Nature & Wildlife", "Stroller Friendly", "Free Entry"],
      family_tag: "Toddler & Child Friendly",
      matched_members: family.filter(m => m.age <= 12 || (m.likes && m.likes.includes('nature'))).map(m => m.name),
      price_per_person_usd: 0,
      price_tier: "Free",
      duration_hours: 3,
      best_time_of_day: "Late Afternoon",
      description: "Enjoy peaceful nature walks, shaded play zones, and wildlife observation points perfect for children.",
      tips: "Bring sunscreen, water bottles, and comfortable walking shoes."
    },
    {
      id: "act-3",
      name: "Interactive Science & Culture Discovery Center",
      category: "science_museums",
      labels: ["Interactive", "Hands-on", "Indoor"],
      family_tag: "Kid & Tween Favorite",
      matched_members: family.filter(m => (m.age >= 4 && m.age <= 16) || (m.likes && m.likes.includes('science_museums'))).map(m => m.name),
      price_per_person_usd: 22,
      price_tier: "$$",
      duration_hours: 3.5,
      best_time_of_day: "Morning",
      description: "Hands-on exhibits, experiential physics fun, and educational discovery stations for curious minds.",
      tips: "Check out the discovery lab sessions offered every hour."
    }
  ];

  // Budget
  const totalFood = primaryDest.daily_food_per_person_usd * numPeople * duration;
  const totalTransport = primaryDest.local_transport_daily_usd * duration;
  const totalAct = 45 * numPeople * Math.min(duration, 3);
  const realisticTotal = flightAvgTotal + (lodgingPrices.family_suite * duration) + totalFood + totalTransport + totalAct;

  const budget_summary = {
    duration_days: duration,
    family_size: numPeople,
    total_budget_range: {
      low: Math.round(realisticTotal * 0.75),
      realistic: Math.round(realisticTotal),
      peak: Math.round(realisticTotal * 1.35)
    },
    per_person_range: {
      low: Math.round((realisticTotal * 0.75) / numPeople),
      realistic: Math.round(realisticTotal / numPeople),
      peak: Math.round((realisticTotal * 1.35) / numPeople)
    },
    breakdown_realistic: {
      flights: flightAvgTotal,
      lodging: lodgingPrices.family_suite * duration,
      activities: totalAct,
      food_and_dining: totalFood,
      local_transport: totalTransport,
      emergency_buffer: Math.round(realisticTotal * 0.08)
    }
  };

  // Weather
  const weather = {
    avg_temp_f: 78,
    summary: `Warm and pleasant weather expected in ${primaryDest.name}, ideal for family outings.`,
    forecast: [
      { date: "Day 1", high_f: 80, low_f: 64, rain_chance: 10, condition: "Sunny" },
      { date: "Day 2", high_f: 82, low_f: 65, rain_chance: 15, condition: "Partly Cloudy" },
      { date: "Day 3", high_f: 79, low_f: 63, rain_chance: 5, condition: "Sunny" },
      { date: "Day 4", high_f: 81, low_f: 66, rain_chance: 20, condition: "Partly Cloudy" }
    ]
  };

  // Itinerary
  const itinerary = Array.from({ length: duration }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1}: ${activities[i % activities.length].name}`,
    morning: {
      activity: activities[i % activities.length].name,
      time: "9:00 AM - 12:30 PM",
      description: activities[i % activities.length].description,
      price: `$${activities[i % activities.length].price_per_person_usd}/person`,
      tag: activities[i % activities.length].family_tag
    },
    afternoon: {
      activity: "Lunch & Resort Pool Relaxation",
      time: "1:30 PM - 4:30 PM",
      description: "Recharge with swimming, snacks, and downtime before evening fun.",
      price: "Included with Lodging",
      tag: "Relaxing"
    },
    evening: {
      activity: "Family Dinner & Sunset Promenade Walk",
      time: "6:00 PM - 8:30 PM",
      description: "Enjoy a memorable dinner at a local family-friendly restaurant.",
      price: `~$${Math.round((primaryDest.daily_food_per_person_usd * numPeople) / 2)} total`,
      tag: "All Ages"
    }
  }));

  return {
    destination: primaryDest,
    all_ranked_destinations: scored,
    flights,
    lodging,
    activities,
    weather,
    budget_summary,
    itinerary,
    family_profile_summary: {
      total_travelers: numPeople,
      likes,
      dislikes
    }
  };
}
