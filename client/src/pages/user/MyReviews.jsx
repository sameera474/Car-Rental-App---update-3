import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Rating,
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

    if (userId) fetchReviews();
  }, [userId]);

  const getAvatarUrl = (avatar, fallbackId) => {
    if (!avatar) return `https://i.pravatar.cc/80?u=${fallbackId}`;
    if (avatar.startsWith("http")) return avatar;
    return `${import.meta.env.VITE_API_URL}/uploads/avatars/${avatar}`;
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ mt: 2 }}>
      {reviews.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No reviews submitted yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} sm={6} md={4} key={review._id}>
              <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      src={getAvatarUrl(review.user?.avatar, review.user?._id)}
                      sx={{ width: 48, height: 48, mr: 1 }}
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        {review.user?.name || "Anonymous"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {review.car?.brand} {review.car?.model}
                  </Typography>
                  <Rating
                    value={review.rating}
                    precision={0.5}
                    readOnly
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body1">{review.comment}</Typography>
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
