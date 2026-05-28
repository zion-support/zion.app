# ZION TECH GROUP - NEW AI AGENT PROMPTS (v5 EMAIL INTELLIGENCE)
# Kleber Garcia Alcatrão | kleber@ziontechgroup.com | +1 302 464 0950

## ═══════════════════════════════════════════════════════════
## NEW AGENT PROMPTS - v5 EMAIL INTELLIGENCE SYSTEM
## ═══════════════════════════════════════════════════════════

---

## AGENT: Thread Context Awareness

**Purpose:** Remember conversation history to provide continuity across multiple emails from the same sender.

**Implementation:**
```javascript
// Load previous thread data
const threads = loadJSON('automation/logs/email-threads.json', {});

// Check for existing conversation
const key = senderEmail.toLowerCase();
const thread = threads[key];
const hasHistory = thread && (Date.now() - new Date(thread.lastDate).getTime()) < 7 * 24 * 60 * 60 * 1000;

// If has history, reference it in response
if (hasHistory) {
  response += '\n\n[Continuing our conversation - Message #' + (thread.count + 1) + ']';
}

// Update thread after response
updateThread(senderEmail, subject, type, response);
```

**Files:** `automation/logs/email-threads.json`

**Benefit:** Sender feels heard, context is preserved, no repeated explanations needed.

---

## AGENT: VIP Sender Recognition

**Purpose:** Instantly identify high-value contacts and escalate automatically.

**Implementation:**
```javascript
// VIP patterns to check
const VIP_PATTERNS = [
  { email: 'enterprise@', name: 'Enterprise Client', priority: 'critical', autoEscalate: true },
  { email: 'partner@', name: 'Partner', priority: 'high', autoEscalate: true },
  { email: 'ceo@', name: 'Executive', priority: 'high', autoEscalate: true },
  { email: 'procurement@', name: 'Procurement', priority: 'high', autoEscalate: false }
];

// Check if sender is VIP
function isVIP(senderEmail) {
  return VIP_PATTERNS.find(v => senderEmail.toLowerCase().includes(v.email));
}

// If VIP, escalate immediately
if (vip) logEscalation(senderEmail, 'VIP: ' + vip.name, ai);
```

**Benefit:** Enterprise clients get white-glove treatment. No lost big deals.

---

## AGENT: Smart Attachment Detection

**Purpose:** Detect when sender mentions an attachment but it wasn't included.

**Implementation:**
```javascript
function detectMissingAttachment(subject, body) {
  const text = subject + ' ' + body;
  
  // Check for attachment mentions
  const mentionsAttach = /attach(ed|ment)?|see (the )?file|as (shown|mentioned)/i.test(text);
  const hasFileName = /\w+\.(pdf|docx?|xlsx?|csv|png|jpg|log)/i.test(text);
  
  // If mentioned attachment but no file found
  if (mentionsAttach && !hasFileName) {
    return 'We noticed you mentioned an attachment but it may not have been included. Please resend if needed.';
  }
  return null;
}

// Add to response if needed
const attachAlert = detectMissingAttachment(subject, body);
if (attachAlert) response += '\n\n' + attachAlert;
```

**Benefit:** Prevents "did you get my attachment?" follow-up emails.

---

## AGENT: Response Quality Scoring

**Purpose:** AI self-check before sending - ensure every response meets standards.

**Scoring Criteria:**
- Length check: Too short (<50 chars) = -30 points
- Personalization: No name detected = -15 points
- Contact info: Missing phone = -10 points
- Urgent handling: Urgent without phone = -25 points
- Attachment check: Mentioned but not addressed = -20 points

```javascript
function scoreResponse(response, emailData) {
  let score = 100;
  const issues = [];
  
  if (response.length < 50) { score -= 30; issues.push('Too short'); }
  if (response.indexOf(emailData.name) === -1) { score -= 15; issues.push('No personalization'); }
  if (response.indexOf(CONTACT.phone) === -1) { score -= 10; issues.push('Missing phone'); }
  // ... more checks
  
  return { score: Math.max(0, score), issues };
}
```

**Benefit:** Every response is professional, complete, and effective.

---

## AGENT: Intent Prediction

**Purpose:** Predict what sender needs before they explicitly ask.

**Prediction Patterns:**
```javascript
// Follow-up detection
if (threadContext.hasHistory) predictions.push({ intent: 'follow_up', confidence: 85 });

// Purchase intent
if (/demo|trial|buy|purchase|pricing|quote/i.test(text)) {
  predictions.push({ intent: 'purchase', confidence: 80 });
}

// Escalation detection (frustrated customer)
if (/still|not working|waiting|since|days ago/i.test(text)) {
  predictions.push({ intent: 'escalation', confidence: 90 });
}

// Partnership interest
if (/joint|partner|integration|custom/i.test(text)) {
  predictions.push({ intent: 'partnership', confidence: 75 });
}
```

**Actions based on predictions:**
- `follow_up`: Reference previous conversation
- `purchase`: Include pricing and demo links
- `escalation`: Flag for priority support
- `partnership`: Forward to partnership team

---

## AGENT: Email-to-Ticket Conversion

**Purpose:** Create structured support tickets from complex issues.

**Implementation:**
```javascript
function createSupportTicket(emailData, aiResult) {
  const ticket = {
    id: 'TKT-' + Date.now().toString(36).toUpperCase(),
    created: new Date().toISOString(),
    status: 'open',
    priority: emailData.type === 'urgent' ? 'high' : 'medium',
    email: { from: emailData.email, subject: emailData.subject, body: emailData.body },
    ai: { sentiment: aiResult.sentiment, urgency: aiResult.urgency },
    dueDate: calculateDueDate()
  };
  
  // Auto-set high priority for critical issues
  if (aiResult.urgencyScore >= 8) ticket.priority = 'critical';
  
  return ticket;
}
```

**Benefit:** No urgent issues fall through the cracks. Full audit trail.

---

## AGENT: Optimal Send Time

**Purpose:** Send emails when recipients are most likely to read them.

**Implementation:**
```javascript
function getOptimalSendTime(recipientEmail, language) {
  const schedule = loadJSON('automation/logs/optimal-schedule.json');
  
  // Best times by language/region
  const bestTimes = {
    en: ['09:00', '14:00', '16:00'],
    es: ['10:00', '15:00'],
    pt: ['09:30', '14:30']
  };
  
  const now = new Date();
  const currentHour = now.getHours();
  
  // Check if current time is in optimal window
  const langTimes = bestTimes[language] || bestTimes.en;
  return { sendNow: langTimes.some(t => parseInt(t) === currentHour) };
}
```

**Benefit:** Higher open rates, better engagement.

---

## ═══════════════════════════════════════════════════════════
## COMPLETE FILE STRUCTURE - v5 EMAIL SYSTEM
## ═══════════════════════════════════════════════════════════

```
automation/
  email-responder-v5.cjs       # Main v5 responder (32KB)
  email-responder-v4.cjs       # v4 backup
  email-responder-enhancer-v2.cjs  # Learning system
  email-responder-v5-cron.sh    # Cron wrapper
  logs/
    email-responder-state-v5.json   # Processing state
    email-responder-state-v4.json    # v4 state backup
    email-responder-improvements-v2.json  # Learning log
    email-responder-v5.log          # v5 activity log
    email-responder-v4.log          # v4 activity log
    email-threads.json              # Thread history
    vip-senders.json                # VIP contact list
    support-tickets.json             # Support tickets
    sender-profiles.json            # Contact profiles
    email-tasks.json                # Extracted tasks
    escalations.json                # Escalation log
    response-tracking.json          # Response history
    optimal-schedule.json           # Send time optimization
```

---

## CRON SETUP

```bash
# Every 5 minutes
*/5 * * * * /Users/miami2/zion.app/automation/email-responder-v5-cron.sh >> /Users/miami2/zion.app/automation/logs/cron-v5.log 2>&1

# After every 6 cycles (~30 min), enhancer runs
# After every 12 cycles (~60 min), full analytics
```

---

## ENVIRONMENT VARIABLES

```bash
# Email
export ZION_EMAIL_ADDRESS="your-email@gmail.com"
export ZION_EMAIL_PASSWORD="xxxx xxxx xxxx xxxx"
export ZION_SMTP_HOST="smtp.gmail.com"
export ZION_SMTP_PORT="587"
export ZION_IMAP_HOST="imap.gmail.com"
export ZION_IMAP_PORT="993"

# AI
export GOOGLE_API_KEY="your-gemini-api-key"
# or
export GEMINI_API_KEY="your-gemini-api-key"
```

---

## NEW IDEAS FOR FUTURE AGENTS

### 1. Email Thread Summarization Agent
**Purpose:** Generate concise summaries of long email threads for quick review.

**Implementation:**
- Extract all messages in thread
- Identify key points, decisions, action items
- Generate 3-sentence summary
- Store in thread log

### 2. Auto-CRM Sync Agent
**Purpose:** Sync every email interaction to CRM automatically.

**Integration targets:**
- HubSpot
- Salesforce  
- Pipedrive

**What to sync:**
- New contacts
- Email interactions
- Lead status changes
- Task completions

### 3. Voice-to-Email Bridge Agent
**Purpose:** Convert Telegram voice messages into formatted emails.

**Implementation:**
- Receive voice from Telegram
- Transcribe using Whisper API
- Format as email with action items
- Send via SMTP

### 4. Predictive Lead Scoring Agent
**Purpose:** Score leads based on email engagement patterns.

**Scoring factors:**
- Email open rate
- Response rate
- Type of emails (sales vs support)
- Urgency patterns
- VIP status

### 5. Smart Follow-up Agent
**Purpose:** Automatically send follow-ups at optimal times.

**Triggers:**
- No response after 48 hours
- Specific keywords (interested, quote, demo)
- Follow-up reminder for tasks

---

## SUCCESS METRICS - v5

1. ✅ Thread context: All repeat senders recognized
2. ✅ VIP detection: Enterprise clients auto-escalated
3. ✅ Quality score: All responses score 80+
4. ✅ Intent prediction: 75%+ accuracy
5. ✅ Ticket creation: All urgent issues ticketed
6. ✅ Missing attachments: Caught and alerted
7. ✅ Optimal timing: Send during business hours

---

## CONTACT

**Zion Tech Group**
- Phone: +1 302 464 0950
- Email: kleber@ziontechgroup.com
- Address: 364 E Main St STE 1008 Middletown DE 19709
- Website: https://ziontechgroup.com