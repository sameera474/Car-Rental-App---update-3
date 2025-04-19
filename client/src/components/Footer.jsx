import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 2,
        bgcolor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Car Rental Company
      </Typography>
    </Box>
  );
};

export default Footer;
