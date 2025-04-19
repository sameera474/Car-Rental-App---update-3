// File: client/src/pages/user/CarList.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import RentalDialog from "./RentalDialog"; // Your reusable rental dialog

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axiosInstance.get("/cars/available");
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  const handleRent = async (carId, dates) => {
    // Only role "user" is allowed to rent
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "user") {
      alert("Only users are allowed to rent a car.");
      return;
    }
    try {
      await axiosInstance.post("/rentals", {
        carId,
        startDate: dates.start.toISOString(),
        endDate: dates.end.toISOString(),
      });
      // Refresh available cars after rental
      const { data } = await axiosInstance.get("/cars/available");
      setCars(data);
      alert("Car rented successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Rental failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Available Cars
      </Typography>
      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                {car.image && (
                  <Box
                    sx={{
                      height: 200,
                      mb: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">
                    {car.brand} {car.model}
                  </Typography>
                  <Chip
                    label={car.isAvailable ? "Available" : "Rented"}
                    color={car.isAvailable ? "success" : "error"}
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  ${car.pricePerDay}/day
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      // Only allow "Rent Now" if role === "user"
                      if (user && user.role === "user") {
                        setSelectedCar(car);
                      } else if (!user) {
                        navigate("/login");
                      } else {
                        alert("Viewing Only. Only users can rent cars.");
                      }
                    }}
                    disabled={!user || (user && user.role !== "user")}
                  >
                    {user && user.role === "user" ? "Rent Now" : "Viewing Only"}
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/cars/${car._id}`}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <RentalDialog
        car={selectedCar}
        open={Boolean(selectedCar)}
        onClose={() => setSelectedCar(null)}
        onRent={handleRent}
      />
    </Box>
  );
};

export default CarList;
