import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '../../01-atoms';
import './CategoryCard.scss';

/**
 * CategoryCard component - Displays a category with difficulty levels
 * @param {Object} props - Component props
 * @param {string} props.category - Category name
 * @param {boolean} props.isSelected - Whether the category is selected
 * @param {function} props.onClick - Click handler
 * @param {string} props.color - Color theme for the category
 * @param {string} props.icon - Custom icon override
 * @param {string} props.variant - Card style variant
 * @param {string} props.size - Card size variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the card is disabled
 * @param {string} props.description - Category description
 */
const CategoryCard = ({ 
  category,
  isSelected = false,
  onClick,
  color = 'green',
  icon,
  variant = 'default',
  size = 'medium',
  className = '',
  disabled = false,
  description,
  ...props
}) => {
  // Default icons for each color/difficulty
  const getDefaultIcon = (color) => {
    switch(color) {
      case 'green': return '🌱';
      case 'orange': return '🔥';
      case 'red': return '💪';
      default: return '📚';
    }
  };

  // Background gradients for each color
  const getBackgroundImage = (color) => {
    switch(color) {
      case 'green':
        return 'linear-gradient(135deg, #a8e6cf 0%, #88d8a3 50%, #67d078 100%)';
      case 'orange':
        return 'linear-gradient(135deg, #ffd93d 0%, #ff9800 50%, #f57c00 100%)';
      case 'red':
        return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #e53935 100%)';
      case 'blue':
        return 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 50%, #2196f3 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #ba68c8 0%, #ab47bc 50%, #9c27b0 100%)';
      default:
        return 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)';
    }
  };

  const categoryClasses = [
    'category-card',
    `category-card--${variant}`,
    `category-card--${size}`,
    `category-card--${color}`,
    isSelected && 'category-card--selected',
    disabled && 'category-card--disabled',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div 
      className={categoryClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-disabled={disabled}
      {...props}
    >
      <div className="category-card__header">
        <Title 
          level={3} 
          className="category-card__title"
          size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
        >
          {category}
        </Title>
        {description && (
          <p className="category-card__description">{description}</p>
        )}
      </div>
      
      <div 
        className="category-card__circle"
        style={{ background: getBackgroundImage(color) }}
      >
        <div className="category-card__icon" role="img" aria-label={`${category} icon`}>
          {icon || getDefaultIcon(color)}
        </div>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  icon: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'card', 'minimal']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  description: PropTypes.string
};

export default CategoryCard;
