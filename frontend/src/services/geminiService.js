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

// Client-Side Contextual Fallback Assistant (works with 0 API keys)
function generateContextualFallbackResponse(userMessage, tripData) {
  const q = (userMessage || '').toLowerCase();
  const dest = tripData?.destination?.name || 'your destination';
  const members = tripData?.destination?.member_enjoyment || [];
  const weather = tripData?.weather || {};
  const events = tripData?.events || [];
  const budget = tripData?.budget_summary || {};
  const flights = tripData?.flights || {};

  if (q.includes('pack') || q.includes('bring') || q.includes('clothes') || q.includes('luggage')) {
    const hasToddler = members.some(m => m.age <= 3);
    return `🎒 **Packing Recommendations for ${dest.split(',')[0]} (${weather.avg_temp_f || 75}°F average):**\n\n` +
      `• **Clothing & Layers:** Lightweight breathable layers for daytime highs (~${weather.avg_temp_f || 78}°F) and light jackets/sweaters for evening strolls.\n` +
      `• **Footwear:** Broken-in walking sneakers for the entire family.\n` +
      (hasToddler ? `• **For Toddlers/Young Kids:** Compact umbrella stroller, portable sound machine, spill-proof snack cups, and favorite bedtime storybooks.\n` : '') +
      `• **Essentials:** Universal power adapters, portable power bank, reusable water bottles, and a compact travel first-aid kit with children's meds.`;
  }

  if (q.includes('toddler') || q.includes('baby') || q.includes('stroller') || q.includes('kid')) {
    return `👶 **Kid & Stroller Tips for ${dest.split(',')[0]}:**\n\n` +
      `• **Pacing:** Schedule 1 main morning activity and leave late afternoons open for pool/rest time.\n` +
      `• **Stroller Access:** ${tripData?.destination?.stroller_friendly ? 'Paved walkways and major transit stations have elevator ramps.' : 'Some historic cobbled areas are best navigated with an ergonomic baby carrier.'}\n` +
      `• **Snacks & Rest:** Keep fruit pouches and electrolyte packs in your daypack to keep energy steady.`;
  }

  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dinner')) {
    return `🍜 **Family Dining & Food Tips in ${dest.split(',')[0]}:**\n\n` +
      `• **Family Budget:** Estimated at ~$${budget.breakdown_realistic?.food_and_dining?.toLocaleString() || 400} total (~$${tripData?.destination?.daily_food_per_person_usd || 40}/person daily).\n` +
      `• **Where to Eat:** Visit lively local food halls and family-friendly bistros with open seating.\n` +
      `• **Kid-Friendly Strategy:** Many local eateries offer kid meal sets or mild noodle/rice dishes that young children love.`;
  }

  if (q.includes('event') || q.includes('festival') || q.includes('parade') || q.includes('night')) {
    if (events.length > 0) {
      const ev = events[0];
      return `🎉 **Local Festival Highlight in ${dest.split(',')[0]}:**\n\n` +
        `• **${ev.name}** (${ev.display_dates})\n` +
        `• **Admission:** ${ev.price_tier || 'Free Public Event'}\n` +
        `• **Family Tip:** ${ev.tips || 'Arrive early around sunset for the best atmosphere.'}\n\n` +
        `*${ev.description}*`;
    }
    return `🎉 **Seasonal Events:** There are vibrant weekend artisan promenades and seasonal cultural street fairs scheduled in ${dest.split(',')[0]}. Check with your lodging front desk upon check-in for daily local event listings!`;
  }

  if (q.includes('budget') || q.includes('save') || q.includes('cost') || q.includes('money') || q.includes('price')) {
    return `💰 **Budget Optimization Tips for Your Trip:**\n\n` +
      `• **Total Realistic Budget:** $${budget.total_budget_range?.realistic?.toLocaleString() || 'N/A'}\n` +
      `• **Flight Savings:** Roundtrip from ${flights.origin_display || 'Origin'} (~$${flights.price_range?.total_family_avg?.toLocaleString()}). Booking 6–8 weeks in advance can save 15%–20%.\n` +
      `• **Lodging:** Vacation rentals with a kitchen allow making quick family breakfasts, saving ~$40/day on dining.`;
  }

  return `✨ **Family Travel Advice for ${dest}:**\n\n` +
    `Your planned trip to **${dest}** is well-matched for your family profile with an overall high enjoyment score!\n\n` +
    `• **Travelers:** ${members.map(m => `${m.name} (${m.age}y)`).join(', ') || 'Your Family'}\n` +
    `• **Key Highlights:** Balanced daily pacing, kid-friendly discovery attractions, and seasonal weather (~${weather.avg_temp_f || 75}°F).\n\n` +
    `Feel free to ask about packing lists, toddler advice, restaurant picks, festival timings, or flight tips!`;
}

// Main Send Chat Message Function
export async function sendChatMessage({ message, history = [], tripData, apiKey = null }) {
  const userKey = apiKey || localStorage.getItem('gemini_api_key') || import.meta.env?.VITE_GEMINI_API_KEY;

  // 1. If Gemini API Key is provided, call Google Gemini Flash REST API
  if (userKey && userKey.trim().length > 10) {
    try {
      const systemPrompt = formatTripContextPrompt(tripData);
      
      const contents = [
        {
          role: "user",
          parts: [{ text: `[SYSTEM CONTEXT - DO NOT ECHO BACK DIRECTLY]\n${systemPrompt}\n\n[END SYSTEM CONTEXT]` }]
        },
        {
          role: "model",
          parts: [{ text: "Understood! I am your AI Family Travel Concierge with full knowledge of your itinerary, budget, family member profiles, and local festivals. How can I help with your trip today?" }]
        }
      ];

      // Append past conversation history
      history.slice(-6).forEach(msg => {
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
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
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

  // 2. Resilient Client-Side Contextual Travel Advisor Fallback
  await new Promise(res => setTimeout(res, 500)); // Smooth natural typing delay
  return {
    reply: generateContextualFallbackResponse(message, tripData),
    source: 'contextual_engine'
  };
}
