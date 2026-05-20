#!/usr/bin/env python3
"""
Intent Confidence Scorer V23 — Confidence-based decision making
Assigns confidence to intent detection. Falls back to human when uncertain.
"""

import json, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')

class IntentConfidenceScorerV23:
    """Score confidence in intent detection and suggest fallback when unsure."""

    # High-confidence patterns (specific, unambiguous)
    HIGH_CONFIDENCE = {
        'booking': [
            r'(?:gostaria|queria|would like|i\'d like).{0,30}(?:reservar|book|agendar|check in)',
            r'(?:disponibilidade|availability).{0,20}(?:para|for|em|on).{0,20}(?:data|date|dia)',
            r'(?:quanto|how much|preço|price).{0,30}(?:di[áa]ria|night|noite)',
            r'(?:reserva|booking|reservation).{0,10}(?:confirmada|confirmed|#|id|code)',
            r'(?:check[-\s]?in|check[-\s]?out|check-in|check-out).{0,20}(?:data|date|dia|day)',
            r'(?:quarto|room|suite|apartamento|apartment).{0,30}(?:para|for|casal|double|single|solteiro)',
        ],
        'sales': [
            r'(?:quanto|how much|or[çc]amento|quote|budget|proposal).{0,20}(?:custa|cost|price|preço)',
            r'(?:proposta|proposal).{0,30}(?:comercial|business| partnership)',
            r'(?:interested in|interessado em|quero saber sobre).{0,30}(?:service|serviço|solution|solução)',
            r'(?:pricing|preços|tabela|rate card|price list)',
        ],
        'support': [
            r'(?:n[ãa]o funciona|not working|broken|quebrado|error|erro|bug)',
            r'(?:preciso de ajuda|need help|can you help|me ajuda|help me)',
            r'(?:problema|problem|issue|issue with).{0,30}(?:com|with|técnico|technical)',
            r'(?:suporte|support|assist[eê]ncia|assistance).{0,20}(?:técnico|technical|urgente)',
        ],
        'urgent': [
            r'(?:urgente|urgent|emerg[eê]ncia|emergency|crítico|critical)',
            r'(?:asap|imediato|immediate|right now|já|agora|now).{0,20}(?:preciso|need|help|ajuda)',
            r'(?:fire|incêndio|accident|acidente|disaster|desastre)',
        ],
        'cancellation': [
            r'(?:cancelar|cancel|desmarcar|reschedule|reagendar).{0,20}(?:reserva|booking)',
            r'(?:reembolso|refund|estorno|chargeback)',
        ],
        'partnership': [
            r'(?:partnership|parceria|partner|colaboração|collaboration|joint venture)',
            r'(?:strategic|estratégic).{0,20}(?:alliance|aliança)',
            r'(?:cooperation|cooperação|co-marketing|cobranding)',
        ],
    }

    # Medium-confidence patterns (related but could be misread)
    MEDIUM_CONFIDENCE = {
        'booking': [
            r'(?:quanto|how much|preço|price|valor|value)',
            r'(?:dispon[íi]vel|available|vaga|slot)',
            r'(?:noite|night|di[áa]ria|daily rate)',
        ],
        'sales': [
            r'(?:informação|information|info|details|detalhes).{0,20}(?:sobre|about|serviço|service)',
            r'(?:catálogo|catalog|portfolio|services)',
        ],
        'support': [
            r'(?:como|how).{0,30}(?:fazer|do|fix|resolver|solve|configurar|setup)',
            r'(?:d[vúu]vida|question|doubt|unclear)',
        ],
    }

    def __init__(self):
        self.confidence_file = WORKSPACE / 'zion.app' / 'data' / 'intent_confidence_v23.json'

    def load(self):
        try:
            return json.loads(self.confidence_file.read_text())
        except Exception:
            return {'history': [], 'intent_accuracy': {}, 'last_update': None}

    def save(self, data):
        self.confidence_file.write_text(json.dumps(data, indent=2))

    def score_intent(self, intent, subject, snippet, body_text=None):
        """Score confidence level for a given intent detection."""
        text = f"{subject} {snippet}"
        if body_text:
            text += f" {body_text[:1000]}"

        high_score = 0
        med_score = 0

        # Check high-confidence patterns
        if intent in self.HIGH_CONFIDENCE:
            for pattern in self.HIGH_CONFIDENCE[intent]:
                if re.search(pattern, text, re.IGNORECASE):
                    high_score += 15  # each hit contributes

        # Check medium-confidence patterns
        if intent in self.MEDIUM_CONFIDENCE:
            for pattern in self.MEDIUM_CONFIDENCE[intent]:
                if re.search(pattern, text, re.IGNORECASE):
                    med_score += 8

        # Pattern hit density
        total_high = sum(1 for p in self.HIGH_CONFIDENCE.get(intent, [])
                        if re.search(p, text, re.IGNORECASE))
        total_med = sum(1 for p in self.MEDIUM_CONFIDENCE.get(intent, [])
                       if re.search(p, text, re.IGNORECASE))

        # Base confidence
        confidence = 0.5  # start neutral

        if high_score >= 15:
            confidence = min(0.95, 0.5 + high_score / 100)
        elif med_score >= 8:
            confidence = min(0.75, 0.5 + med_score / 100)
        elif high_score > 0 or med_score > 0:
            confidence = 0.6

        # Penalize generic intents
        if intent == 'general':
            confidence = min(confidence, 0.4)

        # Boost by pattern density
        density = (total_high * 1.5 + total_med) / max(len(self.HIGH_CONFIDENCE.get(intent, [])) +
                                                       len(self.MEDIUM_CONFIDENCE.get(intent, [])), 1)
        confidence = min(0.98, confidence + density * 0.1)

        return {
            'confidence': round(confidence, 3),
            'level': self._level(confidence),
            'high_patterns': total_high,
            'medium_patterns': total_med,
            'suggest_fallback': confidence < 0.6,
            'suggest_human_review': confidence < 0.5,
        }

    def _level(self, confidence):
        if confidence >= 0.85: return 'very_high'
        if confidence >= 0.70: return 'high'
        if confidence >= 0.60: return 'medium'
        if confidence >= 0.50: return 'low'
        return 'very_low'

    def record_accuracy(self, intent, confidence, was_correct):
        """Record whether our confidence prediction was accurate."""
        data = self.load()
        if intent not in data['intent_accuracy']:
            data['intent_accuracy'][intent] = {'total': 0, 'correct': 0, 'confidence_sum': 0.0}

        stats = data['intent_accuracy'][intent]
        stats['total'] += 1
        stats['confidence_sum'] += confidence
        if was_correct:
            stats['correct'] += 1

        stats['accuracy_rate'] = stats['correct'] / stats['total']
        stats['avg_confidence'] = stats['confidence_sum'] / stats['total']

        data['history'].append({
            'intent': intent,
            'confidence': confidence,
            'correct': was_correct,
            'timestamp': __import__('datetime').datetime.now(
                __import__('datetime').timezone.utc).isoformat(),
        })
        if len(data['history']) > 200:
            data['history'] = data['history'][-200:]
        data['last_update'] = __import__('datetime').datetime.now(
            __import__('datetime').timezone.utc).isoformat()
        self.save(data)

    def suggest_action(self, intent, confidence_score):
        """Based on confidence, suggest what action to take."""
        if confidence_score['suggest_human_review']:
            return {
                'action': 'skip_or_flag',
                'message': 'Low confidence — flagging for human review',
                'auto_respond': False,
            }
        if confidence_score['suggest_fallback']:
            return {
                'action': 'respond_but_verify',
                'message': 'Medium confidence — will respond but log for verification',
                'auto_respond': True,
                'verify_later': True,
            }
        return {
            'action': 'auto_respond',
            'message': f"High confidence ({confidence_score['level']}) — auto-responding",
            'auto_respond': True,
            'verify_later': False,
        }