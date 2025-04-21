// File: client/src/components/Footer.jsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 2,
        bgcolor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} SAMEERA Car Rental Company
      </Typography>
    </Box>
  );
};

export default Footer;
