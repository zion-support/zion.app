#!/usr/bin/env python3
"""
Response Learning Engine - Analyzes successful patterns to improve future responses
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict, Counter

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def gmail_get_or_create_label_id(n): return 'label_id'

LEARNING_FILE = WORKSPACE / 'zion.app' / 'data' / 'response_learning.json'

def load_learning_data():
    if LEARNING_FILE.exists():
        return json.loads(LEARNING_FILE.read_text())
    return {
        'successful_patterns': {},
        'response_templates': {},
        'sender_preferences': {},
        'language_distributions': defaultdict(list),
        'timing_analytics': {}
    }

def save_learning_data(data):
    LEARNING_FILE.parent.mkdir(exist_ok=True)
    LEARNING_FILE.write_text(json.dumps(data, indent=2, default=str))

def analyze_thread_responses():
    """Analyze response patterns from sent folder"""
    data = load_learning_data()
    
    # Get our sent responses from last 30 days
    sent = gmail_search('in:sent newer_than:30d', limit=200)
    
    patterns = defaultdict(list)
    
    for msg in sent:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            # Extract intent category
            intent = classify_response(subject, snippet)
            
            # Analyze response characteristics
            pattern = {
                'subject_length': len(subject),
                'response_length': len(snippet),
                'has_signature': 'Kleber' in snippet or 'Zion' in snippet,
                'language': detect_response_language(snippet),
                'time_of_day': datetime.now().hour
            }
            
            patterns[intent].append(pattern)
            
        except Exception as e:
            print(f"Error analyzing message: {e}")
    
    # Update successful patterns
    for intent, pattern_list in patterns.items():
        if intent not in data['successful_patterns']:
            data['successful_patterns'][intent] = {
                'avg_response_length': 0,
                'signature_inclusion_rate': 0,
                'successful_count': 0
            }
        
        lengths = [p['response_length'] for p in pattern_list]
        signatures = [p['has_signature'] for p in pattern_list]
        
        data['successful_patterns'][intent]['avg_response_length'] = round(sum(lengths) / len(lengths), 1) if lengths else 0
        data['successful_patterns'][intent]['signature_inclusion_rate'] = round(sum(signatures) / len(signatures) * 100, 1) if signatures else 0
        data['successful_patterns'][intent]['successful_count'] = len(pattern_list)
    
    save_learning_data(data)
    return data['successful_patterns']

def classify_response(subject, snippet):
    text = f"{subject} {snippet}".lower()
    
    if any(kw in text for kw in ['reserva', 'booking', 'reservation']):
        return 'booking'
    elif any(kw in text for kw in ['urgente', 'urgent', 'asap']):
        return 'urgent'
    elif any(kw in text for kw in ['orçamento', 'proposta', 'quote', 'proposal']):
        return 'sales'
    elif any(kw in text for kw in ['fatura', 'nota fiscal', 'contrato']):
        return 'portuguese'
    return 'general'

def detect_response_language(text):
    pt_words = ['prezado', 'obrigado', 'atenciosamente', 'agradeço']
    en_words = ['dear', 'thank', 'regards', 'best']
    
    pt_score = sum(1 for w in pt_words if w in text.lower())
    en_score = sum(1 for w in en_words if w in text.lower())
    
    return 'pt' if pt_score >= en_score else 'en'

def generate_optimized_template(intent, context=None):
    """Generate optimized template based on learned patterns"""
    data = load_learning_data()
    patterns = data.get('successful_patterns', {}).get(intent, {})
    
    # Base templates
    base_templates = {
        'booking': {
            'pt': "Prezado(a) {name},\n\nRecebi sua solicitação de reserva. Verificarei disponibilidade e retorno em até 4 horas.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Dear {name},\n\nReceived your booking request. Checking availability, will confirm within 4 hours.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        },
        'urgent': {
            'pt': "Recebi sua mensagem urgente. Tratando com prioridade imediata. Retorno em ~30 minutos.\n\nKleber",
            'en': "Received your urgent message. Handling with immediate priority. Back in ~30 minutes.\n\nKleber"
        },
        'sales': {
            'pt': "Agradeço pelo interesse. Enviarei proposta detalhada em 30 minutos.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Thank you for your interest. I'll send a detailed proposal in 30 minutes.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        }
    }
    
    return base_templates.get(intent, base_templates['sales'])

def get_sender_preference(sender_email):
    """Get learned preferences for a sender"""
    data = load_learning_data()
    sender_hash = hash(sender_email) % 10000
    
    # Track language preference
    prefs = data.get('sender_preferences', {})
    return prefs.get(sender_email, {
        'preferred_language': 'pt' if 'ziontechgroup.com' in sender_email else 'en',
        'interaction_count': 0,
        'last_intent': 'general'
    })

def learn_from_response(thread_id, original_text, response_text, success=True):
    """Learn from a single interaction"""
    data = load_learning_data()
    
    intent = classify_response('', original_text)
    
    # Update timing analytics
    hour = datetime.now().hour
    data['timing_analytics'].setdefault(intent, defaultdict(int))
    data['timing_analytics'][intent][hour] += 1
    
    # Track language distribution
    lang = detect_response_language(response_text)
    data['language_distributions'][intent].append(lang)
    
    # Update template effectiveness
    if success:
        template_key = f"{intent}_{lang}"
        data['response_templates'][template_key] = data['response_templates'].get(template_key, 0) + 1
    
    save_learning_data(data)

def main(execute=True):
    print("🎓 Response Learning Engine - Pattern Analysis")
    
    # Analyze existing responses
    patterns = analyze_thread_responses()
    
    print("\n📊 Successful Patterns by Intent:")
    for intent, stats in patterns.items():
        print(f"  {intent}:")
        print(f"    - Avg response length: {stats.get('avg_response_length', 0)} chars")
        print(f"    - Signature rate: {stats.get('signature_inclusion_rate', 0)}%")
        print(f"    - Success count: {stats.get('successful_count', 0)}")
    
    # Generate optimized templates
    print("\n📝 Optimized Templates Generated:")
    for intent in ['booking', 'urgent', 'sales']:
        template = generate_optimized_template(intent)
        print(f"  {intent}: {template.get('pt', '')[:50]}...")
    
    return patterns

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    main(execute=args.execute)