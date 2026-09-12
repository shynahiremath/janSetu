import "dotenv/config";
import { connectDB } from "../config/db.js";
import MandiPrice from "../models/MandiPrice.js";
import mongoose from "mongoose";

const sample = [
  { state: "Maharashtra", district: "Ahilyanagar", market: "Ahilyanagar Mandi", commodity: "Tomato", variety: "Local", minPrice: 800, maxPrice: 1200, modalPrice: 1000, arrivalDate: new Date(), location: { type: "Point", coordinates: [74.7480, 19.0952] } },
  { state: "Maharashtra", district: "Nashik", market: "Nashik Mandi", commodity: "Tomato", variety: "Hybrid", minPrice: 900, maxPrice: 1400, modalPrice: 1150, arrivalDate: new Date(), location: { type: "Point", coordinates: [73.7898, 20.0059] } },
  { state: "Maharashtra", district: "Pune", market: "Pune Mandi", commodity: "Tomato", variety: "Local", minPrice: 950, maxPrice: 1300, modalPrice: 1100, arrivalDate: new Date(), location: { type: "Point", coordinates: [73.8567, 18.5204] } },
];

async function seed() {
  await connectDB();
  await MandiPrice.deleteMany({});
  await MandiPrice.insertMany(sample);
  console.log("✅ Seeded mandi prices");
  mongoose.connection.close();
}

seed();