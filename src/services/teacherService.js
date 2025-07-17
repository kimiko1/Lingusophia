import api from './api';

/**
 * Service pour la gestion des professeurs
 */
export const teacherService = {
  /**
   * Récupérer tous les professeurs
   */
  async getAllTeachers() {
    try {
      const response = await api.get('/teachers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les professeurs par langue
   */
  async getTeachersByLanguage(language) {
    try {
      const response = await api.get(`/teachers?language=${language}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer un professeur par ID
   */
  async getTeacherById(teacherId) {
    try {
      const response = await api.get(`/teachers/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les professeurs disponibles
   */
  async getAvailableTeachers(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.language) params.append('language', filters.language);
      if (filters.date) params.append('date', filters.date);
      if (filters.time) params.append('time', filters.time);
      
      const response = await api.get(`/teachers/available?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les créneaux horaires d'un professeur
   */
  async getTeacherSchedule(teacherId, date) {
    try {
      const response = await api.get(`/teachers/${teacherId}/schedule?date=${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les avis sur un professeur
   */
  async getTeacherReviews(teacherId) {
    try {
      const response = await api.get(`/teachers/${teacherId}/reviews`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default teacherService;
