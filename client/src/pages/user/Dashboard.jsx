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

// Avatar helper function to build proper avatar URLs
const getAvatarUrl = (avatar, userId) => {
  if (avatar) {
    return avatar.startsWith("http")
      ? avatar
      : `${process.env.REACT_APP_API_URL}/uploads/avatars/${avatar}`;
  }
  return `https://i.pravatar.cc/80?u=${userId || "guest"}`;
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [rentalSummary, setRentalSummary] = useState({
    activeRentals: 0,
    pastRentals: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    if (user?.id) fetchRentalSummary();
  }, [user]);

  if (loading)
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );

  if (error)
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar
          src={getAvatarUrl(user.avatar, user.id)}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Box>
          <Typography variant="h4">
            Welcome, {user.name || user.email}!
          </Typography>
          {user.role === "user" && (
            <Rating value={user.rating || 0} precision={0.5} readOnly />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Rental Summary
            </Typography>
            <Typography>
              Active Rentals: {rentalSummary.activeRentals}
            </Typography>
            <Typography>Past Rentals: {rentalSummary.pastRentals}</Typography>
            <Typography>
              Total Spent: ${rentalSummary.totalSpent.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>
            <Typography>Name: {user.name}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Phone: {user.phone || "Not set"}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              My Reviews
            </Typography>
            <MyReviews userId={user.id} />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          My Rental History
        </Typography>
        <MyRentals />
      </Box>
    </Container>
  );
};

export default UserDashboard;
