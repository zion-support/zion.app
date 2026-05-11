#!/bin/bash

##############################################################################
# START ALL AI AUTOMATIONS - MAXIMUM SPEED MODE
# This script starts all automation agents in continuous ultra-fast mode
##############################################################################

cd "$(dirname "$0")/.."

echo "Starting all AI automations in maximum-speed mode..."
echo ""

# Ensure PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Install it first (for example: npm i -g pm2)."
    exit 1
fi

# Ensure logs directory exists
mkdir -p automation/logs

# Stop only processes declared in this repository ecosystem (safe scope)
echo "Stopping existing ecosystem-managed processes..."
pm2 stop ecosystem.config.cjs 2>/dev/null || true
pm2 delete ecosystem.config.cjs 2>/dev/null || true

# Start all automations from ecosystem config
echo ""
echo "Starting all automations from ecosystem.config.cjs..."
pm2 start ecosystem.config.cjs --update-env

# Save PM2 configuration
pm2 save

# Show status
echo ""
echo "All automations started."
echo ""
pm2 status
echo ""
echo "View logs with: pm2 logs"
echo "View specific logs: pm2 logs <name>"
echo "Stop ecosystem apps: pm2 stop ecosystem.config.cjs"
echo "Restart ecosystem apps: pm2 restart ecosystem.config.cjs --update-env"
echo ""
echo "System is now running with ecosystem-scoped PM2 automation."
echo ""
echo "Use 'pm2 status' to see currently active ecosystem agents."
echo ""
