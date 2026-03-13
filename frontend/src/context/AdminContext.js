// frontend/src/context/AdminContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import axios from 'axios';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { api, token } = useAuth();
  const { success, error: showError } = useNotification();
  const [opticians, setOpticians] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOpticians: 0,
    totalServices: 0,
    totalAppointments: 0,
    totalPatients: 0
  });

  // Fetch all opticians
  const fetchOpticians = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/opticians');
      setOpticians(response.data);
      return response.data;
    } catch (err) {
      showError('Failed to fetch opticians');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api, showError]);

  // Fetch all services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data);
      return response.data;
    } catch (err) {
      showError('Failed to fetch services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api, showError]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      const [opticiansRes, servicesRes, appointmentsRes, usersRes] = await Promise.all([
        api.get('/opticians'),
        api.get('/services'),
        api.get('/appointments/stats'),
        api.get('/users/stats')
      ]);

      setStats({
        totalOpticians: opticiansRes.data.length,
        totalServices: servicesRes.data.length,
        totalAppointments: appointmentsRes.data.total || 0,
        totalPatients: usersRes.data.total || 0
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [api]);

  // Create optician
//   const createOptician = async (data) => {
//     try {
//       setLoading(true);
//       const response = await api.post('/opticians', data);
//       setOpticians(prev => [...prev, response.data]);
//       success('Optician added successfully!');
//       return { success: true, data: response.data };
//     } catch (err) {
//       showError(err.response?.data?.error || 'Failed to add optician');
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update optician
//   const updateOptician = async (id, data) => {
//     try {
//       setLoading(true);
//       const response = await api.put(`/opticians/${id}`, data);
//       setOpticians(prev => prev.map(o => o._id === id ? response.data : o));
//       success('Optician updated successfully!');
//       return { success: true, data: response.data };
//     } catch (err) {
//       showError(err.response?.data?.error || 'Failed to update optician');
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };
  //Create Optician
  // In AdminContext.js, update createOptician and updateOptician functions:

    const createOptician = async (formData) => {
    try {
        setLoading(true);
        
        // Important: Don't set Content-Type header - let browser set it with boundary
        const response = await api.post('/opticians', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
        
        setOpticians(prev => [...prev, response.data]);
        success('Optician added successfully!');
        return { success: true, data: response.data };
    } catch (err) {
        console.error('Error creating optician:', err);
        showError(err.response?.data?.error || 'Failed to add optician');
        return { success: false, error: err.message };
    } finally {
        setLoading(false);
    }
    };

    const updateOptician = async (id, formData) => {
    try {
        setLoading(true);
        const response = await api.put(`/opticians/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
        
        setOpticians(prev => prev.map(o => o._id === id ? response.data : o));
        success('Optician updated successfully!');
        return { success: true, data: response.data };
    } catch (err) {
        console.error('Error updating optician:', err);
        showError(err.response?.data?.error || 'Failed to update optician');
        return { success: false, error: err.message };
    } finally {
        setLoading(false);
    }
    };

  // Delete optician
  const deleteOptician = async (id) => {
    if (!window.confirm('Are you sure you want to delete this optician?')) {
      return { success: false };
    }

    try {
      setLoading(true);
      await api.delete(`/opticians/${id}`);
      setOpticians(prev => prev.filter(o => o._id !== id));
      success('Optician deleted successfully!');
      return { success: true };
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to delete optician');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Create service
  const createService = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/services', data);
      setServices(prev => [...prev, response.data]);
      success('Service added successfully!');
      return { success: true, data: response.data };
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to add service');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update service
  const updateService = async (id, data) => {
    try {
      setLoading(true);
      const response = await api.put(`/services/${id}`, data);
      setServices(prev => prev.map(s => s._id === id ? response.data : s));
      success('Service updated successfully!');
      return { success: true, data: response.data };
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to update service');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete service
  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return { success: false };
    }

    try {
      setLoading(true);
      await api.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      success('Service deleted successfully!');
      return { success: true };
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to delete service');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    opticians,
    services,
    stats,
    loading,
    fetchOpticians,
    fetchServices,
    fetchStats,
    createOptician,
    updateOptician,
    deleteOptician,
    createService,
    updateService,
    deleteService
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};