#!/usr/bin/env python3
"""
Auto Categorizer V23 — Categorizes emails and auto-archives noise
Reduces inbox clutter by detecting newsletters, notifications, spam.
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path(__file__).resolve().parent.parent.parent

class AutoCategorizerV23:
    """Categorize incoming emails by type and decide action."""

    NOISE_PATTERNS = {
        'newsletter': [
            r'unsubscribe|mailing list|newsletter|weekly digest|monthly update',
            r'you\'re receiving this because you subscribed',
            r'view this email in your browser',
            r'to ensure delivery|add us to your address book',
            r'forwarded to you by .+ from .+ substack',
        ],
        'notification': [
            r'noreply@|no-reply@|notifications@|alert@',
            r'you have a new notification',
            r'github.*notification|gitlab.*notification',
            r'build #\d+|deploy|ci failed|pipeline.*failed',
            r'your (?:account|subscription|order|invoice)',
            r'(?:password|login|sign-in|sign in) (?:reset|changed|attempt)',
        ],
        'auto_reply': [
            r'out of office|auto-reply|automatic reply|away from my desk',
            r'vacation responder|returning on',
            r'i am (?:out of office|currently away)',
            r'this is an automated message',
        ],
        'spam_likely': [
            r'congratulations!|you(\'ve| have) won|claim your prize',
            r'click here to claim|limited time offer|act now!',
            r'crypto|bitcoin|investment opportunity',
            r'earn money from home|work from home',
            r'dear (?:sir|madam|valued customer|account holder)',
            r'urgent.*bank.*account|account.*suspended',
        ],
        'internal': [
            r'@ziontechgroup\.com',
            r'@zionsupport\.github\.io',
        ],
        'billing': [
            r'invoice|payment|receipt|billing|charge|cobrança|fatura',
            r'paid|payment confirmed|payment failed',
            r'credit card|debit card|faturamento',
        ],
    }

    # Auto-archive categories (don't need response)
    AUTO_ARCHIVE = ['newsletter', 'notification', 'auto_reply', 'spam_likely']

    def __init__(self):
        self.stats_file = WORKSPACE / 'zion.app' / 'data' / 'categorizer_stats_v23.json'

    def load_stats(self):
        try:
            return json.loads(self.stats_file.read_text())
        except Exception:
            return {'processed': 0, 'categories': {}, 'auto_archived': 0}

    def save_stats(self, stats):
        self.stats_file.write_text(json.dumps(stats, indent=2))

    def categorize(self, email_data):
        """Categorize an email. Returns category dict with action recommendation."""
        sender = email_data.get('sender', '')
        subject = email_data.get('subject', '')
        snippet = email_data.get('snippet', '')
        text = f"{sender} {subject} {snippet}".lower()

        scores = {}
        for category, patterns in self.NOISE_PATTERNS.items():
            score = 0
            matches = []
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    score += 1
                    matches.append(pattern[:30])
            if score > 0:
                scores[category] = {'score': score, 'matches': matches}

        if not scores:
            return {
                'category': 'inbox',
                'scores': {},
                'auto_archive': False,
                'needs_response': True,
                'priority': 'normal',
            }

        best_category = max(scores, key=lambda c: scores[c]['score'])
        best_score = scores[best_category]

        auto_archive = best_category in self.AUTO_ARCHIVE
        needs_response = best_category not in ['spam_likely', 'auto_reply']

        priority = 'low'
        if best_category == 'billing':
            priority = 'high'
        elif best_category == 'internal':
            priority = 'normal'

        # Update stats
        stats = self.load_stats()
        stats['processed'] += 1
        for cat in scores:
            stats['categories'][cat] = stats['categories'].get(cat, 0) + 1
        if auto_archive:
            stats['auto_archived'] += 1
        self.save_stats(stats)

        return {
            'category': best_category,
            'scores': {k: v['score'] for k, v in scores.items()},
            'auto_archive': auto_archive,
            'needs_response': needs_response,
            'priority': priority,
            'label_to_add': best_category if auto_archive else None,
        }

    def should_auto_archive(self, category):
        """Decide if we should auto-archive based on category."""
        return category in self.AUTO_ARCHIVE

    def get_stats_summary(self):
        """Get human-readable categorization stats."""
        stats = self.load_stats()
        lines = [
            f"📬 Total processed: {stats['processed']}",
            f"🗑️ Auto-archived: {stats['auto_archived']}",
        ]
        for cat, count in sorted(stats['categories'].items(), key=lambda x: -x[1]):
            lines.append(f"  • {cat}: {count}")
        return '\n'.join(lines)