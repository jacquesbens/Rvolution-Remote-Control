const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC COMPLET - R_VOLUTION Remote\n');
console.log('='.repeat(60));

// 1. Vérifier app.json
console.log('\n📄 Vérification de app.json...');
try {
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  console.log('✅ app.json est valide');
  console.log(`   Nom: ${appJson.expo.name}`);
  console.log(`   Version: ${appJson.expo.version}`);
  console.log(`   Bundle ID iOS: ${appJson.expo.ios?.bundleIdentifier || 'Non défini'}`);
  console.log(`   Build Number iOS: ${appJson.expo.ios?.buildNumber || 'Non défini'}`);
} catch (error) {
  console.log('❌ Erreur avec app.json:', error.message);
}

// 2. Vérifier les icônes
console.log('\n🎨 Vérification des icônes...');
const iconsToCheck = [
  { name: 'icon.png', minSize: 50000 },
  { name: 'adaptive-icon.png', minSize: 50000 },
  { name: 'splash-icon.png', minSize: 50000 },
  { name: 'favicon.png', minSize: 10000 }
];

const assetsPath = path.join(__dirname, '..', 'assets', 'images');
let allIconsValid = true;

iconsToCheck.forEach(({ name, minSize }) => {
  const iconPath = path.join(assetsPath, name);
  
  if (fs.existsSync(iconPath)) {
    const stats = fs.statSync(iconPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    if (stats.size >= minSize) {
      console.log(`✅ ${name} - ${sizeKB} KB`);
    } else {
      console.log(`⚠️  ${name} - ${sizeKB} KB (trop petit, minimum ${(minSize/1024).toFixed(0)} KB)`);
      allIconsValid = false;
    }
  } else {
    console.log(`❌ ${name} - Fichier manquant`);
    allIconsValid = false;
  }
});

// 3. Vérifier package.json
console.log('\n📦 Vérification de package.json...');
try {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('✅ package.json est valide');
  console.log(`   Nom: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}`);
  
  // Vérifier les dépendances critiques
  const criticalDeps = ['expo', 'react', 'react-native'];
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep}: Manquant`);
    }
  });
} catch (error) {
  console.log('❌ Erreur avec package.json:', error.message);
}

// 4. Vérifier eas.json
console.log('\n🚀 Vérification de eas.json...');
try {
  const easJsonPath = path.join(__dirname, '..', 'eas.json');
  const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
  
  console.log('✅ eas.json est valide');
  console.log(`   Profils de build: ${Object.keys(easJson.build).join(', ')}`);
} catch (error) {
  console.log('❌ Erreur avec eas.json:', error.message);
}

// 5. Vérifier les fichiers critiques
console.log('\n📁 Vérification des fichiers critiques...');
const criticalFiles = [
  'App.tsx',
  'index.ts',
  'babel.config.js',
  'metro.config.js',
  'tsconfig.json'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Manquant`);
  }
});

// Résumé
console.log('\n' + '='.repeat(60));
console.log('\n📊 RÉSUMÉ:');
if (allIconsValid) {
  console.log('✅ Toutes les icônes sont valides');
} else {
  console.log('⚠️  Certaines icônes ont des problèmes');
}

console.log('\n💡 PROCHAINES ÉTAPES:');
console.log('1. Si toutes les vérifications sont ✅, essayez:');
console.log('   eas build --platform ios --clear-cache');
console.log('\n2. Si le problème persiste, partagez le message d\'erreur exact');
console.log('   du build pour un diagnostic plus précis.\n');