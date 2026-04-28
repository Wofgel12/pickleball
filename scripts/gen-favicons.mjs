import sharp from 'sharp';

const SRC = 'public/favicon.png';
const sizes = [
  { name: 'favicon-16x16.png',          size: 16,  bg: null },
  { name: 'favicon-32x32.png',          size: 32,  bg: null },
  { name: 'favicon-48x48.png',          size: 48,  bg: null },
  { name: 'apple-touch-icon.png',       size: 180, bg: { r: 255, g: 255, b: 255, alpha: 1 } },
  { name: 'android-chrome-192x192.png', size: 192, bg: null },
  { name: 'android-chrome-512x512.png', size: 512, bg: null },
];

for (const { name, size, bg } of sizes) {
  let pipe = sharp(SRC).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  if (bg) pipe = pipe.flatten({ background: bg });
  await pipe.png({ compressionLevel: 9 }).toFile(`public/${name}`);
  console.log(`OK ${name} (${size}x${size}${bg ? ', white bg' : ', transparent'})`);
}
