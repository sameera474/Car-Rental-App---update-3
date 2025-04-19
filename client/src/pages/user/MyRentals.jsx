import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "../../components/ReviewForm";

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedCarForReview, setSelectedCarForReview] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/rentals/user/${user.id}`);
        setRentals(data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load rentals");
        console.error("Error fetching rentals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRentals();
    }
  }, [user]);

  const handleReturn = async (rentalId) => {
    try {
      const { data } = await axiosInstance.put(`/rentals/${rentalId}/return`);

      if (!data?.carId) {
        throw new Error("Invalid response from server");
      }

      setRentals((prev) => prev.filter((r) => r._id !== rentalId));
      setSelectedCarForReview(data.carId);
      setShowReviewForm(true);
    } catch (error) {
      setError(error.response?.data?.message || "Return failed");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Rentals
      </Typography>

      {rentals.length === 0 ? (
        <Card sx={{ p: 2 }}>
          <Typography>No active or past rentals found</Typography>
        </Card>
      ) : (
        rentals.map((rental) => (
          <Card key={rental._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {rental.car?.brand || "Unknown Brand"}{" "}
                {rental.car?.model || "Unknown Model"}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={rental.status.toUpperCase()}
                  color={
                    rental.status === "active"
                      ? "success"
                      : rental.status === "completed"
                      ? "secondary"
                      : "warning"
                  }
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Total Cost: ${rental.totalCost?.toFixed(2) || "0.00"}
                </Typography>
              </Box>

              <Typography variant="body2">
                Rental Period: {new Date(rental.startDate).toLocaleDateString()}{" "}
                - {new Date(rental.endDate).toLocaleDateString()}
              </Typography>

              {rental.status === "active" && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={() => handleReturn(rental._id)}
                >
                  Return Car
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {showReviewForm && selectedCarForReview && (
        <ReviewForm
          carId={selectedCarForReview}
          onSuccess={() => {
            setShowReviewForm(false);
            setSelectedCarForReview(null);
          }}
          onCancel={() => {
            setShowReviewForm(false);
            setSelectedCarForReview(null);
          }}
        />
      )}
    </Box>
  );
};

export default MyRentals;
