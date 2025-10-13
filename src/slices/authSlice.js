import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@services/authService';
import { userService } from '@services';

// ======= ASYNC THUNKS UTILISANT LES SERVICES =======

// Thunk pour la connexion
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data.user || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la connexion');
    }
  }
);

// Thunk pour la déconnexion
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      // Même en cas d'erreur côté serveur, on déconnecte côté client
      console.error('Logout error:', error);
      return true;
    }
  }
);

// Thunk pour l'inscription
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data.user || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'inscription');
    }
  }
);

// Thunk pour vérifier l'utilisateur connecté (me)
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.me();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Utilisateur non connecté');
    }
  }
);

// Thunk pour récupérer le profil utilisateur complet
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await userService.getCurrentUserProfile();
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Erreur lors de la récupération du profil');
    }
  }
);

// Thunk pour mettre à jour le profil utilisateur
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const currentUser = getState().auth.user;
      if (!currentUser?.id) {
        throw new Error('Utilisateur non connecté');
      }
      
      // Nettoyer les données avant envoi
      const cleanedData = { ...profileData };
      
      // Supprimer avatarUrl si elle est vide ou invalide
      if (!cleanedData.avatarUrl || cleanedData.avatarUrl.trim() === '') {
        delete cleanedData.avatarUrl;
      } else {
        // Vérifier que c'est une URL valide
        try {
          new URL(cleanedData.avatarUrl);
        } catch {
          // Si ce n'est pas une URL valide, la supprimer
          delete cleanedData.avatarUrl;
        }
      }
      
      const updatedUser = await userService.updateUserProfile(currentUser.id, cleanedData);
      // Fusionner avec les données actuelles et les nouvelles données envoyées
      return { 
        ...currentUser, 
        ...cleanedData,
        ...(updatedUser || {})
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du profil');
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
      return rejectWithValue(error.response?.data?.message || error.message || 'Erreur lors de l\'upload de l\'avatar');
    }
  }
);

// Thunk pour récupérer les statistiques
export const fetchUserStats = createAsyncThunk(
  'auth/fetchUserStats',
  async (userId, { rejectWithValue }) => {
    try {
      const stats = await userService.getUserStats(userId);
      return stats.data?.stats || stats.stats || stats.data || stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques');
    }
  }
);

// ======= ÉTAT INITIAL =======

const getInitialState = () => {
  try {
    const saved = sessionStorage.getItem('auth');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load auth state from sessionStorage', e);
  }
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

// ======= SLICE =======

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Actions synchrones
    setUser: (state, action) => {
      state.user = action.payload.user ? action.payload.user : action.payload;
      state.isAuthenticated = !!state.user;
      state.error = null;
      saveToSession(state);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      saveToSession(state);
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.user = null;
      }
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
      state.stats = { ...state.stats, ...action.payload };
      saveToSession(state);
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.stats = {
        totalLessons: 0,
        completedLessons: 0,
        totalTime: 0,
        streak: 0
      };
      saveToSession(state);
    },
  },
  extraReducers: (builder) => {
    builder
      // === LOGIN ===
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        saveToSession(state);
      })

      // === REGISTER ===
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        saveToSession(state);
      })

      // === CHECK AUTH ===
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        // Ne pas afficher l'erreur pour checkAuth (normal si pas connecté)
        saveToSession(state);
      })

      // === FETCH PROFILE ===
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
        state.error = action.payload;
        saveToSession(state);
      })

      // === UPDATE PROFILE ===
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveToSession(state);
      })

      // === UPLOAD AVATAR ===
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToSession(state);
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        // Mettre à jour l'avatar dans le profil utilisateur
        if (state.user && action.payload?.data?.avatar_url) {
          // Normaliser vers avatarUrl (camelCase) pour cohérence avec le reste du code
          state.user.avatarUrl = action.payload.data.avatar_url;
        } else if (state.user && action.payload?.avatar_url) {
          // Support du format direct aussi
          state.user.avatarUrl = action.payload.avatar_url;
        }
        state.isLoading = false;
        state.error = null;
        saveToSession(state);
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveToSession(state);
      })

      // === FETCH STATS ===
      .addCase(fetchUserStats.pending, (state) => {
        // Pas de loading pour les stats
        state.error = null;
        saveToSession(state);
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload || state.stats;
        state.error = null;
        saveToSession(state);
      })
      .addCase(fetchUserStats.rejected, (state) => {
        // Ne pas afficher l'erreur pour les stats (optionnelles)
        saveToSession(state);
      })

      // === LOGOUT ===
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        saveToSession(state);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.stats = {
          totalLessons: 0,
          completedLessons: 0,
          totalTime: 0,
          streak: 0
        };
        saveToSession(state);
      })
      .addCase(logoutUser.rejected, (state) => {
        // Même en cas d'erreur, on déconnecte côté client
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        saveToSession(state);
      });
  },
});

// ======= FONCTION UTILITAIRE =======

function saveToSession(state) {
  try {
    sessionStorage.setItem('auth', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save auth state to sessionStorage', e);
  }
}

// ======= EXPORTS =======

export const {
  setUser,
  setLoading,
  setAuthenticated,
  setError,
  clearError,
  setStats,
  resetAuth
} = authSlice.actions;

export default authSlice.reducer;
