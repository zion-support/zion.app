#!/bin/bash
# Zion Tech Group — Email Intelligence Runner
# Processes emails, generates drafts, outputs JSON for review
# Run via cron: */15 * * * * bash scripts/email-check.sh

cd "$(dirname "$0")/.."
OUTPUT_DIR="$HOME/.hermes/email-drafts"
mkdir -p "$OUTPUT_DIR"

# Run email intelligence analysis
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Try himalaya first, fallback to demo mode
if command -v himalaya &> /dev/null; then
    echo '{"source":"himalaya","timestamp":"'$TIMESTAMP'"}' > "$EMAIL_META"
    python3 scripts/email-intelligence.py --inbox 20 > "$OUTPUT_DIR/inbox-$TIMESTAMP.json" 2>&1
    STATUS="live"
else
    # Demo mode - generates sample analysis for testing
    python3 scripts/email-intelligence.py --demo > "$OUTPUT_DIR/demo-$TIMESTAMP.json" 2>&1
    STATUS="demo"
fi

# Keep only last 50 analysis files
ls -t "$OUTPUT_DIR"/*.json 2>/dev/null | tail -n +51 | xargs rm -f 2>/dev/null

echo "{\"status\":\"$STATUS\",\"timestamp\":\"$TIMESTAMP\",\"output\":\"$OUTPUT_DIR\"}"
