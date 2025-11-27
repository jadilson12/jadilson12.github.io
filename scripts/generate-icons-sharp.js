#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');
const svgPath = path.join(iconsDir, 'icon.svg');

console.log('🎨 Gerando ícones PNG a partir do SVG usando Sharp...\n');

async function generateIcons() {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      console.log(`📐 Gerando ${size}x${size}...`);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
          quality: 100,
          compressionLevel: 9
        })
        .toFile(outputPath);
    }
    
    // Gera também os ícones maskable
    const maskableSizes = [192, 512];
    for (const size of maskableSizes) {
      const outputPath = path.join(iconsDir, `icon-maskable-${size}x${size}.png`);
      console.log(`📐 Gerando maskable ${size}x${size}...`);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
          quality: 100,
          compressionLevel: 9
        })
        .toFile(outputPath);
    }
    
    console.log('\n✅ Todos os ícones foram gerados com sucesso!');
    console.log('📁 Localização: public/icons/');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error.message);
    process.exit(1);
  }
}

generateIcons();
