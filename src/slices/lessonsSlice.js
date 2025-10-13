import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    const saved = sessionStorage.getItem('lessons');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load lessons state from sessionStorage', e);
  }
  return {
    lessons: [],
    currentLesson: null,
    isLoading: false,
    error: null,
  };
};

const initialState = getInitialState();

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setLessons: (state, action) => {
      state.lessons = action.payload;
      saveToSession(state);
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
      saveToSession(state);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      saveToSession(state);
    },
    setError: (state, action) => {
      state.error = action.payload;
      saveToSession(state);
    },
    clearError: (state) => {
      state.error = null;
      saveToSession(state);
    },
  },
});

function saveToSession(state) {
  try {
    sessionStorage.setItem('lessons', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save lessons state to sessionStorage', e);
  }
}

export const { setLessons, setCurrentLesson, setLoading, setError, clearError } = lessonsSlice.actions;
export default lessonsSlice.reducer;
