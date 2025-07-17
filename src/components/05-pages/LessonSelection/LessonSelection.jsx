import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faGraduationCap, faCrown } from '@fortawesome/free-solid-svg-icons';
import { Title, Button } from '../../01-atoms';
import { LanguageCard, LevelCard, CategoryCard, LessonDetailsModal } from '../../02-molecules';
import LessonCard from '../../02-molecules/LessonCard';
import { lessonService, bookingService } from '../../../services';
import './LessonSelection.scss';
import { useAuth } from '../../../contexts/AuthContext';

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

  // API states
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Get initial values from URL params
  const urlLanguage = searchParams.get('language');
  const urlCategory = searchParams.get('category');
  const urlLevel = searchParams.get('level');

  // Initialize from URL params
  useEffect(() => {
    if (urlLanguage) setSelectedLanguage(urlLanguage);
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlLevel) setSelectedLevel(urlLevel);
  }, [urlLanguage, urlLevel]);

  // Charger les leçons quand tout est sélectionné
  useEffect(() => {
    if (selectedLanguage && selectedLevel && selectedCategory) {
      loadLessons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, selectedLevel, selectedCategory]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [fetchedLanguages, fetchedDifficulty, fetchedCategory] = await Promise.all([
        lessonService.getLanguages(),
        lessonService.getAllDifficulty(),
        lessonService.getCategories()
      ]);
      // Extract languages
      const langs = Array.isArray(fetchedLanguages?.data) ? fetchedLanguages.data : (Array.isArray(fetchedLanguages) ? fetchedLanguages : []);
      setLanguages(langs);
      // Extract difficulties from API shape: { data: { difficulties: [ { difficulty: 'easy' }, ... ] } }
      const diffArr = fetchedDifficulty?.data?.difficulties || [];
      // Remove duplicates and normalize
      const uniqueDiffs = Array.from(new Set(diffArr.map(d => d.difficulty?.toLowerCase())));
      setDifficulties(uniqueDiffs);

      // Extract categories
      const categories = Array.isArray(fetchedCategory?.data) ? fetchedCategory.data : (Array.isArray(fetchedCategory) ? fetchedCategory : []);
      setCategories(categories);
      // Categories and lessons can be loaded later as needed
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriesForLevel = () => {
    if (!selectedLevel) return categories;
    // On suppose que category.difficulty est en minuscule ('easy', 'medium', 'hard')
    return categories.filter(
      (category) => category.difficulty?.toLowerCase() === selectedLevel.toLowerCase()
    );
  };

  // Mapping pour les niveaux API <-> DB
  const levelMap = {
    easy: 'beginner',
    medium: 'intermediate',
    hard: 'advanced'
  };

  const loadLessons = async () => {
    try {
      setLoading(true);
      const filters = {};

      if (selectedLanguage) filters.language = selectedLanguage.toLowerCase();
      if (selectedLevel) filters.level = levelMap[selectedLevel] || selectedLevel.toLowerCase();
      if (selectedCategory) filters.category = selectedCategory.toLowerCase();

      const fetchedLessons = await lessonService.getFilteredLessons(filters);
      setLessons(
  Array.isArray(fetchedLessons?.data?.lessons)
    ? fetchedLessons.data.lessons
    : []
);
    } catch (err) {
      setError('Erreur lors du chargement des leçons');
      console.error('Erreur lors du chargement des leçons:', err);
    } finally {
      setLoading(false);
    }
  };

  // Available levels (difficulties from API)
  const difficultyMeta = {
    easy: {
      id: 'easy',
      name: t('lessons.difficulty.beginner'),
      description: t('lessonSelection.levels.beginnerDesc'),
      color: 'green',
      icon: faPlay
    },
    medium: {
      id: 'medium',
      name: t('lessons.difficulty.intermediate'),
      description: t('lessonSelection.levels.intermediateDesc'),
      color: 'orange',
      icon: faGraduationCap
    },
    hard: {
      id: 'hard',
      name: t('lessons.difficulty.advanced'),
      description: t('lessonSelection.levels.advancedDesc'),
      color: 'red',
      icon: faCrown
    }
  };
  // Default flags for languages
  const defaultFlags = {
    'english': enFlag,
    'french': frFlag,
    'chinese': cnFlag,
    'anglais': enFlag,
    'francais': frFlag,
    'chinois': cnFlag
  };

  // Get lessons for selected combination
  const getFilteredLessons = () => {
    if (!selectedLanguage && !selectedLevel && !selectedCategory) {
      return lessons;
    }

    return lessons.filter(lesson => {
      const matchesLanguage = !selectedLanguage ||
        lesson.language?.id?.toLowerCase() === selectedLanguage.toLowerCase();
      const matchesLevel = !selectedLevel ||
        lesson.level?.toLowerCase() === (levelMap[selectedLevel]?.toLowerCase() || selectedLevel.toLowerCase());
      const matchesCategory = !selectedCategory ||
        lesson.category?.id?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesLanguage && matchesLevel && matchesCategory;
    });
  };

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

  // Get lessons for selected combination
  const getLessonsForSelection = () => {
    return getFilteredLessons();
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
  const handleConfirmLesson = async (lesson, teacher) => {
    try {
      // Utilise l'id de l'utilisateur connecté
      const userId = user?.id;
      if (!userId) {
        setError("Utilisateur non connecté");
        return;
      }
      await bookingService.createBooking(lesson.id, userId);
      setIsModalOpen(false);
      navigate('/calendar');
    } catch (err) {
      setError('Erreur lors de la réservation de la leçon');
      console.error('Erreur lors de la réservation de la leçon:', err);
    }
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
                {selectedLanguage}
              </span>
            )}
            {selectedLevel && (
              <>
                <span className="breadcrumb-separator">→</span>
                <span className="breadcrumb-item">
                  {difficultyMeta[selectedLevel]?.name || selectedLevel}
                </span>
              </>
            )}
            {selectedCategory && (
              <>
                <span className="breadcrumb-separator">→</span>
                <span className="breadcrumb-item">
                  {selectedCategory}
                </span>
              </>)}
          </div>

          {/* Error message */}
          {error && (
            <div className="lesson-selection__error">
              <p>{error}</p>
              <Button onClick={loadInitialData} variant="primary">
                Réessayer
              </Button>
            </div>
          )}
        </div>

        {/* Step 1: Language Selection */}
        {!selectedLanguage && (
          <section className="lesson-selection__step">
            <Title level={2} className="lesson-selection__step-title">
              {t('lessonSelection.chooseLanguage')}
            </Title>
            {loading ? (
              <div className="lesson-selection__loading">
                <p>Chargement des langues...</p>
              </div>
            ) : (
              <div className="lesson-selection__options-grid lesson-selection__options-grid--languages">
                {Array.isArray(languages) && languages.map((language) => (
                  <LanguageCard
                    key={language.id}
                    language={language.name}
                    flag={language.flag_svg ? (`../../../src/${language.flag_svg}`) : (defaultFlags[language.code?.toLowerCase()] || enFlag)}
                    isSelected={selectedLanguage === language.id}
                    onClick={() => handleLanguageSelect(language.id)}
                    variant="default"
                    size="lg"
                    className="lesson-selection__language-card"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Step 2: Difficulty Selection (from API) */}
        {selectedLanguage && !selectedLevel && (
          <section className="lesson-selection__step">
            <Title level={2} className="lesson-selection__step-title">
              {t('lessonSelection.chooseLevel')}
            </Title>
            <div className="lesson-selection__options-grid lesson-selection__options-grid--levels">
              {difficulties.length === 0 ? (
                <div className="lesson-selection__loading">
                  <p>Chargement des niveaux...</p>
                </div>
              ) : (
                difficulties.map(diff => {
                  const meta = difficultyMeta[diff] || { id: diff, name: diff };
                  // Use translation for label
                  let label = '';
                  if (diff === 'easy') label = t('lessons.difficulty.beginner');
                  else if (diff === 'medium') label = t('lessons.difficulty.intermediate');
                  else if (diff === 'hard') label = t('lessons.difficulty.advanced');
                  else label = diff;
                  return (
                    <LevelCard
                      key={meta.id}
                      icon={meta.icon}
                      title={label}
                      description={meta.description}
                      difficulty={meta.id}
                      isSelected={selectedLevel === meta.id}
                      onClick={() => handleLevelSelect(meta.id)}
                      variant="default"
                      className="lesson-selection__level-card"
                    />
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* Step 3: Category Selection */}
        {selectedLanguage && selectedLevel && !selectedCategory && (
          <section className="lesson-selection__step">
            <Title level={2} className="lesson-selection__step-title">
              {t('lessonSelection.chooseCategory')}
            </Title>
            {loading ? (
              <div className="lesson-selection__loading">
                <p>Chargement des catégories...</p>
              </div>
            ) : (
              <div className="lesson-selection__options-grid lesson-selection__options-grid--categories">
                {getCategoriesForLevel().map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category.name}
                    description={category.description || `Catégorie ${category.name}`}
                    color={category.color || 'blue'}
                    isSelected={selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    variant="default"
                    size="large"
                    className="lesson-selection__category-card"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Step 4: Lesson Selection */}
        {selectedLanguage && selectedLevel && selectedCategory && (
          <section className="lesson-selection__step">
            <Title level={2} className="lesson-selection__step-title">
              {t('lessonSelection.availableLessons')}
            </Title>
            {loading ? (
              <div className="lesson-selection__loading">
                <p>Chargement des leçons...</p>
              </div>
            ) : (
              <>
                <div className="lesson-selection__lessons-grid">
                  {getLessonsForSelection().map((lesson) => {
                    // Format duration as string (e.g. '1h 15min' or '30 min')
                    let durationStr = '';
                    if (typeof lesson.duration === 'number' && !isNaN(lesson.duration)) {
                      const hours = Math.floor(lesson.duration / 60);
                      const minutes = lesson.duration % 60;
                      if (hours > 0) {
                        durationStr = `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
                      } else {
                        durationStr = `${minutes} min`;
                      }
                    } else {
                      durationStr = lesson.duration || '30 min';
                    }
                    return (
                      <LessonCard
                        key={lesson.id}
                        title={lesson.title}
                        description={lesson.description}
                        duration={lesson.duration}
                        level={lesson.level}
                        price={lesson.price || 'Gratuit'}
                        isSelected={selectedLesson === lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className="lesson-selection__lesson-card"
                      />
                    );
                  })}
                </div>
                {getLessonsForSelection().length === 0 && (
                  <div className="lesson-selection__no-lessons">
                    <p>{t('lessonSelection.noLessonsAvailable')}</p>
                  </div>
                )}
              </>
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
