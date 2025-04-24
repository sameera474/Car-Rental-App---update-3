
import React from "react";
import { Box, Container, Toolbar } from "@mui/material";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}
  >
   
    <Toolbar />

    <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
      {children}
    </Container>

    <Footer />
  </Box>
);

export default MainLayout;
