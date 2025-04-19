// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import connectDB from "./config/db.js"; // ← make sure this path is correct
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bossRoutes from "./routes/bossRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import fileRoutes from "./routes/fileRoutes.js"; // if you have one

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 1) Connect to MongoDB
connectDB();

// 2) Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3) Enable CORS
//    Whitelist your dev and prod front‑end origins here
const WHITELIST = [
  "http://localhost:5173",
  "https://car-rental-app-bice-seven.vercel.app",
];
app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin || WHITELIST.includes(incomingOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Preflight for all routes
app.options("*", cors());

// 4) JSON parser
app.use(express.json());

// 5) Mount your API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boss", bossRoutes);
app.use("/api/admin", adminRoutes);

// 6) If you need GridFS/fileRoutes
app.use("/api/files", fileRoutes);

// 7) Global error handler
app.use((err, req, res, next) => {
  console.error("🔥", err);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || "Server Error" });
});

// 8) Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
