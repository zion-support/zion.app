#!/bin/bash
# Email Responder Cron - runs every 5 minutes
# Processes emails, classifies them, generates AI-powered responses, sends Reply-All

LOG_FILE="/Users/miami2/zion.app/automation/logs/email-responder-cron.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cd /Users/miami2/zion.app || exit 1

log "=== Email Responder Cron Starting ==="

# Run the email responder
node automation/email-responder.cjs 2>&1 | tee -a "$LOG_FILE"

log "=== Email Responder Cron Complete ==="