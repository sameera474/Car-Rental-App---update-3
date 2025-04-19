import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";

const AddStaff = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager"); // Default Role
  const navigate = useNavigate();

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // ✅ Get Admin/Boss Token
      await axios.post(
        "http://localhost:5000/api/admin/add-staff",
        { name, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Staff registered successfully!");
      navigate("/admin/dashboard"); // Redirect after success
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add staff");
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
        Register New Staff
      </Typography>
      <Box
        component="form"
        onSubmit={handleAddStaff}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
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
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
        >
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="boss">Boss</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register Staff
        </Button>
      </Box>
    </Container>
  );
};

export default AddStaff;
