import axios from 'axios';

const testConnection = async () => {
  try {
    console.log('🔍 Test de connexion au backend...');
    
    // Test de connexion basique
    const response = await axios.get('http://localhost:3000/auth/me', {
      timeout: 5000,
      withCredentials: true
    });
    
    console.log('✅ Backend accessible');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Erreur de connexion backend:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('  - Le serveur backend n\'est pas démarré');
      console.log('  - Vérifiez que le serveur tourne sur http://localhost:3000');
    } else if (error.response) {
      console.log('  - Status:', error.response.status);
      console.log('  - Data:', error.response.data);
    } else {
      console.log('  - Message:', error.message);
    }
  }
};

// Test de connexion avec compte
const testLogin = async () => {
  try {
    console.log('\n🔐 Test de connexion avec compte...');
    
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@learnalanguage.com',
      password: 'password123'
    }, {
      timeout: 5000,
      withCredentials: true
    });
    
    console.log('✅ Connexion réussie');
    console.log('User:', response.data.user);
    
  } catch (error) {
    console.log('❌ Erreur de connexion:');
    
    if (error.response) {
      console.log('  - Status:', error.response.status);
      console.log('  - Message:', error.response.data?.message || error.response.data);
    } else {
      console.log('  - Message:', error.message);
    }
  }
};

// Exécuter les tests
testConnection();
testLogin();
