import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Title } from '../../01-atoms';
import { CategoryCard, LessonCard, LessonDetailsModal } from '../../02-molecules';
import './LessonSelection.scss';

/**
 * LessonSelection component - Page for selecting lessons by category and difficulty
 * @param {Object} props - Component props
 * @param {string} props.variant - Page style variant
 * @param {string} props.className - Additional CSS classes
 */
const LessonSelection = ({ 
  variant = 'default',
  className = '',
  ...props
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  
  const language = searchParams.get('language');
  const level = searchParams.get('level');

  // Categories data
  const categories = [
    { id: 'easy', name: 'Easy', color: 'green', description: 'Perfect for beginners' },
    { id: 'medium', name: 'Medium', color: 'orange', description: 'For intermediate learners' },
    { id: 'hard', name: 'Hard', color: 'red', description: 'Advanced level challenges' }
  ];

  // Teachers data
  const teachers = {
    'sarah-johnson': {
      name: 'Sarah Johnson',
      image: 'https://fireflyphotographysg.com/wp-content/uploads/2024/03/5-steps-to-mastering-the-perfect-linkedin-profile-picture.jpg',
      title: 'English Language Expert',
      speciality: 'English Grammar & Conversation',
      experience: '8 years of teaching experience',
      bio: 'Passionate about helping students achieve fluency in English through interactive and engaging methods.'
    },
    'john-smith': {
      name: 'John Smith',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      title: 'Business English Specialist',
      speciality: 'Advanced English & Business',
      experience: '12 years of professional teaching',
      bio: 'Specialized in business English and professional communication skills.'
    }
  };

  // Lessons data (simplified version)
  const lessonsData = {
    english: {
      easy: [
        {
          id: 'greetings',
          title: 'Basic Greetings',
          description: 'Learn how to say hello, goodbye, and introduce yourself in English.',
          teacher: 'sarah-johnson',
          duration: '30 minutes',
          level: 'Beginner',
          price: '$25',
          goals: [
            'Master common greeting expressions',
            'Learn proper pronunciation',
            'Practice self-introduction',
            'Understand cultural context'
          ]
        },
        {
          id: 'numbers',
          title: 'Numbers 1-20',
          description: 'Master counting from 1 to 20 with pronunciation and usage examples.',
          teacher: 'sarah-johnson',
          duration: '25 minutes',
          level: 'Beginner',
          price: '$20',
          goals: [
            'Count accurately from 1 to 20',
            'Use numbers in daily situations',
            'Learn ordinal numbers',
            'Practice number pronunciation'
          ]
        }
      ],
      medium: [
        {
          id: 'conversation',
          title: 'Daily Conversations',
          description: 'Practice common everyday conversations and dialogues.',
          teacher: 'john-smith',
          duration: '45 minutes',
          level: 'Intermediate',
          price: '$35',
          goals: [
            'Engage in natural conversations',
            'Use appropriate expressions',
            'Improve fluency and confidence',
            'Learn cultural nuances'
          ]
        }
      ],
      hard: [
        {
          id: 'business',
          title: 'Business English',
          description: 'Advanced business communication and professional vocabulary.',
          teacher: 'john-smith',
          duration: '60 minutes',
          level: 'Advanced',
          price: '$50',
          goals: [
            'Master business vocabulary',
            'Write professional emails',
            'Conduct meetings in English',
            'Present ideas confidently'
          ]
        }
      ]
    },
    french: {
      easy: [
        {
          id: 'french-basics',
          title: 'French Basics',
          description: 'Introduction to French language fundamentals.',
          teacher: 'sarah-johnson',
          duration: '30 minutes',
          level: 'Beginner',
          price: '$25',
          goals: [
            'Learn basic French phrases',
            'Understand pronunciation rules',
            'Practice common expressions',
            'Build vocabulary foundation'
          ]
        }
      ]
    }
  };

  // Get lessons for selected category
  const getLessonsForCategory = (categoryId) => {
    if (!language || !lessonsData[language]) return [];
    return lessonsData[language][categoryId] || [];
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedLesson(null);
  };

  // Handle lesson selection
  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    setIsModalOpen(true);
  };

  // Handle lesson booking
  const handleConfirmLesson = (lesson, teacher) => {
    // Here you would typically make an API call to book the lesson
    console.log('Booking lesson:', lesson, 'with teacher:', teacher);
    setIsModalOpen(false);
    navigate('/calendar'); // Redirect to calendar for scheduling
  };

  // Go back to language/level selection
  const handleGoBack = () => {
    navigate(-1);
  };

  const pageClasses = [
    'lesson-selection',
    `lesson-selection--${variant}`,
    className
  ].filter(Boolean).join(' ');

  if (!language) {
    return (
      <div className={pageClasses}>
        <div className="lesson-selection__error">
          <Title level={2}>Language not specified</Title>
          <p>Please select a language first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageClasses} {...props}>
      <div className="lesson-selection__container">
        {/* Header */}
        <div className="lesson-selection__header">
          <button 
            className="lesson-selection__back-btn"
            onClick={handleGoBack}
            aria-label="Go back"
          >
            ← Back
          </button>
          <div className="lesson-selection__title-section">
            <Title level={1} className="lesson-selection__title">
              {language.charAt(0).toUpperCase() + language.slice(1)} Lessons
            </Title>
            {level && (
              <p className="lesson-selection__subtitle">
                Level: {level}
              </p>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <section className="lesson-selection__categories">
          <Title level={2} className="lesson-selection__section-title">
            Choose Difficulty Level
          </Title>
          <div className="lesson-selection__category-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                title={category.name}
                description={category.description}
                color={category.color}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="lesson-selection__category-card"
              />
            ))}
          </div>
        </section>

        {/* Lessons Display */}
        {selectedCategory && (
          <section className="lesson-selection__lessons">
            <Title level={2} className="lesson-selection__section-title">
              Available Lessons ({selectedCategory})
            </Title>
            <div className="lesson-selection__lessons-grid">
              {getLessonsForCategory(selectedCategory).map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  title={lesson.title}
                  description={lesson.description}
                  duration={lesson.duration}
                  level={lesson.level}
                  isSelected={selectedLesson === lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className="lesson-selection__lesson-card"
                />
              ))}
            </div>
            {getLessonsForCategory(selectedCategory).length === 0 && (
              <div className="lesson-selection__no-lessons">
                <p>No lessons available for this category yet.</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Lesson Details Modal */}
      <LessonDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lesson={currentLesson}
        teacher={currentLesson ? teachers[currentLesson.teacher] : null}
        onConfirm={handleConfirmLesson}
      />
    </div>
  );
};

LessonSelection.propTypes = {
  variant: PropTypes.oneOf(['default', 'compact']),
  className: PropTypes.string
};

export default LessonSelection;
