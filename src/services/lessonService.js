import api from './api';

/**
 * Service pour la gestion des leçons
 */
export const lessonService = {
  /**
   * Récupérer toutes les leçons
   */
  async getAllLessons() {
    try {
      const response = await api.get('/lessons');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Retourner des leçons mockées si l'endpoint n'existe pas
        console.warn('Endpoint de leçons non disponible, utilisation de données mockées');
        return {
          lessons: [
            {
              id: 1,
              title: 'Introduction à l\'anglais',
              description: 'Apprenez les bases de l\'anglais',
              language: 'anglais',
              level: 'débutant',
              category: 'grammaire',
              duration: 30,
              difficulty: 1,
              isCompleted: false,
              progress: 0
            },
            {
              id: 2,
              title: 'Vocabulaire de base',
              description: 'Apprenez le vocabulaire essentiel',
              language: 'anglais',
              level: 'débutant',
              category: 'vocabulaire',
              duration: 45,
              difficulty: 1,
              isCompleted: false,
              progress: 0
            }
          ]
        };
      }
      throw error;
    }
  },

  /**
   * Récupérer les leçons par langue
   */
  async getLessonsByLanguage(language) {
    try {
      const response = await api.get(`/lessons?language=${language}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les leçons par niveau
   */
  async getLessonsByLevel(level) {
    try {
      const response = await api.get(`/lessons?level=${level}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les leçons par catégorie
   */
  async getLessonsByCategory(category) {
    try {
      const response = await api.get(`/lessons?category=${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les leçons avec filtres multiples
   */
  async getFilteredLessons(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.language) params.append('language', filters.language);
      if (filters.level) params.append('level', filters.level);
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      
      const response = await api.get(`/lessons?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer une leçon par ID
   */
  async getLessonById(id) {
    try {
      const response = await api.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Créer une nouvelle leçon
   */
  async createLesson(lessonData) {
    try {
      const response = await api.post('/lessons', lessonData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mettre à jour une leçon
   */
  async updateLesson(id, lessonData) {
    try {
      const response = await api.put(`/lessons/${id}`, lessonData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprimer une leçon
   */
  async deleteLesson(id) {
    try {
      const response = await api.delete(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les leçons complétées par l'utilisateur
   */
  async getCompletedLessons(userId) {
    try {
      const response = await api.get(`/users/${userId}/completed-lessons`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les leçons en cours par l'utilisateur
   */
  async getOngoingLessons(userId) {
    try {
      const response = await api.get(`/users/${userId}/ongoing-lessons`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Marquer une leçon comme terminée
   */
  async completeLesson(lessonId, completionData) {
    try {
      const response = await api.post(`/lessons/${lessonId}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default lessonService;
