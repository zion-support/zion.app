#!/bin/bash

###############################################################################
# AI SEO Monitor & Optimizer - Quick Start Script
# 
# Starts the SEO monitoring automation with PM2
# Monitors and optimizes SEO health automatically
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Emojis
ROCKET="🚀"
CHECK="✅"
WARN="⚠️"
INFO="📊"
SPARKLE="✨"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() {
    echo -e "${BLUE}${INFO}${NC} $1"
}

success() {
    echo -e "${GREEN}${CHECK}${NC} $1"
}

warning() {
    echo -e "${YELLOW}${WARN}${NC} $1"
}

error() {
    echo -e "${RED}❌${NC} $1"
}

banner() {
    echo ""
    echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}      ${SPARKLE} AI SEO Monitor & Optimizer - Quick Start ${SPARKLE}      ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       - Start SEO monitor with PM2 (default)"
    echo "  stop        - Stop SEO monitor"
    echo "  restart     - Restart SEO monitor"
    echo "  status      - Show monitor status"
    echo "  logs        - View monitor logs"
    echo "  analyze     - Run single analysis"
    echo "  report      - Open HTML report in browser"
    echo "  help        - Show this help message"
    echo ""
}

check_dependencies() {
    log "Checking dependencies..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        warning "PM2 is not installed. Installing PM2..."
        npm install -g pm2
    fi
    
    # Check if ecosystem config exists
    if [ ! -f "$PROJECT_ROOT/ecosystem.config.cjs" ]; then
        error "ecosystem.config.cjs not found!"
        exit 1
    fi
    
    # Check if SEO monitor script exists
    if [ ! -f "$PROJECT_ROOT/automation/ai-seo-monitor-optimizer.cjs" ]; then
        error "ai-seo-monitor-optimizer.cjs not found!"
        exit 1
    fi
    
    success "All dependencies are installed"
}

start_monitor() {
    log "Starting AI SEO Monitor..."
    
    cd "$PROJECT_ROOT"
    
    # Stop if already running
    if pm2 list | grep -q "ai-seo-monitor.*online"; then
        warning "SEO monitor is already running. Restarting..."
        pm2 restart ai-seo-monitor
    else
        # Start the monitor
        pm2 start ecosystem.config.cjs --only ai-seo-monitor
    fi
    
    # Wait for startup
    sleep 3
    
    success "AI SEO Monitor started successfully!"
    echo ""
    log "Monitor is now running and will check SEO every 30 minutes"
    echo ""
    echo -e "${BLUE}Quick Commands:${NC}"
    echo "  pm2 logs ai-seo-monitor      - View logs"
    echo "  pm2 status ai-seo-monitor    - Check status"
    echo "  pm2 stop ai-seo-monitor      - Stop monitor"
    echo "  pm2 restart ai-seo-monitor   - Restart monitor"
    echo ""
    
    # Show current status
    pm2 status ai-seo-monitor
}

stop_monitor() {
    log "Stopping AI SEO Monitor..."
    
    if pm2 list | grep -q "ai-seo-monitor"; then
        pm2 stop ai-seo-monitor
        success "AI SEO Monitor stopped"
    else
        warning "SEO monitor is not running"
    fi
}

restart_monitor() {
    log "Restarting AI SEO Monitor..."
    
    if pm2 list | grep -q "ai-seo-monitor"; then
        pm2 restart ai-seo-monitor
        success "AI SEO Monitor restarted"
        sleep 2
        pm2 status ai-seo-monitor
    else
        warning "SEO monitor is not running. Starting it..."
        start_monitor
    fi
}

show_status() {
    log "AI SEO Monitor Status:"
    echo ""
    
    if pm2 list | grep -q "ai-seo-monitor"; then
        pm2 status ai-seo-monitor
        echo ""
        pm2 show ai-seo-monitor
    else
        warning "SEO monitor is not running"
        echo ""
        echo "Start it with: $0 start"
    fi
}

show_logs() {
    log "Showing AI SEO Monitor logs..."
    echo ""
    
    if pm2 list | grep -q "ai-seo-monitor"; then
        pm2 logs ai-seo-monitor --lines 100
    else
        error "SEO monitor is not running"
        echo ""
        echo "Start it with: $0 start"
        exit 1
    fi
}

run_analysis() {
    log "Running single SEO analysis..."
    echo ""
    
    cd "$PROJECT_ROOT"
    node automation/ai-seo-monitor-optimizer.cjs analyze
    
    echo ""
    success "Analysis complete!"
    echo ""
    echo "View reports:"
    echo "  JSON: automation/reports/seo-report.json"
    echo "  HTML: automation/reports/seo-report.html"
    echo ""
    echo "Open report: $0 report"
}

open_report() {
    local report_path="$PROJECT_ROOT/automation/reports/seo-report.html"
    
    if [ ! -f "$report_path" ]; then
        error "Report not found. Run an analysis first:"
        echo ""
        echo "  $0 analyze"
        exit 1
    fi
    
    log "Opening SEO report..."
    
    # Open based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$report_path"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open "$report_path" 2>/dev/null || firefox "$report_path" 2>/dev/null || chromium-browser "$report_path" 2>/dev/null
    else
        warning "Could not auto-open report. Please open manually:"
        echo "$report_path"
    fi
    
    success "Report opened in browser"
}

main() {
    banner
    
    local command="${1:-start}"
    
    case "$command" in
        start)
            check_dependencies
            start_monitor
            ;;
        stop)
            stop_monitor
            ;;
        restart)
            check_dependencies
            restart_monitor
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        analyze)
            check_dependencies
            run_analysis
            ;;
        report)
            open_report
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

main "$@"

