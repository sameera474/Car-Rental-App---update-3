import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const ReviewCar = () => {
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", review);
    setReview("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Leave a Review
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "400px" }}>
        <TextField
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          value={review}
          onChange={(e) => setReview(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewCar;
