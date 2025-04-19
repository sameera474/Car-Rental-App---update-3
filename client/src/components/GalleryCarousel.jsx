// File: client/src/components/GalleryCarousel.jsx
import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const GalleryCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: 300 }}>
      <Box
        component="img"
        src={images[index]}
        alt={`Gallery ${index + 1}`}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 2,
        }}
      />
      <IconButton
        onClick={prevImage}
        sx={{ position: "absolute", top: "50%", left: 0, color: "#fff" }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        onClick={nextImage}
        sx={{ position: "absolute", top: "50%", right: 0, color: "#fff" }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default GalleryCarousel;
