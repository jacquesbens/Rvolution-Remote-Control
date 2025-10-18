# Scripts R_VOLUTION Remote

## Configuration des icônes

### setup-icons.js

Ce script copie automatiquement l'icône principale (`icon.png`) vers tous les emplacements nécessaires pour l'application.

#### Utilisation

```bash
npm run setup-icons
# ou
yarn setup-icons
```

#### Ce que fait le script

Le script copie `assets/images/icon.png` vers :
- `assets/images/adaptive-icon.png` - Icône adaptative pour Android
- `assets/images/splash-icon.png` - Icône pour l'écran de démarrage
- `assets/images/favicon.png` - Favicon pour le web

#### Quand l'utiliser

- Après avoir mis à jour l'icône principale de l'application
- Lors de la configuration initiale du projet
- Avant de créer un nouveau build pour iOS ou Android

## Notes

- Assurez-vous que `assets/images/icon.png` existe avant d'exécuter le script
- L'icône doit être au format PNG
- La taille recommandée est 1024x1024 pixels
- Le fond noir est déjà configuré dans `app.json` pour le splash screen et l'icône adaptative Android