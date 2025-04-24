import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CarRentalApp/avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [
      { width: 300, height: 300, crop: "thumb", gravity: "face" },
    ],
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
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");

export default uploadAvatar;
