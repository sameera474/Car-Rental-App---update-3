import React from "react";
import { Typography, Box, Container, Paper, Grid, Avatar } from "@mui/material";
import MainLayout from "../../layouts/MainLayout";

const About = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
        {/* Heading */}
        <Typography variant="h3" gutterBottom textAlign="center">
          About SAM Car Rental
        </Typography>

        {/* Intro */}
        <Typography variant="body1" paragraph textAlign="center">
          Welcome to <strong>SAM Car Rental</strong>! We offer premium and
          economy vehicles at competitive prices. Our mission is to make every
          rental experience simple, smooth, and stress-free.
        </Typography>

        {/* Company Info */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Company Information
        </Typography>
        <Typography variant="body1" paragraph>
          Founded in 2023, SAM Car Rental has become a trusted mobility partner,
          serving thousands of happy customers. We operate with a diverse fleet
          of well-maintained vehicles across multiple categories and locations.
          Your comfort and safety are our top priorities.
        </Typography>

        {/* Team Section */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Meet Our Team
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* CEO */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src="https://i.pravatar.cc/150?img=11"
              alt="Sameera Wagaarachchige"
              sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}
            />
            <Typography variant="h6">John Doe</Typography>
            <Typography variant="body2" color="textSecondary">
              Chief Executive Officer
            </Typography>
          </Grid>

          {/* Operations Manager */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src="https://i.pravatar.cc/150?img=32"
              alt="Jane Smith"
              sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}
            />
            <Typography variant="h6">Jane Smith</Typography>
            <Typography variant="body2" color="textSecondary">
              Operations Manager
            </Typography>
          </Grid>

          {/* Fleet Manager */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src="https://i.pravatar.cc/150?img=45"
              alt="Robert Brown"
              sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}
            />
            <Typography variant="h6">Robert Brown</Typography>
            <Typography variant="body2" color="textSecondary">
              Fleet Manager
            </Typography>
          </Grid>

          {/* Support Team */}
          <Grid item xs={12} textAlign="center">
            <Avatar
              src="https://i.pravatar.cc/150?img=20"
              alt="Support"
              sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}
            />
            <Typography variant="h6">Support Team</Typography>
            <Typography variant="body2" color="textSecondary">
              Customer Support – Available 24/7
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;
