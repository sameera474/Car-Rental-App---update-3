import Car from "../models/Car.js";

export const addCar = async (req, res) => {
  try {
    const { body } = req;

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
      image: req.files?.image ? req.files.image[0].path : body.imageUrl || "",
      gallery: req.files?.gallery?.map((file) => file.path) || [],
      isAvailable: body.isAvailable !== "false",
      status: "active",
      category: body.category || "Economy",
      featured: body.featured === "true",
    };

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
      image: req.files?.image ? req.files.image[0].path : body.imageUrl || "",
      gallery: req.files?.gallery?.map((file) => file.path) || [],
      isAvailable: true,
      status: "active",
      category: body.category || "Economy",
      featured: body.featured === "true",
    };

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(updatedCar);
  } catch (error) {
    console.error("Update car error:", error);
    res.status(500).json({ message: error.message || "Error updating car" });
  }
};

// List all cars
export const getAllCars = async (req, res) => {
  try {
    const { loc, location } = req.query;
    const filter = {};
    if (loc) filter.location = loc;
    else if (location) filter.location = location;

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
};

// List available cars
export const getAvailableCars = async (req, res) => {
  try {
    const { loc, location } = req.query;
    const filter = { isAvailable: true, status: "active" };

    if (loc) filter.location = loc;
    else if (location) filter.location = location;

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching available cars", error: error.message });
  }
};

// Single car details
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

// Soft-remove a car
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

// Featured cars
export const getFeaturedCars = async (req, res) => {
  try {
    const featuredCars = await Car.find({ featured: true });
    res.json(featuredCars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured cars" });
  }
};

// Popular cars
export const getPopularCars = async (req, res) => {
  try {
    const popularCars = await Car.find().sort({ createdAt: -1 }).limit(10);
    res.json(popularCars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching popular cars" });
  }
};

// Car categories
export const getCarCategories = async (req, res) => {
  try {
    const categories = ["Economy", "SUV", "Luxury", "Convertible", "Van"];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car categories" });
  }
};

// Permanently delete a car
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    await car.deleteOne();
    res.json({ message: "Car permanently deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car" });
  }
};

// Toggle featured flag
export const toggleFeatured = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    car.featured = Boolean(req.body.featured);
    await car.save();
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error toggling featured" });
  }
};

// Cars by category
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
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars by category" });
  }
};
