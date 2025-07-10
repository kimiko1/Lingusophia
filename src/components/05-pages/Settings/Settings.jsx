import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Title, Input } from '../../01-atoms';
import { PageLayout } from '../../04-templates';
import './Settings.scss';

/**
 * Settings - Page des paramètres de l'application
 */
const Settings = () => {
  const { t } = useTranslation('pages');
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      lessonReminders: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'friends',
      showProgress: true,
      dataCollection: false
    },
    preferences: {
      language: 'fr',
      theme: 'light',
      autoplay: true,
      soundEffects: true
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

  const handleSaveSettings = () => {
    // Logique de sauvegarde des paramètres
    alert(t('messages.success', { ns: 'common' }));
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert(t('settings.messages.passwordMismatch'));
      return;
    }
    if (passwords.new.length < 8) {
      alert(t('settings.messages.passwordTooShort'));
      return;
    }
    // Logique de changement de mot de passe
    alert(t('settings.messages.passwordChanged'));
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('settings.messages.confirmDeleteAccount'))) {
      // Logique de suppression de compte
      alert(t('settings.messages.accountDeleted'));
    }
  };

  return (
    <PageLayout title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <div className="settings">
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
