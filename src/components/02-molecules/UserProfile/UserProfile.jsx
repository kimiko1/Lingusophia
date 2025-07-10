import { useAuth } from '../../../hooks';
import { UserGreeting, Button } from '../../01-atoms';
import { Card } from '../../01-atoms';
import './UserProfile.scss';

const UserProfile = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Card className="user-profile">
      <div className="user-profile__header">
        <UserGreeting 
          name={user.firstName || user.name || 'Utilisateur'} 
          variant="friendly"
          animated={true}
        />
        <Button 
          variant="secondary"
          size="small"
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </div>
      
      <div className="user-profile__info">
        <div className="user-profile__field">
          <strong>Email:</strong> {user.email}
        </div>
        {user.firstName && (
          <div className="user-profile__field">
            <strong>Prénom:</strong> {user.firstName}
          </div>
        )}
        {user.lastName && (
          <div className="user-profile__field">
            <strong>Nom:</strong> {user.lastName}
          </div>
        )}
        {user.role && (
          <div className="user-profile__field">
            <strong>Rôle:</strong> {user.role}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserProfile;
