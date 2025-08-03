import axiosInstance from "./axiosInstance";

export const loginUser = async (email, password) => {
  try {
    const res = await axiosInstance.post("/login", { email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Server error" }; // safe error throw
  }
};

export const signupUser = async (name, email, password) => {
  try {
    const res = await axiosInstance.post("/signup", { name, email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Server error" };
  }
};

// Function to validate current session
export const validateSession = async () => {
  try {
    const res = await axiosInstance.get("/validate-session");
    return res.data;
  } catch (err) {
    // If endpoint doesn't exist (404) or server error, assume session is valid if we have a token
    if (err.response?.status === 404 || err.response?.status >= 500) {
      const token = localStorage.getItem("token");
      if (token) {
        return { valid: true, message: "Session assumed valid (validation endpoint not available)" };
      }
    }
    
    // For 401/403 errors, session is definitely invalid
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw { message: "Session expired or invalid" };
    }
    
    // For other errors, provide a more descriptive message
    throw { 
      message: err.response?.data?.message || err.message || "Session validation failed" 
    };
  }
};

// Function to refresh token if needed
export const refreshToken = async () => {
  try {
    const res = await axiosInstance.post("/refresh-token");
    return res.data;
  } catch (err) {
    // If refresh endpoint doesn't exist, we can't refresh
    if (err.response?.status === 404) {
      throw { message: "Token refresh not available" };
    }
    throw err.response?.data || { message: "Token refresh failed" };
  }
};
