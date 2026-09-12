const RED_FLAGS = [
  "chest pain",
  "difficulty breathing",
  "severe bleeding",
  "unconscious",
  "seizure",
  "blue lips",
  "severe abdominal pain",
];

const MEDIUM_SYMPTOMS = ["high fever", "persistent vomiting", "severe headache", "dehydration"];

export function classifyUrgency(symptoms = []) {
  const lower = symptoms.map((s) => s.toLowerCase());
  const redFlags = lower.filter((s) => RED_FLAGS.some((f) => s.includes(f)));

  if (redFlags.length > 0) {
    return {
      urgencyTier: "emergency",
      redFlags,
      recommendedAction:
        "This may be a medical emergency. Go to the nearest hospital or call emergency services immediately.",
    };
  }

  const mediumHits = lower.filter((s) => MEDIUM_SYMPTOMS.some((f) => s.includes(f)));
  if (mediumHits.length > 0) {
    return {
      urgencyTier: "medium",
      redFlags: [],
      recommendedAction: "Visit a nearby clinic or PHC within the next 24 hours.",
    };
  }

  if (lower.length > 0) {
    return {
      urgencyTier: "low",
      redFlags: [],
      recommendedAction: "Monitor symptoms and rest. Visit a clinic if symptoms worsen or persist beyond 3 days.",
    };
  }

  return { urgencyTier: "low", redFlags: [], recommendedAction: "No symptoms reported." };
}