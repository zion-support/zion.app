#!/usr/bin/env node

/**
 * Email Notification Automation System
 * Sends intelligent email notifications for critical events, system alerts, and marketing campaigns
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailNotificationAutomation {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.subscribers = new Map();
    this.logFile = path.join(__dirname, 'logs', 'email-automation.log');
    this.ensureLogDir();
    this.loadTemplates();
    this.loadSubscribers();
    this.setupTransporter();
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

  setupTransporter() {
    // Use environment variables for email configuration
    this.transporter = nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates', 'email');
    if (fs.existsSync(templatesDir)) {
      const files = fs.readdirSync(templatesDir);
      files.forEach(file => {
        if (file.endsWith('.html')) {
          const name = path.basename(file, '.html');
          const content = fs.readFileSync(path.join(templatesDir, file), 'utf8');
          this.templates.set(name, content);
        }
      });
    }
  }

  loadSubscribers() {
    const subscribersFile = path.join(__dirname, 'data', 'email-subscribers.json');
    if (fs.existsSync(subscribersFile)) {
      const data = JSON.parse(fs.readFileSync(subscribersFile, 'utf8'));
      this.subscribers = new Map(Object.entries(data));
    }
  }

  saveSubscribers() {
    const subscribersFile = path.join(__dirname, 'data', 'email-subscribers.json');
    const dataDir = path.dirname(subscribersFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(subscribersFile, JSON.stringify(Object.fromEntries(this.subscribers), null, 2));
  }

  addSubscriber(email, preferences = {}) {
    this.subscribers.set(email, {
      email,
      subscribed: true,
      preferences: {
        systemAlerts: true,
        marketing: true,
        weeklyReports: true,
        ...preferences
      },
      subscribedAt: new Date().toISOString()
    });
    this.saveSubscribers();
    this.log(`Added subscriber: ${email}`);
  }

  removeSubscriber(email) {
    this.subscribers.delete(email);
    this.saveSubscribers();
    this.log(`Removed subscriber: ${email}`);
  }

  async sendEmail(to, subject, template, data = {}) {
    try {
      let html = this.templates.get(template) || template;
      
      // Replace template variables
      Object.entries(data).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.log(`Email sent successfully to ${to}: ${result.messageId}`);
      return result;
    } catch (error) {
      this.log(`Failed to send email to ${to}: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async sendSystemAlert(alert) {
    const subscribers = Array.from(this.subscribers.values())
      .filter(sub => sub.subscribed && sub.preferences.systemAlerts);

    for (const subscriber of subscribers) {
      await this.sendEmail(
        subscriber.email,
        `System Alert: ${alert.type}`,
        'system-alert',
        {
          alertType: alert.type,
          message: alert.message,
          timestamp: new Date().toISOString(),
          systemName: alert.system || 'Unknown'
        }
      );
    }
  }

  async sendMarketingCampaign(campaign) {
    const subscribers = Array.from(this.subscribers.values())
      .filter(sub => sub.subscribed && sub.preferences.marketing);

    for (const subscriber of subscribers) {
      await this.sendEmail(
        subscriber.email,
        campaign.subject,
        campaign.template,
        {
          ...campaign.data,
          unsubscribeLink: `${process.env.APP_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
        }
      );
    }
  }

  async sendWeeklyReport() {
    const subscribers = Array.from(this.subscribers.values())
      .filter(sub => sub.subscribed && sub.preferences.weeklyReports);

    // Generate weekly report data
    const reportData = await this.generateWeeklyReport();

    for (const subscriber of subscribers) {
      await this.sendEmail(
        subscriber.email,
        'Weekly System Report',
        'weekly-report',
        reportData
      );
    }
  }

  async generateWeeklyReport() {
    // Analyze automation logs and generate report
    const logFile = path.join(__dirname, 'logs', 'continuous-automation.log');
    let reportData = {
      week: new Date().toISOString().split('T')[0],
      totalErrors: 0,
      totalFixes: 0,
      systemsActive: 0,
      performanceMetrics: {}
    };

    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, 'utf8');
      const lines = logs.split('\n');
      
      reportData.totalErrors = lines.filter(line => line.includes('ERROR')).length;
      reportData.totalFixes = lines.filter(line => line.includes('FIXED')).length;
      reportData.systemsActive = new Set(lines.filter(line => line.includes('STARTED')).map(line => {
        const match = line.match(/\[(.*?)\]/);
        return match ? match[1] : null;
      })).size;
    }

    return reportData;
  }

  async startAutomation() {
    this.log('Starting Email Notification Automation');
    
    // Send weekly reports every Monday at 9 AM
    setInterval(async () => {
      const now = new Date();
      if (now.getDay() === 1 && now.getHours() === 9 && now.getMinutes() === 0) {
        await this.sendWeeklyReport();
      }
    }, 60000);

    // Monitor for system alerts
    this.monitorSystemAlerts();
  }

  monitorSystemAlerts() {
    // Watch automation logs for critical errors
    const logFile = path.join(__dirname, 'logs', 'continuous-automation.log');
    
    if (fs.existsSync(logFile)) {
      let lastSize = fs.statSync(logFile).size;
      
      setInterval(() => {
        try {
          const currentSize = fs.statSync(logFile).size;
          if (currentSize > lastSize) {
            const newContent = fs.readFileSync(logFile, 'utf8').slice(lastSize);
            const lines = newContent.split('\n');
            
            lines.forEach(line => {
              if (line.includes('CRITICAL') || line.includes('FATAL')) {
                this.sendSystemAlert({
                  type: 'Critical Error',
                  message: line,
                  system: 'Automation System'
                });
              }
            });
            
            lastSize = currentSize;
          }
        } catch (error) {
          this.log(`Error monitoring logs: ${error.message}`, 'ERROR');
        }
      }, 5000);
    }
  }
}

// CLI interface
if (require.main === module) {
  const automation = new EmailNotificationAutomation();
  const command = process.argv[2];

  switch (command) {
    case 'start':
      automation.startAutomation();
      break;
    case 'add-subscriber':
      const email = process.argv[3];
      if (email) {
        automation.addSubscriber(email);
        console.log(`Added subscriber: ${email}`);
      } else {
        console.log('Usage: node email-notification-automation.js add-subscriber <email>');
      }
      break;
    case 'send-campaign':
      const campaign = {
        subject: process.argv[3] || 'New Feature Announcement',
        template: process.argv[4] || 'marketing-campaign',
        data: {
          title: 'New AI Features Available',
          content: 'Check out our latest AI-powered automation features!',
          ctaText: 'Learn More',
          ctaUrl: 'https://ziontechgroup.com/services'
        }
      };
      automation.sendMarketingCampaign(campaign);
      break;
    case 'weekly-report':
      automation.sendWeeklyReport();
      break;
    default:
      console.log('Available commands:');
      console.log('  start - Start the automation system');
      console.log('  add-subscriber <email> - Add email subscriber');
      console.log('  send-campaign - Send marketing campaign');
      console.log('  weekly-report - Send weekly report');
  }
}

module.exports = EmailNotificationAutomation;
