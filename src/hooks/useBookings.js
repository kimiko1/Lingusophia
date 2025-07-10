import { useState, useEffect } from 'react';
import { bookingsService } from '../services';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingsService.getAllBookings();
      setBookings(response);
      return { success: true, data: response };
    } catch (error) {
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserBookings = async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingsService.getUserBookings(userId);
      setBookings(response);
      return { success: true, data: response };
    } catch (error) {
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingsService.createBooking(bookingData);
      setBookings(prev => [...prev, response]);
      return { success: true, data: response };
    } catch (error) {
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const updateBooking = async (id, bookingData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingsService.updateBooking(id, bookingData);
      setBookings(prev => 
        prev.map(booking => booking.id === id ? response : booking)
      );
      return { success: true, data: response };
    } catch (error) {
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await bookingsService.cancelBooking(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      return { success: true };
    } catch (error) {
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    bookings,
    isLoading,
    error,
    fetchBookings,
    fetchUserBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    clearError,
  };
};
