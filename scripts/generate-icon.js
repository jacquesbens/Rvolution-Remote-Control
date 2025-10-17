// Script pour générer les icônes de l'application
// Ce script peut être exécuté pour créer les différentes tailles d'icônes nécessaires

const fs = require('fs');
const path = require('path');

console.log('Pour générer les icônes de l\'application avec votre logo R_VOLUTION:');
console.log('1. Utilisez votre logo en haute résolution (1024x1024px minimum)');
console.log('2. Placez-le dans assets/images/icon.png');
console.log('3. Utilisez un outil comme https://www.appicon.co/ pour générer toutes les tailles');
console.log('4. Ou utilisez expo-cli: npx expo-cli build:ios/android');