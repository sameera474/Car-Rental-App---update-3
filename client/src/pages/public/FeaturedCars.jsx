// File: client/src/pages/public/FeaturedCars.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const FeaturedCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const { data } = await axiosInstance.get("/cars/featured");
        setCars(data);
      } catch (err) {
        console.error("Error fetching featured cars:", err);
        setError("Failed to load featured cars");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedCars();
  }, []);

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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Featured Cars
      </Typography>
      <Grid container spacing={2}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card>
              <CardContent>
                <img
                  src={
                    car.image ||
                    "https://via.placeholder.com/300x150?text=No+Image"
                  }
                  alt={`${car.brand} ${car.model}`}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="body2">
                  ${car.pricePerDay} per day
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedCars;
