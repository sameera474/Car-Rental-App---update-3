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
import cors from "cors"; // ← import cors
import connectDB from "./config/db.js";
// ... your other imports (authRoutes, carRoutes, etc.)

const app = express();

// 1️⃣ Configure CORS to allow your front‑end origins:
app.use(
  cors({
    origin: [
      "https://car-rental-app-bice-seven.vercel.app", // your deployed front‑end
      "http://localhost:5173", // local dev front‑end
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 2️⃣ JSON body parser
app.use(express.json());

// 3️⃣ connect to database
connectDB();

// 4️⃣ mount your routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boss", bossRoutes);
app.use("/api/admin", adminRoutes);

// 5️⃣ error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
