import axiosInstance from "./axiosInstance";

export const fetchUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return {
      _id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user data"
    );
  }
};
