import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Card, Title } from '@atoms';
import './AuthForm.scss';
import { setUser, setLoading, setAuthenticated, setError, clearError } from '@slices/authSlice';
import { authService } from '@services';

const AuthForm = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isLoginMode, setIsLoginMode] = useState(mode === 'login');

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);
  const error = useSelector(state => state.auth.error);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      if (isLoginMode) {
        const userData = await authService.login(formData.email, formData.password);
        if (userData && userData.user) {
          // On stocke l'objet user + token si présent
          const user = { ...userData.user };
          if (userData.token) user.token = userData.token;
          dispatch(setUser(user));
          dispatch(setAuthenticated(true));
        } else {
          dispatch(setError('Identifiants invalides'));
        }
      } else {
        const userData = await authService.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
        if (userData && userData.user) {
          const user = { ...userData.user };
          if (userData.token) user.token = userData.token;
          dispatch(setUser(user));
          dispatch(setAuthenticated(true));
        } else {
          dispatch(setError("Erreur lors de l'inscription"));
        }
      }
    } catch (error) {
      dispatch(setError(error.message || 'Erreur serveur'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    dispatch(clearError());
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    });
  };

  return (
    <Card className="auth-form">
      <Title level={2} className="auth-form__title">
        {isLoginMode ? 'Connexion' : 'Inscription'}
      </Title>
      
      {error && (
        <div className="auth-form__error">
          {typeof error === 'string' ? error : error.message || 'Une erreur s\'est produite'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form__form">
        {!isLoginMode && (
          <>
            <Input
              type="text"
              name="firstName"
              placeholder="Prénom"
              label="Prénom"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Nom"
              label="Nom"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </>
        )}
        
        <Input
          type="email"
          name="email"
          placeholder="Email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          fullWidth
        />
        
        <Input
          type="password"
          name="password"
          placeholder="Mot de passe"
          label="Mot de passe"
          value={formData.password}
          onChange={handleInputChange}
          required
          fullWidth
        />

        <Button 
          type="submit" 
          disabled={isLoading}
          loading={isLoading}
          variant="primary"
          size="large"
          fullWidth
          className="auth-form__submit"
        >
          {isLoginMode ? 'Se connecter' : 'S\'inscrire'}
        </Button>
      </form>

      <div className="auth-form__toggle">
        <p>
          {isLoginMode ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
          <Button 
            variant="link" 
            onClick={toggleMode} 
            className="auth-form__toggle-btn"
          >
            {isLoginMode ? 'S\'inscrire' : 'Se connecter'}
          </Button>
        </p>
      </div>
    </Card>
  );
};

export default AuthForm;
