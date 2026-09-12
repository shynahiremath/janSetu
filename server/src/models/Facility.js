import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["PHC", "clinic", "hospital", "pharmacy"] },
  phone: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

facilitySchema.index({ location: "2dsphere" });

export default mongoose.model("Facility", facilitySchema);