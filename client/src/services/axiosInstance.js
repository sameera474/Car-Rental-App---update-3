// client/src/services/axiosInstance.js
import axios from "axios";
import { getToken, removeToken } from "../utils/token";

// Define local and production API URLs.
const localApiUrl = "http://localhost:5000/api";
const prodApiUrl = import.meta.env.VITE_API_URL; // Should be set to your production API (e.g., "https://sam-car-rent-service-backend.vercel.app/api")

// Determine which API URL to use based on the hostname.
const API_URL =
  window.location.hostname === "localhost" ? localApiUrl : prodApiUrl;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : "",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
