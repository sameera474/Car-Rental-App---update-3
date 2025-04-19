import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companyLogin } from "../../services/authService";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
} from "@mui/material";

const CompanyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager"); // Default role selection
  const [error, setError] = useState(""); // ✅ Store login errors
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    try {
      const success = await companyLogin({ email, password, role });

      if (success) {
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "boss") navigate("/boss/dashboard");
        else if (role === "manager") navigate("/manager/dashboard");
      }
    } catch (error) {
      setError(error.message); // ✅ Display error message instead of alert
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        p: 3,
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: 2,
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Company Staff Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <TextField
          select
          label="Select Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
        >
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="boss">Boss</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default CompanyLogin;
