// frontend/src/services/api.js - CORRECTED
import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // SINGLE, CORRECT API_BASE_URL definition
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const opticiansAPI = {
  getAll: () => api.get('/opticians'), // NO /api prefix
  getById: (id) => api.get(`/opticians/${id}`), // NO /api prefix
  create: (data) => api.post('/opticians', data), // NO /api prefix
  update: (id, data) => api.put(`/opticians/${id}`, data), // NO /api prefix
  delete: (id) => api.delete(`/opticians/${id}`) // NO /api prefix
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data), // NO /api prefix
  login: (data) => api.post('/auth/login', data), // NO /api prefix
  getMe: () => api.get('/auth/me') // NO /api prefix
};