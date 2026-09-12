import HealthLog from "../models/HealthLog.js";
import Facility from "../models/Facility.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { classifyUrgency } from "../ml/riskScoring.js";
import { detectClusters } from "../ml/outbreakClustering.js";

export const checkSymptoms = asyncHandler(async (req, res) => {
  const { symptoms, lat, lng } = req.body;
  const { urgencyTier, redFlags, recommendedAction } = classifyUrgency(symptoms);

  const log = await HealthLog.create({
    user: req.user.id,
    symptoms,
    redFlags,
    urgencyTier,
    recommendedAction,
    location: { type: "Point", coordinates: [lng || 0, lat || 0] },
  });

  if (urgencyTier === "emergency") {
    req.app.get("io").emit("emergency-alert", { logId: log._id, userId: req.user.id });
  }

  res.json({
    urgencyTier,
    redFlags,
    recommendedAction,
    note: "This is guidance only, not a medical diagnosis. Always consult a healthcare professional.",
  });
});

export const getNearbyCare = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  const facilities = await Facility.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: 30000,
      },
    },
  }).limit(10);
  res.json(facilities);
});

export const getHeatmap = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const logs = await HealthLog.find({ createdAt: { $gte: since } }).select("location");

  const points = logs.map((l) => ({
    lat: l.location.coordinates[1],
    lng: l.location.coordinates[0],
  }));

  const clusters = detectClusters(points);
  res.json({ clusters, totalReports: points.length });
});