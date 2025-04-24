import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { CustomThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
