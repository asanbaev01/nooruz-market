import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/* ====== Request interceptor — токен кошуу ====== */
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nooruz_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ====== Response interceptor — каталарды кармоо ====== */
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nooruz_token');
      localStorage.removeItem('nooruz_user');
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Тармак катасы';

    return Promise.reject(new Error(message));
  }
);

export default client;