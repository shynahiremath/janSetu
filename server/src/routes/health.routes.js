import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { checkSymptoms, getNearbyCare, getHeatmap } from "../controllers/health.controller.js";

const router = Router();

router.post("/symptom-check", protect, checkSymptoms);
router.get("/nearby-care", protect, getNearbyCare);
router.get("/admin/heatmap", protect, requireRole("admin", "asha_worker"), getHeatmap);

export default router;