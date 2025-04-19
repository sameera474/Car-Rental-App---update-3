// File: client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

import { getToken, removeToken, setToken } from "../utils/token";
import axiosInstance from "../services/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Set immediate user state from token
      const initialUser = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
      setUser(initialUser);

      // Verify token expiration
      if (Date.now() >= decoded.exp * 1000) {
        throw new Error("Token expired");
      }

      // Silent refresh of user data
      const response = await axiosInstance.get(`/users/${decoded.id}`);
      setUser({
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      });
    } catch (error) {
      console.error("Auth error:", error);
      if (error.response?.status === 401 || error.message === "Token expired") {
        removeToken();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setToken(token);
    const decoded = jwtDecode(token);
    setUser({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    });
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
