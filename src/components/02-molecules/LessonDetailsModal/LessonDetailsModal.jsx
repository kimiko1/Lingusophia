import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Modal, Title, Button } from '@atoms';
import { useBooking } from '@contexts/BookingContext';
import './LessonDetailsModal.scss';

/**
 * LessonDetailsModal component - Modal displaying detailed lesson information
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {Object} props.lesson - Lesson data object
 * @param {function} props.onConfirm - Function to confirm lesson booking
 * @param {string} props.variant - Modal style variant
 * @param {string} props.className - Additional CSS classes
 */
const LessonDetailsModal = ({ 
  isOpen, 
  onClose, 
  lesson, 
  onConfirm,
  variant = 'default',
  className = '',
  ...props
}) => {
  const { t } = useTranslation('common');
  const { selectedDate, selectedTime, setSelectedTime } = useBooking();
  
  if (!lesson) return null;

  const modalClasses = [
    'lesson-details-modal',
    `lesson-details-modal--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const handleConfirm = () => {
    if (onConfirm && selectedDate && selectedTime) {
      // Convertir la date en format YYYY-MM-DD
      const dateString = selectedDate.toISOString().split('T')[0];
      onConfirm(lesson, null, dateString, selectedTime);
    } else if (!selectedDate) {
      alert('Veuillez sélectionner une date dans le calendrier');
    } else if (!selectedTime) {
      alert('Veuillez sélectionner une heure');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className={modalClasses}
      size="large"
      title={t('components.lessonDetailsModal.title')}
      {...props}
    >
      <div className="lesson-details-modal__content">
        <div className="lesson-details-modal__left">
          <div className="lesson-details-modal__header">
            <Title level={3} className="lesson-details-modal__section-title">
              {t('components.lessonDetailsModal.goalOfCourse')}
            </Title>
          </div>
          
          <div className="lesson-details-modal__goal">
            <h4 className="lesson-details-modal__lesson-title">{lesson.title}</h4>
            <p className="lesson-details-modal__lesson-description">{lesson.description}</p>
            
            {lesson.goals && lesson.goals.length > 0 && (
              <div className="lesson-details-modal__goals">
                <h5 className="lesson-details-modal__goals-title">{t('components.lessonDetailsModal.whatYouWillLearn')}</h5>
                <ul className="lesson-details-modal__goals-list">
                  {lesson.goals.map((goal, index) => (
                    <li key={index} className="lesson-details-modal__goal-item">
                      <span className="lesson-details-modal__goal-icon">✓</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.duration && (
              <div className="lesson-details-modal__meta">
                <div className="lesson-details-modal__meta-item">
                  <span className="lesson-details-modal__meta-label">{t('components.lessonDetailsModal.duration')}</span>
                  <span className="lesson-details-modal__meta-value">{lesson.duration}</span>
                </div>
                {lesson.level && (
                  <div className="lesson-details-modal__meta-item">
                    <span className="lesson-details-modal__meta-label">{t('components.lessonDetailsModal.level')}</span>
                    <span className={`lesson-details-modal__meta-value lesson-details-modal__level--${lesson.level.toLowerCase()}`}>
                      {lesson.level}
                    </span>
                  </div>
                )}
                {lesson.price && (
                  <div className="lesson-details-modal__meta-item">
                    <span className="lesson-details-modal__meta-label">{t('components.lessonDetailsModal.price')}</span>
                    <span className="lesson-details-modal__meta-value lesson-details-modal__price">
                      {lesson.price}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Date and Time Selection */}
      <div className="lesson-details-modal__booking-section">
        <Title level={4} className="lesson-details-modal__section-title">
          Planifier votre leçon
        </Title>
        <div className="lesson-details-modal__datetime">
          <div className="lesson-details-modal__date-field">
            <label>Date sélectionnée :</label>
            <div className="lesson-details-modal__selected-date">
              {selectedDate ? selectedDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Aucune date sélectionnée'}
            </div>
            {!selectedDate && (
              <p className="lesson-details-modal__date-warning">
                Veuillez d&apos;abord sélectionner une date dans le calendrier
              </p>
            )}
          </div>
          <div className="lesson-details-modal__time-field">
            <label htmlFor="lesson-time">Heure :</label>
            <select
              id="lesson-time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="lesson-details-modal__time-select"
            >
              <option value="">Sélectionnez une heure</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="lesson-details-modal__actions">
        <Button variant="outline" onClick={onClose} size="lg">
          {t('components.lessonDetailsModal.cancel')}
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirm} 
          size="lg"
          disabled={!selectedDate || !selectedTime}
        >
          {t('components.lessonDetailsModal.bookLesson')}
        </Button>
      </div>
    </Modal>
  );
};

LessonDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lesson: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    goals: PropTypes.arrayOf(PropTypes.string),
    duration: PropTypes.number,
    level: PropTypes.string,
    price: PropTypes.string
  }),
  onConfirm: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['default', 'featured']),
  className: PropTypes.string
};

export default LessonDetailsModal;
