#!/usr/bin/env python3
"""
Zion Email Intelligence System v1.0
Reads emails via himalaya, classifies them, and drafts responses.
Requires: himalaya CLI configured with kleber@ziontechgroup.com
Output: JSON with classified emails + draft responses for review
"""
import subprocess
import json
import sys
import os
from datetime import datetime

HIMALAYA = "himalaya"
OUTPUT_DIR = os.path.expanduser("~/.hermes/email-drafts")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    return r.stdout.strip(), r.returncode

def get_unread_emails(limit=20):
    """Fetch unread emails from inbox"""
    out, rc = run(f"{HIMALAYA} envelope list --output json --page-size {limit}")
    if rc != 0:
        print(f"⚠️ himalaya error: {out[:200]}", file=sys.stderr)
        return []
    try:
        emails = json.loads(out)
        return emails if isinstance(emails, list) else [emails] if isinstance(emails, dict) else []
    except json.JSONDecodeError:
        print(f"⚠️ Could not parse email list", file=sys.stderr)
        return []

class EmailClassifier:
    """Classify emails by intent and priority"""
    
    CATEGORIES = {
        'sales_inquiry': ['pricing', 'quote', 'proposal', 'interested in', 'how much', 'cost of', 'buy', 'purchase', 'demo'],
        'support_request': ['help', 'issue', 'problem', 'broken', 'error', 'bug', 'not working', 'support'],
        'partnership': ['partner', 'collaboration', 'joint venture', 'reseller', 'affiliate', 'integration'],
        'meeting_request': ['meet', 'call', 'schedule', 'calendar', 'zoom', 'teams', 'available'],
        'job_inquiry': ['hiring', 'job', 'career', 'position', 'recruit', 'resume', 'cv', 'apply'],
        'spam': ['unsubscribe', 'promotional', 'marketing', 'discount', 'free trial', 'limited time'],
        'billing': ['invoice', 'payment', 'billing', 'refund', 'charge', 'subscription'],
        'media': ['press', 'media', 'interview', 'article', 'blog', 'news'],
    }
    
    PRIORITY_KEYWORDS = {
        'urgent': ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'today', 'deadline'],
        'high': ['important', 'priority', 'ceo', 'director', 'vp', 'contract', 'signed', 'approved'],
        'low': ['newsletter', 'digest', 'weekly', 'monthly', 'update', 'fyi', 'for your information'],
    }
    
    @classmethod
    def classify(cls, subject, body, sender):
        text = f"{subject} {body} {sender}".lower()
        
        # Classify category
        category = 'general'
        max_score = 0
        for cat, keywords in cls.CATEGORIES.items():
            score = sum(1 for kw in keywords if kw in text)
            if score > max_score:
                max_score = score
                category = cat
        
        # Classify priority
        priority = 'medium'
        for p, keywords in cls.PRIORITY_KEYWORDS.items():
            if any(kw in text for kw in keywords):
                priority = p
                break
        
        # Determine action
        action = cls.determine_action(category, priority, text)
        
        return {
            'category': category,
            'priority': priority,
            'action': action,
            'confidence': 'high' if max_score >= 2 else 'medium' if max_score == 1 else 'low'
        }
    
    @classmethod
    def determine_action(cls, category, priority, text):
        actions = {
            'sales_inquiry': 'reply_with_pricing_info',
            'support_request': 'reply_with_solution',
            'partnership': 'reply_with_partnership_info',
            'meeting_request': 'reply_with_calendar',
            'job_inquiry': 'reply_with_hiring_info',
            'billing': 'reply_with_billing_info',
            'media': 'reply_with_media_kit',
            'spam': 'archive',
            'general': 'reply_general',
        }
        return actions.get(category, 'reply_general')

def draft_response(email, classification):
    """Generate a draft response based on classification"""
    subject = email.get('subject', '')
    sender_name = email.get('from', {}).get('name', email.get('from', {}).get('email', 'there'))
    sender_name = sender_name.split('<')[0].strip() or 'there'
    cat = classification['category']
    
    drafts = {
        'sales_inquiry': {
            'subject': f"Re: {subject}",
            'body': f"""Hi {sender_name},

Thank you for your interest in Zion Tech Group's services!

Based on your inquiry, I'd love to learn more about your specific needs so I can recommend the right solution. We specialize in:

• AI & Machine Learning Solutions
• Cloud Infrastructure & Security  
• Micro-SaaS Products
• Data Analytics & Business Intelligence
• IT Consulting & Managed Services

Could we schedule a brief call this week? You can book directly at: https://ziontechgroup.com/#contact

Or simply reply with your availability.

Best regards,
Kleber Garcia Alcatrão
CEO, Zion Tech Group
📧 kleber@ziontechgroup.com | 📞 +1 302 464 0950
364 E Main St STE 1008, Middletown DE 19709
https://ziontechgroup.com""",
            'action': '📝 Draft ready for review'
        },
        'support_request': {
            'subject': f"Re: {subject}",
            'body': f"""Hi {sender_name},

Thank you for reaching out. I'm sorry to hear you're experiencing an issue.

I've flagged this for our support team and we'll investigate immediately. To help us resolve this faster, could you please provide:

1. Steps to reproduce the issue
2. Screenshots or error messages
3. When the issue started

We typically respond to support requests within 2 hours during business hours.

Best regards,
Kleber Garcia Alcatrão
CEO, Zion Tech Group
📧 kleber@ziontechgroup.com | 📞 +1 302 464 0950""",
            'action': '📝 Draft ready for review'
        },
        'partnership': {
            'subject': f"Re: {subject}",
            'body': f"""Hi {sender_name},

Thank you for your interest in partnering with Zion Tech Group!

We're always open to strategic partnerships that create mutual value. We currently offer:

• Technology Partnerships (API integrations, co-development)
• Reseller Programs
• Joint Go-to-Market Initiatives
• White-label Solutions

I'd love to discuss how we could work together. Would you be available for a 30-minute call this week?

Best regards,
Kleber Garcia Alcatrão
CEO, Zion Tech Group
📧 kleber@ziontechgroup.com | 📞 +1 302 464 0950
364 E Main St STE 1008, Middletown DE 19709""",
            'action': '📝 Draft ready for review'
        },
        'meeting_request': {
            'subject': f"Re: {subject}",
            'body': f"""Hi {sender_name},

Thank you for your meeting request!

I'd be happy to connect. You can check my availability and book a time that works for you at: https://ziontechgroup.com/#contact

Alternatively, reply with your preferred date/time and I'll confirm.

Looking forward to our conversation!

Best regards,
Kleber Garcia Alcatrão
CEO, Zion Tech Group
📧 kleber@ziontechgroup.com | 📞 +1 302 464 0950""",
            'action': '📝 Draft ready for review'
        },
        'job_inquiry': {
            'subject': f"Re: {subject}",
            'body': f"""Hi {sender_name},

Thank you for your interest in joining Zion Tech Group!

We're always looking for talented individuals. Please send your resume and a brief note about the role you're targeting to kleber@ziontechgroup.com with subject "Career Inquiry".

We review all applications within 5 business days.

Best regards,
Kleber Garcia Alcatrão
CEO, Zion Tech Group
📧 kleber@ziontechgroup.com | 📞 +1 302 464 0950""",
            'action': '📝 Draft ready for review'
        },
        'billing': {
            'subject': f"Re: {subject}",
            'body': f"""Hi {sender_name},

Thank you for your billing inquiry. I've forwarded this to our finance team for immediate attention.

For urgent billing matters, please call us directly at +1 302 464 0950.

Best regards,
Kleber Garcia Alcatrão
CEO, Zion Tech Group
📧 kleber@ziontechgroup.com | 📞 +1 302 464 0950""",
            'action': '📝 Draft ready for review'
        },
        'general': {
            'subject': f"Re: {subject}",
            'body': f"""Hi {sender_name},

Thank you for reaching out to Zion Tech Group.

I received your message and will get back to you personally within 24 hours. For immediate assistance with our services, please visit https://ziontechgroup.com or call +1 302 464 0950.

Best regards,
Kleber Garcia Alcatrão
CEO, Zion Tech Group
📧 kleber@ziontechgroup.com | 📞 +1 302 464 0950
364 E Main St STE 1008, Middletown DE 19709""",
            'action': '📝 Draft ready for review'
        },
    }
    
    return drafts.get(cat, drafts['general'])

def main():
    print("🔍 Zion Email Intelligence System v1.0")
    print("=" * 50)
    
    emails = get_unread_emails(limit=20)
    
    if not emails:
        print("📭 No unread emails found, or himalaya not configured.")
        print("\nTo configure himalaya:")
        print("  1. Install: curl -sSL https://raw.githubusercontent.com/pimalaya/himalaya/master/install.sh | PREFIX=~/.local sh")
        print("  2. Configure: himalaya account configure")
        print("  3. Enter kleber@ziontechgroup.com IMAP/SMTP credentials")
        
        # Demo mode with sample emails
        print("\n🧪 DEMO MODE — Showing system capabilities:\n")
        sample_emails = [
            {'subject': 'Pricing for AI services', 'body': 'Hi, I need pricing for machine learning solutions for my company. We have 50 employees.', 'from': {'name': 'John Smith', 'email': 'john@company.com'}},
            {'subject': 'Partnership opportunity', 'body': 'We are interested in partnering with Zion Tech Group for reseller opportunities.', 'from': {'name': 'Sarah Johnson', 'email': 'sarah@partner.com'}},
            {'subject': 'Urgent: System error', 'body': 'Critical issue with our production system. Need help ASAP.', 'from': {'name': 'Mike Chen', 'email': 'mike@startup.com'}},
        ]
        results = []
        for email in sample_emails:
            classification = EmailClassifier.classify(email['subject'], email['body'], email['from']['email'])
            draft = draft_response(email, classification)
            result = {
                'from': email['from']['name'],
                'subject': email['subject'],
                'classification': classification,
                'draft': draft
            }
            results.append(result)
            print(f"📧 From: {email['from']['name']} | Subject: {email['subject']}")
            print(f"   Category: {classification['category']} | Priority: {classification['priority']}")
            print(f"   Confidence: {classification['confidence']} | Action: {draft['action']}")
            print(f"   Draft: {draft['subject']}")
            print(f"   --- {draft['body'][:100]}...")
            print()
        
        # Save demo results
        demo_file = f"{OUTPUT_DIR}/demo-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        with open(demo_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"💾 Demo results saved to: {demo_file}")
        return
    
    # Real email processing
    results = []
    for email in emails[:20]:
        subject = email.get('subject', '')
        sender = email.get('from', {})
        sender_email = sender.get('email', sender.get('addr', ''))
        sender_name = sender.get('name', sender_email)
        body_preview = email.get('preview', email.get('body', ''))[:500]
        
        classification = EmailClassifier.classify(subject, body_preview, sender_email)
        draft = draft_response({'subject': subject, 'from': {'name': sender_name, 'email': sender_email}}, classification)
        
        result = {
            'id': email.get('id'),
            'from': sender_name,
            'from_email': sender_email,
            'subject': subject,
            'date': email.get('date', ''),
            'classification': classification,
            'draft_subject': draft['subject'],
            'draft_body': draft['body'],
            'action': draft['action'],
            'timestamp': datetime.now().isoformat()
        }
        results.append(result)
    
    # Save results
    output_file = f"{OUTPUT_DIR}/analysis-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n📊 Processed {len(results)} emails")
    print(f"💾 Results saved to: {output_file}\n")
    
    categories = {}
    for r in results:
        cat = r['classification']['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("📈 Classification Summary:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"   {cat}: {count}")
    
    print(f"\n⚠️ IMPORTANT: Drafts are NOT auto-sent. Review and send manually.")
    print(f"   To send a draft: himalaya template send < {output_file}")

if __name__ == "__main__":
    main()
