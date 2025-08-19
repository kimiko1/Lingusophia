import api from "./api";

/**
 * Service pour la gestion des réservations
 */
export const bookingService = {
  /**
   * Récupérer toutes les réservations
   */
  async getAllBookings(filters = {}) {
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.teacherId) params.append("teacherId", filters.teacherId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(`/bookings?${params.toString()}`);
    return response.data;
  },

  /**
   * Récupérer les réservations de l'utilisateur
   */
  async getUserBookings(userId) {
    const response = await api.get(`/users/${userId}/bookings`);
    return response.data;
  },

  /**
   * Récupérer une réservation par ID
   */
  async getBookingById(bookingId) {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Créer une nouvelle réservation
   */
  async createBooking(bookingData) {
    const response = await api.post("/api/bookings/create", bookingData);
    return response.data;
  },

  /**
   * Mettre à jour une réservation
   */
  async updateBooking(bookingId, bookingData) {
    const response = await api.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  },

  /**
   * Annuler une réservation
   */
  async cancelBooking(bookingId) {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  /**
   * Confirmer une réservation
   */
  async confirmBooking(bookingId) {
    const response = await api.put(`/bookings/${bookingId}/confirm`);
    return response.data;
  },

  /**
   * Marquer une réservation comme terminée
   */
  async completeBooking(bookingId) {
    const response = await api.put(`/bookings/${bookingId}/complete`);
    return response.data;
  },

  /**
   * Récupérer les créneaux disponibles pour un professeur
   */
  async getAvailableSlots(teacherId, date) {
    const response = await api.get(
      `/teachers/${teacherId}/available-slots?date=${date}`
    );
    return response.data;
  },

  /**
   * Supprimer une réservation
   */
  async deleteBooking(bookingId) {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },
};

export default bookingService;
