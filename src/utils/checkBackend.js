// Script de diagnostic pour vérifier la connexion API
const checkBackendConnection = async () => {
  console.log('🔍 Diagnostic de connexion backend...');
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  console.log('📡 URL API configurée:', API_URL);
  
  try {
    // Test de connexion simple
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ Backend accessible');
      const data = await response.json();
      console.log('📋 Réponse backend:', data);
    } else {
      console.log('❌ Backend répond avec erreur:', response.status);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion backend:', error.message);
    console.log('🔧 Solutions possibles:');
    console.log('  1. Vérifier que le backend est démarré');
    console.log('  2. Vérifier l\'URL API:', API_URL);
    console.log('  3. Vérifier les variables d\'environnement');
    console.log('  4. Vérifier la configuration CORS');
  }
  
  // Test des variables d'environnement
  console.log('\n🔧 Variables d\'environnement:');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('VITE_NODE_ENV:', import.meta.env.VITE_NODE_ENV);
  console.log('MODE:', import.meta.env.MODE);
};

// Lancer le diagnostic
checkBackendConnection();

export default checkBackendConnection;
