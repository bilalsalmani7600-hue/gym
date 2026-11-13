import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");

console.log("Preparing Netlify distribution in dist/ ...");

if (!fs.existsSync(outDir)) {
  console.error("Error: 'out' directory not found. Run next build first.");
  process.exit(1);
}

// Remove old dist directory if present
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// Copy out/ to dist/
fs.cpSync(outDir, distDir, { recursive: true });

// Add Netlify SPA / clean routing redirects
fs.writeFileSync(
  path.join(distDir, "_redirects"),
  `# Netlify redirects for single page app and direct routing
/*    /index.html   200
`,
  "utf8"
);

// Add netlify.toml inside dist for zero-config drop
fs.writeFileSync(
  path.join(distDir, "netlify.toml"),
  `[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`,
  "utf8"
);

console.log("✓ dist/ successfully generated and ready for Netlify deployment!");

