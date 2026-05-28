#!/usr/bin/env python3
"""
Action Item Extractor V23 — Extracts tasks, dates, commitments from conversations
Auto-detects action items in emails and tracks them.
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path(__file__).resolve().parent.parent.parent

class ActionItemExtractorV23:
    """Extract and track action items from email conversations."""

    # Action-verb patterns for different languages
    ACTION_PATTERNS = {
        'pt': [
            r'(?:preciso|precisamos|need|necessito|necessitamos) (?:de|que|) (.{10,60})',
            r'(?:pode|poderia|poderia me|can you) (.{10,60})',
            r'(?:vou|ir[ei]|will) (.{10,60})',
            r'(?:me envie|send me|me manda|envie[- ]me) (.{10,60})',
            r'(?:confirmar|confirm|agendar|schedule|marcar) (.{10,60})',
            r'(?:verificar|check|review|revisar) (.{10,60})',
            r'(?:atualizar|update|update the) (.{10,60})',
            r'(?:providenciar|arrange|provide|fornecer) (.{10,60})',
        ],
        'en': [
            r'(?:please|kindly) (.{10,60})',
            r'(?:i need|i will|i\'ll|i can) (.{10,60})',
            r'(?:could you|can you|would you) (.{10,60})',
            r'(?:send me|forward|provide) (.{10,60})',
            r'(?:confirm|schedule|arrange|book) (.{10,60})',
            r'(?:check|review|audit|look into) (.{10,60})',
            r'(?:update|upload|submit|send) (.{10,60})',
        ],
    }

    # Date patterns
    DATE_PATTERNS = [
        r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',
        r'(?:next|this|coming|próxima|próximo) (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|segunda|terça|quarta|quinta|sexta|sábado|domingo)',
        r'(?:january|february|march|april|may|june|july|august|september|october|november|december|janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+\d{1,2}(?:st|nd|rd|th|º)?',
        r'(?:hoje|today|amanh[ãa]|tomorrow|this week|esta semana|next week|próxima semana)',
    ]

    def __init__(self):
        self.items_file = WORKSPACE / 'zion.app' / 'data' / 'action_items_v23.json'

    def load(self):
        try:
            return json.loads(self.items_file.read_text())
        except Exception:
            return {'items': [], 'completed': []}

    def save(self, data):
        self.items_file.write_text(json.dumps(data, indent=2))

    def extract(self, subject, snippet, sender=None, thread_id=None):
        """Extract action items from email text."""
        text = f"{subject} {snippet}"
        items = []

        # Try PT patterns first, then EN
        all_patterns = self.ACTION_PATTERNS.get('pt', []) + self.ACTION_PATTERNS.get('en', [])

        for pattern in all_patterns:
            for m in re.finditer(pattern, text, re.IGNORECASE):
                action = m.group(1).strip()
                if len(action) >= 10 and action not in [i['action'] for i in items]:
                    items.append({
                        'action': action,
                        'matched_pattern': m.group(0)[:60],
                        'type': 'todo',
                    })

        # Extract dates mentioned
        dates = []
        for pattern in self.DATE_PATTERNS:
            for m in re.finditer(pattern, text, re.IGNORECASE):
                dates.append(m.group(0))

        # Look for deadlines (specific phrases)
        deadline = None
        dl_patterns = [
            r'(?:até|até dia|until|by|deadline|prazo).{0,30}(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'(?:deadline|prazo).{0,20}(?:é|is).{0,30}(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        ]
        for pattern in dl_patterns:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                deadline = m.group(1).strip()

        if not items:
            return None

        # Store
        data = self.load()
        for item in items:
            entry = {
                'thread_id': thread_id or 'unknown',
                'sender': sender or 'unknown',
                'extracted_at': datetime.now(timezone.utc).isoformat(),
                'action': item['action'],
                'dates': dates,
                'deadline': deadline,
                'type': item['type'],
                'status': 'open',
                'source_subject': subject[:100],
            }
            data['items'].append(entry)
        if len(data['items']) > 100:
            data['items'] = data['items'][-100:]
        self.save(data)

        return {
            'items': items,
            'dates': list(set(dates)),
            'deadline': deadline,
        }

    def mark_completed(self, action_text):
        """Mark an action item as completed."""
        data = self.load()
        for item in data['items']:
            if item['action'] == action_text[:100] or item['action'][:30] == action_text[:30]:
                item['status'] = 'completed'
                item['completed_at'] = datetime.now(timezone.utc).isoformat()
                data['completed'].append(item)
                data['items'].remove(item)
                self.save(data)
                return True
        return False

    def get_open_items(self):
        """Get all open action items."""
        data = self.load()
        return [i for i in data['items'] if i.get('status') == 'open']

    def get_items_summary(self):
        """Get human-readable summary of action items."""
        items = self.get_open_items()
        if not items:
            return "No open action items"

        # Group by sender
        by_sender = {}
        for item in items:
            sender = item.get('sender', 'unknown')[:20]
            if sender not in by_sender:
                by_sender[sender] = []
            by_sender[sender].append(item)

        lines = [f"📋 Open action items: {len(items)}"]
        for sender, items_list in sorted(by_sender.items(), key=lambda x: -len(x[1])):
            lines.append(f"\n  From {sender}:")
            for item in items_list[:3]:
                action = item['action'][:50]
                deadline = f" ⏰ {item['deadline']}" if item.get('deadline') else ''
                lines.append(f"    • {action}{deadline}")
        return '\n'.join(lines)