import Rental from "../models/Rental.js";
import Car from "../models/Car.js";
import User from "../models/User.js";

export const getStats = async (req, res) => {
  try {
    const [monthlyRevenue, popularCars, userActivity] = await Promise.all([
      Rental.aggregate([
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
                { $substr: [{ $toString: "$_id.month" }, 0, 2] },
              ],
            },
            revenue: 1,
            count: 1,
          },
        },
      ]),
      Rental.aggregate([
        {
          $group: {
            _id: "$car",
            count: { $sum: 1 },
            totalRevenue: { $sum: "$totalCost" },
          },
        },
        {
          $lookup: {
            from: "cars",
            localField: "_id",
            foreignField: "_id",
            as: "carDetails",
          },
        },
        { $unwind: "$carDetails" },
        {
          $project: {
            _id: 0,
            brand: "$carDetails.brand",
            model: "$carDetails.model",
            count: 1,
            totalRevenue: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Rental.aggregate([
        {
          $group: {
            _id: "$user",
            rentals: { $sum: 1 },
            spending: { $sum: "$totalCost" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $project: {
            _id: 0,
            user: "$userDetails.email",
            rentals: 1,
            spending: 1,
          },
        },
        { $sort: { rentals: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({ monthlyRevenue, popularCars, userActivity });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};
