import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  addTransaction,
  getTransactions,
  addLoan,
  getKhatabook,
  getHealthScore,
  simulate,
} from "../controllers/finance.controller.js";

const router = Router();

router.post("/transactions", protect, addTransaction);
router.get("/transactions", protect, getTransactions);
router.post("/loans", protect, addLoan);
router.get("/khatabook", protect, getKhatabook);
router.get("/health-score", protect, getHealthScore);
router.post("/simulate", protect, simulate);

export default router;