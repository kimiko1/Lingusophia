// Configuration de l'API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Configuration de l'authentification
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user_data',
};

// Configuration des langues
export const LANGUAGES = {
  FR: 'fr',
  EN: 'en',
  ZH: 'zh',
};

// Configuration des niveaux
export const LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

// Configuration des couleurs
export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#10B981',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
};

// Configuration des routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  LESSONS: '/lessons',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
};

export default {
  API_BASE_URL,
  AUTH_CONFIG,
  LANGUAGES,
  LEVELS,
  COLORS,
  ROUTES,
};
