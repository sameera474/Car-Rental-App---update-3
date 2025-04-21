// File: client/src/pages/manager/ManageCars.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
} from "@mui/material";
import { Delete, Edit, CloudUpload } from "@mui/icons-material";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    transmission: "all",
    location: "all",
  });

  // Fetch all cars on mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axiosInstance.get("/cars");
        setCars(data);
      } catch (err) {
        setError("Failed to load cars");
      } finally {
        setGlobalLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleSubmit = async (carData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      // Main image is required when adding a new car.
      if (!currentCar?._id && !carData.image) {
        throw new Error("Main image is required for new cars");
      }
      Object.entries(carData).forEach(([key, value]) => {
        if (key === "image") {
          if (value instanceof File) {
            formData.append("image", value);
          } else if (typeof value === "string" && value) {
            formData.append("imageUrl", value);
          }
        } else if (key === "gallery") {
          if (value instanceof FileList) {
            Array.from(value).forEach((file) => {
              formData.append("gallery", file);
            });
          } else if (Array.isArray(value)) {
            value.forEach((url) => formData.append("gallery", url));
          }
        } else {
          formData.append(key, value);
        }
      });

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const response = currentCar?._id
        ? await axiosInstance.put(`/cars/${currentCar._id}`, formData, config)
        : await axiosInstance.post("/cars", formData, config);

      const updatedCar = response.data;
      setCars((prev) =>
        currentCar?._id
          ? prev.map((c) => (c._id === updatedCar._id ? updatedCar : c))
          : [updatedCar, ...prev]
      );
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to remove this car?")) return;
    try {
      await axiosInstance.delete(`/cars/${carId}`);
      setCars((prev) => prev.filter((c) => c._id !== carId));
    } catch (err) {
      setError("Failed to remove car");
    }
  };
  const handleToggleFeatured = async (carId, newValue) => {
    try {
      const { data: updatedCar } = await axiosInstance.patch(
        `/cars/${carId}/featured`,
        { featured: newValue }
      );
      setCars((prev) => prev.map((c) => (c._id === carId ? updatedCar : c)));
    } catch (err) {
      setError("Failed to update featured status");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCar(null);
  };

  const filteredCars = cars.filter((car) => {
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "active" && car.status === "active") ||
      (filters.status === "rented" &&
        !car.isAvailable &&
        car.status === "active") ||
      (filters.status === "returned" && car.status === "returned") ||
      (filters.status === "removed" && car.status === "removed");
    const transmissionMatch =
      filters.transmission === "all" ||
      car.transmission === filters.transmission;
    const locationMatch =
      filters.location === "all" || car.location === filters.location;
    return statusMatch && transmissionMatch && locationMatch;
  });

  if (globalLoading)
    return <CircularProgress sx={{ m: 4, display: "block" }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Manage Cars</Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          startIcon={<CloudUpload />}
        >
          Add New Car
        </Button>
      </Box>

      {/* Filter Section */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="rented">Rented</MenuItem>
            <MenuItem value="returned">Returned</MenuItem>
            <MenuItem value="removed">Removed</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Transmission</InputLabel>
          <Select
            value={filters.transmission}
            onChange={(e) =>
              setFilters({ ...filters, transmission: e.target.value })
            }
            label="Transmission"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Manual">Manual</MenuItem>
            <MenuItem value="Automatic">Automatic</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            label="Location"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Main Branch">Main Branch</MenuItem>
            <MenuItem value="Downtown">Downtown</MenuItem>
            <MenuItem value="Airport">Airport</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h5" gutterBottom>
        Existing Cars ({filteredCars.length})
      </Typography>

      <Grid container spacing={3}>
        {filteredCars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card>
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
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">
                    {car.brand} {car.model}
                  </Typography>
                  <Chip
                    label={
                      car.status === "removed"
                        ? "Removed"
                        : car.isAvailable
                        ? "Available"
                        : "Rented"
                    }
                    color={
                      car.status === "removed"
                        ? "default"
                        : car.isAvailable
                        ? "success"
                        : "error"
                    }
                  />
                </Box>
                <Chip
                  label={`Category: ${car.category || "Economy"}`}
                  sx={{ mt: 1 }}
                />
                <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label={`Year: ${car.year}`} />
                  <Chip label={`Mileage: ${car.mileage || "N/A"} km`} />
                  <Chip label={`Seats: ${car.seats}`} />
                  <Chip label={`Doors: ${car.doors}`} />
                  <Chip label={`$${car.pricePerDay}/day`} />
                </Box>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => {
                      setCurrentCar(car);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDelete(car._id)}
                  >
                    Remove
                  </Button>{" "}
                  {/* FEATURE toggle */}
                  <Box
                    sx={{ ml: "auto", display: "flex", alignItems: "center" }}
                  >
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Featured
                    </Typography>
                    <Switch
                      checked={Boolean(car.featured)}
                      onChange={(e) =>
                        handleToggleFeatured(car._id, e.target.checked)
                      }
                      color="primary"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CarDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        currentCar={currentCar}
        loading={loading}
      />
    </Box>
  );
};

const CarDialog = ({ open, onClose, onSubmit, currentCar, loading }) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    mileage: "",
    seats: 5,
    doors: 4,
    transmission: "Manual",
    location: "Main Branch",
    category: "Economy",
    image: null,
    gallery: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (currentCar) {
      setFormData({
        brand: currentCar.brand,
        model: currentCar.model,
        year: currentCar.year,
        pricePerDay: currentCar.pricePerDay,
        mileage: currentCar.mileage || "",
        seats: currentCar.seats,
        doors: currentCar.doors,
        transmission: currentCar.transmission,
        location: currentCar.location,
        category: currentCar.category || "Economy",
        image: currentCar.image,
        gallery: currentCar.gallery || [],
      });
      setPreview(currentCar.image);
    } else {
      setFormData({
        brand: "",
        model: "",
        year: "",
        pricePerDay: "",
        mileage: "",
        seats: 5,
        doors: 4,
        transmission: "Manual",
        location: "Main Branch",
        category: "Economy",
        image: null,
        gallery: null,
      });
      setPreview(null);
    }
  }, [currentCar]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setFormData((prev) => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleGalleryChange = (e) => {
    setFormData((prev) => ({ ...prev, gallery: e.target.files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCar && !formData.image) {
      alert("Please upload a main image for the car");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{currentCar ? "Edit Car" : "Add New Car"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Brand"
              fullWidth
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Model"
              fullWidth
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Year"
              type="number"
              fullWidth
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Price/Day"
              type="number"
              fullWidth
              value={formData.pricePerDay}
              onChange={(e) =>
                setFormData({ ...formData, pricePerDay: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Mileage (km)"
              type="number"
              fullWidth
              value={formData.mileage}
              onChange={(e) =>
                setFormData({ ...formData, mileage: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Seats"
              type="number"
              fullWidth
              value={formData.seats}
              onChange={(e) =>
                setFormData({ ...formData, seats: e.target.value })
              }
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Doors"
              type="number"
              fullWidth
              value={formData.doors}
              onChange={(e) =>
                setFormData({ ...formData, doors: e.target.value })
              }
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Transmission</InputLabel>
              <Select
                value={formData.transmission}
                onChange={(e) =>
                  setFormData({ ...formData, transmission: e.target.value })
                }
                label="Transmission"
              >
                <MenuItem value="Manual">Manual</MenuItem>
                <MenuItem value="Automatic">Automatic</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                label="Location"
              >
                <MenuItem value="Main Branch">Main Branch</MenuItem>
                <MenuItem value="Downtown">Downtown</MenuItem>
                <MenuItem value="Airport">Airport</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                label="Category"
              >
                <MenuItem value="Economy">Economy</MenuItem>
                <MenuItem value="SUV">SUV</MenuItem>
                <MenuItem value="Luxury">Luxury</MenuItem>
                <MenuItem value="Convertible">Convertible</MenuItem>
                <MenuItem value="Van">Van</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Main Image Upload */}
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="car-image-upload"
              required={!currentCar}
            />
            <label htmlFor="car-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mr: 2 }}
              >
                Upload Main Image
              </Button>
            </label>
            {preview && (
              <Box
                sx={{ mt: 2, height: 200, borderRadius: 2, overflow: "hidden" }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            )}
          </Grid>
          {/* Gallery Upload for multiple images */}
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              multiple
              onChange={handleGalleryChange}
              style={{ display: "none" }}
              id="car-gallery-upload"
            />
            <label htmlFor="car-gallery-upload">
              <Button variant="outlined" component="span" sx={{ mr: 2 }}>
                Upload Gallery Images
              </Button>
            </label>
            {/* Optional: You can add a preview for each gallery image if desired */}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageCars;
