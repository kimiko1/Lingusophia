import React from 'react';
import PropTypes from 'prop-types';
import { Navigations } from '../../03-organisms';
import { ReviewSlider } from '../../02-molecules';
import { Title } from '../../01-atoms';
import './Home.scss';

/**
 * Home component - Main dashboard/landing page
 * @param {Object} props - Component props
 * @param {string} props.variant - Page style variant
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.user - User data for personalization
 */
const Home = ({ 
  variant = 'default',
  className = '',
  user,
  ...props
}) => {
  const homeClasses = [
    'home-page',
    `home-page--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={homeClasses} {...props}>
      <div className="home-page__container">
        {/* Hero Section */}
        <section className="home-page__hero">
          <div className="home-page__hero-content">
            <Title level={1} className="home-page__hero-title">
              Welcome to LearnALanguage
            </Title>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="home-page__navigation">
          <div className="home-page__section-header">
            <p className="home-page__section-description">
              Select what you'd like to do today
            </p>
          </div>
          <Navigations />
        </section>

        {/* Reviews Section */}
        <section className="home-page__reviews">
          <div className="home-page__section-header">
            <Title level={2} className="home-page__section-title">
              Student Reviews
            </Title>
            <p className="home-page__section-description">
              See what our students have to say about their learning experience
            </p>
          </div>
          <ReviewSlider autoPlay={true} autoPlayInterval={6000} />
        </section>
      </div>
    </div>
  );
};

Home.propTypes = {
  variant: PropTypes.oneOf(['default', 'minimal', 'featured']),
  className: PropTypes.string,
  user: PropTypes.object
};

export default Home;
