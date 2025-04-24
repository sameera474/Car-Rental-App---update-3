
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // The following options are no longer necessary with recent Mongoose versions
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
