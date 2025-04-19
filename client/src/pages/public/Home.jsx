// File: client/src/pages/public/Home.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  Rating,
} from "@mui/material";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import axiosInstance from "../../services/axiosInstance";

// Import react-slick and required CSS
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

  // Slider settings for vehicles (used for both Featured and Popular Vehicles)
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

  // Slider settings for testimonials
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

  // Fetch data for featured vehicles, popular vehicles, categories, and recent reviews.
  const fetchHomeData = async () => {
    try {
      const [featuredRes, popularRes, categoriesRes, recentReviewsRes] =
        await Promise.all([
          axiosInstance.get("/cars/featured"),
          axiosInstance.get("/cars/popular"),
          axiosInstance.get("/cars/categories"),
          axiosInstance.get("/reviews/recent"),
        ]);

      // Remove vehicles from featured that also appear in popular (if desired).
      const popularIDs = new Set(popularRes.data.map((car) => car._id));
      const filteredFeatured = featuredRes.data.filter(
        (car) => !popularIDs.has(car._id)
      );

      setFeaturedVehicles(
        filteredFeatured.length > 0 ? filteredFeatured : featuredRes.data
      );
      setPopularVehicles(popularRes.data);
      setCategories(categoriesRes.data);
      setTestimonials(recentReviewsRes.data);
    } catch (err) {
      console.error("Error fetching home page data:", err);
      setError("Failed to load home page data: " + err.message);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h2" gutterBottom>
            Rent a Car Anytime, Anywhere!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Explore our collection of premium and budget-friendly cars.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
              component={Link}
              to="/register"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link}
              to="/cars"
            >
              Browse Cars
            </Button>
          </Box>
        </Box>

        {error && (
          <Box textAlign="center" sx={{ mb: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Featured Vehicles Section */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Featured Vehicles
          </Typography>
          {featuredVehicles.length > 0 ? (
            <Slider {...vehicleSliderSettings}>
              {featuredVehicles.map((car, index) => (
                <Box key={car._id || index} sx={{ padding: 1 }}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <img
                      src={car.image || DEFAULT_CAR_IMAGE}
                      alt={`${car.brand} ${car.model}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {car.brand} {car.model}
                    </Typography>
                    <Typography variant="body2">
                      ${car.pricePerDay} per day
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Slider>
          ) : (
            <Typography>No featured vehicles available</Typography>
          )}
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button variant="text" component={Link} to="/cars/featured">
              See All Featured Vehicles
            </Button>
          </Box>
        </Box>

        {/* Popular Vehicles Section */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Popular Vehicles
          </Typography>
          {popularVehicles.length > 0 ? (
            <Slider {...vehicleSliderSettings}>
              {popularVehicles.map((car, index) => (
                <Box key={car._id || index} sx={{ padding: 1 }}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <img
                      src={car.image || DEFAULT_CAR_IMAGE}
                      alt={`${car.brand} ${car.model}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {car.brand} {car.model}
                    </Typography>
                    <Typography variant="body2">
                      ${car.pricePerDay} per day
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Slider>
          ) : (
            <Typography>No popular vehicles available</Typography>
          )}
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button variant="text" component={Link} to="/cars/popular">
              See All Popular Vehicles
            </Button>
          </Box>
        </Box>

        {/* Categories Section */}
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
            {categories.map((cat, index) => (
              <Button
                key={index}
                variant="outlined"
                color="primary"
                sx={{ textTransform: "none" }}
                component={Link}
                to={`/cars/category/${cat.toLowerCase()}`}
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            What Our Customers Say
          </Typography>
          <Slider {...testimonialSliderSettings}>
            {testimonials.map((testimonial, index) => (
              <Box key={testimonial.id || index} sx={{ padding: 2 }}>
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
                    src={
                      testimonial.user?.avatar ||
                      "https://via.placeholder.com/60?text=Avatar"
                    }
                    sx={{ width: 60, height: 60, mb: 2 }}
                  />
                  <Rating
                    value={testimonial.rating}
                    precision={0.5}
                    readOnly
                    sx={{ mb: 1 }}
                  />
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ minHeight: 60 }}
                  >
                    {testimonial.comment}
                  </Typography>
                  <Typography variant="subtitle2">
                    — {testimonial.user?.name || testimonial.name}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Slider>
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button variant="text" component={Link} to="/reviews">
              See All Reviews
            </Button>
          </Box>
        </Box>

        {/* Promotion Section */}
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
          <Typography variant="body1" gutterBottom>
            Get 20% off your first rental! Use promo code{" "}
            <strong>RENT20</strong>
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/register"
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Home;
