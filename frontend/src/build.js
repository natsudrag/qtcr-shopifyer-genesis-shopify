const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const requiredFiles = ["index.html", "styles/main.css", "src/app.js"];
const assetsSource = path.join(root, "assets");
const assetsTarget = path.join(dist, "assets");

for (const file of requiredFiles) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing frontend asset: ${file}`);
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, "styles"), { recursive: true });
fs.mkdirSync(path.join(dist, "src"), { recursive: true });

for (const file of requiredFiles) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

if (fs.existsSync(assetsSource)) {
  fs.cpSync(assetsSource, assetsTarget, { recursive: true });
}

console.log(`Frontend build copied ${requiredFiles.length} files and local assets to frontend/dist`);
