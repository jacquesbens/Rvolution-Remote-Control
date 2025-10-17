# Guide de dépannage - R_VOLUTION Remote

## Problème : Aucun appareil trouvé lors du scan

### Vérifications à effectuer :

#### 1. **Vérifier que l'appareil R_VOLUTION est accessible**

Depuis un navigateur web sur le même réseau, essayez d'accéder à :
```
http://[IP_DE_VOTRE_APPAREIL]/status
```

Par exemple :
```
http://192.168.1.100/status
```

L'appareil devrait répondre avec un JSON contenant le statut du lecteur.

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

L'application s'attend à ce que l'appareil R_VOLUTION expose les endpoints suivants :

- `GET /status` - Obtenir le statut du lecteur
- `POST /play` - Démarrer la lecture
- `POST /pause` - Mettre en pause
- `POST /stop` - Arrêter la lecture
- `POST /next` - Piste suivante
- `POST /previous` - Piste précédente
- `POST /volume` - Définir le volume (body: `{"volume": 50}`)

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
curl http://192.168.1.100/status
```

Si cette commande ne fonctionne pas, le problème vient de l'appareil R_VOLUTION ou du réseau.

## Problème : L'appareil est trouvé mais ne répond pas aux commandes

### Vérifications :

1. **Vérifier que l'appareil est toujours en ligne**
   - Appuyez sur l'appareil dans la liste
   - Vérifiez le statut (point vert = en ligne)

2. **Vérifier les endpoints de contrôle**
   - Testez manuellement avec curl :
   ```bash
   curl -X POST http://192.168.1.100/play
   curl -X POST http://192.168.1.100/pause
   ```

3. **Vérifier le format de la réponse**
   - L'endpoint `/status` doit retourner un JSON valide
   - Exemple de réponse attendue :
   ```json
   {
     "isPlaying": true,
     "volume": 50,
     "currentTrack": "Nom de la piste"
   }
   ```

## Problème : Le scan est très lent

C'est normal ! Le scan complet peut prendre plusieurs minutes car il teste :
- 6 sous-réseaux différents
- 254 adresses IP par sous-réseau
- Soit 1524 adresses IP au total

Pour accélérer :
1. Utilisez l'ajout manuel si vous connaissez l'IP
2. Le scan s'arrête dès qu'il trouve un appareil

## Support

Pour plus d'aide, vérifiez :
1. La documentation de votre appareil R_VOLUTION
2. Que le firmware de l'appareil est à jour
3. Que l'API HTTP est activée sur l'appareil