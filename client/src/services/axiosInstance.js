// client/src/services/axiosInstance.js
import axios from "axios";
import { getToken, removeToken } from "../utils/token";

// Local dev URL
const localApiUrl = "http://localhost:5000/api";

// Vite only exposes vars prefixed with VITE_
const prodApiUrl = import.meta.env.VITE_API_URL;

// If you're running `vite dev` then import.meta.env.DEV is true
const API_URL = import.meta.env.DEV ? localApiUrl : prodApiUrl;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: getToken() ? `Bearer ${getToken()}` : "",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

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
