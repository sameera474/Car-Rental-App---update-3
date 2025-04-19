import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

const RentalDialog = ({ car, open, onClose, onRent }) => {
  const [rentalDates, setRentalDates] = useState({
    start: new Date(),
    end: new Date(Date.now() + 86400000),
  });

  const handleRentClick = () => {
    onRent(car._id, rentalDates);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Confirm Rental for {car?.brand} {car?.model}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Start Date"
          type="date"
          value={rentalDates.start.toISOString().split("T")[0]}
          onChange={(e) =>
            setRentalDates({ ...rentalDates, start: new Date(e.target.value) })
          }
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={rentalDates.end.toISOString().split("T")[0]}
          onChange={(e) =>
            setRentalDates({ ...rentalDates, end: new Date(e.target.value) })
          }
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleRentClick}>
          Confirm Rental
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RentalDialog;
