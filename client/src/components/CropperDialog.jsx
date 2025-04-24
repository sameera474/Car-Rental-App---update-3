import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

const CropperDialog = ({ imageSrc, open, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteInternal = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      const croppedImageURL = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageURL);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crop Your Picture</DialogTitle>
      <DialogContent dividers sx={{ position: "relative", height: 400 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteInternal}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveCrop}>
          Save Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropperDialog;
