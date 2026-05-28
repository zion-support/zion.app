#!/usr/bin/env python3
"""
Thread Summarizer for Email Responder.
Produces a 1-2 sentence extractive summary of an email thread.
Falls back to empty string on any error.
"""

import re
from pathlib import Path
from typing import List, Dict

# Reuse the same workspace resolution as the main responder
import sys
home = Path.home()
WORKSPACE = home / '.openclaw' / 'workspace'
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

# We'll need to fetch thread messages; we try to import gmail_thread_get from google_workspace
try:
    from google_workspace import gmail_thread_get
except Exception:
    # Fallback function that returns empty list
    def gmail_thread_get(thread_id):
        return []

class ThreadSummarizer:
    def __init__(self):
        # Reuse intent keywords for scoring sentences (same as in IntentConfidenceScorer)
        # V46: use inline fallback keywords if ICS not available
        _ics_keywords = {
            'urgent': {'urgent','urgente','critical','crítico','asap','emergency','emergência'},
            'support': {'help','ajuda','support','suporte','error','erro','bug','broken','quebrado'},
            'sales': {'pricing','quote','proposal','interest','buy','orçamento','preço'},
            'booking': {'book','reservar','booking','reservation','check-in','check-out','confirm'},
            'partnership': {'partner','partnership','parceria','collab'},
            'cancellation': {'cancel','cancelar','refund','reembolso','chargeback'},
            'follow_up': {'follow','update','status','check','acompanhar'},
           }
        self.intent_keywords = _ics_keywords
        # We'll also consider common email phrases as low-value (to avoid picking signatures, etc.)
        self.stop_phrases = {
            'best regards', 'kind regards', 'thanks and regards', 'thank you',
            'sincerely', 'yours faithfully', 'yours truly', 'regards', 'thanks',
            'thank you and best regards', 'cheers', 'ciao', 'saludos', 'atenciosamente',
            'cordialmente', 'attentamente', 'gratefully', 'respectfully'
        }

    def _is_stop_sentence(self, sentence: str) -> bool:
        lowered = sentence.lower().strip()
        # Check if the sentence is mostly a stop phrase
        for ph in self.stop_phrases:
            if ph in lowered and len(lowered) < len(ph) + 10:
                return True
        return False

    def _score_sentence(self, sentence: str) -> float:
        """
        Score a sentence by the sum of intent keyword weights it contains.
        We give each keyword a weight of 1.0. Normalize by sentence length to avoid bias towards long sentences.
        """
        words = re.findall(r"\b[\w']+\b", sentence.lower())
        if not words:
            return 0.0
        score = 0
        for w in words:
            for kw_set in self.intent_keywords.values():
                if w in kw_set:
                    score += 1
                    break  # each word counted at most once
        # Normalize by number of words (but avoid zero)
        return score / len(words)

    def summarize(self, thread_id: str, max_sentences: int = 2) -> str:
        """
        Returns a summary string of up to max_sentences sentences.
        If any error occurs, returns empty string.
        """
        try:
            if not thread_id:
                return ""
            # Fetch thread messages (list of message dicts)
            messages = gmail_thread_get(thread_id)
            if not messages:
                return ""

            # Extract subject and snippet from each message
            texts = []
            for msg in messages:
                # Try to get subject and snippet from the message payload
                subject = ""
                snippet = ""
                payload = msg.get('payload', {})
                headers = payload.get('headers', [])
                for h in headers:
                    if h.get('name', '').lower() == 'subject':
                        subject = h.get('value', '')
                        break
                # The snippet is often in the top-level message dict
                snippet = msg.get('snippet', '')
                # Combine
                combined = f"{subject} {snippet}".strip()
                if combined:
                    texts.append(combined)

            if not texts:
                return ""

            # Split each text into sentences (simple split by ., !, ?)
            sentences = []
            for t in texts:
                # Split by punctuation followed by space or end
                parts = re.split(r'(?<=[.!?])\s+', t)
                for p in parts:
                    p = p.strip()
                    if p and len(p) >= 10:  # ignore very short fragments
                        sentences.append(p)

            if not sentences:
                return ""

            # Score each sentence
            scored = [(self._score_sentence(s), s) for s in sentences if not self._is_stop_sentence(s)]
            if not scored:
                # Fallback: if all sentences are stop phrases, just take the first two original sentences
                return " ".join(sentences[:max_sentences])

            # Sort by score descending
            scored.sort(key=lambda x: x[0], reverse=True)
            # Take top max_sentences
            top = [s for _, s in scored[:max_sentences]]
            # Return as a single string
            return " ".join(top)
        except Exception:
            # Any error -> empty string to keep system running
            return ""

if __name__ == '__main__':
    # Simple test (requires a valid thread_id to work; we'll just show the class)
    summarizer = ThreadSummarizer()
    print("ThreadSummarizer ready. Provide a thread_id to summarize.")