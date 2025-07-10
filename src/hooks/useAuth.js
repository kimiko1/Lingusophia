import { useDispatch, useSelector } from 'react-redux';
import { login, register, logout, checkAuth, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(state => state.auth);

  const handleLogin = async (credentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleRegister = async (userData) => {
    try {
      await dispatch(register(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleCheckAuth = async () => {
    try {
      await dispatch(checkAuth()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuth: handleCheckAuth,
    clearError: clearAuthError,
  };
};
