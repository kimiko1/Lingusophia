import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, Input, Card } from '../../01-atoms';
import './LessonForm.scss';

/**
 * LessonForm component - Formulaire pour créer/éditer une leçon
 * @param {Object} props - Component props
 * @param {Object} props.lesson - Leçon à éditer (null pour création)
 * @param {Function} props.onSave - Callback lors de la sauvegarde
 * @param {Function} props.onCancel - Callback lors de l'annulation
 * @param {boolean} props.isLoading - État de chargement
 * @param {string} props.mode - Mode du formulaire (create/edit/view)
 */
const LessonForm = ({ 
  lesson = null,
  onSave,
  onCancel,
  isLoading = false,
  mode = 'create',
  className = '',
  ...props
}) => {
  const { t } = useTranslation('pages');
  const { t: tCommon } = useTranslation('common');
  const [formData, setFormData] = useState({
    title: '',
    language: 'English',
    level: 'Beginner',
    duration: '30',
    price: '',
    teacher: '',
    description: '',
    category: 'easy',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  // Récupérer l'utilisateur connecté (pour le rôle Teacher)
  const getCurrentTeacherName = () => {
    if (window && window.localStorage) {
      try {
        const userStr = window.localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj && userObj.role === 'Teacher') {
            return `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim();
          }
        }
      } catch {}
    }
    return '';
  };

  useEffect(() => {
    let teacherValue = lesson?.teacher || '';
    // Si le rôle est Teacher, préremplir avec prénom + nom et rendre non modifiable
    const teacherFromUser = getCurrentTeacherName();
    if (teacherFromUser) {
      teacherValue = teacherFromUser;
    }
    setFormData({
      title: lesson?.title || '',
      language: lesson?.language || 'English',
      level: lesson?.level || 'Beginner',
      duration: (typeof lesson?.duration === 'string' ? lesson.duration : String(lesson?.duration || '30')).replace(' min', ''),
      price: lesson?.price?.toString() || '',
      teacher: teacherValue,
      description: lesson?.description || '',
      category: lesson?.category || 'easy',
      status: lesson?.status || 'Active'
    });
  }, [lesson]);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = tCommon('forms.required');
    }

    if (!formData.teacher.trim()) {
      newErrors.teacher = tCommon('forms.required');
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = t('admin.form.validation.priceInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const lessonData = {
      ...formData,
      id: lesson?.id || Date.now(), // Simuler un ID pour les nouvelles leçons
      duration: `${formData.duration} min`,
      price: parseFloat(formData.price),
      bookings: lesson?.bookings || 0,
      rating: lesson?.rating || 0
    };

    onSave && onSave(lessonData);
  };

  const isReadOnly = mode === 'view';
  const isCreate = mode === 'create';

  const formClasses = [
    'lesson-form',
    className
  ].filter(Boolean).join(' ');

  return (
    <Card className={formClasses} {...props}>
      <form onSubmit={handleSubmit} className="lesson-form__form">
        <div className="lesson-form__fields">
          <div className="lesson-form__field-group">
            <div className="lesson-form__field">
              <label className="lesson-form__label">
                {t('admin.table.title')} *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('admin.form.placeholders.lessonTitle')}
                error={errors.title}
                disabled={isReadOnly}
                className="lesson-form__input"
              />
            </div>
          </div>

          <div className="lesson-form__field-group">
            <div className="lesson-form__field">
              <label className="lesson-form__label">
                {t('admin.table.language')}
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={isReadOnly}
                className="lesson-form__select"
              >
                <option value="English">{t('lessonSelection.languages.english')}</option>
                <option value="French">{t('lessonSelection.languages.french')}</option>
                <option value="Chinese">{t('lessonSelection.languages.chinese')}</option>
                <option value="Spanish">{t('lessonSelection.languages.spanish')}</option>
                <option value="German">{t('lessonSelection.languages.german')}</option>
                <option value="Italian">{t('lessonSelection.languages.italian')}</option>
              </select>
            </div>

            <div className="lesson-form__field">
              <label className="lesson-form__label">
                {t('admin.table.level')}
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                disabled={isReadOnly}
                className="lesson-form__select"
              >
                <option value="Beginner">{t('lessons.difficulty.beginner')}</option>
                <option value="Intermediate">{t('lessons.difficulty.intermediate')}</option>
                <option value="Advanced">{t('lessons.difficulty.advanced')}</option>
              </select>
            </div>
          </div>

          <div className="lesson-form__field-group">
            <div className="lesson-form__field">
              <label className="lesson-form__label">
                {t('admin.form.duration')}
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                disabled={isReadOnly}
                className="lesson-form__select"
              >
                <option value="30">30 {t('admin.form.minutes')}</option>
                <option value="45">45 {t('admin.form.minutes')}</option>
                <option value="60">60 {t('admin.form.minutes')}</option>
                <option value="90">90 {t('admin.form.minutes')}</option>
              </select>
            </div>

            <div className="lesson-form__field">
              <label className="lesson-form__label">
                {t('admin.table.price')} * (€)
              </label>
              <Input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="25.00"
                error={errors.price}
                disabled={isReadOnly}
                className="lesson-form__input"
              />
            </div>
          </div>

          <div className="lesson-form__field-group">
            <div className="lesson-form__field">
              <label className="lesson-form__label">
                {t('admin.form.category')}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isReadOnly}
                className="lesson-form__select"
              >
                <option value="easy">{t('lessons.categories.easy')}</option>
                <option value="medium">{t('lessons.categories.medium')}</option>
                <option value="hard">{t('lessons.categories.hard')}</option>
              </select>
            </div>

            <div className="lesson-form__field">
              <label className="lesson-form__label">
                {t('admin.table.status')}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isReadOnly}
                className="lesson-form__select"
              >
                <option value="Active">{t('admin.form.status.active')}</option>
                <option value="Inactive">{t('admin.form.status.inactive')}</option>
                <option value="Draft">{t('admin.form.status.draft')}</option>
              </select>
            </div>
          </div>

          <div className="lesson-form__field">
            <label className="lesson-form__label">
              {t('admin.form.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('admin.form.placeholders.lessonDescription')}
              disabled={isReadOnly}
              className="lesson-form__textarea"
              rows="4"
            />
          </div>
        </div>

        {!isReadOnly && (
          <div className="lesson-form__actions">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="lesson-form__cancel-btn"
            >
              <FontAwesomeIcon icon={faTimes} />
              {t('admin.modal.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="lesson-form__save-btn"
            >
              <FontAwesomeIcon icon={faSave} />
              {isLoading ? t('admin.form.saving') : (isCreate ? t('admin.form.create') : t('admin.form.update'))}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

LessonForm.propTypes = {
  lesson: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  isLoading: PropTypes.bool,
  mode: PropTypes.oneOf(['create', 'edit', 'view']),
  className: PropTypes.string
};

export default LessonForm;
