import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('frontend/public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// SVG template for luxury BBS By Salma logo
function createSvg(size, isMaskable = false) {
  const pad = isMaskable ? size * 0.15 : size * 0.06;
  const radius = isMaskable ? 0 : size * 0.22;
  const fontSize = Math.round(size * 0.44);
  const subFontSize = Math.round(size * 0.08);

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#261A10" />
      <stop offset="100%" stop-color="#120B06" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5D89A" />
      <stop offset="50%" stop-color="#E2C078" />
      <stop offset="100%" stop-color="#B88A44" />
    </linearGradient>
    <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.015}" stdDeviation="${size * 0.02}" flood-color="#000" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Background -->
  ${isMaskable
    ? `<rect width="${size}" height="${size}" fill="url(#bgGrad)" />`
    : `<rect x="${pad}" y="${pad}" width="${size - pad * 2}" height="${size - pad * 2}" rx="${radius}" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="${Math.max(2, size * 0.02)}" stroke-opacity="0.3" filter="url(#goldShadow)" />`
  }

  <!-- Emblem Monogram B -->
  <text 
    x="50%" 
    y="${size * 0.52}" 
    text-anchor="middle" 
    dominant-baseline="central" 
    font-family="'Playfair Display', 'Cormorant Garamond', Georgia, serif" 
    font-size="${fontSize}" 
    font-weight="700" 
    fill="url(#goldGrad)"
    letter-spacing="-1"
  >B</text>

  <!-- Subtitle BBS BY SALMA -->
  <text 
    x="50%" 
    y="${size * 0.76}" 
    text-anchor="middle" 
    font-family="'Plus Jakarta Sans', system-ui, sans-serif" 
    font-size="${subFontSize}" 
    font-weight="700" 
    fill="#EAD5B2" 
    letter-spacing="${Math.round(size * 0.012)}" 
    opacity="0.9"
  >BBS BY SALMA</text>
</svg>
`;
}

async function generate() {
  console.log('Generating PWA icons for BBS By Salma...');

  // 1. Favicon SVG
  const svgContent = createSvg(512);
  fs.writeFileSync(path.join(outDir, 'favicon.svg'), svgContent, 'utf8');
  console.log('✓ Created favicon.svg');

  // 2. Apple Touch Icon (180x180)
  const svg180 = Buffer.from(createSvg(180));
  await sharp(svg180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));
  console.log('✓ Created apple-touch-icon.png (180x180)');

  // 3. PWA Icon 192x192
  const svg192 = Buffer.from(createSvg(192));
  await sharp(svg192).png().toFile(path.join(outDir, 'pwa-192x192.png'));
  console.log('✓ Created pwa-192x192.png (192x192)');

  // 4. PWA Icon 512x512
  const svg512 = Buffer.from(createSvg(512));
  await sharp(svg512).png().toFile(path.join(outDir, 'pwa-512x512.png'));
  console.log('✓ Created pwa-512x512.png (512x512)');

  // 5. Maskable Icon 512x512
  const svgMaskable = Buffer.from(createSvg(512, true));
  await sharp(svgMaskable).png().toFile(path.join(outDir, 'pwa-maskable-512x512.png'));
  console.log('✓ Created pwa-maskable-512x512.png (512x512 maskable)');

  console.log('All luxury PWA icons generated successfully!');
}

generate().catch(err => {
  console.error('Failed to generate PWA icons:', err);
  process.exit(1);
});
