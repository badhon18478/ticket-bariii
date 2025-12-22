// hooks/useAxiosSecure.js
import axios from 'axios';

const useAxiosSecure = () => {
  // Create axios instance
  const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Vite compatible
  });

  // Request interceptor to add Firebase token
  axiosSecure.interceptors.request.use(
    async config => {
      const token = localStorage.getItem('accessToken'); // Firebase token stored in localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors globally
  axiosSecure.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access, please login again.');
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
