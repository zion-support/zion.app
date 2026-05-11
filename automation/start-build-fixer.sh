#!/bin/bash

# Start AI Build Fixer Agent with PM2 - ULTRA-FAST AUTONOMOUS MODE

echo "⚡ Starting AI Build Fixer Agent in ULTRA-FAST AUTONOMOUS MODE..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing..."
    npm install -g pm2
fi

# Start the build fixer agent
pm2 start ecosystem.config.cjs --only ai-build-fixer

# Save PM2 configuration
pm2 save

# Show status
pm2 status ai-build-fixer

echo ""
echo "✅ AI Build Fixer Agent started!"
echo ""
echo "Commands:"
echo "  pm2 logs ai-build-fixer    - View logs"
echo "  pm2 status ai-build-fixer   - Check status"
echo "  pm2 restart ai-build-fixer  - Restart agent"
echo "  pm2 stop ai-build-fixer     - Stop agent"
echo ""
echo "The agent will now run continuously, checking the build every 1 minute."

