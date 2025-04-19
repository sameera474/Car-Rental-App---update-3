// File: client/src/pages/user/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Avatar,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import CropperDialog from "../../components/CropperDialog"; // Assume you have a cropper dialog

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [openCropper, setOpenCropper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/users/profile");
        setProfile(data);
        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // Clean up Blob URL when unmounting
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
      setOpenCropper(true);
    }
  };

  // Called when the crop is complete. You may want to convert the cropped area into a file.
  const handleCropComplete = (croppedImageURL) => {
    setAvatarPreview(croppedImageURL);
    // Optionally update avatarFile by converting the cropped image URL into a File/Blob.
    setOpenCropper(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // We use FormData because we need to send a file.
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      // Append avatar file if one was selected.
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const { data } = await axiosInstance.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(data.user);
      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error updating profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          User Profile
        </Typography>
        {/* Profile Picture Section */}
        <Paper sx={{ p: 2, mb: 3, textAlign: "center" }}>
          <Avatar
            src={avatarPreview}
            sx={{ width: 120, height: 120, margin: "auto", mb: 1 }}
          />
          <Button variant="outlined" component="label">
            Change Profile Picture
            <input
              type="file"
              name="avatar"
              hidden
              accept="image/*"
              onChange={handleAvatarSelect}
            />
          </Button>
        </Paper>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}
        <Paper sx={{ p: 2 }}>
          <form onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => window.location.reload()}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      {/* Cropper Dialog */}
      {openCropper && avatarPreview && (
        <CropperDialog
          imageSrc={avatarPreview}
          open={openCropper}
          onClose={() => setOpenCropper(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </Container>
  );
};

export default UserProfile;
