import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { Button, Input, Card, Title } from '../../01-atoms';
import { PageLayout } from '../../04-templates';
import './Login.scss';

/**
 * Login - Page de connexion
 */
const Login = () => {
  const { t } = useTranslation(['common', 'pages']);
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      // Rediriger vers admin si c'est un admin, sinon vers home
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur tape
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setIsSubmitting(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageLayout>
      <div className="login-page">
        <div className="login-container">
          <Card className="login-card">
            <div className="login-header">
              <Title level={1} className="login-title">
                {t('pages:login.title')}
              </Title>
              <p className="login-subtitle">
                {t('pages:login.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  {typeof error === 'string' ? error : error.message || 'Une erreur est survenue'}
                </div>
              )}

              <div className="form-group">
                <Input
                  type="email"
                  name="email"
                  placeholder={t('common:form.email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="login-input"
                />
              </div>

              <div className="form-group">
                <div className="password-input-wrapper">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t('common:form.password')}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="login-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="login-button"
                disabled={isSubmitting || isLoading}
              >
                {(isSubmitting || isLoading) ? t('common:loading') : t('pages:login.loginButton')}
              </Button>

              <div className="login-links">
                <Link to="/register" className="register-link">
                  {t('pages:login.noAccount')}
                </Link>
                <Link to="/forgot-password" className="forgot-password-link">
                  {t('pages:login.forgotPassword')}
                </Link>
              </div>
            </form>

            <div className="demo-accounts">
              <Title level={3} className="demo-title">
                {t('pages:login.demoAccounts')}
              </Title>
              <div className="demo-buttons">
                <Button
                  variant="outline"
                  onClick={() => setFormData({ email: 'admin@learnalanguage.com', password: 'password123' })}
                  className="demo-button"
                >
                  {t('pages:login.adminDemo')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFormData({ email: 'teacher@learnalanguage.com', password: 'password123' })}
                  className="demo-button"
                >
                  {t('pages:login.teacherDemo')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFormData({ email: 'student@learnalanguage.com', password: 'password123' })}
                  className="demo-button"
                >
                  {t('pages:login.studentDemo')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
