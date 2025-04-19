// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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

// 1. Connect to MongoDB
connectDB();

// 2. Serve uploaded files (if you’re using diskStorage)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. CORS setup
//    Replace these URLs with your actual front‑end origins.
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://car-rental-app-bice-seven.vercel.app",
];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // allow requests with no origin (mobile apps, curl, postman)
      if (!incomingOrigin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(incomingOrigin)) {
        return callback(null, true);
      }
      callback(new Error("CORS policy: This origin is not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Handle preflight
app.options("*", cors());

// 4. JSON body parser
app.use(express.json());

// 5. Mount your routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boss", bossRoutes);
app.use("/api/admin", adminRoutes);

// 6. Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message.startsWith("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal Server Error" });
});

// 7. Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
