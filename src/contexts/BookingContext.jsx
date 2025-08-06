import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setSelectedLesson(null);
    setSelectedTeacher(null);
  };

  const value = {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedLesson,
    setSelectedLesson,
    selectedTeacher,
    setSelectedTeacher,
    resetBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

BookingProvider.propTypes = {
  children: PropTypes.node.isRequired
};
