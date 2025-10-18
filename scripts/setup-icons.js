const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const sourceIcon = path.join(__dirname, '..', 'assets', 'images', 'icon.png');
const targetIcons = [
  path.join(__dirname, '..', 'assets', 'images', 'adaptive-icon.png'),
  path.join(__dirname, '..', 'assets', 'images', 'splash-icon.png'),
  path.join(__dirname, '..', 'assets', 'images', 'favicon.png')
];

console.log('🎨 Configuration des icônes R_VOLUTION...\n');

// Vérifier que l'icône source existe
if (!fs.existsSync(sourceIcon)) {
  console.error('❌ Erreur: icon.png n\'existe pas dans assets/images/');
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
console.log('\nIcônes configurées:');
console.log('  • icon.png - Icône principale de l\'application');
console.log('  • adaptive-icon.png - Icône adaptative Android');
console.log('  • splash-icon.png - Icône de l\'écran de démarrage');
console.log('  • favicon.png - Favicon pour le web');