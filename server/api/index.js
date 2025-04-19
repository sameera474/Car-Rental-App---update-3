// File: api/index.js
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import carRoutes from "../routes/carRoutes.js";
import rentalRoutes from "../routes/rentalRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import bossRoutes from "../routes/bossRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";

const app = express();
connectDB();
app.use(express.json());
app.use(cors());
// serve uploads
app.use("/uploads", express.static("./uploads"));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/cars", carRoutes);
app.use("/rentals", rentalRoutes);
app.use("/reviews", reviewRoutes);
app.use("/boss", bossRoutes);
app.use("/dmin", adminRoutes);

// export the handler that Vercel will invoke
export const handler = serverless(app);
export default app;
