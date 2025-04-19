// // Add static files serving
// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import cors from "cors";
// import statsRoutes from "./routes/statsRoutes.js";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const app = express();

// // Add this before routes
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
// app.use("/api/stats", statsRoutes);

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

// —— 1) Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// —— 2) CORS: allow exactly your front‑ends (and handle preflight)
const WHITELIST = [
  "http://localhost:5173", // your React dev server
  "https://car‑rental‑app‑bice‑seven.vercel.app", // your deployed React
];
app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || WHITELIST.includes(origin)) return cb(null, true);
      cb(new Error("CORS not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content‑Type", "Authorization"],
    credentials: true,
  })
);
// make sure OPTIONS preflight also works
app.options("*", cors());

// —— 3) JSON body parser
app.use(express.json());

// —— 4) Connect to DB
connectDB();

// —— 5) Mount your routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boss", bossRoutes);
app.use("/api/admin", adminRoutes);

// —— 6) Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// —— 7) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
