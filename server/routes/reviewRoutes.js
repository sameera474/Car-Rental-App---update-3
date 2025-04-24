import express from "express";
import {
  createReview,
  getCarReviews,
  getUserReviews,
  getRecentReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/car/:carId", getCarReviews);
router.get("/user/:userId", protect, getUserReviews);
router.get("/recent", getRecentReviews);

export default router;
