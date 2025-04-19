// File: client/src/pages/manager/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  AttachMoney,
  DirectionsCar,
  CheckCircle,
  PendingActions,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../services/axiosInstance";

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Call the custom stats endpoint from your rental routes.
        const { data } = await axiosInstance.get("/rentals/dashboard-stats");
        setStats({
          totalRevenue: data.totalRevenue || 0,
          availableCars: data.availableCars || 0,
          completedRentals: data.completedRentals || 0,
          pendingRequests: data.pendingRequests || 0,
        });
        setChartData(data.monthlyRevenue || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Manager Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <AttachMoney fontSize="large" />
                  <div>
                    <Typography variant="h6">Total Revenue</Typography>
                    <Typography variant="h4">
                      ${stats.totalRevenue.toLocaleString()}
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <DirectionsCar fontSize="large" />
                  <div>
                    <Typography variant="h6">Available Cars</Typography>
                    <Typography variant="h4">{stats.availableCars}</Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckCircle fontSize="large" />
                  <div>
                    <Typography variant="h6">Completed Rentals</Typography>
                    <Typography variant="h4">
                      {stats.completedRentals}
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PendingActions fontSize="large" />
                  <div>
                    <Typography variant="h6">Pending Requests</Typography>
                    <Typography variant="h4">
                      {stats.pendingRequests}
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom>
          Monthly Revenue Overview
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default ManagerDashboard;
