import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Rating,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import SearchPod from "../../components/SearchPod";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import HeroCar from "../../assets/home-hero-car.png";

const DEFAULT_CAR_IMAGE = "https://via.placeholder.com/300x150?text=No+Image";

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [popularVehicles, setPopularVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState("");
  const theme = useTheme();

  const vehicleSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
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

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [fRes, pRes, cRes, rRes] = await Promise.all([
          axiosInstance.get("/cars/featured"),
          axiosInstance.get("/cars/popular"),
          axiosInstance.get("/cars/categories"),
          axiosInstance.get("/reviews/recent"),
        ]);

        const popularIDs = new Set(pRes.data.map((c) => c._id));
        const filteredFeatured = fRes.data.filter(
          (c) => !popularIDs.has(c._id)
        );

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

    fetchHomeData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        <SearchPod />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          my: 6,
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="h3" gutterBottom>
            Book a Car Near You and Drive in Minutes!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Book the coolest car effortlessly, plan for thrilling rides. Join
            the car rental revolution today.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <img
              src="/images/app-store-badge.svg"
              alt="App Store"
              width={140}
            />
            <img
              src="/images/google-play-badge.svg"
              alt="Google Play"
              width={140}
            />
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src={HeroCar}
            alt="Hero Car"
            style={{ maxWidth: "100%", height: "auto", borderRadius: 12 }}
          />
        </Box>
      </Box>

      {error && (
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Featured Vehicles */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Featured Vehicles
        </Typography>
        {featuredVehicles.length ? (
          <Slider {...vehicleSliderSettings}>
            {featuredVehicles.map((car, i) => (
              <Box key={car._id || i} sx={{ px: 1 }}>
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
      </Box>

      {/* Popular Vehicles */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Popular Vehicles
        </Typography>
        {popularVehicles.length ? (
          <Slider {...vehicleSliderSettings}>
            {popularVehicles.map((car, i) => (
              <Box key={car._id || i} sx={{ px: 1 }}>
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
      </Box>

      {/* Testimonials */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          What Our Customers Say
        </Typography>
        <Slider {...testimonialSliderSettings}>
          {testimonials.map((t, i) => (
            <Box key={t._id || i} sx={{ px: 2 }}>
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
      </Box>

      {/* Promotion */}
      <Box
        sx={{
          my: 6,
          p: 3,
          bgcolor: theme.palette.primary.main,
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
