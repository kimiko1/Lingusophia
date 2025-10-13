import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, Input, Card } from '@atoms';
import './UserForm.scss';

/**
 * UserForm component - Formulaire pour créer/éditer un utilisateur
 * @param {Object} props - Component props
 * @param {Object} props.user - Utilisateur à éditer (null pour création)
 * @param {Function} props.onSave - Callback lors de la sauvegarde
 * @param {Function} props.onCancel - Callback lors de l'annulation
 * @param {boolean} props.isLoading - État de chargement
 * @param {string} props.mode - Mode du formulaire (create/edit/view)
 */
const UserForm = ({ 
  user = null,
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
    name: '',
    email: '',
    role: 'Student',
    status: 'Active',
    phone: '',
    nativeLanguage: 'French',
    currentLevel: 'Beginner'
  });
  const [errors, setErrors] = useState({});

  // Initialiser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Student',
        status: user.status || 'Active',
        phone: user.phone || '',
        nativeLanguage: user.nativeLanguage || 'French',
        currentLevel: user.currentLevel || 'Beginner'
      });
    }
  }, [user]);

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

    if (!formData.name.trim()) {
      newErrors.name = tCommon('forms.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = tCommon('forms.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = tCommon('forms.email');
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

    const userData = {
      ...formData,
      id: user?.id || Date.now(), // Simuler un ID pour les nouveaux utilisateurs
      joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
      lastLogin: user?.lastLogin || new Date().toISOString().split('T')[0],
      lessonsCompleted: user?.lessonsCompleted || 0,
      totalSpent: user?.totalSpent || 0
    };

    onSave && onSave(userData);
  };

  const isReadOnly = mode === 'view';
  const isCreate = mode === 'create';

  const formClasses = [
    'user-form',
    className
  ].filter(Boolean).join(' ');

  return (
    <Card className={formClasses} {...props}>
      <form onSubmit={handleSubmit} className="user-form__form">
        <div className="user-form__fields">
          <div className="user-form__field-group">
            <div className="user-form__field">
              <label className="user-form__label">
                {tCommon('forms.firstName')} *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={tCommon('forms.firstName')}
                error={errors.name}
                disabled={isReadOnly}
                className="user-form__input"
              />
            </div>

            <div className="user-form__field">
              <label className="user-form__label">
                {tCommon('forms.email')} *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={tCommon('forms.email')}
                error={errors.email}
                disabled={isReadOnly}
                className="user-form__input"
              />
            </div>
          </div>

          <div className="user-form__field-group">
            <div className="user-form__field">
              <label className="user-form__label">
                {t('pages:admin.table.role')}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isReadOnly}
                className="user-form__select"
              >
                <option value="Student">{t('pages:admin.form.roles.student')}</option>
                <option value="Teacher">{t('pages:admin.form.roles.teacher')}</option>
                <option value="Admin">{t('pages:admin.form.roles.admin')}</option>
              </select>
            </div>

            <div className="user-form__field">
              <label className="user-form__label">
                {t('pages:admin.table.status')}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isReadOnly}
                className="user-form__select"
              >
                <option value="Active">{t('pages:admin.form.status.active')}</option>
                <option value="Inactive">{t('pages:admin.form.status.inactive')}</option>
                <option value="Pending">{t('pages:admin.form.status.pending')}</option>
              </select>
            </div>
          </div>

          <div className="user-form__field-group">
            <div className="user-form__field">
              <label className="user-form__label">
                {tCommon('forms.phone')}
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={tCommon('forms.phone')}
                disabled={isReadOnly}
                className="user-form__input"
              />
            </div>

            <div className="user-form__field">
              <label className="user-form__label">
                {tCommon('forms.language')}
              </label>
              <select
                name="nativeLanguage"
                value={formData.nativeLanguage}
                onChange={handleChange}
                disabled={isReadOnly}
                className="user-form__select"
              >
                <option value="French">{t('lessonSelection.languages.french')}</option>
                <option value="English">{t('lessonSelection.languages.english')}</option>
                <option value="Chinese">{t('lessonSelection.languages.chinese')}</option>
                <option value="Spanish">{t('lessonSelection.languages.spanish')}</option>
                <option value="German">{t('lessonSelection.languages.german')}</option>
                <option value="Italian">{t('lessonSelection.languages.italian')}</option>
              </select>
            </div>
          </div>

          <div className="user-form__field">
            <label className="user-form__label">
              {tCommon('forms.level')}
            </label>
            <select
              name="currentLevel"
              value={formData.currentLevel}
              onChange={handleChange}
              disabled={isReadOnly}
              className="user-form__select"
            >
              <option value="Beginner">{t('lessons.difficulty.beginner')}</option>
              <option value="Intermediate">{t('lessons.difficulty.intermediate')}</option>
              <option value="Advanced">{t('lessons.difficulty.advanced')}</option>
            </select>
          </div>
        </div>

        {!isReadOnly && (
          <div className="user-form__actions">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="user-form__cancel-btn"
            >
              <FontAwesomeIcon icon={faTimes} />
              {t('pages:admin.modal.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="user-form__save-btn"
            >
              <FontAwesomeIcon icon={faSave} />
              {isLoading ? t('pages:admin.form.saving') : (isCreate ? t('pages:admin.form.create') : t('pages:admin.form.update'))}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

UserForm.propTypes = {
  user: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  isLoading: PropTypes.bool,
  mode: PropTypes.oneOf(['create', 'edit', 'view']),
  className: PropTypes.string
};

export default UserForm;
