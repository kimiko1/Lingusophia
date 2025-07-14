import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  User, 
  Settings, 
  Camera, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Bell,
  Shield,
  Wallet,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';
import './Profile.scss';
const Profile = () => {
  const { t } = useTranslation();
  const { user, isLoading, isAuthenticated, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({});
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    totalTime: 0,
    streak: 0
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      if (!user?.id) return;
      
      const response = await fetch(`/api/users/stats/${user.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData.data || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Afficher le loading pendant la vérification
  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Convertir les noms de champs pour correspondre à l'API
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        nativeLanguage: formData.nativeLanguage,
        currentLevel: formData.current_level,
        timezone: formData.timezone,
        avatarUrl: formData.avatar_url,
        dateOfBirth: formData.dateOfBirth,
      };
      
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setIsEditing(false);
        // Afficher un message de succès
      } else {
        console.error('Error updating profile:', result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadFormData = new FormData();
      uploadFormData.append('avatar', file);
      
      try {
        const response = await fetch('/api/users/avatar', {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData
        });

        if (response.ok) {
          const result = await response.json();
          setFormData(prev => ({
            ...prev,
            avatar_url: result.data.avatar_url
          }));
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
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
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <img 
                src={user?.avatar_url || '/default-avatar.png'} 
                alt={user?.first_name || 'User'}
                className="profile-avatar"
              />
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
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-badges">
                <span className="badge role-badge">{user?.role}</span>
                <span className={`badge status-badge ${user?.status?.toLowerCase()}`}>
                  {user?.status}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={20} />
                {t('profile.edit')}
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn btn-success"
                  onClick={handleSaveProfile}
                >
                  <Save size={20} />
                  {t('common.save')}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
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
              name="first_name"
              value={formData.firstName || ''}
              onChange={onInputChange}
              className="form-input"
            />
          ) : (
            <p className="form-value">{user?.firstName || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.lastName')}</label>
          {editing ? (
            <input
              type="text"
              name="last_name"
              value={formData.lastName || ''}
              onChange={onInputChange}
              className="form-input"
            />
          ) : (
            <p className="form-value">{user?.lastName || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.phone')}</label>
          {editing ? (
            <input
              type="tel"
              name="phone"
              value={user.phone || ''}
              onChange={onInputChange}
              className="form-input"
            />
          ) : (
            <p className="form-value">{user?.phone || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.dateOfBirth')}</label>
          {editing ? (
            <input
              type="date"
              name="date_of_birth"
              value={user.dateOfBirth || ''}
              onChange={onInputChange}
              className="form-input"
            />
          ) : (
            <p className="form-value">
              {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}
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
        <p className="bio-text">{user?.bio || t('profile.noBio')}</p>
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
              name="native_language"
              value={formData.native_language || ''}
              onChange={onInputChange}
              className="form-select"
            >
              <option value="">{t('profile.selectLanguage')}</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          ) : (
            <p className="form-value">{user?.nativeLanguage || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.currentLevel')}</label>
          {editing ? (
            <select
              name="current_level"
              value={formData.current_level || ''}
              onChange={onInputChange}
              className="form-select"
            >
              <option value="Beginner">{t('levels.beginner')}</option>
              <option value="Intermediate">{t('levels.intermediate')}</option>
              <option value="Advanced">{t('levels.advanced')}</option>
            </select>
          ) : (
            <p className="form-value">{user?.current_level || '-'}</p>
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
            <p className="form-value">{user?.timezone || '-'}</p>
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