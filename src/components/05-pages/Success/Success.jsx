import React from 'react';
import { Title, Button } from '@atoms';
import { useNavigate } from 'react-router-dom';
import './Success.scss';

const Success = () => {
  const navigate = useNavigate();
  return (
    <div className="payment-success-page">
      <div className="success-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Succès"
          className="success-illustration"
          loading="lazy"
        />
        <Title level={1}>Paiement réussi !</Title>
        <p className="success-message">Merci pour votre paiement. Votre réservation est confirmée.</p>
        <Button onClick={() => navigate('/my-lessons')} className="success-btn">
          Voir mes leçons
        </Button>
      </div>
    </div>
  );
};

export default Success;
