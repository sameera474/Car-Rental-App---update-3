import React, { createContext, useContext, useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  responsiveFontSizes,
} from "@mui/material";

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode: isDarkMode ? "dark" : "light",
        primary: {
          main: isDarkMode ? "#9e9e9e" : "#F7B416",
        },
        background: {
          default: isDarkMode ? "#121212" : "#f5f5f5",
          paper: isDarkMode ? "#1d1d1d" : "#ffffff",
        },
        text: {
          primary: isDarkMode ? "#ffffff" : "#000000",
          secondary: isDarkMode ? "#cccccc" : "#333333",
        },
      },
      typography: {
        allVariants: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
    });

    return responsiveFontSizes(baseTheme);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => useContext(ThemeContext);
