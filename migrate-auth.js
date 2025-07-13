#!/usr/bin/env node

/**
 * Script pour migrer les composants de Redux vers AuthContext
 */

const fs = require('fs');
const path = require('path');

const filesToMigrate = [
  'src/components/05-pages/Settings/Settings.jsx',
  'src/components/05-pages/ScheduleLesson/ScheduleLesson_new.jsx', 
  'src/components/05-pages/ScheduleLesson/ScheduleLesson.jsx',
  'src/components/05-pages/Register/Register.jsx',
  'src/components/05-pages/MyLessons/MyLessons_new.jsx',
  'src/components/05-pages/MyLessons/MyLessons.jsx',
  'src/components/05-pages/Login/Login.jsx',
  'src/components/05-pages/Admin/Admin.jsx'
];

function migrateFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Vérifier si le fichier utilise useSelector pour l'auth
  if (!content.includes('useSelector') || !content.includes('state.auth')) {
    console.log(`⏭️  Pas de Redux auth dans: ${filePath}`);
    return;
  }
  
  console.log(`🔄 Migration de: ${filePath}`);
  
  // Remplacer les imports
  if (content.includes('useSelector') && content.includes('useDispatch')) {
    content = content.replace(
      /import { useSelector, useDispatch } from 'react-redux';/g,
      "import { useAuth } from '../../../contexts/AuthContext';"
    );
  } else if (content.includes('useSelector')) {
    content = content.replace(
      /import { useSelector } from 'react-redux';/g,
      "import { useAuth } from '../../../contexts/AuthContext';"
    );
  }
  
  // Remplacer useSelector par useAuth
  content = content.replace(
    /const { ([^}]+) } = useSelector\(state => state\.auth\);/g,
    'const { $1 } = useAuth();'
  );
  
  // Nettoyer les imports inutiles
  content = content.replace(/import { useDispatch } from 'react-redux';\n/g, '');
  
  // Sauvegarder le fichier
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Migré: ${filePath}`);
}

function main() {
  console.log('🚀 Début de la migration Redux vers AuthContext\n');
  
  filesToMigrate.forEach(migrateFile);
  
  console.log('\n✨ Migration terminée !');
  console.log('👀 Vérifiez les fichiers modifiés et testez votre application.');
}

main();
