import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faGraduationCap,
  faCrown,
  faArrowLeft,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Title, Button } from "@atoms";
import {
  LanguageCard,
  LevelCard,
  CategoryCard,
  LessonDetailsModal,
  LessonCard,
} from "@molecules";
import { lessonService, bookingService } from "@services";
import { useSelector } from "react-redux";
// Removed react-toastify dependency
import "./LessonSelection.scss";

// Import flag SVGs
import enFlag from "@assets/flags/en.svg";
import frFlag from "@assets/flags/fr.svg";
import cnFlag from "@assets/flags/cn.svg";

/**
 * Custom hook for managing notifications
 */
// const useNotifications = () => {
//   const [notifications, setNotifications] = useState([]);

//   const addNotification = useCallback((message, type = 'info') => {
//     const id = Date.now();
//     setNotifications(prev => [...prev, { id, message, type }]);
    
//     // Auto remove after 5 seconds
//     setTimeout(() => {
//       setNotifications(prev => prev.filter(notif => notif.id !== id));
//     }, 5000);
//   }, []);

//   const removeNotification = useCallback((id) => {
//     setNotifications(prev => prev.filter(notif => notif.id !== id));
//   }, []);

//   return {
//     notifications,
//     addNotification,
//     removeNotification,
//     success: (message) => addNotification(message, 'success'),
//     error: (message) => addNotification(message, 'error'),
//     info: (message) => addNotification(message, 'info'),
//   };
// };

// Constants
const DIFFICULTY_LEVELS = {
  easy: {
    id: "easy",
    apiLevel: "beginner",
    color: "green",
    icon: faPlay,
  },
  medium: {
    id: "medium", 
    apiLevel: "intermediate",
    color: "orange",
    icon: faGraduationCap,
  },
  hard: {
    id: "hard",
    apiLevel: "advanced", 
    color: "red",
    icon: faCrown,
  },
};

const FLAG_ASSETS = {
  en: enFlag,
  fr: frFlag,
  cn: cnFlag,
  english: enFlag,
  french: frFlag,
  chinese: cnFlag,
  anglais: enFlag,
  francais: frFlag,
  chinois: cnFlag,
};

const SELECTION_STEPS = {
  LANGUAGE: 'language',
  LEVEL: 'level', 
  CATEGORY: 'category',
  LESSON: 'lesson'
};

/**
 * Custom hook for managing selection state
 */
const useSelectionState = (searchParams) => {
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("language"));
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level"));
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category"));
  const [selectedLesson, setSelectedLesson] = useState(null);

  const resetFromStep = useCallback((step) => {
    switch (step) {
      case SELECTION_STEPS.LANGUAGE:
        setSelectedLanguage(null);
        setSelectedLevel(null);
        setSelectedCategory(null);
        setSelectedLesson(null);
        break;
      case SELECTION_STEPS.LEVEL:
        setSelectedLevel(null);
        setSelectedCategory(null);
        setSelectedLesson(null);
        break;
      case SELECTION_STEPS.CATEGORY:
        setSelectedCategory(null);
        setSelectedLesson(null);
        break;
      case SELECTION_STEPS.LESSON:
        setSelectedLesson(null);
        break;
      default:
        break;
    }
  }, []);

  const currentStep = useMemo(() => {
    if (!selectedLanguage) return SELECTION_STEPS.LANGUAGE;
    if (!selectedLevel) return SELECTION_STEPS.LEVEL;
    if (!selectedCategory) return SELECTION_STEPS.CATEGORY;
    return SELECTION_STEPS.LESSON;
  }, [selectedLanguage, selectedLevel, selectedCategory]);

  return {
    selectedLanguage,
    selectedLevel,
    selectedCategory,
    selectedLesson,
    setSelectedLanguage,
    setSelectedLevel,
    setSelectedCategory,
    setSelectedLesson,
    resetFromStep,
    currentStep,
  };
};

/**
 * Custom hook for API data management
 */
const useApiData = () => {
  const [data, setData] = useState({
    languages: [],
    categories: [],
    difficulties: [],
    lessons: [],
  });
  const [loading, setLoading] = useState({
    initial: false,
    lessons: false,
  });
  const [error, setError] = useState(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }));
      setError(null);

      const [languagesResponse, difficultiesResponse, categoriesResponse] = await Promise.all([
        lessonService.getLanguages(),
        lessonService.getAllDifficulty(),
        lessonService.getCategories(),
      ]);

      // Process languages
      const languages = Array.isArray(languagesResponse?.data)
        ? languagesResponse.data
        : Array.isArray(languagesResponse)
        ? languagesResponse
        : [];

      // Process difficulties
      const difficultyArray = difficultiesResponse?.data?.difficulties || [];
      const difficulties = Array.from(
        new Set(difficultyArray.map(d => d.difficulty?.toLowerCase()).filter(Boolean))
      );

      // Process categories
      const categories = Array.isArray(categoriesResponse?.data)
        ? categoriesResponse.data
        : Array.isArray(categoriesResponse)
        ? categoriesResponse
        : [];

      setData({
        languages,
        categories,
        difficulties,
        lessons: [],
      });
    } catch (err) {
      console.error("Error loading initial data:", err);
      setError("Erreur lors du chargement des données initiales");
      // Show error notification
      if (addNotification) addNotification("Erreur lors du chargement des données", 'error');
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, []);

  const loadLessons = useCallback(async (filters) => {
    try {
      setLoading(prev => ({ ...prev, lessons: true }));
      setError(null);

      const processedFilters = {
        ...filters,
        level: filters.level ? (DIFFICULTY_LEVELS[filters.level]?.apiLevel || filters.level) : undefined,
      };

      // Remove undefined values
      Object.keys(processedFilters).forEach(key => 
        processedFilters[key] === undefined && delete processedFilters[key]
      );

      const lessonsResponse = await lessonService.getFilteredLessons(processedFilters);
      const lessons = Array.isArray(lessonsResponse?.data?.lessons)
        ? lessonsResponse.data.lessons
        : [];

      setData(prev => ({ ...prev, lessons }));
    } catch (err) {
      console.error("Error loading lessons:", err);
      setError("Erreur lors du chargement des leçons");
      // Show error notification
      if (addNotification) addNotification("Erreur lors du chargement des leçons", 'error');
    } finally {
      setLoading(prev => ({ ...prev, lessons: false }));
    }
  }, []);

  return {
    data,
    loading,
    error,
    loadInitialData,
    loadLessons,
    clearError: () => setError(null),
  };
};

/**
 * LessonSelection component - Page for selecting lessons by language, level, category and difficulty
 */
const LessonSelection = ({ variant = "default", className = "", ...props }) => {
  const { t } = useTranslation(["pages", "common"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  
  // Notification state
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', action = null) => {
    const id = Date.now();
    const newNotification = { id, message, type, action };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after different durations based on type
    const duration = type === 'info-action' ? 10000 : 5000; // 10s for action notifications, 5s for others
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const showSuccess = useCallback((message) => addNotification(message, 'success'), [addNotification]);
  const showError = useCallback((message) => addNotification(message, 'error'), [addNotification]);
  const showInfo = useCallback((message) => addNotification(message, 'info'), [addNotification]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);

  // Custom hooks
  const selection = useSelectionState(searchParams);
  const api = useApiData();

  // Load initial data on mount
  useEffect(() => {
    api.loadInitialData();
  }, [api.loadInitialData]);

  // Load lessons when all required selections are made
  useEffect(() => {
    if (selection.selectedLanguage && selection.selectedLevel && selection.selectedCategory) {
      const filters = {
        language: selection.selectedLanguage.toLowerCase(),
        level: selection.selectedLevel.toLowerCase(),
        category: selection.selectedCategory.toLowerCase(),
      };
      api.loadLessons(filters);
    }
  }, [selection.selectedLanguage, selection.selectedLevel, selection.selectedCategory, api.loadLessons]);

  // Update URL params when selection changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selection.selectedLanguage) params.set("language", selection.selectedLanguage);
    if (selection.selectedLevel) params.set("level", selection.selectedLevel);
    if (selection.selectedCategory) params.set("category", selection.selectedCategory);
    
    setSearchParams(params, { replace: true });
  }, [selection.selectedLanguage, selection.selectedLevel, selection.selectedCategory, setSearchParams]);

  // Memoized computed values
  const difficultyMetadata = useMemo(() => {
    return api.data.difficulties.reduce((acc, difficulty) => {
      const config = DIFFICULTY_LEVELS[difficulty] || { id: difficulty, color: "blue", icon: faPlay };
      acc[difficulty] = {
        ...config,
        name: t(`lessons.difficulty.${config.apiLevel || difficulty}`, difficulty),
        description: t(`lessonSelection.levels.${config.apiLevel || difficulty}Desc`, ""),
      };
      return acc;
    }, {});
  }, [api.data.difficulties, t]);

  const filteredCategories = useMemo(() => {
    if (!selection.selectedLevel) return api.data.categories;
    return api.data.categories.filter(
      category => category.difficulty?.toLowerCase() === selection.selectedLevel.toLowerCase()
    );
  }, [api.data.categories, selection.selectedLevel]);

  const filteredLessons = useMemo(() => {
    return api.data.lessons.filter(lesson => {
      const matchesLanguage = !selection.selectedLanguage ||
        lesson.language?.id?.toLowerCase() === selection.selectedLanguage.toLowerCase();
      const matchesLevel = !selection.selectedLevel ||
        lesson.level?.toLowerCase() === (DIFFICULTY_LEVELS[selection.selectedLevel]?.apiLevel?.toLowerCase() || selection.selectedLevel.toLowerCase());
      const matchesCategory = !selection.selectedCategory ||
        lesson.category?.id?.toLowerCase() === selection.selectedCategory.toLowerCase();

      return matchesLanguage && matchesLevel && matchesCategory;
    });
  }, [api.data.lessons, selection.selectedLanguage, selection.selectedLevel, selection.selectedCategory]);

  // Event handlers
  const handleLanguageSelect = useCallback((languageId) => {
    selection.setSelectedLanguage(languageId);
    selection.resetFromStep(SELECTION_STEPS.LEVEL);
  }, [selection]);

  const handleLevelSelect = useCallback((levelId) => {
    selection.setSelectedLevel(levelId);
    selection.resetFromStep(SELECTION_STEPS.CATEGORY);
  }, [selection]);

  const handleCategorySelect = useCallback((categoryId) => {
    selection.setSelectedCategory(categoryId);
    selection.resetFromStep(SELECTION_STEPS.LESSON);
  }, [selection]);

  const handleLessonSelect = useCallback((lesson) => {
    setCurrentLesson(lesson);
    setIsModalOpen(true);
  }, []);

  const handleConfirmLesson = useCallback(async (lesson, teacher, selectedDate, selectedTime) => {
    try {
      if (!user?.id) {
        showError("Vous devez être connecté pour réserver une leçon");
        return;
      }

      const teacherId = lesson.teacherId || lesson.teacher?.id;
      if (!teacherId) {
        showError("Aucun professeur associé à cette leçon");
        return;
      }

      const bookingData = {
        userId: user.id,
        lessonId: lesson.id,
        teacherId,
        studentId: user.id,
        date: selectedDate,
        time: selectedTime,
      };

      await bookingService.createBooking(bookingData);
      setIsModalOpen(false);
      
      // Show success notification with action options
      showSuccess("Leçon réservée avec succès !");
      
      // Add a notification with navigation option
      setTimeout(() => {
        addNotification(
          "Voulez-vous voir votre calendrier ?", 
          'info-action',
          () => navigate("/calendar")
        );
      }, 1000);

    } catch (err) {
      console.error("Booking error:", err);
      showError("Erreur lors de la réservation de la leçon");
    }
  }, [user, showSuccess, showError, addNotification, navigate]);

  // Render notifications component
  const renderNotifications = () => {
    if (notifications.length === 0) return null;

    return (
      <div className="lesson-selection__notifications">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`lesson-selection__notification lesson-selection__notification--${notification.type}`}
          >
            <span>{notification.message}</span>
            <div className="lesson-selection__notification-actions">
              {notification.action && (
                <button 
                  className="lesson-selection__notification-action"
                  onClick={() => {
                    notification.action();
                    removeNotification(notification.id);
                  }}
                  aria-label="Exécuter l'action"
                >
                  Oui
                </button>
              )}
              <button 
                className="lesson-selection__notification-close"
                onClick={() => removeNotification(notification.id)}
                aria-label="Fermer la notification"
              >
                {notification.action ? 'Non' : '×'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleGoBack = useCallback(() => {
    switch (selection.currentStep) {
      case SELECTION_STEPS.LESSON:
        selection.resetFromStep(SELECTION_STEPS.CATEGORY);
        break;
      case SELECTION_STEPS.CATEGORY:
        selection.resetFromStep(SELECTION_STEPS.LEVEL);
        break;
      case SELECTION_STEPS.LEVEL:
        selection.resetFromStep(SELECTION_STEPS.LANGUAGE);
        break;
    }
  }, [selection.currentStep, selection.resetFromStep, navigate, showInfo, addNotification]);

  // Render helpers
  const renderError = () => {
    if (!api.error) return null;

    return (
      <div className="lesson-selection__error">
        <FontAwesomeIcon icon={faExclamationTriangle} />
        <p>{api.error}</p>
        <Button onClick={api.loadInitialData} variant="primary">
          {t("common.retry", "Réessayer")}
        </Button>
      </div>
    );
  };

  const renderLoadingSpinner = (text) => (
    <div className="lesson-selection__loading">
      <FontAwesomeIcon icon={faSpinner} spin />
      <p>{text}</p>
    </div>
  );

  const renderBreadcrumb = () => {
    if (!selection.selectedLanguage) return null;

    const items = [];
    
    if (selection.selectedLanguage) {
      const language = api.data.languages.find(l => l.id === selection.selectedLanguage);
      items.push(t(`lessonSelection.languages.${language?.code?.toLowerCase()}`, language?.name || selection.selectedLanguage));
    }
    
    if (selection.selectedLevel) {
      items.push(t(`levels.${selection.selectedLevel}`, difficultyMetadata[selection.selectedLevel]?.name || selection.selectedLevel));
    }
    
    if (selection.selectedCategory) {
      const category = api.data.categories.find(c => c.id === selection.selectedCategory);
      items.push(t(`lessons.categories.${category?.name?.toLowerCase()}`, category?.name || selection.selectedCategory));
    }

    return (
      <div className="lesson-selection__breadcrumb">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="breadcrumb-separator">→</span>}
            <span className="breadcrumb-item">{item}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const pageClasses = [
    "lesson-selection",
    `lesson-selection--${variant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={pageClasses} {...props}>
      {renderNotifications()}
      <div className="lesson-selection__container">
        {/* Header */}
        <header className="lesson-selection__header">
          <Button
            variant="primary"
            onClick={handleGoBack}
            className="lesson-selection__back-btn"
            aria-label={t("lessonSelection.backButton")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {t("lessonSelection.backButton")}
          </Button>

          <Title level={1} className="lesson-selection__title">
            {t("lessonSelection.title")}
          </Title>

          {renderBreadcrumb()}
          {renderError()}
        </header>

        <main className="lesson-selection__content">
          {/* Step 1: Language Selection */}
          {selection.currentStep === SELECTION_STEPS.LANGUAGE && (
            <section className="lesson-selection__step" aria-labelledby="language-title">
              <Title level={2} id="language-title" className="lesson-selection__step-title">
                {t("lessonSelection.chooseLanguage")}
              </Title>
              
              {api.loading.initial ? (
                renderLoadingSpinner(t("lessonSelection.loadingLanguages", "Chargement des langues..."))
              ) : (
                <div 
                  className="lesson-selection__options-grid lesson-selection__options-grid--languages"
                  role="radiogroup"
                  aria-labelledby="language-title"
                >
                  {api.data.languages.map((language) => (
                    <LanguageCard
                      key={language.id}
                      language={t(`lessonSelection.languages.${language.code?.toLowerCase()}`, language.name)}
                      flag={FLAG_ASSETS[language.code?.toLowerCase()] || enFlag}
                      isSelected={selection.selectedLanguage === language.id}
                      onClick={() => handleLanguageSelect(language.id)}
                      variant="default"
                      size="lg"
                      className="lesson-selection__language-card"
                      role="radio"
                      aria-checked={selection.selectedLanguage === language.id}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Step 2: Level Selection */}
          {selection.currentStep === SELECTION_STEPS.LEVEL && (
            <section className="lesson-selection__step" aria-labelledby="level-title">
              <Title level={2} id="level-title" className="lesson-selection__step-title">
                {t("lessonSelection.chooseLevel")}
              </Title>
              
              <div 
                className="lesson-selection__options-grid lesson-selection__options-grid--levels"
                role="radiogroup" 
                aria-labelledby="level-title"
              >
                {api.data.difficulties.map((difficulty) => {
                  const meta = difficultyMetadata[difficulty];
                  return (
                    <LevelCard
                      key={difficulty}
                      icon={meta?.icon}
                      title={t(`levels.${difficulty}`, meta?.name || difficulty)}
                      description={t(`levels.${meta?.description.toLowerCase()}Desc`, meta?.description || description)}
                      isSelected={selection.selectedLevel === difficulty}
                      onClick={() => handleLevelSelect(difficulty)}
                      variant="default"
                      className="lesson-selection__level-card"
                      role="radio"
                      aria-checked={selection.selectedLevel === difficulty}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Step 3: Category Selection */}
          {selection.currentStep === SELECTION_STEPS.CATEGORY && (
            <section className="lesson-selection__step" aria-labelledby="category-title">
              <Title level={2} id="category-title" className="lesson-selection__step-title">
                {t("lessonSelection.chooseCategory")}
              </Title>
              
              <div 
                className="lesson-selection__options-grid lesson-selection__options-grid--categories"
                role="radiogroup"
                aria-labelledby="category-title" 
              >
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={t(`lessonSelection.categories.${category.name}`, category.name)}
                    description={category.description || `Catégorie ${category.name}`}
                    color={category.color || "blue"}
                    isSelected={selection.selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    variant="default"
                    size="large"
                    className="lesson-selection__category-card"
                    role="radio"
                    aria-checked={selection.selectedCategory === category.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Step 4: Lesson Selection */}
          {selection.currentStep === SELECTION_STEPS.LESSON && (
            <section className="lesson-selection__step" aria-labelledby="lesson-title">
              <Title level={2} id="lesson-title" className="lesson-selection__step-title">
                {t("lessonSelection.availableLessons")}
              </Title>
              
              {api.loading.lessons ? (
                renderLoadingSpinner(t("lessonSelection.loadingLessons", "Chargement des leçons..."))
              ) : (
                <>
                  {filteredLessons.length > 0 ? (
                    <div className="lesson-selection__lessons-grid">
                      {filteredLessons.map((lesson) => (
                        <LessonCard
                          key={lesson.id}
                          title={lesson.title}
                          description={lesson.description}
                          duration={lesson.duration}
                          level={lesson.level}
                          price={lesson.price || t("common.free", "Gratuit")}
                          isSelected={selection.selectedLesson === lesson.id}
                          onClick={() => handleLessonSelect(lesson)}
                          className="lesson-selection__lesson-card"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="lesson-selection__no-lessons">
                      <p>{t("lessonSelection.noLessonsAvailable")}</p>
                      <div className="lesson-selection__no-lessons-actions">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            selection.resetFromStep(SELECTION_STEPS.CATEGORY);
                            showInfo("Essayez une autre catégorie pour cette combinaison.");
                          }}
                        >
                          {t("lessonSelection.changeCategory", "Changer de catégorie")}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            selection.resetFromStep(SELECTION_STEPS.LEVEL);
                            showInfo("Essayez un autre niveau pour cette langue.");
                          }}
                        >
                          {t("lessonSelection.changeLevel", "Changer de niveau")}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </main>
      </div>

      {/* Lesson Details Modal */}
      <LessonDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lesson={currentLesson}
        onConfirm={handleConfirmLesson}
      />
    </div>
  );
};

LessonSelection.propTypes = {
  variant: PropTypes.oneOf(["default", "compact"]),
  className: PropTypes.string,
};

export default React.memo(LessonSelection);
