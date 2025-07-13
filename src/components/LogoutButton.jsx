import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LogoutButton = () => {
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('[LOGOUT] Début de la déconnexion');
      await logout();
      console.log('[LOGOUT] Déconnexion réussie');
      alert('Déconnexion réussie !');
    } catch (error) {
      console.error('[LOGOUT] Erreur lors de la déconnexion:', error);
      alert('Erreur lors de la déconnexion');
    }
  };

  if (!isAuthenticated) {
    return <div>Vous n'êtes pas connecté</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '5px' }}>
      <h3>Test Logout</h3>
      <p>Utilisateur connecté : {user?.email}</p>
      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default LogoutButton;
