import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tma = localStorage.getItem('tma');
    const storeSlug = localStorage.getItem('store');

    console.log('API Request Interceptor:');
    console.log('- Token present:', !!token);
    console.log('- TMA present:', !!tma);
    console.log('- Store:', storeSlug);

    if (storeSlug) {
      config.headers['store'] = storeSlug;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('- Using Bearer token auth');
    } else if (tma) {
      config.headers.Authorization = `tma ${tma}`;
      console.log('- Using TMA auth');
    } else {
      console.log('- No auth header set');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Unwrap both Axios response.data and API wrapper { success, data, timestamp }
    return response.data?.data || response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('store');
      localStorage.removeItem('tma');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
