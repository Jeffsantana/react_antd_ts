import axios from 'axios';

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4500/'
    : 'http://localhost:4500/';

const api = axios.create({
  baseURL,
});

// localStorage.setItem('MyApp@token', token);
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = 'Bearer ' + localStorage.getItem('MyApp@token')
  return config;
});

export default api;

