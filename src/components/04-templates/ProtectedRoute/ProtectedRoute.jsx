import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * ProtectedRoute - Composant pour protéger les routes nécessitant une authentification
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, le rediriger vers la page de connexion
  if (!isAuthenticated) {
    console.log('[PROTECTED ROUTE] ❌ User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle spécifique est requis, vérifier si l'utilisateur l'a
  if (requiredRole && user?.role?.toLowerCase() !== requiredRole?.toLowerCase()) {
    console.log('[PROTECTED ROUTE] ❌ Access denied. Required role:', requiredRole, 'User role:', user?.role);
    return <Navigate to="/" replace />;
  }

  console.log('[PROTECTED ROUTE] ✅ Access granted');
  return children;
};

export default ProtectedRoute;
