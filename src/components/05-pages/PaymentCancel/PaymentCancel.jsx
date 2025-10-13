import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Button } from '@atoms';
import './PaymentCancel.scss';

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirection après 10 secondes
    const timer = setTimeout(() => {
      navigate('/bookings');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-cancel">
      <div className="payment-cancel__container">
        <div className="payment-cancel__icon">
          ❌
        </div>
        <Title level={1} className="payment-cancel__title">
          Paiement annulé
        </Title>
        <p className="payment-cancel__message">
          Votre paiement a été annulé. Aucun montant n'a été débité. 
          Vous pouvez réessayer à tout moment.
        </p>
        <div className="payment-cancel__actions">
          <Button 
            variant="primary" 
            onClick={() => navigate('/bookings')}
            className="payment-cancel__button"
          >
            Réessayer le paiement
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
            className="payment-cancel__button"
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;