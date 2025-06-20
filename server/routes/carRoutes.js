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
  getCarsByCategory,
} from "../controllers/carController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadCarFiles } from "../middleware/uploadMiddleware.js";
import { deleteCar } from "../controllers/carController.js";
import { toggleFeatured } from "../controllers/carController.js";

const router = express.Router();

// Public routes
router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/featured", getFeaturedCars);
router.get("/popular", getPopularCars);
router.get("/categories", getCarCategories);
router.get("/category/:category", getCarsByCategory);
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

router.delete("/:id", protect, authorize("manager", "admin"), deleteCar);
router.patch(
  "/:id/featured",
  protect,
  authorize("manager", "admin"),
  toggleFeatured
);

export default router;
