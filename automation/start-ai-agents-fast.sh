#!/bin/bash

###############################################################################
# AI Agents Fast Startup Script
# Starts available AI agents in FAST CONTINUOUS MODE
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${MAGENTA}⚡ Starting AI Agents in FAST CONTINUOUS MODE${NC}"
echo ""

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 is not installed${NC}"
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
fi

if [ ! -f "$PROJECT_ROOT/ecosystem.config.cjs" ]; then
    echo -e "${RED}❌ ecosystem.config.cjs not found${NC}"
    exit 1
fi

export FAST_MODE=true
export CONTINUOUS_MODE=true
export AUTO_COMMIT=true
export AUTO_PUSH=true

echo -e "${BLUE}📊 FAST Mode Configuration:${NC}"
echo -e "  ${YELLOW}Auto Commit:${NC} Enabled"
echo -e "  ${YELLOW}Auto Push:${NC} Enabled"
echo ""

echo -e "${YELLOW}🚀 Starting AI Continuous Improvement Agent...${NC}"
pm2 start ecosystem.config.cjs --only ai-continuous-improvement --update-env

echo -e "${YELLOW}🚀 Starting AI Build Fixer...${NC}"
pm2 start ecosystem.config.cjs --only ai-build-fixer --update-env

echo -e "${YELLOW}🚀 Starting AI App Improvement Specialist...${NC}"
pm2 start ecosystem.config.cjs --only ai-app-improvement-specialist --update-env

echo ""
echo -e "${GREEN}✅ AI Agents Started in FAST CONTINUOUS MODE${NC}"
echo ""

echo -e "${BLUE}Current Status:${NC}"
pm2 status | grep -E "ai-continuous-improvement|ai-build-fixer|ai-app-improvement|Process"

echo ""
echo -e "${BLUE}📊 View Logs:${NC}"
echo -e "  ${YELLOW}pm2 logs ai-continuous-improvement${NC}"
echo -e "  ${YELLOW}pm2 logs ai-build-fixer${NC}"
echo -e "  ${YELLOW}pm2 logs ai-app-improvement-specialist${NC}"
echo ""
echo -e "${BLUE}🛑 Stop Agents:${NC}"
echo -e "  ${YELLOW}pm2 stop ecosystem.config.cjs${NC}"
echo ""
echo -e "${MAGENTA}⚡ Agents are now running AUTONOMOUSLY at MAXIMUM SPEED!${NC}"
echo ""
