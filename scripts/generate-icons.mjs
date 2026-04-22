import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/logo.svg");
const svg = readFileSync(svgPath);

const sizes = [
  { size: 16,   name: "favicon-16x16.png" },
  { size: 32,   name: "favicon-32x32.png" },
  { size: 180,  name: "apple-touch-icon.png" },
  { size: 192,  name: "icon-192.png" },
  { size: 512,  name: "icon-512.png" },
];

for (const { size, name } of sizes) {
  const outPath = resolve(__dirname, "../public", name);
  await sharp(svg).resize(size, size).png().toFile(outPath);
  console.log(`✓ ${name} (${size}x${size})`);
}

console.log("\n아이콘 생성 완료!");
