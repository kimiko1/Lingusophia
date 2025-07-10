// Test simple des imports pour vérifier que tout fonctionne
import { AuthForm, LessonsDisplay, UserProfile } from './components/02-molecules';
import { useAuth, useLessons, useBookings } from './hooks';
import { authService, lessonsService } from './services';
import { store } from './store';

console.log('✅ Tous les imports sont résolus correctement !');
console.log('📦 Composants disponibles:', {
  AuthForm,
  LessonsDisplay,
  UserProfile
});
console.log('🪝 Hooks disponibles:', {
  useAuth,
  useLessons,
  useBookings
});
console.log('🔌 Services disponibles:', {
  authService,
  lessonsService
});
console.log('🏪 Store Redux:', store);

export { AuthForm, LessonsDisplay, UserProfile, useAuth, useLessons, authService, store };
