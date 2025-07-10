import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute - Composant pour protéger les routes nécessitant une authentification
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();

  // Debug logs détaillés
  console.log('[PROTECTED ROUTE] ======================');
  console.log('[PROTECTED ROUTE] Current path:', location.pathname);
  console.log('[PROTECTED ROUTE] Is authenticated:', isAuthenticated);
  console.log('[PROTECTED ROUTE] User object:', user);
  console.log('[PROTECTED ROUTE] User role (raw):', user?.role);
  console.log('[PROTECTED ROUTE] Required role:', requiredRole);
  console.log('[PROTECTED ROUTE] Role match (exact):', user?.role === requiredRole);
  console.log('[PROTECTED ROUTE] Role match (case insensitive):', user?.role?.toLowerCase() === requiredRole?.toLowerCase());
  console.log('[PROTECTED ROUTE] ======================');

  // Si l'utilisateur n'est pas authentifié, le rediriger vers la page de connexion
  if (!isAuthenticated) {
    console.log('[PROTECTED ROUTE] ❌ User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle spécifique est requis, vérifier si l'utilisateur l'a (insensible à la casse)
  if (requiredRole && user?.role?.toLowerCase() !== requiredRole?.toLowerCase()) {
    console.log('[PROTECTED ROUTE] ❌ Access denied. Required role:', requiredRole, 'User role:', user?.role);
    return <Navigate to="/" replace />;
  }

  console.log('[PROTECTED ROUTE] ✅ Access granted');
  return children;
};

export default ProtectedRoute;
