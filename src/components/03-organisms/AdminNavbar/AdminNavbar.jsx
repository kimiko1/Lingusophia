import { NavLink, useNavigate } from 'react-router-dom';
import './AdminNavbar.scss';

const AdminNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__logo" onClick={() => navigate('/admin')}>
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
      <div className="admin-navbar__actions">
        <button className="admin-navbar__logout" onClick={() => navigate('/logout')}>
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
