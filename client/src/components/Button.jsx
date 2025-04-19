import React from "react";
import { Button as MuiButton } from "@mui/material";

const Button = ({
  variant = "contained",
  color = "primary",
  size = "medium",
  disabled = false,
  sx = {},
  children,
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      sx={sx}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
