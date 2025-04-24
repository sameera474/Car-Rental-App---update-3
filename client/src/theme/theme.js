import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#aaa" },
            background: { default: "#f0f0f0", paper: "#fff" },
            text: { primary: "#111" },
          }
        : {
            primary: { main: "#1976d2" },
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#fff" },
          }),
    },
  });
