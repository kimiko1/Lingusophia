import { createContext, useEffect, useContext, useState } from "react";
import { authService } from "../services";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const userData = await authService.me();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("[AUTH] Erreur vérification auth:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message || "Erreur de connexion");
    } catch (error) {
      console.error("Erreur login:", error);
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

      throw new Error(response.message || "Erreur d'inscription");
    } catch (error) {
      console.error("Erreur register:", error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      // Accepte le succès si success true OU message de succès
      if (
        (response.success && response.user) ||
        response.message === "Profil mis à jour avec succès"
      ) {
        // Recharge le profil utilisateur après update si possible
        await checkAuth();
        return response;
      }
      throw new Error(response.message || "Erreur de mise à jour du profil");
    } catch (error) {
      console.error("Erreur update profile:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout({ credentials: "include" });
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Erreur logout:", error);
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
