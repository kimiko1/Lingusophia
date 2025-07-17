import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from '../../01-atoms';
import './NavItem.scss';

/**
 * NavItem component - Navigation item wrapper with list semantics
 * @param {Object} props - Component props
 * @param {Object} props.icon - FontAwesome icon object
 * @param {string} props.label - Navigation item label
 * @param {string} props.href - Navigation item link
 * @param {boolean} props.isActive - Whether the item is currently active
 * @param {string} props.variant - Item style variant
 * @param {string} props.size - Item size variant
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the item is disabled
 */
const NavItem = ({ 
  icon,
  label,
  href,
  isActive = false,
  variant = 'default',
  size = 'medium',
  className = '',
  onClick,
  disabled = false,
  ...props
}) => {
  const navItemClasses = [
    'nav-item',
    `nav-item--${variant}`,
    `nav-item--${size}`,
    isActive && 'nav-item--active',
    disabled && 'nav-item--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <li className={navItemClasses} {...props}>
      <NavLink 
        icon={icon}
        label={label}
        href={href}
        isActive={isActive}
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
      />
    </li>
  );
};

NavItem.propTypes = {
  icon: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'minimal']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default NavItem;
