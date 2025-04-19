// File: client/src/pages/public/Contact.jsx
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider, // Added import for Divider
} from "@mui/material";
import MainLayout from "../../layouts/MainLayout";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic client-side validation.
    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }
    // For now, simply show a success message.
    setSuccess("Thank you for contacting us! We will get back to you soon.");
    setError("");
    // Reset the form.
    setFormData({ name: "", email: "", message: "" });
    // Future implementation: Add API call here to send form data to your backend.
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" gutterBottom>
            Have any questions? Please feel free to reach out to us using the
            form below.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Send Message
            </Button>
          </Box>

          {/* Company Information Section */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              About Our Company
            </Typography>
            <Typography variant="body1">
              Established in 2023, our Car Rental Company has served thousands
              of satisfied customers. We offer a wide range of vehicles—from
              economy to luxury—with excellent customer service and competitive
              rates.
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Our Team:</strong> CEO: John Doe, Managers: Jane Smith,
              Robert Brown.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default Contact;
