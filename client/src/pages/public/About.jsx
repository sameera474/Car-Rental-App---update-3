import React from "react";
import { Typography, Box, Container, Paper } from "@mui/material";
import MainLayout from "../../layouts/MainLayout";

const About = () => {
  return (
    <MainLayout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h3" gutterBottom textAlign="center">
            About Our Car Rental Service
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to our Car Rental service! We provide the best vehicles at
            affordable prices, ensuring a seamless rental experience.
          </Typography>
          <Typography variant="h5" gutterBottom>
            Company Information
          </Typography>
          <Typography variant="body1">
            Established in 2023, our company has served thousands of satisfied
            customers. We offer a wide range of cars, from economy to luxury,
            across multiple locations.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Our Team
          </Typography>
          <Typography variant="body1">
            - CEO: John Doe - Managers: Jane Smith, Robert Brown - Customer
            Support: Available 24/7
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default About;
