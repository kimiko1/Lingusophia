import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked]);

  const checkAuth = async () => {
    // Éviter les appels multiples
    if (authChecked) {
      console.log('[AUTH] Authentification déjà vérifiée');
      return;
    }
    
    try {
      console.log('[AUTH] Début de la vérification d\'authentification');
      setIsLoading(true);
      setAuthChecked(true);
      
      const userData = await authService.me();
      console.log('[AUTH] Données utilisateur reçues:', userData);
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        console.log('[AUTH] Utilisateur authentifié avec succès');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('[AUTH] Aucun utilisateur authentifié');
      }
    } catch (error) {
      console.error('[AUTH] Erreur vérification auth:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      console.log('[AUTH] Fin de la vérification d\'authentification');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setAuthChecked(true);
        return response;
      }
      
      throw new Error(response.message || 'Erreur de connexion');
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
      
      throw new Error(response.message || 'Erreur d\'inscription');
    } catch (error) {
      console.error('Erreur register:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      
      if (response.success && response.user) {
        setUser(response.user);
        return response;
      }
      
      throw new Error(response.message || 'Erreur de mise à jour du profil');
    } catch (error) {
      console.error('Erreur update profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(false); // Permettre une nouvelle vérification après déconnexion
    } catch (error) {
      console.error('Erreur logout:', error);
      // Déconnexion forcée même en cas d'erreur
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
