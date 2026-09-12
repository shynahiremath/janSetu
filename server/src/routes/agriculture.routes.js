import { Router } from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import {
  getMandiPrices,
  getBestSell,
  getWeather,
  diagnoseDisease,
} from "../controllers/agriculture.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/mandi/prices", protect, getMandiPrices);
router.get("/mandi/best-sell", protect, getBestSell);
router.get("/weather", protect, getWeather);
router.post("/disease-detection", protect, upload.single("image"), diagnoseDisease);

export default router;