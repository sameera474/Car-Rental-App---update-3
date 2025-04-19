import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getStats } from "../controllers/statsController.js";

const router = express.Router();
router.get("/", protect, authorize("manager"), getStats);
export default router;
