import React from 'react';
import SvgReact from '@assets/react-components/React.jsx';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './Logo.scss';

/**
 * Logo component - Displays the application logo
 * @param {Object} props - Component props
 * @param {string} props.text - Logo text to display
 * @param {string} props.size - Logo size variant
 * @param {string} props.variant - Logo style variant
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler for clickable logos
 * @param {boolean} props.clickable - Whether the logo is clickable
 */
const Logo = React.memo(function Logo({ 
  text,
  size = 'medium',
  variant = 'default',
  className = '',
  onClick,
  clickable = false,
  ...props 
}) {
  const { t } = useTranslation('common');
  const logoText = text || t('app.name');
  
  const logoClasses = [
    'logo',
    `logo--${size}`,
    `logo--${variant}`,
    clickable && 'logo--clickable',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  return (
    <div 
      className={logoClasses}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      } : undefined}
      {...props}
    >
      <SvgReact width={32} height={32} style={{ verticalAlign: 'middle', marginRight: '0.5em' }} />
      <span className="logo__text">{logoText}</span>
    </div>
  );
});

Logo.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'gradient']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  clickable: PropTypes.bool
};

export default Logo;
