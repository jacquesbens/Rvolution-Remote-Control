#!/bin/bash

# Script pour copier l'icône principale vers tous les emplacements nécessaires

# Copier icon.png vers adaptive-icon.png
cp assets/images/icon.png assets/images/adaptive-icon.png

# Copier icon.png vers splash-icon.png
cp assets/images/icon.png assets/images/splash-icon.png

# Copier icon.png vers favicon.png
cp assets/images/icon.png assets/images/favicon.png

echo "✅ Toutes les icônes ont été copiées avec succès !"
echo "   - icon.png (icône principale)"
echo "   - adaptive-icon.png (icône Android adaptative)"
echo "   - splash-icon.png (icône de l'écran de démarrage)"
echo "   - favicon.png (favicon web)"