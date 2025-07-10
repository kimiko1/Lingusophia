import { useEffect } from 'react';
import { useLessons } from '../../../hooks';
import { Card, Button } from '../../01-atoms';
import LessonCard from '../LessonCard';
import './LessonsDisplay.scss';

const LessonsDisplay = () => {
  const { 
    lessons, 
    isLoading, 
    error, 
    fetchLessons, 
    clearError 
  } = useLessons();

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleRefresh = () => {
    clearError();
    fetchLessons();
  };

  if (isLoading) {
    return (
      <div className="lessons-display">
        <div className="loading-message">
          Chargement des leçons...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lessons-display">
        <div className="error-message">
          <p>Erreur lors du chargement des leçons:</p>
          <p>{typeof error === 'string' ? error : error.message || 'Erreur inconnue'}</p>
          <Button onClick={handleRefresh}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-display">
      <div className="lessons-header">
        <h2>Leçons disponibles</h2>
        <Button onClick={handleRefresh}>
          Actualiser
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="no-lessons">
          <p>Aucune leçon disponible pour le moment.</p>
        </div>
      ) : (
        <div className="lessons-grid">
          {lessons.map((lesson) => (
            <LessonCard 
              key={lesson.id}
              title={lesson.title}
              description={lesson.description}
              duration={lesson.duration ? `${lesson.duration}min` : undefined}
              level={lesson.level}
              image={lesson.image}
              isCompleted={lesson.isCompleted}
              onClick={() => console.log('Lesson clicked:', lesson.id)}
              variant="default"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonsDisplay;
