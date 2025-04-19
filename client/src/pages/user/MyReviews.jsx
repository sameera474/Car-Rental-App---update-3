// File: client/src/pages/user/MyReviews.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const MyReviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/reviews/user/${userId}`);
        setReviews(data);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReviews();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      {reviews.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No reviews submitted yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {reviews.map((review) => (
            <Grid item xs={12} sm={6} md={4} key={review._id}>
              <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {review.car?.brand} {review.car?.model}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : ""}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {review.comment}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyReviews;
