const { experimental_generateImage: generateImage } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const fs = require('fs');
const path = require('path');

// Importer les polyfills pour Node.js
require('../polyfills');

const customProvider = createOpenAI({
  compatibility: 'strict',
  baseURL: process.env.EXPO_PUBLIC_KIKI_BASE_URL,
  apiKey: process.env.EXPO_PUBLIC_KIKI_API_KEY
});

async function generateAppIcon() {
  console.log('🎨 Génération de l\'icône R_VOLUTION Remote...\n');

  try {
    const { image } = await generateImage({
      model: customProvider.image('gpt-image-1'),
      prompt: 'A minimalist app icon with a bold white letter "R" centered on a pure black background. The R should be modern, clean, and sans-serif. Square format, 1024x1024 pixels. Professional and sleek design.',
      size: '1024x1024',
      providerOptions: {
        openai: { quality: 'standard' }
      }
    });

    // Sauvegarder l'icône
    const iconPath = path.join(__dirname, '..', 'assets', 'images', 'icon.png');
    const base64Data = image.base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    fs.writeFileSync(iconPath, buffer);
    console.log('✅ Icône principale générée: assets/images/icon.png');

    // Copier vers les autres emplacements
    const targetIcons = [
      path.join(__dirname, '..', 'assets', 'images', 'adaptive-icon.png'),
      path.join(__dirname, '..', 'assets', 'images', 'splash-icon.png'),
      path.join(__dirname, '..', 'assets', 'images', 'favicon.png')
    ];

    targetIcons.forEach(targetPath => {
      fs.copyFileSync(iconPath, targetPath);
      console.log(`✅ ${path.basename(targetPath)} créé`);
    });

    console.log('\n🎉 Toutes les icônes ont été générées avec succès !');
    console.log('\nPour appliquer les changements:');
    console.log('1. Créez un nouveau build avec: eas build --platform ios');
    console.log('2. Ou testez localement avec: expo start');

  } catch (error) {
    console.error('❌ Erreur lors de la génération de l\'icône:', error.message);
    process.exit(1);
  }
}

generateAppIcon();