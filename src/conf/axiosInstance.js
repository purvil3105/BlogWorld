import axios from 'axios';
import conf from './conf.js';

const axiosInstance = axios.create({
    baseURL: conf.apiUrl,
});

// Add a request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
