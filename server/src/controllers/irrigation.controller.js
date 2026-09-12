import { asyncHandler } from "../utils/asyncHandler.js";
import { getIrrigationAdvice } from "../ml/irrigation.js";
import { getForecast } from "../services/openWeather.service.js";

export const checkIrrigation = asyncHandler(async (req, res) => {
  const {
    crop, soilType, soilMoisture, farmSize, temperature,
    recentRainfall, growthStage, lat, lng,
  } = req.body;

  if (soilMoisture === undefined || temperature === undefined) {
    return res.status(400).json({ message: "soilMoisture and temperature are required" });
  }

  let expectedRainProbability = 0;
  let weatherSummary = null;
  try {
    if (lat && lng) {
      const forecast = await getForecast(lat, lng);
      expectedRainProbability = forecast[0]?.rainProbability ?? 0;
      weatherSummary = forecast[0] || null;
    }
  } catch {
    // Weather is optional context — fall back gracefully if it fails
  }

  const advice = getIrrigationAdvice({
    crop, soilType, soilMoisture: Number(soilMoisture), farmSize: Number(farmSize) || null,
    temperature: Number(temperature), recentRainfall: Number(recentRainfall) || 0,
    expectedRainProbability, growthStage,
  });

  res.json({ ...advice, weatherSummary });
});