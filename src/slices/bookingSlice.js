import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    const saved = sessionStorage.getItem('booking');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load booking state from sessionStorage', e);
  }
  return {
    selectedDate: null,
    selectedTime: '',
    selectedLesson: null,
    selectedTeacher: null,
  };
};

const initialState = getInitialState();

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      // Always store as ISO string for serializability
      if (action.payload instanceof Date) {
        state.selectedDate = action.payload.toISOString();
      } else {
        state.selectedDate = action.payload;
      }
      saveToSession(state);
    },
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
      saveToSession(state);
    },
    setSelectedLesson: (state, action) => {
      state.selectedLesson = action.payload;
      saveToSession(state);
    },
    setSelectedTeacher: (state, action) => {
      state.selectedTeacher = action.payload;
      saveToSession(state);
    },
    resetBooking: (state) => {
      state.selectedDate = null;
      state.selectedTime = '';
      state.selectedLesson = null;
      state.selectedTeacher = null;
      saveToSession(state);
    },
  },
});

function saveToSession(state) {
  try {
    sessionStorage.setItem('booking', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save booking state to sessionStorage', e);
  }
}

export const { setSelectedDate, setSelectedTime, setSelectedLesson, setSelectedTeacher, resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
