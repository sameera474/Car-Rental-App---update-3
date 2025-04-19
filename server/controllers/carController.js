// File: server/controllers/carController.js
import Car from "../models/Car.js"; // Import Car only once
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Set up __dirname for ES Modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Add new car with file upload support for main image and gallery images.
export const addCar = async (req, res) => {
  try {
    const { body } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    const requiredFields = ["brand", "model", "year", "pricePerDay", "mileage"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing fields: ${missingFields.join(", ")}` });
    }
    if (!req.files?.image && !body.imageUrl) {
      return res.status(400).json({ message: "Main image is required" });
    }

    // Build car data using text fields and image(s) provided.
    const carData = {
      brand: body.brand,
      model: body.model,
      year: Number(body.year),
      pricePerDay: Number(body.pricePerDay),
      mileage: Number(body.mileage),
      seats: Number(body.seats || 5),
      doors: Number(body.doors || 5),
      transmission: body.transmission || "Manual",
      location: body.location || "Main Branch",
      image: req.files?.image
        ? `${protocol}://${host}/uploads/${req.files.image[0].filename}`
        : body.imageUrl || "",
      isAvailable: body.isAvailable !== "false",
      status: "active",
      category: body.category || "Economy",
      featured: body.featured === "true",
    };

    // Process gallery files if provided.
    if (req.files?.gallery) {
      const galleryUrls = req.files.gallery.map(
        (file) => `${protocol}://${host}/uploads/${file.filename}`
      );
      carData.gallery = galleryUrls;
    }

    const newCar = await Car.create(carData);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({ message: error.message || "Error adding car" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { body } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    const updates = {
      brand: body.brand,
      model: body.model,
      year: Number(body.year),
      pricePerDay: Number(body.pricePerDay),
      mileage: Number(body.mileage),
      seats: Number(body.seats || 5),
      doors: Number(body.doors || 5),
      transmission: body.transmission || "Manual",
      location: body.location || "Main Branch",
      image: req.files?.image
        ? `${protocol}://${host}/uploads/${req.files.image[0].filename}`
        : body.imageUrl || "",
      isAvailable: true,
      status: "active",
      category: body.category || "Economy",
      featured: body.featured === "true",
    };

    if (req.files?.gallery) {
      const galleryUrls = req.files.gallery.map(
        (file) => `${protocol}://${host}/uploads/${file.filename}`
      );
      updates.gallery = galleryUrls; // Replace the existing gallery.
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error updating car" });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
};

export const getAvailableCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true, status: "active" }).sort({
      createdAt: -1,
    });
    res.json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching available cars", error: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching car", error: error.message });
  }
};

export const removeCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { status: "removed", isAvailable: false },
      { new: true }
    );
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car marked as removed", car });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing car", error: error.message });
  }
};

export const getFeaturedCars = async (req, res) => {
  try {
    // Find cars where the featured flag is set to true.
    const featuredCars = await Car.find({ featured: true });
    res.json(featuredCars);
  } catch (error) {
    console.error("Error fetching featured cars:", error);
    res.status(500).json({ message: "Error fetching featured cars" });
  }
};

export const getPopularCars = async (req, res) => {
  try {
    // Example: sort by creation date descending and limit the results.
    const popularCars = await Car.find().sort({ createdAt: -1 }).limit(10);
    res.json(popularCars);
  } catch (error) {
    console.error("Error fetching popular cars:", error);
    res.status(500).json({ message: "Error fetching popular cars" });
  }
};

export const getCarCategories = async (req, res) => {
  try {
    // Return a static list of categories.
    const categories = ["Economy", "SUV", "Luxury", "Convertible", "Van"];
    res.json(categories);
  } catch (error) {
    console.error("Error fetching car categories:", error);
    res.status(500).json({ message: "Error fetching car categories" });
  }
};
