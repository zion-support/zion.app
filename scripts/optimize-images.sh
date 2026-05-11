#!/usr/bin/env bash
# scripts/optimize-images.sh
# Compress PNG and JPEG images in the public/ directory to reduce bundle size.
# Uses pngquant for PNGs and jpegoptim for JPEGs.
# Safe: overwrites files only if compression yields smaller size.

set -euo pipefail

PUBLIC_DIR="${1:-public}"

echo "🔍 Scanning for images in $PUBLIC_DIR..."

# PNG compression with pngquant
if command -v pngquant &> /dev/null; then
  echo "📦 Compressing PNGs with pngquant..."
  find "$PUBLIC_DIR" -type f -iname "*.png" -print0 | while IFS= read -r -d '' file; do
    tmp=$(mktemp --suffix=.png)
    if pngquant --quality=65-80 --speed=1 --output "$tmp" "$file" 2>/dev/null; then
      if [ "$(stat -c%s "$tmp")" -lt "$(stat -c%s "$file")" ]; then
        mv "$tmp" "$file"
        echo "  ✅ Compressed: $file"
      else
        rm "$tmp"
        echo "  ⏭️  Already optimized: $file"
      fi
    fi
  done
else
  echo "⚠️  pngquant not installed – skipping PNG compression"
fi

# JPEG compression with jpegoptim
if command -v jpegoptim &> /dev/null; then
  echo "📦 Compressing JPEGs with jpegoptim..."
  find "$PUBLIC_DIR" -type f -iname "*.jpg" -o -iname "*.jpeg" -print0 | while IFS= read -r -d '' file; do
    # --strip-all removes metadata; -m80 sets max quality 80
    if jpegoptim --strip-all -m80 "$file" 2>/dev/null; then
      echo "  ✅ Optimized: $file"
    fi
  done
else
  echo "⚠️  jpegoptim not installed – skipping JPEG compression"
fi

echo "✨ Image optimization complete!"
