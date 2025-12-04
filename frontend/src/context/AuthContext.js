// frontend/src/context/AuthContext.js - UPDATED
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

  // Create axios instance
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Set auth header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // Load user if token exists but user is null
      if (!user) {
        loadUser();
      }
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user function
  const loadUser = async () => {
    if (token) {
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to load user:', error);
        logout();
      }
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    console.log('📤 Register function called with:', userData);
    
    try {
      // Make sure we include confirmPassword
      const registrationData = {
        ...userData,
        confirmPassword: userData.confirmPassword || userData.password
      };
      
      console.log('📤 Sending to API:', registrationData);
      
      const response = await api.post('/api/auth/register', registrationData);
      console.log('📥 Registration response:', response.data);
      
      if (response.data.success) {
        // Set token and user
        setToken(response.data.token);
        setUser(response.data.user);
        
        return {
          success: true,
          user: response.data.user,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('❌ Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data. Please check your information.';
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

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      
      const response = await api.post('/api/auth/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
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

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  // Context value - MAKE SURE ALL FUNCTIONS ARE INCLUDED
  const value = {
    user,
    loading,
    token,
    register,  // Make sure this is included
    login,     // Make sure this is included
    logout,    // Make sure this is included
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};