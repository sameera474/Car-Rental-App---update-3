import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getFinancialReport,
  manageManagers,
} from "../controllers/bossController.js";
import User from "../models/User.js";

const router = express.Router();

// GET financial report – accessible to boss and admin
router.get(
  "/financial-report",
  protect,
  authorize("boss", "admin"),
  getFinancialReport
);

// GET list of managers
router.get("/managers", protect, authorize("boss"), async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" }).select("name email");
    res.json(managers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching managers", error: error.message });
  }
});

// POST manage managers (promote/demote)
router.post("/manage-managers", protect, authorize("boss"), manageManagers);

export default router;
