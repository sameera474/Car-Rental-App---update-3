import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 3,
        mt: 4,
        background: isDark
          ? "linear-gradient(to right, #232526, #414345)"
          : "linear-gradient(to right, #f3f4f6, #e2e8f0)",
        color: isDark ? "#eee" : "#333",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} <strong>SAM Car Rental</strong> — All
        rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;
