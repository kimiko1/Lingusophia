import api from './api';
import lessonService from './lessonService';
import userService from './userService';
import bookingService from './bookingService';
import teacherService from './teacherService';
import statsService from './statsService';

// Re-export services as named exports
export { lessonService, userService, bookingService, teacherService, statsService };

// Service d'authentification
export const authService = {
  // Connexion
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur de connexion';
      throw errorMessage;
    }
  },

  // Inscription
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription';
      throw errorMessage;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur de déconnexion';
      throw errorMessage;
    }
  },

  // Vérifier le statut de connexion
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Non authentifié';
      throw errorMessage;
    }
  },

  // Rafraîchir le token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Service des rôles
export const rolesService = {
  // Obtenir tous les rôles
  getAllRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtenir un rôle par ID
  getRoleById: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer un nouveau rôle
  createRole: async (roleData) => {
    try {
      const response = await api.post('/roles', roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un rôle
  updateRole: async (id, roleData) => {
    try {
      const response = await api.put(`/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un rôle
  deleteRole: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Service des utilisateurs
export const usersService = {
  // Obtenir tous les utilisateurs
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtenir un utilisateur par ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Service des leçons (à adapter selon votre schema)
export const lessonsService = {
  // Obtenir toutes les leçons
  getAllLessons: async () => {
    try {
      const response = await api.get('/lessons');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtenir une leçon par ID
  getLessonById: async (id) => {
    try {
      const response = await api.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer une nouvelle leçon
  createLesson: async (lessonData) => {
    try {
      const response = await api.post('/lessons', lessonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour une leçon
  updateLesson: async (id, lessonData) => {
    try {
      const response = await api.put(`/lessons/${id}`, lessonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer une leçon
  deleteLesson: async (id) => {
    try {
      const response = await api.delete(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Service des réservations (à adapter selon votre schema)
export const bookingsService = {
  // Obtenir toutes les réservations
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtenir les réservations d'un utilisateur
  getUserBookings: async (userId) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer une nouvelle réservation
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour une réservation
  updateBooking: async (id, bookingData) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Annuler une réservation
  cancelBooking: async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Service des progrès (à adapter selon votre schema)
export const progressService = {
  // Obtenir les progrès d'un utilisateur
  getUserProgress: async (userId) => {
    try {
      const response = await api.get(`/progress/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour les progrès
  updateProgress: async (progressData) => {
    try {
      const response = await api.post('/progress', progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default {
  authService,
  rolesService,
  usersService,
  lessonsService,
  bookingsService,
  progressService,
  lessonService,
  userService,
  bookingService,
  teacherService,
  statsService
};

