// File: client/src/pages/boss/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import FinancialReport from "./FinancialReport";
import ManageManagers from "./ManageManagers";

const BossDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Call "/boss/financial-report" using the base URL from axiosInstance
        const response = await axiosInstance.get("/boss/financial-report");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Boss Dashboard
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              {stats ? (
                <>
                  <Typography>
                    Total Revenue: ${stats.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography>Total Rentals: {stats.totalRentals}</Typography>
                  <Typography>
                    Active Managers: {stats.activeManagers}
                  </Typography>
                </>
              ) : (
                <CircularProgress />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body1">
                {/* You can add a recent activity list here */}
                No recent activity.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FinancialReport />
          </Grid>
          <Grid item xs={12}>
            <ManageManagers />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BossDashboard;
