import axios from 'axios';
import useLoadingStore from '../store/useLoadingStore';
import toast from 'react-hot-toast';

// Create Axios instance
const core = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
core.interceptors.request.use(
  (config) => {
    // Only show global loader for critical auth operations
    const criticalEndpoints = ['/auth/login', '/auth/register', '/auth/logout'];
    const shouldShowLoader = criticalEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    if (shouldShowLoader) {
      useLoadingStore.getState().startLoading();
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useLoadingStore.getState().stopLoading();
    return Promise.reject(error);
  }
);

// Response Interceptor
core.interceptors.response.use(
  (response) => {
    // Only stop loader if it was started for critical endpoints
    const criticalEndpoints = ['/auth/login', '/auth/register', '/auth/logout'];
    const shouldStopLoader = criticalEndpoints.some(endpoint => 
      response.config.url?.includes(endpoint)
    );
    
    if (shouldStopLoader) {
      useLoadingStore.getState().stopLoading();
    }
    return response;
  },
  (error) => {
    // Always stop loader on error to prevent stuck state
    useLoadingStore.getState().stopLoading();
    
    // Handle unauthorized access globally
    if (error.response && error.response.status === 401) {
      // Dispatch logout action or redirect
      toast.error('Unauthorized access. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default core;
