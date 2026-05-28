#!/usr/bin/env python3
"""
Sender Profile Learner V23 — Builds detailed profiles per sender
Tracks: preferred tone, language, response time, formality, intent patterns
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

WORKSPACE = Path(__file__).resolve().parent.parent.parent

class SenderProfileLearnerV23:
    """Learn and maintain sender profiles for personalized responses."""

    def __init__(self):
        self.profile_file = WORKSPACE / 'zion.app' / 'data' / 'sender_profiles_v23.json'

    def load(self):
        try:
            return json.loads(self.profile_file.read_text())
        except Exception:
            return {}

    def save(self, profiles):
        self.profile_file.write_text(json.dumps(profiles, indent=2))

    def _extract_domain(self, sender):
        """Extract domain from 'Name <email>' or just 'email'"""
        m = re.search(r'<([^>]+)>', sender)
        email = m.group(1) if m else sender
        return email.split('@')[-1] if '@' in email else 'unknown'

    def _extract_name(self, sender):
        """Extract display name from sender string"""
        m = re.match(r'"([^"]+)"', sender)
        if m: return m.group(1).strip()
        m = re.match(r'([^<]+)<', sender)
        if m: return m.group(1).strip()
        return sender.split('@')[0] if '@' in sender else sender[:30]

    def _detect_language(self, text):
        """Detect if Portuguese or English"""
        pt_words = ['reserva', 'obrigado', 'prezado', 'solicitação', 'retorno',
                    'disponibilidade', 'agendar', 'confirmar', 'senhor', 'cara',
                    'olá', 'bom dia', 'boa tarde', 'boa noite', 'saudações',
                    'atenciosamente', 'aguardo', 'desde já', 'valor', 'diária']
        en_words = ['hello', 'hi', 'dear', 'please', 'thank', 'booking',
                    'reservation', 'confirm', 'availability', 'schedule',
                    'regards', 'sincerely', 'looking forward', 'best regards']
        text_lower = text.lower()
        pt_count = sum(1 for w in pt_words if w in text_lower)
        en_count = sum(1 for w in en_words if w in text_lower)
        return 'pt' if pt_count > en_count else 'en' if en_count > pt_count else 'unknown'

    def _detect_formality(self, text):
        """Detect formal vs casual language"""
        formal = ['prezado', 'caro', 'senhor', 'senhora', 'atenciosamente',
                  'cordialmente', 'dear', 'sir', 'madam', 'sincerely',
                  'respectfully', 'yours faithfully', 'estimate', 'would be grateful']
        casual = ['oi', 'olá', 'hey', 'hi', 'fala', 'beleza', 'blz',
                  'obg', 'vlw', 'tmj', 'show', 'valeu', 'thanks',
                  'thx', 'cheers', 'talk soon', 'cool', 'awesome']
        text_lower = text.lower()
        f_count = sum(1 for w in formal if w in text_lower)
        c_count = sum(1 for w in casual if w in text_lower)
        if f_count > c_count: return 'formal'
        if c_count > f_count: return 'casual'
        return 'neutral'

    def _extract_timezone(self, sender, email_data):
        """Try to infer timezone from email headers or content"""
        headers = email_data.get('headers', [])
        for h in headers:
            if h.get('name','').lower() == 'date':
                try:
                    dt = datetime.strptime(h['value'][:25], '%a, %d %b %Y %H:%M:%S')
                    return dt.hour
                except Exception:
                    pass
        return -3  # default BRT

    def learn_from_email(self, sender, subject, snippet, email_data=None):
        """Update profile with new email data"""
        profiles = self.load()
        domain = self._extract_domain(sender)
        name = self._extract_name(sender)

        # Support looking up by both domain and full sender
        profile_key = domain
        if profile_key not in profiles:
            profiles[profile_key] = {
                'name': name,
                'emails': [],
                'domains': [],
                'first_contact': datetime.now(timezone.utc).isoformat(),
                'total_messages': 0,
                'formality': 'neutral',
                'language': 'unknown',
                'intents': {},
                'avg_response_minutes': None,
                'response_times': [],
                'last_interaction': None,
                'preferred_time': None,
                'reply_pattern': 'unknown',  # 'reply_all' or 'reply_only'
                'urgency_patterns': defaultdict(int),
            }

        profile = profiles[profile_key]
        profile['total_messages'] += 1
        profile['last_interaction'] = datetime.now(timezone.utc).isoformat()
        profile['name'] = name

        # Track all sender emails
        if sender not in profile['emails']:
            profile['emails'].append(sender)
        if domain not in profile['domains']:
            profile['domains'].append(domain)

        # Language detection with rolling average
        lang = self._detect_language(f"{subject} {snippet}")
        if lang != 'unknown':
            profile['language'] = lang if profile['language'] == 'unknown' else (
                lang if profile.get('_lang_count', {}).get(lang, 0) <
                profile.get('_lang_count', {}).get('pt' if lang == 'en' else 'en', 0) else profile['language']
            )
            if '_lang_count' not in profile: profile['_lang_count'] = {'pt': 0, 'en': 0}
            profile['_lang_count'][lang] = profile['_lang_count'].get(lang, 0) + 1

        # Formality tracking
        form = self._detect_formality(f"{subject} {snippet}")
        profile['formality'] = form

        # Detect intent patterns
        intent = 'general'
        for pattern, label in [
            (r'(?:reserva|booking|check[-\s]?in|disponibilidade|availability|di[áa]ria|night)', 'booking'),
            (r'(?:proposta|quote|or[çc]amento|pricing|budget|proposal)', 'sales'),
            (r'(?:suporte|support|help|ajuda|problema|issue|bug|error|erro)', 'support'),
            (r'(?:urgente|urgent|emerg[eê]ncia|critical|cr[íi]tico|asap|imediato)', 'urgent'),
            (r'(?:cancelamento|cancel|cancellation|reembolso|refund)', 'cancellation'),
        ]:
            if re.search(pattern, f"{subject} {snippet}", re.IGNORECASE):
                intent = label
                break

        profile['intents'][intent] = profile['intents'].get(intent, 0) + 1

        # Clean up temp tracking keys
        for k in ['_lang_count']:
            if k in profile:
                del profile[k]

        # Infer preferred response time from email arrival hour
        if email_data:
            hr = self._extract_timezone(sender, email_data)
            if 'contact_hours' not in profile: profile['contact_hours'] = []
            profile['contact_hours'].append(hr)
            if len(profile['contact_hours']) > 20:
                profile['contact_hours'] = profile['contact_hours'][-20:]
            profile['preferred_time'] = max(set(profile['contact_hours']),
                                           key=profile['contact_hours'].count)

        self.save(profiles)
        return profile

    def get_profile(self, sender):
        """Get profile for a sender's domain"""
        domain = self._extract_domain(sender)
        profiles = self.load()
        return profiles.get(domain, {})

    def get_recommended_tone(self, sender, intent='general'):
        """Get recommended tone and language for this sender"""
        profile = self.get_profile(sender)
        language = profile.get('language', 'pt')
        formality = profile.get('formality', 'neutral')

        if formality == 'formal':
            tone_map = {
                'booking': 'professional',
                'sales': 'formal_polite',
                'support': 'professional',
                'general': 'formal_neutral',
                'urgent': 'direct_respectful',
            }
        elif formality == 'casual':
            tone_map = {
                'booking': 'friendly',
                'sales': 'friendly_professional',
                'support': 'casual_helpful',
                'general': 'casual',
                'urgent': 'direct_friendly',
            }
        else:
            tone_map = {
                'booking': 'friendly',
                'sales': 'professional',
                'support': 'helpful',
                'general': 'neutral',
                'urgent': 'direct',
            }

        return {
            'tone': tone_map.get(intent, 'neutral'),
            'language': language,
            'formality': formality,
            'signature': self._get_signature(formality, language),
        }

    def _get_signature(self, formality, language):
        if language == 'pt':
            if formality == 'formal':
                return '\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group'
            elif formality == 'casual':
                return '\n\nAbraço,\nKleber'
            return '\n\n— Kleber, Zion Tech Group'
        else:
            if formality == 'formal':
                return '\n\nSincerely,\nKleber Garcia Alcatrão\nZion Tech Group'
            elif formality == 'casual':
                return '\n\nCheers,\nKleber'
            return '\n\n— Kleber, Zion Tech Group'

    def track_response_time(self, sender, minutes_to_respond):
        """Track how long it took to respond to this sender"""
        profiles = self.load()
        domain = self._extract_domain(sender)
        if domain in profiles:
            if 'response_times' not in profiles[domain]:
                profiles[domain]['response_times'] = []
            profiles[domain]['response_times'].append(minutes_to_respond)
            if len(profiles[domain]['response_times']) > 10:
                profiles[domain]['response_times'] = profiles[domain]['response_times'][-10:]
            times = profiles[domain]['response_times']
            profiles[domain]['avg_response_minutes'] = sum(times) / len(times)
            self.save(profiles)