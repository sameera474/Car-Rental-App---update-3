import Rental from "../models/Rental.js";
import Car from "../models/Car.js";
import User from "../models/User.js";

export const approveRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.rentalId);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    rental.status = "approved";
    await rental.save();
    res.json({ message: "Rental approved" });
  } catch (error) {
    res.status(500).json({ message: "Error approving rental" });
  }
};

export const lockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { status: "locked" });
    res.json({ message: "User locked" });
  } catch (error) {
    res.status(500).json({ message: "Error locking user" });
  }
};

export const getReturnedCars = async (req, res) => {
  try {
    // Returned cars are those that have been processed after a rental
    const returnedCars = await Car.find({ status: "returned" });
    res.json(returnedCars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching returned cars" });
  }
};
