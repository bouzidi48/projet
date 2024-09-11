import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // URL de votre backend
  withCredentials: true, // Inclure les cookies avec chaque requête
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;