import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "public", "images", "martita");

async function run() {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg"));

  console.log(`Found ${files.length} images to optimize...`);

  // 1. First, let's inspect cafe-croissant-salgado.jpg dimensions to extract the exact top-down coffee crema
  const cafePath = path.join(dir, "cafe-croissant-salgado.jpg");
  if (fs.existsSync(cafePath)) {
    const meta = await sharp(cafePath).metadata();
    console.log("cafe-croissant-salgado dimensions:", meta.width, "x", meta.height);

    if (meta.width && meta.height) {
      // In Quintal_Rosa_alta-3757.jpg (cafe-croissant-salgado.jpg):
      // The top-down coffee cup rim is centered around x: 41.3%, y: 55.2% with radius ~9% of width
      // Let's extract the inner coffee crema square and resize to 800x800 for a high-res top-down coffee texture
      const cx = Math.round(meta.width * 0.413);
      const cy = Math.round(meta.height * 0.553);
      const radius = Math.round(meta.width * 0.068);

      const left = Math.max(0, cx - radius);
      const top = Math.max(0, cy - radius);
      const size = radius * 2;

      await sharp(cafePath)
        .extract({ left, top, width: size, height: size })
        .resize(700, 700, { fit: "cover" })
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(path.join(dir, "cafe-crema-topdown.jpg"));

      console.log("Extracted real top-down coffee crema -> cafe-crema-topdown.jpg");

      // Also extract the croissant plate on the right (centered around x: 78%, y: 65%)
      const px = Math.round(meta.width * 0.785);
      const py = Math.round(meta.height * 0.658);
      const pRadius = Math.round(meta.width * 0.195);
      const pLeft = Math.max(0, px - pRadius);
      const pTop = Math.max(0, py - pRadius);
      const pSize = Math.min(pRadius * 2, meta.width - pLeft, meta.height - pTop);

      await sharp(cafePath)
        .extract({ left: pLeft, top: pTop, width: pSize, height: pSize })
        .resize(700, 700, { fit: "cover" })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(path.join(dir, "croissant-prato-topdown.jpg"));

      console.log("Extracted top-down croissant plate -> croissant-prato-topdown.jpg");
    }
  }

  // 2. Optimize all images in public/images/martita so they are fast, lightweight (<200KB), and never lag/freeze
  for (const file of files) {
    if (file === "cafe-crema-topdown.jpg" || file === "croissant-prato-topdown.jpg") continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Only re-compress if > 350KB
    if (stat.size > 350 * 1024) {
      const tempPath = path.join(dir, `_tmp_${file}`);
      await sharp(filePath)
        .rotate() // preserve EXIF orientation
        .resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true, progressive: true })
        .toFile(tempPath);

      fs.renameSync(tempPath, filePath);
      const newStat = fs.statSync(filePath);
      console.log(
        `Optimized ${file}: ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${(
          newStat.size / 1024
        ).toFixed(0)}KB`
      );
    }
  }

  console.log("All images optimized successfully!");
}

run().catch(console.error);

