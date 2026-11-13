import fs from "fs";
import path from "path";

const root = process.cwd();
for (const dir of [".next", "out"]) {
  const p = path.join(root, dir);
  if (fs.existsSync(p)) {
    try {
      fs.rmSync(p, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
      console.log(`Cleaned ${dir}`);
    } catch (e) {
      console.warn(`Warning cleaning ${dir}:`, e.message);
    }
  }
}

