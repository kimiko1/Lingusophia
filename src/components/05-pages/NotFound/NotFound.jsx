import { useNavigate } from 'react-router-dom';
import './Notfound.scss';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <img src="/vite.svg" alt="404" className="notfound-img" loading="lazy" />
        <h1>404 - Page introuvable</h1>
        <p>Oups ! La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <button className="notfound-btn" onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    </div>
  );
};

export default NotFound;