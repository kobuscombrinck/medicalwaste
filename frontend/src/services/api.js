import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fleet Management API
export const fleetAPI = {
  getVehicles: () => api.get('/vehicles'),
  getVehicle: (id) => api.get(`/vehicles/${id}`),
  createVehicle: (data) => api.post('/vehicles', data),
  updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`),
};

// Staff Management API
export const staffAPI = {
  getStaff: () => api.get('/staff'),
  getStaffMember: (id) => api.get(`/staff/${id}`),
  createStaffMember: (data) => api.post('/staff', data),
  updateStaffMember: (id, data) => api.put(`/staff/${id}`, data),
  deleteStaffMember: (id) => api.delete(`/staff/${id}`),
};

// Waste Collection API
export const wasteCollectionAPI = {
  getCollections: () => api.get('/collections'),
  getCollection: (id) => api.get(`/collections/${id}`),
  createCollection: (data) => api.post('/collections', data),
  updateCollection: (id, data) => api.put(`/collections/${id}`, data),
  deleteCollection: (id) => api.delete(`/collections/${id}`),
};

// Maintenance API
export const maintenanceAPI = {
  getMaintenanceTasks: () => api.get('/maintenance'),
  getMaintenanceTask: (id) => api.get(`/maintenance/${id}`),
  createMaintenanceTask: (data) => api.post('/maintenance', data),
  updateMaintenanceTask: (id, data) => api.put(`/maintenance/${id}`, data),
  deleteMaintenanceTask: (id) => api.delete(`/maintenance/${id}`),
};

// Incident Reports API
export const incidentAPI = {
  getIncidents: () => api.get('/incidents'),
  getIncident: (id) => api.get(`/incidents/${id}`),
  createIncident: (data) => api.post('/incidents', data),
  updateIncident: (id, data) => api.put(`/incidents/${id}`, data),
  deleteIncident: (id) => api.delete(`/incidents/${id}`),
};

// Settings API
export const settingsAPI = {
  getUserSettings: () => api.get('/settings'),
  updateUserSettings: (data) => api.put('/settings', data),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

export default api;
