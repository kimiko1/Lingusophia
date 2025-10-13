import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Title } from '@atoms';
import LessonCard from '@molecules/LessonCard';
import './MyLessons.scss';
import { setLessons, setLoading, setError } from '@slices/lessonsSlice';
import { lessonService } from '@services/lessonService';

const MyLessons = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const lessons = useSelector(state => state.lessons.lessons);
  const loading = useSelector(state => state.lessons.isLoading);
  const error = useSelector(state => state.lessons.error);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user?.id) return;
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const res = await lessonService.getLessonsByUser(user.id);
        dispatch(setLessons(res?.data?.data?.lessons || []));
      } catch (err) {
        dispatch(setError(`Erreur lors du chargement de vos leçons (${err.message})`));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchLessons();
  }, [user, dispatch]);

  return (
    <div className="my-lessons-page">
      <Title level={1}>Mes leçons réservées</Title>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && lessons.length === 0 && <p>Vous n'avez réservé aucune leçon.</p>}
      <div className="my-lessons-list">
        {lessons
          .filter(lesson => lesson.bookingStatus === 'Confirmed' && lesson.paymentStatus === 'Paid')
          .map(lesson => (
            <div key={lesson.id} style={{ marginBottom: 24 }}>
              <LessonCard
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                level={lesson.level}
                price={lesson.price}
              />
              <div style={{ marginTop: 8, color: 'white' }}>
                <span style={{ fontWeight: 'bold' }}>État&nbsp;: </span>Confirmée et payée
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyLessons;