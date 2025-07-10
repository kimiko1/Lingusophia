import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faGraduationCap, faCrown } from '@fortawesome/free-solid-svg-icons';
import { Title, Button } from '../../01-atoms';
import { LanguageCard, LevelCard, CategoryCard, LessonDetailsModal } from '../../02-molecules';
import LessonCard from '../../02-molecules/LessonCard';
import './LessonSelection.scss';

// Import flag SVGs
import enFlag from '../../../assets/flags/en.svg';
import frFlag from '../../../assets/flags/fr.svg';
import cnFlag from '../../../assets/flags/cn.svg';

/**
 * LessonSelection component - Page for selecting lessons by language, level, category and difficulty
 * @param {Object} props - Component props
 * @param {string} props.variant - Page style variant
 * @param {string} props.className - Additional CSS classes
 */
const LessonSelection = ({ 
  variant = 'default',
  className = '',
  ...props
}) => {
  const { t } = useTranslation(['pages', 'common']);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Selection states
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  
  // Get initial values from URL params
  const urlLanguage = searchParams.get('language');
  const urlLevel = searchParams.get('level');

  // Initialize from URL params
  useEffect(() => {
    if (urlLanguage) setSelectedLanguage(urlLanguage);
    if (urlLevel) setSelectedLevel(urlLevel);
  }, [urlLanguage, urlLevel]);

  // Available languages
  const languages = [
    { id: 'english', name: t('common:languages.en'), flag: enFlag, color: 'blue' },
    { id: 'french', name: t('common:languages.fr'), flag: frFlag, color: 'red' },
    { id: 'chinese', name: t('common:languages.zh'), flag: cnFlag, color: 'yellow' }
  ];

  // Available levels
  const levels = [
    { 
      id: 'beginner', 
      name: t('lessons.difficulty.beginner'), 
      description: t('lessonSelection.levels.beginnerDesc'), 
      color: 'green',
      icon: faPlay,
      difficulty: 'Beginner'
    },
    { 
      id: 'intermediate', 
      name: t('lessons.difficulty.intermediate'), 
      description: t('lessonSelection.levels.intermediateDesc'), 
      color: 'orange',
      icon: faGraduationCap,
      difficulty: 'Intermediate'
    },
    { 
      id: 'advanced', 
      name: t('lessons.difficulty.advanced'), 
      description: t('lessonSelection.levels.advancedDesc'), 
      color: 'red',
      icon: faCrown,
      difficulty: 'Advanced'
    }
  ];

  // Categories data
  const categories = [
    { id: 'easy', name: t('lessons.categories.easy'), color: 'green', description: t('lessonSelection.categories.easyDesc') },
    { id: 'medium', name: t('lessons.categories.medium'), color: 'orange', description: t('lessonSelection.categories.mediumDesc') },
    { id: 'hard', name: t('lessons.categories.hard'), color: 'red', description: t('lessonSelection.categories.hardDesc') }
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

  // Lessons data (organized by language, then by category, then by level)
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
        },
        {
          id: 'grammar-intermediate',
          title: 'English Grammar Essentials',
          description: 'Master essential grammar rules for intermediate speakers.',
          teacher: 'sarah-johnson',
          duration: '50 minutes',
          level: 'Intermediate',
          price: '$40',
          goals: [
            'Understand tense structures',
            'Use conditionals correctly',
            'Master question formation',
            'Apply grammar in context'
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
        },
        {
          id: 'advanced-writing',
          title: 'Advanced Writing Skills',
          description: 'Develop sophisticated writing skills for academic and professional contexts.',
          teacher: 'john-smith',
          duration: '55 minutes',
          level: 'Advanced',
          price: '$45',
          goals: [
            'Write complex texts',
            'Use advanced vocabulary',
            'Structure arguments effectively',
            'Edit and revise professionally'
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
        },
        {
          id: 'french-numbers',
          title: 'Numbers and Time in French',
          description: 'Learn to count and tell time in French.',
          teacher: 'sarah-johnson',
          duration: '35 minutes',
          level: 'Beginner',
          price: '$30',
          goals: [
            'Count from 1 to 100',
            'Tell time accurately',
            'Use numbers in context',
            'Practice pronunciation'
          ]
        }
      ],
      medium: [
        {
          id: 'french-conversation',
          title: 'French Conversation Practice',
          description: 'Practice everyday French conversations.',
          teacher: 'sarah-johnson',
          duration: '45 minutes',
          level: 'Intermediate',
          price: '$40',
          goals: [
            'Hold natural conversations',
            'Use idiomatic expressions',
            'Improve pronunciation',
            'Build confidence'
          ]
        }
      ],
      hard: [
        {
          id: 'french-literature',
          title: 'French Literature Analysis',
          description: 'Analyze classic French literary works.',
          teacher: 'john-smith',
          duration: '60 minutes',
          level: 'Advanced',
          price: '$55',
          goals: [
            'Analyze literary texts',
            'Understand cultural context',
            'Develop critical thinking',
            'Express complex ideas'
          ]
        }
      ]
    },
    chinese: {
      easy: [
        {
          id: 'chinese-basics',
          title: 'Chinese Fundamentals',
          description: 'Introduction to Mandarin Chinese basics.',
          teacher: 'sarah-johnson',
          duration: '40 minutes',
          level: 'Beginner',
          price: '$35',
          goals: [
            'Learn basic pinyin',
            'Practice pronunciation',
            'Write simple characters',
            'Use basic greetings'
          ]
        }
      ],
      medium: [
        {
          id: 'chinese-conversation',
          title: 'Chinese Daily Conversation',
          description: 'Practice common Chinese conversations.',
          teacher: 'john-smith',
          duration: '50 minutes',
          level: 'Intermediate',
          price: '$45',
          goals: [
            'Hold basic conversations',
            'Use proper tones',
            'Understand sentence structure',
            'Build vocabulary'
          ]
        }
      ],
      hard: [
        {
          id: 'chinese-business',
          title: 'Business Chinese',
          description: 'Professional Chinese for business contexts.',
          teacher: 'john-smith',
          duration: '60 minutes',
          level: 'Advanced',
          price: '$60',
          goals: [
            'Master business terminology',
            'Conduct professional meetings',
            'Write business documents',
            'Understand cultural etiquette'
          ]
        }
      ]
    }
  };

  // Get lessons for selected combination
  const getLessonsForSelection = () => {
    if (!selectedLanguage || !selectedLevel || !selectedCategory) return [];
    
    const languageKey = selectedLanguage.toLowerCase();
    const levelKey = selectedLevel.toLowerCase();
    const categoryKey = selectedCategory.toLowerCase();
    
    if (!lessonsData[languageKey] || !lessonsData[languageKey][categoryKey]) return [];
    
    return lessonsData[languageKey][categoryKey].filter(lesson => 
      lesson.level.toLowerCase() === levelKey
    );
  };

  // Handle selections
  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId);
    setSelectedLevel(null);
    setSelectedCategory(null);
    setSelectedLesson(null);
  };

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    setSelectedCategory(null);
    setSelectedLesson(null);
  };

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
    console.log('Booking lesson:', lesson, 'with teacher:', teacher);
    setIsModalOpen(false);
    navigate('/calendar'); // Redirect to calendar for scheduling
  };

  // Reset selections to go back
  const handleReset = () => {
    setSelectedLanguage(null);
    setSelectedLevel(null);
    setSelectedCategory(null);
    setSelectedLesson(null);
  };

  // Go back one step
  const handleGoBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
      setSelectedLesson(null);
    } else if (selectedLevel) {
      setSelectedLevel(null);
      setSelectedCategory(null);
      setSelectedLesson(null);
    } else if (selectedLanguage) {
      setSelectedLanguage(null);
      setSelectedLevel(null);
      setSelectedCategory(null);
      setSelectedLesson(null);
    } else {
      navigate(-1);
    }
  };

  const pageClasses = [
    'lesson-selection',
    `lesson-selection--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={pageClasses} {...props}>
      <div className="lesson-selection__container">
        {/* Header with back button and progress */}
        <div className="lesson-selection__header">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="lesson-selection__back-btn"
          >
            ← {t('lessonSelection.backButton')}
          </Button>
          
          <Title level={1} className="lesson-selection__title">
            {t('lessonSelection.title')}
          </Title>

          {/* Progress breadcrumb */}
          <div className="lesson-selection__breadcrumb">
            {selectedLanguage && (
              <span className="breadcrumb-item">
                {languages.find(l => l.id === selectedLanguage)?.name}
              </span>
            )}
            {selectedLevel && (
              <>
                <span className="breadcrumb-separator">→</span>
                <span className="breadcrumb-item">
                  {levels.find(l => l.id === selectedLevel)?.name}
                </span>
              </>
            )}
            {selectedCategory && (
              <>
                <span className="breadcrumb-separator">→</span>
                <span className="breadcrumb-item">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Step 1: Language Selection */}
        {!selectedLanguage && (
          <section className="lesson-selection__step">
            <Title level={2} className="lesson-selection__step-title">
              {t('lessonSelection.chooseLanguage')}
            </Title>
            <div className="lesson-selection__options-grid lesson-selection__options-grid--languages">
              {languages.map((language) => (
                <LanguageCard
                  key={language.id}
                  language={language.name}
                  flag={language.flag}
                  isSelected={selectedLanguage === language.id}
                  onClick={() => handleLanguageSelect(language.id)}
                  variant="default"
                  size="lg"
                  className="lesson-selection__language-card"
                />
              ))}
            </div>
          </section>
        )}

        {/* Step 2: Level Selection */}
        {selectedLanguage && !selectedLevel && (
          <section className="lesson-selection__step">
            <Title level={2} className="lesson-selection__step-title">
              {t('lessonSelection.chooseLevel')}
            </Title>
            <div className="lesson-selection__options-grid lesson-selection__options-grid--levels">
              {levels.map((level) => (
                <LevelCard
                  key={level.id}
                  icon={level.icon}
                  title={level.name}
                  description={level.description}
                  difficulty={level.difficulty}
                  isSelected={selectedLevel === level.id}
                  onClick={() => handleLevelSelect(level.id)}
                  variant="default"
                  className="lesson-selection__level-card"
                />
              ))}
            </div>
          </section>
        )}

        {/* Step 3: Category Selection */}
        {selectedLanguage && selectedLevel && !selectedCategory && (
          <section className="lesson-selection__step">
            <Title level={2} className="lesson-selection__step-title">
              {t('lessonSelection.chooseCategory')}
            </Title>
            <div className="lesson-selection__options-grid lesson-selection__options-grid--categories">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category.name}
                  description={category.description}
                  color={category.color}
                  isSelected={selectedCategory === category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  variant="default"
                  size="large"
                  className="lesson-selection__category-card"
                />
              ))}
            </div>
          </section>
        )}

        {/* Step 4: Lesson Selection */}
        {selectedLanguage && selectedLevel && selectedCategory && (
          <section className="lesson-selection__step">
            <Title level={2} className="lesson-selection__step-title">
              {t('lessonSelection.availableLessons')}
            </Title>
            <div className="lesson-selection__lessons-grid">
              {getLessonsForSelection().map((lesson) => (
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
            {getLessonsForSelection().length === 0 && (
              <div className="lesson-selection__no-lessons">
                <p>{t('lessonSelection.noLessonsAvailable')}</p>
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
