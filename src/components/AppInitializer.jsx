import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@slices/authSlice';

/**
 * Composant qui initialise l'application en vérifiant l'authentification
 */
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector(state => state.auth);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Vérifier l'authentification au démarrage une seule fois
    if (!hasCheckedAuth.current && !isAuthenticated && !isLoading && !user) {
      hasCheckedAuth.current = true;
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, isLoading, user]);

  return children;
};

export default AppInitializer;