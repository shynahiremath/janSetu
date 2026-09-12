import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["farmer", "asha_worker", "admin"], default: "farmer" },
    preferredLanguage: { type: String, default: "en" },
    farmLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

userSchema.index({ farmLocation: "2dsphere" });

export default mongoose.model("User", userSchema);