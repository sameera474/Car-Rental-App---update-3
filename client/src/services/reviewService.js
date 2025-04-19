import axiosInstance from "./axiosInstance";

export const createReview = async (reviewData) => {
  const response = await axiosInstance.post("/reviews", reviewData);
  return response.data;
};

export const fetchReviewsByCar = async (carId) => {
  const response = await axiosInstance.get(`/reviews/car/${carId}`);
  return response.data;
};
