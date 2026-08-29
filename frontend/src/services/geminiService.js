// Gemini AI Travel Concierge Service

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export function formatTripContextPrompt(tripData) {
  if (!tripData || !tripData.destination) {
    return "No trip plan has been generated yet. You are a helpful family travel planning assistant ready to answer general travel questions.";
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
  const itinerary = tripData.itinerary || [];
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

  const lodgingList = (lodging.options || []).map(l =>
    `- ${l.name} ($${l.nightly_rate_usd}/night): ${l.best_for || ''}. Amenities: ${(l.family_amenities || []).join(', ')}`
  ).join('\n');

  return `
You are the personal AI Family Travel Concierge for an upcoming family vacation.
You have complete, exact knowledge of this family's planned itinerary, budget, traveler profiles, and preferences.

=== CURRENT TRIP DETAILS ===
• Destination(s): ${stopsList}
• Departure Origin: ${flights.origin_display || flights.origin_code || 'Home Airport'}
• Route: ${flights.multi_destination_route || dest.name}
• Total Trip Duration: ${budget.duration_days || 5} Days (${budget.total_stops || 1} Stop(s))
• Weather Forecast: ${weather.summary || 'Pleasant seasonal weather'}
• Total Realistic Family Budget: $${budget.total_budget_range?.realistic?.toLocaleString() || 'N/A'} (Range: $${budget.total_budget_range?.low?.toLocaleString()} - $${budget.total_budget_range?.peak?.toLocaleString()})

=== FAMILY TRAVELERS & ENJOYMENT SCORES ===
${memberDetails}
• Family Shared Interests: ${(familySummary.likes || []).map(l => l.replace('_', ' ')).join(', ') || 'Culture, Food, Nature'}
• Travel Constraints / Dislikes: ${(familySummary.dislikes || []).map(d => d.replace('_', ' ')).join(', ') || 'None specified'}

=== FLIGHT DETAILS ===
• Origin: ${flights.origin_display || 'Origin Airport'}
• Distance: ~${flights.distance_miles?.toLocaleString() || 'N/A'} miles
• Realistic Family Flight Total: $${flights.price_range?.total_family_avg?.toLocaleString() || 'N/A'}
• Flight Tip: ${flights.family_travel_tip || ''}

=== LODGING OPTIONS ===
${lodgingList || 'Family-friendly suites and vacation rentals available.'}

=== TOP ACTIVITIES & ATTRACTIONS ===
${activitiesList || 'Curated family sights and cultural discovery.'}

=== LOCAL EVENTS & SEASONAL FESTIVALS ===
${eventsList || 'Seasonal community markets and cultural street fairs active.'}

=== INSTRUCTIONS FOR YOUR ANSWERS ===
1. Answer warmly, concisely, and supportively as an expert family travel concierge.
2. Directly reference specific family members by name (e.g. mention the toddler or teenager when relevant) and their interests.
3. Use bullet points and emoji where helpful to make advice easy to read for busy parents.
4. Give actionable, realistic advice (e.g., stroller tips, specific meal ideas, packing advice for the predicted weather, budget hacks).
5. Keep your responses focused, helpful, and under 3-4 paragraphs unless the user asks for a comprehensive guide.
`;
}

// Client-Side Contextual Assistant (Comprehensive & empathetic travel intelligence)
function generateContextualFallbackResponse(userMessage, tripData) {
  const q = (userMessage || '').toLowerCase();
  const dest = tripData?.destination?.name || 'your destination';
  const members = tripData?.destination?.member_enjoyment || [];
  const weather = tripData?.weather || {};
  const events = tripData?.events || [];
  const budget = tripData?.budget_summary || {};
  const flights = tripData?.flights || {};
  const cityName = dest.split(',')[0].trim();

  // 1. CHILDREN WITH DISABILITIES / SPECIAL NEEDS / SENSORY SENSITIVITIES / MOBILITY
  if (
    q.includes('disabilit') || q.includes('special need') || q.includes('autism') ||
    q.includes('sensory') || q.includes('wheelchair') || q.includes('adhd') ||
    q.includes('neurodiverg') || q.includes('handicap') || q.includes('mobility') ||
    q.includes('accessible') || q.includes('sunflower') || q.includes('prep children')
  ) {
    return `♿ **Comprehensive Guide: Prepping Children with Disabilities & Sensory Needs for ${cityName}:**\n\n` +
      `### 1. 🛫 Airport & Flight Navigation:\n` +
      `• **TSA Cares & Airline Special Services:** Call TSA Cares (1-855-787-2227) at least 72 hours before departure to request a dedicated passenger support specialist through security.\n` +
      `• **Hidden Disabilities Sunflower Lanyard:** Incheon (ICN), Tokyo (HND/NRT), London (LHR), and US airports recognize the Sunflower Lanyard, discreetly signaling staff that your family may need extra time, clearer instructions, or a quiet lane.\n` +
      `• **Priority Pre-Boarding:** Request pre-boarding at the gate so your children can get settled in seats, test headphones, and adjust before the rush.\n\n` +
      `### 2. 🗺️ Pre-Trip Familiarization & Social Stories:\n` +
      `• **Visual Schedules & Video Previews:** Watch first-person walking tour videos of ${cityName} airports, subway stations, and your hotel on YouTube so unfamiliar environments feel predictable.\n` +
      `• **Sensory Kit Backpack:** Pack active noise-canceling headphones, weighted lap pads/vests, chewelry/fidgets, favorite familiar snacks, and an extra change of sensory-friendly clothes in carry-ons.\n\n` +
      `### 3. 🏙️ Destination Mobility & Sensory Management in ${cityName}:\n` +
      `• **Pacing & Sensory Break Zones:** Plan quiet retreats during peak midday hours in tranquil green spaces (such as Namsan Park or Han River parks in Seoul, or peaceful temple gardens in Japan).\n` +
      `• **Transit Accessibility:** Major metro systems in ${cityName} have dedicated priority elevators and barrier-free routes marked with yellow tactile paths. For point-to-point comfort, ride-hail apps (like KakaoT / Uber) offer predictable direct transfers.\n` +
      `• **Emergency Medical Cards:** Carry printed translations of medical conditions, emergency contacts, and dietary needs in the local language in your daypack.\n\n` +
      `*💡 Tip: With an API key connected in settings (⚙️), you can ask for a tailored hour-by-hour sensory-friendly itinerary for specific attractions!*`;
  }

  // 2. ALLERGIES & DIETARY RESTRICTIONS
  if (q.includes('allerg') || q.includes('gluten') || q.includes('celiac') || q.includes('peanut') || q.includes('dairy') || q.includes('vegetarian') || q.includes('halal')) {
    return `🍽️ **Allergy & Dietary Guidance for ${cityName}:**\n\n` +
      `• **Chef Translation Cards:** Carry printed 'Equal Eats' or translated cards stating severe allergies (e.g. peanuts, sesame, shellfish, gluten) in the local language to show restaurant servers directly.\n` +
      `• **Safe Food Stash:** Pack a supply of certified allergen-safe protein bars, crackers, and snacks in your daypack for unexpected delays.\n` +
      `• **Lodging with Kitchens:** Your lodging options include vacation rentals and suites where you can prepare safe breakfast and snacks before heading out.\n` +
      `• **Medical Kit:** Always carry 2 unexpired EpiPens or antihistamines in your carry-on with a physician's travel letter.`;
  }

  // 3. FLIGHTS, JET LAG & AIRPORT PREP
  if (q.includes('flight') || q.includes('plane') || q.includes('jet lag') || q.includes('sleep') || q.includes('time zone')) {
    return `✈️ **Flight & Jet Lag Survival Strategies (${flights.origin_display || 'Origin'} ➔ ${cityName}):**\n\n` +
      `• **Flight Duration:** ~${flights.distance_miles?.toLocaleString() || 'Long'} miles (${flights.options?.[1]?.duration || 'Multi-Hour flight'}).\n` +
      `• **Ear Pressure Relief:** Use silicone earplugs (EarPlanes), offer lollipop/gum during descent, or give toddlers a sip cup during takeoff and landing.\n` +
      `• **Surprise Activity Bags:** Pack 3-4 small wrapped dollar-store toys or coloring pads and reveal one every 2 hours to keep young travelers engaged.\n` +
      `• **Beating Jet Lag:** Get outside in natural sunlight on Day 1 in ${cityName} to reset circadian rhythms; avoid 4 PM naps that derail nighttime sleep.`;
  }

  // 4. PACKING & GEAR
  if (q.includes('pack') || q.includes('bring') || q.includes('clothes') || q.includes('luggage') || q.includes('shoes')) {
    const hasToddler = members.some(m => m.age <= 3);
    return `🎒 **Packing Recommendations for ${cityName} (~${weather.avg_temp_f || 75}°F average):**\n\n` +
      `• **Clothing & Layers:** Lightweight breathable layers for daytime highs (~${weather.avg_temp_f || 78}°F) and light jackets/sweaters for evening strolls.\n` +
      `• **Footwear:** Broken-in walking sneakers for the entire family.\n` +
      (hasToddler ? `• **For Toddlers/Young Kids:** Compact umbrella stroller with rain shield, portable sound machine, spill-proof snack cups, and favorite bedtime items.\n` : '') +
      `• **Tech & Power:** Dual-voltage plug adapters, high-capacity portable power bank for phones/tablets, and downloaded offline maps.`;
  }

  // 5. TODDLER, BABY & STROLLER TIPS
  if (q.includes('toddler') || q.includes('baby') || q.includes('stroller') || q.includes('nap')) {
    return `👶 **Toddler & Pacing Advice for ${cityName}:**\n\n` +
      `• **The 'One Big Thing' Rule:** Plan just 1 primary morning outing, followed by a relaxed lunch and afternoon downtime.\n` +
      `• **Stroller vs Carrier:** ${tripData?.destination?.stroller_friendly ? 'Main boulevards, shopping centers, and museums are stroller-friendly.' : 'Pack an ergonomic baby carrier for historical steps, trails, or crowded markets.'}\n` +
      `• **Snack Strategy:** Hangang park convenience stores and local bakeries have mild steamed buns, milk bread, and fruit cups that toddlers love.`;
  }

  // 6. DINING & RESTAURANTS
  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dinner') || q.includes('lunch')) {
    return `🍜 **Family Dining & Food Tips in ${cityName}:**\n\n` +
      `• **Estimated Food Budget:** ~$${budget.breakdown_realistic?.food_and_dining?.toLocaleString() || 400} total (~$${tripData?.destination?.daily_food_per_person_usd || 40}/person daily).\n` +
      `• **Family-Friendly Picks:** Modern food courts in department store basements (Depachika / Food Halls) offer hundreds of authentic dishes with picture menus and high chairs.\n` +
      `• **Kid Staples:** Mild grilled chicken skewers, mild udon/noodle broths, dumplings (mandu), and egg fried rice are universally child-approved.`;
  }

  // 7. FESTIVALS & EVENTS
  if (q.includes('event') || q.includes('festival') || q.includes('parade') || q.includes('night') || q.includes('show')) {
    if (events.length > 0) {
      const ev = events[0];
      return `🎉 **Featured Seasonal Event in ${cityName}:**\n\n` +
        `• **${ev.name}**\n` +
        `• **Dates & Time:** ${ev.display_dates}\n` +
        `• **Admission:** ${ev.price_tier || 'Free Public Event'}\n` +
        `• **Family Tip:** ${ev.tips || 'Arrive around sunset for the best atmosphere.'}\n\n` +
        `*${ev.description}*`;
    }
    return `🎉 **Local Events:** ${cityName} features vibrant weekend street promenades, open-air cultural performances, and evening light arches during your trip timeframe!`;
  }

  // 8. BUDGET & SAVINGS
  if (q.includes('budget') || q.includes('save') || q.includes('cost') || q.includes('money') || q.includes('price')) {
    return `💰 **Budget Optimization Tips for Your Vacation:**\n\n` +
      `• **Total Realistic Budget:** $${budget.total_budget_range?.realistic?.toLocaleString() || 'N/A'}\n` +
      `• **Lodging:** Vacation rentals or family suites with mini-kitchens save ~$35-$50/day on family breakfasts.\n` +
      `• **Transit:** Pre-loaded transit IC cards or multi-day family passes cut local taxi costs significantly.\n` +
      `• **Attractions:** Many scenic parks, temple grounds, and cultural squares offer free admission for kids under 12.`;
  }

  // 9. DYNAMIC GENERAL CONTEXTUAL ASSISTANT
  return `✨ **Personalized Travel Intelligence for ${dest}:**\n\n` +
    `Your planned trip to **${dest}** is customized for your ${members.length || 4} travelers:\n` +
    `• **Family Members:** ${members.map(m => `${m.name} (${m.age}y - ${m.sentiment})`).join(', ') || 'Your Family'}\n` +
    `• **Weather:** Highs around ${weather.avg_temp_f || 78}°F with pleasant seasonal conditions.\n\n` +
    `**You can ask me about:**\n` +
    `1. ♿ Prepping children with disabilities, autism, or mobility needs\n` +
    `2. 🎒 Packing checklists and flight survival tips\n` +
    `3. 🍜 Kid-friendly restaurants and food allergy navigation\n` +
    `4. 🎉 Seasonal festivals and best times to attend\n\n` +
    `*(Tip: For open-ended creative brainstorming, you can also add a free Google Gemini API key in ⚙️ Settings!)*`;
}

// Main Send Chat Message Function
export async function sendChatMessage({ message, history = [], tripData, apiKey = null }) {
  const userKey = apiKey || localStorage.getItem('gemini_api_key') || import.meta.env?.VITE_GEMINI_API_KEY;

  // 1. If Gemini API Key is provided, call Google Gemini Flash REST API with system_instruction
  if (userKey && userKey.trim().length > 10) {
    try {
      const systemPrompt = formatTripContextPrompt(tripData);
      
      const contents = [];

      // Append past conversation history (last 8 turns)
      history.slice(-8).forEach(msg => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });

      // Append current user message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(userKey.trim())}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
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
          return {
            reply: replyText,
            source: 'gemini_flash'
          };
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn("Gemini API error response:", errJson);
      }
    } catch (err) {
      console.warn("Direct Gemini call failed, falling back to contextual assistant:", err);
    }
  }

  // 2. Comprehensive Contextual Travel Advisor Fallback
  await new Promise(res => setTimeout(res, 400)); // Natural typing delay
  return {
    reply: generateContextualFallbackResponse(message, tripData),
    source: 'contextual_engine'
  };
}
