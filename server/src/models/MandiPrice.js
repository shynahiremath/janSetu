import mongoose from "mongoose";

const mandiPriceSchema = new mongoose.Schema(
  {
    state: String,
    district: String,
    market: String,
    commodity: { type: String, index: true },
    variety: String,
    minPrice: Number,
    maxPrice: Number,
    modalPrice: Number,
    arrivalDate: Date,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
);

mandiPriceSchema.index({ location: "2dsphere" });

export default mongoose.model("MandiPrice", mandiPriceSchema);