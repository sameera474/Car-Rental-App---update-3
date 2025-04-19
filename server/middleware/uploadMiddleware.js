// server/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Determine __dirname for ES modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");

// Create the uploads directory if it doesn't exist.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define a single storage configuration.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create and export the multer middleware for car files.
// Accept one file for 'image' and up to 10 files for 'gallery'.
export const uploadCarFiles = multer({
  storage, // Use the single storage configuration
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
}).fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);
