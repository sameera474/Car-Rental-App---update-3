import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Replace with your actual Google OAuth flow.
    alert("Google registration coming soon!");
  };

  const handleAppleRegister = () => {
    // Replace with your actual Apple OAuth flow.
    alert("Apple registration coming soon!");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      sx={{ p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "300px" }}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          helperText="Select your role"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="boss">Boss</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </Box>
      <Divider sx={{ width: "300px", my: 2 }}>OR</Divider>
      <Box
        sx={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleGoogleRegister}
        >
          Continue with Google
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleAppleRegister}
        >
          Continue with Apple
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
