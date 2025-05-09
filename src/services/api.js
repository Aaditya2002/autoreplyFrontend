import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const auth = {
  getGoogleAuthUrl: () => api.get('/auth/google'),
  handleGoogleCallback: (code) => api.get(`/auth/google/callback?code=${code}`),
  logout: () => api.post('/logout'),
};

export const emails = {
  getUnread: () => api.get('/emails'),
  generateResponse: (emailId) => api.post('/generate-response', { email_id: emailId }),
  sendResponse: (emailId, response) => api.post('/send-response', { email_id: emailId, response }),
};

export const settings = {
  get: () => api.get('/settings'),
  update: (settings) => api.post('/settings', settings),
};

export default api; 