#!/bin/bash

##############################################################################
# START AI CONTINUOUS IMPROVEMENT AGENT - MAXIMUM SPEED MODE
##############################################################################

cd "$(dirname "$0")/.."

echo "⚡ Starting AI Continuous Improvement Agent in MAXIMUM SPEED MODE..."
echo ""

# Configuration
INTERVAL_MINUTES=1
MAX_FIXES_PER_RUN=30
PRIORITY_MODE=all
AUTO_COMMIT=true
AUTO_PUSH=true
CONTINUOUS_MODE=true

echo "Configuration:"
echo "  ⚡ Interval: ${INTERVAL_MINUTES} minute(s)"
echo "  🚀 Max fixes: ${MAX_FIXES_PER_RUN} per run"
echo "  🎯 Priority: ${PRIORITY_MODE}"
echo "  🤖 Auto-commit: ${AUTO_COMMIT}"
echo "  🚀 Auto-push: ${AUTO_PUSH}"
echo "  🔄 Continuous: ${CONTINUOUS_MODE}"
echo ""

# Start the agent
export INTERVAL_MINUTES=${INTERVAL_MINUTES}
export MAX_FIXES_PER_RUN=${MAX_FIXES_PER_RUN}
export PRIORITY_MODE=${PRIORITY_MODE}
export AUTO_COMMIT=${AUTO_COMMIT}
export AUTO_PUSH=${AUTO_PUSH}
export CONTINUOUS_MODE=${CONTINUOUS_MODE}

echo "🚀 Starting agent..."
node automation/ai-continuous-improvement-agent.cjs continuous

