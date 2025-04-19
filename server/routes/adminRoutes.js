import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getBosses,
  promoteToBoss,
  demoteBoss,
  resetSystem,
} from "../controllers/adminController.js";

const router = express.Router();

// Get list of bosses (accessible by admin)
router.get("/bosses", protect, authorize("admin"), getBosses);

// Promote a user to boss (accessible by admin)
router.post("/bosses", protect, authorize("admin"), promoteToBoss);

// Demote a boss (accessible by admin)
router.delete("/bosses/:id", protect, authorize("admin"), demoteBoss);

// Reset the entire system (accessible by admin)
router.post("/reset-system", protect, authorize("admin"), resetSystem);

export default router;
