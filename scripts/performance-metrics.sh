#!/usr/bin/env bash
# scripts/performance-metrics.sh – Collects CPU, memory, and basic app metrics
# Outputs JSON to metrics/performance.json for Prometheus exporter

set -euo pipefail

METRICS_DIR="${METRICS_DIR:-$HOME/.hermes/metrics}"
OUTPUT_FILE="$METRICS_DIR/performance.json"
LOG_DIR="${LOG_DIR:-$HOME/.hermes/memory}"

mkdir -p "$METRICS_DIR"

# Collect system metrics
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "0")
MEM_USED=$(free -m | awk '/Mem:/ {print $3}' 2>/dev/null || echo "0")
MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}' 2>/dev/null || echo "1")
MEM_PCT=$(( MEM_USED * 100 / MEM_TOTAL ))

# Count recent errors in the last 5 minutes
ERROR_COUNT=0
if [[ -d "$LOG_DIR" ]]; then
  ERROR_COUNT=$(find "$LOG_DIR" -name "*.log" -mmin -5 -exec grep -ciE "error|exception" {} \; 2>/dev/null | awk '{s+=$1} END {print s+0}')
fi

# Timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Write JSON
cat > "$OUTPUT_FILE" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "cpu_percent": $CPU_USAGE,
  "memory_used_mb": $MEM_USED,
  "memory_percent": $MEM_PCT,
  "recent_errors": $ERROR_COUNT
}
EOF

echo "✅ Metrics collected at $TIMESTAMP"