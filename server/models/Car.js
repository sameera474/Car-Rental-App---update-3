import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    brand: { type: String, required: [true, "Brand is required"] },
    model: { type: String, required: [true, "Model is required"] },
    year: { type: Number, required: [true, "Year is required"] },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
    },
    mileage: { type: Number, required: [true, "Mileage is required"] },
    seats: { type: Number, default: 5 },
    doors: { type: Number, default: 5 },
    transmission: { type: String, default: "Manual" },
    location: { type: String, default: "Main Branch" },
    image: { type: String }, // Main image URL
    gallery: { type: [String], default: [] }, // Array of additional image URLs
    isAvailable: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["active", "returned", "removed"],
      default: "active",
    },
    featured: { type: Boolean, default: false },
    category: { type: String, default: "Economy" },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", CarSchema);
export default Car;
