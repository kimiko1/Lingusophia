import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@atoms';
import './PageLayout.scss';

/**
 * PageLayout component - Layout for page content with title and subtitle
 * @param {Object} props - Component props
 * @param {React.Node} props.children - Content to display
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 * @param {string} props.variant - Layout style variant
 * @param {string} props.className - Additional CSS classes
 */
const PageLayout = React.memo(({ 
  children,
  title,
  subtitle,
  variant = 'default',
  className = '',
  ...props
}) => {
  const layoutClasses = [
    'page-layout',
    `page-layout--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses} {...props}>
      {(title || subtitle) && (
        <div className="page-layout__header">
          {title && (
            <Title level={1} size="2xl" className="page-layout__title">
              {title}
            </Title>
          )}
          {subtitle && (
            <p className="page-layout__subtitle">{subtitle}</p>
          )}
        </div>
      )}
      <div className="page-layout__content">
        {children}
      </div>
    </div>
  );
});

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'centered', 'wide']),
  className: PropTypes.string
};

export default PageLayout;
