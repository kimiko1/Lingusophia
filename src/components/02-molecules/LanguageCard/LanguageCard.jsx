import PropTypes from 'prop-types';
import { Card } from '@atoms';
import './LanguageCard.scss';

/**
 * LanguageCard - Molecule Component
 * Carte de sélection de langue avec flag et interaction
 */
const LanguageCard = ({ 
  language,
  flag,
  isSelected = false,
  onClick,
  variant = 'default',
  size = 'base',
  className = '',
  ...props
}) => {
  const cardClassNames = [
    'language-card',
    `language-card--${variant}`,
    `language-card--${size}`,
    isSelected && 'language-card--selected',
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick(language);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      className={cardClassNames}
      interactive
      hover
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${language} language`}
      {...props}
    >
      <div className="language-card__content">
        <div className="language-card__flag">
          {typeof flag === 'string' && flag.length <= 4 ? (
            <span className="language-card__emoji" role="img" aria-label={`${language} flag`}>
              {flag}
            </span>
          ) : (
            <img 
              src={flag} 
              alt={`${language} flag`} 
              className="language-card__flag-img"
              loading="lazy"
            />
          )}
        </div>
        
        <div className="language-card__info">
          <h3 className="language-card__title">{language}</h3>
          {isSelected && (
            <div className="language-card__check" aria-hidden="true">
              ✓
            </div>
          )}
        </div>
      </div>
      
      {isSelected && (
        <div className="language-card__selected-indicator" aria-hidden="true" />
      )}
    </Card>
  );
};

LanguageCard.propTypes = {
  language: PropTypes.string.isRequired,
  flag: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'compact', 'detailed']),
  size: PropTypes.oneOf(['sm', 'base', 'lg']),
  className: PropTypes.string
};

export default LanguageCard;
