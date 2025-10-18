# 🎨 Configuration des Icônes R_VOLUTION Remote

## ✅ Icônes actuellement configurées

Votre nouvelle icône avec le "R" blanc sur fond noir a été uploadée avec succès dans :
- `assets/images/icon.png`

## 🚀 Étapes pour finaliser la configuration

### Option 1 : Utiliser le script automatique (Recommandé)

Exécutez simplement cette commande dans votre terminal :

```bash
yarn setup-icons
```

ou

```bash
npm run setup-icons
```

Ce script va automatiquement copier votre icône vers tous les emplacements nécessaires.

### Option 2 : Copie manuelle

Si vous préférez copier manuellement, copiez `icon.png` vers :
- `adaptive-icon.png`
- `splash-icon.png`
- `favicon.png`

## 📱 Où sont utilisées les icônes ?

| Fichier | Utilisation | Plateforme |
|---------|-------------|------------|
| `icon.png` | Icône principale de l'app | iOS, Android |
| `adaptive-icon.png` | Icône adaptative avec fond noir | Android |
| `splash-icon.png` | Écran de démarrage | iOS, Android, Web |
| `favicon.png` | Icône du navigateur | Web |

## 🎨 Configuration actuelle dans app.json

Toutes les icônes sont déjà correctement configurées avec :
- Fond noir (`#000000`) pour le splash screen
- Fond noir pour l'icône adaptative Android
- Mode `contain` pour préserver les proportions du "R"

## 🔄 Après la configuration

Une fois les icônes copiées, vous devrez :

1. **Pour tester localement** : Redémarrez simplement l'app
2. **Pour un nouveau build** : Créez un nouveau build avec EAS :
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

## ✨ Résultat attendu

Votre application affichera maintenant le logo "R" blanc sur fond noir :
- Sur l'écran d'accueil de l'appareil
- Dans l'écran de démarrage (splash screen)
- Dans le navigateur (favicon)
- Dans les paramètres de l'appareil

---

**Note** : L'icône que vous avez uploadée est parfaite pour l'application R_VOLUTION Remote ! 🎉