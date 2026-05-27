#!/bin/bash
# check-broken-links.sh — Crawl all internal links and check HTTP status codes
# Usage: ./scripts/check-broken-links.sh [--external]
#   Without args: checks all internal links from sitemap.xml
#   --external: also checks external links found in .tsx files

set -euo pipefail
cd "$(dirname "$0")/.."

REPORT_DIR="automation/data"
mkdir -p "$REPORT_DIR"
REPORT="$REPORT_DIR/broken-links-report.json"
TIMESTAMP=$(date -Iseconds)

echo "{\"timestamp\":\"$TIMESTAMP\",\"broken_links\":[]," > "$REPORT

BROKEN=0
TOTAL=0

# Check links from sitemap.xml
if [ -f "public/sitemap.xml" ]; then
  echo "  Checking sitemap URLs..."
  while IFS= read -r url; do
    HTTP_CODE=$(curl -sL -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
    TOTAL=$((TOTAL + 1))
    if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "301" ] && [ "$HTTP_CODE" != "302" ]; then
      BROKEN=$((BROKEN + 1))
    fi
  done < <(grep -oP '(?<=<loc>)[^<]+' public/sitemap.xml 2>/dev/null || true)
fi

# Check external links if --external flag
if [ "${1:-}" = "--external" ]; then
  echo "  Checking external links..."
  grep -roPh 'https?://[a-zA-Z0-9./?=_%:-]+' app/ --include='*.tsx' --include='*.ts' 2>/dev/null \
    | grep -v 'ziontechgroup.com' | sort -u | while IFS= read -r url; do
    HTTP_CODE=$(curl -sL -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
    TOTAL=$((TOTAL + 1))
    if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "301" ] && [ "$HTTP_CODE" != "302" ]; then
      BROKEN=$((BROKEN + 1))
    fi
  done
fi

echo "\"total_checked\":$TOTAL,\"broken_count\":$BROKEN}" >> "$REPORT"
echo "Done: $TOTAL URLs checked, $BROKEN broken"
exit $BROKEN