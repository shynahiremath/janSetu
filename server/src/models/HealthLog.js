import mongoose from "mongoose";

const healthLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: [{ type: String }],
    redFlags: [{ type: String }],
    urgencyTier: { type: String, enum: ["low", "medium", "high", "emergency"] },
    aiExplanation: String,
    recommendedAction: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
);

healthLogSchema.index({ location: "2dsphere" });

export default mongoose.model("HealthLog", healthLogSchema);