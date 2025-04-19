// server/middleware/uploadAvatar.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Determine __dirname for ES modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const avatarDir = path.join(__dirname, "../uploads/avatars");

// Create the uploads/avatars directory if it doesn't exist.
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
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

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit per avatar
}).single("avatar");

export default uploadAvatar;
