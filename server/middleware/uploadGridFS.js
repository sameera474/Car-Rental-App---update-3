// server/middleware/uploadGridFS.js
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const gridStorage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "uploads", // Bucket name
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const uploadCarFiles = multer({
  storage: gridStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

// Separate middleware for avatars using GridFS
const avatarStorage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "avatars",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");
