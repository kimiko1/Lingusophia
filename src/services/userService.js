import api from './api';
import { apiWithFallback, MOCK_DATA } from './mockService';

/**
 * Service pour la gestion des profils utilisateur
 */
export const userService = {
  /**
   * Récupérer le profil de l'utilisateur actuel
   */
  async getCurrentUserProfile() {
    const response = await api.get('/api/users/profile');
    // Extraire les données utilisateur correctement
    return response.data?.user || response.data;
  },

  /**
   * Mettre à jour le profil de l'utilisateur
   */
  async updateUserProfile(userId, userData) {
    const response = await api.put(`/api/users/profile/${userId}`, userData);
    return response.data?.user || response.data;
  },

  /**
   * Récupérer les statistiques de l'utilisateur
   */
  async getUserStats(userId) {
    const response = await api.get(`/api/users/stats/${userId}`);
    return response.data;
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(formData) {
    const response = await api.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Récupérer les leçons récentes de l'utilisateur
   */
  async getRecentLessons(userId, limit = 10) {
    return apiWithFallback(
      `/users/${userId}/recent-lessons`,
      MOCK_DATA.recentLessons(userId, limit),
      async () => {
        const response = await api.get(`/users/${userId}/recent-lessons?limit=${limit}`);
        return response.data;
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
      const response = await api.put(`/users/${userId}/settings`, settings);
      return response.data;
  },

  /**
   * Changer le mot de passe de l'utilisateur
   */
  async changePassword(passwordData) {
      const response = await api.put('/api/users/change-password', passwordData);
      return response.data;
  },

  /**
   * Supprimer le compte utilisateur
   */
  async deleteAccount(userId) {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
  },

  /**
   * Récupérer toutes les données admin (users, lessons, bookings, stats)
   */
  async getAllUsers() {
    // Fallback mock complet si l'API échoue
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
  },

  /**
   * Créer un nouvel utilisateur (pour admin)
   */
  async createUser(userData) {
      const response = await api.post('/users', userData);
      return response.data;
  },

  /**
   * Mettre à jour un utilisateur (pour admin)
   */
  async updateUser(userId, userData) {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
  },

  /**
   * Supprimer un utilisateur (pour admin)
   */
  async deleteUser(userId) {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
  }
};

export default userService;
