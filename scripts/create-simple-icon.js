const fs = require('fs');
const path = require('path');

console.log('🎨 Configuration d\'une icône temporaire...\n');

// Chemins des fichiers
const sourceIcon = path.join(__dirname, '..', 'assets', 'images', 'icon.png');
const targetIcons = [
  path.join(__dirname, '..', 'assets', 'images', 'adaptive-icon.png'),
  path.join(__dirname, '..', 'assets', 'images', 'splash-icon.png'),
  path.join(__dirname, '..', 'assets', 'images', 'favicon.png')
];

// Vérifier que l'icône source existe
if (!fs.existsSync(sourceIcon)) {
  console.error('❌ Erreur: icon.png n\'existe pas dans assets/images/');
  console.log('\n💡 Veuillez placer votre icône icon.png dans assets/images/ puis réessayer.');
  process.exit(1);
}

// Copier l'icône vers tous les emplacements
let successCount = 0;
targetIcons.forEach(targetPath => {
  try {
    fs.copyFileSync(sourceIcon, targetPath);
    const fileName = path.basename(targetPath);
    console.log(`✅ ${fileName} créé avec succès`);
    successCount++;
  } catch (error) {
    console.error(`❌ Erreur lors de la copie vers ${path.basename(targetPath)}:`, error.message);
  }
});

console.log(`\n🎉 ${successCount}/${targetIcons.length} icônes configurées avec succès !`);
console.log('\n📝 Note: L\'icône actuelle est temporaire.');
console.log('Pour utiliser votre propre icône avec le "R" blanc:');
console.log('1. Créez une image PNG 1024x1024 pixels');
console.log('2. Placez-la dans assets/images/icon.png');
console.log('3. Exécutez: node scripts/setup-icons.js');
console.log('\n🚀 Vous pouvez maintenant créer un nouveau build iOS !');