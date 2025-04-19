// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import connectDB from "./config/db.js"; // ← fixed import
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bossRoutes from "./routes/bossRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import fileRoutes from "./routes/fileRoutes.js"; // if using GridFS or similar

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 1) Connect to MongoDB
connectDB();

// 2) Serve static uploads (if using diskStorage)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3) CORS
const WHITELIST = [
  "http://localhost:5173", // your React dev server
  "https://car-rental-app-bice-seven.vercel.app", // your deployed React
];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. curl, mobile apps)
      if (!origin || WHITELIST.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// handle OPTIONS preflight for all routes
app.options("*", cors());

// 4) JSON body parser
app.use(express.json());

// 5) API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boss", bossRoutes);
app.use("/api/admin", adminRoutes);

// 6) If you have fileRoutes for GridFS, mount them
app.use("/api/files", fileRoutes);

// 7) Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message && err.message.startsWith("Not allowed by CORS")) {
    return res.status(403).json({ message: "CORS Error: " + err.message });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// 8) Start server (for a normal Express host like Render/Heroku)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
