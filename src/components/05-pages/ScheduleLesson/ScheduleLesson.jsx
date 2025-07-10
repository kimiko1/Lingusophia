import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Title, Input } from '../../01-atoms';
import { LessonCard, CategoryCard } from '../../02-molecules';
import { PageLayout } from '../../04-templates';
import './ScheduleLesson.scss';

/**
 * ScheduleLesson - Page de planification d'une leçon
 */
const ScheduleLesson = () => {
  const { t } = useTranslation('pages');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const availableTeachers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialty: 'English Conversation',
      rating: 4.9,
      price: 25,
      image: '/api/placeholder/150/150'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      specialty: 'Spanish Grammar',
      rating: 4.8,
      price: 22,
      image: '/api/placeholder/150/150'
    },
    {
      id: 3,
      name: 'Pierre Dubois',
      specialty: 'French Literature',
      rating: 4.7,
      price: 28,
      image: '/api/placeholder/150/150'
    }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleScheduleLesson = () => {
    if (selectedDate && selectedTime && selectedTeacher) {
      alert(t('scheduleLesson.lessonScheduled', { 
        teacher: selectedTeacher.name, 
        date: selectedDate, 
        time: selectedTime 
      }));
    }
  };

  return (
    <PageLayout 
      title={t('scheduleLesson.title')}
      subtitle={t('scheduleLesson.subtitle')}
    >
      <div className="schedule-lesson">
        {/* Section de sélection de date */}
        <Card className="schedule-lesson__date-section">
          <Title level={2} size="lg" className="schedule-lesson__section-title">
            {t('scheduleLesson.selectDate')}
          </Title>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="schedule-lesson__date-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </Card>

        {/* Section de sélection d'heure */}
        <Card className="schedule-lesson__time-section">
          <Title level={2} size="lg" className="schedule-lesson__section-title">
            {t('scheduleLesson.availableSlots')}
          </Title>
          <div className="schedule-lesson__time-slots">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTime(time)}
                className="schedule-lesson__time-slot"
              >
                {time}
              </Button>
            ))}
          </div>
        </Card>

        {/* Section de sélection de professeur */}
        <Card className="schedule-lesson__teacher-section">
          <Title level={2} size="lg" className="schedule-lesson__section-title">
            {t('scheduleLesson.chooseTeacher')}
          </Title>
          <div className="schedule-lesson__teachers">
            {availableTeachers.map((teacher) => (
              <Card
                key={teacher.id}
                className={`schedule-lesson__teacher-card ${
                  selectedTeacher?.id === teacher.id ? 'schedule-lesson__teacher-card--selected' : ''
                }`}
                onClick={() => setSelectedTeacher(teacher)}
                interactive
              >
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="schedule-lesson__teacher-avatar"
                />
                <div className="schedule-lesson__teacher-info">
                  <Title level={3} size="md" className="schedule-lesson__teacher-name">
                    {teacher.name}
                  </Title>
                  <p className="schedule-lesson__teacher-specialty">{teacher.specialty}</p>
                  <div className="schedule-lesson__teacher-details">
                    <span className="schedule-lesson__teacher-rating">★ {teacher.rating}</span>
                    <span className="schedule-lesson__teacher-price">${teacher.price}/h</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Résumé et confirmation */}
        {selectedDate && selectedTime && selectedTeacher && (
          <Card className="schedule-lesson__summary">
            <Title level={2} size="lg" className="schedule-lesson__section-title">
              {t('scheduleLesson.bookingSummary')}
            </Title>
            <div className="schedule-lesson__summary-content">
              <p><strong>{t('scheduleLesson.teacher')}:</strong> {selectedTeacher.name}</p>
              <p><strong>{t('scheduleLesson.date')}:</strong> {new Date(selectedDate).toLocaleDateString('fr-FR')}</p>
              <p><strong>{t('scheduleLesson.time')}:</strong> {selectedTime}</p>
              <p><strong>{t('scheduleLesson.price')}:</strong> ${selectedTeacher.price}</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleScheduleLesson}
              className="schedule-lesson__confirm-btn"
            >
              {t('scheduleLesson.confirmBooking')}
            </Button>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default ScheduleLesson;
