import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faPlus, 
} from '@fortawesome/free-solid-svg-icons';
import { Title, Button, Card, Modal } from '@atoms';
import './CustomerReviews.scss';

/**
 * CustomerReviews component - Displays and manages customer reviews for completed lessons
 * @param {Object} props - Component props
 */
const CustomerReviews = () => {
  const { t } = useTranslation('pages');
  const [reviews, setReviews] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    isAnonymous: false,
    difficulty: '',
    wouldRecommend: null,
    favoriteAspect: '',
    improvements: '',
    overallFeeling: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simuler les leçons terminées
  useEffect(() => {
    const mockCompletedLessons = [
      {
        id: 1,
        title: 'Basic English Conversation',
        category: 'Beginner',
        language: 'English',
        teacher: 'Sarah Johnson',
        completedDate: '2024-12-15',
        hasReview: false
      },
      {
        id: 2,
        title: 'French Grammar Fundamentals',
        category: 'Intermediate',
        language: 'French',
        teacher: 'Pierre Dubois',
        completedDate: '2024-12-10',
        hasReview: true
      },
      {
        id: 3,
        title: 'Chinese Characters Introduction',
        category: 'Beginner',
        language: 'Chinese',
        teacher: 'Li Wei',
        completedDate: '2024-12-05',
        hasReview: false
      }
    ];

    const mockReviews = [
      {
        id: 1,
        lessonId: 2,
        lessonTitle: 'French Grammar Fundamentals',
        language: 'French',
        teacher: 'Pierre Dubois',
        rating: 5,
        comment: 'Excellent lesson! The teacher explained grammar rules very clearly.',
        isAnonymous: false,
        studentName: 'John Doe',
        date: '2024-12-10'
      }
    ];

    setCompletedLessons(mockCompletedLessons);
    setReviews(mockReviews);
  }, []);

  const handleCreateReview = (lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
    setCurrentStep(1);
    setNewReview({
      rating: 0,
      comment: '',
      isAnonymous: false,
      difficulty: '',
      wouldRecommend: null,
      favoriteAspect: '',
      improvements: '',
      overallFeeling: ''
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
    setCurrentStep(1);
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const review = {
        id: Date.now(),
        lessonId: selectedLesson.id,
        lessonTitle: selectedLesson.title,
        language: selectedLesson.language,
        teacher: selectedLesson.teacher,
        ...newReview,
        studentName: newReview.isAnonymous ? 'Anonymous' : 'John Doe',
        date: new Date().toISOString().split('T')[0]
      };

      setReviews(prev => [...prev, review]);
      setCompletedLessons(prev => 
        prev.map(lesson => 
          lesson.id === selectedLesson.id 
            ? { ...lesson, hasReview: true }
            : lesson
        )
      );

      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={interactive ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="customer-reviews">
      <div className="customer-reviews__container">
        <Title level={1} className="page-title">
          {t('customerReviews.title')}
        </Title>

        {/* Section pour créer des reviews */}
        <section className="create-reviews-section">
          <Title level={2} className="section-title">
            {t('customerReviews.shareExperience')}
          </Title>
          <p className="section-description">
            {t('customerReviews.shareDescription')}
          </p>

          <div className="lessons-grid">
            {completedLessons
              .filter(lesson => !lesson.hasReview)
              .map(lesson => (
                <Card key={lesson.id} className="lesson-review-card">
                  <div className="lesson-info">
                    <Title level={3} className="lesson-title">
                      {lesson.title}
                    </Title>
                    <div className="lesson-details">
                      <span className="language">{lesson.language}</span>
                      <span className="category">{lesson.category}</span>
                    </div>
                    <p className="teacher">{t('customerReviews.teacher')}: {lesson.teacher}</p>
                    <p className="completed-date">
                      {t('customerReviews.completed')}: {new Date(lesson.completedDate).toLocaleDateString(t('locale', { ns: 'common' }))}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleCreateReview(lesson)}
                    className="review-btn"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    {t('customerReviews.writeReview')}
                  </Button>
                </Card>
              ))
            }
          </div>

          {completedLessons.filter(lesson => !lesson.hasReview).length === 0 && (
            <Card className="no-lessons-card">
              <p>{t('customerReviews.allReviewsCompleted')}</p>
            </Card>
          )}
        </section>

        {/* Section des reviews existantes */}
        <section className="existing-reviews-section">
          <Title level={2} className="section-title">
            {t('customerReviews.yourReviews')} ({reviews.length})
          </Title>

          {reviews.length > 0 ? (
            <div className="reviews-grid">
              {reviews.map(review => (
                <Card key={review.id} className="review-card">
                  <div className="review-header">
                    <Title level={3} className="lesson-title">
                      {review.lessonTitle}
                    </Title>
                    <div className="rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="review-details">
                    <span className="language">{review.language}</span>
                    <span className="teacher">{t('customerReviews.teacher')}: {review.teacher}</span>
                    <span className="date">{new Date(review.date).toLocaleDateString(t('locale', { ns: 'common' }))}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="no-reviews-card">
              <p>{t('customerReviews.noReviews')}</p>
            </Card>
          )}
        </section>

        {/* Modal pour créer une review */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`${t('customerReviews.title')}: ${selectedLesson?.title || ''}`}
          size="large"
        >
          <div className="review-modal-content">
            <div className="step-indicator">
              <span className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</span>
              <span className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</span>
              <span className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</span>
            </div>

            {currentStep === 1 && (
              <div className="step-content">
                <Title level={3}>{t('customerReviews.modal.rateLesson')}</Title>
                <div className="rating-section">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(2)}
                  disabled={newReview.rating === 0}
                >
                  {t('customerReviews.modal.next')}
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <Title level={3}>{t('customerReviews.modal.shareThoughts')}</Title>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder={t('customerReviews.modal.commentPlaceholder')}
                  className="comment-textarea"
                />
                <div className="navigation-buttons">
                  <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                    {t('customerReviews.modal.back')}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setCurrentStep(3)}
                    disabled={newReview.comment.trim().length < 10}
                  >
                    {t('customerReviews.modal.next')}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <Title level={3}>{t('customerReviews.modal.finalDetails')}</Title>
                <div className="final-details">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newReview.isAnonymous}
                      onChange={(e) => setNewReview(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    />
                    {t('customerReviews.modal.submitAnonymously')}
                  </label>
                </div>
                <div className="navigation-buttons">
                  <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                    {t('customerReviews.modal.back')}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('customerReviews.modal.submitting') : t('customerReviews.modal.submitReview')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerReviews;
