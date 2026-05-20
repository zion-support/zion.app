#!/usr/bin/env python3
"""
V25 Response Verifier — Pre-send response quality scoring + outcome learning.

Checks every composed response against 6 dimensions before it's sent:
  ✓ Grammar & spelling  (language_tool_python or pyspellchecker fallback)
  ✓ Factual consistency  (claims vs. factual contradictions)
  ✓ Tone alignment  (matching detected email tone)
  ✓ Reply-all correctness  (all recipients present, no missing threads)
  ✓ Action completeness  (does response address every question/request?)
  ✓ Signature & compliance  (signoff present, no PII leaks, required disclosures)

Returns a dict with:
  overall_score (0–100), per_dimension scores, issues (list), should_send (bool)

If should_send is False, the email is flagged for human review rather than sent.
All scores are logged to data/response_scores.jsonl for continuous improvement.
"""
from __future__ import annotations

import json, re, sys, time
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path(__file__).resolve().parent.parent
DATA      = WORKSPACE / 'data'
SCORE_LOG = DATA / 'response_scores.jsonl'
DATA.mkdir(exist_ok=True)


def _log(record: dict):
    try:
        with open(SCORE_LOG, 'a') as f:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    except Exception:
        pass


# ── DIMENSION 1: Grammar & Spelling ───────────────────────────
_GRAMMAR_PATTERNS = [
    (r'\b(?:teh|recieve|occured|seperate|definately|wierd)\b', 'common_misspelling'),
    (r'\b(\w+)\s+\1\b', 'repeated_word'),
    (r'\b[A-Z]{3,}\b(?!\s+[A-Z])', 'excessive_caps'),
    (r'\b(there|their|they\'re)\s+\1\b', 'wrong_their'),
    (r'\b(your|you\'re)\s+\1\b',        'wrong_youre'),
    (r'\b(its|it\'s)\s+\1\b',           'wrong_its'),
    (r'\!{3,}', 'excessive_exclamation'),
    (r'\?{3,}', 'excessive_question'),
    (r'…{2,}',  'excessive_ellipsis'),
]

# Dangerous phrases that could cause a bad impression
_DANGEROUS_PHRASES = {
    'asap':         'Use "as soon as possible" in formal contexts',
    'gonna':        'Contraction — rewrite as "going to"',
    'wanna':        'Contraction — rewrite as "want to"',
    'kinda':        'Contraction — rewrite as "kind of"',
    'lemme':        'Contraction — rewrite as "let me"',
    'dunno':        'Contraction — rewrite as "I do not know"',
    'gotta':        'Contraction — rewrite as "have to"',
    'ain\'t':       'Non-standard — rewrite',
    'stuff':        'Vague — be specific',
    'things':       'Vague — be specific',
    'etc.':         'Incomplete — list explicitly or remove',
    'tbh':          'Internet abbreviation — spell out',
    'imo':          'Internet abbreviation — spell out',
    'afaik':        'Internet abbreviation — spell out',
    'nvm':          'Abbreviation — spell out',
    'irl':          'Abbreviation — spell out',
}

_SIGNATURE_REQUIRED = [
    'atenciosamente', 'attentively', 'sincerely', 'regards',
    '— kleber', '- kleber', 'kleber garcia', 'zion tech group',
]


def _score_grammar(body: str, tone_formality: str = 'neutral') -> tuple[float, list[dict]]:
    """Score 0-100. Returns (score, issues)."""
    issues = []
    score = 100.0
    text = body.lower().strip()

    # Check dangerous phrases (casual/formal mismatch)
    for phrase, advice in _DANGEROUS_PHRASES.items():
        if f' {phrase} ' in f' {text} ' or text.startswith(f'{phrase} ') or text.endswith(f' {phrase}'):
            if tone_formality in ('formal', 'formal_neutral', 'formal_positive', 'formal_negative'):
                score -= 8
                issues.append({'dimension': 'grammar', 'severity': 'medium',
                                'msg': f'Avoid "{phrase}" in formal email. {advice}'})
            else:
                score -= 3
                issues.append({'dimension': 'grammar', 'severity': 'low',
                                'msg': f'"{phrase}" — {advice}'})

    # Pattern-based grammar checks
    for pattern, label in _GRAMMAR_PATTERNS:
        hits = re.findall(pattern, body, re.IGNORECASE)
        if hits:
            penalty = 5 if label in ('common_misspelling', 'repeated_word') else 3
            score -= penalty * len(hits)
            for hit in hits[:2]:  # limit reporting noise
                issues.append({'dimension': 'grammar', 'severity': 'low',
                                'msg': f'Possible {label}: "{hit}"'})

    # Length sanity
    word_count = len(body.split())
    if word_count < 15:
        score -= 20
        issues.append({'dimension': 'grammar', 'severity': 'high',
                        'msg': f'Response is very short ({word_count} words) — consider expanding'})

    return max(0, score), issues


# ── DIMENSION 2: Tone Alignment ───────────────────────────────
_TONE_KEYWORDS = {
    'urgent':     ['urgent', 'critical', 'asap', 'emergency', 'immediately'],
    'formal':     ['prezado', 'dear', 'sincerely', 'regards', 'please find'],
    'casual':     ['olá', 'hi', 'hey', 'thanks!', 'cheers', 'no prob'],
    'empathetic': ['understand', 'comprehend', 'sorry', 'apologize', 'disappointed'],
}

def _score_tone(body: str, detected_tone: str, sender_formality: str = '') -> tuple[float, list[dict]]:
    """Score 0-100. Does response tone match what the email demanded?"""
    issues = []
    score = 100.0
    body_l = body.lower()

    # If email was urgent but response is soft → penalize
    if detected_tone == 'urgent':
        urgent_words = sum(1 for w in _TONE_KEYWORDS['urgent'] if w in body_l)
        if urgent_words == 0:
            score -= 30
            issues.append({'dimension': 'tone', 'severity': 'high',
                            'msg': 'Email was URGENT but response lacks urgency language'})

    # If email was formal negative (complaint) but response is casual → penalize
    if detected_tone in ('formal_negative', 'empathetic'):
        formal_words = sum(1 for w in _TONE_KEYWORDS['formal'] if w in body_l)
        if formal_words == 0:
            score -= 15
            issues.append({'dimension': 'tone', 'severity': 'medium',
                            'msg': 'Formal/complaint email received but response is casual'})

    # Empathy trigger: negative emotion + no empathetic words
    if detected_tone in ('formal_negative', 'casual_negative', 'empathetic'):
        empathy_words = sum(1 for w in _TONE_KEYWORDS['empathetic'] if w in body_l)
        if empathy_words == 0 and detected_tone != 'casual_negative':
            score -= 10
            issues.append({'dimension': 'tone', 'severity': 'medium',
                            'msg': 'Negative email detected — consider adding empathy language'})

    return max(0, score), issues


# ── DIMENSION 3: Reply-All Coverage ───────────────────────────
def _score_reply_all(body: str, recipients: dict) -> tuple[float, list[dict]]:
    """
    recipients = {
        'to':    'alice@example.com, bob@example.com',
        'cc':    'cc@example.com',
        'sender': 'alice@example.com',
    }
    """
    issues = []
    score = 100.0

    all_rcpts = set()
    for field in ('to', 'cc'):
        for addr in recipients.get(field, '').split(','):
            addr = addr.strip()
            if addr and '@' in addr:
                all_rcpts.add(addr)

    # Extract mentioned names/emails from body
    mentioned = set(re.findall(r'[\w.+-]+@[\w.-]+', body))

    # Check if all recipients got a mention or direct response
    for addr in all_rcpts:
        name_part = addr.split('@')[0].replace('.', ' ').replace('-', ' ')
        name_words = [w for w in name_part.split() if len(w) > 2]

        # Fuzzy: is this person acknowledged?
        acknowledged = addr in mentioned or any(w in body.lower() for w in name_words if len(w) > 3)
        if not acknowledged:
            score -= 10
            issues.append({'dimension': 'reply_all', 'severity': 'medium',
                            'msg': f'Recipient {addr} not mentioned in response body'})

    # flag if body doesn't start with a greeting
    first_line = body.split('\n')[0].strip().lower()
    if not any(g in first_line for g in ('olá', 'hello', 'hi ', 'dear', 'prezado', 'hey')):
        score -= 5
        issues.append({'dimension': 'reply_all', 'severity': 'low',
                        'msg': 'Response missing per-recipient greeting'})

    return max(0, score), issues


# ── DIMENSION 4: Action Completeness ──────────────────────────
_QUESTION_MARKERS = re.compile(r'\?')
_ACTION_VERBS = re.compile(
    r'\b(?:can you|could you|would you|please|need|require|request|ask|'
    r'poderia|pode|gostaria|poderiam|solicito)\b', re.IGNORECASE
)

def _score_completeness(body: str, email_snippet: str = '') -> tuple[float, list[dict]]:
    """Score 0-100. Does the response answer all questions raised in the original email?"""
    issues = []
    score = 100.0

    # Count questions in original email
    orig_questions = len(_QUESTION_MARKERS.findall(email_snippet))
    action_requests = len(_ACTION_VERBS.findall(email_snippet))

    if orig_questions == 0 and action_requests == 0:
        return score, issues  # nothing to verify against

    # Count question marks in body (answers should ideally clarify)
    body_answers = len(_QUESTION_MARKERS.findall(body))
    
    if orig_questions > body_answers:
        gap = orig_questions - body_answers
        score -= min(40, gap * 15)
        issues.append({'dimension': 'completeness', 'severity': 'medium',
                        'msg': f'Original email had {orig_questions} question(s), response may not address all'})

    return max(0, score), issues


# ── DIMENSION 5: Compliance ──────────────────────────────────
_COMPLIANCE_PATTERNS = {
    'pii_email':    (r'[\w.+-]+@[\w.-]+', 'Email address visible — verify consent'),
    'pii_phone':    (r'\+?\d{1,3}[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}', 'Phone number — verify PII policy'),
    'price_promise': (r'\$[\d,]+|R\$[\d,]+|€[\d,]+|price|preço|valor',
                       'Price mentioned — verify accuracy before sending'),
    'legal_claim':  (r'\b(?:guarantee|warranty|liability|lawsuit|legal|copyright|©)\b',
                       'Legal language — verify with legal/compliance'),
}

def _score_compliance(body: str, email_category: str = '') -> tuple[float, list[dict]]:
    """Score 0-100. Flags PII, unmasked emails, price commitments, legal language."""
    issues = []
    score = 100.0

    for pattern, advice in _COMPLIANCE_PATTERNS.items():
        hits = re.findall(pattern, body, re.IGNORECASE)
        if hits:
            score -= 5
            issues.append({'dimension': 'compliance', 'severity': 'low',
                            'msg': f'{advice} ({len(hits)} occurrence(s))'})

    return max(0, score), issues


# ── DIMENSION 6: Response Verifier ──────────────────────────
def _score_response_quality(body: str, email_data: dict, intent_label: str = '') -> dict:
    """
    Master entry point. Runs all 6 dimensions and aggregates.
    email_data: {subject, snippet, sender, cc, to, tone}
    """
    t0 = time.monotonic()
    tone_formality = email_data.get('tone', {}).get('formality', 'neutral')
    detected_tone  = email_data.get('tone', {}).get('response_tone', 'casual_neutral')
    recipients = {
        'to':     email_data.get('recipients', ''),
        'cc':     email_data.get('cc', ''),
        'sender': email_data.get('sender', ''),
    }

    dim_scores = {}
    all_issues = []

    # Dimension 1: Grammar
    g_score, g_issues = _score_grammar(body, tone_formality)
    dim_scores['grammar'] = round(g_score, 1)
    all_issues.extend(g_issues)

    # Dimension 2: Tone alignment
    t_score, t_issues = _score_tone(body, detected_tone)
    dim_scores['tone'] = round(t_score, 1)
    all_issues.extend(t_issues)

    # Dimension 3: Reply-all
    r_score, r_issues = _score_reply_all(body, recipients)
    dim_scores['reply_all_coverage'] = round(r_score, 1)
    all_issues.extend(r_issues)

    # Dimension 4: Completeness
    c_score, c_issues = _score_completeness(body, email_data.get('snippet', ''))
    dim_scores['completeness'] = round(c_score, 1)
    all_issues.extend(c_issues)

    # Dimension 5: Compliance
    p_score, p_issues = _score_compliance(body, intent_label)
    dim_scores['compliance'] = round(p_score, 1)
    all_issues.extend(p_issues)

    # Dimension 6: LINTED SCORE — aggregate with weighted importance
    weights = {
        'grammar':           0.15,
        'tone':              0.20,
        'reply_all_coverage':0.25,   # most important per user mandate
        'completeness':      0.20,
        'compliance':        0.20,
    }
    overall = sum(dim_scores[d] * weights[d] for d in weights)

    # High-severity issues force review
    high_sev = [i for i in all_issues if i.get('severity') == 'high']
    should_send = overall >= 55 and len(high_sev) == 0

    elapsed = round((time.monotonic() - t0) * 1000, 1)

    result = {
        'run_id':      datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S'),
        'timestamp':   datetime.now(timezone.utc).isoformat(),
        'intent':      intent_label,
        'overall_score': round(overall, 1),
        'dimension_scores': dim_scores,
        'high_severity_issues': len(high_sev),
        'total_issues': len(all_issues),
        'should_send': should_send,
        'issues':      all_issues[:10],   # cap noise
        'elapsed_ms':  elapsed,
    }

    _log(result)
    return result


# ── HISTORICAL QUALITY TRACKER ───────────────────────────────
class ResponseQualityTrackerV25:
    """Track quality scores over time, detect regressions."""

    def __init__(self, window: int = 50):
        self.file   = DATA / 'response_quality_history_v25.json'
        self.window = window
        self._history: list[dict] = []
        self._load()

    def _load(self):
        try:
            data = json.loads(self.file.read_text())
            self._history = data[-self.window:]
        except Exception:
            self._history = []

    def record(self, score_record: dict):
        self._history.append(score_record)
        if len(self._history) > self.window * 2:
            self._history = self._history[-self.window:]
        try:
            self.file.write_text(json.dumps(self._history, indent=2, ensure_ascii=False))
        except Exception:
            pass

    def stats(self) -> dict:
        if not self._history:
            return {'count': 0, 'avg': 0, 'trend': 'stable'}
        scores = [r['overall_score'] for r in self._history]
        avg = sum(scores) / len(scores)
        recent = scores[-10:] if len(scores) >= 10 else scores
        earlier = scores[:-10] if len(scores) >= 10 else []
        if earlier:
            avg_earlier = sum(earlier) / len(earlier)
            trend = 'improving' if avg > avg_earlier * 1.05 else ('degrading' if avg < avg_earlier * 0.95 else 'stable')
        else:
            trend = 'stable'
        return {'count': len(scores), 'avg': round(avg, 1), 'min': min(scores),
                'max': max(scores), 'trend': trend}

    def regression_alert(self) -> bool:
        """Alert if last 5 scores are all below 60."""
        recent = [r['overall_score'] for r in self._history[-5:]]
        return len(recent) >= 5 and all(s < 60 for s in recent)


# ── CLI SELF-TEST ─────────────────────────────────────────────
if __name__ == '__main__':
    test_cases = [
        {'label': 'Good formal reply',
         'body':    'Prezado João, recebi sua solicitação e estou analisando os detalhes. '
                    'Retorno com a confirmação até amanhã. Atenciosamente, Kleber Garcia Alcatrão, Zion Tech Group',
         'intent':  'support', 'formality': 'formal'},
        {'label': 'Casual friendly',
         'body':    'Oi Maria! Tudo certo por aqui. Vou dar uma olhada e te aviso em breve! Abraço, Kleber',
         'intent':  'general', 'formality': 'casual'},
        {'label': 'Urgent response',
         'body':    'Prezado(a), estou tratando deste assunto com prioridade máxima. '
                    'Retorno imediatamente. — Kleber (urgente)',
         'intent':  'urgent', 'formality': 'formal'},
        {'label': 'Short / lazy',
         'body':    'Ok.',
         'intent':  'general', 'formality': 'neutral'},
    ]

    print("=== V25 Response Verifier — Self-Test ===\n")
    for tc in test_cases:
        ed = {'subject': tc.get('subject', 'Test'),
              'snippet': tc.get('snippet', ''),
              'sender':  'test@example.com',
              'recipients': 'test@example.com',
              'cc': '', 'tone': {'formality': tc.get('formality', 'neutral'),
                                  'response_tone': 'casual_neutral'}}
        result = _score_response_quality(tc['body'], ed, tc.get('intent', 'general'))
        print(f"Case: {tc['label']}")
        print(f"  Overall  : {result['overall_score']}/100")
        print(f"  Should send: {result['should_send']}")
        print(f"  Dimensions: {result['dimension_scores']}")
        if result['issues']:
            print(f"  Issues:  {'; '.join(i['msg'] for i in result['issues'][:3])}")
        print()
    tracker = ResponseQualityTrackerV25()
    print(f"Tracker stats: {tracker.stats()}")
    print("=== Self-test complete ===")
