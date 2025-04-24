import multer from "multer";
import { storage } from "../config/cloudinary.js";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

export const uploadCarFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

export default uploadCarFiles;
