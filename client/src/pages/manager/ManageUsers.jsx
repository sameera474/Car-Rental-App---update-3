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
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get("/users");
        setUsers(data);
      } catch (error) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const { data } = await axiosInstance.put(`/users/${userId}/status`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status: data.status } : user
        )
      );
    } catch (error) {
      setError("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      setError("Cannot delete your own account");
      return;
    }
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
    }
  };
  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await axiosInstance.put(`/users/${userId}`, {
        role: newRole,
      });
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? data : user))
      );
    } catch (error) {
      setError("Failed to update user role");
    }
  };

  const handleCreateUser = async () => {
    try {
      const { data } = await axiosInstance.post("/users", newUser);
      setUsers((prev) => [...prev, data]);
      setOpenDialog(false);
      setNewUser({ email: "", password: "", role: "user" });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create user");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Add New User
      </Button>

      <Paper sx={{ p: 2 }}>
        <List>
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem>
                <ListItemText
                  primary={user.email}
                  secondary={
                    <>
                      Status: {user.status} | Role: {user.role}
                    </>
                  }
                />
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color={user.status === "active" ? "error" : "primary"}
                    onClick={() => handleToggleStatus(user._id)}
                  >
                    {user.status === "active" ? "Lock" : "Unlock"}
                  </Button>
                  {user.role === "admin" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <Select
            label="Role"
            fullWidth
            margin="normal"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;
