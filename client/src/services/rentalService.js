import axiosInstance from "./axiosInstance";

export const createRental = async (rentalData) => {
  try {
    const response = await axiosInstance.post("/rentals", rentalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const returnRental = async (rentalId) => {
  try {
    const response = await axiosInstance.post(`/rentals/${rentalId}/return`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
