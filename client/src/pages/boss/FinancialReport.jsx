import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const FinancialReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Use "/boss/financial-report" (NOT "/api/boss/financial-report")
        const response = await axiosInstance.get("/boss/financial-report");
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report:", error);
        setError(
          error.response?.data?.message || "Error fetching financial report"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Financial Report
      </Typography>
      {report && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Revenue</TableCell>
                <TableCell align="right">${report.totalRevenue}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Rentals</TableCell>
                <TableCell align="right">{report.totalRentals}</TableCell>
              </TableRow>
              {report.details &&
                report.details.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {detail.car} Earnings (Rentals: {detail.rentalCount})
                    </TableCell>
                    <TableCell align="right">${detail.totalEarnings}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FinancialReport;
