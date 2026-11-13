import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = path.join(root, "public", "images", "iron-temple");

const files = fs.readdirSync(imagesDir);

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if ([".png", ".jpg", ".jpeg"].includes(ext)) {
    const baseName = path.basename(file, ext);
    // If the filename has spaces like "image copy.png", let's make a clean "image copy.webp" AND "image-copy.webp"
    const srcPath = path.join(imagesDir, file);
    const destPath = path.join(imagesDir, `${baseName}.webp`);

    console.log(`Converting ${file} -> ${baseName}.webp ...`);

    try {
      const isTransparent = file.includes("logo") || file.includes("transparent");
      if (isTransparent) {
        await sharp(srcPath)
          .webp({ quality: 92, alphaQuality: 100, effort: 6 })
          .toFile(destPath);
      } else {
        await sharp(srcPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(destPath);
      }

      const oldSize = (fs.statSync(srcPath).size / 1024).toFixed(1);
      const newSize = (fs.statSync(destPath).size / 1024).toFixed(1);
      console.log(`✓ ${file} (${oldSize} KB) -> ${baseName}.webp (${newSize} KB)`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
}

