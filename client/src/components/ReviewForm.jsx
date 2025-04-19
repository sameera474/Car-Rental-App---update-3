import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axiosInstance from "../services/axiosInstance";

const ReviewForm = ({ carId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Add carId validation
  useEffect(() => {
    if (!carId) {
      setError("No car selected for review");
      return;
    }
  }, [carId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Frontend validation
    if (!carId) {
      setError("No car selected for review");
      setLoading(false);
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      setLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review comment");
      setLoading(false);
      return;
    }
    try {
      await axiosInstance.post("/reviews", {
        carId,
        rating,
        comment,
      });
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || "Review submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Leave a Review
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {carId ? (
        <form onSubmit={handleSubmit}>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            precision={0.5}
          />

          <TextField
            label="Your Review"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      ) : (
        <Alert severity="error">No car selected for review</Alert>
      )}
    </Box>
  );
};

export default ReviewForm;
