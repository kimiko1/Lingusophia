import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { lessonService } from '../../services';

// Actions asynchrones
export const fetchLessons = createAsyncThunk(
  'lessons/fetchLessons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lessonService.getAllLessons();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLessonById = createAsyncThunk(
  'lessons/fetchLessonById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await lessonService.getLessonById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createLesson = createAsyncThunk(
  'lessons/createLesson',
  async (lessonData, { rejectWithValue }) => {
    try {
      const response = await lessonService.createLesson(lessonData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateLesson = createAsyncThunk(
  'lessons/updateLesson',
  async ({ id, lessonData }, { rejectWithValue }) => {
    try {
      const response = await lessonService.updateLesson(id, lessonData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'lessons/deleteLesson',
  async (id, { rejectWithValue }) => {
    try {
      await lessonService.deleteLesson(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  lessons: [],
  currentLesson: null,
  isLoading: false,
  error: null,
};

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all lessons
      .addCase(fetchLessons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lessons = action.payload;
        state.error = null;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch lesson by ID
      .addCase(fetchLessonById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLesson = action.payload;
        state.error = null;
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create lesson
      .addCase(createLesson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lessons.push(action.payload);
        state.error = null;
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update lesson
      .addCase(updateLesson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete lesson
      .addCase(deleteLesson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentLesson } = lessonsSlice.actions;
export default lessonsSlice.reducer;
