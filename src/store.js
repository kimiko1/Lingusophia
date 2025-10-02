import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@slices/authSlice';
import lessonsReducer from '@slices/lessonsSlice';
import bookingReducer from '@slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer,
    booking: bookingReducer,
  },
});
