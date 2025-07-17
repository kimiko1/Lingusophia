import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { lessonService } from '../../../services';
import { Title, Button } from '../../01-atoms';
import LessonCard from '../../02-molecules/LessonCard';
import { loadStripe } from '@stripe/stripe-js';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await lessonService.getLessonsByUser(user.id);
        setBookings(res?.data?.data?.lessons || []);
      } catch (err) {
        setError('Erreur lors du chargement de vos réservations');
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [user]);


  // Filtrage correct :
  const payableLessons = bookings.filter(
    l => l.bookingStatus === 'Confirmed' && l.paymentStatus === 'Pending'
  );
  const canceledLessons = bookings.filter(
    l => l.bookingStatus === 'Cancelled'
  );

  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const handlePay = async (lesson) => {
    const stripe = await loadStripe(stripePublicKey);

    const body = {
      products: [
        {
          name: lesson.title,
          description: lesson.description,
          price: Number(lesson.price),
          quantity: 1
        }
      ],
      bookingId: lesson.bookingId,
    };
    
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
    };

    const session = await lessonService.createPaymentIntent(body, headers);

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  };

  return (
    <div className="bookings-page">
      <Title level={1}>Mes réservations à payer</Title>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && payableLessons.length === 0 && canceledLessons.length === 0 && (
        <p>Aucune réservation à payer ou annulée.</p>
      )}
      <div className="bookings-list">
        {payableLessons.map(lesson => (
          <div key={lesson.id} style={{ marginBottom: 24 }}>
            <LessonCard
              title={lesson.title}
              description={lesson.description}
              duration={String(lesson.duration)}
              level={lesson.level}
              price={lesson.price}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontWeight: 'bold' }}>État&nbsp;: </span>
              Confirmée, en attente de paiement
              <Button style={{ marginLeft: 16 }} onClick={() => handlePay(lesson)}>
                Payer
              </Button>
            </div>
          </div>
        ))}
        {canceledLessons.length > 0 && (
          <>
            <Title level={2} style={{ marginTop: 32, fontSize: 20 }}>Réservations annulées</Title>
            {canceledLessons.map(lesson => (
              <div key={lesson.id} style={{ marginBottom: 24, opacity: 0.7 }}>
                <LessonCard
                  title={lesson.title}
                  description={lesson.description}
                  duration={String(lesson.duration)}
                  level={lesson.level}
                  price={lesson.price}
                />
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontWeight: 'bold' }}>État&nbsp;: </span>
                  Annulée
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookings;
