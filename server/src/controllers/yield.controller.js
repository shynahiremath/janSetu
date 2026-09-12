import { asyncHandler } from "../utils/asyncHandler.js";
import { predictYield } from "../ml/yieldPrediction.js";

export const checkYield = asyncHandler(async (req, res) => {
  const {
    crop, farmArea, soilType, previousYield, rainfall,
    temperature, fertilizerUsage, irrigationAvailable, growthStage,
  } = req.body;

  if (!crop || !farmArea) {
    return res.status(400).json({ message: "crop and farmArea are required" });
  }

  const result = predictYield({
    crop,
    farmArea: Number(farmArea),
    soilType,
    previousYield: previousYield ? Number(previousYield) : undefined,
    rainfall: rainfall !== undefined ? Number(rainfall) : undefined,
    temperature: temperature !== undefined ? Number(temperature) : undefined,
    fertilizerUsage,
    irrigationAvailable: irrigationAvailable !== false,
    growthStage,
  });

  res.json(result);
});