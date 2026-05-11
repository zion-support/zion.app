#!/bin/bash
# DNS Health Check Script
# Runs daily to check DNS resolution for ziontechgroup.com
# and reports status to automation/reports

DOMAIN="ziontechgroup.com"
REPORT_DIR="/Users/miami2/zion-app-clone/automation/reports"
REPORT_FILE="$REPORT_DIR/dns-health-check-latest.json"
HISTORY_FILE="$REPORT_DIR/dns-health-check-history.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Check DNS resolution
RESULT=$(dig +short "$DOMAIN" 2>/dev/null)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ] && [ -n "$RESULT" ]; then
    STATUS="resolved"
    RESOLUTION="$RESULT"
else
    STATUS="unresolved"
    RESOLUTION="null"
fi

# Create report
cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "domain": "$DOMAIN",
  "status": "$STATUS",
  "resolution": $([ "$RESOLUTION" = "null" ] && echo "null" || echo "\"$RESOLUTION\""),
  "exitCode": $EXIT_CODE
}
EOF

# Append to history (simple approach - could be improved)
if [ -f "$HISTORY_FILE" ]; then
    # Prepend new entry
    echo "{\"timestamp\":\"$TIMESTAMP\",\"domain\":\"$DOMAIN\",\"status\":\"$STATUS\"}," | cat - "$HISTORY_FILE" > temp && mv temp "$HISTORY_FILE"
else
    echo "[{\"timestamp\":\"$TIMESTAMP\",\"domain\":\"$DOMAIN\",\"status\":\"$STATUS\"}]" > "$HISTORY_FILE"
fi

echo "DNS health check completed: $STATUS"
exit $EXIT_CODE