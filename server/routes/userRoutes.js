import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  updateUserStatus,
  createUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

// Import uploadAvatar as default from the correct file path.
import uploadAvatar from "../middleware/uploadAvatar.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);

// If you want to update the user profile including the avatar image,
// use the uploadAvatar middleware on that route. (If you are uploading images for the profile.)
router.put("/profile", protect, uploadAvatar, updateUserProfile);

router.get("/:userId", protect, getUserById);
router.get("/", protect, authorize("manager"), getAllUsers);
router.put("/:id/status", protect, authorize("manager"), updateUserStatus);
router.post("/", protect, authorize("admin"), createUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

// Example route using the upload middleware if needed
router.put("/profile/avatar", protect, uploadAvatar, (req, res) => {
  // Call your controller function to update the user's avatar.

  res.json({ message: "Avatar updated successfully" });
});

export default router;
