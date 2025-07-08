import React from 'react';
import PropTypes from 'prop-types';
import './TeacherInfo.scss';

/**
 * TeacherInfo component - Displays teacher information with avatar and name
 * @param {Object} props - Component props
 * @param {string} props.name - Teacher's name
 * @param {string} props.image - Teacher's profile image URL
 * @param {string} props.title - Teacher's title or role
 * @param {string} props.variant - Component style variant
 * @param {string} props.size - Component size variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.interactive - Whether the component is clickable
 * @param {function} props.onClick - Click handler
 * @param {string} props.layout - Layout direction
 */
const TeacherInfo = ({ 
  name,
  image,
  title,
  variant = 'default',
  size = 'medium',
  className = '',
  interactive = false,
  onClick,
  layout = 'vertical',
  ...props
}) => {
  const teacherInfoClasses = [
    'teacher-info',
    `teacher-info--${variant}`,
    `teacher-info--${size}`,
    `teacher-info--${layout}`,
    interactive && 'teacher-info--interactive',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (interactive && onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div 
      className={teacherInfoClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      <div className="teacher-info__image">
        <img 
          src={image} 
          alt={`${name} profile`}
          className="teacher-info__avatar"
        />
      </div>
      <div className="teacher-info__content">
        <h4 className="teacher-info__name">{name}</h4>
        {title && (
          <p className="teacher-info__title">{title}</p>
        )}
      </div>
    </div>
  );
};

TeacherInfo.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'card', 'minimal']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  interactive: PropTypes.bool,
  onClick: PropTypes.func,
  layout: PropTypes.oneOf(['vertical', 'horizontal'])
};

export default TeacherInfo;
