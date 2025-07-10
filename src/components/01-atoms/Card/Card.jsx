import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

/**
 * Card - Atomic Design Component
 * Composant carte réutilisable avec variantes et options d'interaction
 */
const Card = ({ 
  children, 
  variant = 'default',
  padding = 'base',
  hover = false,
  interactive = false,
  className = '',
  as = 'div',
  isSelected, // Extract isSelected to prevent it from being passed to DOM
  ...props 
}) => {
  const Component = as;
  
  const classNames = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    hover && 'card--hover',
    interactive && 'card--interactive',
    isSelected && 'card--selected',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={classNames}
      {...props}
    >
      {children}
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost']),
  padding: PropTypes.oneOf(['none', 'sm', 'base', 'lg']),
  hover: PropTypes.bool,
  interactive: PropTypes.bool,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType
};

export default Card;
