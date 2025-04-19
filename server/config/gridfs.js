// File: server/config/gridfs.js
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI, // Your MongoDB connection string
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: "uploads", // Bucket name in MongoDB for storing images
    };
  },
});

export default storage;
