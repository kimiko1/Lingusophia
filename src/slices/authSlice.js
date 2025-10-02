import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Thunk pour mettre à jour le profil utilisateur
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur inconnue');
    }
  }
);

// Récupère l'état initial depuis le sessionStorage
const getInitialState = () => {
  try {
    const saved = sessionStorage.getItem('auth');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // action.payload peut être le wrapper API ou l'objet user
    setUser: (state, action) => {
      // Si action.payload.user existe, on prend action.payload.user, sinon action.payload
      state.user = action.payload.user ? action.payload.user : action.payload;
      state.isAuthenticated = !!state.user;
      saveToSession(state);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      saveToSession(state);
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      saveToSession(state);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
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
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        // Met à jour le user si succès
        if (action.payload) {
          // Si action.payload.user existe, on prend action.payload.user, sinon action.payload.data ou action.payload
          if (action.payload.user) {
            state.user = action.payload.user;
          } else if (action.payload.data) {
            state.user = action.payload.data;
          } else {
            state.user = action.payload;
          }
          state.isAuthenticated = true;
        }
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de la mise à jour du profil';
        saveToSession(state);
      });
  },
});

// Fonction utilitaire pour sauvegarder dans le sessionStorage
function saveToSession(state) {
  try {
    sessionStorage.setItem('auth', JSON.stringify(state));
  } catch (e) {}
}

export const { setUser, setLoading, setAuthenticated, logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
