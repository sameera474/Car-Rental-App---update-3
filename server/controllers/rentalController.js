import Rental from "../models/Rental.js";
import Car from "../models/Car.js";
import User from "../models/User.js";

/**
 * Get rental history for the logged-in user.
 */
export const getUserRentals = async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const rentals = await Rental.find({ user: req.params.userId })
      .populate({ path: "car", select: "brand model image pricePerDay" })
      .sort({ startDate: -1 });
    res.json(rentals);
  } catch (error) {
    console.error("Get rentals error:", error);
    res
      .status(500)
      .json({ message: "Error fetching rental history", error: error.message });
  }
};

/**
 * Create a rental for a car.
 */
export const rentCar = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const userId = req.user.id;
    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ message: "Invalid rental dates" });
    }
    const car = await Car.findOne({ _id: carId, isAvailable: true });
    if (!car) {
      return res.status(404).json({ message: "Car not available" });
    }
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalCost = days * car.pricePerDay;

    const session = await Rental.startSession();
    session.startTransaction();
    try {
      const newRental = await Rental.create(
        [
          {
            user: userId,
            car: carId,
            startDate: start,
            endDate: end,
            totalCost,
            status: "active",
          },
        ],
        { session }
      );
      // Mark the car as not available while it’s being rented
      await Car.findByIdAndUpdate(carId, { isAvailable: false }, { session });
      await session.commitTransaction();
      res.status(201).json(newRental[0]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Rent car error:", error);
    res
      .status(500)
      .json({ message: error.message || "Error processing rental" });
  }
};

/**
 * Process returning a rented car.
 */
export const returnCar = async (req, res) => {
  const session = await Rental.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const rental = await Rental.findOneAndUpdate(
      { _id: id, user: userId, status: "active" },
      { status: "completed" },
      { new: true, session }
    ).populate("car");
    if (!rental)
      return res.status(404).json({ message: "Active rental not found" });
    // Note: Car availability is not automatically changed here;
    // you may add logic to mark the car available if needed.
    await session.commitTransaction();
    res.json({ message: "Return request submitted", carId: rental.car._id });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ message: error.message || "Error processing return" });
  } finally {
    session.endSession();
  }
};

/**
 * Retrieve all pending rental requests.
 */
export const getPendingRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ status: "pending" })
      .populate("user", "email")
      .populate("car", "brand model");
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending rentals" });
  }
};

/**
 * Update the status of a rental.
 */
export const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const rental = await Rental.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("car");
    if (status === "processed") {
      await Car.findByIdAndUpdate(rental.car._id, { isAvailable: true });
    }
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "Error updating rental status" });
  }
};

/**
 * Get rentals that have been completed (returned).
 */
export const getReturnedCars = async (req, res) => {
  try {
    const returnedCars = await Rental.find({ status: "completed" })
      .populate("car", "brand model")
      .sort({ endDate: -1 });
    res.json(returnedCars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching returned cars" });
  }
};

/**
 * Approve a rental request.
 */
export const approveRental = async (req, res) => {
  const session = await Rental.startSession();
  session.startTransaction();
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true, session }
    ).populate("car");
    await Car.findByIdAndUpdate(
      rental.car._id,
      { isAvailable: false },
      { session }
    );
    await session.commitTransaction();
    res.json({ message: "Rental approved successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error approving rental" });
  } finally {
    session.endSession();
  }
};

/**
 * Get overall rental statistics.
 */
export const getRentalStats = async (req, res) => {
  try {
    const [totalRevenueAgg, availableCars, completedRentals, pendingRequests] =
      await Promise.all([
        Rental.aggregate([
          { $group: { _id: null, total: { $sum: "$totalCost" } } },
        ]),
        Car.countDocuments({ isAvailable: true }),
        Rental.countDocuments({ status: "completed" }),
        Rental.countDocuments({ status: "pending" }),
      ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    res.json({
      totalRevenue,
      availableCars,
      completedRentals,
      pendingRequests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

/**
 * Get dashboard statistics for managers.
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Count rentals with specific statuses
    const completedRentals = await Rental.countDocuments({
      status: "completed",
    });
    const pendingRequests = await Rental.countDocuments({ status: "pending" });

    // Total revenue from all rentals
    const revenueAgg = await Rental.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalCost" } } },
    ]);
    const totalRevenue = revenueAgg[0] ? revenueAgg[0].totalRevenue : 0;

    // Count available cars (only those that are "active" and available)
    const availableCars = await Car.countDocuments({
      isAvailable: true,
      status: "active",
    });

    // Log values for debugging
    console.log("Dashboard Stats Debug:", {
      completedRentals,
      pendingRequests,
      totalRevenue,
      availableCars,
    });

    // Aggregate monthly revenue data
    const monthlyRevenue = await Rental.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$startDate" },
            month: { $month: "$startDate" },
          },
          revenue: { $sum: "$totalCost" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lte: ["$_id.month", 9] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          revenue: 1,
          count: 1,
        },
      },
    ]);

    res.json({
      totalRevenue,
      availableCars,
      completedRentals,
      pendingRequests,
      monthlyRevenue,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching dashboard stats",
        error: error.message,
      });
  }
};
