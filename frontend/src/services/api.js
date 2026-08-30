const isGitHubPages = typeof window !== 'undefined' && (window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:');
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL || (isGitHubPages ? null : '/api');

export async function fetchWikipediaSummary(query) {
  if (!query || !query.trim()) return null;
  const cleaned = query.split('(')[0].trim().replace(/ /g, '_');
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleaned)}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title,
        extract: data.extract,
        thumbnail: data.thumbnail?.source || data.originalimage?.source,
        coordinates: data.coordinates
      };
    }
  } catch (e) {
    console.warn("Wikipedia client lookup fallback:", e);
  }
  return null;
}

export const fallbackDestinations = [
  {
    "id": "kansas-city-mo",
    "name": "Kansas City, Missouri",
    "country": "United States",
    "continent": "North America",
    "region": "Midwest USA",
    "coordinates": {
      "lat": 39.0997,
      "lng": -94.5786
    },
    "airport_code": "MCI",
    "hero_image": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Worlds of Fun theme park, Science City at historic Union Station, Crown Center Lego discovery, world-famous sweet Kansas City BBQ, and the vibrant zoo.",
    "primary_categories": [
      "theme_parks",
      "science_museums",
      "food_culinary",
      "entertainment",
      "animals_wildlife"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "low",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 90,
      "avg": 180,
      "peak": 320
    },
    "lodging_daily_usd": {
      "budget_inn": 80,
      "vacation_rental": 145,
      "family_suite": 195,
      "luxury_resort": 380
    },
    "daily_food_per_person_usd": 32,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Worlds of Fun theme park & Oceans of Fun water park",
      "Science City at Union Station (hands-on maker studios & planetarium)",
      "Deanna Rose Children's Farmstead & Kansas City Zoo elephant expedition",
      "Crown Center (LEGOLAND Discovery Center & SEA LIFE Aquarium)"
    ]
  },
  {
    "id": "st-louis-mo",
    "name": "St. Louis, Missouri",
    "country": "United States",
    "continent": "North America",
    "region": "Midwest USA",
    "coordinates": {
      "lat": 38.627,
      "lng": -90.1994
    },
    "airport_code": "STL",
    "hero_image": "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Gateway Arch tram ride 630ft to the top, world-famous Saint Louis Zoo (100% FREE admission), City Museum giant architectural jungle gym, and Forest Park.",
    "primary_categories": [
      "science_museums",
      "animals_wildlife",
      "history_culture",
      "entertainment",
      "relaxing"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "low",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 95,
      "avg": 190,
      "peak": 330
    },
    "lodging_daily_usd": {
      "budget_inn": 80,
      "vacation_rental": 145,
      "family_suite": 190,
      "luxury_resort": 375
    },
    "daily_food_per_person_usd": 30,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "Saint Louis Zoo (world-renowned with FREE general admission)",
      "City Museum (10-story whimsical indoor playground with caves and slides)",
      "Gateway Arch National Park tram ride to the observation deck",
      "The Magic House & Saint Louis Science Center (interactive science)"
    ]
  },
  {
    "id": "denver-co",
    "name": "Denver & Rocky Mountains, Colorado",
    "country": "United States",
    "continent": "North America",
    "region": "Mountain West USA",
    "coordinates": {
      "lat": 39.7392,
      "lng": -104.9903
    },
    "airport_code": "DEN",
    "hero_image": "https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Denver Museum of Nature & Science, Denver Zoo, Red Rocks Amphitheatre, Downtown Aquarium, and scenic mountain drives into Rocky Mountain National Park.",
    "primary_categories": [
      "nature",
      "animals_wildlife",
      "science_museums",
      "adventure",
      "food_culinary"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Summer",
      "Autumn",
      "Winter",
      "Spring"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "alpine",
    "flight_base_usd": {
      "low": 110,
      "avg": 210,
      "peak": 360
    },
    "lodging_daily_usd": {
      "budget_inn": 95,
      "vacation_rental": 175,
      "family_suite": 240,
      "luxury_resort": 460
    },
    "daily_food_per_person_usd": 38,
    "local_transport_daily_usd": 30,
    "highlight_features": [
      "Rocky Mountain National Park wildlife watching (elk, moose & Trail Ridge Road)",
      "Denver Museum of Nature & Science (dinosaur discovery labs & IMAX)",
      "Red Rocks Park & Amphitheatre scenic red sandstone trails",
      "Denver Zoo elephant passage & Children's Museum of Denver"
    ]
  },
  {
    "id": "minneapolis-mn",
    "name": "Minneapolis & Mall of America, Minnesota",
    "country": "United States",
    "continent": "North America",
    "region": "Midwest USA",
    "coordinates": {
      "lat": 44.9778,
      "lng": -93.265
    },
    "airport_code": "MSP",
    "hero_image": "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Mall of America with Nickelodeon Universe indoor theme park, SEA LIFE 300ft ocean tunnel, Science Museum of Minnesota, and Minnehaha Falls.",
    "primary_categories": [
      "theme_parks",
      "science_museums",
      "animals_wildlife",
      "water_parks",
      "nature"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Summer",
      "Autumn",
      "Spring",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "low",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 95,
      "avg": 185,
      "peak": 320
    },
    "lodging_daily_usd": {
      "budget_inn": 85,
      "vacation_rental": 150,
      "family_suite": 205,
      "luxury_resort": 395
    },
    "daily_food_per_person_usd": 34,
    "local_transport_daily_usd": 24,
    "highlight_features": [
      "Mall of America: Nickelodeon Universe 7-acre indoor theme park",
      "SEA LIFE Minnesota Aquarium (300ft underwater glass ocean tunnel)",
      "Science Museum of Minnesota with real fossil digging and Mississippi river deck",
      "Minnehaha Regional Park 53ft waterfall and surrey bicycle rentals"
    ]
  },
  {
    "id": "black-hills-sd",
    "name": "Black Hills & Mount Rushmore, South Dakota",
    "country": "United States",
    "continent": "North America",
    "region": "Midwest USA",
    "coordinates": {
      "lat": 43.8791,
      "lng": -103.4591
    },
    "airport_code": "RAP",
    "hero_image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Mount Rushmore National Memorial, Custer State Park wild buffalo herds, Badlands alien rock canyons, and Bear Country USA drive-through safari.",
    "primary_categories": [
      "nature",
      "animals_wildlife",
      "history_culture",
      "adventure"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Summer",
      "Autumn",
      "Spring"
    ],
    "stroller_friendly": true,
    "crowd_level": "low",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 130,
      "avg": 240,
      "peak": 390
    },
    "lodging_daily_usd": {
      "budget_inn": 85,
      "vacation_rental": 160,
      "family_suite": 220,
      "luxury_resort": 420
    },
    "daily_food_per_person_usd": 32,
    "local_transport_daily_usd": 35,
    "highlight_features": [
      "Mount Rushmore National Memorial evening lighting ceremony",
      "Custer State Park Wildlife Loop (drive next to 1,400 wild bison)",
      "Bear Country USA drive-through wildlife park (black bears & wolves)",
      "Badlands National Park lunar landscape boardwalk walks"
    ]
  },
  {
    "id": "branson-ozarks-mo",
    "name": "Branson & Ozark Mountains, Missouri",
    "country": "United States",
    "continent": "North America",
    "region": "Midwest USA",
    "coordinates": {
      "lat": 36.6437,
      "lng": -93.2185
    },
    "airport_code": "SGF",
    "hero_image": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Silver Dollar City 1880s award-winning theme park, Table Rock Lake pontoon boating, Fritz's Adventure indoor ropes, and live family musical shows.",
    "primary_categories": [
      "theme_parks",
      "entertainment",
      "nature",
      "water_parks",
      "relaxing"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "low",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 110,
      "avg": 210,
      "peak": 350
    },
    "lodging_daily_usd": {
      "budget_inn": 75,
      "vacation_rental": 140,
      "family_suite": 190,
      "luxury_resort": 370
    },
    "daily_food_per_person_usd": 28,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Silver Dollar City (world-class wooden rollercoasters & master craftsmen)",
      "Table Rock Lake pontoon boat rentals & lakeside state park beaches",
      "Titanic Museum Attraction with real iceberg walk and kid scavenger hunts",
      "Fritz's Adventure 3-story indoor ropes course and climbing tunnels"
    ]
  },
  {
    "id": "chicago-il",
    "name": "Chicago & Lake Michigan, Illinois",
    "country": "United States",
    "continent": "North America",
    "region": "Midwest USA",
    "coordinates": {
      "lat": 41.8781,
      "lng": -87.6298
    },
    "airport_code": "ORD",
    "hero_image": "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Navy Pier giant Centennial Wheel, Shedd Aquarium beluga whales, Museum of Science & Industry U-boat, deep dish pizza, and Millennium Park.",
    "primary_categories": [
      "science_museums",
      "animals_wildlife",
      "food_culinary",
      "entertainment",
      "history_culture"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 90,
      "avg": 170,
      "peak": 300
    },
    "lodging_daily_usd": {
      "budget_inn": 110,
      "vacation_rental": 200,
      "family_suite": 270,
      "luxury_resort": 540
    },
    "daily_food_per_person_usd": 42,
    "local_transport_daily_usd": 18,
    "highlight_features": [
      "Shedd Aquarium (beluga whales, sea otters & touch pools)",
      "Museum of Science and Industry (walk-in WWII submarine & giant Tesla coils)",
      "Navy Pier Centennial Wheel & Chicago Architecture Boat Tour",
      "Millennium Park 'The Bean' sculpture and Maggie Daley playground"
    ]
  },
  {
    "id": "tokyo-japan",
    "name": "Tokyo & Mt. Fuji, Japan",
    "country": "Japan",
    "continent": "Asia & Pacific",
    "region": "East Asia",
    "coordinates": {
      "lat": 35.6762,
      "lng": 139.6503
    },
    "airport_code": "HND",
    "hero_image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Futuristic technology, teamLab digital art museums, Tokyo Disney Resort, Ghibli magic, and scenic Shinkansen bullet trains to Mt. Fuji.",
    "primary_categories": [
      "theme_parks",
      "science_museums",
      "food_culinary",
      "history_culture",
      "nature"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 680,
      "avg": 1050,
      "peak": 1550
    },
    "lodging_daily_usd": {
      "budget_inn": 110,
      "vacation_rental": 195,
      "family_suite": 280,
      "luxury_resort": 580
    },
    "daily_food_per_person_usd": 42,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Tokyo Disney Resort & DisneySea",
      "teamLab Planets interactive digital water and light museum",
      "Ghibli Museum and Harajuku character street",
      "Scenic Mt. Fuji bullet train day trips"
    ]
  },
  {
    "id": "kyoto-osaka-japan",
    "name": "Kyoto & Osaka, Japan",
    "country": "Japan",
    "continent": "Asia & Pacific",
    "region": "East Asia",
    "coordinates": {
      "lat": 35.0116,
      "lng": 135.7681
    },
    "airport_code": "KIX",
    "hero_image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Ancient golden shrines, bowing deer in Nara Park, Fushimi Inari torii gates, Universal Studios Super Nintendo World, and Dotonbori street food.",
    "primary_categories": [
      "history_culture",
      "theme_parks",
      "animals_wildlife",
      "food_culinary",
      "nature"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 690,
      "avg": 1080,
      "peak": 1580
    },
    "lodging_daily_usd": {
      "budget_inn": 100,
      "vacation_rental": 180,
      "family_suite": 260,
      "luxury_resort": 540
    },
    "daily_food_per_person_usd": 38,
    "local_transport_daily_usd": 20,
    "highlight_features": [
      "Universal Studios Japan (Super Nintendo World)",
      "Bowing tame deer in historic Nara Park",
      "Fushimi Inari thousand vermillion torii gates walk",
      "Arashiyama Bamboo Forest and monkey park"
    ]
  },
  {
    "id": "seoul-jeju-korea",
    "name": "Seoul & Jeju Island, South Korea",
    "country": "South Korea",
    "continent": "Asia & Pacific",
    "region": "East Asia",
    "coordinates": {
      "lat": 37.5665,
      "lng": 126.978
    },
    "airport_code": "ICN",
    "hero_image": "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Centuries-old royal palaces, Lotte World indoor theme park, K-pop discovery centers, bustling night markets, and Jeju's volcanic waterfalls.",
    "primary_categories": [
      "history_culture",
      "theme_parks",
      "food_culinary",
      "nature",
      "science_museums"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 650,
      "avg": 1020,
      "peak": 1520
    },
    "lodging_daily_usd": {
      "budget_inn": 90,
      "vacation_rental": 165,
      "family_suite": 240,
      "luxury_resort": 480
    },
    "daily_food_per_person_usd": 35,
    "local_transport_daily_usd": 20,
    "highlight_features": [
      "Gyeongbokgung Palace royal changing of the guard in hanbok",
      "Lotte World theme park & Seoul Sky 123-story observatory",
      "Jeju Island volcanic lava tubes, orange groves & waterfalls",
      "Cheonggyecheon Stream evening light promenades"
    ]
  },
  {
    "id": "singapore",
    "name": "Singapore & Sentosa Island",
    "country": "Singapore",
    "continent": "Asia & Pacific",
    "region": "Southeast Asia",
    "coordinates": {
      "lat": 1.3521,
      "lng": 103.8198
    },
    "airport_code": "SIN",
    "hero_image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Futuristic Supertree Grove at Gardens by the Bay, Universal Studios Sentosa, Night Safari tram rides, and world-class clean, stroller-friendly infrastructure.",
    "primary_categories": [
      "theme_parks",
      "animals_wildlife",
      "science_museums",
      "nature",
      "food_culinary"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Year-round"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 720,
      "avg": 1150,
      "peak": 1650
    },
    "lodging_daily_usd": {
      "budget_inn": 130,
      "vacation_rental": 230,
      "family_suite": 310,
      "luxury_resort": 620
    },
    "daily_food_per_person_usd": 40,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "Gardens by the Bay Supertree Grove and Cloud Forest dome",
      "Singapore Zoo and Open-Air Night Safari",
      "Sentosa Island beaches and Universal Studios",
      "Jewel Changi Airport giant indoor rain vortex"
    ]
  },
  {
    "id": "bali-indonesia",
    "name": "Bali & Ubud, Indonesia",
    "country": "Indonesia",
    "continent": "Asia & Pacific",
    "region": "Southeast Asia",
    "coordinates": {
      "lat": -8.3405,
      "lng": 115.092
    },
    "airport_code": "DPS",
    "hero_image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Emerald rice terraces in Ubud, playful monkey forests, gentle surf beaches, private family pool villas, and rich Hindu temple culture.",
    "primary_categories": [
      "beaches",
      "nature",
      "animals_wildlife",
      "relaxing",
      "history_culture"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": false,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 780,
      "avg": 1200,
      "peak": 1750
    },
    "lodging_daily_usd": {
      "budget_inn": 60,
      "vacation_rental": 140,
      "family_suite": 190,
      "luxury_resort": 420
    },
    "daily_food_per_person_usd": 25,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Affordable private family pool villas with lush tropical gardens",
      "Ubud Sacred Monkey Forest Sanctuary",
      "Tegallalang emerald green rice terraces",
      "Sanur calm shallow beach waters perfect for young swimmers"
    ]
  },
  {
    "id": "bangkok-chiangmai-thailand",
    "name": "Bangkok & Chiang Mai, Thailand",
    "country": "Thailand",
    "continent": "Asia & Pacific",
    "region": "Southeast Asia",
    "coordinates": {
      "lat": 13.7563,
      "lng": 100.5018
    },
    "airport_code": "BKK",
    "hero_image": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Gilded Grand Palace temples, ethical elephant care sanctuaries in Chiang Mai, floating markets, and famous Thai culinary night bazaars.",
    "primary_categories": [
      "history_culture",
      "animals_wildlife",
      "food_culinary",
      "nature"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Winter",
      "Spring"
    ],
    "stroller_friendly": false,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 720,
      "avg": 1120,
      "peak": 1650
    },
    "lodging_daily_usd": {
      "budget_inn": 55,
      "vacation_rental": 120,
      "family_suite": 175,
      "luxury_resort": 380
    },
    "daily_food_per_person_usd": 22,
    "local_transport_daily_usd": 20,
    "highlight_features": [
      "Ethical elephant rescue and feeding sanctuaries in Chiang Mai",
      "Chao Phraya longtail river boat rides & floating markets",
      "Grand Palace and Wat Arun temple towers",
      "Vibrant family night bazaars with mango sticky rice"
    ]
  },
  {
    "id": "phuket-krabi-thailand",
    "name": "Phuket & Krabi, Thailand",
    "country": "Thailand",
    "continent": "Asia & Pacific",
    "region": "Southeast Asia",
    "coordinates": {
      "lat": 7.8804,
      "lng": 98.3923
    },
    "airport_code": "HKT",
    "hero_image": "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Towering limestone karsts rising out of turquoise Andaman waters, island boat adventures, sea caves, and beachfront family resorts.",
    "primary_categories": [
      "beaches",
      "nature",
      "water_parks",
      "relaxing",
      "adventure"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Winter",
      "Spring"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 750,
      "avg": 1180,
      "peak": 1690
    },
    "lodging_daily_usd": {
      "budget_inn": 65,
      "vacation_rental": 135,
      "family_suite": 195,
      "luxury_resort": 410
    },
    "daily_food_per_person_usd": 26,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "Phi Phi Islands and Phang Nga Bay catamaran cruises",
      "Gentle warm swimming beaches at Kata and Karon",
      "Sea kayaking through hidden limestone mangrove lagoons",
      "Family resorts with kids clubs and lagoon water parks"
    ]
  },
  {
    "id": "da-nang-hoi-an-vietnam",
    "name": "Da Nang & Hoi An, Vietnam",
    "country": "Vietnam",
    "continent": "Asia & Pacific",
    "region": "Southeast Asia",
    "coordinates": {
      "lat": 16.0544,
      "lng": 108.2022
    },
    "airport_code": "DAD",
    "hero_image": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Fairytale silk lantern streets in pedestrian-friendly Hoi An, Golden Hand Bridge at Ba Na Hills, coconut boat basket rides, and white sandy beaches.",
    "primary_categories": [
      "history_culture",
      "beaches",
      "food_culinary",
      "theme_parks",
      "relaxing"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer"
    ],
    "stroller_friendly": true,
    "crowd_level": "low",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 710,
      "avg": 1100,
      "peak": 1620
    },
    "lodging_daily_usd": {
      "budget_inn": 50,
      "vacation_rental": 110,
      "family_suite": 160,
      "luxury_resort": 350
    },
    "daily_food_per_person_usd": 20,
    "local_transport_daily_usd": 18,
    "highlight_features": [
      "Hoi An Ancient Town evening silk lantern boat rides (car-free)",
      "Sun World Ba Na Hills Golden Bridge in the clouds",
      "Traditional round bamboo basket boat spinning tours in Cam Thanh",
      "My Khe Beach soft sands and warm waters"
    ]
  },
  {
    "id": "taipei-taiwan",
    "name": "Taipei & Taroko Gorge, Taiwan",
    "country": "Taiwan",
    "continent": "Asia & Pacific",
    "region": "East Asia",
    "coordinates": {
      "lat": 25.033,
      "lng": 121.5654
    },
    "airport_code": "TPE",
    "hero_image": "https://images.unsplash.com/photo-1508247967583-7d982ea01526?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Taipei 101 tower, world-renowned night market street food, scenic Maokong gondola tea plantations, Jiufen lantern village, and Taroko marble canyons.",
    "primary_categories": [
      "food_culinary",
      "history_culture",
      "nature",
      "science_museums"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Autumn",
      "Spring",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "subtropical",
    "flight_base_usd": {
      "low": 660,
      "avg": 1040,
      "peak": 1540
    },
    "lodging_daily_usd": {
      "budget_inn": 80,
      "vacation_rental": 150,
      "family_suite": 220,
      "luxury_resort": 460
    },
    "daily_food_per_person_usd": 30,
    "local_transport_daily_usd": 15,
    "highlight_features": [
      "Ultra-clean, elevator-rich metro and stroller-friendly sidewalks",
      "Din Tai Fung original soup dumplings and Raohe Night Market",
      "Maokong glass-bottom crystal gondola ride",
      "National Palace Museum ancient treasures"
    ]
  },
  {
    "id": "sydney-australia",
    "name": "Sydney & Blue Mountains, Australia",
    "country": "Australia",
    "continent": "Asia & Pacific",
    "region": "Oceania",
    "coordinates": {
      "lat": -33.8688,
      "lng": 151.2093
    },
    "airport_code": "SYD",
    "hero_image": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Iconic Opera House harbor cruises, Taronga Zoo with panoramic skyline views, Bondi Beach coastal walks, and eucalyptus rainforests in Blue Mountains.",
    "primary_categories": [
      "animals_wildlife",
      "beaches",
      "nature",
      "history_culture",
      "adventure"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 890,
      "avg": 1350,
      "peak": 1950
    },
    "lodging_daily_usd": {
      "budget_inn": 135,
      "vacation_rental": 240,
      "family_suite": 320,
      "luxury_resort": 640
    },
    "daily_food_per_person_usd": 48,
    "local_transport_daily_usd": 28,
    "highlight_features": [
      "Taronga Zoo with wild koalas, kangaroos & harbor ferry ride",
      "Sydney Opera House and Harbour Bridge Walk",
      "Bondi to Coogee scenic coastal stroller walk",
      "Blue Mountains Scenic World railway and rainforest cableway"
    ]
  },
  {
    "id": "melbourne-australia",
    "name": "Melbourne & Great Ocean Road, Australia",
    "country": "Australia",
    "continent": "Asia & Pacific",
    "region": "Oceania",
    "coordinates": {
      "lat": -37.8136,
      "lng": 144.9631
    },
    "airport_code": "MEL",
    "hero_image": "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Phillip Island wild little penguin sunset parade, iconic Twelve Apostles coastal drive, historic steam train rides in Dandenong, and vibrant laneway cafes.",
    "primary_categories": [
      "animals_wildlife",
      "nature",
      "food_culinary",
      "science_museums"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 910,
      "avg": 1380,
      "peak": 1980
    },
    "lodging_daily_usd": {
      "budget_inn": 125,
      "vacation_rental": 225,
      "family_suite": 300,
      "luxury_resort": 590
    },
    "daily_food_per_person_usd": 46,
    "local_transport_daily_usd": 26,
    "highlight_features": [
      "Phillip Island Penguin Parade (hundreds of wild penguins waddling ashore)",
      "Great Ocean Road scenic coastal drive to Twelve Apostles",
      "Puffing Billy historic open-sided forest steam train",
      "Free city circle tram and Melbourne Museum children's gallery"
    ]
  },
  {
    "id": "cairns-reef-australia",
    "name": "Cairns & Great Barrier Reef, Australia",
    "country": "Australia",
    "continent": "Asia & Pacific",
    "region": "Oceania",
    "coordinates": {
      "lat": -16.9186,
      "lng": 145.7781
    },
    "airport_code": "CNS",
    "hero_image": "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Snorkeling the world's greatest coral reef, Kuranda rainforest scenic railway, Daintree ancient jungle, and the Esplanade swimming lagoon.",
    "primary_categories": [
      "beaches",
      "nature",
      "animals_wildlife",
      "water_parks",
      "adventure"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Winter",
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 940,
      "avg": 1420,
      "peak": 2050
    },
    "lodging_daily_usd": {
      "budget_inn": 110,
      "vacation_rental": 210,
      "family_suite": 280,
      "luxury_resort": 560
    },
    "daily_food_per_person_usd": 44,
    "local_transport_daily_usd": 30,
    "highlight_features": [
      "Great Barrier Reef family pontoon snorkeling and glass-bottom boats",
      "Skyrail Rainforest Cableway gliding over pristine canopy",
      "Cairns Esplanade free public saltwater swimming lagoon",
      "Hartley's Crocodile Adventures crocodile feeding boat tours"
    ]
  },
  {
    "id": "auckland-rotorua-nz",
    "name": "Auckland & Rotorua, New Zealand",
    "country": "New Zealand",
    "continent": "Asia & Pacific",
    "region": "Oceania",
    "coordinates": {
      "lat": -36.8485,
      "lng": 174.7633
    },
    "airport_code": "AKL",
    "hero_image": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Hobbiton Movie Set rolling green hills, bubbling geothermal geysers and Maori cultural performances in Rotorua, and Auckland harbor sailing.",
    "primary_categories": [
      "nature",
      "history_culture",
      "animals_wildlife",
      "adventure"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "low",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 920,
      "avg": 1390,
      "peak": 1990
    },
    "lodging_daily_usd": {
      "budget_inn": 115,
      "vacation_rental": 215,
      "family_suite": 290,
      "luxury_resort": 570
    },
    "daily_food_per_person_usd": 45,
    "local_transport_daily_usd": 32,
    "highlight_features": [
      "Hobbiton Movie Set tour with hobbit holes and Green Dragon Inn",
      "Te Puia geothermal geysers and live kiwi bird conservation center",
      "Redwoods Treewalk suspension bridge canopy in Rotorua",
      "Waiheke Island ferry trip and sandy family beaches"
    ]
  },
  {
    "id": "queenstown-nz",
    "name": "Queenstown & Fiordland, New Zealand",
    "country": "New Zealand",
    "continent": "Asia & Pacific",
    "region": "Oceania",
    "coordinates": {
      "lat": -45.0312,
      "lng": 168.6626
    },
    "airport_code": "ZQN",
    "hero_image": "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Majestic Remarkables mountain peaks over Lake Wakatipu, Milford Sound waterfall fiord cruises, Skyline luge carts, and Kiwi bird parks.",
    "primary_categories": [
      "nature",
      "adventure",
      "animals_wildlife",
      "relaxing"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Summer",
      "Autumn",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "alpine",
    "flight_base_usd": {
      "low": 960,
      "avg": 1450,
      "peak": 2080
    },
    "lodging_daily_usd": {
      "budget_inn": 130,
      "vacation_rental": 235,
      "family_suite": 315,
      "luxury_resort": 630
    },
    "daily_food_per_person_usd": 48,
    "local_transport_daily_usd": 35,
    "highlight_features": [
      "Milford Sound day cruise under towering sheer waterfalls",
      "Skyline Gondola & gravity-fueled downhill Luge carts for kids",
      "TSS Earnslaw historic steamship lake cruise to Walter Peak Farm",
      "Arrowtown gold mining historic village and sweet shops"
    ]
  },
  {
    "id": "fiji-islands",
    "name": "Fiji Coral Coast & Mamanuca Islands",
    "country": "Fiji",
    "continent": "Asia & Pacific",
    "region": "Oceania",
    "coordinates": {
      "lat": -17.7134,
      "lng": 178.065
    },
    "airport_code": "NAN",
    "hero_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Crystal-clear South Pacific turquoise lagoons, world-renowned Fijian hospitality, Bula kids clubs, sea turtle sanctuaries, and coral reefs.",
    "primary_categories": [
      "beaches",
      "relaxing",
      "water_parks",
      "animals_wildlife",
      "nature"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "low",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 850,
      "avg": 1280,
      "peak": 1850
    },
    "lodging_daily_usd": {
      "budget_inn": 90,
      "vacation_rental": 180,
      "family_suite": 260,
      "luxury_resort": 550
    },
    "daily_food_per_person_usd": 38,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "World-famous Bula Kids Clubs with dedicated nanny care for toddlers",
      "Snorkeling directly off calm shallow white sand beaches",
      "Traditional Fijian village cultural visits and Kava ceremonies",
      "Glass-bottom boat coral garden reef safaris"
    ]
  },
  {
    "id": "london-uk",
    "name": "London & Cotswolds, United Kingdom",
    "country": "United Kingdom",
    "continent": "Europe",
    "region": "Western Europe",
    "coordinates": {
      "lat": 51.5074,
      "lng": -0.1278
    },
    "airport_code": "LHR",
    "hero_image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Tower of London crown jewels, free world-class science & natural history museums, West End musicals (Lion King), double-decker buses, and Cotswolds cottages.",
    "primary_categories": [
      "history_culture",
      "science_museums",
      "entertainment",
      "food_culinary"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 520,
      "avg": 850,
      "peak": 1350
    },
    "lodging_daily_usd": {
      "budget_inn": 130,
      "vacation_rental": 230,
      "family_suite": 310,
      "luxury_resort": 620
    },
    "daily_food_per_person_usd": 48,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Free entry to Natural History Museum (dino exhibits) & Science Museum",
      "Tower of London Yeoman Warder tours and Crown Jewels",
      "Harry Potter Warner Bros. Studio Tour London",
      "Iconic open-top double-decker bus rides and London Eye"
    ]
  },
  {
    "id": "edinburgh-uk",
    "name": "Edinburgh & Scottish Highlands, UK",
    "country": "United Kingdom",
    "continent": "Europe",
    "region": "Western Europe",
    "coordinates": {
      "lat": 55.9533,
      "lng": -3.1883
    },
    "airport_code": "EDI",
    "hero_image": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Edinburgh Castle perched atop an extinct volcano, Royal Mile ghost & folklore tours, Camera Obscura illusions, and Loch Ness monster boat trips.",
    "primary_categories": [
      "history_culture",
      "nature",
      "science_museums",
      "adventure"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Summer",
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 560,
      "avg": 890,
      "peak": 1400
    },
    "lodging_daily_usd": {
      "budget_inn": 115,
      "vacation_rental": 205,
      "family_suite": 280,
      "luxury_resort": 560
    },
    "daily_food_per_person_usd": 45,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "Edinburgh Castle firing of the One O'Clock Gun",
      "Camera Obscura & World of Illusions (hands-on optical fun)",
      "Highland steam train across Glenfinnan Viaduct (Hogwarts Express)",
      "Loch Ness boat cruises and Urquhart Castle ruins"
    ]
  },
  {
    "id": "paris-france",
    "name": "Paris & Disneyland Paris, France",
    "country": "France",
    "continent": "Europe",
    "region": "Western Europe",
    "coordinates": {
      "lat": 48.8566,
      "lng": 2.3522
    },
    "airport_code": "CDG",
    "hero_image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Eiffel Tower sparkling night lights, Seine River cruises, Louvre Mona Lisa discovery trails, Luxembourg Garden carousel, and Disneyland Paris.",
    "primary_categories": [
      "history_culture",
      "theme_parks",
      "food_culinary",
      "relaxing"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Autumn",
      "Summer"
    ],
    "stroller_friendly": true,
    "crowd_level": "high",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 540,
      "avg": 880,
      "peak": 1390
    },
    "lodging_daily_usd": {
      "budget_inn": 125,
      "vacation_rental": 220,
      "family_suite": 300,
      "luxury_resort": 600
    },
    "daily_food_per_person_usd": 46,
    "local_transport_daily_usd": 24,
    "highlight_features": [
      "Eiffel Tower elevator summit ascent & sparkling evening illumination",
      "Disneyland Paris & Walt Disney Studios Park (Ratatouille ride)",
      "Seine River sightseeing boat cruise with audio guides",
      "Luxembourg Gardens vintage wooden toy sailboat pond"
    ]
  },
  {
    "id": "rome-italy",
    "name": "Rome & Vatican City, Italy",
    "country": "Italy",
    "continent": "Europe",
    "region": "Southern Europe",
    "coordinates": {
      "lat": 41.9028,
      "lng": 12.4964
    },
    "airport_code": "FCO",
    "hero_image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Colosseum gladiator arenas, Trevi Fountain coin tossing, authentic handmade gelato on every piazza, Roman Forum ruins, and Vatican Sistine Chapel.",
    "primary_categories": [
      "history_culture",
      "food_culinary",
      "science_museums"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "high",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 560,
      "avg": 890,
      "peak": 1400
    },
    "lodging_daily_usd": {
      "budget_inn": 110,
      "vacation_rental": 195,
      "family_suite": 270,
      "luxury_resort": 550
    },
    "daily_food_per_person_usd": 42,
    "local_transport_daily_usd": 20,
    "highlight_features": [
      "Colosseum and Roman Forum gladiator history walk",
      "Trevi Fountain coin tossing & Pantheon dome",
      "Hands-on family pizza-making and gelato workshops",
      "Villa Borghese park surrey bicycle rentals"
    ]
  },
  {
    "id": "florence-tuscany-italy",
    "name": "Florence & Tuscany, Italy",
    "country": "Italy",
    "continent": "Europe",
    "region": "Southern Europe",
    "coordinates": {
      "lat": 43.7696,
      "lng": 11.2558
    },
    "airport_code": "FLR",
    "hero_image": "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Renaissance art masterpieces in the Uffizi, Duomo dome climbing, Ponte Vecchio gold shops, rolling Tuscan vineyard estates, and Leaning Tower of Pisa.",
    "primary_categories": [
      "history_culture",
      "food_culinary",
      "nature",
      "relaxing"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 580,
      "avg": 920,
      "peak": 1420
    },
    "lodging_daily_usd": {
      "budget_inn": 105,
      "vacation_rental": 190,
      "family_suite": 260,
      "luxury_resort": 520
    },
    "daily_food_per_person_usd": 40,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "Leaning Tower of Pisa funny family photo day trip",
      "Florence Duomo rooftop climb and Piazza della Signoria",
      "Tuscan agriturismo farm stays with swimming pools",
      "Leonardo da Vinci Interactive Museum (working wooden machines)"
    ]
  },
  {
    "id": "barcelona-spain",
    "name": "Barcelona & Costa Brava, Spain",
    "country": "Spain",
    "continent": "Europe",
    "region": "Southern Europe",
    "coordinates": {
      "lat": 41.3879,
      "lng": 2.1699
    },
    "airport_code": "BCN",
    "hero_image": "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Gaudí’s colorful mosaic Park Güell, Sagrada Família stained glass light show, Barceloneta city beach, PortAventura theme park, and tapas markets.",
    "primary_categories": [
      "history_culture",
      "beaches",
      "theme_parks",
      "food_culinary"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 530,
      "avg": 860,
      "peak": 1360
    },
    "lodging_daily_usd": {
      "budget_inn": 100,
      "vacation_rental": 185,
      "family_suite": 255,
      "luxury_resort": 510
    },
    "daily_food_per_person_usd": 38,
    "local_transport_daily_usd": 20,
    "highlight_features": [
      "Park Güell gingerbread-like mosaic houses & panoramic city view",
      "Sagrada Família kaleidoscope rainbow stained glass interior",
      "PortAventura World theme park and Ferrari Land",
      "Barceloneta Mediterranean family beach and cable car ride"
    ]
  },
  {
    "id": "mallorca-spain",
    "name": "Mallorca & Balearic Islands, Spain",
    "country": "Spain",
    "continent": "Europe",
    "region": "Southern Europe",
    "coordinates": {
      "lat": 39.6953,
      "lng": 3.0176
    },
    "airport_code": "PMI",
    "hero_image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Crystal-clear turquoise cove beaches (calas), vintage Sóller wooden tram, underground Dragon Caves with classical music on boats, and family beach resorts.",
    "primary_categories": [
      "beaches",
      "relaxing",
      "nature",
      "water_parks"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 550,
      "avg": 890,
      "peak": 1390
    },
    "lodging_daily_usd": {
      "budget_inn": 95,
      "vacation_rental": 180,
      "family_suite": 250,
      "luxury_resort": 490
    },
    "daily_food_per_person_usd": 36,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Cuevas del Drach (Caves of Drach) subterranean lake boat concert",
      "Sóller vintage wooden train and mountain tram",
      "Shallow calm waters at Alcudia and Cala Millor family beaches",
      "Palma Aquarium with giant shark tunnel and touch pools"
    ]
  },
  {
    "id": "lisbon-portugal",
    "name": "Lisbon & Sintra, Portugal",
    "country": "Portugal",
    "continent": "Europe",
    "region": "Southern Europe",
    "coordinates": {
      "lat": 38.7223,
      "lng": -9.1393
    },
    "airport_code": "LIS",
    "hero_image": "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Vibrant yellow Tram 28, colorful fairytale Pena Palace in Sintra, Lisbon Oceanarium (one of the world's best), pastéis de nata tarts, and Cascais beaches.",
    "primary_categories": [
      "history_culture",
      "animals_wildlife",
      "beaches",
      "food_culinary"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 510,
      "avg": 840,
      "peak": 1340
    },
    "lodging_daily_usd": {
      "budget_inn": 90,
      "vacation_rental": 170,
      "family_suite": 240,
      "luxury_resort": 480
    },
    "daily_food_per_person_usd": 34,
    "local_transport_daily_usd": 18,
    "highlight_features": [
      "Oceanário de Lisboa (spectacular central open-ocean tank)",
      "Pena Palace in Sintra (bright yellow & red fairytale castle)",
      "Riding vintage yellow tram cars up Lisbon's historic hills",
      "Pastéis de Belém original warm custard tarts"
    ]
  },
  {
    "id": "amsterdam-netherlands",
    "name": "Amsterdam & Windmills, Netherlands",
    "country": "Netherlands",
    "continent": "Europe",
    "region": "Western Europe",
    "coordinates": {
      "lat": 52.3676,
      "lng": 4.9041
    },
    "airport_code": "AMS",
    "hero_image": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Scenic canal boat cruises, hands-on NEMO Science Museum, Zaanse Schans historic working windmills, pancake houses, and Keukenhof tulip gardens.",
    "primary_categories": [
      "science_museums",
      "history_culture",
      "food_culinary",
      "nature"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 530,
      "avg": 860,
      "peak": 1360
    },
    "lodging_daily_usd": {
      "budget_inn": 120,
      "vacation_rental": 215,
      "family_suite": 295,
      "luxury_resort": 590
    },
    "daily_food_per_person_usd": 44,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "NEMO Science Museum with giant rooftop interactive splash zone",
      "Zaanse Schans working windmills and wooden clog making workshop",
      "Scenic glass-topped canal boat cruise through historic rings",
      "Keukenhof spring flower fields and Vondelpark playgrounds"
    ]
  },
  {
    "id": "switzerland-alps",
    "name": "Interlaken & Swiss Alps, Switzerland",
    "country": "Switzerland",
    "continent": "Europe",
    "region": "Central Europe",
    "coordinates": {
      "lat": 46.6863,
      "lng": 7.8632
    },
    "airport_code": "ZRH",
    "hero_image": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Jungfraujoch 'Top of Europe' cogwheel train, crystal turquoise alpine lakes of Brienz & Thun, Lauterbrunnen 72 waterfalls valley, and Swiss chocolate factories.",
    "primary_categories": [
      "nature",
      "adventure",
      "relaxing",
      "food_culinary"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Summer",
      "Winter",
      "Spring"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "alpine",
    "flight_base_usd": {
      "low": 580,
      "avg": 920,
      "peak": 1450
    },
    "lodging_daily_usd": {
      "budget_inn": 150,
      "vacation_rental": 260,
      "family_suite": 350,
      "luxury_resort": 720
    },
    "daily_food_per_person_usd": 55,
    "local_transport_daily_usd": 38,
    "highlight_features": [
      "Jungfraujoch Sphinx Observatory & Ice Palace glacier tunnels",
      "Lauterbrunnen valley fairy tale waterfalls (inspiration for Rivendell)",
      "Lake Brienz & Lake Thun scenic paddle steamer boat cruises",
      "Grindelwald First cliff walk and mountain go-kart rides"
    ]
  },
  {
    "id": "vienna-salzburg-austria",
    "name": "Vienna & Salzburg, Austria",
    "country": "Austria",
    "continent": "Europe",
    "region": "Central Europe",
    "coordinates": {
      "lat": 48.2082,
      "lng": 16.3738
    },
    "airport_code": "VIE",
    "hero_image": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Schönbrunn Palace gardens & world's oldest zoo, Prater amusement park giant Ferris wheel, Sound of Music Mirabell gardens, and world-famous Sachertorte.",
    "primary_categories": [
      "history_culture",
      "animals_wildlife",
      "theme_parks",
      "food_culinary"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 560,
      "avg": 890,
      "peak": 1390
    },
    "lodging_daily_usd": {
      "budget_inn": 105,
      "vacation_rental": 195,
      "family_suite": 270,
      "luxury_resort": 540
    },
    "daily_food_per_person_usd": 42,
    "local_transport_daily_usd": 20,
    "highlight_features": [
      "Schönbrunn Tiergarten (world's oldest zoo in imperial palace grounds)",
      "Vienna Prater Amusement Park and historic giant Ferris wheel",
      "Salzburg Fortress and Sound of Music film locations",
      "Haus der Musik interactive sound and conducting museum"
    ]
  },
  {
    "id": "athens-santorini-greece",
    "name": "Athens & Santorini, Greece",
    "country": "Greece",
    "continent": "Europe",
    "region": "Southern Europe",
    "coordinates": {
      "lat": 37.9838,
      "lng": 23.7275
    },
    "airport_code": "ATH",
    "hero_image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Ancient Parthenon on the Acropolis, Greek mythology discovery, whitewashed cliffside villages overlooking the Aegean caldera, and boat cruises to volcanic springs.",
    "primary_categories": [
      "history_culture",
      "beaches",
      "nature",
      "food_culinary"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Autumn",
      "Summer"
    ],
    "stroller_friendly": false,
    "crowd_level": "high",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 590,
      "avg": 940,
      "peak": 1480
    },
    "lodging_daily_usd": {
      "budget_inn": 100,
      "vacation_rental": 190,
      "family_suite": 275,
      "luxury_resort": 580
    },
    "daily_food_per_person_usd": 38,
    "local_transport_daily_usd": 24,
    "highlight_features": [
      "Acropolis and Parthenon ancient Greek mythology family tour",
      "Santorini Caldera catamaran sunset sailing with swimming in thermal coves",
      "Oia iconic blue-domed churches and scenic cliff paths",
      "Red Beach and Kamari black sand volcanic beaches"
    ]
  },
  {
    "id": "dubrovnik-croatia",
    "name": "Dubrovnik & Dalmatian Coast, Croatia",
    "country": "Croatia",
    "continent": "Europe",
    "region": "Southern Europe",
    "coordinates": {
      "lat": 42.6507,
      "lng": 18.0944
    },
    "airport_code": "DBV",
    "hero_image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Medieval stone fortress walls overlooking azure Adriatic waters, Lokrum Island peacock sanctuary, Dubrovnik cable car, and Plitvice Lakes waterfalls.",
    "primary_categories": [
      "history_culture",
      "beaches",
      "nature",
      "adventure"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 570,
      "avg": 910,
      "peak": 1440
    },
    "lodging_daily_usd": {
      "budget_inn": 95,
      "vacation_rental": 180,
      "family_suite": 250,
      "luxury_resort": 520
    },
    "daily_food_per_person_usd": 36,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "Dubrovnik Old Town ancient stone city wall walk above the sea",
      "Lokrum Island short ferry trip (wild peacocks, botanical gardens)",
      "Dubrovnik Cable Car up to Mount Srd for sunset views",
      "Sea kayaking along secret sea caves and fortress walls"
    ]
  },
  {
    "id": "reykjavik-iceland",
    "name": "Reykjavik & Golden Circle, Iceland",
    "country": "Iceland",
    "continent": "Europe",
    "region": "Northern Europe",
    "coordinates": {
      "lat": 64.1466,
      "lng": -21.9426
    },
    "airport_code": "KEF",
    "hero_image": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Gullfoss thundering waterfalls, erupting Strokkur geysers, Blue Lagoon geothermal swimming pools, black sand beaches, and Northern Lights aurora.",
    "primary_categories": [
      "nature",
      "animals_wildlife",
      "adventure",
      "science_museums"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Summer",
      "Winter",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 480,
      "avg": 780,
      "peak": 1280
    },
    "lodging_daily_usd": {
      "budget_inn": 140,
      "vacation_rental": 240,
      "family_suite": 330,
      "luxury_resort": 660
    },
    "daily_food_per_person_usd": 52,
    "local_transport_daily_usd": 40,
    "highlight_features": [
      "Golden Circle: Geysir eruptions, Gullfoss waterfall, Thingvellir rift valley",
      "Blue Lagoon & Sky Lagoon warm geothermal family baths",
      "Whale watching boat cruises from Reykjavik Old Harbour",
      "Northern Lights (Aurora Borealis) viewing during autumn/winter"
    ]
  },
  {
    "id": "orlando-fl",
    "name": "Orlando & Theme Parks, Florida",
    "country": "United States",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 28.5383,
      "lng": -81.3792
    },
    "airport_code": "MCO",
    "hero_image": "https://images.unsplash.com/photo-1597466599360-3b9775841aec?auto=format&fit=crop&w=1000&q=80",
    "short_description": "The world's premier family entertainment capital featuring Walt Disney World, Universal Studios, and endless interactive water parks.",
    "primary_categories": [
      "theme_parks",
      "entertainment",
      "water_parks",
      "relaxing"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Autumn",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "high",
    "climate_type": "subtropical",
    "flight_base_usd": {
      "low": 180,
      "avg": 320,
      "peak": 550
    },
    "lodging_daily_usd": {
      "budget_inn": 95,
      "vacation_rental": 185,
      "family_suite": 240,
      "luxury_resort": 480
    },
    "daily_food_per_person_usd": 45,
    "local_transport_daily_usd": 40,
    "highlight_features": [
      "World-class theme parks (Magic Kingdom, Islands of Adventure, Epcot)",
      "Hundreds of family resort pools and lazy rivers",
      "Kennedy Space Center day trip proximity",
      "Stroller-friendly infrastructure everywhere"
    ]
  },
  {
    "id": "san-diego-ca",
    "name": "San Diego & Coronado, California",
    "country": "United States",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 32.7157,
      "lng": -117.1611
    },
    "airport_code": "SAN",
    "hero_image": "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Perfect year-round coastal weather, renowned world-class zoo, Balboa Park museums, and family-friendly beaches like La Jolla Shores.",
    "primary_categories": [
      "animals_wildlife",
      "beaches",
      "science_museums",
      "nature"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 190,
      "avg": 340,
      "peak": 580
    },
    "lodging_daily_usd": {
      "budget_inn": 120,
      "vacation_rental": 220,
      "family_suite": 280,
      "luxury_resort": 520
    },
    "daily_food_per_person_usd": 50,
    "local_transport_daily_usd": 35,
    "highlight_features": [
      "San Diego Zoo and Safari Park (giant pandas and safari trucks)",
      "La Jolla Cove sea lions and calm tidal pools",
      "Balboa Park museums, miniature train, and carousel",
      "Legoland California day trip in Carlsbad"
    ]
  },
  {
    "id": "yellowstone-wy",
    "name": "Yellowstone & Grand Teton, Wyoming",
    "country": "United States",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 44.428,
      "lng": -110.5885
    },
    "airport_code": "BZN",
    "hero_image": "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Old Faithful geysers, Grand Prismatic Spring rainbow colors, wild bison herds in Lamar Valley, and majestic Grand Teton mountain reflections.",
    "primary_categories": [
      "nature",
      "animals_wildlife",
      "adventure",
      "science_museums"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "high",
    "climate_type": "alpine",
    "flight_base_usd": {
      "low": 280,
      "avg": 450,
      "peak": 720
    },
    "lodging_daily_usd": {
      "budget_inn": 140,
      "vacation_rental": 260,
      "family_suite": 320,
      "luxury_resort": 600
    },
    "daily_food_per_person_usd": 40,
    "local_transport_daily_usd": 55,
    "highlight_features": [
      "Old Faithful erupting geyser and wooden boardwalks",
      "Grand Prismatic Spring vibrant thermal rainbow rings",
      "Lamar Valley wildlife safari (wild bison, elk, bears)",
      "Jenny Lake scenic boat ride under the Grand Tetons"
    ]
  },
  {
    "id": "hawaii-maui-oahu",
    "name": "Maui & Oahu, Hawaii",
    "country": "United States",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 20.7984,
      "lng": -156.3319
    },
    "airport_code": "OGG",
    "hero_image": "https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Haleakala sunrise above the clouds, sea turtle snorkeling at Molokini crater, scenic Road to Hana waterfalls, Waikiki beach, and authentic luaus.",
    "primary_categories": [
      "beaches",
      "nature",
      "animals_wildlife",
      "relaxing",
      "history_culture"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Year-round"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 380,
      "avg": 620,
      "peak": 980
    },
    "lodging_daily_usd": {
      "budget_inn": 160,
      "vacation_rental": 290,
      "family_suite": 380,
      "luxury_resort": 750
    },
    "daily_food_per_person_usd": 55,
    "local_transport_daily_usd": 45,
    "highlight_features": [
      "Molokini Crater family snorkeling with wild sea turtles",
      "Haleakala volcanic summit above the cloud canopy",
      "Traditional Polynesian beachfront family luau with fire dancers",
      "Wailea and Kaanapali calm sandy resort beaches"
    ]
  },
  {
    "id": "new-york-city",
    "name": "New York City, New York",
    "country": "United States",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.006
    },
    "airport_code": "JFK",
    "hero_image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Broadway family musicals, Central Park playgrounds and zoo, Statue of Liberty ferry, American Museum of Natural History, and Top of the Rock views.",
    "primary_categories": [
      "entertainment",
      "history_culture",
      "science_museums",
      "food_culinary"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Spring",
      "Autumn",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "high",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 150,
      "avg": 280,
      "peak": 480
    },
    "lodging_daily_usd": {
      "budget_inn": 140,
      "vacation_rental": 250,
      "family_suite": 340,
      "luxury_resort": 680
    },
    "daily_food_per_person_usd": 55,
    "local_transport_daily_usd": 20,
    "highlight_features": [
      "Central Park Zoo, Alice in Wonderland statue & model sailboat pond",
      "American Museum of Natural History (giant blue whale & dinosaurs)",
      "Statue of Liberty and Ellis Island ferry cruise",
      "Broadway shows like The Lion King, Aladdin, and Wicked"
    ]
  },
  {
    "id": "banff-canada",
    "name": "Banff & Lake Louise, Canada",
    "country": "Canada",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 51.1784,
      "lng": -115.5708
    },
    "airport_code": "YYC",
    "hero_image": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Vibrant turquoise glacial waters at Lake Louise & Moraine Lake, Banff Gondola panoramic summit views, Johnston Canyon catwalks, and wild elk.",
    "primary_categories": [
      "nature",
      "animals_wildlife",
      "adventure",
      "relaxing"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Summer",
      "Winter",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "alpine",
    "flight_base_usd": {
      "low": 260,
      "avg": 420,
      "peak": 680
    },
    "lodging_daily_usd": {
      "budget_inn": 130,
      "vacation_rental": 240,
      "family_suite": 310,
      "luxury_resort": 620
    },
    "daily_food_per_person_usd": 45,
    "local_transport_daily_usd": 38,
    "highlight_features": [
      "Canoeing on world-famous Lake Louise & Moraine Lake turquoise waters",
      "Banff Gondola ride to Sulphur Mountain boardwalks",
      "Johnston Canyon lower falls suspended catwalk walk (stroller accessible)",
      "Banff Upper Hot Springs thermal mineral family pools"
    ]
  },
  {
    "id": "vancouver-bc",
    "name": "Vancouver & Whistler, Canada",
    "country": "Canada",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 49.2827,
      "lng": -123.1207
    },
    "airport_code": "YVR",
    "hero_image": "https://images.unsplash.com/photo-1559511260-66a65e09b245?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Stanley Park seawall bike trails, Capilano Suspension Bridge canopy walks, Granville Island public market, and scenic Sea-to-Sky highway to Whistler.",
    "primary_categories": [
      "nature",
      "animals_wildlife",
      "science_museums",
      "adventure",
      "food_culinary"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Summer",
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "temperate",
    "flight_base_usd": {
      "low": 250,
      "avg": 410,
      "peak": 660
    },
    "lodging_daily_usd": {
      "budget_inn": 125,
      "vacation_rental": 225,
      "family_suite": 295,
      "luxury_resort": 590
    },
    "daily_food_per_person_usd": 44,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Capilano Suspension Bridge Park & Treetops Adventure",
      "Stanley Park seawall family tandem bike rentals and totem poles",
      "Granville Island Kids Market with water park and toy shops",
      "Science World interactive geodesic dome exhibits"
    ]
  },
  {
    "id": "cancun-mexico",
    "name": "Cancun & Riviera Maya, Mexico",
    "country": "Mexico",
    "continent": "North America",
    "region": "Central America",
    "coordinates": {
      "lat": 21.1619,
      "lng": -86.8515
    },
    "airport_code": "CUN",
    "hero_image": "https://images.unsplash.com/photo-1510097467424-192d713fd8c2?auto=format&fit=crop&w=1000&q=80",
    "short_description": "All-inclusive family beach resorts, crystal underground cenote swimming, Xcaret eco-archaeological park, and Mayan pyramids of Chichen Itza.",
    "primary_categories": [
      "beaches",
      "theme_parks",
      "nature",
      "history_culture",
      "water_parks"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Winter",
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "high",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 240,
      "avg": 390,
      "peak": 650
    },
    "lodging_daily_usd": {
      "budget_inn": 85,
      "vacation_rental": 160,
      "family_suite": 230,
      "luxury_resort": 460
    },
    "daily_food_per_person_usd": 32,
    "local_transport_daily_usd": 30,
    "highlight_features": [
      "Xcaret and Xel-Há giant eco-waterparks (snorkeling with tropical fish)",
      "Swimming in freshwater open-air jungle cenotes",
      "Day trip to ancient Mayan ruins of Tulum & Chichen Itza",
      "All-inclusive beachfront resorts with kid waterparks"
    ]
  },
  {
    "id": "costa-rica",
    "name": "Costa Rica (Arenal & Manuel Antonio)",
    "country": "Costa Rica",
    "continent": "Latin America & Caribbean",
    "region": "Central America",
    "coordinates": {
      "lat": 9.7489,
      "lng": -83.7534
    },
    "airport_code": "SJO",
    "hero_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Wild sloths and monkeys in rainforest canopies, Arenal volcano hot springs, zipline adventures, hanging bridges, and Pacific surf beaches.",
    "primary_categories": [
      "nature",
      "animals_wildlife",
      "adventure",
      "beaches",
      "relaxing"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Winter",
      "Spring"
    ],
    "stroller_friendly": false,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 320,
      "avg": 520,
      "peak": 820
    },
    "lodging_daily_usd": {
      "budget_inn": 75,
      "vacation_rental": 145,
      "family_suite": 210,
      "luxury_resort": 440
    },
    "daily_food_per_person_usd": 28,
    "local_transport_daily_usd": 35,
    "highlight_features": [
      "Manuel Antonio National Park: Spot wild sloths, capuchin monkeys, toucans",
      "Arenal Volcano natural hot springs pools for all ages",
      "Mistico Arenal Hanging Bridges walk through the cloud forest",
      "Chocolate making & organic coffee plantation tours"
    ]
  },
  {
    "id": "bahamas-nassau",
    "name": "Bahamas (Nassau & Paradise Island)",
    "country": "Bahamas",
    "continent": "Latin America & Caribbean",
    "region": "Caribbean",
    "coordinates": {
      "lat": 25.0479,
      "lng": -77.3554
    },
    "airport_code": "NAS",
    "hero_image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Atlantis Aquaventure water park with Mayan temple slides, swimming with dolphins, crystal turquoise beaches, and swimming pig island day trips.",
    "primary_categories": [
      "beaches",
      "water_parks",
      "animals_wildlife",
      "relaxing"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Winter",
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 260,
      "avg": 420,
      "peak": 680
    },
    "lodging_daily_usd": {
      "budget_inn": 130,
      "vacation_rental": 240,
      "family_suite": 330,
      "luxury_resort": 680
    },
    "daily_food_per_person_usd": 48,
    "local_transport_daily_usd": 30,
    "highlight_features": [
      "Atlantis Paradise Island Aquaventure water park & lazy rivers",
      "Dolphin Cay interactive marine mammal encounters",
      "Exuma day trips to swim with friendly wild pigs & nurse sharks",
      "Cable Beach soft pink sands and calm clear shallow waters"
    ]
  },
  {
    "id": "punta-cana-dr",
    "name": "Punta Cana, Dominican Republic",
    "country": "Dominican Republic",
    "continent": "Latin America & Caribbean",
    "region": "Caribbean",
    "coordinates": {
      "lat": 18.5601,
      "lng": -68.3725
    },
    "airport_code": "PUJ",
    "hero_image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Palms lining endless turquoise Caribbean beaches, all-inclusive family beachfront resorts with waterparks, Saona Island catamarans, and Monkeyland.",
    "primary_categories": [
      "beaches",
      "water_parks",
      "relaxing",
      "animals_wildlife"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Winter",
      "Spring"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 270,
      "avg": 440,
      "peak": 710
    },
    "lodging_daily_usd": {
      "budget_inn": 80,
      "vacation_rental": 150,
      "family_suite": 220,
      "luxury_resort": 450
    },
    "daily_food_per_person_usd": 30,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Bavaro Beach calm turquoise swimming waters with coral reefs",
      "Monkeyland guided interactions with friendly squirrel monkeys",
      "Saona Island speedboat tour with shallow natural swimming pools",
      "Resort pirate ship splash pads and kids clubs"
    ]
  },
  {
    "id": "cusco-machu-picchu",
    "name": "Cusco & Machu Picchu, Peru",
    "country": "Peru",
    "continent": "Latin America & Caribbean",
    "region": "South America",
    "coordinates": {
      "lat": -13.5319,
      "lng": -71.9675
    },
    "airport_code": "CUZ",
    "hero_image": "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1000&q=80",
    "short_description": "The lost Incan city of Machu Picchu in the clouds, Sacred Valley llama and alpaca farms, panoramic glass-roof train rides, and colorful textile markets.",
    "primary_categories": [
      "history_culture",
      "nature",
      "animals_wildlife",
      "adventure"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": false,
    "crowd_level": "moderate",
    "climate_type": "alpine",
    "flight_base_usd": {
      "low": 580,
      "avg": 920,
      "peak": 1420
    },
    "lodging_daily_usd": {
      "budget_inn": 60,
      "vacation_rental": 125,
      "family_suite": 180,
      "luxury_resort": 410
    },
    "daily_food_per_person_usd": 24,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Machu Picchu Incan citadel exploration with roaming alpacas",
      "PeruRail Vistadome glass-ceiling panoramic train through the Andes",
      "Awana Kancha camelid farm (feed friendly llamas & vicunas)",
      "Pisac colorful artisan market & Maras salt terraced ponds"
    ]
  },
  {
    "id": "rio-de-janeiro-brazil",
    "name": "Rio de Janeiro & Iguazu Falls, Brazil",
    "country": "Brazil",
    "continent": "Latin America & Caribbean",
    "region": "South America",
    "coordinates": {
      "lat": -22.9068,
      "lng": -43.1729
    },
    "airport_code": "GIG",
    "hero_image": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Christ the Redeemer atop Corcovado mountain, Sugarloaf cable cars, Copacabana and Ipanema family beaches, and the awe-inspiring Iguazu Falls.",
    "primary_categories": [
      "nature",
      "beaches",
      "history_culture",
      "adventure"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Autumn",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 650,
      "avg": 1050,
      "peak": 1580
    },
    "lodging_daily_usd": {
      "budget_inn": 75,
      "vacation_rental": 145,
      "family_suite": 215,
      "luxury_resort": 460
    },
    "daily_food_per_person_usd": 30,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "Corcovado red cogwheel train up to Christ the Redeemer statue",
      "Sugarloaf Mountain twin cable car ride at sunset",
      "Iguazu Falls (275 colossal waterfalls with boardwalks into Devil's Throat)",
      "Ipanema Beach promenade with fresh coconut water stands"
    ]
  },
  {
    "id": "dubai-uae",
    "name": "Dubai & Abu Dhabi, UAE",
    "country": "United Arab Emirates",
    "continent": "Middle East & Africa",
    "region": "Middle East",
    "coordinates": {
      "lat": 25.2048,
      "lng": 55.2708
    },
    "airport_code": "DXB",
    "hero_image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Burj Khalifa 148th floor observatory, indoor Ski Dubai snow park, giant Dubai Mall aquarium, desert sunset camel safaris, and Ferrari World.",
    "primary_categories": [
      "theme_parks",
      "entertainment",
      "water_parks",
      "science_museums"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Winter",
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "subtropical",
    "flight_base_usd": {
      "low": 680,
      "avg": 1080,
      "peak": 1620
    },
    "lodging_daily_usd": {
      "budget_inn": 95,
      "vacation_rental": 180,
      "family_suite": 260,
      "luxury_resort": 550
    },
    "daily_food_per_person_usd": 42,
    "local_transport_daily_usd": 28,
    "highlight_features": [
      "Burj Khalifa observation deck & Dubai Fountain dancing water show",
      "Dubai Aquarium & Underwater Zoo giant acrylic tunnel",
      "Aquaventure Waterpark and Ski Dubai indoor snow play zone",
      "Desert 4x4 dunes safari with camel rides and bedouin dinner"
    ]
  },
  {
    "id": "venice-italy",
    "name": "Venice & Dolomites, Italy",
    "country": "Italy",
    "continent": "Europe",
    "region": "Southern Europe",
    "coordinates": {
      "lat": 45.4408,
      "lng": 12.3155
    },
    "airport_code": "VCE",
    "hero_image": "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Car-free stone bridges and canals, singing gondoliers on the Grand Canal, colorful glassblowing on Murano Island, and scenic jagged Dolomite peaks.",
    "primary_categories": [
      "history_culture",
      "nature",
      "food_culinary",
      "relaxing"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "relaxed",
    "best_seasons": [
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": false,
    "crowd_level": "high",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 570,
      "avg": 910,
      "peak": 1410
    },
    "lodging_daily_usd": {
      "budget_inn": 120,
      "vacation_rental": 210,
      "family_suite": 290,
      "luxury_resort": 610
    },
    "daily_food_per_person_usd": 44,
    "local_transport_daily_usd": 28,
    "highlight_features": [
      "Traditional wooden Gondola ride through quiet hidden canals",
      "Murano & Burano island boat trip with rainbow-painted houses",
      "St. Mark's Square pigeon feeding and Doge's Palace secret passages",
      "Scenic Dolomite mountain day trip with alpine cable cars"
    ]
  },
  {
    "id": "munich-bavaria",
    "name": "Munich & Bavarian Castles, Germany",
    "country": "Germany",
    "continent": "Europe",
    "region": "Central Europe",
    "coordinates": {
      "lat": 48.1351,
      "lng": 11.582
    },
    "airport_code": "MUC",
    "hero_image": "https://images.unsplash.com/photo-1587330979470-3595ac045ab0?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Neuschwanstein fairytale castle (inspiration for Disney's castle), massive English Garden with river surfing, Deutsches Museum technology, and BMW World.",
    "primary_categories": [
      "history_culture",
      "science_museums",
      "nature",
      "food_culinary"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn",
      "Winter"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "continental",
    "flight_base_usd": {
      "low": 540,
      "avg": 870,
      "peak": 1380
    },
    "lodging_daily_usd": {
      "budget_inn": 110,
      "vacation_rental": 200,
      "family_suite": 275,
      "luxury_resort": 550
    },
    "daily_food_per_person_usd": 42,
    "local_transport_daily_usd": 22,
    "highlight_features": [
      "Neuschwanstein Castle horse-drawn carriage day trip",
      "Deutsches Museum (one of the world's largest interactive science museums)",
      "Marienplatz historic Glockenspiel mechanical clock show",
      "English Garden giant wooden playground and beer garden pretzels"
    ]
  },
  {
    "id": "san-francisco-ca",
    "name": "San Francisco & Yosemite, California",
    "country": "United States",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 37.7749,
      "lng": -122.4194
    },
    "airport_code": "SFO",
    "hero_image": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Historic cable cars clanging over steep hills, sea lions barking at Pier 39, Exploratorium hands-on science, and giant sequoia redwoods in Yosemite.",
    "primary_categories": [
      "science_museums",
      "animals_wildlife",
      "nature",
      "history_culture"
    ],
    "target_age_groups": [
      "toddlers",
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Spring",
      "Summer",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "mediterranean",
    "flight_base_usd": {
      "low": 180,
      "avg": 320,
      "peak": 540
    },
    "lodging_daily_usd": {
      "budget_inn": 135,
      "vacation_rental": 235,
      "family_suite": 310,
      "luxury_resort": 620
    },
    "daily_food_per_person_usd": 50,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Riding open-air historic wooden Cable Cars across the hills",
      "Pier 39 barking sea lions and sourdough bread bakeries",
      "Exploratorium (hundreds of tactile interactive science exhibits)",
      "Yosemite National Park towering granite cliffs and waterfalls"
    ]
  },
  {
    "id": "grand-canyon-az",
    "name": "Grand Canyon & Sedona, Arizona",
    "country": "United States",
    "continent": "North America",
    "region": "North America",
    "coordinates": {
      "lat": 36.0544,
      "lng": -112.1401
    },
    "airport_code": "PHX",
    "hero_image": "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Awe-inspiring mile-deep Grand Canyon panoramas, historic Grand Canyon Railway steam train, red rock off-road Pink Jeep tours in Sedona, and stargazing.",
    "primary_categories": [
      "nature",
      "adventure",
      "animals_wildlife",
      "science_museums"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": true,
    "crowd_level": "moderate",
    "climate_type": "alpine",
    "flight_base_usd": {
      "low": 210,
      "avg": 350,
      "peak": 590
    },
    "lodging_daily_usd": {
      "budget_inn": 115,
      "vacation_rental": 215,
      "family_suite": 285,
      "luxury_resort": 560
    },
    "daily_food_per_person_usd": 42,
    "local_transport_daily_usd": 45,
    "highlight_features": [
      "Grand Canyon South Rim paved scenic walking trails and rim shuttles",
      "Grand Canyon Railway historic cowboy steam train from Williams",
      "Sedona red rock 4x4 Pink Jeep off-road family safari",
      "Lowell Observatory dark sky telescope stargazing in Flagstaff"
    ]
  },
  {
    "id": "cairo-egypt",
    "name": "Cairo & Giza Pyramids, Egypt",
    "country": "Egypt",
    "continent": "Middle East & Africa",
    "region": "North Africa",
    "coordinates": {
      "lat": 30.0444,
      "lng": 31.2357
    },
    "airport_code": "CAI",
    "hero_image": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1000&q=80",
    "short_description": "The Great Pyramids of Giza, the Great Sphinx, Grand Egyptian Museum King Tutankhamun gold treasures, camel rides, and scenic Nile felucca sailing.",
    "primary_categories": [
      "history_culture",
      "adventure",
      "science_museums"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "moderate",
    "best_seasons": [
      "Winter",
      "Spring",
      "Autumn"
    ],
    "stroller_friendly": false,
    "crowd_level": "moderate",
    "climate_type": "subtropical",
    "flight_base_usd": {
      "low": 680,
      "avg": 1050,
      "peak": 1580
    },
    "lodging_daily_usd": {
      "budget_inn": 55,
      "vacation_rental": 115,
      "family_suite": 170,
      "luxury_resort": 390
    },
    "daily_food_per_person_usd": 22,
    "local_transport_daily_usd": 25,
    "highlight_features": [
      "Great Pyramids of Giza and Sphinx family camel ride",
      "Grand Egyptian Museum (GEM) Tutankhamun golden burial masks",
      "Traditional wooden Felucca sailboat sunset cruise on the Nile",
      "Khan el-Khalili bazaar spice and lantern walking tour"
    ]
  },
  {
    "id": "serengeti-tanzania",
    "name": "Serengeti & Zanzibar, Tanzania",
    "country": "Tanzania",
    "continent": "Middle East & Africa",
    "region": "East Africa",
    "coordinates": {
      "lat": -2.3333,
      "lng": 34.8333
    },
    "airport_code": "JRO",
    "hero_image": "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80",
    "short_description": "The Great Wildebeest Migration, Ngorongoro volcanic crater Big Five safari (lions, giraffes, zebras), and Zanzibar white sand spice island beaches.",
    "primary_categories": [
      "animals_wildlife",
      "nature",
      "beaches",
      "adventure"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Summer",
      "Winter",
      "Autumn"
    ],
    "stroller_friendly": false,
    "crowd_level": "low",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 950,
      "avg": 1450,
      "peak": 2100
    },
    "lodging_daily_usd": {
      "budget_inn": 120,
      "vacation_rental": 220,
      "family_suite": 350,
      "luxury_resort": 750
    },
    "daily_food_per_person_usd": 40,
    "local_transport_daily_usd": 65,
    "highlight_features": [
      "Open-roof 4x4 Land Cruiser safari game drives spotting lions and cheetahs",
      "Ngorongoro Crater (world's largest intact volcanic caldera wildlife haven)",
      "Zanzibar Stone Town spice tours and crystal coral beach resorts",
      "Hot air balloon safari at sunrise over the Serengeti plains"
    ]
  },
  {
    "id": "galapagos-ecuador",
    "name": "Galapagos Islands, Ecuador",
    "country": "Ecuador",
    "continent": "Latin America & Caribbean",
    "region": "South America",
    "coordinates": {
      "lat": -0.9538,
      "lng": -90.9656
    },
    "airport_code": "GPS",
    "hero_image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
    "short_description": "Close encounters with wild giant tortoises, swimming with playful sea lions and penguins, marine iguanas on black lava, and pristine protected bays.",
    "primary_categories": [
      "animals_wildlife",
      "nature",
      "adventure",
      "beaches",
      "science_museums"
    ],
    "target_age_groups": [
      "kids",
      "tweens",
      "teens",
      "adults"
    ],
    "pacing": "active",
    "best_seasons": [
      "Year-round"
    ],
    "stroller_friendly": false,
    "crowd_level": "low",
    "climate_type": "tropical",
    "flight_base_usd": {
      "low": 720,
      "avg": 1150,
      "peak": 1680
    },
    "lodging_daily_usd": {
      "budget_inn": 90,
      "vacation_rental": 180,
      "family_suite": 260,
      "luxury_resort": 580
    },
    "daily_food_per_person_usd": 38,
    "local_transport_daily_usd": 40,
    "highlight_features": [
      "Charles Darwin Research Station & giant tortoise breeding sanctuary",
      "Snorkeling with friendly wild sea lion pups and green sea turtles",
      "Bartolomé Island iconic volcanic pinnacle rock and penguin encounters",
      "Tortuga Bay soft white sand beach and marine iguana trails"
    ]
  }
];

// Curated Global Events & Seasonal Festivals
export const CURATED_EVENTS = [
  {
    id: "seoul-lantern",
    destination_keywords: ["korea", "seoul", "south korea"],
    name: "Seoul Lantern & Cheonggyecheon Light Festival",
    category: "Cultural Festival & Light Spectacle",
    months: [10, 11, 12],
    display_dates: "November – December (Nightly from 6:00 PM)",
    price_per_person_usd: 0,
    price_tier: "Free Public Event",
    family_tag: "All Ages Spectacle",
    description: "Hundreds of illuminated giant traditional lanterns and modern 3D light sculptures floating along the scenic Cheonggyecheon Stream in central Seoul.",
    tips: "Very stroller friendly with paved ramp access; visit around 6:30 PM right as lanterns turn on."
  },
  {
    id: "seoul-cherry-blossom",
    destination_keywords: ["korea", "seoul", "yeouido"],
    name: "Yeouido Spring Flower & Cherry Blossom Festival",
    category: "Nature & Floral Festival",
    months: [3, 4],
    display_dates: "Early to Mid April",
    price_per_person_usd: 0,
    price_tier: "Free Public Event",
    family_tag: "Kid & Toddler Friendly",
    description: "Over 1,800 blooming Yoshino cherry trees lining the Han River with street food carts, live acoustic performances, and face painting.",
    tips: "Rent a four-person family bicycle at Yeouido Hangang Park for a fun ride under the blossoms."
  },
  {
    id: "tokyo-cherry-blossom",
    destination_keywords: ["japan", "tokyo", "kyoto"],
    name: "Tokyo & Kyoto Cherry Blossom (Hanami) Festivities",
    category: "Cultural Festival & Hanami",
    months: [3, 4],
    display_dates: "Late March – Mid April",
    price_per_person_usd: 0,
    price_tier: "Free Public Event",
    family_tag: "Must-See Cultural Event",
    description: "Iconic cherry blossom picnics beneath blooming sakura trees in Ueno Park, Shinjuku Gyoen, and the illuminated Meguro River.",
    tips: "Pick up bento boxes from a local depachika (department store basement) for a family hanami picnic."
  },
  {
    id: "tokyo-illumination",
    destination_keywords: ["japan", "tokyo", "kyoto"],
    name: "Tokyo Winter Illuminations & Roppongi Hills Light Walk",
    category: "Holiday Lights & Night Walk",
    months: [11, 12, 1, 2],
    display_dates: "Mid November – Mid February",
    price_per_person_usd: 0,
    price_tier: "Free Public Event",
    family_tag: "Magical Evening Event",
    description: "Millions of sparkling LED lights transforming Roppongi Hills, Shibuya Blue Cave, and Tokyo Midtown into an enchanting winter wonderland.",
    tips: "Bundle up and visit Shibuya Sky rooftop for breathtaking city views above the illuminations."
  },
  {
    id: "orlando-food-wine",
    destination_keywords: ["orlando", "florida", "disney"],
    name: "Epcot International Food & Wine Festival",
    category: "Food & Culinary Celebration",
    months: [7, 8, 9, 10, 11],
    display_dates: "Late July – Mid November",
    price_per_person_usd: 0,
    price_tier: "Included with Theme Park Ticket",
    family_tag: "Family Foodie Favorite",
    description: "Global culinary marketplace featuring 30+ international food kiosks, Remy's Ratatouille scavenger hunt for kids, and live concerts.",
    tips: "Kids love the Remy sticker hunt map available at the park entrance."
  },
  {
    id: "orlando-halloween",
    destination_keywords: ["orlando", "florida"],
    name: "Mickey's Not-So-Scary Halloween Party",
    category: "Family Holiday Celebration",
    months: [8, 9, 10],
    display_dates: "August – October 31 (Select Evenings)",
    price_per_person_usd: 125,
    price_tier: "$$$ Ticketed",
    family_tag: "Kids & Toddlers Favorite",
    description: "Trick-or-treating throughout Magic Kingdom, special character costume meet-and-greets, Boo-to-You Parade, and Halloween fireworks.",
    tips: "Costumes are encouraged for all family members; trick-or-treat bags provided."
  },
  {
    id: "orlando-christmas",
    destination_keywords: ["orlando", "florida"],
    name: "Mickey's Very Merry Christmas Party & Epcot Festival of Holidays",
    category: "Holiday Spectacular & Snowfall",
    months: [11, 12],
    display_dates: "November 8 – December 31",
    price_per_person_usd: 135,
    price_tier: "$$$ Ticketed",
    family_tag: "Holiday Spectacle",
    description: "Magical snowfall on Main Street U.S.A., free holiday cookies and hot cocoa, holiday fireworks, and candlelight processional.",
    tips: "Arrive at 4:00 PM with the special event ticket to get 3 extra hours in the park before evening shows start."
  },
  {
    id: "london-winter-wonderland",
    destination_keywords: ["london", "united kingdom", "uk"],
    name: "Hyde Park Winter Wonderland",
    category: "Christmas Market & Fairground",
    months: [11, 12, 1],
    display_dates: "Mid November – Early January",
    price_per_person_usd: 0,
    price_tier: "Free Entry (Off-Peak) / Ticketed Rides",
    family_tag: "Major Family Holiday Event",
    description: "London's ultimate Christmas destination with ice skating rink, giant observation wheel, Bavarian village, ice slide, and circus shows.",
    tips: "Book off-peak weekday daytime entry tickets in advance for free admission."
  },
  {
    id: "paris-bastille-day",
    destination_keywords: ["paris", "france"],
    name: "Bastille Day Celebrations & Eiffel Tower Fireworks",
    category: "National Celebration & Fireworks",
    months: [7],
    display_dates: "July 14",
    price_per_person_usd: 0,
    price_tier: "Free Public Event",
    family_tag: "Iconic Fireworks Spectacle",
    description: "Grand military parade along the Champs-Élysées, free classical concert on Champ de Mars, and breathtaking 30-minute Eiffel Tower fireworks.",
    tips: "Watch the fireworks with kids from Pont de Bir-Hakeim or Trocadéro gardens for clear views."
  },
  {
    id: "cancun-day-of-dead",
    destination_keywords: ["cancun", "riviera maya", "mexico"],
    name: "Xcaret Festival of Life and Death Traditions (Día de los Muertos)",
    category: "Cultural Heritage & Traditions",
    months: [10, 11],
    display_dates: "October 30 – November 3",
    price_per_person_usd: 45,
    price_tier: "$$ Special Event",
    family_tag: "Unforgettable Cultural Magic",
    description: "Vibrant Mexican Day of the Dead celebration with marigold altars, sugar skull face painting, theatrical plays, Mayan rituals, and artisanal culinary feasts.",
    tips: "Children get free face painting; evening events feature gentle candlelit parades."
  }
];

// Discover Local Events & Seasonal Festivals for ANY destination and timeframe
export function getSeasonalEvents(destinationName, travelMonth = null, monthPeriod = 'all') {
  const destStr = (destinationName || '').toLowerCase();
  const monthNum = travelMonth || (new Date().getMonth() + 1); // 1-12
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[monthNum - 1] || "Selected Month";

  // 1. Check curated database for matching events
  const matched = CURATED_EVENTS.filter((ev) => {
    const destMatch = ev.destination_keywords.some(k => destStr.includes(k));
    const monthMatch = !travelMonth || ev.months.includes(monthNum);
    return destMatch && monthMatch;
  });

  if (matched.length > 0) {
    return matched;
  }

  // 2. Dynamic Seasonal Festival Synthesizer for ANY city on Earth
  const cityName = destinationName.split(',')[0].trim();
  const periodLabel = monthPeriod === 'beginning' ? 'Early' : monthPeriod === 'middle' ? 'Mid' : monthPeriod === 'end' ? 'Late' : '';
  const timeWindow = `${periodLabel} ${currentMonthName}`.trim();

  const seasonalTemplates = [
    // Spring (Mar, Apr, May)
    {
      season: "Spring",
      months: [3, 4, 5],
      name: `${cityName} Spring Cultural & Flower Fair`,
      category: "Floral Arts & Cultural Street Fair",
      display_dates: `${timeWindow} (Seasonal Annual Celebration)`,
      price_per_person_usd: 0,
      price_tier: "Free Public Event",
      family_tag: "Great for All Ages",
      description: `Vibrant community celebration welcoming spring in ${cityName} with botanical flower displays, open-air food markets, artisan crafts, and children's activity zones.`,
      tips: "Great weekend daytime event with shaded lawn seating for family picnics."
    },
    // Summer (Jun, Jul, Aug)
    {
      season: "Summer",
      months: [6, 7, 8],
      name: `${cityName} Summer Waterfront & Night Food Festival`,
      category: "Food Market & Live Music",
      display_dates: `${timeWindow} (Evenings from 5:30 PM)`,
      price_per_person_usd: 0,
      price_tier: "Free Entry",
      family_tag: "Kid & Teen Friendly",
      description: `Lively summer evening street festival in ${cityName} featuring local food trucks, ice cream pop-ups, regional live acoustic bands, and interactive street performers.`,
      tips: "Arrive around sunset for cooler temperatures and vibrant night ambiance."
    },
    // Autumn (Sep, Oct, Nov)
    {
      season: "Autumn",
      months: [9, 10, 11],
      name: `${cityName} Autumn Harvest & Evening Lantern Walk`,
      category: "Cultural Festival & Light Spectacle",
      display_dates: `${timeWindow} (Nightly Illumination)`,
      price_per_person_usd: 0,
      price_tier: "Free Public Event",
      family_tag: "Family Favorite Spectacle",
      description: `Charming fall seasonal celebration in ${cityName} with illuminated evening light installations, seasonal apple & pumpkin treats, craft workshops, and family music.`,
      tips: "Kids can participate in free evening lantern decorating workshops."
    },
    // Winter (Dec, Jan, Feb)
    {
      season: "Winter",
      months: [12, 1, 2],
      name: `${cityName} Winter Holiday Village & Light Celebration`,
      category: "Holiday Village & Artisan Market",
      display_dates: `${timeWindow} (Daily from 11:00 AM)`,
      price_per_person_usd: 0,
      price_tier: "Free Entry",
      family_tag: "Magical Holiday Event",
      description: `Enchanting winter holiday market in ${cityName} featuring festive wooden stalls, hot chocolate and warm pastries, decorative light arches, and seasonal photo spots.`,
      tips: "Bundle up warmly; stroller accessible along main town square promenades."
    }
  ];

  const matchedTemplate = seasonalTemplates.find(t => t.months.includes(monthNum)) || seasonalTemplates[0];

  return [
    matchedTemplate,
    {
      name: `${cityName} Heritage Sights & Weekend Artisan Market`,
      category: "Local Culture & Family Discovery",
      display_dates: `Every Weekend during ${currentMonthName}`,
      price_per_person_usd: 0,
      price_tier: "Free Entry",
      family_tag: "All Ages",
      description: `Weekend pedestrian market showcasing local painters, handmade family souvenirs, baked goods, and cultural storytelling.`,
      tips: "Best visited between 10:00 AM and 1:00 PM for the freshest baked snacks."
    }
  ];
}

// Curated Global Major Airports Dataset for instant autocomplete & IATA resolution
export const GLOBAL_AIRPORTS = [
  // North America
  { code: "OMA", city: "Omaha", name: "Eppley Airfield", country: "United States", lat: 41.3032, lng: -95.8941 },
  { code: "MCI", city: "Kansas City", name: "Kansas City International", country: "United States", lat: 39.2976, lng: -94.7139 },
  { code: "STL", city: "St. Louis", name: "St. Louis Lambert International", country: "United States", lat: 38.7487, lng: -90.3700 },
  { code: "MSP", city: "Minneapolis", name: "Minneapolis-Saint Paul Int'l", country: "United States", lat: 44.8848, lng: -93.2223 },
  { code: "ORD", city: "Chicago", name: "O'Hare International Airport", country: "United States", lat: 41.9742, lng: -87.9073 },
  { code: "MDW", city: "Chicago", name: "Chicago Midway International", country: "United States", lat: 41.7868, lng: -87.7522 },
  { code: "DEN", city: "Denver", name: "Denver International Airport", country: "United States", lat: 39.8561, lng: -104.6737 },
  { code: "DFW", city: "Dallas/Fort Worth", name: "Dallas/Fort Worth Int'l", country: "United States", lat: 32.8998, lng: -97.0403 },
  { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta Int'l", country: "United States", lat: 33.6407, lng: -84.4277 },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International Airport", country: "United States", lat: 33.9416, lng: -118.4085 },
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States", lat: 40.6413, lng: -73.7781 },
  { code: "EWR", city: "New York/Newark", name: "Newark Liberty International", country: "United States", lat: 40.6895, lng: -74.1745 },
  { code: "LGA", city: "New York", name: "LaGuardia Airport", country: "United States", lat: 40.7769, lng: -73.8740 },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States", lat: 37.6213, lng: -122.3790 },
  { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "United States", lat: 47.4502, lng: -122.3088 },
  { code: "LAS", city: "Las Vegas", name: "Harry Reid International Airport", country: "United States", lat: 36.0840, lng: -115.1537 },
  { code: "MCO", city: "Orlando", name: "Orlando International Airport", country: "United States", lat: 28.4312, lng: -81.3081 },
  { code: "MIA", city: "Miami", name: "Miami International Airport", country: "United States", lat: 25.7959, lng: -80.2870 },
  { code: "BOS", city: "Boston", name: "Boston Logan International", country: "United States", lat: 42.3656, lng: -71.0096 },
  { code: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "United States", lat: 29.9902, lng: -95.3368 },
  { code: "PHX", city: "Phoenix", name: "Phoenix Sky Harbor International", country: "United States", lat: 33.4373, lng: -112.0078 },
  { code: "SAN", city: "San Diego", name: "San Diego International Airport", country: "United States", lat: 32.7338, lng: -117.1933 },
  { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International", country: "United States", lat: 21.3187, lng: -157.9224 },
  { code: "BNA", city: "Nashville", name: "Nashville International Airport", country: "United States", lat: 36.1263, lng: -86.6774 },
  { code: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada", lat: 43.6777, lng: -79.6248 },
  { code: "YVR", city: "Vancouver", name: "Vancouver International Airport", country: "Canada", lat: 49.1967, lng: -123.1815 },
  { code: "YUL", city: "Montreal", name: "Montréal-Trudeau International", country: "Canada", lat: 45.4706, lng: -73.7408 },
  { code: "MEX", city: "Mexico City", name: "Benito Juárez International", country: "Mexico", lat: 19.4361, lng: -99.0719 },
  { code: "CUN", city: "Cancun", name: "Cancún International Airport", country: "Mexico", lat: 21.0365, lng: -86.8771 },

  // Europe
  { code: "LHR", city: "London", name: "London Heathrow Airport", country: "United Kingdom", lat: 51.4700, lng: -0.4543 },
  { code: "LGW", city: "London", name: "London Gatwick Airport", country: "United Kingdom", lat: 51.1537, lng: -0.1821 },
  { code: "CDG", city: "Paris", name: "Paris Charles de Gaulle Airport", country: "France", lat: 49.0097, lng: 2.5479 },
  { code: "ORY", city: "Paris", name: "Paris Orly Airport", country: "France", lat: 48.7262, lng: 2.3652 },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany", lat: 50.0379, lng: 8.5622 },
  { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany", lat: 48.3537, lng: 11.7750 },
  { code: "AMS", city: "Amsterdam", name: "Amsterdam Airport Schiphol", country: "Netherlands", lat: 52.3105, lng: 4.7683 },
  { code: "MAD", city: "Madrid", name: "Adolfo Suárez Madrid-Barajas", country: "Spain", lat: 40.4839, lng: -3.5680 },
  { code: "BCN", city: "Barcelona", name: "Josep Tarradellas Barcelona-El Prat", country: "Spain", lat: 41.2974, lng: 2.0833 },
  { code: "FCO", city: "Rome", name: "Rome Fiumicino Airport", country: "Italy", lat: 41.8003, lng: 12.2389 },
  { code: "MXP", city: "Milan", name: "Milan Malpensa Airport", country: "Italy", lat: 45.6301, lng: 8.7255 },
  { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland", lat: 47.4582, lng: 8.5555 },
  { code: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland", lat: 53.4264, lng: -6.2499 },
  { code: "VIE", city: "Vienna", name: "Vienna International Airport", country: "Austria", lat: 48.1103, lng: 16.5697 },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey", lat: 41.2753, lng: 28.7519 },
  { code: "ATH", city: "Athens", name: "Athens International Airport", country: "Greece", lat: 37.9364, lng: 23.9445 },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado Airport", country: "Portugal", lat: 38.7756, lng: -9.1354 },

  // Asia & Middle East
  { code: "ICN", city: "Seoul", name: "Incheon International Airport", country: "South Korea", lat: 37.4602, lng: 126.4407 },
  { code: "GMP", city: "Seoul", name: "Gimpo International Airport", country: "South Korea", lat: 37.5583, lng: 126.7906 },
  { code: "HND", city: "Tokyo", name: "Tokyo Haneda Airport", country: "Japan", lat: 35.5494, lng: 139.7798 },
  { code: "NRT", city: "Tokyo", name: "Narita International Airport", country: "Japan", lat: 35.7720, lng: 140.3929 },
  { code: "KIX", city: "Osaka", name: "Kansai International Airport", country: "Japan", lat: 34.4320, lng: 135.2304 },
  { code: "SIN", city: "Singapore", name: "Singapore Changi Airport", country: "Singapore", lat: 1.3644, lng: 103.9915 },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International Airport", country: "Hong Kong", lat: 22.3080, lng: 113.9185 },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand", lat: 13.6900, lng: 100.7501 },
  { code: "TPE", city: "Taipei", name: "Taiwan Taoyuan International", country: "Taiwan", lat: 25.0797, lng: 121.2342 },
  { code: "PVG", city: "Shanghai", name: "Shanghai Pudong International", country: "China", lat: 31.1443, lng: 121.8083 },
  { code: "PEK", city: "Beijing", name: "Beijing Capital International", country: "China", lat: 40.0799, lng: 116.6031 },
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "United Arab Emirates", lat: 25.2532, lng: 55.3657 },
  { code: "DOH", city: "Doha", name: "Hamad International Airport", country: "Qatar", lat: 25.2731, lng: 51.6081 },
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi International", country: "India", lat: 28.5562, lng: 77.1000 },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj Int'l", country: "India", lat: 19.0896, lng: 72.8656 },

  // Oceania, Latin America & Africa
  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith Airport", country: "Australia", lat: -33.9399, lng: 151.1753 },
  { code: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia", lat: -37.6690, lng: 144.8410 },
  { code: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand", lat: -37.0082, lng: 174.7850 },
  { code: "GRU", city: "São Paulo", name: "São Paulo/Guarulhos International", country: "Brazil", lat: -23.4356, lng: -46.4731 },
  { code: "EZE", city: "Buenos Aires", name: "Ezeiza International Airport", country: "Argentina", lat: -34.8222, lng: -58.5358 },
  { code: "SCL", city: "Santiago", name: "Arturo Merino Benítez International", country: "Chile", lat: -33.3930, lng: -70.7858 },
  { code: "BOG", city: "Bogotá", name: "El Dorado International Airport", country: "Colombia", lat: 4.7016, lng: -74.1469 },
  { code: "JNB", city: "Johannesburg", name: "O. R. Tambo International Airport", country: "South Africa", lat: -26.1367, lng: 28.2411 },
  { code: "CPT", city: "Cape Town", name: "Cape Town International Airport", country: "South Africa", lat: -33.9715, lng: 18.6021 },
  { code: "CAI", city: "Cairo", name: "Cairo International Airport", country: "Egypt", lat: 30.1219, lng: 31.4056 }
];

// Live Global Airport Search supporting any IATA code, city, country, or custom airport on Earth
export async function searchGlobalAirports(query) {
  if (!query || query.trim().length < 1) return GLOBAL_AIRPORTS.slice(0, 10);
  const q = query.trim().toLowerCase();

  // 1. Check local airport database
  const matches = GLOBAL_AIRPORTS.filter((a) =>
    a.code.toLowerCase().startsWith(q) ||
    a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q)
  );

  if (matches.length >= 4) {
    return matches.slice(0, 8).map(a => ({
      label: `${a.city} (${a.code}) - ${a.name}, ${a.country}`,
      shortLabel: `${a.city} (${a.code})`,
      ...a
    }));
  }

  // 2. Query Nominatim for dynamic global airports not in top list
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' airport')}&addressdetails=1&limit=5`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (res.ok) {
      const data = await res.json();
      const dynamicAirports = data.map((item, idx) => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.municipality || item.name.split(' ')[0];
        const country = addr.country || 'Global';
        const code = (item.name.match(/\b([A-Z]{3})\b/) || [null, (city.slice(0, 3).toUpperCase())])[1];

        return {
          code: code || `AIR${idx}`,
          city: city,
          name: item.name || item.display_name.split(',')[0],
          country: country,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          label: `${city} (${code}) - ${item.name.split(',')[0]}, ${country}`,
          shortLabel: `${city} (${code})`
        };
      });

      const combined = [...matches.map(a => ({
        label: `${a.city} (${a.code}) - ${a.name}, ${a.country}`,
        shortLabel: `${a.city} (${a.code})`,
        ...a
      })), ...dynamicAirports];

      return combined.slice(0, 8);
    }
  } catch (err) {
    console.warn("Dynamic airport lookup error:", err);
  }

  return matches.slice(0, 8).map(a => ({
    label: `${a.city} (${a.code}) - ${a.name}, ${a.country}`,
    shortLabel: `${a.city} (${a.code})`,
    ...a
  }));
}

// Utility to calculate Great-Circle distance between two coordinates in miles
export function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Live Global Autocomplete Search for ANY location on Earth via OpenStreetMap Nominatim
export async function searchGlobalLocations(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&addressdetails=1&limit=6`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data.map((item) => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || item.name;
        const state = addr.state || addr.province || addr.region || '';
        const country = addr.country || '';
        
        let label = city;
        if (state && state !== city) label += `, ${state}`;
        if (country && country !== state) label += `, ${country}`;

        return {
          label: label || item.display_name,
          city: city,
          country: country || 'Global',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type || 'place',
          display_name: item.display_name
        };
      });
    }
  } catch (err) {
    console.warn("Nominatim global search error:", err);
  }
  return [];
}

// Live Weather forecast for ANY coordinates on Earth via Open-Meteo
export async function fetchLiveWeather(lat, lng) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&temperature_unit=fahrenheit&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const daily = data.daily || {};
      const maxTemps = daily.temperature_2m_max || [75];
      const minTemps = daily.temperature_2m_min || [60];
      const rainChances = daily.precipitation_probability_max || [10];
      const weatherCodes = daily.weathercode || [0];

      const avgHigh = Math.round(maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length);
      const avgLow = Math.round(minTemps.reduce((a, b) => a + b, 0) / minTemps.length);

      const getWeatherDesc = (code) => {
        if (code === 0) return "Sunny & Clear";
        if (code <= 3) return "Partly Cloudy";
        if (code <= 48) return "Foggy & Overcast";
        if (code <= 67) return "Light Rain / Drizzle";
        if (code <= 77) return "Snow Flurries";
        if (code <= 82) return "Passing Rain Showers";
        if (code <= 99) return "Thunderstorms";
        return "Pleasant Weather";
      };

      const forecast = (daily.time || []).slice(0, 5).map((dateStr, idx) => ({
        date: `Day ${idx + 1} (${dateStr.slice(5)})`,
        high_f: Math.round(maxTemps[idx] || avgHigh),
        low_f: Math.round(minTemps[idx] || avgLow),
        rain_chance: rainChances[idx] || 15,
        condition: getWeatherDesc(weatherCodes[idx] || 0)
      }));

      return {
        avg_temp_f: avgHigh,
        summary: `Live forecast: Highs of ~${avgHigh}°F with ${forecast[0]?.condition || 'pleasant conditions'}.`,
        forecast: forecast.length > 0 ? forecast : undefined
      };
    }
  } catch (err) {
    console.warn("Open-Meteo live weather fetch failed, using realistic fallback:", err);
  }
  return {
    avg_temp_f: 76,
    summary: "Comfortable seasonal temperatures and clear skies expected.",
    forecast: [
      { date: "Day 1", high_f: 78, low_f: 62, rain_chance: 10, condition: "Sunny" },
      { date: "Day 2", high_f: 80, low_f: 64, rain_chance: 15, condition: "Partly Cloudy" },
      { date: "Day 3", high_f: 77, low_f: 61, rain_chance: 5, condition: "Sunny" }
    ]
  };
}
// Helper to create a rich custom destination for ANY user input
export function createCustomDestination(queryName, stopIndex = 0) {
  const cleanName = (queryName || `Destination #${stopIndex + 1}`).trim();
  const lower = cleanName.toLowerCase();

  let country = "International Destination";
  let lat = 35.0 + (stopIndex * 2);
  let lng = 120.0 + (stopIndex * 5);
  let airport = "INTL";
  let heroImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80";
  let flightLow = 650;
  let flightAvg = 980;
  let flightPeak = 1480;
  let categories = ["history_culture", "food_culinary", "nature", "science_museums", "entertainment"];

  if (lower.includes("korea") || lower.includes("seoul") || lower.includes("busan") || lower.includes("jeju")) {
    country = "South Korea";
    lat = 37.5665;
    lng = 126.9780;
    airport = "ICN";
    heroImage = "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1000&q=80";
    flightLow = 680; flightAvg = 1050; flightPeak = 1550;
    categories = ["theme_parks", "history_culture", "food_culinary", "science_museums", "nature"];
  } else if (lower.includes("japan") || lower.includes("tokyo") || lower.includes("kyoto") || lower.includes("osaka")) {
    country = "Japan";
    lat = 35.6762;
    lng = 139.6503;
    airport = "NRT";
    heroImage = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80";
    flightLow = 720; flightAvg = 1120; flightPeak = 1650;
    categories = ["theme_parks", "science_museums", "history_culture", "food_culinary", "nature"];
  } else if (lower.includes("uk") || lower.includes("london") || lower.includes("england") || lower.includes("britain")) {
    country = "United Kingdom";
    lat = 51.5074;
    lng = -0.1278;
    airport = "LHR";
    heroImage = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80";
    flightLow = 520; flightAvg = 850; flightPeak = 1350;
    categories = ["history_culture", "science_museums", "entertainment", "food_culinary"];
  } else if (lower.includes("france") || lower.includes("paris")) {
    country = "France";
    lat = 48.8566;
    lng = 2.3522;
    airport = "CDG";
    heroImage = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80";
    flightLow = 540; flightAvg = 880; flightPeak = 1390;
    categories = ["history_culture", "theme_parks", "food_culinary", "relaxing"];
  } else if (lower.includes("italy") || lower.includes("rome") || lower.includes("florence") || lower.includes("venice")) {
    country = "Italy";
    lat = 41.9028;
    lng = 12.4964;
    airport = "FCO";
    heroImage = "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80";
    flightLow = 560; flightAvg = 890; flightPeak = 1400;
  } else if (lower.includes("australia") || lower.includes("sydney") || lower.includes("melbourne")) {
    country = "Australia";
    lat = -33.8688;
    lng = 151.2093;
    airport = "SYD";
    heroImage = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1000&q=80";
    flightLow = 890; flightAvg = 1350; flightPeak = 1950;
    categories = ["beaches", "animals_wildlife", "nature", "adventure", "food_culinary"];
  } else if (lower.includes("canada") || lower.includes("banff") || lower.includes("vancouver") || lower.includes("toronto")) {
    country = "Canada";
    lat = 51.1784;
    lng = -115.5708;
    airport = "YYC";
    heroImage = "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1000&q=80";
    flightLow = 260; flightAvg = 420; flightPeak = 680;
    categories = ["nature", "animals_wildlife", "adventure", "relaxing"];
  } else if (lower.includes("beach") || lower.includes("island") || lower.includes("caribbean") || lower.includes("bahamas") || lower.includes("cancun")) {
    categories = ["beaches", "water_parks", "relaxing", "nature"];
    flightLow = 290; flightAvg = 480; flightPeak = 750;
  }

  const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  const displayName = capitalized.includes(',') ? capitalized : `${capitalized}, ${country}`;

  return {
    id: `custom-${lower.replace(/[^a-z0-9]/g, '-').slice(0, 15)}-${stopIndex}`,
    name: displayName,
    country: country,
    region: "Global Destination",
    coordinates: { lat, lng },
    airport_code: airport,
    hero_image: heroImage,
    short_description: `Custom family destination exploring ${displayName} with tailored cultural discoveries, local cuisine, scenic landmarks, and child-friendly activities.`,
    primary_categories: categories,
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "moderate",
    best_seasons: ["Spring", "Autumn", "Summer"],
    stroller_friendly: true,
    crowd_level: "moderate",
    climate_type: "temperate",
    flight_base_usd: { low: flightLow, avg: flightAvg, peak: flightPeak },
    lodging_daily_usd: { budget_inn: 90, vacation_rental: 165, family_suite: 245, luxury_resort: 490 },
    daily_food_per_person_usd: 40,
    local_transport_daily_usd: 30,
    highlight_features: [
      `Explore historic landmarks & cultural monuments in ${capitalized.split(',')[0]}`,
      `Authentic regional cuisine & family food markets`,
      `Scenic city parks, discovery centers, and walking promenades`
    ]
  };
}

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

export async function discoverDynamicWorldwideDestinations(req) {
  const userKey = localStorage.getItem('gemini_api_key') || import.meta.env?.VITE_GEMINI_API_KEY;
  const family = req.family_members || [];
  const likes = req.likes || [];
  const dislikes = req.dislikes || [];
  const origin = req.origin_city || 'ORD';
  const budget = req.budget_tier || 'moderate';

  // 1. If Gemini AI is active, dynamically discover 8-12 unique worldwide destinations tailored to this exact family!
  if (userKey && userKey.trim().length > 10) {
    try {
      const prompt = `You are an expert global travel discovery algorithm.
Analyze this family travel profile and dynamically discover 8 to 12 diverse, exciting travel destinations ANYWHERE across the world (spanning different continents, including famous capitals and scenic gems).

FAMILY TRAVEL PROFILE:
- Travelers: ${JSON.stringify(family)}
- Interests/Likes: ${likes.join(', ')}
- Constraints/Dislikes: ${dislikes.join(', ')}
- Departure Origin: ${origin}
- Budget Tier: ${budget}
- Travel Month: ${req.travel_month || 'Flexible'}

Return a JSON ARRAY of 8 to 12 destination objects with these exact fields:
- "id": unique string slug (e.g. "azores-portugal", "kyushu-japan")
- "name": Full name (e.g. "Azores & São Miguel, Portugal")
- "country": Country name
- "continent": One of ["Asia & Pacific", "Europe", "North America", "Latin America & Caribbean", "Middle East & Africa"]
- "region": Regional area
- "coordinates": {"lat": float, "lng": float}
- "airport_code": 3-letter IATA code
- "hero_image": Unsplash travel photo URL
- "short_description": 1-2 sentence compelling summary for this family
- "primary_categories": array of matching categories from ["theme_parks", "beaches", "nature", "animals_wildlife", "science_museums", "food_culinary", "history_culture", "adventure", "relaxing"]
- "target_age_groups": array from ["toddlers", "kids", "tweens", "teens", "adults"]
- "pacing": "relaxed" or "moderate" or "active"
- "best_seasons": ["Spring", "Summer", "Autumn", "Winter"]
- "stroller_friendly": boolean
- "crowd_level": "low" or "moderate" or "high"
- "climate_type": "mediterranean", "tropical", "temperate", "alpine", or "subtropical"
- "flight_base_usd": {"low": int, "avg": int, "peak": int}
- "lodging_daily_usd": {"budget_inn": int, "vacation_rental": int, "family_suite": int, "luxury_resort": int}
- "daily_food_per_person_usd": int
- "local_transport_daily_usd": int
- "highlight_features": array of 4 bullet points

Return strictly valid JSON array only.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(userKey.trim())}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: 'application/json' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn("Dynamic AI discovery fallback:", e);
    }
  }
  return null;
}

export async function fetchRecommendations(payload) {
  if (API_BASE_URL) {
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
  }

  // Resilient client-side calculation (with full international & multi-stop support)
  return await generateClientRecommendations(payload);
}

export async function checkBackendHealth() {
  if (!API_BASE_URL) return false;
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function generateClientRecommendations(req) {
  const family = req.family_members && req.family_members.length > 0
    ? req.family_members
    : [{ name: "Adult", age: 35 }, { name: "Child", age: 8 }];
  
  const likes = req.likes || [];
  const dislikes = req.dislikes || [];
  const numPeople = family.length;

  // Process stops
  let stops = [];
  if (req.destinations && req.destinations.length > 0) {
    stops = req.destinations.filter(s => s.destination && s.destination.trim());
  } else if (req.preferred_destination && req.preferred_destination.trim()) {
    stops = [{ destination: req.preferred_destination.trim(), duration_days: req.duration_days || 5 }];
  }

  // AUTO-RECOMMEND MODE: If no destination specified, discover candidates dynamically!
  let allRankedDestinations = [];
  const isOpenSearch = stops.length === 0;
  const tripDuration = req.duration_days || 5;

  const originStr = (req.origin_city || req.origin_airport || 'Chicago (ORD)').toLowerCase();
  const originAirport = GLOBAL_AIRPORTS.find(a => 
    originStr.includes(a.code.toLowerCase()) || 
    originStr.includes(a.city.toLowerCase())
  ) || { code: "ORD", city: "Chicago", lat: 41.9742, lng: -87.9073 };
  const budgetTier = (req.budget_tier || 'moderate').toLowerCase();

  if (isOpenSearch) {
    // Attempt dynamic AI discovery first
    const dynamicCandidates = await discoverDynamicWorldwideDestinations(req);
    
    // Combine dynamic candidates with worldwide atlas
    let candidatePool = fallbackDestinations;
    if (dynamicCandidates && Array.isArray(dynamicCandidates) && dynamicCandidates.length > 0) {
      const dynamicIds = new Set(dynamicCandidates.map(d => d.id || d.name));
      candidatePool = [...dynamicCandidates, ...fallbackDestinations.filter(d => !dynamicIds.has(d.id) && !dynamicIds.has(d.name))];
    }

    // Score all destinations against family preferences, age groups, and origin distance + budget tier
    const scoredDests = candidatePool.map(d => {
      let score = 75;
      const reasons = [];

      const hasToddler = family.some(m => m.age <= 3);
      const hasTeen = family.some(m => m.age >= 13 && m.age <= 17);
      const allLikes = Array.from(new Set([...likes, ...family.flatMap(m => m.likes || [])]));

      if (hasToddler) {
        if (d.stroller_friendly) { score += 10; reasons.push("Stroller-friendly for toddlers"); }
        else { score -= 10; }
      }
      if (hasTeen && (d.primary_categories || []).some(c => ["theme_parks", "adventure", "water_parks"].includes(c))) {
        score += 8;
        reasons.push("Thrilling rides & adventure for teens");
      }

      allLikes.forEach(lk => {
        if ((d.primary_categories || []).some(c => c.includes(lk.replace(' ', '_')))) {
          score += 6;
          reasons.push(`Matches interest in ${lk.replace('_', ' ')}`);
        }
      });

      dislikes.forEach(dis => {
        if (dis.includes("crowd") && d.crowd_level === "high") score -= 8;
        if (dis.includes("heat") && d.climate_type === "tropical") score -= 6;
      });

      // Distance & Budget Tier Alignment
      const dCoords = d.coordinates || { lat: 0, lng: 0 };
      const distMiles = calculateDistanceMiles(originAirport.lat, originAirport.lng, dCoords.lat, dCoords.lng);
      
      if (budgetTier.includes('budget') || budgetTier.includes('economy')) {
        if (distMiles <= 550) {
          score += 26;
          reasons.unshift(`Short-haul / budget distance from ${originAirport.city} (~${Math.round(distMiles)} mi)`);
        } else if (distMiles <= 1200) {
          score += 10;
        } else if (distMiles > 2800) {
          score -= 30; // Heavy penalty for long flights on economy budget
          reasons.push(`Long-haul flight costs exceed budget tier`);
        }
      } else if (budgetTier.includes('luxury')) {
        if (distMiles > 2500 || d.lodging_daily_usd?.family_suite > 280) {
          score += 10;
        }
      }

      const memberEnjoyment = family.map((m) => {
        let mScore = 78;
        const mAge = m.age || 20;
        const mLikes = m.likes || [];
        const mName = m.name || 'Member';

        if (mAge <= 3) {
          if (d.stroller_friendly) mScore += 14;
          else mScore -= 10;
        } else if (mAge <= 12) {
          mScore += 10;
        } else if (mAge <= 17) {
          if ((d.primary_categories || []).some(c => ["theme_parks", "adventure", "water_parks"].includes(c))) mScore += 14;
        }

        mLikes.forEach(lk => {
          if ((d.primary_categories || []).some(cat => cat.includes(lk.replace(' ', '_')))) {
            mScore += 8;
          }
        });

        // Boost member enjoyment for nearby budget destinations when in economy mode
        if (budgetTier.includes('budget') && distMiles <= 550) {
          mScore += 4;
        }

        const finalMScore = Math.min(99, Math.max(65, mScore));
        let highlight = "Great overall experience and easy pacing";
        if (mAge <= 3) highlight = d.stroller_friendly ? "Stroller-friendly walking and gentle splash zones" : "Uneven paths, best with a carrier";
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

      return {
        ...d,
        match_score: Math.min(99, Math.max(50, score)),
        score_reasons: reasons.slice(0, 3),
        member_enjoyment: memberEnjoyment
      };
    });

    scoredDests.sort((a, b) => b.match_score - a.match_score);
    allRankedDestinations = scoredDests;
    stops = [{ destination: scoredDests[0].name, duration_days: tripDuration }];
  }

  const totalDuration = stops.reduce((sum, s) => sum + (parseInt(s.duration_days, 10) || tripDuration), 0);

  // Score destinations for each stop
  const processedStops = stops.map((stop, stopIdx) => {
    const q = (stop.destination || '').toLowerCase().trim();
    let matched = fallbackDestinations.find(d => 
      d.name.toLowerCase().includes(q) || 
      d.country.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      q.includes(d.name.toLowerCase().split(',')[0]) ||
      q.includes(d.country.toLowerCase())
    );

    // If no direct match in dataset, dynamically create custom international destination!
    if (!matched) {
      matched = createCustomDestination(stop.destination, stopIdx);
    }

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
  const duration = totalDuration;

  // Resolve departure airport code and coordinates
  const originQuery = (req.origin_city || 'Chicago (ORD)').trim();
  const matchedOriginAirport = GLOBAL_AIRPORTS.find(a =>
    originQuery.toUpperCase().includes(a.code) ||
    originQuery.toLowerCase().includes(a.city.toLowerCase()) ||
    originQuery.toLowerCase().includes(a.name.toLowerCase())
  ) || { code: (originQuery.match(/\b([A-Z]{3})\b/) || [null, originQuery.slice(0, 3).toUpperCase()])[1] || "ORIGIN", lat: 41.9742, lng: -87.9073, city: originQuery.split('(')[0].trim() };

  const originCode = matchedOriginAirport.code;
  const destCoords = primaryDest.coordinates || { lat: 28.5383, lng: -81.3792 };
  const originCoords = { lat: matchedOriginAirport.lat || 41.9742, lng: matchedOriginAirport.lng || -87.9073 };
  
  const distMiles = Math.round(calculateDistanceMiles(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng));
  
  // Calculate realistic flight duration based on distance
  const estFlightHours = Math.max(1.0, Math.round(((distMiles / 490) + 0.6) * 10) / 10);
  const durH = Math.floor(estFlightHours);
  const durM = Math.round((estFlightHours - durH) * 60);
  const directDurationStr = `${durH}h ${durM > 0 ? durM + 'm' : '00m'}`;
  const stopoverDurationStr = `${durH + 2}h ${durM + 15}m`;

  // Calculate realistic distance-based base flight pricing per person
  let ppFlightLow = 220;
  let ppFlightAvg = 380;
  let ppFlightPeak = 620;

  if (distMiles < 750) {
    ppFlightLow = 140; ppFlightAvg = 250; ppFlightPeak = 420;
  } else if (distMiles < 2200) {
    ppFlightLow = 240; ppFlightAvg = 420; ppFlightPeak = 690;
  } else if (distMiles < 5500) {
    ppFlightLow = 520; ppFlightAvg = 860; ppFlightPeak = 1380;
  } else {
    ppFlightLow = 720; ppFlightAvg = 1150; ppFlightPeak = 1720;
  }

  let flightLowTotal = ppFlightLow * numPeople;
  let flightAvgTotal = ppFlightAvg * numPeople;
  let flightPeakTotal = ppFlightPeak * numPeople;

  if (numStops > 1) {
    const interCityTransfer = (numStops - 1) * (180 * numPeople);
    flightLowTotal += Math.round(interCityTransfer * 0.7);
    flightAvgTotal += interCityTransfer;
    flightPeakTotal += Math.round(interCityTransfer * 1.3);
  }

  const originDisplay = matchedOriginAirport.city ? `${matchedOriginAirport.city} (${originCode})` : originCode;
  const routeDisplay = numStops > 1
    ? [originCode, ...processedStops.map(s => s.destination.airport_code || s.destination.name.split(',')[0].slice(0, 3).toUpperCase()), originCode].join(' ➔ ')
    : `${originCode} ➔ ${primaryDest.airport_code || 'DEST'}`;

  const flights = {
    origin_code: originCode,
    destination_code: primaryDest.airport_code,
    origin_display: originDisplay,
    distance_miles: distMiles,
    multi_destination_route: routeDisplay,
    price_range: {
      low_per_person: Math.round(flightLowTotal / numPeople),
      avg_per_person: Math.round(flightAvgTotal / numPeople),
      peak_per_person: Math.round(flightPeakTotal / numPeople),
      total_family_low: flightLowTotal,
      total_family_avg: flightAvgTotal,
      total_family_peak: flightPeakTotal,
    },
    options: [
      {
        tier: "Budget Carrier / Economy Saver",
        airline: "Regional / Economy Saver",
        price_per_person: Math.round(flightLowTotal / numPeople),
        total_family_price: flightLowTotal,
        type: numStops > 1 ? `${numStops} Multi-City Hops` : (distMiles > 2500 ? "1 Stopover Connection" : "Direct / Quick Hop"),
        duration: numStops > 1 ? "Multi-Hop" : stopoverDurationStr,
        baggage_policy: "Carry-on included, checked bags $35",
        family_seating_tip: "Book family seats together in the same row early."
      },
      {
        tier: "Standard Main Cabin (Recommended)",
        airline: "Major Carrier Main Cabin",
        price_per_person: Math.round(flightAvgTotal / numPeople),
        total_family_price: flightAvgTotal,
        type: numStops > 1 ? `${numStops} Multi-City Route` : "Non-stop Direct",
        duration: numStops > 1 ? "Multi-Hop" : directDurationStr,
        baggage_policy: "1 free personal item + 1 carry-on per traveler",
        family_seating_tip: "Includes free adjacent family seating assignments."
      },
      {
        tier: "Premium Family Comfort",
        airline: "Flagship Premium Cabin",
        price_per_person: Math.round(flightPeakTotal / numPeople),
        total_family_price: flightPeakTotal,
        type: "Non-stop Priority",
        duration: numStops > 1 ? "Multi-Hop" : directDurationStr,
        baggage_policy: "2 free checked bags + early family boarding",
        family_seating_tip: "Priority family boarding enables smooth stroller gate checks."
      }
    ],
    family_travel_tip: `Roundtrip from ${originDisplay} (~${distMiles.toLocaleString()} miles). Booking 6-8 weeks ahead unlocks the best family fare tiers.`
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
        name: `Spacious Family Vacation Home in ${primaryDest.name.split(',')[0]}`,
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
        name: `Family Resort Suite with Splash Pool (${primaryDest.name.split(',')[0]})`,
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
    total_stops: numStops,
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

  // Local Events & Seasonal Festivals
  let travelMonth = req.travel_month || null;
  let monthPeriod = req.month_period || 'all';
  if (!travelMonth && req.start_date) {
    try {
      const parsedDate = new Date(req.start_date);
      if (!isNaN(parsedDate.getTime())) {
        travelMonth = parsedDate.getMonth() + 1;
        const dayOfMonth = parsedDate.getDate();
        if (dayOfMonth <= 10) monthPeriod = 'beginning';
        else if (dayOfMonth <= 20) monthPeriod = 'middle';
        else monthPeriod = 'end';
      }
    } catch {
      travelMonth = new Date().getMonth() + 1;
    }
  }

  const primaryEvents = getSeasonalEvents(primaryDest.name, travelMonth, monthPeriod);

  processedStops.forEach(stop => {
    stop.events = getSeasonalEvents(stop.destination.name, travelMonth, monthPeriod);
  });

  // Multi-Stop Itinerary
  let dayCounter = 1;
  const itinerary = [];
  processedStops.forEach((stop, sIdx) => {
    for (let d = 1; d <= stop.duration_days; d++) {
      itinerary.push({
        day: dayCounter,
        stop_number: sIdx + 1,
        destination_name: stop.destination.name,
        title: `Day ${dayCounter} (${stop.destination.name.split(',')[0]}): ${activities[(dayCounter - 1) % activities.length].name}`,
        morning: {
          activity: activities[(dayCounter - 1) % activities.length].name,
          time: "9:00 AM - 12:30 PM",
          description: activities[(dayCounter - 1) % activities.length].description,
          price: `$${activities[(dayCounter - 1) % activities.length].price_per_person_usd}/person`,
          tag: activities[(dayCounter - 1) % activities.length].family_tag
        },
        afternoon: {
          activity: "Lunch & Resort Exploration",
          time: "1:30 PM - 4:30 PM",
          description: `Explore local family attractions in ${stop.destination.name.split(',')[0]}.`,
          price: "Included with Lodging",
          tag: "Relaxing"
        },
        evening: {
          activity: d === 2 && primaryEvents.length > 0
            ? `Visit ${primaryEvents[0].name}`
            : `Family Dinner in ${stop.destination.name.split(',')[0]}`,
          time: "6:00 PM - 8:30 PM",
          description: d === 2 && primaryEvents.length > 0
            ? primaryEvents[0].description
            : "Enjoy a memorable dinner at a local family-friendly restaurant.",
          price: d === 2 && primaryEvents.length > 0
            ? primaryEvents[0].price_tier
            : `~$${Math.round((primaryDest.daily_food_per_person_usd * numPeople) / 2)} total`,
          tag: d === 2 && primaryEvents.length > 0 ? (primaryEvents[0].family_tag || "Seasonal Highlight") : "All Ages"
        }
      });
      dayCounter++;
    }
  });

  return {
    is_multi_destination: numStops > 1 && !isOpenSearch,
    total_stops: numStops,
    stops: processedStops,
    destination: primaryDest,
    all_ranked_destinations: allRankedDestinations.length > 0 ? allRankedDestinations : processedStops.map(s => s.destination),
    flights,
    lodging,
    activities,
    events: primaryEvents,
    weather,
    budget_summary,
    itinerary,
    family_profile_summary: {
      total_travelers: numPeople,
      age_groups: Array.from(new Set(family.map(m => m.age <= 3 ? "toddlers" : m.age <= 12 ? "kids" : m.age <= 17 ? "teens" : "adults"))),
      likes,
      dislikes
    }
  };
}
