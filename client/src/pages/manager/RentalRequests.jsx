import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const RentalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axiosInstance.get("/rentals/pending");
        setRequests(data);
      } catch (err) {
        setError("Failed to load rental requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(`/rentals/${id}/status`, { status });
      setRequests((prev) => prev.filter((request) => request._id !== id));
    } catch (err) {
      setError("Failed to update status");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Rental Requests
      </Typography>
      <List>
        {requests.map((request) => (
          <React.Fragment key={request._id}>
            <ListItem>
              <ListItemText
                primary={`User: ${request.user?.email}`}
                secondary={`Car: ${request.car?.brand} ${
                  request.car?.model
                } | Requested: ${new Date(
                  request.createdAt
                ).toLocaleDateString()}`}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={() => handleStatusUpdate(request._id, "approved")}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleStatusUpdate(request._id, "rejected")}
              >
                Decline
              </Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RentalRequests;
