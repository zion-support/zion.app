const fs = require('fs');
const path = require('path');

// Read existing services
const servicesPath = path.join(__dirname, 'app', 'data', 'servicesData.json');
let services = [];

try {
  if (fs.existsSync(servicesPath)) {
    const data = fs.readFileSync(servicesPath, 'utf8');
    services = JSON.parse(data);
    console.log(`Loaded ${services.length} existing services`);
  }
} catch (error) {
  console.log('No existing services file, starting fresh');
}

// V476-V480 new services
const newServices = [
  {
    id: 'email-thread-summarizer',
    title: 'Email Thread Summarizer Pro',
    description: 'Generate executive summaries of long email threads with key decisions, action items, and timeline. Automatically extract important quotes and commitments from conversations.',
    category: 'Email Intelligence',
    price: 49,
    features: [
      'Thread analysis and summarization',
      'Decision extraction',
      'Action item tracking',
      'Timeline generation',
      'Key quote highlighting',
      'Participant analysis'
    ],
    benefits: [
      'Save hours reading long threads',
      'Never miss important decisions',
      'Track action items automatically',
      'Quick context for new participants'
    ],
    icon: '📋',
    popular: true,
    version: 'V476'
  },
  {
    id: 'email-attachment-intelligence',
    title: 'Email Attachment Intelligence',
    description: 'Scan attachments for malware and sensitive data, extract text from PDFs and documents, auto-categorize files, and get context-based suggestions.',
    category: 'Security & Productivity',
    price: 59,
    features: [
      'Malware scanning and detection',
      'Sensitive data detection (PII, credentials)',
      'Text extraction from documents',
      'Auto-categorization by file type',
      'Security risk assessment',
      'Safe-to-share verification'
    ],
    benefits: [
      'Protect against malware',
      'Prevent data leaks',
      'Quick document preview',
      'Compliance assurance'
    ],
    icon: '📎',
    popular: true,
    version: 'V477'
  },
  {
    id: 'email-followup-automation',
    title: 'Email Follow-up Automation',
    description: 'Track emails that need follow-up, send automatic reminders, generate smart follow-up messages, and analyze follow-up success rates.',
    category: 'Productivity',
    price: 39,
    features: [
      'Follow-up detection and tracking',
      'Automatic reminder scheduling',
      'Smart message generation',
      'Priority-based follow-up timing',
      'Success analytics',
      'Reply-all enforcement'
    ],
    benefits: [
      'Never forget to follow up',
      'Improve response rates',
      'Save time on manual tracking',
      'Professional follow-up messages'
    ],
    icon: '⏰',
    popular: true,
    version: 'V478'
  },
  {
    id: 'email-ab-testing-platform',
    title: 'Email A/B Testing Platform',
    description: 'Test subject lines and email content to optimize performance. Track open rates, click-through rates, and get automatic winner selection with statistical analysis.',
    category: 'Marketing & Analytics',
    price: 69,
    features: [
      'Subject line variant generation',
      'Content variant creation',
      'Performance tracking (open/click/reply rates)',
      'Statistical significance analysis',
      'Automatic winner selection',
      'Improvement recommendations'
    ],
    benefits: [
      'Optimize email performance',
      'Data-driven decisions',
      'Increase engagement rates',
      'Learn what works best'
    ],
    icon: '🧪',
    popular: true,
    version: 'V479'
  },
  {
    id: 'email-knowledge-base-builder',
    title: 'Email Knowledge Base Builder',
    description: 'Extract knowledge from email conversations and build a searchable knowledge base. Auto-learn from patterns and get intelligent suggestions based on past communications.',
    category: 'Knowledge Management',
    price: 79,
    features: [
      'Knowledge extraction from emails',
      'Topic clustering and categorization',
      'Searchable knowledge base',
      'Pattern recognition and learning',
      'Auto-suggestions based on context',
      'Key information extraction (dates, names, URLs)'
    ],
    benefits: [
      'Build organizational knowledge',
      'Quick information retrieval',
      'Learn from past communications',
      'Reduce knowledge silos'
    ],
    icon: '📚',
    popular: true,
    version: 'V480'
  }
];

// Add new services (avoid duplicates)
let addedCount = 0;
newServices.forEach(newService => {
  const exists = services.find(s => s.id === newService.id);
  if (!exists) {
    services.push(newService);
    addedCount++;
    console.log(`✓ Added: ${newService.title}`);
  } else {
    console.log(`- Skipped (already exists): ${newService.title}`);
  }
});

// Write updated services
try {
  fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
  console.log(`\n✅ Successfully added ${addedCount} new services`);
  console.log(`📊 Total services: ${services.length}`);
} catch (error) {
  console.error('Error writing services file:', error.message);
  process.exit(1);
}

console.log('\n🎉 V476-V480 services added successfully!');
