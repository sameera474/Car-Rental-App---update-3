// File: client/src/pages/boss/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const BossProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/users/profile");
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const { data } = await axiosInstance.put("/users/profile", profile);
      // Assuming the backend responds with { user, token }
      setProfile(data.user);
      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error updating profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Boss Profile
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}
      <Paper sx={{ p: 2, maxWidth: "400px" }}>
        <Box component="form" onSubmit={handleSave}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BossProfile;
