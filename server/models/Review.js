import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
    minlength: [10, "Comment must be at least 10 characters"],
    maxlength: [500, "Comment cannot exceed 500 characters"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.index({ user: 1, car: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
