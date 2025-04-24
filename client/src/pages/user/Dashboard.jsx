// File: client/src/pages/UserDashboard.jsx
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

// Helper: Return full Cloudinary URL or fallback avatar
const getAvatarUrl = (avatar, userId) => {
  if (avatar?.startsWith("http")) return avatar;
  if (!avatar) return `https://i.pravatar.cc/100?u=${userId || "guest"}`;
  return avatar;
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
            src={getAvatarUrl(user.avatar, user.id)}
            sx={{ width: 100, height: 100 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome, {user.name || user.email}!
            </Typography>
            {user.role === "user" && (
              <Rating value={user.rating || 0} precision={0.5} readOnly />
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

        <Grid item xs={12} md={4}>
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
