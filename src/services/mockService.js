/**
 * Service de gestion des endpoints et des données mockées
 * Évite les appels inutiles aux endpoints non disponibles
 */

const KNOWN_UNAVAILABLE_ENDPOINTS = new Set();
const MOCK_DATA_CACHE = new Map();

/**
 * Marque un endpoint comme non disponible
 */
export const markEndpointUnavailable = (endpoint) => {
  KNOWN_UNAVAILABLE_ENDPOINTS.add(endpoint);
};

/**
 * Vérifie si un endpoint est marqué comme non disponible
 */
export const isEndpointUnavailable = (endpoint) => {
  return KNOWN_UNAVAILABLE_ENDPOINTS.has(endpoint);
};

/**
 * Met en cache des données mockées pour un endpoint
 */
export const cacheMockData = (endpoint, data) => {
  MOCK_DATA_CACHE.set(endpoint, data);
};

/**
 * Récupère les données mockées en cache pour un endpoint
 */
export const getCachedMockData = (endpoint) => {
  return MOCK_DATA_CACHE.get(endpoint);
};

/**
 * Données mockées pour différents endpoints
 */
export const MOCK_DATA = {
  recentLessons: (userId, limit = 5) => [
    {
      id: 1,
      title: 'Leçon d\'introduction',
      language: 'anglais',
      level: 'débutant',
      teacher: 'Sarah Johnson',
      date: new Date().toISOString(),
      duration: 30,
      completedAt: new Date().toISOString(),
      progress: 100
    },
    {
      id: 2,
      title: 'Vocabulaire de base',
      language: 'anglais',
      level: 'débutant',
      teacher: 'Mike Brown',
      date: new Date(Date.now() - 86400000).toISOString(),
      duration: 45,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      progress: 75
    },
    {
      id: 3,
      title: 'Grammaire fondamentale',
      language: 'anglais',
      level: 'débutant',
      teacher: 'Emma Wilson',
      date: new Date(Date.now() - 172800000).toISOString(),
      duration: 60,
      completedAt: new Date(Date.now() - 172800000).toISOString(),
      progress: 90
    }
  ].slice(0, limit),

  userStats: (userId) => ({
    lessonsCompleted: 12,
    hoursStudied: 25,
    streak: 7,
    favoriteLanguage: 'anglais',
    totalProgress: 65,
    achievements: [
      { id: 1, name: 'Premier pas', description: 'Première leçon complétée' },
      { id: 2, name: 'Studieux', description: '10 leçons complétées' }
    ]
  }),

  learningHistory: (userId, filters = {}) => ({
    history: [
      {
        id: 1,
        date: new Date().toISOString(),
        lesson: 'Leçon d\'introduction',
        language: 'anglais',
        timeSpent: 1800, // 30 minutes en secondes
        score: 85
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString(),
        lesson: 'Vocabulaire de base',
        language: 'anglais',
        timeSpent: 2400, // 40 minutes en secondes
        score: 92
      },
      {
        id: 3,
        date: new Date(Date.now() - 172800000).toISOString(),
        lesson: 'Grammaire fondamentale',
        language: 'anglais',
        timeSpent: 3600, // 60 minutes en secondes
        score: 88
      }
    ]
  }),

  userSettings: (userId) => ({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      lessonReminders: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'private',
      showProgress: true,
      dataCollection: false
    },
    preferences: {
      language: 'fr',
      theme: 'light',
      autoplay: false,
      soundEffects: true
    },
    account: {
      twoFactorAuth: false,
      loginAlerts: true
    }
  }),

  allLessons: () => [
    {
      id: 1,
      title: 'Introduction à l\'anglais',
      description: 'Apprenez les bases de l\'anglais',
      language: 'anglais',
      level: 'débutant',
      category: 'grammaire',
      duration: 30,
      difficulty: 1,
      isCompleted: false,
      progress: 0,
      teacher: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Vocabulaire de base',
      description: 'Apprenez le vocabulaire essentiel',
      language: 'anglais',
      level: 'débutant',
      category: 'vocabulaire',
      duration: 45,
      difficulty: 1,
      isCompleted: false,
      progress: 0,
      teacher: 'Mike Brown'
    },
    {
      id: 3,
      title: 'Grammaire fondamentale',
      description: 'Maîtrisez les règles de grammaire',
      language: 'anglais',
      level: 'intermédiaire',
      category: 'grammaire',
      duration: 60,
      difficulty: 2,
      isCompleted: false,
      progress: 0,
      teacher: 'Emma Wilson'
    }
  ]
};

/**
 * Wrapper pour les appels API avec fallback automatique
 */
export const apiWithFallback = async (endpoint, fallbackData, apiCall) => {
  // Si l'endpoint est marqué comme non disponible, utiliser directement les données mockées
  if (isEndpointUnavailable(endpoint)) {
    console.info(`Utilisation des données mockées pour ${endpoint} (endpoint marqué comme non disponible)`);
    return fallbackData;
  }

  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    if (error.response?.status === 404) {
      // Marquer l'endpoint comme non disponible
      markEndpointUnavailable(endpoint);
      console.warn(`Endpoint ${endpoint} non disponible, utilisation de données mockées`);
      return fallbackData;
    }
    throw error;
  }
};
