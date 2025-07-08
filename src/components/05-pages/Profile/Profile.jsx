import React, { useState } from 'react';
import { Button, Card, Title, Input } from '../../01-atoms';
import { LessonCard } from '../../02-molecules';
import { PageLayout } from '../../04-templates';
import './Profile.scss';

/**
 * Profile - Page de profil utilisateur
 */
const Profile = () => {
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
    alert('Profil mis à jour avec succès !');
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <PageLayout title="Mon Profil" subtitle="Gérez vos informations personnelles">
      <div className="profile">
        <div className="profile__main">
          {/* Informations personnelles */}
          <Card className="profile__info-card">
            <div className="profile__header">
              <Title level={2} size="lg" className="profile__section-title">
                Informations personnelles
              </Title>
              <Button
                variant={isEditing ? 'primary' : 'outline'}
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? 'Sauvegarder' : 'Modifier'}
              </Button>
            </div>

            <div className="profile__info-content">
              <div className="profile__avatar">
                <img
                  src="/api/placeholder/120/120"
                  alt="Avatar"
                  className="profile__avatar-img"
                />
                {isEditing && (
                  <Button variant="outline" size="xs" className="profile__avatar-btn">
                    Changer
                  </Button>
                )}
              </div>

              <div className="profile__fields">
                <div className="profile__field">
                  <label className="profile__label">Nom complet</label>
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
                  <label className="profile__label">Email</label>
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
                  <label className="profile__label">Téléphone</label>
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
                  <label className="profile__label">Langue maternelle</label>
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
                  <label className="profile__label">Niveau actuel</label>
                  {isEditing ? (
                    <select
                      value={userInfo.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="profile__select"
                    >
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Expert">Expert</option>
                    </select>
                  ) : (
                    <p className="profile__value">{userInfo.level}</p>
                  )}
                </div>

                <div className="profile__field profile__field--full">
                  <label className="profile__label">Bio</label>
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
              Leçons récentes
            </Title>
            <div className="profile__lessons-list">
              {recentLessons.map(lesson => (
                <div key={lesson.id} className="profile__lesson-item">
                  <div className="profile__lesson-info">
                    <h4 className="profile__lesson-title">{lesson.title}</h4>
                    <p className="profile__lesson-teacher">avec {lesson.teacher}</p>
                    <p className="profile__lesson-date">
                      {new Date(lesson.date).toLocaleDateString('fr-FR')} - {lesson.duration}min
                    </p>
                  </div>
                  <span className="profile__lesson-status profile__lesson-status--completed">
                    Terminé
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
              Mes statistiques
            </Title>
            <div className="profile__stats">
              <div className="profile__stat">
                <span className="profile__stat-number">{stats.lessonsCompleted}</span>
                <span className="profile__stat-label">Leçons terminées</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-number">{stats.hoursStudied}h</span>
                <span className="profile__stat-label">Heures d'étude</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-number">{stats.streak}</span>
                <span className="profile__stat-label">Jours consécutifs</span>
              </div>
              <div className="profile__stat profile__stat--full">
                <span className="profile__stat-label">Langue favorite</span>
                <span className="profile__stat-value">{stats.favoriteLanguage}</span>
              </div>
            </div>
          </Card>

          <Card className="profile__achievements-card">
            <Title level={3} size="md" className="profile__section-title">
              Accomplissements
            </Title>
            <div className="profile__achievements">
              <div className="profile__achievement">
                <span className="profile__achievement-icon">🎯</span>
                <span className="profile__achievement-name">Première leçon</span>
              </div>
              <div className="profile__achievement">
                <span className="profile__achievement-icon">🔥</span>
                <span className="profile__achievement-name">Série de 7 jours</span>
              </div>
              <div className="profile__achievement">
                <span className="profile__achievement-icon">📚</span>
                <span className="profile__achievement-name">10 leçons complétées</span>
              </div>
              <div className="profile__achievement">
                <span className="profile__achievement-icon">⭐</span>
                <span className="profile__achievement-name">Étudiant régulier</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </PageLayout>
  );
};

export default Profile;
