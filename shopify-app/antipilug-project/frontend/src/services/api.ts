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
  getContent: (params = {}) => api.get('/content', { params }),
  getContentById: (id) => api.get(`/content/${id}`),
  getFeaturedContent: () => api.get('/content/featured'),
};

// User API
export const userApi = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateQuestionnaireChanges: () => api.put('/users/questionnaire-changes'),
};

// Question API
export const questionApi = {
  getQuestions: (params = {}) => api.get('/questions', { params }),
  getUserAnswers: () => api.get('/questions/user-answers'),
  saveUserAnswers: (answers) => api.post('/questions/user-answers', { answers }),
};

export default api;