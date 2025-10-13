import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  uploadUserAvatar,
  fetchUserStats,
  clearError
} from '@slices/authSlice';

import { API_BASE_URL } from '@config/constants';
import { 
  User, 
  Settings, 
  Camera, 
  Calendar,
  Edit3,
  Save,
  X,
  Shield,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';
import './Profile.scss';
const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Redux state
  const { user, isLoading, error, stats } = useSelector(state => state.auth);
  
  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({});

  // Initialiser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        nativeLanguage: user.nativeLanguage || '',
        currentLevel: user.currentLevel || 'Beginner',
        timezone: user.timezone || '',
        avatarUrl: user.avatarUrl || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || ''
      });
    }
  }, [user]);

  // Charger le profil seulement si on n'a pas d'utilisateur
  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, isLoading]);

  // Charger les statistiques
  useEffect(() => {
    if (user?.id && activeTab === 'stats') {
      dispatch(fetchUserStats(user.id));
    }
  }, [dispatch, user?.id, activeTab]);

  // Afficher le loading
  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  // Afficher l'erreur si pas d'utilisateur
  if (!user) {
    return (
      <div className="profile-error">
        <p>Erreur : {error || 'Utilisateur non trouvé'}</p>
        <button onClick={() => dispatch(fetchUserProfile())}>
          Réessayer
        </button>
      </div>
    );
  }

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sauvegarder le profil
  const handleSaveProfile = async () => {
    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        nativeLanguage: formData.nativeLanguage,
        currentLevel: formData.currentLevel,
        timezone: formData.timezone,
        dateOfBirth: formData.dateOfBirth,
      };

      // N'inclure avatarUrl que si elle existe et n'est pas vide
      if (formData.avatarUrl && formData.avatarUrl.trim() !== '') {
        profileData.avatarUrl = formData.avatarUrl;
      }

      await dispatch(updateUserProfile(profileData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  // Upload d'avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('avatar', file);
    
    try {
      const result = await dispatch(uploadUserAvatar(uploadFormData)).unwrap();
      
      // Mettre à jour le formData local aussi
      setFormData(prev => ({
        ...prev,
        avatarUrl: result.data?.avatar_url || result.avatar_url
      }));
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'avatar:', error);
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Remettre les données originales
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        nativeLanguage: user.nativeLanguage || '',
        currentLevel: user.currentLevel || 'Beginner',
        timezone: user.timezone || '',
        avatarUrl: user.avatarUrl || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || ''
      });
    }
  };

  const tabs = [
    { id: 'profile', label: t('profile.tabs.profile'), icon: User },
    { id: 'preferences', label: t('profile.tabs.preferences'), icon: Settings },
    { id: 'security', label: t('profile.tabs.security'), icon: Shield },
    { id: 'stats', label: t('profile.tabs.stats'), icon: TrendingUp }
  ];

  return (
    <div className="profile-container">
      {/* Affichage des erreurs */}
      {error && (
        <div className="profile-error-banner">
          <p>Erreur : {error}</p>
          <button onClick={() => dispatch(clearError())}>×</button>
        </div>
      )}
      
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              {formData.avatarUrl ? (
                <img 
                  src={`${API_BASE_URL}${formData.avatarUrl}`} 
                  alt={formData.firstName || 'User'}
                  className="profile-avatar"
                  loading="lazy"
                  onError={(e) => {
                    // En cas d'erreur, masquer l'image et afficher les initiales
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="profile-avatar-placeholder"
                style={{
                  display: formData.avatarUrl ? 'none' : 'flex',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '2px solid #e0e0e0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#666',
                  textTransform: 'uppercase'
                }}
              >
                {formData.firstName?.charAt(0) || ''}
                {formData.lastName?.charAt(0) || ''}
              </div>
              {isEditing && (
                <label htmlFor="avatar-upload" className="avatar-upload-btn">
                  <Camera size={20} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="profile-email">{formData.email}</p>
              <div className="profile-badges">
                <span className="badge role-badge">{formData.role}</span>
                <span className={`badge status-badge ${formData.status?.toLowerCase()}`}>
                  {formData.status}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                <Edit3 size={20} />
                {t('profile.edit')}
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn btn-success"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Save size={20} />
                  {isLoading ? t('common.saving') : t('common.save')}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <X size={20} />
                  {t('common.cancel')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="profile-tab-content">
          {activeTab === 'profile' && (
            <ProfileTab 
              user={user}
              formData={formData}
              editing={isEditing}
              onInputChange={handleInputChange}
              t={t}
            />
          )}
          
          {activeTab === 'preferences' && (
            <PreferencesTab 
              user={user}
              formData={formData}
              editing={isEditing}
              onInputChange={handleInputChange}
              t={t}
            />
          )}
          
          {activeTab === 'security' && (
            <SecurityTab 
              user={user}
              t={t}
            />
          )}
          
          {activeTab === 'stats' && (
            <StatsTab 
              stats={stats}
              t={t}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Composant pour l'onglet Profil
const ProfileTab = ({ user, formData, editing, onInputChange, t }) => (
  <div className="profile-tab">
    <div className="form-section">
      <h3>{t('profile.personalInfo')}</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>{t('profile.firstName')}</label>
          {editing ? (
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={onInputChange}
              className="form-input"
            />
          ) : (
            <p className="form-value">{formData.firstName || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.lastName')}</label>
          {editing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={onInputChange}
              className="form-input"
            />
          ) : (
            <p className="form-value">{formData.lastName || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.phone')}</label>
          {editing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={onInputChange}
              className="form-input"
            />
          ) : (
            <p className="form-value">{formData.phone || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.dateOfBirth')}</label>
          {editing ? (
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={onInputChange}
              className="form-input"
            />
          ) : (
            <p className="form-value">
              {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : '-'}
            </p>
          )}
        </div>
      </div>
    </div>
    
    <div className="form-section">
      <h3>{t('profile.bio')}</h3>
      {editing ? (
        <textarea
          name="bio"
          value={formData.bio || ''}
          onChange={onInputChange}
          className="form-textarea"
          rows="4"
          placeholder={t('profile.bioPlaceholder')}
        />
      ) : (
        <p className="bio-text">{formData.bio || t('profile.noBio')}</p>
      )}
    </div>
  </div>
);

// Composant pour l'onglet Préférences
const PreferencesTab = ({ user, formData, editing, onInputChange, t }) => (
  <div className="preferences-tab">
    <div className="form-section">
      <h3>{t('profile.learningPreferences')}</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>{t('profile.nativeLanguage')}</label>
          {editing ? (
            <select
              name="nativeLanguage"
              value={formData.nativeLanguage || ''}
              onChange={onInputChange}
              className="form-select"
            >
              <option value="">{t('profile.selectLanguage')}</option>
              <option value="French">Français</option>
              <option value="English">English</option>
              <option value="Chinese">中文</option>
            </select>
          ) : (
            <p className="form-value">{formData.nativeLanguage || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.currentLevel')}</label>
          {editing ? (
            <select
              name="currentLevel"
              value={formData.currentLevel || ''}
              onChange={onInputChange}
              className="form-select"
            >
              <option value="Beginner">{t('levels.beginner')}</option>
              <option value="Intermediate">{t('levels.intermediate')}</option>
              <option value="Advanced">{t('levels.advanced')}</option>
            </select>
          ) : (
            <p className="form-value">{formData.currentLevel || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.timezone')}</label>
          {editing ? (
            <select
              name="timezone"
              value={formData.timezone || ''}
              onChange={onInputChange}
              className="form-select"
            >
              <option value="">{t('profile.selectTimezone')}</option>
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Shanghai">Asia/Shanghai</option>
            </select>
          ) : (
            <p className="form-value">{formData.timezone || '-'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Composant pour l'onglet Sécurité
const SecurityTab = ({ user, t }) => (
  <div className="security-tab">
    <div className="form-section">
      <h3>{t('profile.accountSecurity')}</h3>
      <div className="security-items">
        <div className="security-item">
          <div className="security-info">
            <h4>{t('profile.password')}</h4>
            <p>{t('profile.passwordDescription')}</p>
          </div>
          <button className="btn btn-outline">
            {t('profile.changePassword')}
          </button>
        </div>
        
        <div className="security-item">
          <div className="security-info">
            <h4>{t('profile.emailVerification')}</h4>
            <p>{user?.email_verified ? t('profile.emailVerified') : t('profile.emailNotVerified')}</p>
          </div>
          {!user?.email_verified && (
            <button className="btn btn-outline">
              {t('profile.verifyEmail')}
            </button>
          )}
        </div>
        
        <div className="security-item">
          <div className="security-info">
            <h4>{t('profile.twoFactorAuth')}</h4>
            <p>{t('profile.twoFactorDescription')}</p>
          </div>
          <button className="btn btn-outline">
            {t('profile.enable2FA')}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour l'onglet Statistiques
const StatsTab = ({ stats, t }) => (
  <div className="stats-tab">
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <BookOpen size={24} />
        </div>
        <div className="stat-content">
          <h3>{stats.totalLessons || 0}</h3>
          <p>{t('profile.totalLessons')}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <Award size={24} />
        </div>
        <div className="stat-content">
          <h3>{stats.completedLessons || 0}</h3>
          <p>{t('profile.completedLessons')}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <TrendingUp size={24} />
        </div>
        <div className="stat-content">
          <h3>{stats.streak || 0}</h3>
          <p>{t('profile.streak')}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <Calendar size={24} />
        </div>
        <div className="stat-content">
          <h3>{Math.floor((stats.totalTime || 0) / 60)}</h3>
          <p>{t('profile.totalHours')}</p>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;