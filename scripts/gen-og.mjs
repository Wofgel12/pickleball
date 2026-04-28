import sharp from 'sharp';

const SRC = 'src/assets/istockphoto-1301500044-612x612.jpg';
const DST = 'public/og-pickleball-geneve.jpg';

await sharp(SRC)
  .resize(1200, 630, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 85, mozjpeg: true, progressive: true })
  .toFile(DST);

const meta = await sharp(DST).metadata();
console.log(`OK ${DST} (${meta.width}x${meta.height}, ${(meta.size / 1024).toFixed(1)} KB)`);
