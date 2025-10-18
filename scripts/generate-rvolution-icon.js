const fs = require('fs');
const path = require('path');

console.log('🎨 Génération de l\'icône R_VOLUTION...\n');

// Créer une icône SVG simple
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond noir -->
  <rect width="1024" height="1024" fill="#000000"/>
  
  <!-- Lettre R blanche -->
  <text 
    x="512" 
    y="650" 
    font-family="Arial, Helvetica, sans-serif" 
    font-size="600" 
    font-weight="bold" 
    fill="#FFFFFF" 
    text-anchor="middle">R</text>
</svg>`;

// Sauvegarder le SVG
const svgPath = path.join(__dirname, '..', 'assets', 'images', 'icon.svg');
fs.writeFileSync(svgPath, svgContent);
console.log('✅ Icône SVG créée: assets/images/icon.svg');

console.log('\n📝 Prochaines étapes:');
console.log('1. Convertissez le SVG en PNG 1024x1024 en utilisant:');
console.log('   - Un outil en ligne comme https://cloudconvert.com/svg-to-png');
console.log('   - Ou Figma/Photoshop/Illustrator');
console.log('2. Sauvegardez le PNG comme assets/images/icon.png');
console.log('3. Exécutez: yarn setup-icons');
console.log('\n💡 Ou utilisez l\'adaptive-icon.png existant qui fonctionne déjà!');