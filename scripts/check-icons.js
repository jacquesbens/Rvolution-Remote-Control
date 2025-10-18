const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic des icônes R_VOLUTION Remote\n');
console.log('='.repeat(50));

const iconsToCheck = [
  'icon.png',
  'adaptive-icon.png',
  'splash-icon.png',
  'favicon.png'
];

const assetsPath = path.join(__dirname, '..', 'assets', 'images');

iconsToCheck.forEach(iconName => {
  const iconPath = path.join(assetsPath, iconName);
  
  if (fs.existsSync(iconPath)) {
    const stats = fs.statSync(iconPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`\n✅ ${iconName}`);
    console.log(`   Taille: ${sizeKB} KB`);
    console.log(`   Dernière modification: ${stats.mtime.toLocaleString()}`);
    
    if (stats.size < 1000) {
      console.log('   ⚠️  ATTENTION: Fichier très petit, probablement corrompu');
    }
  } else {
    console.log(`\n❌ ${iconName}`);
    console.log('   Fichier manquant !');
  }
});

console.log('\n' + '='.repeat(50));
console.log('\n💡 Recommandations:');
console.log('   1. Assurez-vous que icon.png fait au moins 1024x1024 pixels');
console.log('   2. Le fichier doit être au format PNG');
console.log('   3. Exécutez: yarn setup-icons pour copier l\'icône');
console.log('   4. Créez un nouveau build: eas build --platform ios\n');