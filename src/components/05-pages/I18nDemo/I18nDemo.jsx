import React from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage, getAvailableLanguages } from '../../i18n';
import { LanguageSelector, Title, Button } from '../01-atoms';
import './I18nDemo.scss';

/**
 * I18nDemo - Composant de démonstration pour tester l'internationalisation
 */
const I18nDemo = () => {
  const { t, i18n } = useTranslation(['common', 'pages']);

  const currentLang = getCurrentLanguage();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="i18n-demo">
      <div className="i18n-demo__container">
        <Title level={1} className="i18n-demo__title">
          {t('pages:home.title')}
        </Title>
        
        <div className="i18n-demo__info">
          <p><strong>Langue actuelle:</strong> {currentLang}</p>
          <p><strong>Langues disponibles:</strong> {availableLanguages.map(lang => lang.name).join(', ')}</p>
        </div>

        <div className="i18n-demo__sections">
          <section className="i18n-demo__section">
            <Title level={2}>Navigation</Title>
            <ul>
              <li>{t('common:navigation.home')}</li>
              <li>{t('common:navigation.myLessons')}</li>
              <li>{t('common:navigation.calendar')}</li>
              <li>{t('common:navigation.customerReviews')}</li>
              <li>{t('common:navigation.profile')}</li>
              <li>{t('common:navigation.settings')}</li>
            </ul>
          </section>

          <section className="i18n-demo__section">
            <Title level={2}>Boutons</Title>
            <div className="i18n-demo__buttons">
              <Button variant="primary">{t('common:buttons.getStarted')}</Button>
              <Button variant="secondary">{t('common:buttons.learnMore')}</Button>
              <Button variant="ghost">{t('common:buttons.cancel')}</Button>
            </div>
          </section>

          <section className="i18n-demo__section">
            <Title level={2}>Messages</Title>
            <div className="i18n-demo__messages">
              <p className="success">{t('common:messages.success')}</p>
              <p className="error">{t('common:messages.error')}</p>
              <p className="loading">{t('common:messages.loading')}</p>
              <p className="welcome">{t('common:messages.welcome')}</p>
            </div>
          </section>

          <section className="i18n-demo__section">
            <Title level={2}>Sélecteur de langue</Title>
            <div className="i18n-demo__language-selectors">
              <div className="i18n-demo__selector">
                <h4>Dropdown</h4>
                <LanguageSelector variant="dropdown" />
              </div>
              <div className="i18n-demo__selector">
                <h4>Boutons</h4>
                <LanguageSelector variant="buttons" />
              </div>
              <div className="i18n-demo__selector">
                <h4>Tabs</h4>
                <LanguageSelector variant="tabs" />
              </div>
            </div>
          </section>

          <section className="i18n-demo__section">
            <Title level={2}>Changement manuel</Title>
            <div className="i18n-demo__manual-change">
              {availableLanguages.map(lang => (
                <Button 
                  key={lang.code}
                  variant={currentLang === lang.code ? 'primary' : 'outline'}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.nativeName}
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default I18nDemo;
