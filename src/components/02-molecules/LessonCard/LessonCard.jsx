import PropTypes from 'prop-types';
import { Card, Title } from '@atoms';
import './LessonCard.scss';

/**
 * LessonCard component - Displays lesson information in a card format
 * @param {Object} props - Component props
 * @param {string} props.title - Lesson title
 * @param {string} props.description - Lesson description
 * @param {int} props.duration - Lesson duration
 * @param {string} props.level - Lesson difficulty level
 * @param {string} props.image - Lesson image URL
 * @param {boolean} props.isSelected - Whether the card is selected
 * @param {boolean} props.isCompleted - Whether the lesson is completed
 * @param {function} props.onClick - Click handler
 * @param {string} props.variant - Card style variant
 * @param {string} props.className - Additional CSS classes
 */
const LessonCard = ({ 
  title,
  description,
  duration,
  level,
  image,
  isSelected = false,
  isCompleted = false,
  onClick,
  variant = 'default',
  className = '',
  ...props
}) => {
  const cardClasses = [
    'lesson-card',
    `lesson-card--${variant}`,
    isCompleted && 'lesson-card--completed',
    className
  ].filter(Boolean).join(' ');

  return (
    <Card 
      className={cardClasses}
      isSelected={isSelected}
      onClick={onClick}
      interactive={!!onClick}
      {...props}
    >
      {image && (
        <div className="lesson-card__image">
          <img src={image} alt={title} loading="lazy" />
          {isCompleted && (
            <div className="lesson-card__completion-badge">
              <span className="lesson-card__check">✓</span>
            </div>
          )}
        </div>
      )}
      
      <div className="lesson-card__content">
        <div className="lesson-card__header">
          <Title level={4} className="lesson-card__title">
            {title}
          </Title>
          {level && (
            <span className={`lesson-card__level lesson-card__level--${level.toLowerCase()}`}>
              {level}
            </span>
          )}
        </div>
        
        <p className="lesson-card__description">
          {description}
        </p>
        
        {duration && (
          <div className="lesson-card__meta">
            <span className="lesson-card__duration">
              ⏱️ {duration}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

LessonCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  duration: PropTypes.number,
  level: PropTypes.oneOf(['Beginner', 'Intermediate', 'Advanced']),
  image: PropTypes.string,
  isSelected: PropTypes.bool,
  isCompleted: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'featured', 'compact']),
  className: PropTypes.string
};

export default LessonCard;
