// File: client/src/utils/token.js
export const setToken = (token) => {
  try {
    localStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Error saving token:", error);
    throw new Error("Failed to save authentication token");
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem("authToken");
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error removing token:", error);
    throw new Error("Failed to remove authentication token");
  }
};
