// File: client/src/pages/user/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRentalSummary = async () => {
      try {
        const { data } = await axiosInstance.get(`/rentals/user/${user.id}`);
        console.log("Fetched rentals for user:", data); // Debug: log fetched data

        // Filter rentals by status.
        const activeRentals = data.filter((r) => r.status === "active");
        const pastRentals = data.filter((r) => r.status === "completed");
        const totalSpent = pastRentals.reduce(
          (sum, r) => sum + (r.totalCost || 0),
          0
        );

        setRentalSummary({
          activeRentals: activeRentals.length,
          pastRentals: pastRentals.length,
          totalSpent,
        });
      } catch (err) {
        console.error("Error fetching rental summary:", err);
        setError("Failed to load rental summary");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRentalSummary();
    }
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || user?.email}!
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Rental Summary
              </Typography>
              <Typography variant="body1">
                Active Rentals: {rentalSummary.activeRentals}
              </Typography>
              <Typography variant="body1">
                Past Rentals: {rentalSummary.pastRentals}
              </Typography>
              <Typography variant="body1">
                Total Spent: ${rentalSummary.totalSpent.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Account Summary
              </Typography>
              <Typography variant="body1">Name: {user.name}</Typography>
              <Typography variant="body1">Email: {user.email}</Typography>
              <Typography variant="body1">
                Phone: {user.phone || "Not set"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                My Reviews
              </Typography>
              <MyReviews userId={user.id} />
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            My Rental History
          </Typography>
          <MyRentals />
        </Box>
      </Box>
    </Container>
  );
};

export default UserDashboard;
