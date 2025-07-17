import axios from 'axios';

// Configuration de base d'axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  withCredentials: true, // Important pour les cookies d'authentification
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion globale des erreurs
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion si non authentifié
      window.location.href = '/login';
    }
    
    if (import.meta.env.MODE === 'development') {
      console.error('API Error:', error.response?.status, error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;
