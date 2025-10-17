# Codes IR R_VOLUTION

Ce document liste tous les codes IR disponibles pour contrôler le lecteur R_VOLUTION.

## Format de commande

```
http://<player-ip-address>/cgi-bin/do?cmd=ir_code&ir_code=<CODE>
```

## Codes disponibles

### Lecture et contrôle de base

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Play/Pause | `AC534040` | Basculer entre lecture et pause |
| Stop | `BD424040` | Arrêter la lecture |
| Next | `E11E4040` | Piste suivante |
| Previous | `E01F4040` | Piste précédente |

### Contrôle du volume

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Volume Up | `E7184040` | Augmenter le volume |
| Volume Down | `E8174040` | Diminuer le volume |
| Mute | `BC434040` | Activer/désactiver le son |

### Navigation avancée

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Fast Forward | `E41BBF00` | Avance rapide |
| Fast Reverse | `E31CBF00` | Retour rapide |
| 60 sec forward | `EE114040` | Avancer de 60 secondes |
| 60 sec rewind | `EF104040` | Reculer de 60 secondes |
| 10 sec forward | `BF404040` | Avancer de 10 secondes |
| 10 sec rewind | `DF204040` | Reculer de 10 secondes |

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
| Home | `E51A4040` | Retour à l\'accueil |
| Menu | `BA454040` | Ouvrir le menu |
| Info | `BB444040` | Afficher les informations |
| Return | `BD424040` | Retour |

### Alimentation

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Power Toggle | `B24D4040` | Basculer l\'alimentation |
| Power On | `4CB34040` | Allumer l\'appareil |
| Power Off | `4AB54040` | Éteindre l\'appareil |

### Fonctions spéciales

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Audio | `E6194040` | Changer la piste audio |
| Subtitle | `E41B4040` | Activer/désactiver les sous-titres |
| Repeat | `B9464040` | Mode répétition |
| Zoom | `E21D4040` | Fonction zoom |
| 3D | `ED124040` | Mode 3D |
| R_video | `EC134040` | Mode R_video |

### Fonctions couleur

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Function Red | `A68E4040` | Bouton rouge |
| Function Green | `F50A4040` | Bouton vert |
| Function Yellow | `BE414040` | Bouton jaune |
| Function Blue | `AB544040` | Bouton bleu |

### Autres fonctions

| Fonction | Code IR | Description |
|----------|---------|-------------|
| Explorer | `EA164040` | Mode explorateur |
| Format Scroll | `EB144040` | Défilement du format |
| Mouse | `B98F4040` | Mode souris |
| Dimmer | `A45B4040` | Réglage de la luminosité |
| Page Up | `BF404040` | Page précédente |
| Page Down | `DB204040` | Page suivante |
| Delete | `F30C4040` | Supprimer |

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

## Exemple d\'utilisation

### Avec curl
```bash
curl "http://192.168.1.100/cgi-bin/do?cmd=ir_code&ir_code=AC534040"
```

### Avec JavaScript/TypeScript
```typescript
const response = await fetch(
  'http://192.168.1.100/cgi-bin/do?cmd=ir_code&ir_code=AC534040'
);
```

## Notes

- Tous les codes sont en hexadécimal
- Les commandes sont envoyées via HTTP GET
- Le serveur doit répondre même si le code IR n\'est pas reconnu
- Play et Pause utilisent le même code (toggle)
- Certains codes peuvent varier selon le modèle de l\'appareil