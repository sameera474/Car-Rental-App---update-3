// server/routes/carRoutes.js
import express from "express";
import {
  addCar,
  updateCar,
  getAllCars,
  getAvailableCars,
  getCarById,
  removeCar,
  getFeaturedCars,
  getPopularCars,
  getCarCategories,
} from "../controllers/carController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
// Use the uploadCarFiles middleware (disk storage in this example)
import { uploadCarFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/featured", getFeaturedCars);
router.get("/popular", getPopularCars);
router.get("/categories", getCarCategories);
router.get("/:id", getCarById);

// Protected routes (only managers and admins can add, update, or remove cars)
router.post(
  "/",
  protect,
  authorize("manager", "admin"),
  uploadCarFiles,
  addCar
);
router.put(
  "/:id",
  protect,
  authorize("manager", "admin"),
  uploadCarFiles,
  updateCar
);
router.put("/:id/remove", protect, authorize("manager", "admin"), removeCar);

export default router;
