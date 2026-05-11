#!/bin/bash

# PM2 Remote-First Sync Automation Startup Script
# This script starts the PM2 sync automation system with remote-first merge conflict resolution

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

check_dependencies() {
    log "Checking dependencies..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        warning "PM2 is not installed. Installing PM2 globally..."
        npm install -g pm2
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    success "All dependencies are satisfied"
}

setup_environment() {
    log "Setting up environment for remote-first sync automation..."
    
    # Create log directory
    mkdir -p "$LOG_DIR"
    
    # Set environment variables for remote-first strategy
    export REMOTE_FIRST_STRATEGY="true"
    export AUTOMATION_INTERVAL="30000"
    export BUILD_INTERVAL="300000"
    export TEST_INTERVAL="600000"
    export SECURITY_INTERVAL="1800000"
    export MONITOR_INTERVAL="60000"
    
    success "Environment setup completed with remote-first strategy"
}

configure_git_for_remote_first() {
    log "Checking Git strategy for remote-first merge..."
    
    cd "$PROJECT_ROOT"

    warning "Skipping automatic git config mutation for safety."
    warning "If needed, configure a repo-local merge strategy manually."
    success "Git strategy check completed"
}

start_pm2_remote_first_sync() {
    log "Starting PM2 Remote-First Sync Automation System..."
    
    cd "$PROJECT_ROOT"
    
    # Stop any existing PM2 processes
    if pm2 list | grep -q "pm2-sync-automation\|pm2-sync-monitor"; then
        log "Stopping existing PM2 sync processes..."
        pm2 stop "pm2-sync-automation" "pm2-sync-monitor" 2>/dev/null || true
        pm2 delete "pm2-sync-automation" "pm2-sync-monitor" 2>/dev/null || true
    fi
    
    # Start the PM2 sync automation processes
    log "Starting PM2 sync automation with remote-first strategy..."
    pm2 start "scripts/automation/pm2-sync-automation.cjs" --name "pm2-sync-automation" \
        --env REMOTE_FIRST_STRATEGY=true \
        --env AUTOMATION_INTERVAL=30000 \
        --env BUILD_INTERVAL=300000 \
        --env TEST_INTERVAL=600000 \
        --env SECURITY_INTERVAL=1800000 \
        --max-memory-restart 1G \
        --autorestart \
        --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
        --error "./logs/pm2-sync-automation-error.log" \
        --out "./logs/pm2-sync-automation-out.log" \
        --log "./logs/pm2-sync-automation-combined.log"
    
    pm2 start "scripts/automation/pm2-sync-monitor.cjs" --name "pm2-sync-monitor" \
        --env REMOTE_FIRST_STRATEGY=true \
        --env MONITOR_INTERVAL=60000 \
        --max-memory-restart 256M \
        --autorestart \
        --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
        --error "./logs/pm2-sync-monitor-error.log" \
        --out "./logs/pm2-sync-monitor-out.log" \
        --log "./logs/pm2-sync-monitor-combined.log"
    
    # Wait for processes to start
    sleep 5
    
    # Check if processes are running
    if pm2 list | grep -q "pm2-sync-automation.*online"; then
        success "PM2 Remote-First Sync Automation started successfully"
    else
        error "Failed to start PM2 Remote-First Sync Automation"
        pm2 logs "pm2-sync-automation" --lines 10
        exit 1
    fi
    
    if pm2 list | grep -q "pm2-sync-monitor.*online"; then
        success "PM2 Sync Monitor started successfully"
    else
        error "Failed to start PM2 Sync Monitor"
        pm2 logs "pm2-sync-monitor" --lines 10
        exit 1
    fi
    
    success "PM2 Remote-First Sync Automation System started successfully"
}

show_status() {
    log "PM2 Remote-First Sync Automation System Status:"
    echo
    
    # Show PM2 process list
    pm2 list
    
    echo
    
    # Show system information
    log "System Information:"
    echo "  Project Root: $PROJECT_ROOT"
    echo "  Log Directory: $LOG_DIR"
    echo "  Strategy: Remote-First (accept remote changes in conflicts)"
    echo "  Node Version: $(node --version)"
    echo "  NPM Version: $(npm --version)"
    echo "  PM2 Version: $(pm2 --version)"
    
    echo
    
    # Show health check endpoints
    log "Health Check Endpoints:"
    echo "  Monitor Health: http://localhost:3001/health"
    echo "  Monitor Metrics: http://localhost:3001/metrics"
    
    echo
    
    # Show useful commands
    log "Useful Commands:"
    echo "  View logs: pm2 logs"
    echo "  Monitor processes: pm2 monit"
    echo "  Restart sync automation: pm2 restart pm2-sync-automation"
    echo "  Stop sync automation: pm2 stop pm2-sync-automation"
    echo "  Delete sync automation: pm2 delete pm2-sync-automation"
}

main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║            PM2 Remote-First Sync Automation System          ║"
    echo "║        Always Accept Remote Changes in Merge Conflicts      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log "Starting PM2 Remote-First Sync Automation System setup..."
    
    # Check dependencies
    check_dependencies
    
    # Setup environment
    setup_environment
    
    # Configure git for remote-first strategy
    configure_git_for_remote_first
    
    # Start PM2 remote-first sync system
    start_pm2_remote_first_sync
    
    # Show status
    show_status
    
    echo
    success "PM2 Remote-First Sync Automation System is now running!"
    echo
    log "The system will automatically:"
    echo "  • Watch for file changes and sync them to the repository"
    echo "  • Resolve merge conflicts by accepting remote changes (remote-first strategy)"
    echo "  • Monitor system health and resolve issues automatically"
    echo "  • Run builds, tests, and security scans"
    echo "  • Keep everything synchronized and up-to-date"
    echo
    log "Use 'pm2 monit' to monitor the system in real-time"
    log "Use 'pm2 logs' to view system logs"
    echo
}

# Handle script arguments
case "${1:-}" in
    "stop")
        log "Stopping PM2 Remote-First Sync Automation System..."
        cd "$PROJECT_ROOT"
        pm2 stop "pm2-sync-automation" "pm2-sync-monitor"
        pm2 delete "pm2-sync-automation" "pm2-sync-monitor"
        success "PM2 Remote-First Sync Automation System stopped"
        ;;
    "restart")
        log "Restarting PM2 Remote-First Sync Automation System..."
        cd "$PROJECT_ROOT"
        pm2 restart "pm2-sync-automation" "pm2-sync-monitor"
        success "PM2 Remote-First Sync Automation System restarted"
        ;;
    "status")
        cd "$PROJECT_ROOT"
        show_status
        ;;
    "logs")
        cd "$PROJECT_ROOT"
        pm2 logs "pm2-sync-automation" "pm2-sync-monitor"
        ;;
    "monitor")
        cd "$PROJECT_ROOT"
        pm2 monit
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "  start   - Start the PM2 Remote-First Sync Automation System (default)"
        echo "  stop    - Stop the PM2 Remote-First Sync Automation System"
        echo "  restart - Restart the PM2 Remote-First Sync Automation System"
        echo "  status  - Show system status"
        echo "  logs    - Show system logs"
        echo "  monitor - Open PM2 monitoring interface"
        echo "  help    - Show this help message"
        echo
        echo "Remote-First Strategy:"
        echo "  This system always resolves merge conflicts by accepting remote changes."
        echo "  Local changes are automatically discarded in favor of remote changes."
        echo
        echo "Examples:"
        echo "  $0              # Start the system"
        echo "  $0 stop         # Stop the system"
        echo "  $0 status       # Show status"
        echo "  $0 logs         # Show logs"
        ;;
    *)
        main
        ;;
esac
