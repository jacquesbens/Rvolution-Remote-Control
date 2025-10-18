const fs = require('fs');
const path = require('path');

console.log('🎨 Configuration de l\'icône R_VOLUTION...\n');

// Utiliser adaptive-icon.png comme source (elle existe et fonctionne)
const sourceIcon = path.join(__dirname, '..', 'assets', 'images', 'adaptive-icon.png');
const mainIcon = path.join(__dirname, '..', 'assets', 'images', 'icon.png');

// Vérifier que l'icône source existe
if (!fs.existsSync(sourceIcon)) {
  console.error('❌ Erreur: adaptive-icon.png n\'existe pas');
  process.exit(1);
}

// Copier adaptive-icon.png vers icon.png
try {
  fs.copyFileSync(sourceIcon, mainIcon);
  console.log('✅ icon.png créé avec succès à partir de adaptive-icon.png');
  
  // Vérifier la taille du fichier
  const stats = fs.statSync(mainIcon);
  console.log(`📊 Taille du fichier: ${(stats.size / 1024).toFixed(2)} KB`);
  
} catch (error) {
  console.error('❌ Erreur lors de la création de icon.png:', error.message);
  process.exit(1);
}

console.log('\n🎉 Icône configurée avec succès !');
console.log('\n🚀 Vous pouvez maintenant créer un nouveau build iOS !');
console.log('   Commande: eas build --platform ios --profile production --clear-cache');