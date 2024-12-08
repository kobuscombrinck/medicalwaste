import API from './config';

export const vehicleAPI = {
  // Get all vehicles
  getVehicles: () => API.get('/vehicles'),

  // Get vehicle by ID
  getVehicle: (id) => API.get(`/vehicles/${id}`),

  // Create new vehicle
  createVehicle: (data) => API.post('/vehicles', data),

  // Update vehicle
  updateVehicle: (id, data) => API.put(`/vehicles/${id}`, data),

  // Delete vehicle
  deleteVehicle: (id) => API.delete(`/vehicles/${id}`),

  // Add incident
  addIncident: (vehicleId, data) => 
    API.post(`/vehicles/${vehicleId}/incidents`, data),

  // Update incident
  updateIncident: (vehicleId, incidentId, data) =>
    API.put(`/vehicles/${vehicleId}/incidents/${incidentId}`, data),

  // Delete incident
  deleteIncident: (vehicleId, incidentId) =>
    API.delete(`/vehicles/${vehicleId}/incidents/${incidentId}`),

  // Upload document
  uploadDocument: (vehicleId, formData) =>
    API.post(`/vehicles/${vehicleId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Delete document
  deleteDocument: (vehicleId, documentId) =>
    API.delete(`/vehicles/${vehicleId}/documents/${documentId}`),

  // Add maintenance record
  addMaintenance: (vehicleId, data) =>
    API.post(`/vehicles/${vehicleId}/maintenance`, data),

  // Get maintenance history
  getMaintenanceHistory: (vehicleId) =>
    API.get(`/vehicles/${vehicleId}/maintenance`),

  // Get vehicle statistics
  getVehicleStats: (vehicleId) =>
    API.get(`/vehicles/${vehicleId}/stats`),
};
