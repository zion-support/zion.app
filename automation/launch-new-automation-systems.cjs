#!/usr/bin/env node

/**
 * Launch New Automation Systems
 * Orchestrates and launches the newly created automation systems
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class NewAutomationLauncher {
  constructor() {
    this.automationDir = __dirname;
    this.logFile = path.join(this.automationDir, 'logs', 'new-automation-launcher.log');
    this.processes = new Map();
    this.ensureLogDir();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, logEntry);
  }

  launchAutomation(scriptName, args = []) {
    const scriptPath = path.join(this.automationDir, scriptName);
    
    if (!fs.existsSync(scriptPath)) {
      this.log(`Script not found: ${scriptPath}`, 'ERROR');
      return null;
    }

    this.log(`Launching ${scriptName}...`);
    
    const process = spawn('node', [scriptPath, ...args], {
      cwd: path.resolve(this.automationDir, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    process.stdout.on('data', (data) => {
      this.log(`${scriptName}: ${data.toString().trim()}`);
    });

    process.stderr.on('data', (data) => {
      this.log(`${scriptName} ERROR: ${data.toString().trim()}`, 'ERROR');
    });

    process.on('close', (code) => {
      this.log(`${scriptName} exited with code ${code}`);
      this.processes.delete(scriptName);
    });

    process.on('error', (error) => {
      this.log(`${scriptName} process error: ${error.message}`, 'ERROR');
      this.processes.delete(scriptName);
    });

    this.processes.set(scriptName, process);
    return process;
  }

  launchEmailNotificationAutomation() {
    return this.launchAutomation('email-notification-automation.cjs', ['start']);
  }

  launchAIContentOptimization() {
    return this.launchAutomation('ai-content-optimization-automation.cjs', ['start']);
  }

  launchAISocialMediaAutomation() {
    return this.launchAutomation('ai-social-media-automation.cjs', ['start']);
  }

  launchAIPerformanceMonitoring() {
    return this.launchAutomation('ai-performance-monitoring-automation.cjs', ['start']);
  }

  launchAllNewAutomations() {
    this.log('Launching all new automation systems...');
    
    // Launch email notification automation
    this.launchEmailNotificationAutomation();
    
    // Launch AI content optimization
    this.launchAIContentOptimization();
    
    // Launch AI social media automation
    this.launchAISocialMediaAutomation();
    
    // Launch AI performance monitoring
    this.launchAIPerformanceMonitoring();
    
    this.log(`Launched ${this.processes.size} automation systems`);
  }

  stopAutomation(scriptName) {
    const process = this.processes.get(scriptName);
    if (process) {
      this.log(`Stopping ${scriptName}...`);
      process.kill('SIGTERM');
      this.processes.delete(scriptName);
    } else {
      this.log(`Process ${scriptName} not found`, 'WARNING');
    }
  }

  stopAllAutomations() {
    this.log('Stopping all automation systems...');
    
    for (const [scriptName, process] of this.processes) {
      this.log(`Stopping ${scriptName}...`);
      process.kill('SIGTERM');
    }
    
    this.processes.clear();
    this.log('All automation systems stopped');
  }

  getStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      runningProcesses: Array.from(this.processes.keys()),
      totalProcesses: this.processes.size
    };
    
    return status;
  }

  monitorProcesses() {
    setInterval(() => {
      for (const [scriptName, process] of this.processes) {
        if (process.killed) {
          this.log(`Process ${scriptName} was killed, restarting...`);
          this.processes.delete(scriptName);
          
          // Restart the process
          switch (scriptName) {
            case 'email-notification-automation.cjs':
              this.launchEmailNotificationAutomation();
              break;
            case 'ai-content-optimization-automation.cjs':
              this.launchAIContentOptimization();
              break;
            case 'ai-social-media-automation.cjs':
              this.launchAISocialMediaAutomation();
              break;
            case 'ai-performance-monitoring-automation.cjs':
              this.launchAIPerformanceMonitoring();
              break;
          }
        }
      }
    }, 30000); // Check every 30 seconds
  }

  start() {
    this.log('Starting New Automation Systems Launcher');
    
    // Launch all new automation systems
    this.launchAllNewAutomations();
    
    // Start process monitoring
    this.monitorProcesses();
    
    // Keep the launcher running
    process.on('SIGINT', () => {
      this.log('Received SIGINT, shutting down...');
      this.stopAllAutomations();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      this.log('Received SIGTERM, shutting down...');
      this.stopAllAutomations();
      process.exit(0);
    });
  }
}

// CLI interface
if (require.main === module) {
  const launcher = new NewAutomationLauncher();
  const command = process.argv[2];

  switch (command) {
    case 'start':
      launcher.start();
      break;
    case 'launch-all':
      launcher.launchAllNewAutomations();
      break;
    case 'stop-all':
      launcher.stopAllAutomations();
      break;
    case 'status':
      const status = launcher.getStatus();
      console.log(JSON.stringify(status, null, 2));
      break;
    case 'launch-email':
      launcher.launchEmailNotificationAutomation();
      break;
    case 'launch-content':
      launcher.launchAIContentOptimization();
      break;
    case 'launch-social':
      launcher.launchAISocialMediaAutomation();
      break;
    case 'launch-performance':
      launcher.launchAIPerformanceMonitoring();
      break;
    default:
      console.log('Available commands:');
      console.log('  start - Start the launcher with all systems');
      console.log('  launch-all - Launch all new automation systems');
      console.log('  stop-all - Stop all automation systems');
      console.log('  status - Show status of running processes');
      console.log('  launch-email - Launch email notification automation');
      console.log('  launch-content - Launch AI content optimization');
      console.log('  launch-social - Launch AI social media automation');
      console.log('  launch-performance - Launch AI performance monitoring');
  }
}

module.exports = NewAutomationLauncher;
