import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Title, Input } from '../../01-atoms';
import LessonCard from '../../02-molecules/LessonCard';
import { PageLayout } from '../../04-templates';
import './Profile.scss';

/**
 * Profile - Page de profil utilisateur
 */
const Profile = () => {
  const { t } = useTranslation('pages');
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    language: 'Français',
    level: 'Intermédiaire',
    bio: 'Passionné par l\'apprentissage des langues, je souhaite améliorer mon anglais pour ma carrière professionnelle.'
  });

  const [stats] = useState({
    lessonsCompleted: 42,
    hoursStudied: 85,
    streak: 15,
    favoriteLanguage: 'Anglais'
  });

  const [recentLessons] = useState([
    {
      id: 1,
      title: 'English Conversation',
      teacher: 'Sarah Johnson',
      date: '2024-01-15',
      duration: 60,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Business English',
      teacher: 'Michael Brown',
      date: '2024-01-12',
      duration: 45,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Grammar Practice',
      teacher: 'Sarah Johnson',
      date: '2024-01-10',
      duration: 30,
      status: 'completed'
    }
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // Logique de sauvegarde
    alert(t('messages.success', { ns: 'common' }));
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
              {recentLessons.map(lesson => (
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
              ))}
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
