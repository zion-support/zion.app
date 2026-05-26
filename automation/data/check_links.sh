#!/bin/bash
# External Link Checker - checks all external URLs found in .tsx files
# Outputs JSON results

OUTPUT_FILE="/data/data/com.termux/files/home/zion-support.github.io/automation/data/external-links-audit.json"

# Array of unique external URLs found (excluding own site and schema.org)
URLS=(
  "https://www.linkedin.com/company/ziontechgroup"
  "https://twitter.com/ziontechgroup"
  "https://github.com/ziontechgroup"
  "https://maps.google.com/?q=364+E+Main+St+STE+1008+Middletown+DE+19709"
  "https://formspree.io/f/xrbpgwdd"
  "https://www.linkedin.com/in/kleberalcatrao"
  "https://aws.amazon.com/partners/"
  "https://www.microsoft.com/partner/"
  "https://cloud.google.com/partners/"
  "https://www.nvidia.com/en-us/partners/"
  "https://openai.com/partners/"
  "https://www.hashicorp.com/partner"
  "https://www.ssllabs.com/ssltest/"
  "https://api.ssllabs.com/api/v3/analyze"
  "https://api.portchecker.net/check"
  "https://ziontechgroup.com"
  "https://ziontechgroup.com/logo.png"
  "https://ziontechgroup.com/og-home.svg"
  "https://ziontechgroup.com/search"
  "https://schema.org"
)

echo "[" > "$OUTPUT_FILE"
FIRST=true

for URL in "${URLS[@]}"; do
  # Determine category
  CATEGORY="external_resource"
  if [[ "$URL" == *"linkedin.com"* ]]; then CATEGORY="social_link"
  elif [[ "$URL" == *"twitter.com"* ]]; then CATEGORY="social_link"
  elif [[ "$URL" == *"github.com"* ]]; then CATEGORY="social_link"
  elif [[ "$URL" == *"maps.google"* ]]; then CATEGORY="external_resource"
  elif [[ "$URL" == *"formspree"* ]]; then CATEGORY="integration"
  elif [[ "$URL" == *"partner"* ]]; then CATEGORY="partner_link"
  elif [[ "$URL" == *"ssllabs"* ]]; then CATEGORY="integration"
  elif [[ "$URL" == *"portchecker"* ]]; then CATEGORY="integration"
  elif [[ "$URL" == *"ziontechgroup.com"* ]]; then CATEGORY="own_site"
  elif [[ "$URL" == *"schema.org"* ]]; then CATEGORY="structured_data"
  fi

  # Do HEAD request first, fallback to GET if needed
  START_TIME=$(date +%s%N)
  RESPONSE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 -L -I "$URL" 2>&1)
  END_TIME=$(date +%s%N)
  DURATION_MS=$(( (END_TIME - START_TIME) / 1000000 ))

  # If HEAD returns 405 or error, try GET
  STATUS="$RESPONSE"
  if [[ "$RESPONSE" == "405" ]] || [[ "$RESPONSE" == "000" ]] || [[ "$RESPONSE" == "" ]]; then
    START_TIME=$(date +%s%N)
    RESPONSE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 -L "$URL" 2>&1)
    END_TIME=$(date +%s%N)
    DURATION_MS=$(( (END_TIME - START_TIME) / 1000000 ))
    STATUS="$RESPONSE"
  fi

  # Determine status
  if [[ "$STATUS" == "000" ]] || [[ "$STATUS" == "" ]]; then
    STATUS_LABEL="timeout_or_error"
  elif [[ "$STATUS" -ge 200 && "$STATUS" -lt 300 ]]; then
    STATUS_LABEL="ok"
  elif [[ "$STATUS" -ge 300 && "$STATUS" -lt 400 ]]; then
    STATUS_LABEL="redirect"
  elif [[ "$STATUS" -ge 400 && "$STATUS" -lt 500 ]]; then
    STATUS_LABEL="broken_4xx"
  elif [[ "$STATUS" -ge 500 ]]; then
    STATUS_LABEL="broken_5xx"
  else
    STATUS_LABEL="unknown"
  fi

  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    echo "," >> "$OUTPUT_FILE"
  fi

  cat >> "$OUTPUT_FILE" << EOF
  {
    "url": "$URL",
    "category": "$CATEGORY",
    "http_status": "$STATUS",
    "status_label": "$STATUS_LABEL",
    "response_time_ms": $DURATION_MS,
    "checked_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }
EOF

done

echo "]" >> "$OUTPUT_FILE"

echo "Done. Results written to $OUTPUT_FILE"