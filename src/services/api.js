import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject({ message: 'Request setup failed' });
    }
  }
);

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