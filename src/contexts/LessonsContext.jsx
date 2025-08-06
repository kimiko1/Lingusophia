import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { lessonService } from '@services';

const LessonsContext = createContext();

export const useLessons = () => {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error('useLessons must be used within a LessonsProvider');
  }
  return context;
};

export const LessonsProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchLessons = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lessonService.getLessons(filters);
      setLessons(response);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des leçons');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLessonsByLanguage = useCallback(async (language) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lessonService.getLessonsByLanguage(language);
      setLessons(response);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des leçons');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLessonsByLevel = useCallback(async (level) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lessonService.getLessonsByLevel(level);
      setLessons(response);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des leçons');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLessonsByCategory = useCallback(async (category) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lessonService.getLessonsByCategory(category);
      setLessons(response);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des leçons');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLessonById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lessonService.getLessonById(id);
      setCurrentLesson(response);
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de la leçon');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLesson = useCallback(async (lessonData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lessonService.createLesson(lessonData);
      setLessons(prev => [...prev, response]);
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la leçon');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLesson = useCallback(async (id, lessonData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lessonService.updateLesson(id, lessonData);
      setLessons(prev => prev.map(lesson => 
        lesson.id === id ? response : lesson
      ));
      if (currentLesson?.id === id) {
        setCurrentLesson(response);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour de la leçon');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentLesson]);

  const deleteLesson = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await lessonService.deleteLesson(id);
      setLessons(prev => prev.filter(lesson => lesson.id !== id));
      if (currentLesson?.id === id) {
        setCurrentLesson(null);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression de la leçon');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentLesson]);

  const markLessonComplete = useCallback(async (lessonId, completionData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lessonService.markLessonComplete(lessonId, completionData);
      setLessons(prev => prev.map(lesson => 
        lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
      ));
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la validation de la leçon');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    // State
    lessons,
    currentLesson,
    isLoading,
    error,

    // Actions
    fetchLessons,
    fetchLessonsByLanguage,
    fetchLessonsByLevel,
    fetchLessonsByCategory,
    fetchLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
    markLessonComplete,
    clearError,
    
    // Setters (for advanced use cases)
    setCurrentLesson,
    setLessons
  };

  return (
    <LessonsContext.Provider value={value}>
      {children}
    </LessonsContext.Provider>
  );
};

LessonsProvider.propTypes = {
  children: PropTypes.node.isRequired
};
