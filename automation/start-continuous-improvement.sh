#!/bin/bash

##############################################################################
# AI Continuous Improvement Agent - Quick Start Script (ULTRA-FAST MODE)
##############################################################################

set -e

echo "⚡ AI Continuous Improvement Agent - ULTRA-FAST MODE"
echo "======================================================"
echo ""
echo "🚀 Starting in AUTONOMOUS CONTINUOUS MODE"
echo "⚡ Interval: 2 minutes (maximum speed)"
echo "🤖 Auto-commit: ENABLED"
echo "🚀 Auto-push: ENABLED"
echo ""

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Error: Node.js 18+ required (current: $(node --version))"
  exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Navigate to project root
cd "$(dirname "$0")/.."
echo "✅ Project root: $(pwd)"

# Create required directories
mkdir -p automation/reports automation/logs automation/data
echo "✅ Directories created"

# Display menu
echo ""
echo "Select mode:"
echo "1) ⚡ ULTRA-FAST Continuous Mode (2 min intervals) - RECOMMENDED"
echo "2) Run once (single improvement cycle)"
echo "3) Analysis only (no fixes)"
echo "4) Start with PM2 (background process - ULTRA-FAST)"
echo "5) View logs"
echo "6) View latest report"
echo "7) Custom speed (1 minute intervals)"
echo ""
read -p "Enter choice [1-7] (default: 1): " choice
choice=${choice:-1}

case $choice in
  1)
    echo ""
    echo "🚀 Starting ULTRA-FAST continuous mode..."
    echo "⚡ Interval: 2 minutes"
    echo "🤖 Fully autonomous (auto-commit + auto-push)"
    echo "⏹️  Press Ctrl+C to stop"
    echo ""
    CONTINUOUS_MODE=true INTERVAL_MINUTES=2 MAX_FIXES_PER_RUN=20 PRIORITY_MODE=all \
      node automation/ai-continuous-improvement-agent.cjs continuous
    ;;
  
  2)
    echo ""
    echo "🚀 Running single improvement cycle..."
    echo ""
    MAX_FIXES_PER_RUN=20 PRIORITY_MODE=all \
      node automation/ai-continuous-improvement-agent.cjs run
    ;;
  
  3)
    echo ""
    echo "🔍 Running analysis only..."
    echo ""
    AUTO_COMMIT=false node automation/ai-continuous-improvement-agent.cjs analyze
    ;;
  
  4)
    echo ""
    echo "🚀 Starting with PM2 (ULTRA-FAST mode)..."
    echo ""
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
      echo "❌ PM2 not installed. Installing globally..."
      npm install -g pm2
    fi
    
    # Start with PM2
    pm2 start ecosystem.config.cjs --only ai-continuous-improvement
    
    echo ""
    echo "✅ Agent started in background (ULTRA-FAST mode)"
    echo ""
    echo "Useful PM2 commands:"
    echo "  pm2 logs ai-continuous-improvement    - View logs"
    echo "  pm2 status                            - Check status"
    echo "  pm2 stop ai-continuous-improvement    - Stop agent"
    echo "  pm2 restart ai-continuous-improvement - Restart agent"
    echo "  pm2 monit                             - Monitor resources"
    ;;
  
  5)
    echo ""
    echo "📜 Viewing logs (Ctrl+C to stop)..."
    echo ""
    
    if command -v pm2 &> /dev/null && pm2 list | grep -q ai-continuous-improvement; then
      pm2 logs ai-continuous-improvement
    else
      tail -f automation/logs/ai-continuous-improvement.log
    fi
    ;;
  
  6)
    echo ""
    echo "📊 Latest Report"
    echo "================"
    echo ""
    
    if [ -f "automation/reports/acia-latest-report.json" ]; then
      # Check if jq is available
      if command -v jq &> /dev/null; then
        cat automation/reports/acia-latest-report.json | jq '.'
      else
        cat automation/reports/acia-latest-report.json
      fi
      
      echo ""
      echo "Full report: automation/reports/acia-latest-report.json"
    else
      echo "❌ No report found. Run the agent first."
    fi
    ;;
  
  7)
    echo ""
    echo "⚡ Starting CUSTOM ULTRA-FAST mode (1 minute intervals)..."
    echo "⚡ Interval: 1 minute"
    echo "🤖 Fully autonomous"
    echo "⏹️  Press Ctrl+C to stop"
    echo ""
    CONTINUOUS_MODE=true INTERVAL_MINUTES=1 MAX_FIXES_PER_RUN=30 PRIORITY_MODE=all \
      node automation/ai-continuous-improvement-agent.cjs continuous
    ;;
  
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✨ Done!"
