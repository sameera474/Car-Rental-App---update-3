import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  approveRental,
  getReturnedCars,
  lockUser,
} from "../controllers/managerController.js";

const router = express.Router();

router.put(
  "/approve-rental/:rentalId",
  protect,
  authorize("manager"),
  approveRental
);
router.get("/returned-cars", protect, authorize("manager"), getReturnedCars);
router.put("/lock-user/:userId", protect, authorize("manager"), lockUser);

export default router;
