import React, { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Logout.scss';

const Logout = () => {
  const { logout, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    setStatus('loading');
    try {
      await logout();
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="logout-page">
        <div className="logout-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
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
            <p>Redirection vers la page de connexion...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="logout-page">
      <div className="logout-container">
        <h1>Déconnexion</h1>
        <div className="user-info">
          <div className="user-avatar">
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : '👤'}
          </div>
          <div className="user-details">
            <strong>{user?.firstName} {user?.lastName}</strong>
            <div>{user?.email}</div>
          </div>
        </div>
        <div className="logout-content">
          <p>Voulez-vous vraiment vous déconnecter ?</p>
          <div className="logout-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={status === 'loading' || status === 'success'}
            >
              Annuler
            </button>
            <button
              className="btn btn-danger"
              onClick={handleLogout}
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <>
                  <span className="loading-spinner small"></span> Déconnexion...
                </>
              ) : (
                'Se déconnecter'
              )}
            </button>
          </div>
          {status === 'success' && (
            <div className="logout-message success">
              Déconnexion réussie ! Redirection...
            </div>
          )}
          {status === 'error' && (
            <div className="logout-message error">
              Erreur lors de la déconnexion. Veuillez réessayer.
            </div>
          )}
        </div>
        <div className="logout-footer">
          <small>Merci d'avoir utilisé Yourpersonaltutor !</small>
        </div>
      </div>
    </div>
  );
};

export default Logout;
