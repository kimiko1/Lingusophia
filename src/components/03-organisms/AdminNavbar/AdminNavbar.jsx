import { NavLink, useNavigate } from 'react-router-dom';
import './AdminNavbar.scss';

const AdminNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__logo" onClick={() => navigate('/admin')}>AdminPanel</div>
      <ul className="admin-navbar__links">
        <li><NavLink to="/admin" end>Dashboard</NavLink></li>
      </ul>
      <button className="admin-navbar__logout" onClick={() => navigate('/logout')}>Déconnexion</button>
    </nav>
  );
};

export default AdminNavbar;
