import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faClock,
  faGraduationCap,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { Card } from '../../01-atoms';
import './Navigations.scss';

/**
 * Navigations component - Grid of navigation cards
 * @param {Object} props - Component props
 * @param {Array} props.navigationItems - Custom navigation items
 * @param {string} props.variant - Style variant
 * @param {string} props.layout - Layout arrangement
 * @param {string} props.className - Additional CSS classes
 */
const Navigations = ({ 
  navigationItems,
  variant = 'default',
  layout = 'grid',
  className = '',
  ...props
}) => {
  // Default navigation items
  const defaultNavItems = [
    {
      icon: faClock,
      label: 'Schedule a lesson',
      href: '/calendar',
      color: 'orange',
      id: 'schedule'
    },
    {
      icon: faComments,
      label: 'Customer reviews',
      href: '/customer-reviews',
      color: 'pink',
      id: 'reviews'
    },
    {
      icon: faGraduationCap,
      label: 'My learning',
      href: '/my-lessons',
      color: 'green',
      id: 'learning'
    },
    {
      icon: faUser,
      label: 'Contact a teacher',
      href: '/teachers',
      color: 'blue',
      id: 'contact'
    }
  ];

  const navItems = navigationItems || defaultNavItems;

  const navigationsClasses = [
    'navigations',
    `navigations--${variant}`,
    `navigations--${layout}`,
    className
  ].filter(Boolean).join(' ');

  const getColorClasses = (color) => {
    return `navigation-item--${color}`;
  };

  return (
    <div className={navigationsClasses} {...props}>
      <div className="navigations__grid">
        {navItems.map((item) => (
          <Card
            key={item.id}
            variant="default"
            interactive
            className={`navigation-item ${getColorClasses(item.color)}`}
          >
            <Link to={item.href} className="navigation-item__link">
              <div className="navigation-item__icon">
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className="navigation-item__icon-element"
                />
              </div>
              <span className="navigation-item__label">
                {item.label}
              </span>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

Navigations.propTypes = {
  navigationItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.object.isRequired,
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  ),
  variant: PropTypes.oneOf(['default', 'compact', 'minimal']),
  layout: PropTypes.oneOf(['grid', 'list', 'flex']),
  className: PropTypes.string
};

export default Navigations;
