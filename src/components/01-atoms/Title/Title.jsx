import PropTypes from 'prop-types';
import './Title.scss';

/**
 * Title - Atomic Design Component
 * Composant titre réutilisable avec niveaux sémantiques
 */
const Title = ({ 
  children, 
  level = 1, 
  variant = 'default',
  align = 'left',
  className = '',
  as,
  ...props 
}) => {
  // Détermine le tag HTML à utiliser
  const Component = as || `h${level}`;
  
  const classNames = [
    'title',
    `title--level-${level}`,
    `title--${variant}`,
    `title--align-${align}`,
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

Title.propTypes = {
  children: PropTypes.node.isRequired,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'muted']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
  as: PropTypes.elementType
};

export default Title;
