import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './NavLink.scss';

/**
 * NavLink component - Navigation link with icon and label
 * @param {Object} props - Component props
 * @param {Object} props.icon - FontAwesome icon object
 * @param {string} props.href - Link destination
 * @param {string} props.label - Link label text
 * @param {boolean} props.isActive - Whether the link is currently active
 * @param {string} props.variant - Link style variant
 * @param {string} props.size - Link size variant
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the link is disabled
 */
const NavLink = ({ 
  icon,
  href,
  label,
  isActive = false,
  variant = 'default',
  size = 'medium',
  className = '',
  onClick,
  disabled = false,
  ...props
}) => {
  const navLinkClasses = [
    'nav-link-wrapper',
    `nav-link-wrapper--${variant}`,
    `nav-link-wrapper--${size}`,
    isActive && 'nav-link-wrapper--active',
    disabled && 'nav-link-wrapper--disabled',
    className
  ].filter(Boolean).join(' ');

  const linkClasses = [
    'nav-link',
    isActive && 'nav-link--active',
    disabled && 'nav-link--disabled'
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'nav-label',
    isActive && 'nav-label--active',
    disabled && 'nav-label--disabled'
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

  const linkContent = (
    <>
      <div className="icon-with-label">
        <FontAwesomeIcon 
          icon={icon} 
          className="nav-icon" 
          aria-hidden="true"
        />
      </div>
      <span className={labelClasses}>
        {label}
      </span>
    </>
  );

  return (
    <div className={navLinkClasses} {...props}>
      {disabled ? (
        <div className={linkClasses} onClick={handleClick}>
          {linkContent}
        </div>
      ) : (
        <Link 
          className={linkClasses}
          to={href}
          onClick={handleClick}
          aria-current={isActive ? 'page' : undefined}
          aria-label={label}
        >
          {linkContent}
        </Link>
      )}
    </div>
  );
};

NavLink.propTypes = {
  icon: PropTypes.object.isRequired,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'minimal']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default NavLink;
