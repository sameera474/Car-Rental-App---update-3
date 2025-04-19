import Rental from "../models/Rental.js";
import Car from "../models/Car.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

/**
 * Get all bosses.
 */
export const getBosses = async (req, res) => {
  try {
    const bosses = await User.find({ role: "boss" }).select("-password");
    res.json(bosses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bosses" });
  }
};

/**
 * Promote a user to boss.
 */
export const promoteToBoss = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { role: "boss" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Promotion failed", error: error.message });
  }
};

/**
 * Demote a boss to a regular user.
 */
export const demoteBoss = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "user" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Demotion failed", error: error.message });
  }
};

/**
 * Reset the entire system.
 * Deletes: all rentals, all cars, all reviews, and all users (except those with role "admin").
 */
export const resetSystem = async (req, res) => {
  try {
    await Promise.all([
      Rental.deleteMany(),
      Car.deleteMany(),
      Review.deleteMany(),
      User.deleteMany({ role: { $nin: ["admin"] } }),
    ]);
    res.json({ message: "System reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reset failed", error: error.message });
  }
};
