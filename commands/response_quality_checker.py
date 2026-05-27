#!/usr/bin/env python3
"""
Response Quality Checker V23 — Validates responses before sending
Checks: tone match, completeness, language consistency, action items.
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path(__file__).resolve().parent.parent.parent

class ResponseQualityCheckerV23:
    """Validate response quality before it goes out."""

    def __init__(self):
        self.log_file = WORKSPACE / 'zion.app' / 'data' / 'response_quality_v23.json'
        self.MIN_RESPONSE_LENGTH = 30
        self.MAX_RESPONSE_LENGTH = 5000

    def load(self):
        try:
            return json.loads(self.log_file.read_text())
        except Exception:
            return {'checked': []}

    def save(self, data):
        self.log_file.write_text(json.dumps(data, indent=2))

    def check_response(self, response_text, analysis, sender_profile=None):
        """Full quality check. Returns issues, score, and pass/fail."""
        issues = []
        passed_checks = []
        total_checks = 0
        passed_count = 0

        # 1. Length check
        total_checks += 1
        if len(response_text) < self.MIN_RESPONSE_LENGTH:
            issues.append(f'Response too short ({len(response_text)} chars, min {self.MIN_RESPONSE_LENGTH})')
        else:
            passed_checks.append('length_ok')
            passed_count += 1

        total_checks += 1
        if len(response_text) > self.MAX_RESPONSE_LENGTH:
            issues.append(f'Response too long ({len(response_text)} chars, max {self.MAX_RESPONSE_LENGTH})')
        else:
            passed_checks.append('length_in_range')
            passed_count += 1

        # 2. Contains signature
        total_checks += 1
        has_signature = any(kw in response_text for kw in [
            'Kleber', 'Zion Tech Group', 'Atenciosamente', 'Sincerely',
            'Abraço', 'Cheers', '— Kleber',
        ])
        if not has_signature:
            issues.append('Missing signature block')
        else:
            passed_checks.append('signature_present')
            passed_count += 1

        # 3. Intent-appropriate content
        total_checks += 1
        intent = analysis.get('intent', 'general')
        intent_checks = {
            'booking': ['reserva', 'booking', 'disponibilidade', 'availability',
                       'confirmar', 'confirm', 'diária', 'night'],
            'sales': ['proposta', 'proposal', 'orçamento', 'quote', 'pricing',
                     'value', 'solução', 'solution', 'serviço', 'service'],
            'support': ['ajuda', 'help', 'resolver', 'resolve', 'fix', 'suporte',
                       'support', 'verificar', 'check'],
            'urgent': ['imediatamente', 'immediately', 'urgente', 'urgent',
                      'logo', 'soon', 'priority', 'prioridade'],
            'cancellation': ['cancelamento', 'cancellation', 'reembolso', 'refund'],
        }
        if intent in intent_checks:
            if not any(kw in response_text.lower() for kw in intent_checks[intent]):
                issues.append(f'Response lacks {intent}-specific language')
            else:
                passed_checks.append('intent_content_match')
                passed_count += 1
        else:
            passed_checks.append('intent_general_skipped')
            passed_count += 1

        # 4. No placeholder text
        total_checks += 1
        placeholders = ['[your name]', '[insert]', 'TODO', 'FIXME', 'lorem ipsum',
                       '[recipient]', '[sender]', '[company]', '___']
        for ph in placeholders:
            if ph in response_text:
                issues.append(f'Contains placeholder text: "{ph}"')
                break
        else:
            passed_checks.append('no_placeholders')
            passed_count += 1

        # 5. Language consistency (detect mixed languages)
        total_checks += 1
        pt_markers = len(re.findall(r'\b(?:prezado|obrigado|atenciosamente|saudações|reserva|disponibilidade|senhor|sr)\b', response_text, re.IGNORECASE))
        en_markers = len(re.findall(r'\b(?:dear|thank|sincerely|regards|booking|availability|reservation)\b', response_text, re.IGNORECASE))
        if pt_markers > 0 and en_markers > 0 and min(pt_markers, en_markers) >= 2:
            issues.append('Mixed language detected (PT+EN)')
        else:
            passed_checks.append('language_consistent')
            passed_count += 1

        # 6. Tone matches analysis
        total_checks += 1
        expected_tone = analysis.get('response_tone', 'neutral')
        urgency = analysis.get('urgency_score', 3)
        if urgency <= 2 and 'imediatamente' in response_text.lower():
            pass  # high urgency with urgent language is ok
        elif urgency >= 4 and any(kw in response_text.lower() for kw in ['logo', 'soon', 'briefly', 'breve']):
            issues.append('Low-urgency response for high-urgency email')
        else:
            passed_checks.append('tone_appropriate')
            passed_count += 1

        # 7. Remove trailing whitespace issues
        total_checks += 1
        if response_text != response_text.strip():
            issues.append('Trailing whitespace at start/end')
        else:
            passed_checks.append('clean_whitespace')
            passed_count += 1

        # 8. Greeting present
        total_checks += 1
        greetings_pt = ['Prezado', 'Caro', 'Olá', 'Bom dia', 'Boa tarde', 'Boa noite']
        greetings_en = ['Dear', 'Hello', 'Hi', 'Good morning', 'Good afternoon']
        if not any(g in response_text for g in greetings_pt) and not any(g in response_text for g in greetings_en):
            issues.append('No greeting found')
        else:
            passed_checks.append('greeting_present')
            passed_count += 1

        # Calculate quality score
        score = round(passed_count / max(total_checks, 1), 3) if total_checks > 0 else 0.5

        result = {
            'score': score,
            'passed': passed_count,
            'total_checks': total_checks,
            'issues': issues,
            'passed_checks': passed_checks,
            'passes': score >= 0.75,
        }

        # Log
        data = self.load()
        data['checked'].append({
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'intent': intent,
            'score': score,
            'issues_count': len(issues),
            'response_preview': response_text[:100],
        })
        if len(data['checked']) > 200:
            data['checked'] = data['checked'][-200:]
        self.save(data)

        return result