import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../../01-atoms';
import './ReviewSlider.scss';

/**
 * ReviewSlider component - Displays customer reviews in a sliding carousel
 * @param {Object} props - Component props
 * @param {Array} props.reviews - Array of review objects
 * @param {boolean} props.autoPlay - Whether to auto-advance slides
 * @param {number} props.autoPlayInterval - Auto-play interval in milliseconds
 * @param {string} props.variant - Slider style variant
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onReviewChange - Callback when review changes
 */
const ReviewSlider = ({ 
  reviews: propReviews,
  autoPlay = false,
  autoPlayInterval = 5000,
  variant = 'default',
  className = '',
  onReviewChange,
  ...props
}) => {
  const { t } = useTranslation('common');
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock reviews if none provided
  useEffect(() => {
    if (propReviews && propReviews.length > 0) {
      setReviews(propReviews);
    } else {
      // Default mock reviews
      const mockReviews = [
        {
          id: 1,
          lessonTitle: 'Basic English Conversation',
          language: 'English',
          teacher: 'Sarah Johnson',
          rating: 5,
          comment: 'Amazing lesson! Sarah made learning English so enjoyable and easy to understand.',
          studentName: 'Maria Garcia',
          isAnonymous: false,
          date: '2024-12-15'
        },
        {
          id: 2,
          lessonTitle: 'French Grammar Fundamentals',
          language: 'French',
          teacher: 'Pierre Dubois',
          rating: 4,
          comment: 'Great explanation of French grammar rules. Pierre is very patient and helpful.',
          studentName: 'Anonymous',
          isAnonymous: true,
          date: '2024-12-14'
        },
        {
          id: 3,
          lessonTitle: 'Chinese Characters Introduction',
          language: 'Chinese',
          teacher: 'Li Wei',
          rating: 5,
          comment: 'Excellent introduction to Chinese characters. Li Wei explains everything step by step.',
          studentName: 'John Smith',
          isAnonymous: false,
          date: '2024-12-13'
        },
        {
          id: 4,
          lessonTitle: 'Advanced English Writing',
          language: 'English',
          teacher: 'Emma Wilson',
          rating: 4,
          comment: 'Very detailed lesson on writing techniques. Emma provides great feedback.',
          studentName: 'David Chen',
          isAnonymous: false,
          date: '2024-12-11'
        }
      ];
      setReviews(mockReviews);
    }
  }, [propReviews]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, reviews.length]);

  // Notify parent when review changes
  useEffect(() => {
    if (onReviewChange && reviews[currentIndex]) {
      onReviewChange(reviews[currentIndex], currentIndex);
    }
  }, [currentIndex, reviews, onReviewChange]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={`review-star ${index < rating ? 'review-star--filled' : 'review-star--empty'}`}
      />
    ));
  };

  if (reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];
  const sliderClasses = [
    'review-slider',
    `review-slider--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={sliderClasses} {...props}>
      <div className="review-slider__header">
        <h2 className="review-slider__title">{t('components.reviewSlider.title')}</h2>
        <div className="review-slider__controls">
          <button 
            className="review-slider__btn review-slider__btn--prev" 
            onClick={prevSlide}
            aria-label={t('components.reviewSlider.previousReview')}
            disabled={reviews.length <= 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button 
            className="review-slider__btn review-slider__btn--next" 
            onClick={nextSlide}
            aria-label={t('components.reviewSlider.nextReview')}
            disabled={reviews.length <= 1}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      <div className="review-slider__content">
        <Card className="review-slide">
          <div className="review-slide__header">
            <div className="review-slide__lesson-info">
              <h3 className="review-slide__lesson-title">{currentReview.lessonTitle}</h3>
              <p className="review-slide__lesson-meta">
                <span className="review-slide__language">{currentReview.language}</span>
                {currentReview.teacher && (
                  <>
                    <span className="review-slide__separator"> • </span>
                    <span className="review-slide__teacher">{t('components.reviewSlider.with')} {currentReview.teacher}</span>
                  </>
                )}
              </p>
            </div>
            <div className="review-slide__rating">
              {renderStars(currentReview.rating)}
            </div>
          </div>

          <div className="review-slide__body">
            <p className="review-slide__comment">"{currentReview.comment}"</p>
          </div>

          <div className="review-slide__footer">
            <div className="review-slide__student-info">
              <span className="review-slide__student-name">
                - {currentReview.isAnonymous ? t('components.reviewSlider.anonymous') : currentReview.studentName}
              </span>
              <span className="review-slide__date">
                {new Date(currentReview.date).toLocaleDateString(t('locale'))}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {reviews.length > 1 && (
        <div className="review-slider__indicators">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`review-slider__indicator ${index === currentIndex ? 'review-slider__indicator--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`${t('components.reviewSlider.goToReview')} ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

ReviewSlider.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    lessonTitle: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    teacher: PropTypes.string,
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    studentName: PropTypes.string.isRequired,
    isAnonymous: PropTypes.bool,
    date: PropTypes.string.isRequired
  })),
  autoPlay: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'compact', 'featured']),
  className: PropTypes.string,
  onReviewChange: PropTypes.func
};

export default ReviewSlider;
