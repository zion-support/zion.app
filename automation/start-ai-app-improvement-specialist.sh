#!/bin/bash

###############################################################################
# AI App Improvement Specialist - Quick Start Script
###############################################################################
#
# This script provides easy commands to manage the AI App Improvement Specialist
#
# Usage:
#   ./start-ai-app-improvement-specialist.sh [command]
#
# Commands:
#   run          - Run one improvement cycle
#   continuous   - Run continuously
#   analyze      - Run analysis only (no improvements)
#   aggressive   - Run in aggressive mode
#   conservative - Run in conservative mode
#   pm2-start    - Start as PM2 service
#   pm2-stop     - Stop PM2 service
#   pm2-logs     - View PM2 logs
#   pm2-status   - Check PM2 status
#   report       - Show latest report
#   health       - Show current health score
#   help         - Show this help
#
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Script path
SCRIPT_PATH="$PROJECT_ROOT/automation/ai-app-improvement-specialist.cjs"
REPORT_PATH="$PROJECT_ROOT/automation/reports/improvement-specialist/latest-report.json"

# Print header
print_header() {
    echo -e "${PURPLE}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║   AI App Improvement Specialist (AAIS)                  ║"
    echo "║   Next-generation autonomous app improvement system      ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Print section
print_section() {
    echo -e "${CYAN}▶ $1${NC}"
}

# Print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Print info
print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if script exists
check_script() {
    if [ ! -f "$SCRIPT_PATH" ]; then
        print_error "AI App Improvement Specialist script not found at: $SCRIPT_PATH"
        exit 1
    fi
}

# Show help
show_help() {
    print_header
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  run          - Run one improvement cycle"
    echo "  continuous   - Run continuously (every 30 minutes)"
    echo "  analyze      - Run analysis only (no improvements)"
    echo "  aggressive   - Run in aggressive mode (more improvements)"
    echo "  conservative - Run in conservative mode (critical fixes only)"
    echo "  pm2-start    - Start as PM2 background service"
    echo "  pm2-stop     - Stop PM2 service"
    echo "  pm2-logs     - View PM2 logs"
    echo "  pm2-status   - Check PM2 status"
    echo "  pm2-restart  - Restart PM2 service"
    echo "  report       - Show latest report"
    echo "  health       - Show current health score"
    echo "  help         - Show this help"
    echo ""
    echo "Environment Variables:"
    echo "  AAIS_MODE              - Operation mode (standard|aggressive|conservative)"
    echo "  AAIS_MAX_IMPROVEMENTS  - Max improvements per run (default: 15)"
    echo "  AAIS_MIN_HEALTH        - Target health score (default: 80)"
    echo "  AAIS_AUTO_COMMIT       - Auto-commit changes (default: true)"
    echo "  AAIS_AUTO_PUSH         - Auto-push to remote (default: true)"
    echo ""
    echo "Examples:"
    echo "  $0 run"
    echo "  $0 continuous"
    echo "  AAIS_MODE=aggressive $0 run"
    echo "  $0 pm2-start"
    echo ""
}

# Run one cycle
run_once() {
    print_header
    print_section "Running one improvement cycle..."
    node "$SCRIPT_PATH" run
}

# Run continuously
run_continuous() {
    print_header
    print_section "Starting continuous mode..."
    print_info "Press Ctrl+C to stop"
    AAIS_CONTINUOUS=true node "$SCRIPT_PATH" continuous
}

# Run analysis only
run_analyze() {
    print_header
    print_section "Running analysis only..."
    node "$SCRIPT_PATH" analyze
}

# Run aggressive mode
run_aggressive() {
    print_header
    print_section "Running in aggressive mode..."
    AAIS_MODE=aggressive AAIS_MAX_IMPROVEMENTS=20 node "$SCRIPT_PATH" run
}

# Run conservative mode
run_conservative() {
    print_header
    print_section "Running in conservative mode..."
    AAIS_MODE=conservative AAIS_MAX_IMPROVEMENTS=5 node "$SCRIPT_PATH" run
}

# Start PM2 service
pm2_start() {
    print_header
    print_section "Starting PM2 service..."
    
    if command -v pm2 &> /dev/null; then
        pm2 start ecosystem.config.cjs --only ai-app-improvement-specialist
        print_success "PM2 service started"
        echo ""
        pm2 list | grep ai-app-improvement-specialist
    else
        print_error "PM2 not installed. Install it with: npm install -g pm2"
        exit 1
    fi
}

# Stop PM2 service
pm2_stop() {
    print_header
    print_section "Stopping PM2 service..."
    
    if command -v pm2 &> /dev/null; then
        pm2 stop ai-app-improvement-specialist
        print_success "PM2 service stopped"
    else
        print_error "PM2 not installed"
        exit 1
    fi
}

# View PM2 logs
pm2_logs() {
    print_header
    print_section "Viewing PM2 logs..."
    
    if command -v pm2 &> /dev/null; then
        pm2 logs ai-app-improvement-specialist
    else
        print_error "PM2 not installed"
        exit 1
    fi
}

# Check PM2 status
pm2_status() {
    print_header
    print_section "PM2 Status..."
    
    if command -v pm2 &> /dev/null; then
        pm2 list | grep ai-app-improvement-specialist || print_warning "Service not running"
    else
        print_error "PM2 not installed"
        exit 1
    fi
}

# Restart PM2 service
pm2_restart() {
    print_header
    print_section "Restarting PM2 service..."
    
    if command -v pm2 &> /dev/null; then
        pm2 restart ai-app-improvement-specialist
        print_success "PM2 service restarted"
    else
        print_error "PM2 not installed"
        exit 1
    fi
}

# Show latest report
show_report() {
    print_header
    print_section "Latest Report"
    
    if [ -f "$REPORT_PATH" ]; then
        cat "$REPORT_PATH" | jq '.' 2>/dev/null || cat "$REPORT_PATH"
    else
        print_warning "No report found. Run the specialist first."
    fi
}

# Show health score
show_health() {
    print_header
    print_section "Current Health Score"
    
    if [ -f "$REPORT_PATH" ]; then
        if command -v jq &> /dev/null; then
            HEALTH=$(cat "$REPORT_PATH" | jq -r '.healthScore.current')
            TARGET=$(cat "$REPORT_PATH" | jq -r '.healthScore.target')
            STATUS=$(cat "$REPORT_PATH" | jq -r '.healthScore.status')
            
            echo ""
            echo -e "  Health Score: ${GREEN}$HEALTH/100${NC}"
            echo -e "  Target Score: $TARGET"
            echo -e "  Status: $STATUS"
            echo ""
            
            # Show key metrics
            echo -e "${CYAN}Key Metrics:${NC}"
            cat "$REPORT_PATH" | jq -r '.analysis | to_entries[] | "  \(.key): \(.value)"'
            
        else
            print_warning "Install jq for better formatting: brew install jq"
            cat "$REPORT_PATH"
        fi
    else
        print_warning "No report found. Run the specialist first."
    fi
}

# Main command handler
main() {
    check_script
    
    COMMAND=${1:-help}
    
    case $COMMAND in
        run)
            run_once
            ;;
        continuous)
            run_continuous
            ;;
        analyze)
            run_analyze
            ;;
        aggressive)
            run_aggressive
            ;;
        conservative)
            run_conservative
            ;;
        pm2-start)
            pm2_start
            ;;
        pm2-stop)
            pm2_stop
            ;;
        pm2-logs)
            pm2_logs
            ;;
        pm2-status)
            pm2_status
            ;;
        pm2-restart)
            pm2_restart
            ;;
        report)
            show_report
            ;;
        health)
            show_health
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $COMMAND"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main
main "$@"

