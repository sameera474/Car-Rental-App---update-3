// File: client/src/components/SearchPod.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchPod = () => {
  const [location, setLocation] = useState(""); // "" = All
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("loc", location);
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    navigate(`/cars${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
      }}
      elevation={2}
    >
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id="location-select-label">Location</InputLabel>
        <Select
          labelId="location-select-label"
          value={location}
          label="Location"
          onChange={(e) => setLocation(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Main Branch">Main Branch</MenuItem>
          <MenuItem value="Downtown">Downtown</MenuItem>
          <MenuItem value="Airport">Airport</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Start date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <TextField
        label="End date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <Box sx={{ flexGrow: 1 }} />

      <Button variant="contained" size="large" onClick={handleSearch}>
        Search
      </Button>
    </Paper>
  );
};

export default SearchPod;
