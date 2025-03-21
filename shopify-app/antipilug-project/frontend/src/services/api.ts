import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Auth errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // Optional: Redirect to login page
        // window.location.href = '/login';
      }
      
      // Server errors
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Content API
export const contentApi = {
  getContent: (page: string) => api.get(`/content/${page}`),
  updateContent: (page: string, data: any) => api.put(`/content/${page}`, data),
};

// User API
export const userApi = {
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (id: string, data: any) => api.put(`/users/${id}`, data),
  createUser: (data: any) => api.post('/users', data),
};

// Question API
export const questionApi = {
  getQuestions: (params = {}) => api.get('/questions', { params }),
  getUserAnswers: () => api.get('/questions/user-answers'),
  saveUserAnswers: (answers) => api.post('/questions/user-answers', { answers }),
};

export default api;