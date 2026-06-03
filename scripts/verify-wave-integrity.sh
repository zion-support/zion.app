#!/bin/bash
# verify-wave-integrity.sh — Verify all wave imports match wave file exports
# Usage: bash scripts/verify-wave-integrity.sh

echo "🔍 Wave Integrity Check"
echo "======================="
echo ""

ERRORS=0

# Get all wave files
for wavefile in app/data/wave*.ts; do
  basename=$(basename "$wavefile" .ts)
  
  # Get exports from wave file
  exports=$(grep "^export const" "$wavefile" | sed 's/export const \([a-zA-Z0-9_]*\).*/\1/' | sort)
  
  # Get imports in servicesData.ts for this wave
  imports=$(grep "from './$basename'" app/data/servicesData.ts | grep -oP '\{[^}]+\}' | tr ',' '\n' | sed 's/[{}]//g; s/ //g' | sort)
  
  if [ -z "$imports" ]; then
    echo "⚠️  $basename: No imports found in servicesData.ts"
    echo "   Exports: $(echo $exports | tr '\n' ' ')"
    ERRORS=$((ERRORS + 1))
    continue
  fi
  
  # Compare
  missing=""
  for exp in $exports; do
    found=0
    for imp in $imports; do
      if [ "$exp" = "$imp" ]; then
        found=1
        break
      fi
    done
    if [ $found -eq 0 ]; then
      missing="$missing $exp"
    fi
  done
  
  if [ -n "$missing" ]; then
    echo "❌ $basename: Missing imports:$missing"
    ERRORS=$((ERRORS + 1))
  else
    count=$(echo "$exports" | wc -l | tr -d ' ')
    echo "✅ $basename: $count exports, all imported"
  fi
done

echo ""
echo "======================="
if [ $ERRORS -gt 0 ]; then
  echo "❌ $ERRORS wave(s) have missing imports"
  exit 1
else
  echo "✅ All wave imports verified"
  exit 0
fi
