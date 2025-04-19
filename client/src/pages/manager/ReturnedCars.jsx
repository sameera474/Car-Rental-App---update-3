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
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const ReturnedCars = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const { data } = await axiosInstance.get("/rentals/returned");
        setReturns(data);
      } catch (err) {
        setError("Failed to load returned cars");
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  const handleProcessReturn = async (rentalId) => {
    try {
      await axiosInstance.put(`/rentals/${rentalId}/status`, {
        status: "processed",
      });
      setReturns((prev) => prev.filter((r) => r._id !== rentalId));
    } catch (err) {
      setError("Failed to process return");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Returned Cars
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {returns.map((ret) => (
            <React.Fragment key={ret._id}>
              <ListItem>
                <ListItemText
                  primary={`${ret.car?.brand} ${ret.car?.model}`}
                  secondary={`Returned on: ${new Date(
                    ret.endDate
                  ).toLocaleDateString()}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleProcessReturn(ret._id)}
                >
                  Process Return
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ReturnedCars;
