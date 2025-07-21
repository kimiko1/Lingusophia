import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext';

/**
 * ProtectedRoute - Composant pour protéger les routes nécessitant une authentification
 */

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated, 'user:', user);
  const location = useLocation();

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

  console.log('[ProtectedRoute] rendu des children');
  return children;
};

export default ProtectedRoute;
