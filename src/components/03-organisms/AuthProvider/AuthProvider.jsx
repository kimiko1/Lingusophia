import { useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { AuthForm } from '@molecules';

const AuthProvider = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    // Vérifier l'authentification au montage du composant
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <AuthForm />
      </div>
    );
  }

  return children;
};

export default AuthProvider;
