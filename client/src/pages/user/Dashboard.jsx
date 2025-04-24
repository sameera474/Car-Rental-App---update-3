import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Rating,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import MyReviews from "./MyReviews";
import MyRentals from "./MyRentals";

const UserDashboard = () => {
  const { user } = useAuth();
  const [rentalSummary, setRentalSummary] = useState({
    activeRentals: 0,
    pastRentals: 0,
    totalSpent: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(user);

  // Helper: Get proper avatar URL
  const getAvatarUrl = (avatar, userId) => {
    if (!avatar) return `https://i.pravatar.cc/100?u=${userId || "guest"}`;

    // Already a full Cloudinary or external image
    if (avatar.startsWith("http")) return avatar;

    // From local upload (backend returns filename only)
    return `${import.meta.env.VITE_API_URL}/uploads/avatars/${avatar}`;
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/users/profile");
        if (data) {
          setUserData(data);
        }
      } catch (err) {
        console.error("Failed to refresh user data");
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchRentalSummary = async () => {
      try {
        const { data } = await axiosInstance.get(`/rentals/user/${user.id}`);
        const active = data.filter((r) => r.status === "active");
        const past = data.filter((r) => r.status === "completed");
        const spent = past.reduce((sum, r) => sum + (r.totalCost || 0), 0);
        setRentalSummary({
          activeRentals: active.length,
          pastRentals: past.length,
          totalSpent: spent,
        });
      } catch (err) {
        console.error("Error fetching rental summary:", err);
        setError("Failed to load rental summary");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/reviews/user/${user.id}`);
        setReviews(data);
        if (data.length > 0) {
          const totalRating = data.reduce((sum, r) => sum + r.rating, 0);
          setAverageRating(totalRating / data.length);
        }
      } catch (err) {
        console.error("Error fetching user reviews:", err);
      }
    };

    if (user?.id) {
      fetchRentalSummary();
      fetchReviews();
    }
  }, [user]);

  if (loading)
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );

  if (error)
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            src={getAvatarUrl(userData.avatar, userData._id)}
            sx={{ width: 100, height: 100 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome, {userData.name || userData.email}!
            </Typography>
            {user.role === "user" && (
              <Rating value={averageRating} precision={0.5} readOnly />
            )}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Rental Summary
            </Typography>
            <Typography>Active: {rentalSummary.activeRentals}</Typography>
            <Typography>Completed: {rentalSummary.pastRentals}</Typography>
            <Typography>
              Total Spent: ${rentalSummary.totalSpent.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Account Info
            </Typography>
            <Typography>Name: {user.name}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Phone: {user.phone || "Not Provided"}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" align="center" gutterBottom>
              My Reviews
            </Typography>
            <MyReviews userId={user.id} />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Rental History
        </Typography>
        <MyRentals />
      </Box>
    </Container>
  );
};

export default UserDashboard;
