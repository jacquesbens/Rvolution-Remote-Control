const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration du build...\n');

// Vérifier package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('📦 Vérification des dépendances:');
const requiredDeps = {
  'react-native-reanimated': packageJson.dependencies['react-native-reanimated'],
  'react-native-worklets': packageJson.dependencies['react-native-worklets'],
  'react-native-worklets-core': packageJson.dependencies['react-native-worklets-core'],
  'expo-build-properties': packageJson.dependencies['expo-build-properties']
};

let allDepsOk = true;
for (const [dep, version] of Object.entries(requiredDeps)) {
  if (version) {
    console.log(`  ✅ ${dep}: ${version}`);
  } else {
    console.log(`  ❌ ${dep}: MANQUANT`);
    allDepsOk = false;
  }
}

// Vérifier la compatibilité des versions
console.log('\n🔗 Vérification de la compatibilité:');
const workletsVersion = packageJson.dependencies['react-native-worklets'];
if (workletsVersion && workletsVersion.startsWith('0.4')) {
  console.log('  ✅ react-native-worklets 0.4.x compatible avec Reanimated 4.1.x');
} else {
  console.log('  ⚠️  react-native-worklets devrait être en version 0.4.x pour Reanimated 4.1.x');
}

// Vérifier app.json
console.log('\n📱 Vérification de app.json:');
const appJsonPath = path.join(__dirname, '..', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

const splashImage = appJson.expo.splash.image;
console.log(`  Splash image: ${splashImage}`);

// Vérifier que le fichier splash existe
const splashPath = path.join(__dirname, '..', splashImage);
if (fs.existsSync(splashPath)) {
  console.log(`  ✅ Le fichier splash existe`);
} else {
  console.log(`  ❌ Le fichier splash n'existe pas`);
  allDepsOk = false;
}

// Vérifier les plugins
console.log('\n🔌 Plugins configurés:');
appJson.expo.plugins.forEach(plugin => {
  if (typeof plugin === 'string') {
    console.log(`  - ${plugin}`);
  } else if (Array.isArray(plugin)) {
    console.log(`  - ${plugin[0]} (avec config)`);
  }
});

// Vérifier babel.config.js
console.log('\n⚙️  Vérification de babel.config.js:');
const babelConfigPath = path.join(__dirname, '..', 'babel.config.js');
const babelConfig = fs.readFileSync(babelConfigPath, 'utf8');
if (babelConfig.includes('react-native-reanimated/plugin')) {
  console.log('  ✅ Plugin Reanimated configuré');
} else {
  console.log('  ❌ Plugin Reanimated manquant');
  allDepsOk = false;
}

console.log('\n' + '='.repeat(50));
if (allDepsOk) {
  console.log('✅ Tout est prêt pour le build !');
  console.log('\n🚀 Commande recommandée:');
  console.log('   eas build --platform ios --profile production --clear-cache');
} else {
  console.log('❌ Des problèmes ont été détectés');
  console.log('   Veuillez corriger les erreurs ci-dessus avant de lancer le build');
  process.exit(1);
}
