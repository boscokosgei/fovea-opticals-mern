// frontend/src/context/AuthContext.js - ENHANCED
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });

  // Request interceptor for logging
  api.interceptors.request.use(
    config => {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, config.data || '');
      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    response => {
      console.log(`📥 ${response.status} ${response.config.url}`, response.data);
      return response;
    },
    error => {
      console.error('❌ API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  // Set auth header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  // Load user function
  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (userData) => {
    setError(null);
    setLoading(true);
    
    try {
      const registrationData = {
        name: userData.name?.trim(),
        email: userData.email?.trim().toLowerCase(),
        password: userData.password,
        phone: userData.phone?.trim() || '',
        confirmPassword: userData.confirmPassword || userData.password
      };

      const response = await api.post('/auth/register', registrationData);
      
      if (response.data.user && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return { 
          success: true, 
          user: response.data.user,
          message: response.data.message || 'Registration successful!'
        };
      }
      
      return { success: false, error: response.data.error || 'Registration failed' };
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (response.data.user && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return { 
          success: true, 
          user: response.data.user,
          message: 'Login successful!'
        };
      }
      
      return { success: false, error: response.data.error || 'Login failed' };
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid email or password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUser = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Update failed' };
    }
  };

  const value = {
    user,
    loading,
    error,
    initialized,
    token,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    api // Expose api for other components
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};