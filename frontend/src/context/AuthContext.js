// frontend/src/context/AuthContext.js - CORRECTED
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Your base URL already includes /api
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  // When deployed, process.env.REACT_APP_API_URL will now be:
// "https://fovea-opticals-mern.onrender.com/api"
  console.log('🔗 API Base URL:', API_BASE_URL);

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Set auth header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Register function - CORRECTED
  const register = async (userData) => {
    setLoading(true);
    console.log('📤 [AUTH] Register function called with:', userData);
    
    try {
      const registrationData = {
        name: userData.name?.trim() || '',
        email: userData.email?.trim().toLowerCase() || '',
        password: userData.password || '',
        phone: userData.phone?.trim() || '',
        confirmPassword: userData.confirmPassword || userData.password || ''
      };

      console.log('📤 [AUTH] Sending to API:', registrationData);
      console.log('📤 [AUTH] Full URL will be:', API_BASE_URL + '/auth/register');
      
      // CORRECT: No /api prefix needed since base URL already has it
      const response = await api.post('/auth/register', registrationData);
      console.log('📥 [AUTH] Registration response:', response.data);
      
      if (response.data.user && response.data.token) {
        // Save to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setToken(response.data.token);
        setUser(response.data.user);
        
        return {
          success: true,
          user: response.data.user,
          message: response.data.message || 'Registration successful!'
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Registration failed'
        };
      }
      
    } catch (error) {
      console.error('❌ [AUTH] Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        fullUrl: error.config?.baseURL + error.config?.url
      });
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 404) {
        errorMessage = `API endpoint not found. Tried: ${error.config?.baseURL}${error.config?.url}`;
      } else if (!error.response) {
        errorMessage = 'Cannot connect to server. Check if backend is running.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Login function - CORRECTED
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // CORRECT: No /api prefix
      const response = await api.post('/auth/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success || response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setToken(response.data.token);
        setUser(response.data.user);
        
        return {
          success: true,
          user: response.data.user
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Get current user - CORRECTED
  const getCurrentUser = async () => {
    if (token) {
      try {
        // CORRECT: No /api prefix
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to load user:', error);
        logout();
      }
    }
  };

  // Load user on mount
  useEffect(() => {
    getCurrentUser();
  }, [token]);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    token,
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};