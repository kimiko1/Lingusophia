import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchLessons, 
  fetchLessonById, 
  createLesson, 
  updateLesson, 
  deleteLesson,
  clearError,
  clearCurrentLesson 
} from '../store/slices/lessonsSlice';

export const useLessons = () => {
  const dispatch = useDispatch();
  const { lessons, currentLesson, isLoading, error } = useSelector(state => state.lessons);

  const handleFetchLessons = async () => {
    try {
      await dispatch(fetchLessons()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleFetchLessonById = async (id) => {
    try {
      await dispatch(fetchLessonById(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleCreateLesson = async (lessonData) => {
    try {
      await dispatch(createLesson(lessonData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleUpdateLesson = async (id, lessonData) => {
    try {
      await dispatch(updateLesson({ id, lessonData })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleDeleteLesson = async (id) => {
    try {
      await dispatch(deleteLesson(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const clearLessonsError = () => {
    dispatch(clearError());
  };

  const clearCurrentLessonData = () => {
    dispatch(clearCurrentLesson());
  };

  return {
    lessons,
    currentLesson,
    isLoading,
    error,
    fetchLessons: handleFetchLessons,
    fetchLessonById: handleFetchLessonById,
    createLesson: handleCreateLesson,
    updateLesson: handleUpdateLesson,
    deleteLesson: handleDeleteLesson,
    clearError: clearLessonsError,
    clearCurrentLesson: clearCurrentLessonData,
  };
};
