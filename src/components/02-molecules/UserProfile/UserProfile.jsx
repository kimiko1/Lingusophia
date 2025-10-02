import { useSelector, useDispatch } from 'react-redux';
import { UserGreeting, Button, Card } from '@atoms';
import './UserProfile.scss';
import { logout } from '@slices/authSlice';
import { authService } from '@services';

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
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
