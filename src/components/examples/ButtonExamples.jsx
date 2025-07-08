import React from 'react';
import Button from '../01-atoms/Button/Button';
import { faArrowRight, faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

/**
 * Exemples d'utilisation du composant Button avec liens React
 */
const ButtonExamples = () => {
  return (
    <div className="button-examples" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Exemples d'utilisation du composant Button</h2>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <h3>Boutons classiques</h3>
        <Button variant="primary" onClick={() => alert('Clic!')}>
          Bouton normal
        </Button>
        
        <Button variant="secondary" disabled>
          Bouton désactivé
        </Button>
        
        <Button variant="outline" loading>
          Bouton en chargement
        </Button>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <h3>Liens internes (React Router)</h3>
        <Button variant="primary" to="/home" icon={faArrowRight} iconPosition="right">
          Aller à l'accueil
        </Button>
        
        <Button variant="secondary" to="/profile">
          Mon profil
        </Button>
        
        <Button variant="ghost" to="/settings">
          Paramètres
        </Button>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <h3>Liens externes</h3>
        <Button 
          variant="outline" 
          href="https://reactjs.org" 
          external 
          icon={faExternalLinkAlt}
          iconPosition="right"
        >
          Documentation React
        </Button>
        
        <Button 
          variant="primary" 
          href="mailto:contact@example.com"
        >
          Nous contacter
        </Button>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <h3>Liens désactivés</h3>
        <Button variant="primary" to="/disabled-page" disabled>
          Lien interne désactivé
        </Button>
        
        <Button variant="secondary" href="https://example.com" disabled>
          Lien externe désactivé
        </Button>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <h3>Différentes tailles</h3>
        <Button variant="primary" to="/home" size="sm">
          Petit bouton-lien
        </Button>
        
        <Button variant="primary" to="/home" size="base">
          Bouton-lien normal
        </Button>
        
        <Button variant="primary" to="/home" size="lg" icon={faPlus}>
          Grand bouton-lien
        </Button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Bouton pleine largeur</h3>
        <Button variant="primary" to="/action" fullWidth>
          Bouton-lien pleine largeur
        </Button>
      </div>
    </div>
  );
};

export default ButtonExamples;
