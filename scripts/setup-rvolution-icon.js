const fs = require('fs');
const path = require('path');

console.log('🎨 Configuration de l\'icône R_VOLUTION...\n');

// Chemins des fichiers
const sourceIcon = path.join(__dirname, '..', 'assets', 'images', 'icon-temp.png');
const mainIcon = path.join(__dirname, '..', 'assets', 'images', 'icon.png');
const targetIcons = [
  path.join(__dirname, '..', 'assets', 'images', 'adaptive-icon.png'),
  path.join(__dirname, '..', 'assets', 'images', 'splash-icon.png'),
  path.join(__dirname, '..', 'assets', 'images', 'favicon.png')
];

// Vérifier que l'icône source existe
if (!fs.existsSync(sourceIcon)) {
  console.error('❌ Erreur: icon-temp.png n\'existe pas');
  process.exit(1);
}

// Copier vers icon.png
try {
  fs.copyFileSync(sourceIcon, mainIcon);
  console.log('✅ icon.png créé avec succès');
} catch (error) {
  console.error('❌ Erreur lors de la création de icon.png:', error.message);
  process.exit(1);
}

// Copier vers tous les autres emplacements
let successCount = 0;
targetIcons.forEach(targetPath => {
  try {
    fs.copyFileSync(mainIcon, targetPath);
    const fileName = path.basename(targetPath);
    console.log(`✅ ${fileName} créé avec succès`);
    successCount++;
  } catch (error) {
    console.error(`❌ Erreur lors de la copie vers ${path.basename(targetPath)}:`, error.message);
  }
});

console.log(`\n🎉 ${successCount + 1}/${targetIcons.length + 1} icônes configurées avec succès !`);
console.log('\n🚀 Vous pouvez maintenant créer un nouveau build iOS !');
console.log('   Commande: eas build --platform ios --profile production --clear-cache');