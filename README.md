# Lingusophia

Une application web moderne d'apprentissage des langues construite avec React, Vite et i18next pour une expérience multilingue fluide.

## 🚀 Technologies Utilisées

### Frontend Core
- **React 18** - Bibliothèque JavaScript pour construire l'interface utilisateur
- **Vite** - Outil de build ultra-rapide avec Hot Module Replacement (HMR)
- **React Router DOM** - Navigation côté client
- **Sass** - Préprocesseur CSS pour un styling avancé

### Internationalisation
- **i18next** - Framework d'internationalisation complet
- **react-i18next** - Intégration React pour i18next
- **i18next-browser-languagedetector** - Détection automatique de la langue
- **i18next-http-backend** - Chargement dynamique des traductions

### UI & Animations
- **Framer Motion** - Animations fluides et interactions
- **Lucide React** - Icônes modernes
- **FontAwesome** - Bibliothèque d'icônes complémentaire

### Intégrations
- **Stripe.js** - Système de paiement sécurisé
- **Axios** - Client HTTP pour les appels API

## 📋 Prérequis
- Git
- Vscode
- Node.js (version 18 ou supérieure)
- npm

## 🔧 Installation

Clonez le repository et installez les dépendances :

```bash
git clone https://github.com/kimiko1/Lingusophia.git
cd Lingusophia
npm install
```

Ensuite creer un .env avec les informations si dessous

```
VITE_API_URL=https://lingusophiaback-production.up.railway.app
# VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=production
```
utilisez le premier ``VITE_API_URL`` si vous n'avez pas encore cloner le back, mais si vous l'avez fais vous pouvez utilisez le deuxième.

## 🏃 Démarrage

### Mode développement

Lancez le serveur de développement avec HMR :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

Créez une version optimisée pour la production :

```bash
npm run build
```

### Prévisualisation du build

Prévisualisez le build de production localement :

```bash
npm run preview
```

## 📦 Déploiement

Ce projet est déployer avec railway.

## 🛠️ Configuration

### Plugin Vite
Le projet utilise `@vitejs/plugin-react` avec Babel pour le Fast Refresh.

### Plugins de Build
- **vite-plugin-compression** - Compression des assets pour de meilleures performances
- **rollup-plugin-visualizer** - Analyse visuelle du bundle

## 📁 Structure du Projet

```
Lingusophia/
├── src/
│   ├── components/     # Composants React réutilisables
│   ├── pages/          # Pages de l'application
│   ├── locales/        # Fichiers de traduction (i18next)
│   ├── styles/         # Fichiers Sass/CSS
│   ├── utils/          # Fonctions utilitaires
│   ├── services/       # Services API (Axios)
│   ├── App.jsx         # Composant principal
│   └── main.jsx        # Point d'entrée
├── public/             # Assets statiques
│   └── locales/        # Traductions publiques
├── index.html          # Template HTML
├── vite.config.js      # Configuration Vite
├── package.json        # Dépendances et scripts
└── README.md           # Ce fichier
```

## 🎯 Fonctionnalités

- ✨ Interface utilisateur moderne et réactive
- 🌍 Support multilingue avec détection automatique de la langue
- 💳 Intégration de paiements sécurisés avec Stripe
- 🎬 Animations fluides avec Framer Motion
- 🎨 Design personnalisable avec Sass
- ⚡ Build optimisé avec compression automatique
- 🔄 Hot Module Replacement pour un développement rapide
- 📱 Design responsive

## 🌐 Configuration i18next

L'application détecte automatiquement la langue du navigateur et charge les traductions appropriées. Les fichiers de traduction sont situés dans le dossier `public/locales/`.

Structure des traductions :
```
public/locales/
├── en/
│   └── translation.json
├── fr/
│   └── translation.json
└── ...
```

## 💳 Configuration Stripe

Pour utiliser les fonctionnalités de paiement, vous devez configurer vos clés API Stripe dans les variables d'environnement.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée le build de production optimisé
- `npm run preview` - Prévisualise le build de production sur le port 5173
- `npm run lint` - Vérifie le code avec ESLint

## 🔧 Outils de Développement

- **ESLint** - Linting avec configuration React
- **SVGR** - Transformation des SVG en composants React
- **TypeScript Types** - Types pour React et React DOM

## 📄 Licence

Ce projet est sous licence privée.

## 👤 Auteur

**kimiko1**

- GitHub: [@kimiko1](https://github.com/kimiko1)

## 🙏 Remerciements

- React Team pour React
- Vite Team pour Vite
- i18next Team pour l'internationalisation
- Stripe pour l'intégration de paiements
- Tous les contributeurs open source

---

**Note**: 
- Configurez vos clés API Stripe dans les variables d'environnement avant le déploiement
- Assurez-vous d'avoir tous les fichiers de traduction nécessaires dans `public/locales/`
