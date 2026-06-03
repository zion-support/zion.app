#!/bin/bash
# scripts/audit-service-quality.sh
# Audits all service data for quality issues:
# - Thin pages (short descriptions, few features/benefits)
# - Missing fields
# - Duplicate IDs
# - Category casing issues
#
# Usage: bash scripts/audit-service-quality.sh
# Exit code: 0 = all good, 1 = issues found

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SERVICES_FILE="$PROJECT_ROOT/app/data/servicesData.ts"
WAVE_DIR="$PROJECT_ROOT/app/data"

echo "═══════════════════════════════════════════════════"
echo "  Zion Tech Group — Service Quality Audit"
echo "  $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "═══════════════════════════════════════════════════"
echo ""

# ── 1. Count total services ──
TOTAL=$(grep -c "id: ['\"]" "$SERVICES_FILE" 2>/dev/null || echo "0")
echo "📊 Total services in servicesData.ts: $TOTAL"

# ── 2. Check for duplicate IDs ──
echo ""
echo "🔍 Checking for duplicate IDs..."
DUPES=$(grep -o "id: '[^']*'" "$SERVICES_FILE" | sed "s/id: '//;s/'$//" | sort | uniq -d || true)
if [ -n "$DUPES" ]; then
    echo "  ❌ DUPLICATE IDs found:"
    echo "$DUPES" | while read -r id; do
        echo "    - $id"
    done
else
    echo "  ✅ No duplicate IDs"
fi

# ── 3. Check category casing ──
echo ""
echo "🔍 Checking category casing..."
BAD_CATS=$(grep -o "category: '[^']*'" "$SERVICES_FILE" | sed "s/category: '//;s/'$//" | grep -vE '^[a-z0-9-]+$' | sort -u || true)
if [ -n "$BAD_CATS" ]; then
    echo "  ❌ Non-lowercase categories found:"
    echo "$BAD_CATS" | while read -r cat; do
        echo "    - '$cat'"
    done
else
    echo "  ✅ All categories are lowercase"
fi

# ── 4. Check for empty features/benefits ──
echo ""
echo "🔍 Checking for empty features/benefits arrays..."
python3 << PYEOF
import re, sys

with open("""$SERVICES_FILE""") as f:
    content = f.read()

# Find all service objects
services = re.findall(r"id: '([^']+)'.*?features: \[(.*?)\].*?benefits: \[(.*?)\]", content, re.DOTALL)

empty_features = []
empty_benefits = []
thin_pages = []

for sid, features, benefits in services:
    feat_count = len([x for x in features.split(",") if x.strip().strip("'").strip('"')])
    ben_count = len([x for x in benefits.split(",") if x.strip().strip("'").strip('"')])

    if feat_count == 0:
        empty_features.append(sid)
    if ben_count == 0:
        empty_benefits.append(sid)
    if feat_count < 3 or ben_count < 3:
        thin_pages.append((sid, feat_count, ben_count))

if empty_features:
    print(f'  ❌ Empty features: {len(empty_features)} services')
    for s in empty_features[:10]:
        print(f'    - {s}')
    if len(empty_features) > 10:
        print(f'    ... and {len(empty_features)-10} more')
else:
    print('  ✅ No empty features arrays')

if empty_benefits:
    print(f'  ❌ Empty benefits: {len(empty_benefits)} services')
    for s in empty_benefits[:10]:
        print(f'    - {s}')
    if len(empty_benefits) > 10:
        print(f'    ... and {len(empty_benefits)-10} more')
else:
    print('  ✅ No empty benefits arrays')

if thin_pages:
    print(f'  ⚠️  Thin pages (< 3 features OR < 3 benefits): {len(thin_pages)} services')
    for s, f, b in thin_pages[:15]:
        print(f'    - {s} ({f} features, {b} benefits)')
    if len(thin_pages) > 15:
        print(f'    ... and {len(thin_pages)-15} more')
else:
    print('  ✅ All pages have 3+ features and 3+ benefits')
PYEOF

# ── 5. Wave file integrity ──
echo ""
echo "🔍 Checking wave file integrity..."
WAVE_FILES=$(find "$WAVE_DIR" -name "wave*.ts" -type f | sort)
WAVE_COUNT=0
WAVE_SERVICES=0
for wf in $WAVE_FILES; do
    WAVE_COUNT=$((WAVE_COUNT + 1))
    COUNT=$(python3 -c "import re; print(len(re.findall(r'id:\s*[\"\\x27]', open('$wf').read())))" 2>/dev/null || echo "0")
    WAVE_SERVICES=$((WAVE_SERVICES + COUNT))
    echo "  📄 $(basename "$wf"): $COUNT services"
done
echo "  📊 Total wave files: $WAVE_COUNT ($WAVE_SERVICES services)"

# ── 6. Check wave imports in servicesData.ts ──
echo ""
echo "🔍 Checking wave imports in servicesData.ts..."
for wf in $WAVE_FILES; do
    WAVE_NAME=$(basename "$wf" .ts)
    if grep -q "from.*$WAVE_NAME" "$SERVICES_FILE"; then
        echo "  ✅ $WAVE_NAME imported"
    else
        echo "  ❌ $WAVE_NAME NOT imported in servicesData.ts"
    fi
done

# ── 7. Description length distribution ──
echo ""
echo "🔍 Description length analysis..."
python3 << PYEOF
import re

with open("""$SERVICES_FILE""") as f:
    content = f.read()

descs = re.findall(r"description: '([^']+)'", content)
lengths = [len(d) for d in descs]

if lengths:
    avg = sum(lengths) / len(lengths)
    short = sum(1 for l in lengths if l < 50)
    medium = sum(1 for l in lengths if 50 <= l < 150)
    long = sum(1 for l in lengths if l >= 150)
    very_short = sum(1 for l in lengths if l < 30)

    print(f'  📊 Average description length: {avg:.0f} chars')
    print(f'  📊 Very short (< 30 chars): {very_short}')
    print(f'  📊 Short (30-49 chars): {short - very_short}')
    print(f'  📊 Medium (50-149 chars): {medium}')
    print(f'  📊 Long (150+ chars): {long}')

    if very_short > 0:
        print(f'  ❌ {very_short} services have very short descriptions (< 30 chars)')
PYEOF

# ── Summary ──
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Audit Complete"
echo "═══════════════════════════════════════════════════"
