import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Utilise le backend HTTP pour charger les traductions
  .use(Backend)
  // Détecte automatiquement la langue du navigateur
  .use(LanguageDetector)
  // Initialise react-i18next
  .use(initReactI18next)
  // Configuration
  .init({
    // Langue de fallback si la détection échoue
    fallbackLng: 'en',
    
    // Langues supportées
    supportedLngs: ['en', 'fr', 'zh'],
    
    // Débug en développement
    debug: import.meta.env.VITE_NODE_ENV === 'development',
    
    // Configuration du détecteur de langue
    detection: {
      // Ordre de détection : localStorage -> navigateur -> cookie -> etc.
      order: ['localStorage', 'navigator', 'cookie', 'htmlTag'],
      
      // Cache la langue sélectionnée dans localStorage
      caches: ['localStorage'],
      
      // Clé pour stocker la langue dans localStorage
      lookupLocalStorage: 'i18nextLng',
      
      // Ne pas détecter la langue depuis les sous-domaines
      lookupFromSubdomainIndex: 0,
      
      // Options pour la détection depuis le navigateur
      convertDetectedLanguage: (lng) => {
        // Convertit les codes de langue longs en courts (ex: 'en-US' -> 'en')
        const shortCode = lng.split('-')[0];
        // Retourne la langue supportée ou 'en' par défaut
        return ['en', 'fr', 'zh'].includes(shortCode) ? shortCode : 'en';
      }
    },
    
    // Configuration du backend
    backend: {
      // Chemin vers les fichiers de traduction
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      
      // Chemin pour sauvegarder (non utilisé ici)
      addPath: '/locales/{{lng}}/{{ns}}.missing.json'
    },
    
    // Namespaces par défaut
    defaultNS: 'common',
    ns: ['common', 'pages'],
    
    // Configuration de l'interpolation
    interpolation: {
      // React échappe déjà les valeurs
      escapeValue: false
    },
    
    // Options React
    react: {
      // Utilise Suspense pour le chargement asynchrone
      useSuspense: true,
      
      // Bind i18n instance to react
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      
      // Options de transformation
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em']
    },
    
    // Gestion des clés manquantes
    saveMissing: import.meta.env.VITE_NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        console.warn(`Missing translation: ${lng}.${ns}.${key}`);
      }
    },
    
    // Options de chargement
    load: 'languageOnly', // Charge seulement 'en' au lieu de 'en-US'
    preload: ['en', 'fr', 'zh'], // Précharge toutes les langues supportées
    
    // Options de nettoyage
    cleanCode: true,
    
    // Pluralisation
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Timeout pour le chargement
    partialBundledLanguages: true
  });

// Fonction pour changer la langue
export const changeLanguage = (lng) => {
  return i18n.changeLanguage(lng);
};

// Fonction pour obtenir la langue actuelle
export const getCurrentLanguage = () => {
  return i18n.language;
};

// Fonction pour obtenir les langues disponibles
export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' }
  ];
};

export default i18n;
