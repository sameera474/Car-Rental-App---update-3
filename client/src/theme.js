import { createTheme } from "@mui/material/styles";

// Blue Theme (default)
export const blueTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // blue
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

// Light Gray Theme
export const grayTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#9e9e9e", // light gray
    },
    background: {
      default: "#fafafa",
    },
  },
});
