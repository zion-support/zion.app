#!/bin/bash

###############################################################################
# Start PM2 Automation Reliability Stack
#
# This script starts PM2 reliability-oriented automations:
# - ai-smart-dependency-manager
# - ai-pm2-restart-guardian
###############################################################################

set -e

echo "🚀 Starting PM2 automation reliability stack..."
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 is not installed${NC}"
    echo "Install PM2 globally: npm install -g pm2"
    exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}📊 Current PM2 Status:${NC}"
pm2 status || true
echo ""

echo -e "${BLUE}🔧 Starting AI Smart Dependency Manager...${NC}"
pm2 start ecosystem.config.cjs --only ai-smart-dependency-manager --update-env

echo -e "${BLUE}🛡️  Starting PM2 Restart Guardian...${NC}"
pm2 start ecosystem.config.cjs --only ai-pm2-restart-guardian --update-env

echo ""
echo -e "${GREEN}✅ PM2 reliability stack started successfully!${NC}"
echo ""

echo -e "${BLUE}📊 Agent Status:${NC}"
pm2 status ai-smart-dependency-manager ai-pm2-restart-guardian

echo ""
echo -e "${BLUE}📝 Quick Commands:${NC}"
echo "  View logs (deps):     pm2 logs ai-smart-dependency-manager"
echo "  View logs (guardian): pm2 logs ai-pm2-restart-guardian"
echo "  Stop stack:           pm2 stop ai-smart-dependency-manager ai-pm2-restart-guardian"
echo "  Restart stack:        pm2 restart ai-smart-dependency-manager ai-pm2-restart-guardian --update-env"
echo ""
