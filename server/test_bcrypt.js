import bcrypt from "bcryptjs";

const storedPassword = "$2b$10$NEW_HASH_FROM_DB"; // Replace with the new hash from MongoDB
const userInputPassword = "Sameera"; // The password you used to register

bcrypt
  .compare(userInputPassword, storedPassword)
  .then((isMatch) => console.log("✅ Password Match Result:", isMatch))
  .catch((err) => console.error("❌ bcrypt error:", err));
