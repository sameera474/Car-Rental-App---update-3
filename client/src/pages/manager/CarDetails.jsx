import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Alert,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { fetchCarById } from "../../services/carService";
import { createRental } from "../../services/rentalService";
import { useAuth } from "../../context/AuthContext";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRentalDialog, setShowRentalDialog] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    start: new Date(),
    end: new Date(Date.now() + 86400000),
  });
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  useEffect(() => {
    const getCar = async () => {
      try {
        const data = await fetchCarById(id);
        setCar(data);
      } catch (err) {
        setError("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    getCar();
  }, [id]);

  const handleRent = async () => {
    try {
      if (!user && !authLoading) {
        navigate("/login");
        return;
      }
      // Only allow role "user" to rent a car.
      if (user.role !== "user") {
        alert("Only users are allowed to rent a car.");
        return;
      }
      await createRental({
        carId: car._id,
        startDate: rentalDates.start.toISOString(),
        endDate: rentalDates.end.toISOString(),
      });
      navigate("/user/myrentals");
    } catch (err) {
      setError(err.message || "Rental creation failed.");
    } finally {
      setShowRentalDialog(false);
    }
  };

  const handlePrevImage = () => {
    if (car.gallery && car.gallery.length > 0) {
      setCurrentGalleryIndex((prev) =>
        prev === 0 ? car.gallery.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (car.gallery && car.gallery.length > 0) {
      setCurrentGalleryIndex((prev) =>
        prev === car.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading || authLoading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {car.brand} {car.model}
        </Typography>
        {/* Main image */}
        {car.image && (
          <Box
            sx={{
              mt: 2,
              mb: 4,
              display: "flex",
              justifyContent: "center",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={car.image}
              alt={`${car.brand} ${car.model} main`}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
        {/* Gallery Carousel */}
        {car.gallery && car.gallery.length > 0 && (
          <Box sx={{ position: "relative", textAlign: "center", mb: 2 }}>
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <ArrowBackIos />
            </IconButton>
            <Box
              component="img"
              src={car.gallery[currentGalleryIndex]}
              alt={`${car.brand} ${car.model} gallery`}
              sx={{
                width: "100%",
                height: 300,
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 4,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Specifications</Typography>
            <Typography>Year: {car.year}</Typography>
            <Typography>Seats: {car.seats}</Typography>
            <Typography>Doors: {car.doors}</Typography>
            <Typography>Transmission: {car.transmission}</Typography>
            <Typography>Category: {car.category}</Typography>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Pricing</Typography>
            <Typography>Daily Rate: ${car.pricePerDay}</Typography>
            <Typography>Location: {car.location}</Typography>
            <Typography>Status: {car.status}</Typography>
          </Paper>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowRentalDialog(true)}
          disabled={!user || loading || (user && user.role !== "user")}
        >
          {loading
            ? "Loading..."
            : user && user.role === "user"
            ? "Rent This Car"
            : "Viewing Only (Not for Rental)"}
        </Button>
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
          component={Link}
          to="/user/cars"
        >
          Back to Cars
        </Button>
      </Paper>

      <Dialog
        open={showRentalDialog}
        onClose={() => setShowRentalDialog(false)}
      >
        <DialogTitle>
          Confirm Rental for {car.brand} {car.model}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Start Date"
            type="date"
            value={rentalDates.start.toISOString().split("T")[0]}
            onChange={(e) =>
              setRentalDates({
                ...rentalDates,
                start: new Date(e.target.value),
              })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={rentalDates.end.toISOString().split("T")[0]}
            onChange={(e) =>
              setRentalDates({
                ...rentalDates,
                end: new Date(e.target.value),
              })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRentalDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRent}>
            Confirm Rental
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarDetails;
