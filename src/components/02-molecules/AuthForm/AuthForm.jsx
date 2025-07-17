import { useState } from 'react';
import { useAuth } from '../../../hooks';
import { Button, Input, Card, Title } from '../../01-atoms';
import './AuthForm.scss';

const AuthForm = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isLoginMode, setIsLoginMode] = useState(mode === 'login');
  
  const { login, register, isLoading, error, clearError } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      if (isLoginMode) {
        const result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        const result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    clearError();
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
