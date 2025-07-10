# Guide de résolution des problèmes de connexion Frontend/Backend

## Problèmes identifiés et solutions

### 1. **Comptes de démonstration corrigés**
- ✅ **Ancien problème**: Les boutons de démonstration utilisaient des emails incorrects
- ✅ **Solution appliquée**: Mise à jour des emails dans `Login.jsx`
  - admin@learnalanguage.com (au lieu de admin@example.com)
  - teacher@learnalanguage.com (au lieu de teacher@example.com)
  - student@learnalanguage.com (au lieu de student@example.com)
  - Mot de passe: password123 (pour tous les comptes)

### 2. **Gestion des erreurs améliorée**
- ✅ **Ancien problème**: Les erreurs du backend n'étaient pas affichées correctement
- ✅ **Solution appliquée**: 
  - Amélioration de la gestion des erreurs dans `authService`
  - Meilleur affichage des messages d'erreur dans le composant Login
  - Extraction du message d'erreur depuis `response.data.message`

### 3. **Correction des rôles d'utilisateur**
- ✅ **Ancien problème**: Incompatibilité entre les rôles frontend/backend
- ✅ **Solution appliquée**: Correction du rôle Admin (majuscule) dans la redirection

### 4. **Outils de diagnostic ajoutés**
- ✅ **Nouveau**: Composant `DiagnosticTool` pour identifier les problèmes
- ✅ **Nouveau**: Composant `ConnectionTest` pour tests rapides
- ✅ **Nouveau**: Intégration temporaire dans la page d'accueil pour debug

## Comment tester la connexion

### Étape 1: Vérifier que le backend fonctionne
```bash
# Dans le dossier LearnALanguageBack
npm run dev
```
Le serveur devrait afficher: "Le serveur est en écoute sur: http://localhost:3000"

### Étape 2: Vérifier que le frontend fonctionne
```bash
# Dans le dossier Learn-A-Language-Web
npm run dev
```
Le serveur devrait se lancer sur http://localhost:5173

### Étape 3: Utiliser les outils de diagnostic
1. Ouvrir le frontend (http://localhost:5173)
2. Aller sur la page d'accueil
3. Utiliser l'outil de diagnostic qui s'affiche automatiquement
4. Cliquer sur "Tester la connexion" avec les comptes prédéfinis

### Étape 4: Tester la connexion manuelle
1. Aller sur la page de connexion (/login)
2. Cliquer sur un des boutons de démonstration
3. Ou saisir manuellement:
   - Email: admin@learnalanguage.com
   - Mot de passe: password123

## Diagnostics automatiques

L'outil de diagnostic vérifie:
- ✅ **Variables d'environnement** (.env)
- ✅ **Accessibilité du backend** (http://localhost:3000)
- ✅ **Configuration CORS** (cookies et headers)
- ✅ **Endpoint d'authentification** (/auth/me)
- ✅ **Test de connexion complet** (avec compte réel)

## Problèmes potentiels et solutions

### Backend non accessible
- **Symptôme**: Erreur "ECONNREFUSED" ou "Network Error"
- **Solution**: Vérifier que le backend est démarré avec `npm run dev`

### Erreur CORS
- **Symptôme**: Erreur "blocked by CORS policy"
- **Solution**: Vérifier que ORIGIN="http://localhost:5173" dans le .env du backend

### Erreur d'authentification
- **Symptôme**: "Email ou mot de passe incorrect"
- **Solution**: Vérifier que les utilisateurs existent en base de données

### Problème de cookies
- **Symptôme**: "Non authentifié" après connexion réussie
- **Solution**: Vérifier que withCredentials: true est configuré

## Comptes de test disponibles

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@learnalanguage.com | password123 | Admin |
| teacher@learnalanguage.com | password123 | Teacher |
| student@learnalanguage.com | password123 | Student |
| test@learnalanguage.com | password123 | Student |

## Suppression des outils de diagnostic

Une fois les problèmes résolus, supprimer les composants de diagnostic:

1. Supprimer l'import et l'utilisation de `DiagnosticTool` dans `Home.jsx`
2. Supprimer les fichiers:
   - `src/components/DiagnosticTool.jsx`
   - `src/components/ConnectionTest.jsx`
   - `src/utils/testConnection.js`
