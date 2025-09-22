import React, { useState, useEffect } from 'react';
import { lessonService } from '@services';
import PropTypes from 'prop-types';
import { useAuth } from '@contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, Input, Card } from '@atoms';
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
  const { user } = useAuth();
  const { t } = useTranslation('pages');
  const { t: tCommon } = useTranslation('common');
  const [formData, setFormData] = useState({
    title: '',
    language: '', 
    level: 'Beginner',
    duration: '30',
    price: '',
    teacher: '',
    description: '',
    category: 'easy',
    status: 'Active'
  });

  const [languages, setLanguages] = useState([]);
  const [errors, setErrors] = useState({});

  // Données dynamiques depuis l'API
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([
    { id: 'Beginner', name: t('lessons.difficulty.beginner') },
    { id: 'Intermediate', name: t('lessons.difficulty.intermediate') },
    { id: 'Advanced', name: t('lessons.difficulty.advanced') }
  ]);
  const [durations, setDurations] = useState([
    { id: '30', name: `30 ${t('admin.form.minutes')}` },
    { id: '45', name: `45 ${t('admin.form.minutes')}` },
    { id: '60', name: `60 ${t('admin.form.minutes')}` },
    { id: '90', name: `90 ${t('admin.form.minutes')}` }
  ]);
  const [statuses, setStatuses] = useState([
    { id: 'Active', name: t('admin.form.status.active') },
    { id: 'Inactive', name: t('admin.form.status.inactive') },
    { id: 'Draft', name: t('admin.form.status.draft') }
  ]);

  // Charger les listes dynamiques depuis l'API si dispo
  useEffect(() => {
    lessonService.getLanguages().then((data) => {
      const langs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (data.languages || []));
      setLanguages(langs);
      if (!formData.language && Array.isArray(langs) && langs.length > 0) {
        setFormData(prev => ({ ...prev, language: langs[0].id }));
      }
    });
    lessonService.getCategories().then((data) => {
      const cats = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (data.categories || []));
      setCategories(cats);
      if (!formData.category && Array.isArray(cats) && cats.length > 0) {
        setFormData(prev => ({ ...prev, category: cats[0].id }));
      }
    });
    // Si le backend fournit des niveaux, durées, statuts dynamiques :
    if (lessonService.getLevels) {
      lessonService.getLevels().then((data) => {
        const lvls = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (data.levels || []));
        if (lvls.length > 0) setLevels(lvls);
      });
    }
    if (lessonService.getDurations) {
      lessonService.getDurations().then((data) => {
        const durs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (data.durations || []));
        if (durs.length > 0) setDurations(durs);
      });
    }
    if (lessonService.getStatuses) {
      lessonService.getStatuses().then((data) => {
        const stats = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (data.statuses || []));
        if (stats.length > 0) setStatuses(stats);
      });
    }
    // eslint-disable-next-line
  }, []);

  // Récupérer l'utilisateur connecté (pour le rôle Teacher)
  const getCurrentTeacherName = () => {
    if (user) {
      try {
        if (user.role === 'Teacher') {
          return `${user.firstName || ''} ${user.lastName || ''}`.trim();
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
    setFormData(prev => ({
      ...prev,
      title: lesson?.title || '',
      language: lesson?.language_id || (Array.isArray(languages) && languages[0]?.id) || '',
      level: lesson?.level || 'Beginner',
      duration: (typeof lesson?.duration === 'string' ? lesson.duration : String(lesson?.duration || '30')).replace(' min', ''),
      price: lesson?.price?.toString() || '',
      teacher: teacherValue,
      description: lesson?.description || '',
      category: lesson?.category_id || (Array.isArray(categories) && categories[0]?.id) || '',
      status: lesson?.status || 'Active'
    }));
    // eslint-disable-next-line
  }, [lesson, user, languages]);

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
    console.log('LessonForm - validateForm appelé avec formData:', formData);
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

    console.log('LessonForm - Erreurs de validation:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    console.log('LessonForm - handleSubmit appelé');
    e.preventDefault();
    
    console.log('LessonForm - formData avant validation:', formData);
    if (!validateForm()) {
      console.log('LessonForm - Validation échouée, erreurs:', errors);
      return;
    }

    // Convertir les données selon le schéma de BDD
    const lessonData = {
      title: formData.title,
      description: formData.description,
      language_id: formData.language, // id réel
      category_id: formData.category, // id réel
      teacher_id: user?.id || 'teacher-uuid',
      level: formData.level,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      status: formData.status,
      max_students: 1,
      content: null,
      prerequisites: null,
      learning_objectives: null,
      materials: null
    };

    // Ajouter l'ID seulement en mode édition
    if (lesson?.id) {
      lessonData.id = lesson.id;
    }

    console.log('LessonForm - Données converties pour API:', lessonData);
    console.log('LessonForm - Appel onSave avec:', lessonData);
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
                {t('admin.form.teacher')} *
              </label>
              <Input
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                placeholder="Nom du professeur"
                error={errors.teacher}
                disabled={true}
                className="lesson-form__input"
              />
            </div>

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
                onChange={e => {
                  handleChange(e);
                }}
                disabled={isReadOnly}
                className="lesson-form__select"
              >
                <option value="">{t('lessonSelection.languages.select')}</option>
                {Array.isArray(languages) && languages.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name || lang.label || lang.code}</option>
                ))}
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
                <option value="">{t('lessons.difficulty.select', 'Sélectionner un niveau')}</option>
                {Array.isArray(levels) && levels.map(lvl => (
                  <option key={lvl.id} value={lvl.id}>{lvl.name || lvl.label || lvl.id}</option>
                ))}
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
                <option value="">{t('admin.form.durationSelect', 'Sélectionner une durée')}</option>
                {Array.isArray(durations) && durations.map(dur => (
                  <option key={dur.id} value={dur.id}>{dur.name || dur.label || dur.id}</option>
                ))}
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
                <option value="">{t('lessons.categories.select')}</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name || cat.label || cat.code}</option>
                ))}
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
                <option value="">{t('admin.form.statusSelect', 'Sélectionner un statut')}</option>
                {Array.isArray(statuses) && statuses.map(stat => (
                  <option key={stat.id} value={stat.id}>{stat.name || stat.label || stat.id}</option>
                ))}
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
