import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envConfig.js";

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in .env file");
}

export const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
};
