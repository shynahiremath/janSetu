import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { checkIrrigation } from "../controllers/irrigation.controller.js";

const router = Router();
router.post("/check", protect, checkIrrigation);

export default router;