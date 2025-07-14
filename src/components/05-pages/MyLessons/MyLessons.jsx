import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { lessonService } from '../../../services';
import { Title, Button } from '../../01-atoms';
import LessonCard from '../../02-molecules/LessonCard';

const MyLessons = () => {
  const { user } = useAuth();
  const [myLessons, setMyLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchLessons = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await lessonService.getLessonsByUser(user.id);
      // Correction ici :
      setMyLessons(res?.data?.data?.lessons || []);
    } catch (err) {
      setError('Erreur lors du chargement de vos leçons');
    } finally {
      setLoading(false);
    }
  };
  fetchLessons();
}, [user]); 

  return (
    <div className="my-lessons-page">
      <Title level={1}>Mes leçons réservées</Title>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && myLessons.length === 0 && <p>Vous n'avez réservé aucune leçon.</p>}
      <div className="my-lessons-list">
        {myLessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            title={lesson.title}
            description={lesson.description}
            duration={lesson.duration}
            level={lesson.level}
            price={lesson.price}
            // Ajoute d'autres props si besoin
          />
        ))}
      </div>
    </div>
  );
};

export default MyLessons;