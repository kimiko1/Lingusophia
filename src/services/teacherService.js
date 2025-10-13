import api from './api';

/**
 * Service pour la gestion des professeurs
 */
export const teacherService = {
  /**
   * Récupérer tous les professeurs
   */
  async getAllTeachers() {
    const response = await api.get('/teachers');
    return response.data;
},

  /**
   * Récupérer les professeurs par langue
   */
  async getTeachersByLanguage(language) {
      const response = await api.get(`/teachers?language=${language}`);
      return response.data;
  },

    /**
     * Récupérer un professeur par ID
     */
    async getTeacherById(teacherId) {
    const response = await api.get(`/teachers/${teacherId}`);
    return response.data;
},

  /**
   * Récupérer les professeurs disponibles
   */
  async getAvailableTeachers(filters = {}) {
    const params = new URLSearchParams();

    if (filters.language) params.append('language', filters.language);
    if (filters.date) params.append('date', filters.date);
    if (filters.time) params.append('time', filters.time);

    const response = await api.get(`/teachers/available?${params.toString()}`);
    return response.data;
},

  /**
   * Récupérer les créneaux horaires d'un professeur
   */
  async getTeacherSchedule(teacherId, date) {
    const response = await api.get(`/teachers/${teacherId}/schedule?date=${date}`);
    return response.data;
},

  /**
   * Récupérer les avis sur un professeur
   */
  async getTeacherReviews(teacherId) {
    const response = await api.get(`/teachers/${teacherId}/reviews`);
    return response.data;
}
};

export default teacherService;
