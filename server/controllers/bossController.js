import Rental from "../models/Rental.js";
import Car from "../models/Car.js";
import User from "../models/User.js";

/**
 * Generate a comprehensive financial report.
 */
export const getFinancialReport = async (req, res) => {
  try {
    // Retrieve all rentals with populated car info
    const rentals = await Rental.find()
      .populate("car", "brand model pricePerDay")
      .populate("user", "name email");

    const totalRevenue = rentals.reduce(
      (sum, rental) => sum + rental.totalCost,
      0
    );

    // Calculate earnings per car, ensuring car is populated
    const carEarnings = rentals.reduce((acc, rental) => {
      if (rental.car && rental.car._id) {
        const carId = rental.car._id.toString();
        acc[carId] = (acc[carId] || 0) + rental.totalCost;
      }
      return acc;
    }, {});

    // Generate details for each car
    const details = await Promise.all(
      Object.entries(carEarnings).map(async ([carId, total]) => {
        const car = await Car.findById(carId);
        const rentalCount = rentals.filter(
          (r) => r.car && r.car._id && r.car._id.toString() === carId
        ).length;
        return {
          car: car ? `${car.brand} ${car.model}` : "Unknown Car",
          totalEarnings: total,
          rentalCount,
        };
      })
    );

    const activeManagers = await User.countDocuments({ role: "manager" });

    res.json({
      totalRevenue,
      totalRentals: rentals.length,
      details,
      activeManagers,
    });
  } catch (error) {
    console.error("Error generating financial report:", error);
    res
      .status(500)
      .json({
        message: "Error generating financial report",
        error: error.message,
      });
  }
};

/**
 * Promote or demote a user to/from manager.
 */
export const manageManagers = async (req, res) => {
  try {
    const { email, action, userId } = req.body;
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (userId) {
      user = await User.findById(userId);
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "promote") {
      user.role = "manager";
    } else if (action === "demote") {
      user.role = "user";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.json({ message: `User ${action}d successfully`, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error managing managers", error: error.message });
  }
};
