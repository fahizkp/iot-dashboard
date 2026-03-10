import api from './api';

export const vehiclesAPI = {
  // Get all vehicles
  getAll: (params) => api.get('/vehicles', { params }),

  // Get single vehicle
  getOne: (id) => api.get(`/vehicles/${id}`),

  // Create vehicle
  create: (data) => api.post('/vehicles', data),

  // Update vehicle
  update: (id, data) => api.patch(`/vehicles/${id}`, data),

  // Delete vehicle
  delete: (id) => api.delete(`/vehicles/${id}`),

  // Get telemetry history
  getHistory: (id, limit = 50) => api.get(`/vehicles/${id}/history`, { params: { limit } }),

  // Get dashboard stats
  getStats: () => api.get('/vehicles/stats/overview'),
};

export const iotAPI = {
  /**
   * Ingest a real IoT payload (same format as the external API).
   * Can be a single object or an array.
   */
  ingest: (payload) => api.post('/iot/ingest', payload),

  /**
   * Simulate a telemetry event from a random (or specific) vehicle.
   * Great for testing the dashboard before the live API is ready.
   * @param {string} [vehicleId] - optional: simulate a specific vehicle
   */
  simulate: (vehicleId) => api.post('/iot/simulate', vehicleId ? { vehicleId } : {}),
};
