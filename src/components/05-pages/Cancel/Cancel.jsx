import { Title, Button } from '@atoms';
import { useNavigate } from 'react-router-dom';
import './Cancel.scss';

const Cancel = () => {
  const navigate = useNavigate();
  return (
    <div className="payment-cancel-page">
      <div className="cancel-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
          alt="Annulé"
          className="cancel-illustration"
          loading="lazy"
        />
        <Title level={1}>Paiement annulé</Title>
        <p className="cancel-message">Votre paiement a été annulé. Vous pouvez réessayer à tout moment depuis vos réservations.</p>
        <Button onClick={() => navigate('/bookings')} className="cancel-btn">
          Retour à mes réservations
        </Button>
      </div>
    </div>
  );
};

export default Cancel;
