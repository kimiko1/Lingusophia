import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from '../../03-organisms';
import './HeaderTemplate.scss';

/**
 * HeaderTemplate component - Template with header/navbar
 * @param {Object} props - Component props
 * @param {React.Node} props.children - Content to display below header
 * @param {Object} props.navbarProps - Props to pass to Navbar component
 * @param {string} props.variant - Template style variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fixed - Whether header should be fixed position
 */
const HeaderTemplate = ({ 
  children,
  navbarProps = {},
  variant = 'default',
  className = '',
  fixed = false,
  ...props
}) => {
  const templateClasses = [
    'header-template',
    `header-template--${variant}`,
    fixed && 'header-template--fixed',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={templateClasses} {...props}>
      <div className="header-template__header">
        <Navbar {...navbarProps} />
      </div>
      {children && (
        <main className="header-template__content">
          {children}
        </main>
      )}
    </div>
  );
};

HeaderTemplate.propTypes = {
  children: PropTypes.node,
  navbarProps: PropTypes.object,
  variant: PropTypes.oneOf(['default', 'compact', 'transparent']),
  className: PropTypes.string,
  fixed: PropTypes.bool
};

export default HeaderTemplate;
