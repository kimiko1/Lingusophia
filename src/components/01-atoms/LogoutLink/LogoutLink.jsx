import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const LogoutLink = ({ className = "", style = {} }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLogoutClick = () => {
    navigate('/logout');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button 
      onClick={handleLogoutClick}
      className={`logout-link ${className}`}
      style={{
        background: 'none',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease',
        ...style
      }}
    >
      Se déconnecter
    </button>
  );
};

export default LogoutLink;
