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
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import RentalDialog from "./RentalDialog";
const CarList = () => {
  const { category } = useParams();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const url = category ? `/cars/category/${category}` : "/cars/available";
        const { data } = await axiosInstance.get(url);
        setCars(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [category]);

  if (loading) return <CircularProgress sx={{ m: 4, display: "block" }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textTransform: category ? "capitalize" : "none" }}
      >
        {category ? `${category} Cars` : "Available Cars"}
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
                      if (!user) {
                        navigate("/login");
                      } else if (user.role === "user") {
                        setSelectedCar(car);
                      } else {
                        alert("Only users can rent cars.");
                      }
                    }}
                    disabled={!car.isAvailable}
                  >
                    {user && user.role === "user"
                      ? "Rent Now"
                      : user
                      ? "Viewing Only"
                      : "Login to Rent"}
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
        onRent={async (carId, dates) => {
          try {
            await axiosInstance.post("/rentals", {
              carId,
              startDate: dates.start.toISOString(),
              endDate: dates.end.toISOString(),
            });
            // refresh list
            const url = category
              ? `/cars/category/${category}`
              : "/cars/available";
            const { data } = await axiosInstance.get(url);
            setCars(data);
            alert("Car rented successfully!");
          } catch (err) {
            alert(err.response?.data?.message || "Rental failed");
          } finally {
            setSelectedCar(null);
          }
        }}
      />
    </Box>
  );
};

export default CarList;
