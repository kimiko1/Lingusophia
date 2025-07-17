import api from './api';

/**
 * Service pour la gestion des réservations
 */
export const bookingService = {
  /**
   * Récupérer toutes les réservations
   */
  async getAllBookings(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.teacherId) params.append('teacherId', filters.teacherId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/bookings?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les réservations de l'utilisateur
   */
  async getUserBookings(userId) {
    try {
      const response = await api.get(`/users/${userId}/bookings`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer une réservation par ID
   */
  async getBookingById(bookingId) {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Book a lesson for a user
   */
  async createBooking(lessonId, userId) {
    try {
      const response = await api.post('api/bookings/create', { lessonId, userId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  /**
   * Mettre à jour une réservation
   */
  async updateBooking(bookingId, bookingData) {
    try {
      const response = await api.put(`/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Annuler une réservation
   */
  async cancelBooking(bookingId) {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirmer une réservation
   */
  async confirmBooking(bookingId) {
    try {
      const response = await api.put(`/bookings/${bookingId}/confirm`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Marquer une réservation comme terminée
   */
  async completeBooking(bookingId) {
    try {
      const response = await api.put(`/bookings/${bookingId}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer les créneaux disponibles pour un professeur
   */
  async getAvailableSlots(teacherId, date) {
    try {
      const response = await api.get(`/teachers/${teacherId}/available-slots?date=${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprimer une réservation
   */
  async deleteBooking(bookingId) {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default bookingService;
