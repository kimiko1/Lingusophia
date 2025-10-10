import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
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
  const isLoading = useSelector(state => state.auth.isLoading);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    totalTime: 0,
    streak: 0
  });

  // Fonction pour récupérer le profil depuis l'API
  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Profile API response:', result);
        // Le backend renvoie les données dans result.data.user
        const userData = result.data?.user || result.user || result.data || result;
        console.log('User data extracted:', userData);
        setUser(userData);
        setFormData(userData);
      } else {
        console.error('Failed to fetch profile:', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    console.log('Profile component mounted', fetchUserProfile);
  }, []);

  useEffect(() => {
    if (user) {
      // const fetchStats = async () => {
      //   try {
      //     if (!user?.id) return;
          
      //     const response = await fetch(`${API_BASE_URL}/api/users/stats`, {
      //       credentials: 'include'
      //     });
          
      //     if (response.ok) {
      //       const statsData = await response.json();
      //       setStats(statsData.data || {});
      //     }
      //   } catch (error) {
      //     console.error('Error fetching stats:', error);
      //   }
      // };
      
      // fetchStats();
    }
  }, [user]);

  // Afficher le loading pendant la vérification
  if (isLoading || profileLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }


  // Gère la correspondance camelCase <-> snake_case pour le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Mappe les noms de champs snake_case vers camelCase dans le state
    let key = name;
    if (key === 'first_name') key = 'firstName';
    if (key === 'last_name') key = 'lastName';
    if (key === 'native_language') key = 'nativeLanguage';
    if (key === 'current_level') key = 'currentLevel';
    if (key === 'avatar_url') key = 'avatarUrl';
    if (key === 'date_of_birth') key = 'dateOfBirth';
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        nativeLanguage: formData.nativeLanguage,
        currentLevel: formData.currentLevel,
        timezone: formData.timezone,
        avatarUrl: formData.avatarUrl,
        dateOfBirth: formData.dateOfBirth,
      };

      const userId = user?.id || user?._id;
      if (!userId) {
        console.error('User ID is missing');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile update response:', result);
        setIsEditing(false);
        // Recharger le profil pour avoir les dernières données
        await fetchUserProfile();
      } else {
        console.error('Error updating profile:', response.status);
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
        const response = await fetch('http://localhost:3000/api/users/avatar', {
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
                src={`${API_BASE_URL}${formData.avatarUrl || formData.avatar_url || '/default-avatar.png'}`} 
                alt={formData.firstName || formData.first_name || 'User'}
                className="profile-avatar"
                loading="lazy"
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
                {formData.firstName || formData.first_name} {formData.lastName || formData.last_name}
              </h1>
              <p className="profile-email">{formData.email || user?.email}</p>
              <div className="profile-badges">
                <span className="badge role-badge">{formData.role || user?.role}</span>
                <span className={`badge status-badge ${(formData.status || user?.status)?.toLowerCase()}`}>
                  {formData.status || user?.status}
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
            <p className="form-value">{formData.firstName || formData.first_name || '-'}</p>
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
            <p className="form-value">{formData.lastName || formData.last_name || '-'}</p>
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
              name="date_of_birth"
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
              name="native_language"
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
            <p className="form-value">{formData.nativeLanguage || formData.native_language || '-'}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>{t('profile.currentLevel')}</label>
          {editing ? (
            <select
              name="current_level"
              value={formData.currentLevel || ''}
              onChange={onInputChange}
              className="form-select"
            >
              <option value="Beginner">{t('levels.beginner')}</option>
              <option value="Intermediate">{t('levels.intermediate')}</option>
              <option value="Advanced">{t('levels.advanced')}</option>
            </select>
          ) : (
            <p className="form-value">{formData.currentLevel || formData.current_level || '-'}</p>
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