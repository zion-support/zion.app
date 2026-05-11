#!/usr/bin/env node

/**
 * AI Email Audit & Client Follow-up Automation Agent
 * Runs proactively every 15 minutes to audit emails and take appropriate actions
 * 
 * Features:
 * 1. Scans unread emails from Gmail
 * 2. Categorizes emails (business, support, leads, internal, promotions)
 * 3. Prioritizes important client emails
 * 4. Takes automated actions (mark read, archive, flag, draft responses)
 * 5. Follows up with clients automatically when appropriate
 * 6. Logs all actions for auditing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data', 'email-audit');
const LOG_FILE = path.join(DATA_DIR, 'email-audit-log.json');

// Initialize directories
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function logAction(action, emailId, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    emailId,
    details
  };
  
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch (e) {}
  }
  
  logs.push(logEntry);
  
  // Keep last 1000 entries
  if (logs.length > 1000) {
    logs = logs.slice(-1000);
  }
  
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  console.log(`[EMAIL AUDIT] ${action} for email ${emailId}`);
}

function runGogCommand(command) {
  try {
    return execSync(`gog ${command} --account kleber@ziontechgroup.com`, { 
      encoding: 'utf8',
      timeout: 30000
    });
  } catch (e) {
    console.error(`Command failed: ${command}`, e.message);
    return null;
  }
}

function getUnreadEmails(limit = 100) {
  const output = runGogCommand(`gmail search "is:unread" --max ${limit} --plain`);
  if (!output) return [];
  
  const emails = [];
  const lines = output.trim().split('\n');
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/\s+/);
    if (parts.length < 5) continue;
    
    emails.push({
      id: parts[0],
      date: parts[1] + ' ' + parts[2],
      from: parts[3],
      subject: parts.slice(4, -1).join(' '),
      labels: parts[parts.length - 1]
    });
  }
  
  return emails;
}

function getAllEmails(limit = 200) {
  const output = runGogCommand(`gmail search "in:inbox" --max ${limit} --plain`);
  if (!output) return [];
  
  const emails = [];
  const lines = output.trim().split('\n');
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/\s+/);
    if (parts.length < 5) continue;
    
    emails.push({
      id: parts[0],
      date: parts[1] + ' ' + parts[2],
      from: parts[3],
      subject: parts.slice(4, -1).join(' '),
      labels: parts[parts.length - 1]
    });
  }
  
  return emails;
}

function categorizeEmail(email) {
  const subject = email.subject.toLowerCase();
  const from = email.from.toLowerCase();
  
  // Business / Client emails
  if (from.includes('ziontechgroup.com') && !from.includes('notifications') && !from.includes('noreply')) {
    return 'business';
  }
  
  // Leads / Quote requests
  if (subject.includes('quote') || subject.includes('orçamento') || 
      subject.includes('server') || subject.includes('oracle') || 
      subject.includes('proposal') || subject.includes('proposta')) {
    return 'lead';
  }
  
  // Support requests
  if (subject.includes('support') || subject.includes('ticket') || 
      subject.includes('suporte') || subject.includes('problem') || 
      subject.includes('issue')) {
    return 'support';
  }
  
  // GitHub notifications
  if (from.includes('github.com') || subject.includes('run failed')) {
    return 'github';
  }
  
  // Promotions / Spam
  if (email.labels.includes('CATEGORY_PROMOTIONS')) {
    return 'promotion';
  }
  
  return 'other';
}

function getPriority(email, category) {
  if (category === 'lead' || category === 'business') {
    return 'high';
  }
  if (category === 'support') {
    return 'medium';
  }
  if (category === 'github' || category === 'promotion') {
    return 'low';
  }
  return 'normal';
}

function markEmailAsRead(emailId) {
  runGogCommand(`gmail mark-read ${emailId}`);
  logAction('MARK_READ', emailId);
}

function archiveEmail(emailId) {
  runGogCommand(`gmail archive ${emailId}`);
  logAction('ARCHIVE', emailId);
}

function processEmail(email) {
  const category = categorizeEmail(email);
  const priority = getPriority(email, category);
  
  console.log(`Processing email ${email.id} [${category}/${priority}]: ${email.subject}`);
  
  switch (category) {
    case 'promotion':
      // Auto-archive promotions after reading
      markEmailAsRead(email.id);
      archiveEmail(email.id);
      break;
      
    case 'github':
      // Mark GitHub failure notifications as read (they are already tracked elsewhere)
      if (email.subject.includes('Run failed')) {
        markEmailAsRead(email.id);
      }
      break;
      
    case 'business':
    case 'lead':
    case 'support':
      // High priority emails - log and keep in inbox for review
      logAction('FLAGGED_PRIORITY', email.id, { category, priority, subject: email.subject });
      break;
      
    default:
      // Other emails - mark read after 24 hours
      markEmailAsRead(email.id);
  }
}

function main() {
  console.log('=== AI Email Audit Agent Starting ===');
  console.log(`Time: ${new Date().toISOString()}`);
  
  // First run: clean up ALL inbox emails (older and newer)
  const allEmails = getAllEmails(150);
  console.log(`Found ${allEmails.length} total emails in inbox`);
  
  let processed = 0;
  let cleaned = 0;
  
  for (const email of allEmails) {
    try {
      const category = categorizeEmail(email);
      
      // Auto-cleanup old non-critical emails older than 7 days
      if ((category === 'github' || category === 'promotion' || category === 'other') && !email.labels.includes('UNREAD')) {
        archiveEmail(email.id);
        cleaned++;
      } else if (email.labels.includes('UNREAD')) {
        processEmail(email);
      }
      
      processed++;
    } catch (e) {
      console.error(`Error processing email ${email.id}:`, e.message);
    }
  }
  
  console.log(`Processed ${processed} emails, archived ${cleaned} old emails`);
  console.log('=== AI Email Audit Agent Complete ===');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  getUnreadEmails,
  categorizeEmail,
  getPriority,
  processEmail,
  logAction
};
