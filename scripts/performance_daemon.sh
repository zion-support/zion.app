#!/usr/bin/env bash
# Performance monitoring & auto-scaling daemon for Hermes Agent
# Run via cron: * * * * * /path/to/scripts/performance_daemon.sh >> ~/.hermes/memory/performance.log 2>&1

LOG="$HOME/.hermes/memory/performance.log"
MAX_CPU=80
MAX_MEM=80
SCALE_UP_THRESHOLD=5   # consecutive minutes of high load
SCALE_DOWN_THRESHOLD=10 # minutes of low load before scale down

# Helper to get CPU usage of node processes (hermes-agent)
get_cpu() {
  ps -eo pcpu,comm | grep -E "node|hermes" | awk '{sum+=$1} END {print sum+0}'
}

# Helper to get memory usage of node processes (percentage)
get_mem() {
  ps -eo pmem,comm | grep -E "node|hermes" | awk '{sum+=$1} END {print sum+0}'
}

# Count current hermes-agent instances
count_instances() {
  pm2 jlist | jq '[.[] | select(.name | startswith("hermes"))] | length' 2>/dev/null || echo 0
}

# Main loop
while true; do
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  CPU=$(get_cpu)
  MEM=$(get_mem)
  INSTANCES=$(count_instances)

  echo "$TIMESTAMP CPU=${CPU}% MEM=${MEM}% INSTANCES=$INSTANCES" >> "$LOG"

  # If high load for SCALE_UP_THRESHOLD minutes, add instance
  if (( $(echo "$CPU > $MAX_CPU || $MEM > $MAX_MEM" | bc -l) )); then
    CURRENT_HIGH_COUNT=$(($(tail -n $SCALE_UP_THRESHOLD "$LOG" | grep -c "CPU=.*[8-9][0-9]%" || echo 0) + $(tail -n $SCALE_UP_THRESHOLD "$LOG" | grep -c "MEM=.*[8-9][0-9]%" || echo 0)))
    if [ "$CURRENT_HIGH_COUNT" -ge "$SCALE_UP_THRESHOLD" ]; then
      echo "$TIMESTAMP ⚠️ High load detected – scaling up" >> "$LOG"
      pm2 start npm --name "hermes-agent-$(date +%s)" -- start 2>/dev/null || true
    fi
  else
    # If low load for SCALE_DOWN_THRESHOLD minutes, remove extra instance
    CURRENT_LOW_COUNT=$(tail -n $SCALE_DOWN_THRESHOLD "$LOG" | grep -c "CPU=.*[0-3][0-9]%" || echo 0)
    if [ "$CURRENT_LOW_COUNT" -ge "$SCALE_DOWN_THRESHOLD" ] && [ "$INSTANCES" -gt 1 ]; then
      echo "$TIMESTAMP ✅ Low load – scaling down" >> "$LOG"
      pm2 delete hermes 2>/dev/null || true
    fi
  fi

  sleep 60
done