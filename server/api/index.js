// File: api/index.js
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import connectDB from "../server/config/db.js";
import authRoutes from "../server/routes/authRoutes.js";
import userRoutes from "../server/routes/userRoutes.js";
import carRoutes from "../server/routes/carRoutes.js";
import rentalRoutes from "../server/routes/rentalRoutes.js";
import reviewRoutes from "../server/routes/reviewRoutes.js";
import bossRoutes from "../server/routes/bossRoutes.js";
import adminRoutes from "../server/routes/adminRoutes.js";

const app = express();
connectDB();
app.use(express.json());
app.use(cors());
// serve uploads
app.use("/uploads", express.static("./server/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boss", bossRoutes);
app.use("/api/admin", adminRoutes);

// export the handler that Vercel will invoke
export const handler = serverless(app);
