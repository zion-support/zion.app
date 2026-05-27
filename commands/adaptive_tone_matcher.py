#!/usr/bin/env python3
from __future__ import annotations

"""
V22 Adaptive Tone Matching — Zero-API tone analyzer.
Analyzes sender tone from email subject + body using keyword/pattern matching.
Returns formality, urgency, emotion, and a matched response tone.
"""

import re
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter

# ── FORMALITY INDICATORS ──────────────────────────────────────
FORMAL_PATTERNS = re.compile(
    r'\b(?:'
    r'dear|sincerely|regards|respectfully|kindly|appreciate|'
    r'furthermore|nevertheless|notwithstanding|hereinafter|'
    r'hereby|therein|thereto|whereas|whom|perusal|'
    r'esteemed|honorable|distinguished|formal reques|'
    r'pleasure|pleased|it has come|we would like|we are writing|'
    r'please find|attached please|at your earliest|'
    r'do not hesitate|looking forward|'
    r'confirm receipt|per your request|'
    r'for your reference|for your consideration'
    r')\b', re.IGNORECASE
)

CASUAL_PATTERNS = re.compile(
    r'\b(?:'
    r'hey|hiya|sup|yo|cheers|thx|thanks!|'
    r'cmon|gonna|wanna|gotta|lemme|dunno|'
    r'lol|lmao|btw|omg|tbh|afaik|fyi|'
    r'cool|awesome|sure thing|no prob|'
    r'quick question|just checking|'
    r"can't|don't|won't|isn't|didn't|"
    r"i'll|you'll|we'll|that'll|"
    r"i'm|you're|we're|they're"
    r')\b', re.IGNORECASE
)

# ── URGENCY INDICATORS ────────────────────────────────────────
URGENT_PATTERNS = re.compile(
    r'\b(?:'
    r'urgent|urgently|asap|emergency|critical|'
    r'immediately|right now|deadline|overdue|'
    r'down|offline|broken|not working|failing|'
    r'important|priority|time-sensitive|'
    r'ere now|top priority|drop everything|'
    r'alarm|alert|crisis|ASAP|URGENT'
    r')\b', re.IGNORECASE
)

HIGH_PATTERNS = re.compile(
    r'\b(?:'
    r'need|required|must|due soon|short notice|'
    r'response needed|attention needed|action required|'
    r'rush|hurry|quick turnaround|'
    r'estou precisando|preciso|urgente'
    r')\b', re.IGNORECASE
)

# ── EMOTION INDICATORS ────────────────────────────────────────
POSITIVE_PATTERNS = re.compile(
    r'\b(?:'
    r'thank|great|excellent|amazing|perfect|'
    r'pleased|happy|delighted|wonderful|fantastic|'
    r'appreciate|grateful|love it|looks good|'
    r'confirmed|approved|agreed|solved|fixed|'
    r'congratulations|awesome|brilliant|'
    r'ótimo|perfeito|excelente|obrigado'
    r')\b', re.IGNORECASE
)

NEGATIVE_PATTERNS = re.compile(
    r'\b(?:'
    r'problem|issue|error|failed|broken|wrong|'
    r'bad|terrible|horrible|awful|unacceptable|'
    r'disappointed|frustrated|angry|upset|'
    r'complaint|concern|worried|unhappy|'
    r'not working|not good|not acceptable|'
    r'cancel|refund|escalate|lawyer|'
    r'ruim|péssimo|problema|erro|falha'
    r')\b', re.IGNORECASE
)

# ── SUBJECT INTENSIFIERS ──────────────────────────────────────
EXCLAMATION_PATTERN = re.compile(r'!+')
QUESTION_PATTERN = re.compile(r'\?+')
ALL_CAPS_PATTERN = re.compile(r'\b[A-Z]{4,}\b')

# ── RESPONSE TONE MAP ─────────────────────────────────────────
TONE_ADAPTATION = {
    'formal_positive': {
        'greeting': 'Prezado(a)',
        'close': 'Agradeço desde já e coloco-me à disposição.',
        'signature': 'Atenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group',
    },
    'formal_neutral': {
        'greeting': 'Prezado(a)',
        'close': 'Permaneço à disposição para esclarecimentos.',
        'signature': 'Atenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group',
    },
    'formal_negative': {
        'greeting': 'Prezado(a)',
        'close': 'Estou pessoalmente acompanhando este caso e darei retorno em breve.',
        'signature': 'Respeitosamente,\nKleber Garcia Alcatrão\nZion Tech Group',
    },
    'casual_positive': {
        'greeting': 'Olá',
        'close': 'Fico à disposição!',
        'signature': '— Kleber, Zion Tech Group',
    },
    'casual_neutral': {
        'greeting': 'Olá',
        'close': 'Vamos tocando. Qualquer novidade, aviso.',
        'signature': '— Kleber',
    },
    'casual_negative': {
        'greeting': 'Olá',
        'close': 'Estou cuidando pessoalmente disso. Retorno o mais breve.',
        'signature': '— Kleber',
    },
    'urgent': {
        'greeting': 'Prezado(a)',
        'close': 'Estou tratando deste assunto prioritariamente.',
        'signature': '— Kleber (urgente)',
    },
    'empathetic': {
        'greeting': 'Prezado(a)',
        'close': 'Entendo sua preocupação e estou trabalhando para resolver.',
        'signature': '— Kleber',
    },
}


def analyze_tone(subject: str, body: str = '', snippet: str = '') -> dict:
    """
    Analyze email tone using keyword/pattern matching.
    Returns dict with formality, urgency, emotion, confidence scores.
    """
    text = f"{subject or ''} {body or ''} {snippet or ''}"

    # ── Formality score ──────────────────────────────────────
    formal_hits = len(FORMAL_PATTERNS.findall(text))
    casual_hits = len(CASUAL_PATTERNS.findall(text))

    if formal_hits > casual_hits * 2 and formal_hits >= 2:
        formality = 'formal'
        formality_score = min(1.0, 0.5 + formal_hits * 0.1)
    elif casual_hits > formal_hits and casual_hits >= 1:
        formality = 'casual'
        formality_score = min(1.0, 0.5 + casual_hits * 0.1)
    else:
        formality = 'neutral'
        formality_score = 0.5

    # ── Urgency score ───────────────────────────────────────
    urgent_hits = len(URGENT_PATTERNS.findall(text))
    high_hits = len(HIGH_PATTERNS.findall(text))
    excl_hits = len(EXCLAMATION_PATTERN.findall(text))
    caps_hits = len(ALL_CAPS_PATTERN.findall(text))
    qst_hits = len(QUESTION_PATTERN.findall(text))

    urgency_score = 0
    urgency_score += urgent_hits * 0.25
    urgency_score += high_hits * 0.15
    urgency_score += excl_hits * 0.1
    urgency_score += caps_hits * 0.15
    urgency_score += qst_hits * 0.05

    urgency_score = min(1.0, urgency_score)

    if urgency_score >= 0.6:
        urgency = 'urgent'
    elif urgency_score >= 0.3:
        urgency = 'moderate'
    else:
        urgency = 'normal'

    # ── Emotion score ────────────────────────────────────────
    positive_hits = len(POSITIVE_PATTERNS.findall(text))
    negative_hits = len(NEGATIVE_PATTERNS.findall(text))

    if positive_hits > negative_hits and positive_hits >= 2:
        emotion = 'positive'
        emotion_score = min(1.0, 0.5 + positive_hits * 0.1)
    elif negative_hits > positive_hits and negative_hits >= 1:
        emotion = 'negative'
        emotion_score = min(1.0, 0.5 + negative_hits * 0.15)
    else:
        emotion = 'neutral'
        emotion_score = 0.5

    # ── Overall confidence ───────────────────────────────────
    text_len = len(text.strip())
    total_pattern_hits = formal_hits + casual_hits + urgent_hits + high_hits + positive_hits + negative_hits

    confidence = 0.3  # baseline

    if text_len > 50:
        confidence += 0.1
    if total_pattern_hits >= 2:
        confidence += 0.1
    if total_pattern_hits >= 5:
        confidence += 0.2

    # Boost when signals are consistent
    if (formality == 'formal' and emotion == 'negative') or \
       (formality == 'casual' and emotion == 'positive'):
        confidence += 0.1

    if urgent_hits >= 2:
        confidence += 0.1

    confidence = min(1.0, confidence)

    # ── Matched response tone ────────────────────────────────
    if urgency == 'urgent':
        response_tone = 'urgent'
    elif emotion == 'negative' and formality == 'formal':
        response_tone = 'formal_negative'
    elif emotion == 'negative':
        response_tone = 'empathetic'
    elif formality == 'formal' and emotion == 'positive':
        response_tone = 'formal_positive'
    elif formality == 'formal':
        response_tone = 'formal_neutral'
    elif emotion == 'positive':
        response_tone = 'casual_positive'
    elif emotion == 'negative':
        response_tone = 'casual_negative'
    else:
        response_tone = 'casual_neutral'

    # Get adaptation template
    adaptation = TONE_ADAPTATION.get(response_tone, TONE_ADAPTATION['casual_neutral'])

    return {
        'formality': formality,
        'formality_score': round(formality_score, 2),
        'urgency': urgency,
        'urgency_score': round(urgency_score, 2),
        'emotion': emotion,
        'emotion_score': round(emotion_score, 2),
        'confidence': round(confidence, 2),
        'response_tone': response_tone,
        'adaptation': adaptation,
        'pattern_hits': {
            'formal': formal_hits,
            'casual': casual_hits,
            'urgent': urgent_hits,
            'high': high_hits,
            'positive': positive_hits,
            'negative': negative_hits,
            'exclamations': excl_hits,
            'caps_words': caps_hits,
            'questions': qst_hits,
        },
    }


def generate_adapted_response(sender_name: str, intent: str, tone_analysis: dict, custom_close: str = '') -> str:
    """
    Generate a response with tone-adapted greeting, body, and signature.
    """
    adaptation = tone_analysis['adaptation']
    greeting = adaptation['greeting']
    close = custom_close or adaptation['close']
    signature = adaptation['signature']

    body_lines = [
        f"{greeting} {sender_name},",
        '',
        f"Recebi sua solicitação sobre {intent}.",
        close,
        '',
        signature,
    ]

    # Add urgency note if applicable
    if tone_analysis['urgency'] == 'urgent':
        body_lines.insert(2, '⚠️  Prioridade identificada — estou tratando com a máxima atenção.')
    elif tone_analysis['emotion'] == 'negative':
        body_lines.insert(2, '🤝  Compreendo sua preocupação e vou acompanhar pessoalmente.')

    return '\n'.join(body_lines)


def analyze_email_tone(email_data: dict) -> dict:
    """
    Convenience wrapper: takes an email_data dict (subject, snippet, body)
    and returns tone analysis.
    """
    subject = email_data.get('subject', '')
    snippet = email_data.get('snippet', '')
    body = email_data.get('body', '')
    return analyze_tone(subject, body, snippet)


if __name__ == '__main__':
    # Self-test
    test_cases = [
        {
            'label': 'Formal positive business',
            'subject': 'Proposal Review and Confirmation',
            'snippet': 'Dear Kleber, thank you for the excellent proposal. We are pleased to confirm.',
        },
        {
            'label': 'Urgent emergency',
            'subject': 'URGENT: System is DOWN — critical issue',
            'snippet': 'Our production system has been offline for 30 minutes. This is an emergency. Please respond ASAP.',
        },
        {
            'label': 'Casual friendly',
            'subject': 'Hey! Quick question',
            'snippet': 'Hey Kleber! Thanks for the help yesterday. Just wanna check something real quick. Thx!',
        },
        {
            'label': 'Negative complaint',
            'subject': 'Complaint: Service not working',
            'snippet': 'I am very disappointed. The service is broken and unacceptable. This is a serious problem.',
        },
        {
            'label': 'Mixed neutral',
            'subject': 'Status update on project',
            'snippet': 'Just checking in on the project status. Let me know if there are any updates.',
        },
    ]

    print("=== V22 Adaptive Tone Matching — Self Test ===\n")
    for tc in test_cases:
        result = analyze_tone(tc['subject'], '', tc['snippet'])
        response = generate_adapted_response('Test User', 'test', result)
        print(f"Case: {tc['label']}")
        print(f"  Formality: {result['formality']} ({result['formality_score']})")
        print(f"  Urgency:   {result['urgency']} ({result['urgency_score']})")
        print(f"  Emotion:   {result['emotion']} ({result['emotion_score']})")
        print(f"  Confidence: {result['confidence']}")
        print(f"  Response Tone: {result['response_tone']}")
        print(f"  Generated Response:")
        for line in response.split('\n')[:4]:
            print(f"    {line}")
        print()

    print("=== Self-test complete ===")