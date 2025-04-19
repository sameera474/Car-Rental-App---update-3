import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const ManageBosses = () => {
  const [bosses, setBosses] = useState([]);
  const [newBossEmail, setNewBossEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBosses = async () => {
      try {
        // Call the endpoint "/admin/bosses"
        const response = await axiosInstance.get("/admin/bosses");
        setBosses(response.data);
      } catch (error) {
        console.error("Error fetching bosses:", error);
        setError("Failed to load bosses");
      }
    };
    fetchBosses();
  }, []);

  const handleAddBoss = async () => {
    try {
      setError("");
      // Promote a user to boss using POST /admin/bosses
      const response = await axiosInstance.post("/admin/bosses", {
        email: newBossEmail,
      });
      setBosses((prev) => [...prev, response.data]);
      setNewBossEmail("");
      setOpenDialog(false);
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDemote = async (userId) => {
    try {
      // Delete (demote) boss via DELETE /admin/bosses/:id
      await axiosInstance.delete(`/admin/bosses/${userId}`);
      setBosses(bosses.filter((boss) => boss._id !== userId));
    } catch (error) {
      alert(error.response?.data?.message || "Demotion failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Bosses
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="User Email"
          value={newBossEmail}
          onChange={(e) => setNewBossEmail(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Button variant="contained" onClick={handleAddBoss}>
          Promote to Boss
        </Button>
      </Box>
      <Paper sx={{ p: 2 }}>
        <List>
          {bosses.map((boss) => (
            <React.Fragment key={boss._id}>
              <ListItem>
                <ListItemText
                  primary={boss.name || boss.email}
                  secondary={`${boss.email} (ID: ${boss._id})`}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDemote(boss._id)}
                >
                  Demote to User
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Boss</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User Email"
            fullWidth
            value={newBossEmail}
            onChange={(e) => setNewBossEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBoss} variant="contained">
            Promote
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageBosses;
