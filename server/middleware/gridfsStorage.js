import multerGridfsStorage from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_URI } = process.env;

// Create and export the GridFS storage engine.
export const storage = new multerGridfsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Create a unique filename
      const filename = Date.now() + "-" + file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});
