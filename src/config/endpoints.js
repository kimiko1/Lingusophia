/**
 * Configuration des endpoints API
 * Permet de basculer entre les vrais endpoints et les données mockées
 */

// Configuration pour déterminer si on utilise les données mockées ou les vrais endpoints
export const API_CONFIG = {
  // Mettre à false pour utiliser les vrais endpoints
  // Mettre à true pour utiliser des données mockées quand les endpoints ne sont pas disponibles
  USE_FALLBACK_DATA: true,
  
  // Base URL de l'API
  BASE_URL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Endpoints disponibles
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me'
    },
    
    // Utilisateurs
    USERS: {
      BASE: '/users',
      PROFILE: (id) => `/users/${id}`,
      SETTINGS: (id) => `/users/${id}/settings`,
      RECENT_LESSONS: (id) => `/users/${id}/recent-lessons`,
      LEARNING_HISTORY: (id) => `/users/${id}/learning-history`,
      STATS: (id) => `/users/${id}/stats`
    },
    
    // Leçons
    LESSONS: {
      BASE: '/lessons',
      BY_ID: (id) => `/lessons/${id}`,
      BY_LANGUAGE: '/lessons', // avec param ?language=
      BY_LEVEL: '/lessons', // avec param ?level=
      COMPLETE: (id) => `/lessons/${id}/complete`
    },
    
    // Réservations
    BOOKINGS: {
      BASE: '/bookings',
      BY_ID: (id) => `/bookings/${id}`,
      BY_USER: (userId) => `/bookings/user/${userId}`,
      AVAILABLE_SLOTS: '/bookings/available-slots'
    },
    
    // Professeurs
    TEACHERS: {
      BASE: '/teachers',
      BY_ID: (id) => `/teachers/${id}`,
      BY_LANGUAGE: '/teachers', // avec param ?language=
      AVAILABILITY: (id) => `/teachers/${id}/availability`
    },
    
    // Statistiques
    STATS: {
      USER: (id) => `/stats/user/${id}`,
      GLOBAL: '/stats/global'
    }
  }
};

// Endpoints qui sont connus pour ne pas être encore implémentés
export const UNIMPLEMENTED_ENDPOINTS = [
  'recent-lessons',
  'learning-history',
  'settings',
  'stats',
  'available-slots',
  'availability'
];

/**
 * Vérifie si un endpoint est probablement implémenté
 */
export const isEndpointImplemented = (endpoint) => {
  return !UNIMPLEMENTED_ENDPOINTS.some(unimplemented => endpoint.includes(unimplemented));
};
