#!/bin/bash

# Fast AI Autonomous Startup Script
# Starts available AI agents in continuous mode

cd "$(dirname "$0")/.."

echo "🚀 Starting AI Autonomous System..."

export CONTINUOUS_MODE=true
export AUTO_COMMIT=true
export AUTO_PUSH=true
export FAST_MODE=true

echo "⚡ Starting Continuous Improvement Agent..."
pm2 start ecosystem.config.cjs --only ai-continuous-improvement

echo "🔧 Starting Build Fixer Agent..."
pm2 start ecosystem.config.cjs --only ai-build-fixer || echo "Build fixer not configured"

echo "🎯 Starting App Improvement Specialist..."
pm2 start ecosystem.config.cjs --only ai-app-improvement-specialist || echo "App improvement specialist not configured"

echo ""
echo "✅ All AI agents started!"
echo ""
pm2 status
echo ""
echo "📊 View logs with: pm2 logs"
echo "🛑 Stop all with: pm2 stop all"
echo ""
echo "🚀 System is now running autonomously!"
echo ""
