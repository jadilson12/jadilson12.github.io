#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');
const svgPath = path.join(iconsDir, 'icon.svg');

console.log('🎨 Gerando ícones PNG a partir do SVG...\n');

// Primeiro, vamos converter o SVG para PNG de 512x512 usando rsvg-convert ou inkscape se disponível
// Se não, usaremos uma abordagem diferente

try {
  // Tenta usar rsvg-convert (pode não estar instalado)
  execSync('which rsvg-convert', { stdio: 'ignore' });
  
  sizes.forEach(size => {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    console.log(`📐 Gerando ${size}x${size}...`);
    
    execSync(
      `rsvg-convert -w ${size} -h ${size} "${svgPath}" -o "${outputPath}"`,
      { stdio: 'inherit' }
    );
  });
  
  // Gera também os ícones maskable
  const maskableSizes = [192, 512];
  maskableSizes.forEach(size => {
    const outputPath = path.join(iconsDir, `icon-maskable-${size}x${size}.png`);
    console.log(`📐 Gerando maskable ${size}x${size}...`);
    
    execSync(
      `rsvg-convert -w ${size} -h ${size} "${svgPath}" -o "${outputPath}"`,
      { stdio: 'inherit' }
    );
  });
  
  console.log('\n✅ Todos os ícones foramgerados com sucesso!');
} catch {
  console.log('⚠️  rsvg-convert não encontrado.');
  console.log('📝 Você pode instalar com: brew install librsvg');
  console.log('\n💡 Alternativamente, use o arquivo SVG diretamente ou converta manualmente.');
  process.exit(1);
}
