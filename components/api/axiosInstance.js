import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://colleborativetasklist.onrender.com/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and other auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear stored authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Remove cookie
      document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
    
    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to update token (useful when token is refreshed)
export const updateToken = (newToken) => {
  localStorage.setItem("token", newToken);
  // Also update cookie for middleware
  const expires = new Date();
  expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
  document.cookie = `token=${newToken};expires=${expires.toUTCString()};path=/`;
};

// Helper function to clear token
export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
};

export default axiosInstance;
