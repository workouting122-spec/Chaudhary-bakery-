#!/usr/bin/env bash
# Package the static site into a Hostinger-ready .zip with index.html
# at the ARCHIVE ROOT (no wrapper folder).
#   npm run pack   ->   iphone17-pro-max-deploy.zip
set -euo pipefail

# Resolve repo root (parent of this script's dir) and run from there so
# paths inside the archive are root-relative.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OUT="iphone17-pro-max-deploy.zip"
ASSETS=(index.html css js vendor)

rm -f "$OUT"
zip -r -q "$OUT" "${ASSETS[@]}" -x "*/.DS_Store"

echo "✓ Created $OUT"
echo "  index.html is at the archive root — upload directly to Hostinger."
unzip -l "$OUT" | head -8
