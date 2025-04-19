// File: client/src/pages/admin/Dashboard.jsx
import React from "react";
import { Container, Box, Typography, Paper, Grid } from "@mui/material";
import ManageBosses from "./ManageBosses";
import ResetSystem from "./ResetSystem";

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">System Overview</Typography>
              <Typography variant="body1">
                Statistics and system status go here.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <ManageBosses />
          </Grid>
          <Grid item xs={12}>
            <ResetSystem />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
