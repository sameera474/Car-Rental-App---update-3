// File: client/src/pages/public/AllReviews.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Rating,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get("/reviews/recent");
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Reviews
      </Typography>
      <Grid container spacing={2}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <img
                    src={
                      review.user?.avatar ||
                      "https://via.placeholder.com/60?text=Avatar"
                    }
                    alt={review.user?.name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      marginRight: 8,
                    }}
                  />
                  <Typography variant="h6">
                    {review.user?.name || review.user?.email}
                  </Typography>
                </Box>
                <Rating
                  value={review.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {review.comment}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllReviews;
