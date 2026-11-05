// Gemini AI Chatbot Service
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const FAQ_RESPONSES = {
  "donate": "To donate blood, you must be 18-65 years old, weigh at least 50kg, and be in good health. You can donate whole blood every 56 days (8 weeks).",
  "eligib": "You are eligible to donate if you are healthy, 18-65 years old, weigh 50kg+, have no active infections, and have not donated in the last 56 days.",
  "blood group": "There are 8 main blood groups: A+, A-, B+, B-, AB+, AB-, O+, and O-. O- is the universal donor and AB+ is the universal recipient.",
  "o-": "O- blood is the universal donor type — it can be given to anyone regardless of blood type, making O- donors extremely valuable in emergencies.",
  "ab+": "AB+ individuals are universal recipients — they can receive blood from any blood type.",
  "emergency": "For blood emergencies, use the Emergency Request feature to alert nearby donors. You can also contact hospitals like KMC, AJ Hospital, or Manipal directly.",
  "how long": "Blood donation takes about 10-15 minutes. The entire process including registration and rest takes about 30-45 minutes.",
  "side effect": "Minor side effects may include dizziness, fatigue, or bruising at the needle site. These are temporary. Rest and hydration help recovery.",
  "request": "To request blood, go to 'Create Blood Request', select your blood group, urgency level, and location. Matching donors will be notified.",
  "find donor": "Use the 'Find Donors' page to search by blood group, city, or use the map to find nearby available donors.",
  "safe": "Blood donation is completely safe. Sterile, single-use equipment is always used. Donors cannot contract infections through donation.",
  "how often": "You can donate whole blood every 56 days (about 8 weeks). Platelets can be donated every 7 days, up to 24 times per year.",
  "diet": "Before donating, stay hydrated, eat iron-rich foods, and avoid fatty foods. After donation, drink plenty of fluids and eat a light snack.",
  "platelet": "Platelets can be donated every 7 days (up to 24 times/year). They are crucial for cancer patients and people with bleeding disorders.",
  "lifedrop": "LifeDrop is a blood donor management platform connecting donors and recipients in real time. Our mission: Connecting Donors, Saving Lives — SDG 3.",
};

export async function chatWithGemini(message) {
  // Try keyword-based FAQ first (always works without API key)
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key)) {
      return { text: response, source: "faq" };
    }
  }

  // If Gemini API key is available, use the API
  if (GEMINI_API_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are a helpful blood donation assistant for LifeDrop. Answer briefly and accurately: ${message}` }] }],
          }),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return { text, source: "gemini" };
    } catch {}
  }

  // Default response
  return {
    text: "I can help with questions about blood donation, eligibility, blood groups, and how to use LifeDrop. Try asking about donation eligibility, blood types, or how to find donors.",
    source: "faq",
  };
}
