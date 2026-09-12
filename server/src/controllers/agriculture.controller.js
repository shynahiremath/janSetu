import MandiPrice from "../models/MandiPrice.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCurrentWeather, getForecast } from "../services/openWeather.service.js";
import { detectDisease } from "../services/diseaseInference.service.js";
import { fetchAgmarknetPrices } from "../services/dataGovIn.service.js";

const TRANSPORT_RATE_PER_KM = 3;

function haversineKm([lng1, lat1], [lng2, lat2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export const syncMandiPrices = asyncHandler(async (req, res) => {
  const { commodity, state } = req.query;
  const records = await fetchAgmarknetPrices({ commodity, state, limit: 100 });

  if (!records.length) {
    return res.json({ synced: 0, message: "No records returned from data.gov.in for this filter." });
  }

  // Rough state-capital coordinates fallback for records missing precise geocoding.
  // (Agmarknet data doesn't include lat/lng, so we approximate by state centroid.)
  const STATE_COORDS = {
    Maharashtra: [75.7139, 19.7515],
    "Uttar Pradesh": [80.9462, 26.8467],
    Punjab: [75.3412, 31.1471],
    Karnataka: [75.7139, 15.3173],
    "Madhya Pradesh": [78.6569, 22.9734],
    Gujarat: [71.1924, 22.2587],
    Rajasthan: [74.2179, 27.0238],
    "Tamil Nadu": [78.6569, 11.1271],
    "West Bengal": [87.855, 22.9868],
    Bihar: [85.3131, 25.0961],
  };

  const docs = records
    .filter((r) => r.modal_price && Number(r.modal_price) > 0)
    .map((r) => {
      const coords = STATE_COORDS[r.state] || [78.9629, 20.5937]; // India centroid fallback
      return {
        state: r.state,
        district: r.district,
        market: r.market,
        commodity: r.commodity,
        variety: r.variety,
        minPrice: Number(r.min_price) || 0,
        maxPrice: Number(r.max_price) || 0,
        modalPrice: Number(r.modal_price) || 0,
        arrivalDate: r.arrival_date ? new Date(r.arrival_date.split("/").reverse().join("-")) : new Date(),
        location: { type: "Point", coordinates: coords },
      };
    });

  await MandiPrice.insertMany(docs);
  res.json({ synced: docs.length, message: `Synced ${docs.length} live records from data.gov.in.` });
});

export const getMandiPrices = asyncHandler(async (req, res) => {
  const { commodity, state, district } = req.query;
  const filter = {};
  if (commodity) filter.commodity = new RegExp(commodity, "i");
  if (state) filter.state = new RegExp(state, "i");
  if (district) filter.district = new RegExp(district, "i");

  const prices = await MandiPrice.find(filter).sort({ arrivalDate: -1 }).limit(50);
  res.json(prices);
});

export const getBestSell = asyncHandler(async (req, res) => {
  const { commodity, farmLat, farmLng } = req.query;
  if (!commodity || !farmLat || !farmLng) {
    return res.status(400).json({ message: "commodity, farmLat, farmLng are required" });
  }

  const farmCoords = [Number(farmLng), Number(farmLat)];

  const mandis = await MandiPrice.find({
    commodity: new RegExp(commodity, "i"),
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: farmCoords },
        $maxDistance: 150000,
      },
    },
  }).limit(20);

  const results = mandis.map((m) => {
    const distanceKm = haversineKm(farmCoords, m.location.coordinates);
    const transportCost = distanceKm * TRANSPORT_RATE_PER_KM;
    const netRealization = m.modalPrice - transportCost;
    return {
      market: m.market,
      district: m.district,
      modalPrice: m.modalPrice,
      distanceKm: Math.round(distanceKm * 10) / 10,
      transportCost: Math.round(transportCost),
      netRealization: Math.round(netRealization),
    };
  });

  results.sort((a, b) => b.netRealization - a.netRealization);
  res.json(results);
});

export const getWeather = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  const current = await getCurrentWeather(lat, lng);
  const forecast = await getForecast(lat, lng);
  res.json({ current, forecast });
});

export const diagnoseDisease = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Image file required" });
  const result = await detectDisease(req.file.buffer, req.file.originalname);
  res.json({
    ...result,
    disclaimer:
      "This is an AI estimate from a prototype model, not verified agronomic advice. Confirm with a local agriculture officer before taking action.",
  });
});