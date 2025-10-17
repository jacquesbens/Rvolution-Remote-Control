# Guide de dépannage - R_VOLUTION Remote

## Problème : Aucun appareil trouvé lors du scan

### Vérifications à effectuer :

#### 1. **Vérifier que l'appareil R_VOLUTION est accessible**

Depuis un navigateur web sur le même réseau, essayez d'accéder à :
```
http://[IP_DE_VOTRE_APPAREIL]/cgi-bin/do?cmd=ir_code&ir_code=F10E4040
```

Par exemple :
```
http://192.168.1.100/cgi-bin/do?cmd=ir_code&ir_code=F10E4040
```

L'appareil devrait répondre (même avec une erreur si le code IR n'est pas valide).

#### 2. **Vérifier le réseau Wi-Fi**

- Votre smartphone et l'appareil R_VOLUTION doivent être sur le **même réseau Wi-Fi**
- Vérifiez que votre réseau n'isole pas les appareils (mode "isolation AP" désactivé)
- Certains réseaux d'entreprise ou publics bloquent la communication entre appareils

#### 3. **Vérifier l'adresse IP de votre réseau**

L'application scanne les sous-réseaux suivants :
- `192.168.1.x` (le plus commun)
- `192.168.0.x`
- `192.168.2.x`
- `10.0.0.x`
- `10.0.1.x`
- `172.16.0.x`

Si votre réseau utilise un autre sous-réseau, vous devrez ajouter l'appareil manuellement.

Pour trouver votre sous-réseau :
- **Sur iPhone** : Réglages > Wi-Fi > (i) à côté de votre réseau > Adresse IP
- **Sur Android** : Paramètres > Wi-Fi > Détails du réseau > Adresse IP

#### 4. **Vérifier le port**

Par défaut, l'application utilise le port **80** (HTTP standard).

Si votre appareil R_VOLUTION utilise un port différent, vous devrez l'ajouter manuellement.

#### 5. **Vérifier les endpoints de l'API**

L'application utilise le format CGI avec codes IR :

Format : `http://<player-ip-address>/cgi-bin/do?cmd=ir_code&ir_code=<CODE>`

Codes IR officiels R_VOLUTION :

**Lecture et contrôle :**
- `AC534040` - Play/Pause (toggle)
- `BD424040` - Stop
- `E11E4040` - Next
- `E01F4040` - Previous

**Volume :**
- `E7184040` - Volume Up
- `E8174040` - Volume Down
- `BC434040` - Mute

**Navigation avancée :**
- `E41BBF00` - Fast Forward
- `E31CBF00` - Fast Reverse
- `EE114040` - 60 sec forward
- `EF104040` - 60 sec rewind
- `BF404040` - 10 sec forward
- `DF204040` - 10 sec rewind

**Navigation curseur :**
- `F40B4040` - Cursor Up
- `F10E4040` - Cursor Down
- `EF104040` - Cursor Left
- `EE114040` - Cursor Right
- `F20D4040` - Cursor Enter

**Menu et navigation :**
- `E51A4040` - Home
- `BA454040` - Menu
- `BB444040` - Info
- `BD424040` - Return

**Fonctions spéciales :**
- `B24D4040` - Power Toggle
- `4CB34040` - Power On
- `4AB54040` - Power Off
- `E6194040` - Audio
- `E41B4040` - Subtitle
- `B9464040` - Repeat
- `E21D4040` - Zoom

**Fonctions couleur :**
- `A68E4040` - Function Red
- `F50A4040` - Function Green
- `BE414040` - Function Yellow
- `AB544040` - Function Blue

**Note** : Ces codes IR sont des exemples. Vérifiez les codes IR réels de votre appareil R_VOLUTION.

### Solutions :

#### Solution 1 : Ajout manuel

1. Appuyez sur le bouton **+** en haut à droite
2. Entrez l'adresse IP de votre appareil
3. Entrez le port (80 par défaut)
4. Appuyez sur "Ajouter l'appareil"

#### Solution 2 : Vérifier les logs

Ouvrez la console de développement pour voir les logs détaillés :
- Les tentatives de connexion sont loggées avec 🔍
- Les appareils trouvés sont loggés avec ✅
- Les erreurs sont loggées avec ❌

#### Solution 3 : Tester avec curl

Depuis un terminal sur le même réseau :
```bash
curl "http://192.168.1.100/cgi-bin/do?cmd=ir_code&ir_code=F10E4040"
```

Si cette commande ne fonctionne pas, le problème vient de l'appareil R_VOLUTION ou du réseau.

## Problème : L'appareil est trouvé mais ne répond pas aux commandes

### Vérifications :

1. **Vérifier que l'appareil est toujours en ligne**
   - Appuyez sur l'appareil dans la liste
   - Vérifiez le statut (point vert = en ligne)

2. **Vérifier les codes IR**
   - Les codes IR utilisés dans l'application sont des exemples
   - Consultez la documentation de votre appareil R_VOLUTION pour les codes IR corrects
   - Modifiez les codes dans `services/playerAPI.ts` si nécessaire

3. **Tester manuellement les commandes**
   - Testez avec curl :
   ```bash
   curl "http://192.168.1.100/cgi-bin/do?cmd=ir_code&ir_code=F10E4040"
   ```

## Problème : Le scan est très lent

C'est normal ! Le scan complet peut prendre plusieurs minutes car il teste :
- 6 sous-réseaux différents
- 254 adresses IP par sous-réseau
- Soit 1524 adresses IP au total

Pour accélérer :
1. Utilisez l'ajout manuel si vous connaissez l'IP
2. Le scan s'arrête dès qu'il trouve un appareil

## Configuration des codes IR

Les codes IR officiels R_VOLUTION sont maintenant intégrés dans l'application.

Si vous avez besoin de modifier ou d'ajouter des codes, éditez le fichier `services/playerAPI.ts` :

```typescript
const IR_CODES = {
  PLAY_PAUSE: 'AC534040',    // Play/Pause (toggle)
  STOP: 'BD424040',          // Stop
  NEXT: 'E11E4040',          // Next
  PREVIOUS: 'E01F4040',      // Previous
  VOLUME_UP: 'E7184040',     // Volume Up
  VOLUME_DOWN: 'E8174040',   // Volume Down
  MUTE: 'BC434040',          // Mute
  // ... autres codes
};
```

**Note importante :** Play et Pause utilisent le même code IR (`AC534040`) car c'est un toggle (bascule).

## Support

Pour plus d'aide, vérifiez :
1. La documentation de votre appareil R_VOLUTION
2. Que le firmware de l'appareil est à jour
3. Que l'API CGI est activée sur l'appareil
4. Les codes IR corrects pour votre modèle
