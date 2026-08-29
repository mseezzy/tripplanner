// API service with live backend connection and resilient fallback

const isGitHubPages = typeof window !== 'undefined' && (window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:');
const API_BASE_URL = import.meta.env.VITE_API_URL || (isGitHubPages ? null : '/api');

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
    id: "south-korea",
    name: "Seoul & Jeju Island, South Korea",
    country: "South Korea",
    region: "Asia",
    coordinates: { lat: 37.5665, lng: 126.9780 },
    airport_code: "ICN",
    hero_image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1000&q=80",
    short_description: "Ultra-safe, high-tech family destination with Lotte World theme park, Gyeongbokgung Palace, interactive science museums, Han River parks, and Jeju's waterfalls.",
    primary_categories: ["theme_parks", "history_culture", "food_culinary", "science_museums", "nature"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "moderate",
    best_seasons: ["Spring", "Autumn"],
    stroller_friendly: true,
    crowd_level: "moderate",
    climate_type: "temperate",
    flight_base_usd: { low: 680, avg: 1050, peak: 1550 },
    lodging_daily_usd: { budget_inn: 85, vacation_rental: 150, family_suite: 230, luxury_resort: 450 },
    daily_food_per_person_usd: 35,
    local_transport_daily_usd: 25,
    highlight_features: [
      "Lotte World indoor & outdoor amusement park & mega aquarium",
      "Gyeongbokgung Palace hanbok dressing & guard changing ceremony",
      "Han River family biking, ramen cookers & cruise",
      "Jeju Island volcanic lava tubes, tea fields & teddy bear museum"
    ]
  },
  {
    id: "japan-tokyo",
    name: "Tokyo & Kyoto, Japan",
    country: "Japan",
    region: "Asia",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    airport_code: "NRT",
    hero_image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    short_description: "World-class family safety, Tokyo Disneyland & DisneySea, teamLab Planets digital art wonderland, Shinkansen bullet trains, and Kyoto bamboo forests.",
    primary_categories: ["theme_parks", "science_museums", "history_culture", "food_culinary", "nature"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "moderate",
    best_seasons: ["Spring", "Autumn"],
    stroller_friendly: true,
    crowd_level: "high",
    climate_type: "temperate",
    flight_base_usd: { low: 720, avg: 1120, peak: 1650 },
    lodging_daily_usd: { budget_inn: 95, vacation_rental: 175, family_suite: 260, luxury_resort: 520 },
    daily_food_per_person_usd: 40,
    local_transport_daily_usd: 30,
    highlight_features: [
      "Tokyo Disneyland & Tokyo DisneySea ocean-themed wonderland",
      "teamLab Planets immersive mirror & water digital art museum",
      "Shinkansen high-speed bullet train rides across Japan",
      "Kyoto Arashiyama Monkey Park & magical bamboo forest"
    ]
  },
  {
    id: "london-uk",
    name: "London & Cotswolds, United Kingdom",
    country: "United Kingdom",
    region: "Europe",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    airport_code: "LHR",
    hero_image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
    short_description: "Royal palaces, Warner Bros. Harry Potter Studio Tour, world-class free science & natural history museums, and double-decker bus rides.",
    primary_categories: ["history_culture", "science_museums", "entertainment", "food_culinary"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "moderate",
    best_seasons: ["Spring", "Summer", "Autumn"],
    stroller_friendly: true,
    crowd_level: "high",
    climate_type: "temperate",
    flight_base_usd: { low: 520, avg: 850, peak: 1350 },
    lodging_daily_usd: { budget_inn: 120, vacation_rental: 220, family_suite: 310, luxury_resort: 590 },
    daily_food_per_person_usd: 50,
    local_transport_daily_usd: 35,
    highlight_features: [
      "Warner Bros. Studio Tour London - The Making of Harry Potter",
      "Natural History & Science Museums with giant robotic dinosaurs (Free Entry)",
      "Tower of London, Crown Jewels & iconic Tower Bridge",
      "Hyde Park Diana Memorial Playground & London Eye ride"
    ]
  },
  {
    id: "paris-france",
    name: "Paris & French Riviera, France",
    country: "France",
    region: "Europe",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    airport_code: "CDG",
    hero_image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
    short_description: "Iconic Eiffel Tower carousel, Disneyland Paris, Seine river boat cruises, Jardin du Luxembourg toy sailboats, and world-renowned bakeries.",
    primary_categories: ["history_culture", "theme_parks", "food_culinary", "relaxing"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "relaxed",
    best_seasons: ["Spring", "Summer", "Autumn"],
    stroller_friendly: true,
    crowd_level: "high",
    climate_type: "temperate",
    flight_base_usd: { low: 540, avg: 880, peak: 1390 },
    lodging_daily_usd: { budget_inn: 130, vacation_rental: 230, family_suite: 320, luxury_resort: 610 },
    daily_food_per_person_usd: 50,
    local_transport_daily_usd: 30,
    highlight_features: [
      "Disneyland Paris & Walt Disney Studios Park",
      "Eiffel Tower summit views and antique carousel rides",
      "Jardin du Luxembourg pony rides and vintage wooden sailboats",
      "Seine River glass-canopy family sightseeing cruise"
    ]
  },
  {
    id: "rome-italy",
    name: "Rome & Florence, Italy",
    country: "Italy",
    region: "Europe",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    airport_code: "FCO",
    hero_image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
    short_description: "Living history museum featuring the Colosseum, family pizza & gelato masterclasses, Trevi Fountain wishing, and Vatican wonders.",
    primary_categories: ["history_culture", "food_culinary", "relaxing", "nature"],
    target_age_groups: ["kids", "tweens", "teens", "adults"],
    pacing: "moderate",
    best_seasons: ["Spring", "Autumn"],
    stroller_friendly: false,
    crowd_level: "high",
    climate_type: "mediterranean",
    flight_base_usd: { low: 560, avg: 890, peak: 1400 },
    lodging_daily_usd: { budget_inn: 110, vacation_rental: 195, family_suite: 275, luxury_resort: 550 },
    daily_food_per_person_usd: 45,
    local_transport_daily_usd: 25,
    highlight_features: [
      "Colosseum & Gladiator school interactive family experience",
      "Authentic family pizza-making and artisan gelato workshop",
      "Trevi Fountain coin tossing and Piazza Navona artists",
      "Borghese Gardens four-person tandem bike rental"
    ]
  },
  {
    id: "costa-rica",
    name: "Arenal Volcano & Manuel Antonio, Costa Rica",
    country: "Costa Rica",
    region: "Central America",
    coordinates: { lat: 10.4678, lng: -84.7032 },
    airport_code: "SJO",
    hero_image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    short_description: "Rainforest canopy bridges, wild sloth and monkey spotting, gentle hot springs, and white sand Pacific beaches.",
    primary_categories: ["nature", "animals_wildlife", "adventure", "beaches", "relaxing"],
    target_age_groups: ["toddlers", "kids", "tweens", "teens", "adults"],
    pacing: "relaxed",
    best_seasons: ["Winter", "Spring"],
    stroller_friendly: false,
    crowd_level: "low",
    climate_type: "tropical",
    flight_base_usd: { low: 320, avg: 490, peak: 780 },
    lodging_daily_usd: { budget_inn: 85, vacation_rental: 155, family_suite: 240, luxury_resort: 490 },
    daily_food_per_person_usd: 35,
    local_transport_daily_usd: 45,
    highlight_features: [
      "Mistico Arenal Hanging Bridges guided sloth and toucan tour",
      "Eco Termales family-friendly natural hot springs",
      "Manuel Antonio National Park beach with wild monkeys",
      "La Fortuna waterfall and chocolate making plantation tour"
    ]
  }
];

// Curated Global Major Airports Dataset for instant autocomplete & IATA resolution
export const GLOBAL_AIRPORTS = [
  // North America
  { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta Int'l", country: "United States", lat: 33.6407, lng: -84.4277 },
  { code: "ORD", city: "Chicago", name: "O'Hare International Airport", country: "United States", lat: 41.9742, lng: -87.9073 },
  { code: "MDW", city: "Chicago", name: "Chicago Midway International", country: "United States", lat: 41.7868, lng: -87.7522 },
  { code: "DFW", city: "Dallas/Fort Worth", name: "Dallas/Fort Worth Int'l", country: "United States", lat: 32.8998, lng: -97.0403 },
  { code: "DEN", city: "Denver", name: "Denver International Airport", country: "United States", lat: 39.8561, lng: -104.6737 },
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
  return generateClientRecommendations(payload);
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
    stops = req.destinations.filter(s => s.destination && s.destination.trim());
  } else if (req.preferred_destination && req.preferred_destination.trim()) {
    stops = [{ destination: req.preferred_destination.trim(), duration_days: req.duration_days || 5 }];
  }

  // AUTO-RECOMMEND MODE: If no destination specified, score and rank all available destinations for family & budget!
  let allRankedDestinations = [];
  const isOpenSearch = stops.length === 0;
  const tripDuration = req.duration_days || 5;

  if (isOpenSearch) {
    // Score all destinations against family preferences, age groups, and budget tier
    const scoredDests = fallbackDestinations.map(d => {
      let score = 75;
      const reasons = [];

      const hasToddler = family.some(m => m.age <= 3);
      const hasTeen = family.some(m => m.age >= 13 && m.age <= 17);
      const allLikes = Array.from(new Set([...likes, ...family.flatMap(m => m.likes || [])]));

      if (hasToddler) {
        if (d.stroller_friendly) { score += 10; reasons.push("Stroller-friendly for toddlers"); }
        else { score -= 10; }
      }
      if (hasTeen && d.primary_categories.some(c => ["theme_parks", "adventure", "water_parks"].includes(c))) {
        score += 8;
        reasons.push("Thrilling rides & adventure for teens");
      }

      allLikes.forEach(lk => {
        if (d.primary_categories.some(c => c.includes(lk.replace(' ', '_')))) {
          score += 6;
          reasons.push(`Matches interest in ${lk.replace('_', ' ')}`);
        }
      });

      dislikes.forEach(dis => {
        if (dis.includes("crowd") && d.crowd_level === "high") score -= 8;
        if (dis.includes("heat") && d.climate_type === "tropical") score -= 6;
      });

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
          if (d.primary_categories.some(c => ["theme_parks", "adventure", "water_parks"].includes(c))) mScore += 14;
        }

        mLikes.forEach(lk => {
          if (d.primary_categories.some(cat => cat.includes(lk.replace(' ', '_')))) {
            mScore += 8;
          }
        });

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
        match_score: Math.min(99, Math.max(60, score)),
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
          activity: `Family Dinner in ${stop.destination.name.split(',')[0]}`,
          time: "6:00 PM - 8:30 PM",
          description: "Enjoy a memorable dinner at a local family-friendly restaurant.",
          price: `~$${Math.round((primaryDest.daily_food_per_person_usd * numPeople) / 2)} total`,
          tag: "All Ages"
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
