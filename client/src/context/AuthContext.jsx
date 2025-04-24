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

      // Token expiration check
      if (Date.now() >= decoded.exp * 1000) {
        throw new Error("Token expired");
      }

      // Silent fetch full user profile
      const { data } = await axiosInstance.get(`/users/${decoded.id}`);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar || null,
      });
    } catch (error) {
      console.error("Auth error:", error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  // login with token and redirect callback
  const login = async (userData, token, redirectCallback) => {
    setToken(token);
    const decoded = jwtDecode(token);

    try {
      const { data } = await axiosInstance.get(`/users/${decoded.id}`);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar || null,
      });

      if (redirectCallback) redirectCallback();
    } catch (error) {
      console.error("Login fetch error:", error);
      setUser(null);
    }
  };

  // logout and optional redirect
  const logout = (redirectCallback) => {
    removeToken();
    setUser(null);
    if (redirectCallback) redirectCallback();
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
