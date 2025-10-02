import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Card, Title, Input } from '@atoms';
import { PageLayout } from '@templates';
import { userService } from '@services';
import './Settings.scss';

/**
 * Settings - Page des paramètres de l'application
 */
const Settings = () => {
  const { t } = useTranslation('pages');
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: false,
      pushNotifications: false,
      lessonReminders: false,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'private',
      showProgress: false,
      dataCollection: false
    },
    preferences: {
      language: 'fr',
      theme: 'light',
      autoplay: false,
      soundEffects: false
    },
    account: {
      twoFactorAuth: false,
      loginAlerts: true
    }
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Charger les paramètres utilisateur au montage du composant
  useEffect(() => {
    if (user?.id) {
      loadUserSettings();
    }
  }, [user?.id]);

  const loadUserSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await userService.getUserSettings(user.id);
      setSettings(userSettings);
    } catch (err) {
      setError('Erreur lors du chargement des paramètres');
      console.error('Erreur lors du chargement des paramètres:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await userService.updateUserSettings(user.id, settings);
      setSuccessMessage(t('messages.success', { ns: 'common' }));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde des paramètres');
      console.error('Erreur lors de la sauvegarde:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setError(t('settings.messages.passwordMismatch'));
      return;
    }
    if (passwords.new.length < 8) {
      setError(t('settings.messages.passwordTooShort'));
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setSuccessMessage(t('settings.messages.passwordChanged'));
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erreur lors du changement de mot de passe');
      console.error('Erreur lors du changement de mot de passe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t('settings.messages.confirmDeleteAccount'))) {
      try {
        setLoading(true);
        await userService.deleteAccount(user.id);
        // Rediriger vers la page de connexion ou déconnexion
        window.location.href = '/login';
      } catch (err) {
        setError('Erreur lors de la suppression du compte');
        console.error('Erreur lors de la suppression du compte:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <PageLayout title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <div className="settings">
        {/* Messages de statut */}
        {error && (
          <div className="settings__message settings__message--error">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="settings__message settings__message--success">
            {successMessage}
          </div>
        )}

        {loading && (
          <div className="settings__loading">
            <p>{t('common:loading')}</p>
          </div>
        )}
        {/* Notifications */}
        <Card className="settings__section">
          <Title level={2} size="lg" className="settings__section-title">
            {t('settings.sections.notifications')}
          </Title>
          <div className="settings__options">
            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.notifications.emailNotifications')}</strong>
                  <small>{t('settings.notifications.emailNotificationsDesc')}</small>
                </span>
              </label>
            </div>

            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.notifications.pushNotifications')}</strong>
                  <small>{t('settings.notifications.pushNotificationsDesc')}</small>
                </span>
              </label>
            </div>

            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.lessonReminders}
                  onChange={(e) => handleSettingChange('notifications', 'lessonReminders', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.notifications.lessonReminders')}</strong>
                  <small>{t('settings.notifications.lessonRemindersDesc')}</small>
                </span>
              </label>
            </div>

            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.marketingEmails}
                  onChange={(e) => handleSettingChange('notifications', 'marketingEmails', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.notifications.marketingEmails')}</strong>
                  <small>{t('settings.notifications.marketingEmailsDesc')}</small>
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Confidentialité */}
        <Card className="settings__section">
          <Title level={2} size="lg" className="settings__section-title">
            {t('settings.sections.privacy')}
          </Title>
          <div className="settings__options">
            <div className="settings__option">
              <label className="settings__option-text">
                <strong>{t('settings.privacy.profileVisibility')}</strong>
                <small>{t('settings.privacy.profileVisibilityDesc')}</small>
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                className="settings__select"
              >
                <option value="public">{t('settings.privacy.visibilityOptions.public')}</option>
                <option value="friends">{t('settings.privacy.visibilityOptions.friends')}</option>
                <option value="private">{t('settings.privacy.visibilityOptions.private')}</option>
              </select>
            </div>

            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.privacy.showProgress}
                  onChange={(e) => handleSettingChange('privacy', 'showProgress', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.privacy.showProgress')}</strong>
                  <small>{t('settings.privacy.showProgressDesc')}</small>
                </span>
              </label>
            </div>

            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.privacy.dataCollection}
                  onChange={(e) => handleSettingChange('privacy', 'dataCollection', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.privacy.dataCollection')}</strong>
                  <small>{t('settings.privacy.dataCollectionDesc')}</small>
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Préférences */}
        <Card className="settings__section">
          <Title level={2} size="lg" className="settings__section-title">
            {t('settings.sections.preferences')}
          </Title>
          <div className="settings__options">
            <div className="settings__option">
              <label className="settings__option-text">
                <strong>{t('settings.preferences.language')}</strong>
                <small>{t('settings.preferences.languageDesc')}</small>
              </label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                className="settings__select"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div className="settings__option">
              <label className="settings__option-text">
                <strong>{t('settings.preferences.theme')}</strong>
                <small>{t('settings.preferences.themeDesc')}</small>
              </label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                className="settings__select"
              >
                <option value="light">{t('settings.preferences.themeOptions.light')}</option>
                <option value="dark">{t('settings.preferences.themeOptions.dark')}</option>
                <option value="auto">{t('settings.preferences.themeOptions.auto')}</option>
              </select>
            </div>

            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.preferences.autoplay}
                  onChange={(e) => handleSettingChange('preferences', 'autoplay', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.preferences.autoplay')}</strong>
                  <small>{t('settings.preferences.autoplayDesc')}</small>
                </span>
              </label>
            </div>

            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.preferences.soundEffects}
                  onChange={(e) => handleSettingChange('preferences', 'soundEffects', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.preferences.soundEffects')}</strong>
                  <small>{t('settings.preferences.soundEffectsDesc')}</small>
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Sécurité */}
        <Card className="settings__section">
          <Title level={2} size="lg" className="settings__section-title">
            {t('settings.sections.security')}
          </Title>
          <div className="settings__options">
            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.account.twoFactorAuth}
                  onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.security.twoFactorAuth')}</strong>
                  <small>{t('settings.security.twoFactorAuthDesc')}</small>
                </span>
              </label>
            </div>

            <div className="settings__option">
              <label className="settings__option-label">
                <input
                  type="checkbox"
                  checked={settings.account.loginAlerts}
                  onChange={(e) => handleSettingChange('account', 'loginAlerts', e.target.checked)}
                  className="settings__checkbox"
                />
                <span className="settings__option-text">
                  <strong>{t('settings.security.loginAlerts')}</strong>
                  <small>{t('settings.security.loginAlertsDesc')}</small>
                </span>
              </label>
            </div>
          </div>

          {/* Changement de mot de passe */}
          <div className="settings__password-section">
            <Title level={3} size="md">{t('settings.security.changePassword')}</Title>
            <div className="settings__password-fields">
              <Input
                type="password"
                placeholder={t('settings.security.currentPassword')}
                value={passwords.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
              />
              <Input
                type="password"
                placeholder={t('settings.security.newPassword')}
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
              />
              <Input
                type="password"
                placeholder={t('settings.security.confirmPassword')}
                value={passwords.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
              />
              <Button
                variant="outline"
                onClick={handleChangePassword}
                disabled={!passwords.current || !passwords.new || !passwords.confirm}
              >
                {t('settings.security.changePasswordButton')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="settings__actions">
          <Button variant="primary" onClick={handleSaveSettings} size="lg">
            {t('settings.actions.saveSettings')}
          </Button>
          
          <Card className="settings__danger-zone">
            <Title level={3} size="md" className="settings__danger-title">
              {t('settings.sections.dangerZone')}
            </Title>
            <p className="settings__danger-text">
              {t('settings.actions.deleteAccountDesc')}
            </p>
            <Button variant="danger" onClick={handleDeleteAccount}>
              {t('settings.actions.deleteAccount')}
            </Button>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
