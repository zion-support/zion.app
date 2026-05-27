#!/usr/bin/env python3
"""
Response Outcome Analyzer V22 — Track outcomes and feed back into ML optimizer
Monitors whether our responses led to positive/negative/neutral follow-up,
adjusts template weights accordingly.
"""

import json
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

WORKSPACE = Path(__file__).resolve().parent.parent.parent

class ResponseOutcomeAnalyzerV22:
    """Track sent responses, classify outcomes, and feed ML optimizer."""

    def __init__(self):
        self.outcomes_file = WORKSPACE / 'zion.app' / 'data' / 'response_outcomes_v22.json'
        self.templates_file = WORKSPACE / 'zion.app' / 'data' / 'ml_templates.json'

    def _load(self, path):
        try:
            return json.loads(path.read_text())
        except Exception:
            return {}

    def _save(self, path, data):
        path.write_text(json.dumps(data, indent=2))

    def record_sent(self, thread_id, email_id, template_name, intent, tone, recipients, response_text):
        """Record that a response was sent — to be checked later."""
        data = self._load(self.outcomes_file)
        key = f"{thread_id}:{email_id}"
        data['sent'][key] = {
            'thread_id': thread_id, 'email_id': email_id,
            'template': template_name, 'intent': intent, 'tone': tone,
            'recipients': recipients, 'response_snippet': response_text[:200],
            'sent_at': datetime.now(timezone.utc).isoformat(),
            'outcome': 'pending',
        }
        self._save(self.outcomes_file, data)
        return key

    def classify_outcome(self, thread_id, email_id, new_sender_email, new_snippet):
        """Classify the outcome of a previously-sent response based on the next reply."""
        data = self._load(self.outcomes_file)
        key = f"{thread_id}:{email_id}"
        if key not in data.get('sent', {}):
            return None

        sent_record = data['sent'][key]
        snippet_lower = new_snippet.lower()

        # --- Sentiment / outcome classification ---
        positive_keywords = [
            'thank', 'thanks', 'appreciate', 'great', 'perfect', 'sounds good',
            'confirmed', 'booking confirmed', 'reserva confirmada', 'looking forward',
            'excellent', 'awesome', 'wonderful', 'glad', 'happy', 'pleasure',
            'schedule', 'scheduled', 'booked', 'paid', 'invoice paid',
            'agree', 'agreed', 'let\'s proceed', 'proceed',
        ]
        negative_keywords = [
            'unsubscribe', 'stop', 'don\'t contact', 'do not contact', 'spam',
            'complaint', 'unhappy', 'disappointed', 'angry', 'furious',
            'escalat', 'lawyer', 'legal', 'cease', 'harassment',
            'worst', 'terrible', 'horrible', 'awful', 'refund',
            'cancel', 'canceled', 'cancelled', 'terminate', 'never',
        ]
        intent_keywords_positive = {
            'booking': ['confirm', 'reserva', 'agendar', 'schedule', 'book'],
            'sales': ['quote', 'proposal', 'interes', 'quero', 'want', 'need', 'together'],
            'support': ['fixed', 'resolved', 'working', 'solved', 'ok now'],
        }

        intent = sent_record.get('intent', 'general')
        outcome = 'neutral'
        confidence = 0.5

        # Check intent-specific positive signals
        if intent in intent_keywords_positive:
            if any(kw in snippet_lower for kw in intent_keywords_positive[intent]):
                outcome = 'positive'
                confidence = 0.8

        # General sentiment check
        pos_hits = sum(1 for kw in positive_keywords if kw in snippet_lower)
        neg_hits = sum(1 for kw in negative_keywords if kw in snippet_lower)

        if neg_hits > pos_hits and neg_hits >= 2:
            outcome = 'negative'
            confidence = min(0.9, 0.5 + neg_hits * 0.1)
        elif pos_hits >= 2:
            outcome = 'positive'
            confidence = min(0.9, 0.5 + pos_hits * 0.1)

        # Update record
        data['sent'][key]['outcome'] = outcome
        data['sent'][key]['outcome_confidence'] = confidence
        data['sent'][key]['follow_up_at'] = datetime.now(timezone.utc).isoformat()
        data['sent'][key]['follow_up_sender'] = new_sender_email
        data['sent'][key]['follow_up_snippet'] = new_snippet[:200]

        # Log to history
        if 'history' not in data:
            data['history'] = []
        data['history'].append({
            'thread_id': thread_id, 'email_id': email_id,
            'outcome': outcome, 'confidence': confidence,
            'template': sent_record.get('template', ''),
            'intent': intent, 'follow_up_at': datetime.now(timezone.utc).isoformat(),
        })

        self._save(self.outcomes_file, data)
        self._update_template_weights(sent_record.get('template', 'default'), outcome, confidence)
        return {'outcome': outcome, 'confidence': confidence, 'key': key}

    def _update_template_weights(self, template, outcome, confidence):
        """Feed outcome back into ML template optimizer."""
        data = self._load(self.outcomes_file)
        if 'template_performance' not in data:
            data['template_performance'] = {}

        perf = data['template_performance'].get(template, {'uses': 0, 'positives': 0, 'negatives': 0, 'neutrals': 0})

        outcome_field = f'{outcome}s'  # 'positives', 'negatives', 'neutrals'
        perf['uses'] += 1
        perf[outcome_field] = perf.get(outcome_field, 0) + 1
        perf['last_outcome'] = outcome
        perf['last_confidence'] = confidence

        # Simple weight calculation
        total = perf['uses']
        score = (perf.get('positives', 0) * 1.0 + perf.get('neutrals', 0) * 0.5 + perf.get('negatives', 0) * 0.0) / max(total, 1)
        perf['weight'] = round(score, 4)

        data['template_performance'][template] = perf
        self._save(self.outcomes_file, data)
        return perf

    def get_template_weight(self, template):
        """Get current ML weight for a template."""
        data = self._load(self.outcomes_file)
        return data.get('template_performance', {}).get(template, {}).get('weight', 0.5)

    def get_template_stats(self, template):
        """Get full stats for a template."""
        data = self._load(self.outcomes_file)
        return data.get('template_performance', {}).get(template, {'uses': 0, 'positives': 0, 'negatives': 0, 'weight': 0.5})

    def get_pending(self):
        """Return all pending (not yet classified) sent responses."""
        data = self._load(self.outcomes_file)
        return [v for v in data.get('sent', {}).values() if v.get('outcome') == 'pending']

# Legacy shim for V12 compatibility
DecisionCache = lambda: __import__('pathlib').Path(__file__).resolve().parent.parent / 'data' / 'reply_all_cache.json'
