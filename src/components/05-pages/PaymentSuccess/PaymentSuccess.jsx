import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Button } from '@atoms';
import './PaymentSuccess.scss';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirection après 5 secondes
    const timer = setTimeout(() => {
      navigate('/bookings');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-success">
      <div className="payment-success__container">
        <div className="payment-success__icon">
          ✅
        </div>
        <Title level={1} className="payment-success__title">
          Paiement réussi !
        </Title>
        <p className="payment-success__message">
          Votre paiement a été traité avec succès. Vous allez être redirigé vers vos réservations.
        </p>
        <div className="payment-success__actions">
          <Button 
            variant="primary" 
            onClick={() => navigate('/bookings')}
            className="payment-success__button"
          >
            Voir mes réservations
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
            className="payment-success__button"
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;