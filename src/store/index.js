import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import lessonsSlice from './slices/lessonsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    lessons: lessonsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Types pour TypeScript (à utiliser si vous migrez vers TS)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
