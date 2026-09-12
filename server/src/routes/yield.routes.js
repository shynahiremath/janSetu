import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { checkYield } from "../controllers/yield.controller.js";

const router = Router();
router.post("/predict", protect, checkYield);

export default router;