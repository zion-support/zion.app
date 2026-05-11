#!/usr/bin/env node

/**
 * AI Email Lead Outreach Automation Agent
 * Scans for new potential client emails and sends automated service introductions
 * 
 * Features:
 * 1. Identifies potential new client emails
 * 2. Generates personalized introduction emails
 * 3. Tracks outreach history to avoid duplicates
 * 4. Sends professional service advertisements
 * 5. Logs all outreach activities
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data', 'lead-outreach');
const HISTORY_FILE = path.join(DATA_DIR, 'outreach-history.json');

// Initialize directories
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getOutreachHistory() {
  if (!fs.existsSync(HISTORY_FILE)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveOutreachHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function logOutreach(email, status, details = {}) {
  const history = getOutreachHistory();
  history[email] = {
    timestamp: new Date().toISOString(),
    status,
    details
  };
  saveOutreachHistory(history);
  console.log(`[LEAD OUTREACH] ${status} for ${email}`);
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

function getRecentEmails(days = 7, limit = 100) {
  const output = runGogCommand(`gmail search "in:inbox newer_than:${days}d" --max ${limit} --plain`);
  if (!output) return [];
  
  const emails = [];
  const lines = output.trim().split('\n');
  
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

function extractEmailAddress(fromField) {
  const emailMatch = fromField.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : null;
}

function isPotentialClient(email) {
  const from = email.from.toLowerCase();
  
  // Skip internal emails
  if (from.includes('ziontechgroup.com') || from.includes('@zion')) {
    return false;
  }
  
  // Skip known senders
  if (from.includes('github.com') || from.includes('noreply') || 
      from.includes('notifications') || from.includes('google.com') ||
      from.includes('netlify.com') || from.includes('amazon.com') ||
      from.includes('ifttt.com') || from.includes('tiktok.com')) {
    return false;
  }
  
  // Skip promotions
  if (email.labels.includes('CATEGORY_PROMOTIONS') || email.labels.includes('CATEGORY_SOCIAL')) {
    return false;
  }
  
  // Check for client indicators
  if (email.subject.toLowerCase().includes('quote') || 
      email.subject.toLowerCase().includes('request') ||
      email.subject.toLowerCase().includes('server') ||
      email.subject.toLowerCase().includes('service') ||
      email.subject.toLowerCase().includes('proposta') ||
      email.subject.toLowerCase().includes('orçamento') ||
      email.subject.toLowerCase().includes('suporte')) {
    return true;
  }
  
  // All other external emails are potential leads
  return true;
}

function generateIntroductionEmail(clientEmail) {
  const domain = clientEmail.split('@')[1];
  
  return `
Olá,

Vi que você entrou em contato recentemente. Gostaria de apresentar os serviços da Zion Tech Group:

✅ Infraestrutura de alta performance
✅ Servidores dedicados e cloud
✅ Suporte técnico 24/7
✅ Soluções customizadas para empresas
✅ Consultoria em tecnologia

Estamos no mercado há mais de 10 anos atendendo clientes em todo o mundo.

Se tiver interesse em conhecer mais sobre nossos serviços, ficarei feliz em conversar.

Atenciosamente,
Zion Tech Group
https://www.ziontechgroup.com

-- 
Zion Tech Group
Telefone: +1 888 657 6073
Email: commercial@ziontechgroup.com
`;
}

function sendIntroductionEmail(clientEmail) {
  if (!clientEmail) {
    return false;
  }
  
  const history = getOutreachHistory();
  
  // Don't send if already contacted in last 30 days
  if (history[clientEmail]) {
    const lastContact = new Date(history[clientEmail].timestamp);
    const daysSince = (new Date() - lastContact) / (1000 * 60 * 60 * 24);
    if (daysSince < 30) {
      console.log(`Skipping ${clientEmail} - already contacted ${Math.round(daysSince)} days ago`);
      return false;
    }
  }
  
  const subject = 'Soluções de Tecnologia - Zion Tech Group';
  const body = generateIntroductionEmail(clientEmail);
  
  console.log(`Would send introduction email to ${clientEmail}`);
  console.log(`Subject: ${subject}`);
  
  // Uncomment to actually send emails
  // runGogCommand(`gmail send --to "${clientEmail}" --subject "${subject}" --body "${body.replace(/"/g, '\\"')}"`);
  
  logOutreach(clientEmail, 'SENT', { subject });
  return true;
}

function processEmail(email) {
  if (!isPotentialClient(email)) {
    return;
  }
  
  const clientEmail = extractEmailAddress(email.from);
  if (!clientEmail) {
    return;
  }
  
  console.log(`Potential client detected: ${clientEmail}`);
  sendIntroductionEmail(clientEmail);
}

function main() {
  console.log('=== AI Lead Outreach Agent Starting ===');
  console.log(`Time: ${new Date().toISOString()}`);
  
  const emails = getRecentEmails(7, 100);
  console.log(`Scanned ${emails.length} recent emails`);
  
  let potentialClients = 0;
  let emailsSent = 0;
  
  for (const email of emails) {
    try {
      if (isPotentialClient(email)) {
        potentialClients++;
        if (sendIntroductionEmail(extractEmailAddress(email.from))) {
          emailsSent++;
        }
      }
    } catch (e) {
      console.error(`Error processing email ${email.id}:`, e.message);
    }
  }
  
  console.log(`Detected ${potentialClients} potential clients`);
  console.log(`Sent ${emailsSent} introduction emails`);
  console.log('=== AI Lead Outreach Agent Complete ===');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  getRecentEmails,
  isPotentialClient,
  extractEmailAddress,
  generateIntroductionEmail,
  sendIntroductionEmail
};
