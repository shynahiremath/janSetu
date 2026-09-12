// Rule-based irrigation advisor — deliberately transparent, not a black-box model.
// Base daily water need in mm/day per crop (rough agronomic averages).
const CROP_WATER_NEED = {
  tomato: 6, wheat: 5, rice: 8, cotton: 6, sugarcane: 7,
  maize: 5.5, soybean: 5, onion: 4.5, potato: 5, default: 5.5,
};

// Soil retention factor: how much of applied water the soil holds (higher = retains more, irrigate less often)
const SOIL_RETENTION = {
  sandy: 0.7, loamy: 1.0, clay: 1.3, "black cotton": 1.2, default: 1.0,
};

export function getIrrigationAdvice({
  crop = "default",
  soilType = "default",
  soilMoisture, // %
  farmSize, // acres
  temperature, // °C
  recentRainfall = 0, // mm in last 3 days
  expectedRainProbability = 0, // 0-1, from weather forecast
  growthStage = "vegetative",
}) {
  const cropKey = crop.toLowerCase().trim();
  const soilKey = soilType.toLowerCase().trim();
  const waterNeed = CROP_WATER_NEED[cropKey] ?? CROP_WATER_NEED.default;
  const retention = SOIL_RETENTION[soilKey] ?? SOIL_RETENTION.default;

  const reasons = [];
  let tierScore = 0; // 0 = not required, 1 = soon, 2 = immediate

  // Soil moisture is the primary driver
  if (soilMoisture < 30) {
    tierScore = 2;
    reasons.push(`Soil moisture is low (${soilMoisture}%), below the safe threshold for ${crop}.`);
  } else if (soilMoisture < 50) {
    tierScore = 1;
    reasons.push(`Soil moisture is moderate (${soilMoisture}%), approaching the point where irrigation helps.`);
  } else {
    reasons.push(`Soil moisture is healthy (${soilMoisture}%).`);
  }

  // Temperature escalates water stress
  if (temperature >= 35) {
    tierScore = Math.min(2, tierScore + 1);
    reasons.push(`High temperature (${temperature}°C) increases evaporation and crop water stress.`);
  }

  // Growth stage: flowering/fruiting stages are more water-sensitive
  if (["flowering", "fruiting"].includes(growthStage.toLowerCase())) {
    tierScore = Math.min(2, tierScore + (tierScore > 0 ? 1 : 0));
    reasons.push(`${growthStage} stage is water-sensitive for most crops.`);
  }

  // Rainfall (actual or expected) reduces the need
  if (recentRainfall >= 15 || expectedRainProbability >= 0.6) {
    tierScore = Math.max(0, tierScore - 1);
    reasons.push(
      recentRainfall >= 15
        ? `Recent rainfall (${recentRainfall}mm) has already replenished soil moisture.`
        : `High chance of rain soon (${Math.round(expectedRainProbability * 100)}%), irrigation can likely wait.`
    );
  }

  const TIERS = ["not_required", "required_soon", "required_immediately"];
  const status = TIERS[tierScore];

  // Recommended amount: base water need adjusted by soil retention, scaled by farm size
  const litersPerAcre = Math.round((waterNeed / retention) * 4046.86 * (soilMoisture < 50 ? 1 : 0.6));
  const totalLiters = farmSize ? Math.round(litersPerAcre * farmSize) : null;

  const frequencyDays = status === "required_immediately" ? 1 : status === "required_soon" ? 3 : 7;

  return {
    status,
    statusLabel: {
      not_required: "Not required",
      required_soon: "Required soon",
      required_immediately: "Required immediately",
    }[status],
    recommendedLitersPerAcre: litersPerAcre,
    recommendedTotalLiters: totalLiters,
    recommendedFrequencyDays: frequencyDays,
    reason: reasons.join(" "),
  };
}