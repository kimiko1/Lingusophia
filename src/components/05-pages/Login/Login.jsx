import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, Card, Title } from '@atoms';
import './Login.scss';
import { loginUser, clearError } from '@slices/authSlice';

/**
 * Login - Page de connexion
 */
const Login = () => {
  const { t } = useTranslation(['common', 'pages']);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const authError = useSelector(state => state.auth.error);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Réinitialiser les erreurs au montage du composant
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
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
    if (error) {
      setError('');
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

    dispatch(clearError());
    try {
      const result = await dispatch(loginUser({ 
        email: formData.email, 
        password: formData.password 
      })).unwrap();
      
      if (result) {
        navigate(result.role === 'Admin' ? '/admin' : '/');
      }
    } catch (error) {
      setError(error || 'Erreur lors de la connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2} className="login-title">{t('pages:login.title', 'Connexion')}</Title>
          <div className="login-subtitle">{t('pages:login.subtitle', 'Accédez à votre espace personnel')}</div>
        </div>
        <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
          {(error || authError) && <div className="login-error" role="alert">{error || authError}</div>}
          <div className="form-group">
            <Input
              type="email"
              name="email"
              placeholder={t('common:email', 'Email')}
              value={formData.email}
              onChange={handleInputChange}
              required
              autoFocus
              className="login-input"
            />
          </div>
          <div className="form-group password-input-wrapper">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={t('common:password', 'Mot de passe')}
              value={formData.password}
              onChange={handleInputChange}
              required
              className="login-input"
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? t('pages:login.hidePassword', 'Masquer le mot de passe') : t('pages:login.showPassword', 'Afficher le mot de passe')}
              onClick={() => setShowPassword(v => !v)}
              tabIndex={0}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="login-actions">
            <Button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? t('common:loading', 'Chargement...') : t('pages:login.button', 'Se connecter')}
            </Button>
          </div>
        </form>
        <div className="login-links">
          <Link to="/register" className="login-link-register">{t('pages:login.registerLink', "Créer un compte")}</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
