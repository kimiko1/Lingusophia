import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { Button, Card, Title, Input } from '@atoms';
import { PageLayout } from '@templates';
import { teacherService, bookingService, lessonService } from '@services';
import './ScheduleLesson.scss';

/**
 * ScheduleLesson - Page de planification d'une leçon
 */
const ScheduleLesson = () => {
  const { t } = useTranslation('pages');
  const { user } = useAuth();
  const location = useLocation();
  
  // Récupérer les données pré-sélectionnées depuis la navigation
  const preSelectedLesson = location.state?.selectedLesson;
  const preSelectedTeacher = location.state?.selectedTeacher;
  
  const [selectedLesson, setSelectedLesson] = useState(preSelectedLesson || null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(preSelectedTeacher || null);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAvailableTeachers = useCallback(async () => {
    try {
      const teachers = await teacherService.getAvailableTeachers();
      setAvailableTeachers(teachers);
    } catch (err) {
      setError('Erreur lors du chargement des professeurs');
      console.error('Erreur lors du chargement des professeurs:', err);
    }
  }, []);

  const loadAvailableLessons = useCallback(async () => {
    try {
      const lessons = await lessonService.getLessons();
      setAvailableLessons(lessons);
    } catch (err) {
      setError('Erreur lors du chargement des leçons');
      console.error('Erreur lors du chargement des leçons:', err);
    }
  }, []);

  const loadAvailableSlots = useCallback(async () => {
    if (selectedTeacher && selectedDate) {
      try {
        const slots = await teacherService.getAvailableSlots(selectedTeacher.id, selectedDate);
        setAvailableSlots(slots);
      } catch (err) {
        setError('Erreur lors du chargement des créneaux');
        console.error('Erreur lors du chargement des créneaux:', err);
      }
    }
  }, [selectedTeacher, selectedDate]);

  // Charger les leçons et professeurs disponibles
  useEffect(() => {
    loadAvailableLessons();
    loadAvailableTeachers();
  }, [loadAvailableLessons, loadAvailableTeachers]);

  // Charger les créneaux disponibles quand la date ou le professeur change
  useEffect(() => {
    loadAvailableSlots();
  }, [loadAvailableSlots]);


  const handleScheduleLesson = async () => {
    if (!selectedLesson || !selectedDate || !selectedTime || !selectedTeacher) {
      alert('Veuillez sélectionner une leçon, une date, une heure et un professeur');
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        userId: user.id,
        lessonId: selectedLesson.id,
        teacherId: selectedTeacher.id,
        date: selectedDate,
        time: selectedTime,
        studentId: user.id
      };

      await bookingService.createBooking(bookingData);
      alert(t('scheduleLesson.success'));
      
      // Réinitialiser le formulaire
      setSelectedLesson(null);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedTeacher(null);
    } catch (err) {
      setError('Erreur lors de la planification de la leçon');
      console.error('Erreur lors de la planification:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title={t('scheduleLesson.title')} subtitle={t('scheduleLesson.subtitle')}>
        <div className="schedule-lesson">
          <div className="loading">
            <p>{t('common:loading')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('scheduleLesson.title')} subtitle={t('scheduleLesson.subtitle')}>
      <div className="schedule-lesson">
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Sélection de la leçon */}
        <Card className="schedule-lesson__section">
          <Title level={2} size="lg" className="schedule-lesson__section-title">
            Sélectionnez une leçon
          </Title>
          <div className="schedule-lesson__lessons">
            {availableLessons.length === 0 ? (
              <p>Aucune leçon disponible</p>
            ) : (
              availableLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`schedule-lesson__lesson ${
                    selectedLesson?.id === lesson.id ? 'schedule-lesson__lesson--selected' : ''
                  }`}
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="schedule-lesson__lesson-info">
                    <h3 className="schedule-lesson__lesson-title">{lesson.title}</h3>
                    <p className="schedule-lesson__lesson-description">{lesson.description}</p>
                    <div className="schedule-lesson__lesson-details">
                      <span className="schedule-lesson__lesson-level">
                        Niveau: {lesson.level}
                      </span>
                      <span className="schedule-lesson__lesson-duration">
                        {lesson.duration} min
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        {/* Sélection de la date */}
        {selectedLesson && (
          <Card className="schedule-lesson__section">
            <Title level={2} size="lg" className="schedule-lesson__section-title">
              {t('scheduleLesson.selectDate')}
            </Title>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="schedule-lesson__date-input"
            />
          </Card>
        )}

        {/* Sélection du professeur */}
        {selectedLesson && selectedDate && (
          <Card className="schedule-lesson__section">
            <Title level={2} size="lg" className="schedule-lesson__section-title">
              {t('scheduleLesson.selectTeacher')}
            </Title>
          <div className="schedule-lesson__teachers">
            {availableTeachers.length === 0 ? (
              <p>{t('scheduleLesson.noTeachersAvailable')}</p>
            ) : (
              availableTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className={`schedule-lesson__teacher ${
                    selectedTeacher?.id === teacher.id ? 'schedule-lesson__teacher--selected' : ''
                  }`}
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <div className="schedule-lesson__teacher-info">
                    <h3 className="schedule-lesson__teacher-name">{teacher.name}</h3>
                    <p className="schedule-lesson__teacher-specialty">{teacher.specialty}</p>
                    <div className="schedule-lesson__teacher-details">
                      <span className="schedule-lesson__teacher-rating">
                        ⭐ {teacher.rating}
                      </span>
                      <span className="schedule-lesson__teacher-price">
                        {teacher.price}€/h
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
        )}

        {/* Sélection de l'heure */}
        {selectedTeacher && selectedDate && selectedLesson && (
          <Card className="schedule-lesson__section">
            <Title level={2} size="lg" className="schedule-lesson__section-title">
              {t('scheduleLesson.selectTime')}
            </Title>
            <div className="schedule-lesson__time-slots">
              {availableSlots.length === 0 ? (
                <p>{t('scheduleLesson.noSlotsAvailable')}</p>
              ) : (
                availableSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`schedule-lesson__time-slot ${
                      selectedTime === slot ? 'schedule-lesson__time-slot--selected' : ''
                    }`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Résumé et confirmation */}
        {selectedLesson && selectedDate && selectedTime && selectedTeacher && (
          <Card className="schedule-lesson__summary">
            <Title level={2} size="lg" className="schedule-lesson__section-title">
              {t('scheduleLesson.summary')}
            </Title>
            <div className="schedule-lesson__summary-content">
              <p><strong>Leçon:</strong> {selectedLesson.title}</p>
              <p><strong>Durée:</strong> {selectedLesson.duration} min</p>
              <p><strong>{t('scheduleLesson.date')}:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
              <p><strong>{t('scheduleLesson.time')}:</strong> {selectedTime}</p>
              <p><strong>{t('scheduleLesson.teacher')}:</strong> {selectedTeacher.name}</p>
              <p><strong>{t('scheduleLesson.specialty')}:</strong> {selectedTeacher.specialty}</p>
              <p><strong>{t('scheduleLesson.price')}:</strong> {selectedTeacher.price}€</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleScheduleLesson}
              disabled={loading}
              className="schedule-lesson__confirm-button"
            >
              {loading ? t('common:loading') : t('scheduleLesson.confirmBooking')}
            </Button>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default ScheduleLesson;
