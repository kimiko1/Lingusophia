import React, { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Logout.scss';

const Logout = () => {
  const { logout, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutMessage('Déconnexion en cours...');

    try {
      await logout();
      setLogoutMessage('Déconnexion réussie ! Redirection...');
      
      // Rediriger vers la page de connexion après un délai
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('[LOGOUT PAGE] Erreur lors de la déconnexion:', error);
      setLogoutMessage('Erreur lors de la déconnexion. Veuillez réessayer.');
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Retour à la page précédente
  };

  if (isLoading) {
    return (
      <div className="logout-page">
        <div className="logout-container">
          <div className="loading-spinner"></div>
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="logout-page">
        <div className="logout-container">
          <div className="logout-message error">
            <h2>Non connecté</h2>
            <p>Vous n'êtes pas connecté. Redirection vers la page de connexion...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="logout-page">
      <div className="logout-container">
        <div className="logout-header">
          <h1>Déconnexion</h1>
          <div className="user-info">
            <div className="user-avatar">
              {user?.firstName ? user.firstName.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="user-details">
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>

        {logoutMessage && (
          <div className={`logout-message ${isLoggingOut ? 'info' : 'success'}`}>
            {isLoggingOut && <div className="loading-spinner small"></div>}
            <p>{logoutMessage}</p>
          </div>
        )}

        <div className="logout-content">
          <div className="logout-confirmation">
            <h2>Êtes-vous sûr de vouloir vous déconnecter ?</h2>
            <p>Vous devrez vous reconnecter pour accéder à votre compte.</p>
          </div>

          <div className="logout-actions">
            <button 
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={isLoggingOut}
            >
              Annuler
            </button>
            <button 
              onClick={handleLogout}
              className="btn btn-danger"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <div className="loading-spinner small"></div>
                  Déconnexion...
                </>
              ) : (
                'Se déconnecter'
              )}
            </button>
          </div>
        </div>

        <div className="logout-footer">
          <p>Merci d'avoir utilisé Yourpersonaltutor !</p>
        </div>
      </div>
    </div>
  );
};

export default Logout;
