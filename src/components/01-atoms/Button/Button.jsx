import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Button.scss';

/**
 * Button - Atomic Design Component
 * Composant bouton réutilisable avec variantes et tailles
 * Supporte les liens React Router et les liens externes
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'base', 
  disabled = false, 
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  fullWidth = false,
  to,        // Pour les liens internes (React Router)
  href,      // Pour les liens externes
  external = false,
  target,
  rel,
  ...props 
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  // Contenu du bouton (pour réutiliser dans tous les cas)
  const buttonContent = (
    <>
      {loading && (
        <span className="btn__spinner" aria-label="Loading">
          <svg className="btn__spinner-icon" viewBox="0 0 24 24">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            />
          </svg>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <FontAwesomeIcon icon={icon} className="btn__icon btn__icon--left" />
      )}
      
      <span className="btn__content">{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <FontAwesomeIcon icon={icon} className="btn__icon btn__icon--right" />
      )}
    </>
  );

  // Lien externe
  if (href || external) {
    return (
      <a
        href={href || to}
        className={classNames}
        target={target || (external ? '_blank' : undefined)}
        rel={rel || (external ? 'noopener noreferrer' : undefined)}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
        aria-disabled={disabled}
        {...props}
      >
        {buttonContent}
      </a>
    );
  }

  // Lien interne (React Router)
  if (to) {
    return (
      <Link
        to={disabled ? '#' : to}
        className={classNames}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
        aria-disabled={disabled}
        {...props}
      >
        {buttonContent}
      </Link>
    );
  }

  // Bouton classique
  return (
    <button 
      type={type}
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'base', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.object,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  to: PropTypes.string,           // URL pour liens internes (React Router)
  href: PropTypes.string,         // URL pour liens externes
  external: PropTypes.bool,       // Force le lien externe (ouvre dans nouvel onglet)
  target: PropTypes.string,       // Target pour les liens
  rel: PropTypes.string          // Attribut rel pour les liens
};

export default Button;
