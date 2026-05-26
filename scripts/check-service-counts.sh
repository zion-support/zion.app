#!/bin/bash
# check-service-counts.sh — Verifies service counts match expected values
# Reports discrepancies between data sources and displayed counts

set -euo pipefail
cd "$(dirname "$0")/.."

REPORT_DIR="automation/data"
mkdir -p "$REPORT_DIR"
REPORT="$REPORT_DIR/service-counts-report.json"

echo "{" > "$REPORT"

# Count services in searchServices.ts
SEARCH_COUNT=$(grep -c '"id":' app/data/searchServices.ts 2>/dev/null || echo 0)
echo "\"searchServices_count\": $SEARCH_COUNT," >> "$REPORT"

# Count services in servicesData.ts
DATA_COUNT=$(grep -c "'id':" app/data/servicesData.ts 2>/dev/null || echo 0)
echo "\"servicesData_count\": $DATA_COUNT," >> "$REPORT"

# Category breakdown from searchServices
echo "\"categories\": {" >> "$REPORT"
for cat in ai it cloud security data automation; do
  COUNT=$(grep -c "\"category\": \"$cat\"" app/data/searchServices.ts 2>/dev/null || echo 0)
  echo "\"$cat\": $COUNT," >> "$REPORT"
done
echo "\"_note\": \"from searchServices.ts\"" >> "$REPORT"
echo "}," >> "$REPORT"

# Status breakdown
echo "\"stages\": {" >> "$REPORT"
for stage in published beta planned; do
  COUNT=$(grep -c "\"stage\": \"$stage\"" app/data/searchServices.ts 2>/dev/null || echo 0)
  echo "\"$stage\": $COUNT," >> "$REPORT"
done
echo "\"_note\": \"from searchServices.ts\"" >> "$REPORT"
echo "}," >> "$REPORT"

# Expected counts from the audit
echo "\"expected_total\": 599," >> "$REPORT"
echo "\"discrepancy\": $(( SEARCH_COUNT - 599 ))," >> "$REPORT"
echo "\"status\": \"$( [ "$SEARCH_COUNT" -eq 599 ] && echo 'OK' || echo 'MISMATCH' )\"" >> "$REPORT"
echo "}" >> "$REPORT"

echo "Service counts verified: searchServices=$SEARCH_COUNT, servicesData=$DATA_COUNT"