// File: client/src/pages/public/Home.jsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Rating,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import SearchPod from "../../components/SearchPod";

// react‑slick
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DEFAULT_CAR_IMAGE = "https://via.placeholder.com/300x150?text=No+Image";

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [popularVehicles, setPopularVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState("");

  const vehicleSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonialSliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [{ breakpoint: 960, settings: { slidesToShow: 1 } }],
  };

  const fetchHomeData = async () => {
    try {
      const [fRes, pRes, cRes, rRes] = await Promise.all([
        axiosInstance.get("/cars/featured"),
        axiosInstance.get("/cars/popular"),
        axiosInstance.get("/cars/categories"),
        axiosInstance.get("/reviews/recent"),
      ]);

      // Avoid duplicates between featured & popular
      const popularIDs = new Set(pRes.data.map((c) => c._id));
      const filteredFeatured = fRes.data.filter((c) => !popularIDs.has(c._id));

      setFeaturedVehicles(
        filteredFeatured.length ? filteredFeatured : fRes.data
      );
      setPopularVehicles(pRes.data);
      setCategories(cRes.data);
      setTestimonials(rRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load home page data");
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <Container maxWidth="lg">
      {/* 0) Search Pod */}
      <Box sx={{ my: 4 }}>
        <SearchPod />
      </Box>

      {/* 1) Hero Section */}
      <Box textAlign="center" sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h2" gutterBottom>
          Rent a Car Anytime, Anywhere!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Explore our collection of premium and budget-friendly cars.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button component={Link} to="/cars" variant="outlined" size="large">
            Browse Cars
          </Button>
        </Box>
      </Box>

      {error && (
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* 2) Featured Vehicles */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Featured Vehicles
        </Typography>
        {featuredVehicles.length ? (
          <Slider {...vehicleSliderSettings}>
            {featuredVehicles.map((car, i) => (
              <Box key={car._id || i} sx={{ p: 1 }}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <img
                    src={car.image || DEFAULT_CAR_IMAGE}
                    alt={`${car.brand} ${car.model}`}
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {car.brand} {car.model}
                  </Typography>
                  <Typography>${car.pricePerDay} per day</Typography>
                </Paper>
              </Box>
            ))}
          </Slider>
        ) : (
          <Typography>No featured vehicles available</Typography>
        )}
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button component={Link} to="/cars/featured" variant="text">
            See All Featured Vehicles
          </Button>
        </Box>
      </Box>

      {/* 3) Popular Vehicles */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Popular Vehicles
        </Typography>
        {popularVehicles.length ? (
          <Slider {...vehicleSliderSettings}>
            {popularVehicles.map((car, i) => (
              <Box key={car._id || i} sx={{ p: 1 }}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <img
                    src={car.image || DEFAULT_CAR_IMAGE}
                    alt={`${car.brand} ${car.model}`}
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {car.brand} {car.model}
                  </Typography>
                  <Typography>${car.pricePerDay} per day</Typography>
                </Paper>
              </Box>
            ))}
          </Slider>
        ) : (
          <Typography>No popular vehicles available</Typography>
        )}
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button component={Link} to="/cars/popular" variant="text">
            See All Popular Vehicles
          </Button>
        </Box>
      </Box>

      {/* 4) Vehicle Categories */}
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Vehicle Categories
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat, i) => (
            <Button
              key={i}
              component={Link}
              to={`/cars/category/${cat.toLowerCase()}`}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              {cat}
            </Button>
          ))}
        </Box>
      </Box>

      {/* 5) Testimonials */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          What Our Customers Say
        </Typography>
        <Slider {...testimonialSliderSettings}>
          {testimonials.map((t, i) => (
            <Box key={t._id || i} sx={{ p: 2 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  height: 250,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  src={t.user?.avatar || `https://i.pravatar.cc/60?u=${i}`}
                  sx={{ width: 60, height: 60, mb: 2 }}
                />
                <Rating
                  value={t.rating}
                  precision={0.5}
                  readOnly
                  sx={{ mb: 1 }}
                />
                <Typography variant="body1" gutterBottom sx={{ minHeight: 60 }}>
                  {t.comment}
                </Typography>
                <Typography variant="subtitle2">
                  — {t.user?.name || "Anonymous"}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Slider>
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button component={Link} to="/reviews" variant="text">
            See All Reviews
          </Button>
        </Box>
      </Box>

      {/* 6) Promotion */}
      <Box
        sx={{
          my: 4,
          p: 3,
          bgcolor: "primary.main",
          borderRadius: 2,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Special Promotion
        </Typography>
        <Typography gutterBottom>
          Get 20% off your first rental! Use promo code <strong>RENT20</strong>
        </Typography>
        <Button component={Link} to="/register" variant="contained">
          Sign Up Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
