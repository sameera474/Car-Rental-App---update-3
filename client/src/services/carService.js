import axiosInstance from "./axiosInstance";

export const fetchCars = async () => {
  try {
    const response = await axiosInstance.get("/cars");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchCarById = async (id) => {
  try {
    const response = await axiosInstance.get(`/cars/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
