import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axiosInstance from "../services/axiosInstance";

const CarDetails = () => {
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const carId = window.location.pathname.split("/").pop();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carRes, reviewsRes] = await Promise.all([
          axiosInstance.get(`/cars/${carId}`),
          axiosInstance.get(`/reviews/car/${carId}`),
        ]);

        if (!carRes.data || !reviewsRes.data) {
          throw new Error("Car not found");
        }

        setCar(carRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [carId]);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {car && (
        <>
          <Typography variant="h3" gutterBottom>
            {car.brand} {car.model}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Rating value={car.ratingsAverage} precision={0.5} readOnly />
            <Typography>({car.ratingsQuantity} reviews)</Typography>
          </Box>

          <Typography variant="h5" sx={{ mt: 4 }}>
            Details
          </Typography>
          <Typography>Year: {car.year}</Typography>
          <Typography>Price per day: ${car.pricePerDay}</Typography>

          <Typography variant="h5" sx={{ mt: 4 }}>
            Reviews
          </Typography>
          <List>
            {reviews.map((review) => (
              <ListItem key={review._id} divider>
                <ListItemText
                  primary={
                    <>
                      <Typography fontWeight="bold">
                        {review.user?.name}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </>
                  }
                  secondary={review.comment}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default CarDetails;
