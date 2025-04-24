// server/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bossRoutes from "./routes/bossRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 1) Connect to Mongo
connectDB();

// 2) CORS: allow frontend origins *and* PATCH
const FRONTEND = [
  "http://localhost:5173",
  "https://car-rental-app-update-31.vercel.app",
  "https://car-rental-app-update-31-6bb4er1ay-sameeras-projects-7a5677db.vercel.app", // ✅ ← add this full Vercel deployment domain
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || FRONTEND.includes(origin)) cb(null, true);
      else cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// respond to all preflight requests
app.options("*", cors());

// 3) Body parser
app.use(express.json());

// 4) Static uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 5) API routes (you can choose /api prefix if you like)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boss", bossRoutes);
app.use("/api/admin", adminRoutes);

// 6) Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal Server Error" });
});

// 7) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
