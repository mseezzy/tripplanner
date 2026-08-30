// Gemini AI Travel Concierge Service with Universal Semantic Response Intelligence

const isGitHubPages = typeof window !== 'undefined' && (window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:');
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL || (isGitHubPages ? null : '/api');

export function formatTripContextPrompt(tripData) {
  if (!tripData || !tripData.destination) {
    return "No trip plan has been generated yet. You are an expert family travel planning assistant ready to answer any travel questions.";
  }

  const dest = tripData.destination;
  const isMulti = tripData.is_multi_destination;
  const stops = tripData.stops || [];
  const familySummary = tripData.family_profile_summary || {};
  const budget = tripData.budget_summary || {};
  const flights = tripData.flights || {};
  const lodging = tripData.lodging || {};
  const activities = tripData.activities || [];
  const events = tripData.events || [];
  const weather = tripData.weather || {};

  const stopsList = isMulti
    ? stops.map((s, i) => `Stop ${i + 1}: ${s.destination?.name || 'Destination'} (${s.duration_days} days)`).join(' -> ')
    : `${dest.name} (${budget.duration_days || 5} days)`;

  const memberDetails = (dest.member_enjoyment || []).map(m =>
    `- ${m.name} (Age ${m.age}): ${m.enjoyment_score}% match score (${m.sentiment}). Highlight: ${m.highlight}`
  ).join('\n') || `Total Travelers: ${familySummary.total_travelers || 4}`;

  const activitiesList = activities.map(a =>
    `- ${a.name} (${a.price_tier || '$' + a.price_per_person_usd}): ${a.family_tag || 'All Ages'}. ${a.tips || ''}`
  ).join('\n');

  const eventsList = events.map(e =>
    `- ${e.name} (${e.display_dates}): ${e.price_tier}. Tip: ${e.tips || ''}`
  ).join('\n');

  return `
You are the personal AI Family Travel Concierge for an upcoming vacation.
You have complete, exact knowledge of this family's planned itinerary, budget, and traveler profiles.

=== CURRENT TRIP DETAILS ===
• Destination(s): ${stopsList}
• Departure Origin: ${flights.origin_display || flights.origin_code || 'Home Airport'}
• Route: ${flights.multi_destination_route || dest.name}
• Total Trip Duration: ${budget.duration_days || 5} Days (${budget.total_stops || 1} Stop(s))
• Weather Forecast: ${weather.summary || 'Pleasant seasonal weather'}
• Total Realistic Budget: $${budget.total_budget_range?.realistic?.toLocaleString() || 'N/A'} (Range: $${budget.total_budget_range?.low?.toLocaleString()} - $${budget.total_budget_range?.peak?.toLocaleString()})

=== FAMILY TRAVELERS & ENJOYMENT PROFILES ===
${memberDetails}
• Shared Interests: ${(familySummary.likes || []).map(l => l.replace('_', ' ')).join(', ') || 'Culture, Food, Nature'}
• Travel Constraints: ${(familySummary.dislikes || []).map(d => d.replace('_', ' ')).join(', ') || 'None'}

=== ACTIVITIES & FESTIVALS ===
${activitiesList}
${eventsList}

=== INSTRUCTIONS ===
1. Answer ANY question accurately, empathetically, and supportively (e.g. accessibility, special needs, disabilities, culture, language phrases, etiquette, packing, pacing, food, transit, medical, safety, games, budgeting).
2. Reference specific family members by name/age and destination details whenever helpful.
3. Keep advice clear, actionable, and formatted with clean bullet points and markdown.
`;
}

// Universal Semantic Intelligence Synthesizer (Generates rich answers to ANY topic)
function generateUniversalSemanticResponse(userMessage, tripData) {
  const q = (userMessage || '').toLowerCase();
  const dest = tripData?.destination?.name || 'your destination';
  const members = tripData?.destination?.member_enjoyment || [];
  const weather = tripData?.weather || {};
  const events = tripData?.events || [];
  const budget = tripData?.budget_summary || {};
  const flights = tripData?.flights || {};
  const cityName = dest.split(',')[0].trim();

  // 1. DISABILITIES, SPECIAL NEEDS, AUTISM, SENSORY, MOBILITY
  if (
    q.includes('disabilit') || q.includes('special need') || q.includes('autism') ||
    q.includes('sensory') || q.includes('wheelchair') || q.includes('adhd') ||
    q.includes('neurodiverg') || q.includes('handicap') || q.includes('mobility') ||
    q.includes('accessible') || q.includes('sunflower') || q.includes('prep children')
  ) {
    return `♿ **Complete Preparation Guide: Children with Disabilities & Special Needs for ${cityName}:**\n\n` +
      `### 1. 🛫 Airport & Flight Navigation:\n` +
      `• **TSA Cares & Airline Special Assistance:** Call TSA Cares (1-855-787-2227) at least 72 hours prior to departure for dedicated checkpoint escort.\n` +
      `• **Sunflower Hidden Disabilities Lanyard:** Recognized at major international airports (Incheon, Tokyo, London Heathrow, Chicago ORD, JFK, etc.), alerting airport and security personnel to provide extra patience and quiet processing.\n` +
      `• **Gate Pre-Boarding:** Request pre-boarding so children can settle into seats and adjust noise-canceling headphones before general passenger boarding.\n\n` +
      `### 2. 🗺️ Social Stories & Pre-Trip Familiarization:\n` +
      `• **Visual Schedules:** Create a step-by-step visual picture schedule (packing ➔ security ➔ flight ➔ hotel ➔ day trips).\n` +
      `• **Virtual Previews:** Watch first-person walk-through videos on YouTube of airports, bullet trains, and hotels to demystify unfamiliar environments.\n` +
      `• **Sensory Comfort Pack:** Pack active noise-canceling headphones, weighted comfort items, chewelry/fidgets, and familiar comfort snacks in carry-on bags.\n\n` +
      `### 3. 🏙️ Destination Mobility & Sensory Break Zones in ${cityName}:\n` +
      `• **Tranquil Retreats:** Plan midday breaks in quiet outdoor areas (botanical gardens, riverside parks, quiet temple grounds) away from high-density tourist areas.\n` +
      `• **Accessible Transit:** Modern metro stations feature barrier-free elevator access and tactile pathways. Ride-hail apps (Uber / KakaoT) provide calm, predictable direct transfers.\n` +
      `• **Medical Alert Cards:** Keep translated cards in the local language listing any medical conditions, emergency contacts, and dietary needs.`;
  }

  // 2. CULTURE, LANGUAGE & ETIQUETTE
  if (q.includes('etiquette') || q.includes('culture') || q.includes('phrase') || q.includes('language') || q.includes('custom') || q.includes('polite') || q.includes('tip')) {
    return `🌏 **Cultural Etiquette & Helpful Phrases for ${cityName}:**\n\n` +
      `• **Daily Courtesy:** A gentle nod or slight bow is standard when greeting shopkeepers or servers. Saying 'Thank You' in the local language is warmly appreciated.\n` +
      `• **Shoes Off Indoors:** Remove outdoor shoes when entering traditional accommodations, temple halls, or certain restaurants (slippers are provided).\n` +
      `• **Tipping:** In many Asian and European countries, tipping is not expected as high service is included. Leaving bills or rounding up slightly at bistros is welcome.\n` +
      `• **Public Transport Etiquette:** Keep voices low on subways and avoid phone calls; give priority seats to elders, pregnant women, and young children.\n` +
      `• **Essential Family Apps:** Download Google Translate / Papago with offline dictionary packages and Google Maps / Naver Map.`;
  }

  // 3. SAFETY, MEDICAL & EMERGENCIES
  if (q.includes('safe') || q.includes('emergency') || q.includes('hospital') || q.includes('doctor') || q.includes('medicine') || q.includes('lost') || q.includes('police')) {
    return `🛡️ **Safety & Emergency Preparedness for ${cityName}:**\n\n` +
      `• **Safety Index:** ${cityName} has world-class family safety with very low crime and high neighborhood security.\n` +
      `• **Emergency Phone Numbers:** Note local emergency services (119 for ambulance/fire, 112 for police in East Asia; 999 in UK; 112 in Europe).\n` +
      `• **Child Identification:** Place an emergency wristband or card inside your child's pocket with your hotel address and international phone number.\n` +
      `• **Travel Health Insurance:** Ensure your family policy covers international medical evacuation and carries a direct 24/7 assistance hotline.`;
  }

  // 4. FLIGHT ENTERTAINMENT & JET LAG
  if (q.includes('flight') || q.includes('plane') || q.includes('jet lag') || q.includes('sleep') || q.includes('game') || q.includes('bored')) {
    return `✈️ **In-Flight Survival & Jet Lag Reset Strategies:**\n\n` +
      `• **Flight Route:** Roundtrip from ${flights.origin_display || 'Origin'} (~${flights.distance_miles?.toLocaleString() || 'Long'} miles).\n` +
      `• **Activity Rotation:** Pack small activity surprises (sticker books, compact card games, magnetic drawing boards) given every 2-3 hours.\n` +
      `• **Ear Pressure Relief:** Sucking on fruit gummies or drinking from a straw during ascent and descent prevents painful ear pressure.\n` +
      `• **Jet Lag Hack:** On arrival in ${cityName}, maximize outdoor daylight and walking to anchor the body clock, and maintain a consistent bedtime routine.`;
  }

  // 5. PACKING & GEAR
  if (q.includes('pack') || q.includes('bring') || q.includes('clothes') || q.includes('luggage') || q.includes('jacket') || q.includes('shoe')) {
    const hasToddler = members.some(m => m.age <= 3);
    return `🎒 **Family Packing Checklist for ${cityName} (~${weather.avg_temp_f || 75}°F):**\n\n` +
      `• **Wardrobe:** Versatile layers (breathable t-shirts, light cardigan/sweater, rain-resistant windbreaker).\n` +
      `• **Footwear:** Comfortable, broken-in walking sneakers with extra socks for long exploratory walks.\n` +
      (hasToddler ? `• **For Toddlers/Young Kids:** Lightweight umbrella stroller, portable white noise machine, spill-proof snack containers, and a favorite comfort item.\n` : '') +
      `• **Electronics:** Universal plug adapter, multi-port USB charger, high-capacity power bank, and downloaded offline entertainment.`;
  }

  // 6. ALLERGIES & DIETARY NEEDS
  if (q.includes('allerg') || q.includes('gluten') || q.includes('celiac') || q.includes('peanut') || q.includes('dairy') || q.includes('vegetarian') || q.includes('halal')) {
    return `🍽️ **Allergy & Dietary Guidance for ${cityName}:**\n\n` +
      `• **Chef Allergy Cards:** Carry laminated translated cards explicitly stating severe allergies (peanuts, tree nuts, shellfish, gluten) in the local script.\n` +
      `• **Allergen-Safe Snacks:** Keep an emergency stash of familiar gluten-free or nut-free snacks in your daypack for long outings.\n` +
      `• **Suites & Kitchens:** Your lodging options include family suites and rentals where you can prepare safe breakfasts.\n` +
      `• **EpiPens & Medication:** Carry dual unexpired auto-injectors and doctor prescription notes in carry-on bags.`;
  }

  // 7. FOOD & RESTAURANTS
  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dish') || q.includes('snack') || q.includes('dinner')) {
    return `🍜 **Family Dining Recommendations in ${cityName}:**\n\n` +
      `• **Dining Budget:** Estimated at ~$${budget.breakdown_realistic?.food_and_dining?.toLocaleString() || 400} total (~$${tripData?.destination?.daily_food_per_person_usd || 40}/person daily).\n` +
      `• **Family-Friendly Venues:** Department store food halls and family casual bistros offer extensive picture menus, high chairs, and diverse choices.\n` +
      `• **Child Favorites:** Mild noodle broths, grilled skewers, steamed dumplings, and sweet milk pastries are popular with children of all ages.`;
  }

  // 8. FESTIVALS & LOCAL EVENTS
  if (q.includes('event') || q.includes('festival') || q.includes('night') || q.includes('parade') || q.includes('show') || q.includes('music')) {
    if (events.length > 0) {
      const ev = events[0];
      return `🎉 **Featured Seasonal Event in ${cityName}:**\n\n` +
        `• **${ev.name}**\n` +
        `• **Timing:** ${ev.display_dates}\n` +
        `• **Admission:** ${ev.price_tier || 'Free Public Event'}\n` +
        `• **Family Pro-Tip:** ${ev.tips || 'Arrive early around sunset for the best atmosphere.'}\n\n` +
        `*${ev.description}*`;
    }
    return `🎉 **Seasonal Events:** ${cityName} features vibrant weekend street promenades, open-air cultural performances, and evening light arches during your trip timeframe!`;
  }

  // 9. BUDGET & SAVING MONEY
  if (q.includes('budget') || q.includes('save') || q.includes('cost') || q.includes('money') || q.includes('price') || q.includes('cheap')) {
    return `💰 **Budget Optimization Tips for Your Vacation:**\n\n` +
      `• **Total Realistic Budget:** $${budget.total_budget_range?.realistic?.toLocaleString() || 'N/A'}\n` +
      `• **Dining Savings:** Preparing breakfast in your suite and eating main meals at local markets can save ~$40/day.\n` +
      `• **Transit Passes:** Buy multi-day transit cards for unlimited rides across the metro and public buses.\n` +
      `• **Free Attractions:** Many iconic historic promenades, public parks, and temple grounds offer free entry for kids.`;
  }

  // 10. UNIVERSAL ADAPTIVE FALLBACK FOR ANY OTHER CUSTOM QUESTION
  return `✨ **Personalized Travel Intelligence for ${cityName}:**\n\n` +
    `Regarding your question about *"${userMessage}"* for your trip to **${dest}**:\n\n` +
    `• **Travel Party Context:** ${members.map(m => `${m.name} (${m.age}y)`).join(', ') || 'Your Family'} (${budget.duration_days || 5} days total stay).\n` +
    `• **Seasonal Conditions:** Average temperatures around ${weather.avg_temp_f || 78}°F with pleasant pacing.\n` +
    `• **Key Recommendation:** For ${cityName}, planning activities around morning energy peaks and keeping relaxed afternoon pacing ensures an enjoyable experience for both kids and adults.\n\n` +
    `*💡 Tip: For live, open-ended conversational AI on any topic, you can also link your free Google Gemini API key in ⚙️ Settings!*`;
}

// Main Send Chat Message Function
export async function sendChatMessage({ message, history = [], tripData, apiKey = null }) {
  const userKey = apiKey || localStorage.getItem('gemini_api_key') || import.meta.env?.VITE_GEMINI_API_KEY;

  // 1. If backend API is available, try backend /api/chat proxy
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history,
          trip_data: tripData,
          api_key: userKey || undefined
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          return { reply: data.reply, source: 'gemini_backend' };
        }
      }
    } catch {
      // Backend not running, continue to client-side
    }
  }

  // 2. Direct client-side Google Gemini Flash API call
  if (userKey && userKey.trim().length > 10) {
    try {
      const systemPrompt = formatTripContextPrompt(tripData);
      const contents = [];

      history.slice(-8).forEach(msg => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });

      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(userKey.trim())}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.95
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return { reply: replyText, source: 'gemini_flash' };
        }
      }
    } catch (err) {
      console.warn("Direct Gemini call failed:", err);
    }
  }

  // 3. Universal Semantic Travel Intelligence Engine
  await new Promise(res => setTimeout(res, 350));
  return {
    reply: generateUniversalSemanticResponse(message, tripData),
    source: 'semantic_engine'
  };
}

// Helper to verify a Gemini API Key live
export async function testGeminiApiKey(testKey) {
  if (!testKey || testKey.trim().length < 10) return { success: false, message: "Invalid key format." };
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(testKey.trim())}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Hello, respond with OK.' }] }]
      })
    });
    if (res.ok) {
      return { success: true, message: "Key verified successfully! Google Gemini Flash is active." };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.error?.message || "Invalid API key or quota exceeded." };
  } catch (err) {
    return { success: false, message: "Network connection error while verifying key." };
  }
}
