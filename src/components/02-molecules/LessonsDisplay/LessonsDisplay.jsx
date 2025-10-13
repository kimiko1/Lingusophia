import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@atoms';
import LessonCard from '../LessonCard';
import './LessonsDisplay.scss';
import { setLessons, setLoading, setError, clearError } from '@slices/lessonsSlice';
import { lessonService } from '@services';

const LessonsDisplay = () => {
  const dispatch = useDispatch();
  const lessons = useSelector(state => state.lessons.lessons);
  const isLoading = useSelector(state => state.lessons.isLoading);
  const error = useSelector(state => state.lessons.error);

  const fetchLessons = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await lessonService.getLessons();
      dispatch(setLessons(response));
    } catch (err) {
      dispatch(setError(err.message || 'Erreur lors du chargement des leçons'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line
  }, []);

  const handleRefresh = () => {
    dispatch(clearError());
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
        <div className="lessons-list">
          {lessons.map(lesson => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonsDisplay;
