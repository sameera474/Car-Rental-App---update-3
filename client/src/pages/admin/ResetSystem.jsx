import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const ResetSystem = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    try {
      setLoading(true);
      setError("");
      // Call the reset system endpoint, for example, POST /admin/reset-system
      await axiosInstance.post("/admin/reset-system");
      alert("System reset successfully! Logging out...");
      window.location.href = "/login";
    } catch (error) {
      setError(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Reset
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="body1" gutterBottom>
        <strong>Warning:</strong> This will permanently delete all data except
        admin accounts:
      </Typography>
      <ul>
        <li>All cars</li>
        <li>All rentals</li>
        <li>All reviews</li>
        <li>All users (except admins)</li>
      </ul>
      <Button
        variant="contained"
        color="error"
        onClick={() => setOpen(true)}
        sx={{ mt: 2 }}
      >
        Initiate System Reset
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Full System Reset</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you absolutely sure you want to reset the entire system?
          </Typography>
          <Typography color="error">
            This action cannot be undone and will delete all data except admin
            accounts!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm Reset"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResetSystem;
