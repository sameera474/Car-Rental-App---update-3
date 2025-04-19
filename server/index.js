// Add static files serving
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import statsRoutes from "./routes/statsRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Add this before routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use("/api/stats", statsRoutes);
