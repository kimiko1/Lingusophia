import React, { useState } from 'react';
import { Button, Card, Title, Input } from '../../01-atoms';
import { PageLayout } from '../../04-templates';
import './Settings.scss';

/**
 * Settings - Page des paramètres de l'application
 */
const Settings = () => {
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
    alert('Paramètres sauvegardés avec succès !');
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }
    if (passwords.new.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères !');
      return;
    }
    // Logique de changement de mot de passe
    alert('Mot de passe modifié avec succès !');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      // Logique de suppression de compte
      alert('Compte supprimé. Redirection vers la page d\'accueil...');
    }
  };

  return (
    <PageLayout title="Paramètres" subtitle="Gérez vos préférences et votre compte">
      <div className="settings">
        {/* Notifications */}
        <Card className="settings__section">
          <Title level={2} size="lg" className="settings__section-title">
            Notifications
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
                  <strong>Notifications par email</strong>
                  <small>Recevoir des notifications importantes par email</small>
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
                  <strong>Notifications push</strong>
                  <small>Recevoir des notifications sur votre navigateur</small>
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
                  <strong>Rappels de leçons</strong>
                  <small>Recevoir des rappels avant vos leçons programmées</small>
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
                  <strong>Emails marketing</strong>
                  <small>Recevoir des offres promotionnelles et nouveautés</small>
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Confidentialité */}
        <Card className="settings__section">
          <Title level={2} size="lg" className="settings__section-title">
            Confidentialité
          </Title>
          <div className="settings__options">
            <div className="settings__option">
              <label className="settings__option-text">
                <strong>Visibilité du profil</strong>
                <small>Qui peut voir votre profil</small>
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                className="settings__select"
              >
                <option value="public">Public</option>
                <option value="friends">Amis uniquement</option>
                <option value="private">Privé</option>
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
                  <strong>Afficher les progrès</strong>
                  <small>Permettre aux autres de voir vos progrès d'apprentissage</small>
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
                  <strong>Collecte de données analytiques</strong>
                  <small>Aider à améliorer l'application en partageant des données anonymes</small>
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Préférences */}
        <Card className="settings__section">
          <Title level={2} size="lg" className="settings__section-title">
            Préférences
          </Title>
          <div className="settings__options">
            <div className="settings__option">
              <label className="settings__option-text">
                <strong>Langue de l'interface</strong>
                <small>Langue d'affichage de l'application</small>
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
                <strong>Thème</strong>
                <small>Apparence de l'interface</small>
              </label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                className="settings__select"
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Automatique</option>
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
                  <strong>Lecture automatique</strong>
                  <small>Lancer automatiquement les contenus audio</small>
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
                  <strong>Effets sonores</strong>
                  <small>Activer les sons d'interface</small>
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Sécurité */}
        <Card className="settings__section">
          <Title level={2} size="lg" className="settings__section-title">
            Sécurité
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
                  <strong>Authentification à deux facteurs</strong>
                  <small>Ajouter une couche de sécurité supplémentaire</small>
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
                  <strong>Alertes de connexion</strong>
                  <small>Recevoir une notification lors de nouvelles connexions</small>
                </span>
              </label>
            </div>
          </div>

          {/* Changement de mot de passe */}
          <div className="settings__password-section">
            <Title level={3} size="md">Changer le mot de passe</Title>
            <div className="settings__password-fields">
              <Input
                type="password"
                placeholder="Mot de passe actuel"
                value={passwords.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
              />
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={passwords.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
              />
              <Button
                variant="outline"
                onClick={handleChangePassword}
                disabled={!passwords.current || !passwords.new || !passwords.confirm}
              >
                Changer le mot de passe
              </Button>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="settings__actions">
          <Button variant="primary" onClick={handleSaveSettings} size="lg">
            Sauvegarder les paramètres
          </Button>
          
          <Card className="settings__danger-zone">
            <Title level={3} size="md" className="settings__danger-title">
              Zone de danger
            </Title>
            <p className="settings__danger-text">
              La suppression de votre compte est irréversible. Toutes vos données seront perdues.
            </p>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Supprimer mon compte
            </Button>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
