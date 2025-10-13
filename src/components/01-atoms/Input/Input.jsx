import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Input.scss';

/**
 * Input - Atomic Design Component
 * Composant champ de saisie réutilisable avec icônes et validation
 */
const Input = forwardRef(({ 
  type = 'text',
  size = 'base',
  variant = 'default',
  error = false,
  success = false,
  disabled = false,
  fullWidth = false,
  placeholder,
  label,
  helperText,
  errorText,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const wrapperClassNames = [
    'input-wrapper',
    `input-wrapper--${size}`,
    `input-wrapper--${variant}`,
    error && 'input-wrapper--error',
    success && 'input-wrapper--success',
    disabled && 'input-wrapper--disabled',
    fullWidth && 'input-wrapper--full-width',
    icon && `input-wrapper--with-icon-${iconPosition}`,
    className
  ].filter(Boolean).join(' ');

  const inputClassNames = [
    'input',
    `input--${size}`,
    icon && `input--with-icon-${iconPosition}`
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassNames}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
        </label>
      )}
      
      <div className="input__field-wrapper">
        {icon && iconPosition === 'left' && (
          <div className="input__icon input__icon--left">
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClassNames}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={
            [
              helperText && `${inputId}-helper`,
              errorText && `${inputId}-error`
            ].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="input__icon input__icon--right">
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <div id={`${inputId}-helper`} className="input__helper-text">
          {helperText}
        </div>
      )}
      
      {errorText && error && (
        <div id={`${inputId}-error`} className="input__error-text">
          {errorText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'base', 'lg']),
  variant: PropTypes.oneOf(['default', 'filled', 'outlined']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  icon: PropTypes.object,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  id: PropTypes.string
};

export default Input;
