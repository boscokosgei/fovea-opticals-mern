// frontend/src/hooks/useData.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction(api);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [api, fetchFunction]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};

// Specific data hooks
export const useServices = () => {
  return useData(async (api) => {
    const response = await api.get('/services');
    return response.data;
  }, []);
};

export const useOpticians = () => {
  return useData(async (api) => {
    const response = await api.get('/opticians');
    return response.data;
  }, []);
};

export const useAppointments = () => {
  const { user } = useAuth();
  return useData(async (api) => {
    if (!user) return [];
    const response = await api.get('/appointments');
    return response.data;
  }, [user]);
};