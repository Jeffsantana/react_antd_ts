import axios from 'axios';

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4500/'
    : 'http://localhost:4500/';

const api = axios.create({
  baseURL,
});

const token = localStorage.getItem('MyApp@token');


api.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json';
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }

  console.log("🚀 ~ config", config);
  return config;
});

// axios.interceptors


export default api;

