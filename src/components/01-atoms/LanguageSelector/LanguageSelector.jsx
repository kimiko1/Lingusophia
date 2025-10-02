import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getAvailableLanguages } from '@i18n';
import './LanguageSelector.scss';

/**
 * LanguageSelector - Composant pour changer de langue
 */
const LanguageSelector = ({ 
  variant = 'dropdown',
  size = 'md',
  className = '',
  showFlag = true,
  showNativeName = true,
  ...props 
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
  };

  const classes = [
    'language-selector',
    `language-selector--${variant}`,
    `language-selector--${size}`,
    className
  ].filter(Boolean).join(' ');

  const getFlag = (code) => {
    const flags = {
      en: '🇺🇸',
      fr: '🇫🇷',
      zh: '🇨🇳'
    };
    return flags[code] || '🌐';
  };

  if (variant === 'tabs') {
    return (
      <div className={classes} {...props}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            className={`language-selector__tab ${
              currentLanguage === lang.code ? 'language-selector__tab--active' : ''
            }`}
            onClick={() => handleLanguageChange(lang.code)}
            aria-label={`Switch to ${lang.name}`}
          >
            {showFlag && <span className="language-selector__flag">{getFlag(lang.code)}</span>}
            <span className="language-selector__code">{lang.code.toUpperCase()}</span>
            {showNativeName && (
              <span className="language-selector__native-name">{lang.nativeName}</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={classes} {...props}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            className={`language-selector__button ${
              currentLanguage === lang.code ? 'language-selector__button--active' : ''
            }`}
            onClick={() => handleLanguageChange(lang.code)}
            aria-label={`Switch to ${lang.name}`}
          >
            {showFlag && <span className="language-selector__flag">{getFlag(lang.code)}</span>}
            {showNativeName ? lang.nativeName : lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={classes} {...props}>
      <select
        className="language-selector__select"
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        aria-label="Select language"
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {showFlag ? `${getFlag(lang.code)} ` : ''}
            {showNativeName ? lang.nativeName : lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

LanguageSelector.propTypes = {
  variant: PropTypes.oneOf(['dropdown', 'tabs', 'buttons']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  showFlag: PropTypes.bool,
  showNativeName: PropTypes.bool
};

export default LanguageSelector;
