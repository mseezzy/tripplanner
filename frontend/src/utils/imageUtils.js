// Robust multi-tier image resolver and fallbacks for global travel destinations

export const CATEGORY_FALLBACK_IMAGES = {
  theme_parks: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80", // Theme Park Rollercoaster / Ferris wheel
  beaches: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", // Tropical turquoise beach
  nature: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80", // Scenic green mountains
  animals_wildlife: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80", // Wild animals & nature
  history_culture: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80", // Historic European palace / architecture
  food_culinary: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80", // Delicious dining spread
  science_museums: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // Modern architectural museum
  adventure: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", // Rugged alpine peaks
  relaxing: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", // Peaceful resort pool
  water_parks: "https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80", // Water resort & splash
  default: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80" // Classic world travel vista
};

export const CONTINENT_FALLBACK_IMAGES = {
  "Asia & Pacific": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  "Europe": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
  "North America": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "Latin America & Caribbean": "https://images.unsplash.com/photo-1512815046276-89d9703648a5?auto=format&fit=crop&w=1200&q=80",
  "Middle East & Africa": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80"
};

/**
 * Returns a guaranteed valid image URL for any destination object.
 */
export function getDestinationImage(dest) {
  if (!dest) return CATEGORY_FALLBACK_IMAGES.default;

  // 1. Direct valid hero_image
  if (dest.hero_image && typeof dest.hero_image === 'string' && dest.hero_image.startsWith('http') && !dest.hero_image.includes('placeholder')) {
    return dest.hero_image;
  }

  // 2. Match by primary category
  const categories = dest.primary_categories || [];
  for (const cat of categories) {
    if (CATEGORY_FALLBACK_IMAGES[cat]) {
      return CATEGORY_FALLBACK_IMAGES[cat];
    }
  }

  // 3. Match by continent
  if (dest.continent && CONTINENT_FALLBACK_IMAGES[dest.continent]) {
    return CONTINENT_FALLBACK_IMAGES[dest.continent];
  }

  // 4. Default guaranteed travel photo
  return CATEGORY_FALLBACK_IMAGES.default;
}

/**
 * Fallback handler when an image fails to load via onError.
 */
export function getCategoryFallbackImage(dest) {
  if (!dest) return CATEGORY_FALLBACK_IMAGES.default;
  const categories = dest.primary_categories || [];
  for (const cat of categories) {
    if (CATEGORY_FALLBACK_IMAGES[cat]) {
      return CATEGORY_FALLBACK_IMAGES[cat];
    }
  }
  return CATEGORY_FALLBACK_IMAGES.default;
}
