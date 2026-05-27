#!/usr/bin/env python3
"""
Contextual Memory Bank V23 — Cross-thread memory persistence
Stores and retrieves past conversations per sender/company/thread.
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path(__file__).resolve().parent.parent.parent

class ContextualMemoryBankV23:
    """Remember context across threads for continuity."""

    def __init__(self):
        self.memory_file = WORKSPACE / 'zion.app' / 'data' / 'contextual_memory_v23.json'

    def load(self):
        try:
            return json.loads(self.memory_file.read_text())
        except Exception:
            return {'senders': {}, 'conversations': [], 'entities': {}}

    def save(self, data):
        self.memory_file.write_text(json.dumps(data, indent=2))

    def _extract_domain(self, sender):
        m = re.search(r'<([^>]+)>', sender)
        email = m.group(1) if m else sender
        return email.split('@')[-1] if '@' in email else 'unknown'

    def _extract_name(self, sender):
        m = re.match(r'"([^"]+)"', sender)
        if m: return m.group(1).strip()
        m = re.match(r'([^<]+)<', sender)
        if m: return m.group(1).strip()
        return sender.split('@')[0] if '@' in sender else sender[:30]

    def _extract_entities(self, text):
        """Extract key entities from text (dates, numbers, services, names)"""
        entities = []
        # Dates
        for m in re.finditer(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', text):
            entities.append({'type': 'date', 'value': m.group(0)})
        # Monetary values
        for m in re.finditer(r'[R$US$€£]\s*\d+(?:[.,]\d+)?', text):
            entities.append({'type': 'amount', 'value': m.group(0)})
        # Service names (capitalized multi-word)
        for m in re.finditer(r'(?:AI|IT|Cloud|Security|Data|Automation)\s+\w+(?:\s+\w+){0,3}', text):
            entities.append({'type': 'service', 'value': m.group(0)})
        return entities

    def store_memory(self, thread_id, sender, subject, snippet, response=None, intent=None):
        """Store a conversation memory entry"""

    def store(self, thread_id, sender, subject, snippet, response=None, intent=None):
        """V24-compatible alias for store_memory"""
        return self.store_memory(thread_id, sender, subject, snippet, response=response, intent=intent)
        data = self.load()
        domain = self._extract_domain(sender)
        name = self._extract_name(sender)

        if domain not in data['senders']:
            data['senders'][domain] = {
                'name': name,
                'threads': [],
                'known_entities': [],
                'preferences': {},
                'total_interactions': 0,
                'first_contact': datetime.now(timezone.utc).isoformat(),
                'last_contact': datetime.now(timezone.utc).isoformat(),
                'summary': '',
            }

        sender_data = data['senders'][domain]
        sender_data['last_contact'] = datetime.now(timezone.utc).isoformat()
        sender_data['total_interactions'] += 1

        if thread_id not in sender_data['threads']:
            sender_data['threads'].append(thread_id)

        # Extract and store entities
        entities = self._extract_entities(f"{subject} {snippet}")
        for ent in entities:
            if ent not in sender_data['known_entities']:
                sender_data['known_entities'].append(ent)
        if len(sender_data['known_entities']) > 50:
            sender_data['known_entities'] = sender_data['known_entities'][-50:]

        # Store the conversation entry
        entry = {
            'thread_id': thread_id,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'subject': subject,
            'snippet': snippet[:300],
            'intent': intent or 'unknown',
            'entities': entities,
        }
        if response:
            entry['response_snippet'] = response[:200]

        data['conversations'].append(entry)
        if len(data['conversations']) > 500:
            data['conversations'] = data['conversations'][-500:]

        # Generate automatic summary for frequent senders
        if sender_data['total_interactions'] >= 3:
            related = [c for c in data['conversations']
                      if c.get('thread_id') in sender_data['threads']]
            intents = {}
            for c in related:
                i = c.get('intent', 'unknown')
                intents[i] = intents.get(i, 0) + 1
            top_intent = max(intents, key=intents.get) if intents else 'unknown'
            sender_data['summary'] = (
                f"{sender_data['total_interactions']} interactions | "
                f"Main intent: {top_intent} | "
                f"Last: {subject[:50]}"
            )

        self.save(data)
        return {'domain': domain, 'entry_count': len(data['conversations'])}

    def get_sender_context(self, sender):
        """Get all context for a sender"""
        data = self.load()
        domain = self._extract_domain(sender)
        return data['senders'].get(domain, {})

    def get_recent_conversations(self, sender, limit=5):
        """Get recent conversations with this sender"""
        data = self.load()
        domain = self._extract_domain(sender)
        if domain not in data['senders']:
            return []
        threads = data['senders'][domain].get('threads', [])
        relevant = [c for c in data['conversations'] if c.get('thread_id') in threads]
        return relevant[-limit:]

    def get_sender_entities(self, sender):
        """Get known entities for this sender"""
        context = self.get_sender_context(sender)
        return context.get('known_entities', [])

    def find_related_threads(self, domain, max_age_days=30):
        """Find threads from same domain within time window"""
        data = self.load()
        return [c for c in data['conversations']
                if self._extract_domain(c.get('thread_id', '')) == domain or
                any(t.startswith(domain) for t in [c.get('thread_id', '')])]

    def get_summary_for_display(self, sender):
        """Get human-readable summary of sender context"""
        context = self.get_sender_context(sender)
        if not context:
            return "New contact - no prior context"

        lines = [
            f"🤝 {context.get('name', 'Unknown')} - {context.get('total_interactions', 0)} interactions",
        ]
        if context.get('known_entities'):
            dates = [e['value'] for e in context['known_entities'] if e['type'] == 'date']
            amounts = [e['value'] for e in context['known_entities'] if e['type'] == 'amount']
            if dates: lines.append(f"📅 Mentioned dates: {', '.join(dates[:3])}")
            if amounts: lines.append(f"💰 Amounts: {', '.join(amounts[:3])}")

        recent = self.get_recent_conversations(sender, 2)
        if recent:
            lines.append("📋 Recent subjects:")
            for c in recent:
                lines.append(f"   • {c.get('subject', 'no subject')[:60]}")

        return '\n'.join(lines)


    def recall(self, thread_id='', sender='', subject='', snippet='') -> dict:
        """V24-compatible recall: merges sender context + recent threads."""
        ctx = {
            'thread_id': thread_id,
            'participants': [sender] if sender else [],
            'thread_history': [],
            'known_entities': [],
            'subject': subject,
        }
        try:
            sc = self.get_sender_context(sender or '')
            threads = sc.get('threads', [])
            # de-duplicate and ensure thread_id in participants
            parts = set(sc.get('threads', []))
            if thread_id: parts.add(thread_id)
            if sender: parts.add(sender)
            ctx['participants'] = list(parts)
            ctx['known_entities'] = sc.get('known_entities', [])
            ctx['thread_history'] = self.get_recent_conversations(sender or '', limit=5)
        except Exception:
            pass
        return ctx
