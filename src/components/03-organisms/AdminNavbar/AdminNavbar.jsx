import { NavLink, useNavigate } from 'react-router-dom';
import './AdminNavbar.scss';
import { LanguageSelector, Logo } from '@atoms';

const AdminNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__logo" onClick={() => navigate('/admin')}>
                  <Logo 
                    size="large" 
                    variant="gradient"
                    clickable
                  />
        AdminPanel
      </div>
      <ul className="admin-navbar__links">
        <li className="admin-navbar__link">
          <NavLink to="/admin" end>Dashboard</NavLink>
        </li>
        <li className="admin-navbar__link">
          <NavLink to="/" end>Front</NavLink>
        </li>
      </ul>
      <LanguageSelector 
                      variant="dropdown"
                      size="sm"
                      showFlag={true}
                      showNativeName={false}
                    />
      <div className="admin-navbar__actions">
        <button className="admin-navbar__logout" onClick={() => navigate('/logout')}>
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
