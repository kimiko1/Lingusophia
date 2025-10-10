import api from './api';
import { apiWithFallback, MOCK_DATA } from './mockService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Service pour la gestion des profils utilisateur
 */
export const userService = {
  /**
   * Récupérer le profil de l'utilisateur actuel
   */
  async getCurrentUserProfile() {
    try {
      const response = await api.get('/api/users/profile');
      // Extraire les données utilisateur correctement
      return response.data?.user || response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mettre à jour le profil de l'utilisateur
   */
  async updateUserProfile(userData) {
    try {
      const response = await api.put('/api/users/profile', userData);
      return response.data?.user || response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les statistiques de l'utilisateur
   */
  async getUserStats() {
    try {
      const response = await api.get('/api/users/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(formData) {
    try {
      const response = await api.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les leçons récentes de l'utilisateur
   */
  async getRecentLessons(userId, limit = 10) {
    return apiWithFallback(
      `/users/${userId}/recent-lessons`,
      MOCK_DATA.recentLessons(userId, limit),
      async () => {
        try {
          const response = await api.get(`/users/${userId}/recent-lessons?limit=${limit}`);
          return response.data;
        } catch (error) {
          if (error.response?.status === 404) {
            // Essayer l'endpoint alternatif
            const response = await api.get(`/lessons?userId=${userId}&limit=${limit}&sort=recent`);
            return response.data;
          }
          throw error;
        }
      }
    );
  },

  /**
   * Récupérer l'historique d'apprentissage de l'utilisateur
   */
  async getLearningHistory(userId, filters = {}) {
    return apiWithFallback(
      `/users/${userId}/learning-history`,
      MOCK_DATA.learningHistory(userId, filters),
      async () => {
        const params = new URLSearchParams();
        
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.language) params.append('language', filters.language);
        
        const response = await api.get(`/users/${userId}/learning-history?${params.toString()}`);
        return response.data;
      }
    );
  },

  /**
   * Récupérer les paramètres de l'utilisateur
   */
  async getUserSettings(userId) {
    return apiWithFallback(
      `/users/${userId}/settings`,
      MOCK_DATA.userSettings(userId),
      async () => {
        const response = await api.get(`/users/${userId}/settings`);
        return response.data;
      }
    );
  },

  /**
   * Mettre à jour les paramètres de l'utilisateur
   */
  async updateUserSettings(userId, settings) {
    try {
      const response = await api.put(`/users/${userId}/settings`, settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Changer le mot de passe de l'utilisateur
   */
  async changePassword(passwordData) {
    try {
      const response = await api.put('/api/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprimer le compte utilisateur
   */
  async deleteAccount(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer toutes les données admin (users, lessons, bookings, stats)
   */
  async getAllUsers() {
    // Fallback mock complet si l'API échoue
    try {
      // Appels API en parallèle sans params
      const [usersRes, lessonsRes, bookingsRes, statsRes] = await Promise.all([
        api.get('api/users'),
        api.get('api/lessons'),
        api.get('api/bookings/all'),
        // api.get('api/stats/dashboard').catch(() => ({ data: {} }))
      ]);

      return {
        users: usersRes.data,
        lessons: lessonsRes.data?.lessons || lessonsRes.data,
        bookings: bookingsRes.data,
        // stats: statsRes.data
      };
    } catch (error) {
      // Si toutes les routes échouent, on propage l'erreur pour affichage explicite côté Admin
      throw error;
    }
  },

  /**
   * Créer un nouvel utilisateur (pour admin)
   */
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mettre à jour un utilisateur (pour admin)
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprimer un utilisateur (pour admin)
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;
