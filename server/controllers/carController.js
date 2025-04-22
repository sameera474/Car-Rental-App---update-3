// File: server/controllers/carController.js
import Car from "../models/Car.js"; // Import Car only once
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Set up __dirname for ES Modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ────────────────────────────────────────────────────────
// 1) Create / Update
// ────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────
// 2) List all cars (for search & manager view)
//    Supports optional ?loc= or ?location= filtering.
// ────────────────────────────────────────────────────────
export const getAllCars = async (req, res) => {
  try {
    const { loc, location } = req.query;
    const filter = {}; // manager wants *all* cars; customers can filter

    // if customer provided a branch filter, apply it
    if (loc) filter.location = loc;
    else if (location) filter.location = location;

    // always sort newest first
    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
};

// ────────────────────────────────────────────────────────
// 3) List available cars
//    Supports optional ?loc= or ?location= filtering.
// ────────────────────────────────────────────────────────
export const getAvailableCars = async (req, res) => {
  try {
    const { loc, location } = req.query;
    const filter = { isAvailable: true, status: "active" };

    if (loc) filter.location = loc;
    else if (location) filter.location = location;

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching available cars:", error);
    res
      .status(500)
      .json({ message: "Error fetching available cars", error: error.message });
  }
};

// ────────────────────────────────────────────────────────
// 4) Single car details
// ────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────
// 5) Soft‐remove a car
// ────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────
// 6) Featured & popular & categories (unchanged)
// ────────────────────────────────────────────────────────
export const getFeaturedCars = async (req, res) => {
  try {
    const featuredCars = await Car.find({ featured: true });
    res.json(featuredCars);
  } catch (error) {
    console.error("Error fetching featured cars:", error);
    res.status(500).json({ message: "Error fetching featured cars" });
  }
};

export const getPopularCars = async (req, res) => {
  try {
    const popularCars = await Car.find().sort({ createdAt: -1 }).limit(10);
    res.json(popularCars);
  } catch (error) {
    console.error("Error fetching popular cars:", error);
    res.status(500).json({ message: "Error fetching popular cars" });
  }
};

export const getCarCategories = async (req, res) => {
  try {
    const categories = ["Economy", "SUV", "Luxury", "Convertible", "Van"];
    res.json(categories);
  } catch (error) {
    console.error("Error fetching car categories:", error);
    res.status(500).json({ message: "Error fetching car categories" });
  }
};

// ────────────────────────────────────────────────────────
// 7) Permanent delete
// ────────────────────────────────────────────────────────
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // OPTIONAL: delete files on disk
    if (car.image && car.image.includes("/uploads/")) {
      const filePath = path.join(
        __dirname,
        "uploads",
        path.basename(car.image)
      );
      fs.unlink(filePath, (err) => {
        if (err) console.warn("Failed to delete image file:", err);
      });
    }
    if (Array.isArray(car.gallery)) {
      car.gallery.forEach((url) => {
        if (url.includes("/uploads/")) {
          const fp = path.join(__dirname, "uploads", path.basename(url));
          fs.unlink(fp, (err) => {
            if (err) console.warn("Failed to delete gallery image:", err);
          });
        }
      });
    }

    await car.deleteOne();
    res.json({ message: "Car permanently deleted", id: req.params.id });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Error deleting car" });
  }
};

// ────────────────────────────────────────────────────────
// 8) Toggle featured flag
// ────────────────────────────────────────────────────────
export const toggleFeatured = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    car.featured = Boolean(req.body.featured);
    await car.save();
    res.json(car);
  } catch (err) {
    console.error("Error toggling featured:", err);
    res.status(500).json({ message: "Error toggling featured" });
  }
};

// ────────────────────────────────────────────────────────
// 9) Get by category with optional loc filter
// ────────────────────────────────────────────────────────
export const getCarsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { loc, location } = req.query;

    const filter = {
      category: new RegExp(`^${category}$`, "i"),
      isAvailable: true,
      status: "active",
    };

    if (loc) filter.location = loc;
    else if (location) filter.location = location;

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    console.error("Error fetching cars by category:", err);
    res.status(500).json({ message: err.message });
  }
};
