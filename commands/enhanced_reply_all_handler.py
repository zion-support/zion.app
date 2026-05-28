#!/usr/bin/env python3
"""
Enhanced Reply-All Handler V22 — Intelligent reply-all decision engine
Replaces V12's simple boolean at line 156 with full case-by-case analysis.
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path(__file__).resolve().parent.parent.parent

class EnhancedReplyAllHandlerV22:
    """Analyze each email case-by-case to determine proper reply-all behavior."""

    # Group-indicative subject keywords
    GROUP_SUBJECT_KEYWORDS = [
        'team', 'everyone', 'all', 'group', 'update:', 'sync:', 'meeting',
        'newsletter', 'announcement', 'weekly', 'monthly', 'digest', 'standup',
        'broadcast', 'all-hands', 'townhall', 'town hall', 'all hands',
    ]

    # Private-request keywords in body
    PRIVATE_REQUEST_KEYWORDS = [
        'just you', 'only you', 'privately', 'private reply', 'dm me',
        'dm you', 'direct message', 'not for', 'confidential', 'personal',
        'between us', 'just between', 'off the record',
    ]

    # CC-only noise patterns (auto-generated, noreplies, bounces)
    CC_NOISE_PATTERNS = [
        'noreply', 'no-reply', 'no_reply', 'mailer-daemon', 'postmaster',
        'bounce', 'donotreply', 'do-not-reply', 'bounces', '.onmicrosoft.com',
        'notification@', 'auto-reply', 'out-of-office', 'ooo@',
    ]

    def __init__(self, cache_file=None):
        self.cache_file = cache_file or str(WORKSPACE / 'zion.app' / 'data' / 'reply_all_cache.json')

    def _load_cache(self):
        try:
            return json.loads(Path(self.cache_file).read_text())
        except Exception:
            return {}

    def _save_cache(self, data):
        Path(self.cache_file).write_text(json.dumps(data, indent=2))

    def _extract_to_count(self, email_data):
        """Count distinct recipients in To header."""
        to_header = email_data.get('to_header', '')
        if not to_header:
            # fallback: derive from 'to' field
            to_val = email_data.get('to', '')
            if isinstance(to_val, list):
                return len(to_val)
            return 1
        # Split on comma-before-angle to handle "Name <email>" formats
        parts = re.split(r',\s*(?=[^<]*(?:<|$))', to_header) if 're' in dir() else to_header.split(',')
        return max(1, len([p.strip() for p in parts if p.strip()]))

    def _is_noise_address(self, addr):
        addr_lower = addr.lower()
        return any(pat in addr_lower for pat in self.CC_NOISE_PATTERNS)

    def _smart_cc_string(self, cc_header, to_header):
        """Return filtered CC string vs noise."""
        if not cc_header:
            return ''
        parts = [p.strip() for p in cc_header.split(',') if p.strip()]
        clean = [p for p in parts if not self._is_noise_address(p)]
        return ', '.join(clean)

    def _detect_private_request(self, text):
        text_lower = text.lower()
        return any(kw in text_lower for kw in self.PRIVATE_REQUEST_KEYWORDS)

    def _subject_suggests_group(self, subject):
        subject_lower = subject.lower()
        return any(kw in subject_lower for kw in self.GROUP_SUBJECT_KEYWORDS)

    def decide(self, email_data, thread_participants=None):
        """
        Main entry point. Returns dict:
        {
            'reply_all': bool,           # final decision
            'reasons': [str],            # list of reasons
            'score': int,                # confidence score (0-10+)
            'use_cc': str,               # filtered CC header
            'reply_to_original': bool,   # forward-detection
            'thread_participants': list, # all participants seen
        }
        """
        thread_participants = thread_participants or []
        to_count = self._extract_to_count(email_data)
        cc_header = email_data.get('cc_recipients', '')
        subject = email_data.get('subject', '')
        snippet_body = f"{subject} {email_data.get('snippet', '')}"
        is_forward = email_data.get('analysis', {}).get('is_forwarded', False)
        original_sender = email_data.get('forward_original_sender')

        reasons = []
        reply_all_score = 0

        # --- Scoring logic ---
        if to_count > 2:
            reply_all_score += 3
            reasons.append(f'To count={to_count} (>2) → reply-all likely')

        if cc_header:
            reply_all_score += 2
            reasons.append('CC header present → group reply')

        if self._subject_suggests_group(subject):
            reply_all_score += 2
            reasons.append(f'Subject suggests group: \'{subject[:50]}\'')

        # Thread depth > 2 unique participants
        unique_participants = set(thread_participants)
        if len(unique_participants) > 2:
            reply_all_score += 2
            reasons.append(f'Thread has {len(unique_participants)} participants → reply-all')

        # Forwarded → reply to original sender only (override)
        if is_forward and original_sender:
            reply_all_score -= 5

        # Private request override
        if self._detect_private_request(snippet_body):
            reply_all_score -= 4
            reasons.append('Private-reply keyword detected → reply-only')

        # Default: 1:1 → reply-only
        if to_count <= 1 and not cc_header:
            reply_all_score -= 1
            reasons.append('1:1 conversation → reply-only')

        # --- Decision ---
        reply_all = reply_all_score >= 0
        use_cc = self._smart_cc_string(cc_header, email_data.get('to', '')) if reply_all else ''

        result = {
            'reply_all': reply_all,
            'reasons': reasons,
            'score': reply_all_score,
            'use_cc': use_cc,
            'reply_to_original': bool(original_sender),
            'thread_participants': list(unique_participants),
            'decided_at': datetime.now(timezone.utc).isoformat(),
        }
        self._cache_decision(email_data.get('thread_id', ''), result)
        return result

    def _cache_decision(self, thread_id, result):
        cache = self._load_cache()
        cache[thread_id] = result
        self._save_cache(cache)

    def get_cached_decision(self, thread_id):
        return self._load_cache().get(thread_id)
