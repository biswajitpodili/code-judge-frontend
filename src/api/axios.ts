import axios from 'axios';
import Cookies from 'js-cookie';

// Get the API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.43.228:8080/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    const authCookie = Cookies.get('auth');
    if (authCookie) {
      config.headers['x-user-id'] = JSON.parse(authCookie).userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle unauthorized errors
      if (error.response.status === 401) {
        // Redirect to login or refresh token
        console.log('Unauthorized - redirecting to login');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 