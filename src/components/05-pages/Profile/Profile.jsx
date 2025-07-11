import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Card, Title, Input } from '../../01-atoms';
import LessonCard from '../../02-molecules/LessonCard';
import { PageLayout } from '../../04-templates';
import { userService } from '../../../services';
import './Profile.scss';

/**
 * Profile - Page de profil utilisateur
 */
const Profile = () => {
  const { t } = useTranslation('pages');
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    language: '',
    level: '',
    bio: ''
  });

  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    hoursStudied: 0,
    streak: 0,
    favoriteLanguage: ''
  });

  const [recentLessons, setRecentLessons] = useState([]);

  // Charger les données du profil au montage du composant
  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
      loadUserStats();
      loadRecentLessons();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getCurrentUserProfile();
      setUserInfo({
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phone: profile.phone || '',
        language: profile.nativeLanguage || '',
        level: profile.currentLevel || '',
        bio: profile.bio || ''
      });
    } catch (err) {
      setError('Erreur lors du chargement du profil');
      console.error('Erreur lors du chargement du profil:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const userStats = await userService.getUserStats(user.id);
      setStats(userStats);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const loadRecentLessons = async () => {
    try {
      const lessons = await userService.getRecentLessons(user.id, 5);
      setRecentLessons(lessons);
    } catch (err) {
      console.error('Erreur lors du chargement des leçons récentes:', err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.updateUserProfile(userInfo);
      setIsEditing(false);
      alert(t('messages.success', { ns: 'common' }));
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error('Erreur lors de la sauvegarde:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <PageLayout title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <div className="profile">
        <div className="profile__main">
          {/* Informations personnelles */}
          <Card className="profile__info-card">
            <div className="profile__header">
              <Title level={2} size="lg" className="profile__section-title">
                {t('profile.personalInfo')}
              </Title>
              <Button
                variant={isEditing ? 'primary' : 'outline'}
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? t('buttons.save', { ns: 'common' }) : t('buttons.edit', { ns: 'common' })}
              </Button>
            </div>

            <div className="profile__info-content">
              <div className="profile__avatar">
                <img
                  src="/api/placeholder/120/120"
                  alt={t('user.profile', { ns: 'common' })}
                  className="profile__avatar-img"
                />
                {isEditing && (
                  <Button variant="outline" size="xs" className="profile__avatar-btn">
                    {t('buttons.edit', { ns: 'common' })}
                  </Button>
                )}
              </div>

              <div className="profile__fields">
                <div className="profile__field">
                  <label className="profile__label">{t('profile.fields.name')}</label>
                  {isEditing ? (
                    <Input
                      value={userInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <p className="profile__value">{userInfo.name}</p>
                  )}
                </div>

                <div className="profile__field">
                  <label className="profile__label">{t('profile.fields.email')}</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <p className="profile__value">{userInfo.email}</p>
                  )}
                </div>

                <div className="profile__field">
                  <label className="profile__label">{t('profile.fields.phone')}</label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <p className="profile__value">{userInfo.phone}</p>
                  )}
                </div>

                <div className="profile__field">
                  <label className="profile__label">{t('profile.fields.nativeLanguage')}</label>
                  {isEditing ? (
                    <Input
                      value={userInfo.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                    />
                  ) : (
                    <p className="profile__value">{userInfo.language}</p>
                  )}
                </div>

                <div className="profile__field">
                  <label className="profile__label">{t('profile.fields.currentLevel')}</label>
                  {isEditing ? (
                    <select
                      value={userInfo.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="profile__select"
                    >
                      <option value="Débutant">{t('lessons.difficulty.beginner')}</option>
                      <option value="Intermédiaire">{t('lessons.difficulty.intermediate')}</option>
                      <option value="Avancé">{t('lessons.difficulty.advanced')}</option>
                      <option value="Expert">Expert</option>
                    </select>
                  ) : (
                    <p className="profile__value">{userInfo.level}</p>
                  )}
                </div>

                <div className="profile__field profile__field--full">
                  <label className="profile__label">{t('profile.fields.bio')}</label>
                  {isEditing ? (
                    <textarea
                      value={userInfo.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="profile__textarea"
                      rows="4"
                    />
                  ) : (
                    <p className="profile__value">{userInfo.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Leçons récentes */}
          <Card className="profile__lessons-card">
            <Title level={2} size="lg" className="profile__section-title">
              {t('profile.recentLessons')}
            </Title>
            <div className="profile__lessons-list">
              {Array.isArray(recentLessons) && recentLessons.length > 0 ? (
                recentLessons.map(lesson => (
                  <div key={lesson.id} className="profile__lesson-item">
                    <div className="profile__lesson-info">
                      <h4 className="profile__lesson-title">{lesson.title}</h4>
                      <p className="profile__lesson-teacher">avec {lesson.teacher}</p>
                    <p className="profile__lesson-date">
                      {new Date(lesson.date).toLocaleDateString(t('locale', { ns: 'common' }))} - {lesson.duration}min
                    </p>
                  </div>
                  <span className="profile__lesson-status profile__lesson-status--completed">
                    {t('lessons.completed')}
                  </span>
                </div>
              ))
              ) : (
                <p className="profile__no-lessons">{t('profile.noRecentLessons')}</p>
              )}
            </div>
          </Card>
        </div>

        {/* Statistiques */}
        <aside className="profile__sidebar">
          <Card className="profile__stats-card">
            <Title level={3} size="md" className="profile__section-title">
              {t('profile.statistics')}
            </Title>
            <div className="profile__stats">
              <div className="profile__stat">
                <span className="profile__stat-number">{stats.lessonsCompleted}</span>
                <span className="profile__stat-label">{t('profile.stats.lessonsCompleted')}</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-number">{stats.hoursStudied}h</span>
                <span className="profile__stat-label">{t('profile.stats.hoursStudied')}</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-number">{stats.streak}</span>
                <span className="profile__stat-label">{t('profile.stats.streak')}</span>
              </div>
              <div className="profile__stat profile__stat--full">
                <span className="profile__stat-label">{t('profile.stats.favoriteLanguage')}</span>
                <span className="profile__stat-value">{stats.favoriteLanguage}</span>
              </div>
            </div>
          </Card>

          <Card className="profile__achievements-card">
            <Title level={3} size="md" className="profile__section-title">
              {t('profile.achievementsTitle')}
            </Title>
            <div className="profile__achievements">
              <div className="profile__achievement">
                <span className="profile__achievement-icon">🎯</span>
                <span className="profile__achievement-name">{t('profile.achievements.firstLesson')}</span>
              </div>
              <div className="profile__achievement">
                <span className="profile__achievement-icon">🔥</span>
                <span className="profile__achievement-name">{t('profile.achievements.weekStreak')}</span>
              </div>
              <div className="profile__achievement">
                <span className="profile__achievement-icon">📚</span>
                <span className="profile__achievement-name">{t('profile.achievements.tenLessons')}</span>
              </div>
              <div className="profile__achievement">
                <span className="profile__achievement-icon">⭐</span>
                <span className="profile__achievement-name">{t('profile.achievements.regularStudent')}</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </PageLayout>
  );
};

export default Profile;
