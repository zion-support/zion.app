#!/usr/bin/env bash
# scripts/incident-response-orchestrator.sh - Autonomous incident response orchestrator
# Monitors for alerts and automatically runs diagnostics, collects logs, and suggests fixes.
# Uses only free tools: bash, curl, jq, systemctl, journalctl

set -euo pipefail

ALERT_LOG="${ALERT_LOG:-$HOME/.hermes/memory/alerts.log}"
DIAGNOSTIC_LOG="${DIAGNOSTIC_LOG:-$HOME/.hermes/memory/incident-response.log}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-8435383377}"
STATE_DIR="${STATE_DIR:-$HOME/.hermes/state}"

mkdir -p "$(dirname "$ALERT_LOG")" "$(dirname "$DIAGNOSTIC_LOG")" "$STATE_DIR"

log() { echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $1" | tee -a "$DIAGNOSTIC_LOG"; }

# Check for new alerts since last run
LAST_ALERT_FILE="$STATE_DIR/last-alert-timestamp"
CURRENT_TIMESTAMP=$(date +%s)
LAST_ALERT_TIMESTAMP=$(cat "$LAST_ALERT_FILE" 2>/dev/null || echo 0)

# Find new alerts in the log (lines added after last timestamp)
NEW_ALERTS=$(grep -E "🚨|⚠️|❌" "$ALERT_LOG" | while read -r line; do
  alert_timestamp=$(echo "$line" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z' || echo "")
  if [[ -n "$alert_timestamp" ]]; then
    alert_epoch=$(date -d "$alert_timestamp" +%s 2>/dev/null || echo 0)
    if (( alert_epoch > LAST_ALERT_TIMESTAMP )); then
      echo "$line"
    fi
  fi
done)

if [[ -n "$NEW_ALERTS" ]]; then
  log "New alerts detected: $NEW_ALERTS"
  
  # Run diagnostics for each new alert
  while IFS= read -r alert; do
    alert_type=$(echo "$alert" | grep -oE '🚨|⚠️|❌' || echo "unknown")
    case "$alert_type" in
      "🚨")
        # Error pattern detected
        log "Running diagnostics for error pattern alert..."
        # Check system logs
        SYSTEM_LOGS=$(journalctl -u zion-app --since "1 hour ago" --no-pager 2>/dev/null || echo "No system logs available")
        # Check application logs
        APP_LOGS=$(grep -i "error\|exception" "$HOME/.hermes/memory/zion-app.log" 2>/dev/null || echo "No app logs available")
        # Check dependencies
        DEPENDENCY_STATUS=$(npm list --depth=1 2>/dev/null | grep -E "(UNMET|ERR)" || echo "Dependencies OK")
        ;;
      "⚠️")
        # Anomaly detected
        log "Running diagnostics for anomaly alert..."
        # Check resource usage
        CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "N/A")
        MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2*100.0}' 2>/dev/null || echo "N/A")
        # Check network connectivity
        NETWORK_OK=$(curl -s --max-time 5 https://api.github.com -o /dev/null && echo "OK" || echo "FAIL")
        ;;
      "❌")
        # Deployment failure
        log "Running diagnostics for deployment failure..."
        # Check deployment logs
        DEPLOYMENT_LOGS=$(grep -i "error\|fail" "$HOME/.hermes/memory/deployment.log" 2>/dev/null || echo "No deployment logs")
        # Check if service is running
        SERVICE_STATUS=$(systemctl is-active zion-app 2>/dev/null || echo "N/A")
        ;;
      *)
        log "Unknown alert type: $alert_type"
        ;;
    esac
    
    # Collect diagnostic information
    DIAGNOSTIC_INFO="--- Incident Report ---\nTimestamp: $(date -u +"%Y-%m-%d %H:%M:%SZ")\nAlert: $alert\n"
    DIAGNOSTIC_INFO+="System Logs: $(echo "$SYSTEM_LOGS" | wc -l) lines\n"
    DIAGNOSTIC_INFO+="App Logs: $(echo "$APP_LOGS" | wc -l) lines\n"
    DIAGNOSTIC_INFO+="Dependency Status: $DEPENDENCY_STATUS\n"
    DIAGNOSTIC_INFO+="CPU Usage: $CPU_USAGE%\n"
    DIAGNOSTIC_INFO+="Memory Usage: $MEMORY_USAGE%\n"
    DIAGNOSTIC_INFO+="Network: $NETWORK_OK\n"
    DIAGNOSTIC_INFO+="Service Status: $SERVICE_STATUS\n"
    
    # Suggest actions
    SUGGESTIONS="--- Suggested Actions ---\n"
    if [[ "$SERVICE_STATUS" != "active" ]]; then
      SUGGESTIONS+="• Restart service: sudo systemctl restart zion-app\n"
    fi
    if [[ "$DEPENDENCY_STATUS" =~ (UNMET|ERR) ]]; then
      SUGGESTIONS+="• Run npm install\n"
    fi
    if (( $(echo "$CPU_USAGE > 80" | bc -l 2>/dev/null) )); then
      SUGGESTIONS+="• Scale up resources\n"
    fi
    if (( $(echo "$MEMORY_USAGE > 80" | bc -l 2>/dev/null) )); then
      SUGGESTIONS+="• Clear cache or increase memory\n"
    fi
    
    FULL_REPORT="$DIAGNOSTIC_INFO\n$SUGGESTIONS"
    
    # Send Telegram alert with report
    if [[ -n "$TELEGRAM_BOT_TOKEN" ]]; then
      curl -sf -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=$FULL_REPORT" \
        -d "parse_mode=Markdown" \
        --max-time 10 || true
    fi
    
    # Update last alert timestamp
    echo "$CURRENT_TIMESTAMP" > "$LAST_ALERT_FILE"
    
  done <<< "$NEW_ALERTS"
else
  log "No new alerts detected"
fi

echo "✅ Incident response orchestrator cycle complete"