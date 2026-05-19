#!/usr/bin/env python3
"""
Intelligent Email Responder V18 - Multi-Channel Routing & Escalation
Features:
- Multi-channel response routing (email, SMS, WhatsApp, Telegram)
- Escalation matrix based on intent/urgency
- A/B testing framework for template optimization
- Response quality scoring
"""

import sys, json, random
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')

class MultiChannelRouterV18:
    """Route responses to appropriate channels"""
    
    def __init__(self):
        self.preferred_channels = {
            'booking': ['whatsapp', 'email', 'sms'],
            'support': ['email', 'sms', 'telegram'],
            'pricing': ['email'],
            'partnership': ['email', 'whatsapp'],
            'spam': []
        }
        self.channel_credentials = WORKSPACE / 'zion.app' / 'data' / 'channel_credentials.json'
    
    def select_channel(self, analysis, sender_profile):
        """Select optimal channel based on analysis and sender preferences"""
        intent = analysis['intent']
        urgency = analysis['urgency']
        known_prefs = sender_profile.get('preferred_channel', 'email')
        
        # High urgency -> SMS or WhatsApp
        if urgency in ['critical', 'high']:
            return 'whatsapp' if self._channel_available('whatsapp') else 'sms'
        
        # Use sender preference if known
        if known_prefs in self.preferred_channels.get(intent, []):
            return known_prefs
        
        return self.preferred_channels.get(intent, ['email'])[0]
    
    def _channel_available(self, channel):
        """Check if channel credentials exist"""
        if self.channel_credentials.exists():
            creds = json.loads(self.channel_credentials.read_text())
            return channel in creds and creds[channel].get('configured', False)
        return False
    
    def route_response(self, thread_id, response_text, channel, recipients):
        """Route response through selected channel"""
        result = {
            'thread_id': thread_id,
            'channel': channel,
            'recipients_count': len(recipients),
            'status': 'queued',
            'routed_at': datetime.now(timezone.utc).isoformat()
        }
        
        # In production, this would actually send via the channel API
        # For now, log the routing decision
        queue_file = WORKSPACE / 'zion.app' / 'data' / 'channel_queue.json'
        if queue_file.exists():
            queue = json.loads(queue_file.read_text())
        else:
            queue = {'queue': []}
        
        queue['queue'].append(result)
        queue_file.write_text(json.dumps(queue))
        
        return result


class EscalationMatrixV18:
    """Handle escalations based on rules"""
    
    def __init__(self):
        self.escalation_rules = {
            'booking': {'threshold': 3, 'escalate_to': 'partnerships@ziontechgroup.com'},
            'support': {'threshold': 2, 'escalate_to': 'support@ziontechgroup.com'},
            'pricing': {'threshold': 5, 'escalate_to': 'sales@ziontechgroup.com'},
            'partnership': {'threshold': 1, 'escalate_to': 'kleber@ziontechgroup.com'}
        }
        self.escalation_log = WORKSPACE / 'zion.app' / 'data' / 'escalations.json'
    
    def check_escalation(self, thread_id, analysis, response_history):
        """Check if escalation is needed"""
        intent = analysis['intent']
        rule = self.escalation_rules.get(intent, {})
        
        attempts = len(response_history.get(thread_id, []))
        
        if attempts >= rule.get('threshold', 5):
            escalation = {
                'thread_id': thread_id,
                'reason': f'{attempts} attempts without resolution',
                'escalated_to': rule.get('escalate_to'),
                'escalated_at': datetime.now(timezone.utc).isoformat(),
                'analysis': analysis
            }
            
            self._log_escalation(escalation)
            return escalation
        
        return None
    
    def _log_escalation(self, escalation):
        if self.escalation_log.exists():
            data = json.loads(self.escalation_log.read_text())
        else:
            data = {'escalations': []}
        
        data['escalations'].append(escalation)
        self.escalation_log.write_text(json.dumps(data))


class ABTestingFrameworkV18:
    """A/B test response templates"""
    
    def __init__(self):
        self.tests_file = WORKSPACE / 'zion.app' / 'data' / 'ab_tests.json'
        self.results_file = WORKSPACE / 'zion.app' / 'data' / 'ab_results.json'
    
    def select_template_variant(self, template_name, variant_count=2):
        """Select A or B variant for testing"""
        if not self.tests_file.exists():
            # Initialize default tests
            self._init_default_tests()
        
        tests = json.loads(self.tests_file.read_text())
        
        if template_name in tests:
            # Randomly select variant
            return random.choice(['A', 'B'])
        
        return 'A'
    
    def record_result(self, template_name, variant, outcome, thread_id):
        """Record A/B test result"""
        if self.results_file.exists():
            results = json.loads(self.results_file.read_text())
        else:
            results = {'results': []}
        
        results['results'].append({
            'template': template_name,
            'variant': variant,
            'outcome': outcome,
            'thread_id': thread_id,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
        # Keep last 1000 results
        results['results'] = results['results'][-1000:]
        
        self.results_file.write_text(json.dumps(results))
    
    def get_best_variant(self, template_name):
        """Get winning variant for template"""
        if self.results_file.exists():
            results = json.loads(self.results_file.read_text())
            
            template_results = [r for r in results['results'] if r['template'] == template_name]
            
            if template_results:
                a_success = sum(1 for r in template_results if r['variant'] == 'A' and r['outcome'] == 'positive')
                b_success = sum(1 for r in template_results if r['variant'] == 'B' and r['outcome'] == 'positive')
                
                if a_success > b_success:
                    return 'A'
                elif b_success > a_success:
                    return 'B'
        
        return 'A'
    
    def _init_default_tests(self):
        defaults = {
            'booking_response': True,
            'pricing_inquiry': True,
            'support_reply': True
        }
        self.tests_file.write_text(json.dumps(defaults))


class ResponseQualityScorerV18:
    """Score response quality"""
    
    def __init__(self):
        self.quality_log = WORKSPACE / 'zion.app' / 'data' / 'response_quality.json'
    
    def score_response(self, response_text, analysis):
        """Score response quality 0-100"""
        score = 50  # Base score
        
        # Length check
        word_count = len(response_text.split())
        if 20 <= word_count <= 150:
            score += 10
        
        # Personalization
        if '{sender_name}' in response_text or 'Prezado' in response_text:
            score += 10
        
        # Call to action
        ctas = ['retornaremos', 'entre em contato', 'favor', 'por favor', 'estou à disposição']
        if any(cta in response_text.lower() for cta in ctas):
            score += 10
        
        # Urgency matching
        if analysis['urgency'] in ['critical', 'high']:
            if 'urgente' in response_text.lower() or 'prioritário' in response_text.lower():
                score += 10
        
        # Intent relevance
        intent_keywords = {
            'booking': ['reserva', 'disponibilidade', 'apartamento'],
            'pricing': ['preço', 'custo', 'valor', 'tarifa'],
            'support': ['suporte', 'problema', 'ajuda', 'solução']
        }
        
        keywords = intent_keywords.get(analysis['intent'], [])
        if any(kw in response_text.lower() for kw in keywords):
            score += 10
        
        return min(score, 100)


if __name__ == '__main__':
    router = MultiChannelRouterV18()
    escalator = EscalationMatrixV18()
    tester = ABTestingFrameworkV18()
    scorer = ResponseQualityScorerV18()
    
    # Test
    test_analysis = {
        'intent': 'booking',
        'urgency': 'high',
        'sender_profile': {'preferred_channel': 'whatsapp'}
    }
    
    channel = router.select_channel(test_analysis, test_analysis['sender_profile'])
    variant = tester.select_template_variant('booking_response')
    
    sample_response = "Prezado(a), recebi sua solicitação de reserva urgente. Vou verificar disponibilidade imediatamente."
    quality_score = scorer.score_response(sample_response, test_analysis)
    
    print(f"V18 Multi-Channel Router: selected channel={channel}")
    print(f"V18 A/B Testing: variant={variant}")
    print(f"V18 Quality Scorer: score={quality_score}/100")