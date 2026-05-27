#!/bin/bash

# Ultra-Fast PM2 Automation Startup Script
# Starts all automation agents for maximum speed development

echo "🚀 Starting Ultra-Fast PM2 Automation System..."

# Start all PM2 processes
pm2 start ecosystem.config.cjs

# Show status
pm2 status

echo ""
echo "✅ All automation agents started!"
echo ""
echo "Quick commands:"
echo "  pm2 status          - View all processes"
echo "  pm2 logs            - View all logs"
echo "  pm2 monit           - Monitor processes"
echo "  pm2 restart all     - Restart all processes"
echo "  pm2 stop all        - Stop all processes"
echo ""
echo "Individual agent commands:"
echo "  npm run test:auto-start       - Start test automation"
echo "  npm run security:scan-start   - Start security scanner"
echo "  npm run perf:profile-start    - Start performance profiler"
echo "  npm run git:workflow-start    - Start git workflow"
echo "  npm run docs:generate-start   - Start documentation generator"
echo ""

