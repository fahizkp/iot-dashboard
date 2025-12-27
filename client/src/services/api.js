import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
};

// Contacts API
export const contactsAPI = {
  submit: (data) => api.post('/contacts', data),
  getAll: (params) => api.get('/contacts', { params }),
  getOne: (id) => api.get(`/contacts/${id}`),
  update: (id, data) => api.patch(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
  getStats: () => api.get('/contacts/stats'),
};

export default api;
