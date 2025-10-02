import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Title } from '@atoms';
import './LevelCard.scss';

/**
 * LevelCard component - Displays level information with icon and description
 * @param {Object} props - Component props
 * @param {Object} props.icon - FontAwesome icon object
 * @param {string} props.title - Level title
 * @param {string} props.description - Level description
 * @param {string} props.difficulty - Difficulty level
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {boolean} props.isSelected - Whether the card is selected
 * @param {boolean} props.isLocked - Whether the level is locked
 * @param {function} props.onClick - Click handler
 * @param {string} props.variant - Card style variant
 * @param {string} props.className - Additional CSS classes
 */
const LevelCard = ({ 
  icon,
  title,
  description,
  difficulty,
  progress,
  isSelected = false,
  isLocked = false,
  onClick,
  variant = 'default',
  className = '',
  ...props
}) => {
  const cardClasses = [
    'level-card',
    `level-card--${variant}`,
    isSelected && 'level-card--selected',
    isLocked && 'level-card--locked',
    difficulty && `level-card--${difficulty.toLowerCase()}`,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (!isLocked && onClick) {
      onClick(e);
    }
  };

  return (
    <Card 
      className={cardClasses}
      onClick={handleClick}
      interactive={!!onClick && !isLocked}
      {...props}
    >
      <div className="level-card__icon">
        <FontAwesomeIcon 
          icon={icon} 
          className={`level-card__icon-element ${isLocked ? 'level-card__icon--locked' : ''}`}
        />
        {isLocked && (
          <div className="level-card__lock">
            🔒
          </div>
        )}
      </div>
      
      <div className="level-card__content">
        <Title level={4} className="level-card__title">
          {title}
        </Title>
        
        {difficulty && (
          <span className={`level-card__difficulty level-card__difficulty--${difficulty.toLowerCase()}`}>
            {difficulty}
          </span>
        )}
        
        <p className="level-card__description">
          {description}
        </p>
        
        {progress !== undefined && !isLocked && (
          <div className="level-card__progress">
            <div className="level-card__progress-bar">
              <div 
                className="level-card__progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="level-card__progress-text">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

LevelCard.propTypes = {
  icon: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']),
  progress: PropTypes.number,
  isSelected: PropTypes.bool,
  isLocked: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'featured', 'compact']),
  className: PropTypes.string
};

export default LevelCard;
