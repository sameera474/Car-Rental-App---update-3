import React from "react";
import { Container } from "@mui/material";

const MainLayout = ({ children }) => {
  return <Container sx={{ minHeight: "80vh", mt: 4 }}>{children}</Container>;
};

export default MainLayout;
