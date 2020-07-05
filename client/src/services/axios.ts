import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 3 * 60 * 1000,
});

api.interceptors.request.use(
    (config) => {
        if (!config.headers.authorization) {
            config.headers.authorization = window.localStorage.getItem('token') || '';
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export default api;
