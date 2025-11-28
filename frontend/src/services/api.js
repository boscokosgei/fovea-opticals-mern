// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
};

export const opticiansAPI = {
  getAll: () => api.get('/opticians'),
  getById: (id) => api.get(`/opticians/${id}`),
};

export const appointmentsAPI = {
  getAll: () => api.get('/appointments'),
  create: (appointment) => api.post('/appointments', appointment),
};

export default api;