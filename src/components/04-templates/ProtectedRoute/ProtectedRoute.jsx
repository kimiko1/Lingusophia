import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute - Composant pour protéger les routes nécessitant une authentification
 */
const ProtectedRoute = React.memo(({ children, requiredRole = null }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const isLoading = useSelector(state => state.auth.isLoading);
  const location = useLocation();
  // Avoid crash if user is null
  if (user && user.role) {
  }

  // Afficher le loader uniquement pendant le chargement
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle spécifique est requis, vérifier si l'utilisateur l'a
  if (requiredRole) {
    const userRole = user?.role;
    if (Array.isArray(requiredRole)) {
      // Tableau de rôles autorisés
      const allowed = requiredRole.map(r => r.toLowerCase());
      if (!allowed.includes(userRole?.toLowerCase())) {
        return <Navigate to="/" replace />;
      }
    } else {
      // Chaîne simple
      if (userRole?.toLowerCase() !== requiredRole?.toLowerCase()) {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
});

export default ProtectedRoute;
