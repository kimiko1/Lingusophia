import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Modal, TeacherInfo, Title, Button } from '@atoms';
import './LessonDetailsModal.scss';

/**
 * LessonDetailsModal component - Modal displaying detailed lesson information
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {Object} props.lesson - Lesson data object
 * @param {Object} props.teacher - Teacher data object
 * @param {function} props.onConfirm - Function to confirm lesson booking
 * @param {string} props.variant - Modal style variant
 * @param {string} props.className - Additional CSS classes
 */
const LessonDetailsModal = ({ 
  isOpen, 
  onClose, 
  lesson, 
  teacher, 
  onConfirm,
  variant = 'default',
  className = '',
  ...props
}) => {
  const { t } = useTranslation('common');
  
  if (!lesson) return null;

  const modalClasses = [
    'lesson-details-modal',
    `lesson-details-modal--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(lesson, teacher);
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
        
        {teacher && (
          <div className="lesson-details-modal__right">
            <div className="lesson-details-modal__teacher-section">
              <Title level={4} className="lesson-details-modal__section-title">
                {t('components.lessonDetailsModal.yourTeacher')}
              </Title>
              <TeacherInfo 
                name={teacher.name} 
                image={teacher.image}
                title={teacher.title}
                size="large"
                className="lesson-details-modal__teacher"
              />
              {(teacher.speciality || teacher.experience || teacher.bio) && (
                <div className="lesson-details-modal__teacher-details">
                  {teacher.speciality && (
                    <p className="lesson-details-modal__teacher-speciality">
                      <strong>{t('components.lessonDetailsModal.speciality')}</strong> {teacher.speciality}
                    </p>
                  )}
                  {teacher.experience && (
                    <p className="lesson-details-modal__teacher-experience">
                      <strong>{t('components.lessonDetailsModal.experience')}</strong> {teacher.experience}
                    </p>
                  )}
                  {teacher.bio && (
                    <p className="lesson-details-modal__teacher-bio">
                      {teacher.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="lesson-details-modal__actions">
        <Button variant="outline" onClick={onClose} size="lg">
          {t('components.lessonDetailsModal.cancel')}
        </Button>
        <Button variant="primary" onClick={handleConfirm} size="lg">
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
  teacher: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string,
    speciality: PropTypes.string,
    experience: PropTypes.string,
    bio: PropTypes.string
  }),
  onConfirm: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['default', 'featured']),
  className: PropTypes.string
};

export default LessonDetailsModal;
