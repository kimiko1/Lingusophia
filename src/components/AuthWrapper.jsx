import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../store/slices/authSlice';

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Vérifier l'authentification au démarrage de l'application
    console.log('[AUTH WRAPPER] Vérification de l\'authentification au démarrage...');
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
};

export default AuthWrapper;
