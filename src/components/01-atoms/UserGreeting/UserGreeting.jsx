import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './UserGreeting.scss';

/**
 * UserGreeting component - Displays a personalized greeting message
 * @param {Object} props - Component props
 * @param {string} props.name - User's name to display
 * @param {string} props.greeting - Custom greeting text
 * @param {string} props.emoji - Emoji to display with greeting
 * @param {string} props.variant - Greeting style variant
 * @param {string} props.size - Greeting size variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animated - Whether to show animation
 */
const UserGreeting = React.memo(({ 
  name,
  greeting,
  emoji = '👋',
  variant = 'default',
  size = 'medium',
  className = '',
  animated = false,
  ...props
}) => {
  const { t } = useTranslation('common');
  const greetingText = greeting || t('user.greeting');
  
  const greetingClasses = [
    'user-greeting',
    `user-greeting--${variant}`,
    `user-greeting--${size}`,
    animated && 'user-greeting--animated',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={greetingClasses} {...props}>
      <span className="user-greeting__text">
        {greetingText} {name}
      </span>
      <span 
        className="user-greeting__emoji"
        role="img" 
        aria-label="waving hand"
      >
        {emoji}
      </span>
    </div>
  );
});

UserGreeting.propTypes = {
  name: PropTypes.string.isRequired,
  greeting: PropTypes.string,
  emoji: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'warm']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  animated: PropTypes.bool
};

export default UserGreeting;
