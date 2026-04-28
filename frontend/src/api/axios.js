import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // backend port 5000
});

// Ovvoru request-kum munnadi token-ah sethu anuppum
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;