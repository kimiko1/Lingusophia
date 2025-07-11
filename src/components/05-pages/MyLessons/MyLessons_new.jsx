import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Title, Card } from '../../01-atoms';
import { lessonService } from '../../../services';
import './MyLessons.scss';

/**
 * MyLessons component - Displays user's completed and ongoing lessons
 * @param {Object} props - Component props
 */
const MyLessons = () => {
  const { t } = useTranslation('pages');
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [completedLessons, setCompletedLessons] = useState([]);
  const [ongoingLessons, setOngoingLessons] = useState([]);

  // Charger les leçons au montage du composant
  useEffect(() => {
    if (user?.id) {
      loadLessons();
    }
  }, [user?.id]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const [completed, ongoing] = await Promise.all([
        lessonService.getCompletedLessons(user.id),
        lessonService.getOngoingLessons(user.id)
      ]);
      setCompletedLessons(completed);
      setOngoingLessons(ongoing);
    } catch (err) {
      setError('Erreur lors du chargement des leçons');
      console.error('Erreur lors du chargement des leçons:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Easy':
        return 'green';
      case 'Medium':
        return 'orange';
      case 'Hard':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'green';
    if (grade.includes('B')) return 'orange';
    if (grade.includes('C')) return 'red';
    return 'gray';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'green';
    if (progress >= 60) return 'orange';
    return 'red';
  };

  if (loading) {
    return (
      <div className="my-lessons">
        <div className="loading">
          <p>{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-lessons">
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-lessons">
      <div className="my-lessons__container">
        <Title level={1} className="my-lessons__title">
          {t('lessons.title')}
        </Title>
        
        {/* Leçons terminées */}
        <section className="my-lessons__section">
          <Title level={2} className="my-lessons__section-title">
            {t('lessons.completedLessons')} ({completedLessons.length})
          </Title>
          
          {completedLessons.length === 0 ? (
            <Card className="my-lessons__empty">
              <p>{t('lessons.noCompletedLessons')}</p>
            </Card>
          ) : (
            <div className="my-lessons__grid">
              {completedLessons.map((lesson) => (
                <Card key={lesson.id} className="my-lessons__card">
                  <div className="my-lessons__card-header">
                    <h3 className="my-lessons__card-title">{lesson.title}</h3>
                    <span className={`my-lessons__category my-lessons__category--${getCategoryColor(lesson.category)}`}>
                      {lesson.category}
                    </span>
                  </div>
                  
                  <div className="my-lessons__card-content">
                    <div className="my-lessons__card-info">
                      <div className="my-lessons__info-item">
                        <span className="my-lessons__info-label">{t('lessons.language')}:</span>
                        <span className="my-lessons__info-value">{lesson.language}</span>
                      </div>
                      <div className="my-lessons__info-item">
                        <span className="my-lessons__info-label">{t('lessons.level')}:</span>
                        <span className="my-lessons__info-value">{lesson.level}</span>
                      </div>
                      <div className="my-lessons__info-item">
                        <span className="my-lessons__info-label">{t('lessons.teacher')}:</span>
                        <span className="my-lessons__info-value">{lesson.teacher}</span>
                      </div>
                      <div className="my-lessons__info-item">
                        <span className="my-lessons__info-label">{t('lessons.completedDate')}:</span>
                        <span className="my-lessons__info-value">{new Date(lesson.completedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="my-lessons__card-footer">
                      <div className="my-lessons__progress">
                        <div className="my-lessons__progress-bar">
                          <div 
                            className={`my-lessons__progress-fill my-lessons__progress-fill--${getProgressColor(lesson.progress)}`}
                            style={{ width: `${lesson.progress}%` }}
                          ></div>
                        </div>
                        <span className="my-lessons__progress-text">{lesson.progress}%</span>
                      </div>
                      <span className={`my-lessons__grade my-lessons__grade--${getGradeColor(lesson.grade)}`}>
                        {lesson.grade}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Leçons en cours */}
        <section className="my-lessons__section">
          <Title level={2} className="my-lessons__section-title">
            {t('lessons.ongoingLessons')} ({ongoingLessons.length})
          </Title>
          
          {ongoingLessons.length === 0 ? (
            <Card className="my-lessons__empty">
              <p>{t('lessons.noOngoingLessons')}</p>
            </Card>
          ) : (
            <div className="my-lessons__grid">
              {ongoingLessons.map((lesson) => (
                <Card key={lesson.id} className="my-lessons__card">
                  <div className="my-lessons__card-header">
                    <h3 className="my-lessons__card-title">{lesson.title}</h3>
                    <span className={`my-lessons__category my-lessons__category--${getCategoryColor(lesson.category)}`}>
                      {lesson.category}
                    </span>
                  </div>
                  
                  <div className="my-lessons__card-content">
                    <div className="my-lessons__card-info">
                      <div className="my-lessons__info-item">
                        <span className="my-lessons__info-label">{t('lessons.language')}:</span>
                        <span className="my-lessons__info-value">{lesson.language}</span>
                      </div>
                      <div className="my-lessons__info-item">
                        <span className="my-lessons__info-label">{t('lessons.level')}:</span>
                        <span className="my-lessons__info-value">{lesson.level}</span>
                      </div>
                      <div className="my-lessons__info-item">
                        <span className="my-lessons__info-label">{t('lessons.teacher')}:</span>
                        <span className="my-lessons__info-value">{lesson.teacher}</span>
                      </div>
                      <div className="my-lessons__info-item">
                        <span className="my-lessons__info-label">{t('lessons.startDate')}:</span>
                        <span className="my-lessons__info-value">{new Date(lesson.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="my-lessons__card-footer">
                      <div className="my-lessons__progress">
                        <div className="my-lessons__progress-bar">
                          <div 
                            className={`my-lessons__progress-fill my-lessons__progress-fill--${getProgressColor(lesson.progress)}`}
                            style={{ width: `${lesson.progress}%` }}
                          ></div>
                        </div>
                        <span className="my-lessons__progress-text">{lesson.progress}%</span>
                      </div>
                      <span className="my-lessons__status">
                        {t('lessons.inProgress')}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Statistiques */}
        <section className="my-lessons__section">
          <Title level={2} className="my-lessons__section-title">
            {t('lessons.stats.title')}
          </Title>
          
          <div className="my-lessons__stats">
            <Card className="stat-card">
              <div className="stat-number">
                {completedLessons.length}
              </div>
              <div className="stat-label">{t('lessons.stats.lessonsCompleted')}</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-number">
                {ongoingLessons.length}
              </div>
              <div className="stat-label">{t('lessons.stats.lessonsInProgress')}</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-number">
                {[...new Set(completedLessons.map(l => l.language))].length}
              </div>
              <div className="stat-label">{t('lessons.stats.languagesStudied')}</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-number">
                {completedLessons.length > 0 ? Math.round(
                  completedLessons.reduce((sum, lesson) => sum + lesson.progress, 0) / 
                  completedLessons.length
                ) : 0}%
              </div>
              <div className="stat-label">{t('lessons.stats.averageScore')}</div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyLessons;
