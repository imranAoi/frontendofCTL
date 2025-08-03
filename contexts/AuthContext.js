'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateToken, clearToken } from '../components/api/axiosInstance';
import { validateSession, refreshToken } from '../components/api/Authapi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to set cookie
const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to validate and restore session
  const validateAndRestoreSession = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Try to validate the session with the server
        const sessionData = await validateSession();
        
        // If session is valid, restore user data
        setUser(JSON.parse(userData));
        setCookie('token', token);
        
        // If server returned updated user data, use it
        if (sessionData.user) {
          setUser(sessionData.user);
          localStorage.setItem('user', JSON.stringify(sessionData.user));
        }
        
        // If server returned a new token, update it
        if (sessionData.token) {
          updateToken(sessionData.token);
        }
        
      } catch (error) {
        console.error('Session validation failed:', error);
        
        // If the error message indicates the endpoint doesn't exist, 
        // we can still restore the session from localStorage
        if (error.message?.includes('not available') || error.message?.includes('assumed valid')) {
          console.log('Using fallback session restoration');
          setUser(JSON.parse(userData));
          setCookie('token', token);
        } else if (error.message?.includes('expired') || error.status === 401) {
          // If token is expired, try to refresh it
          try {
            const refreshData = await refreshToken();
            setUser(refreshData.user);
            updateToken(refreshData.token);
            localStorage.setItem('user', JSON.stringify(refreshData.user));
            setCookie('token', refreshData.token);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            clearToken();
          }
        } else {
          // Clear invalid session data
          clearToken();
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    validateAndRestoreSession();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Use the helper function to update token (handles both localStorage and cookie)
    updateToken(token);
  };

  const logout = () => {
    setUser(null);
    // Use the helper function to clear all authentication data
    clearToken();
    router.push('/login');
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    validateAndRestoreSession, // Expose this for manual session validation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 