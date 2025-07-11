import api from './api';

/**
 * Service pour la gestion des statistiques et du dashboard
 */
export const statsService = {
  /**
   * Récupérer les statistiques générales (dashboard admin)
   */
  async getDashboardStats() {
    try {
      const response = await api.get('/stats/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les statistiques d'un utilisateur
   */
  async getUserStats(userId) {
    try {
      const response = await api.get(`/stats/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les données d'activité récente
   */
  async getRecentActivity(limit = 10) {
    try {
      const response = await api.get(`/stats/recent-activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les revenus mensuels
   */
  async getMonthlyRevenue(year, month) {
    try {
      const response = await api.get(`/stats/revenue?year=${year}&month=${month}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les statistiques de progression des utilisateurs
   */
  async getProgressStats(userId) {
    try {
      const response = await api.get(`/stats/progress/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les statistiques de popularité des leçons
   */
  async getLessonPopularityStats() {
    try {
      const response = await api.get('/stats/lesson-popularity');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default statsService;
