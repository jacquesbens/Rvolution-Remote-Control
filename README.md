# R_VOLUTION Remote Control

Application mobile iOS et Android pour contrôler les lecteurs multimédia R_VOLUTION via IP.

## 🎯 Fonctionnalités

- ✅ Découverte automatique des appareils R_VOLUTION sur le réseau local
- ✅ Ajout manuel d'appareils par adresse IP
- ✅ Contrôle complet du lecteur (Play, Pause, Stop, Next, Previous)
- ✅ Contrôle du volume (Volume +/-, Mute)
- ✅ Navigation avancée (Fast Forward, Fast Reverse, Skip 10s/60s)
- ✅ Navigation curseur pour les menus
- ✅ Fonctions spéciales (Audio, Subtitle, Repeat, Zoom, etc.)
- ✅ Gestion de plusieurs appareils
- ✅ Interface moderne et intuitive

## 📱 Captures d'écran

[À ajouter]

## 🚀 Installation

### Prérequis

- Node.js 18+ et Yarn
- Expo CLI
- Un appareil iOS ou Android, ou un émulateur

### Installation des dépendances

```bash
yarn install
```

### Lancement de l'application

```bash
yarn start
```

Scannez le QR code avec l'application Expo Go sur votre smartphone.

## 🔧 Configuration

### Réseau

L'application et les appareils R_VOLUTION doivent être sur le **même réseau Wi-Fi**.

### Codes IR

Les codes IR officiels R_VOLUTION sont déjà configurés dans l'application.

Pour consulter la liste complète des codes IR disponibles, voir [docs/IR_CODES.md](docs/IR_CODES.md).

## 📖 Utilisation

### 1. Découverte automatique

1. Lancez l'application
2. Appuyez sur le bouton 🔍 (Scan) en haut à droite
3. L'application va scanner le réseau local
4. Les appareils trouvés apparaîtront automatiquement dans la liste

**Note** : Le scan peut prendre plusieurs minutes car il teste plusieurs sous-réseaux.

### 2. Ajout manuel

1. Appuyez sur le bouton + en haut à droite
2. Entrez l'adresse IP de votre appareil (ex: 192.168.1.100)
3. Entrez le port (80 par défaut)
4. Donnez un nom à votre appareil (optionnel)
5. Appuyez sur "Ajouter l'appareil"

### 3. Contrôle du lecteur

1. Appuyez sur un appareil dans la liste
2. Utilisez les boutons pour contrôler la lecture :
   - **Play/Pause** : Lance ou met en pause la lecture
   - **Stop** : Arrête la lecture
   - **Next/Previous** : Piste suivante/précédente
   - **Volume +/-** : Augmente/diminue le volume
   - **Mute** : Active/désactive le son

## 🛠️ Développement

### Structure du projet

```
user-app/
├── App.tsx                 # Point d'entrée de l'application
├── screens/                # Écrans de l'application
│   ├── DevicesScreen.tsx   # Liste des appareils
│   ├── AddDeviceScreen.tsx # Ajout manuel d'un appareil
│   └── PlayerControlScreen.tsx # Contrôle du lecteur
├── components/             # Composants réutilisables
│   ├── DeviceCard.tsx      # Carte d'appareil
│   └── ControlButton.tsx   # Bouton de contrôle
├── services/               # Services
│   ├── playerAPI.ts        # API de contrôle du lecteur
│   └── networkDiscovery.ts # Découverte réseau
├── utils/                  # Utilitaires
│   └── storage.ts          # Stockage local
├── types/                  # Types TypeScript
│   └── index.ts
└── docs/                   # Documentation
    └── IR_CODES.md         # Liste des codes IR
```

### API du lecteur

L'API utilise le format CGI avec codes IR :

```
http://<player-ip-address>/cgi-bin/do?cmd=ir_code&ir_code=<CODE>
```

Exemple :
```typescript
// Envoyer la commande Play/Pause
const api = new RvolutionPlayerAPI('192.168.1.100', 80);
await api.play();
```

Voir [services/playerAPI.ts](services/playerAPI.ts) pour la liste complète des méthodes disponibles.

### Ajouter une nouvelle commande

1. Ajoutez le code IR dans `services/playerAPI.ts` :

```typescript
const IR_CODES = {
  // ... codes existants
  MA_NOUVELLE_FONCTION: 'ABCD1234',
};
```

2. Créez une méthode dans la classe `RvolutionPlayerAPI` :

```typescript
async maNouvelleCommande(): Promise<boolean> {
  return this.sendIRCommand(IR_CODES.MA_NOUVELLE_FONCTION);
}
```

3. Utilisez la commande dans votre écran :

```typescript
await api.maNouvelleCommande();
```

## 🐛 Dépannage

Consultez le fichier [TROUBLESHOOTING.md](TROUBLESHOOTING.md) pour les problèmes courants et leurs solutions.

### Problèmes fréquents

**Aucun appareil trouvé lors du scan**
- Vérifiez que l'appareil et le smartphone sont sur le même réseau Wi-Fi
- Vérifiez que l'appareil R_VOLUTION est allumé
- Essayez l'ajout manuel avec l'adresse IP

**Les commandes ne fonctionnent pas**
- Vérifiez que l'appareil est accessible (point vert dans la liste)
- Testez manuellement avec curl :
  ```bash
  curl "http://192.168.1.100/cgi-bin/do?cmd=ir_code&ir_code=AC534040"
  ```
- Consultez les logs dans la console de développement

**Le scan est très lent**
- C'est normal, le scan teste plusieurs sous-réseaux
- Utilisez l'ajout manuel si vous connaissez l'adresse IP

## 📄 Licence

[À définir]

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème :
1. Consultez la [documentation](docs/)
2. Vérifiez le [guide de dépannage](TROUBLESHOOTING.md)
3. Ouvrez une issue sur GitHub

## 🙏 Remerciements

Merci à l'équipe R_VOLUTION pour la documentation des codes IR.