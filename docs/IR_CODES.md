# Codes IR R_VOLUTION

Ce document liste tous les codes IR disponibles pour contrôler le lecteur multimédia R_VOLUTION.

## Format de commande

```
http://<player-ip-address>/cgi-bin/do?cmd=ir_code&ir_code=<CODE>
```

Exemple :
```
http://192.168.1.100/cgi-bin/do?cmd=ir_code&ir_code=AC534040
```

## Codes IR disponibles

### Lecture et contrôle

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Play/Pause | `AC534040` | Bascule entre lecture et pause |
| Stop | `BD424040` | Arrête la lecture |
| Next | `E11E4040` | Piste suivante |
| Previous | `E01F4040` | Piste précédente |

### Volume

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Volume Up | `E7184040` | Augmente le volume |
| Volume Down | `E8174040` | Diminue le volume |
| Mute | `BC434040` | Active/désactive le son |

### Navigation avancée

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Fast Forward | `E41BBF00` | Avance rapide |
| Fast Reverse | `E31CBF00` | Retour rapide |
| 60 sec forward | `EE114040` | Avance de 60 secondes |
| 60 sec rewind | `EF104040` | Recule de 60 secondes |
| 10 sec forward | `BF404040` | Avance de 10 secondes |
| 10 sec rewind | `DF204040` | Recule de 10 secondes |

### Navigation curseur

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Cursor Up | `F40B4040` | Curseur vers le haut |
| Cursor Down | `F10E4040` | Curseur vers le bas |
| Cursor Left | `EF104040` | Curseur vers la gauche |
| Cursor Right | `EE114040` | Curseur vers la droite |
| Cursor Enter | `F20D4040` | Valider la sélection |

### Menu et navigation

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Home | `E51A4040` | Retour à l'accueil |
| Menu | `BA454040` | Ouvre le menu |
| Info | `BB444040` | Affiche les informations |
| Return | `BD424040` | Retour en arrière |

### Alimentation

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Power Toggle | `B24D4040` | Bascule marche/arrêt |
| Power On | `4CB34040` | Allume l'appareil |
| Power Off | `4AB54040` | Éteint l'appareil |

### Fonctions spéciales

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Audio | `E6194040` | Change la piste audio |
| Subtitle | `E41B4040` | Active/désactive les sous-titres |
| Repeat | `B9464040` | Mode répétition |
| Zoom | `E21D4040` | Fonction zoom |
| 3D | `ED124040` | Mode 3D |
| R_video | `EC134040` | Mode R_video |
| Explorer | `EA164040` | Explorateur de fichiers |
| Format Scroll | `EB144040` | Défilement du format |
| Mouse | `B98F4040` | Mode souris |
| Dimmer | `A45B4040` | Réglage de la luminosité |
| Delete | `F30C4040` | Supprimer |
| Page Up | `BF404040` | Page précédente |
| Page Down | `DB204040` | Page suivante |

### Fonctions couleur

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Function Red | `A68E4040` | Bouton rouge |
| Function Green | `F50A4040` | Bouton vert |
| Function Yellow | `BE414040` | Bouton jaune |
| Function Blue | `AB544040` | Bouton bleu |

### Chiffres (0-9)

| Fonction | Code IR |
|----------|---------|
| Digit 0 | `FF004040` |
| Digit 1 | `FE014040` |
| Digit 2 | `FD024040` |
| Digit 3 | `FC034040` |
| Digit 4 | `FB044040` |
| Digit 5 | `FA054040` |
| Digit 6 | `F9064040` |
| Digit 7 | `F8074040` |
| Digit 8 | `F7084040` |
| Digit 9 | `F6094040` |

## Notes importantes

1. **Play/Pause** : Utilise le même code IR car c'est un toggle (bascule)
2. **Timeout** : Les commandes ont un timeout de 5 secondes
3. **Réponse** : Le serveur doit répondre avec un code HTTP 200 pour confirmer la réception
4. **Délai** : Il est recommandé d'attendre au moins 100ms entre deux commandes

## Utilisation dans l'application

Les codes IR sont définis dans le fichier `services/playerAPI.ts` :

```typescript
const IR_CODES = {
  PLAY_PAUSE: 'AC534040',
  STOP: 'BD424040',
  // ... autres codes
};
```

Pour ajouter une nouvelle commande :

1. Ajoutez le code IR dans l'objet `IR_CODES`
2. Créez une méthode dans la classe `RvolutionPlayerAPI`
3. Utilisez `sendIRCommand()` pour envoyer la commande

Exemple :

```typescript
async maNouvelleFonction(): Promise<boolean> {
  return this.sendIRCommand(IR_CODES.MA_FONCTION);
}
```