// src/services/apiConfig.ts
export const API_BASE_URL = 'http://localhost:3000';
// services/api.ts
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Assure-toi de remplacer l'URL par celle de ton API
   // Temps maximum pour la requête (en millisecondes)
  headers: {
    'Content-Type': 'application/json',
  },
});
