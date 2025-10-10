import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services';

// Thunk pour récupérer le profil utilisateur
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await userService.getCurrentUserProfile();
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Erreur lors de la récupération du profil');
    }
  }
);

// Thunk pour mettre à jour le profil utilisateur
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (data, { rejectWithValue }) => {
    try {
      const updatedUser = await userService.updateUserProfile(data);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Erreur lors de la mise à jour du profil');
    }
  }
);

// Thunk pour uploader l'avatar
export const uploadUserAvatar = createAsyncThunk(
  'auth/uploadUserAvatar',
  async (formData, { rejectWithValue }) => {
    try {
      const result = await userService.uploadAvatar(formData);
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Erreur lors de l\'upload de l\'avatar');
    }
  }
);

// Thunk pour récupérer les statistiques - Temporairement désactivé
// export const fetchUserStats = createAsyncThunk(
//   'auth/fetchUserStats',
//   async (_, { rejectWithValue }) => {
//     try {
//       const stats = await userService.getUserStats();
//       return stats;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message || 'Erreur lors de la récupération des statistiques');
//     }
//   }
// );

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
    stats: {
      totalLessons: 0,
      completedLessons: 0,
      totalTime: 0,
      streak: 0
    }
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
    setStats: (state, action) => {
      state.stats = action.payload;
      saveToSession(state);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de la récupération du profil';
        saveToSession(state);
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de la mise à jour du profil';
        saveToSession(state);
      })
      // Upload Avatar
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        // Mettre à jour l'avatar dans le profil utilisateur
        if (state.user && action.payload?.data?.avatar_url) {
          state.user.avatar_url = action.payload.data.avatar_url;
        }
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur lors de l\'upload de l\'avatar';
        saveToSession(state);
      });
      // Fetch User Stats - Temporairement désactivé
      // .addCase(fetchUserStats.pending, (state) => {
      //   state.error = null;
      //   saveToSession(state);
      // })
      // .addCase(fetchUserStats.fulfilled, (state, action) => {
      //   state.stats = action.payload?.data || action.payload || state.stats;
      //   state.error = null;
      //   saveToSession(state);
      // })
      // .addCase(fetchUserStats.rejected, (state, action) => {
      //   state.error = action.payload || 'Erreur lors de la récupération des statistiques';
      //   saveToSession(state);
      // });
  },
});

// Fonction utilitaire pour sauvegarder dans le sessionStorage
function saveToSession(state) {
  try {
    sessionStorage.setItem('auth', JSON.stringify(state));
  } catch (e) {}
}

export const { setUser, setLoading, setAuthenticated, logout, setError, clearError, setStats } = authSlice.actions;
export default authSlice.reducer;
