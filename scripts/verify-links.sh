#!/bin/bash
# verify-links.sh — Crawl all internal links and report broken ones
# Usage: bash scripts/verify-links.sh

echo "🔍 Zion Tech Group — Link Verification"
echo "======================================"
echo ""

SITEMAP="out/sitemap.xml"
BASE="https://ziontechgroup.com"

if [ ! -f "$SITEMAP" ]; then
  echo "❌ Sitemap not found. Run 'npm run build' first."
  exit 1
fi

# Extract all URLs from sitemap
URLS=$(grep -oP '(?<=<loc>).*?(?=</loc>)' "$SITEMAP")
TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
OK=0
FAIL=0
FAILED_URLS=""

echo "Testing $TOTAL URLs from sitemap..."
echo ""

for url in $URLS; do
  # Skip external URLs
  if [[ ! "$url" == "$BASE"* ]]; then
    continue
  fi
  
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null)
  
  if [ "$STATUS" = "200" ]; then
    OK=$((OK + 1))
  else
    FAIL=$((FAIL + 1))
    FAILED_URLS="$FAILED_URLS\n  $url → HTTP $STATUS"
  fi
  
  # Progress indicator
  if [ $(( (OK + FAIL) % 50 )) -eq 0 ]; then
    echo "  Progress: $((OK + FAIL))/$TOTAL (OK: $OK, Fail: $FAIL)"
  fi
done

echo ""
echo "======================================"
echo "✅ OK: $OK"
echo "❌ Broken: $FAIL"
echo "📊 Total: $TOTAL"
echo ""

if [ $FAIL -gt 0 ]; then
  echo "Broken links:"
  echo -e "$FAILED_URLS"
  exit 1
else
  echo "🎉 All links working!"
  exit 0
fi
