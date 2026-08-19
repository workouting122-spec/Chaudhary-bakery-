// Zero-dependency "build": copies the static site into ./dist with
// index.html at the dist root. Deployment platforms that expect a
// build output directory can publish ./dist directly.
// Usage: npm run build
import { rm, mkdir, cp } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");

// Files/dirs that make up the deployable static site (root-level).
const ASSETS = ["index.html", "css", "js", "vendor"];

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  for (const asset of ASSETS) {
    await cp(join(ROOT, asset), join(DIST, asset), { recursive: true });
  }

  console.log("✓ Built static site → ./dist (index.html at dist root)");
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
