import React from 'react';
import PropTypes from 'prop-types';
import './OvalCard.scss';

/**
 * OvalCard component - A card with oval/rounded design
 * @param {Object} props - Component props
 * @param {React.Node} props.children - Card content
 * @param {boolean} props.isSelected - Whether the card is selected
 * @param {function} props.onClick - Click handler
 * @param {string} props.variant - Card style variant
 * @param {string} props.size - Card size variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the card is disabled
 * @param {boolean} props.interactive - Whether the card should show hover effects
 */
const OvalCard = React.memo(({ 
  children,
  isSelected = false,
  onClick,
  variant = 'default',
  size = 'medium',
  className = '',
  disabled = false,
  interactive = !!onClick,
  ...props
}) => {
  const cardClasses = [
    'oval-card',
    `oval-card--${variant}`,
    `oval-card--${size}`,
    isSelected && 'oval-card--selected',
    disabled && 'oval-card--disabled',
    interactive && 'oval-card--interactive',
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
    if (interactive && !disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive && !disabled ? 0 : undefined}
      aria-pressed={interactive && isSelected ? true : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );
});

OvalCard.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  interactive: PropTypes.bool
};

export default OvalCard;
