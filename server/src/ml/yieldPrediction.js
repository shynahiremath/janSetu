const BASE_YIELD = {
  tomato: 25, wheat: 3.5, rice: 4.5, cotton: 1.8, sugarcane: 70,
  maize: 3, soybean: 1.5, onion: 18, potato: 20, default: 5,
};

const SOIL_FACTOR = {
  sandy: 0.85, loamy: 1.1, clay: 0.95, "black cotton": 1.05, default: 1.0,
};

export function predictYield({
  crop = "default",
  farmArea,
  soilType = "default",
  previousYield,
  rainfall,
  temperature,
  fertilizerUsage = "medium",
  irrigationAvailable = true,
  growthStage = "vegetative",
}) {
  const cropKey = crop.toLowerCase().trim();
  const soilKey = soilType.toLowerCase().trim();
  const base = BASE_YIELD[cropKey] ?? BASE_YIELD.default;
  const soilMult = SOIL_FACTOR[soilKey] ?? SOIL_FACTOR.default;

  const factors = [];
  let multiplier = soilMult;
  factors.push({ label: "Soil quality", impact: soilMult >= 1 ? "Favorable" : "Limiting" });

  let rainfallImpact = "Favorable";
  if (rainfall !== undefined) {
    if (rainfall < 300) { multiplier *= 0.75; rainfallImpact = "Limiting (too low)"; }
    else if (rainfall > 1200) { multiplier *= 0.85; rainfallImpact = "Limiting (excess/waterlogging risk)"; }
    else { multiplier *= 1.05; }
  }
  factors.push({ label: "Rainfall", impact: rainfallImpact });

  let tempImpact = "Favorable";
  if (temperature !== undefined) {
    if (temperature > 38 || temperature < 10) { multiplier *= 0.8; tempImpact = "Limiting (heat/cold stress)"; }
  }
  factors.push({ label: "Temperature", impact: tempImpact });

  if (!irrigationAvailable) { multiplier *= 0.8; }
  factors.push({ label: "Irrigation", impact: irrigationAvailable ? "Favorable" : "Limiting" });

  const fertMult = { low: 0.85, medium: 1.0, high: 1.1 }[fertilizerUsage] ?? 1.0;
  multiplier *= fertMult;
  factors.push({ label: "Fertilizer usage", impact: fertilizerUsage === "low" ? "Limiting" : fertilizerUsage === "high" ? "Favorable" : "Adequate" });

  const confidence = ["flowering", "fruiting"].includes(growthStage.toLowerCase()) ? "High" : "Moderate";

  let predictedPerHectare = base * multiplier;
  if (previousYield && previousYield > 0) {
    predictedPerHectare = predictedPerHectare * 0.4 + previousYield * 0.6;
  }

  const totalYield = farmArea ? predictedPerHectare * farmArea : null;

  const suggestions = [];
  if (rainfallImpact.startsWith("Limiting")) suggestions.push("Consider supplemental irrigation to offset rainfall shortfall.");
  if (tempImpact.startsWith("Limiting")) suggestions.push("Use mulching or shade netting to reduce heat/cold stress on the crop.");
  if (!irrigationAvailable) suggestions.push("Explore access to irrigation — this is currently the biggest limiting factor.");
  if (fertilizerUsage === "low") suggestions.push("Increasing fertilizer usage (within recommended limits) could meaningfully improve yield.");
  if (soilMult < 1) suggestions.push("Soil amendments (organic matter, pH correction) could improve this soil type's productivity.");
  if (suggestions.length === 0) suggestions.push("Conditions look favorable — maintain current practices.");

  return {
    predictedYieldPerHectare: Math.round(predictedPerHectare * 100) / 100,
    predictedTotalYield: totalYield ? Math.round(totalYield * 100) / 100 : null,
    unit: "tonnes",
    confidence,
    factors,
    suggestions,
  };
}