#!/usr/bin/env python3
"""
Response Uniqueness Checker for Intelligent Email Responder.

Checks the uniqueness of a generated response against previous responses
in the same email thread to avoid robotic and repetitive replies.
"""

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List
from collections import defaultdict

WORKSPACE = Path(__file__).resolve().parent.parent
DATA = WORKSPACE / 'data'
UNIQUENESS_LOG = DATA / 'response_uniqueness.jsonl'

# In-memory cache for recent responses per thread (thread_id -> list of responses)
_THREAD_RESPONSES: Dict[str, List[str]] = defaultdict(list)
_MAX_CACHE_PER_THREAD = 5  # Keep last 5 responses per thread

def _tokenize(text: str) -> set:
    """Simple tokenization: lowercase and split by non-alphanumeric."""
    words = re.findall(r'\b\w+\b', text.lower())
    return set(words)

def _jaccard_similarity(set1: set, set2: set) -> float:
    """Jaccard similarity between two sets."""
    if not set1 and not set2:
        return 1.0
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union > 0 else 0.0

def _load_thread_responses() -> None:
    """Load recent responses from the log file into memory."""
    global _THREAD_RESPONSES
    if not UNIQUENESS_LOG.exists():
        return
    try:
        with open(UNIQUENESS_LOG, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    record = json.loads(line)
                    thread_id = record.get('thread_id')
                    response = record.get('response_body')
                    if thread_id and response:
                        _THREAD_RESPONSES[thread_id].append(response)
                        # Keep only the last _MAX_CACHE_PER_THREAD
                        if len(_THREAD_RESPONSES[thread_id]) > _MAX_CACHE_PER_THREAD:
                            _THREAD_RESPONSES[thread_id] = _THREAD_RESPONSES[thread_id][-_MAX_CACHE_PER_THREAD:]
                except json.JSONDecodeError:
                    continue
    except Exception:
        # Fail silently to not disrupt email processing
        pass

def _save_uniqueness_record(thread_id: str, response_body: str, uniqueness_score: float) -> None:
    """Save a uniqueness record to the log file."""
    try:
        UNIQUENESS_LOG.parent.mkdir(parents=True, exist_ok=True)
        record = {
            "thread_id": thread_id,
            "response_body_preview": response_body[:200] if response_body else "",
            "uniqueness_score": uniqueness_score,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        with open(UNIQUENESS_LOG, 'a', encoding='utf-8') as f:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    except Exception:
        pass

def check_uniqueness(thread_id: str, response_body: str) -> float:
    """
    Check the uniqueness of a response against previous responses in the same thread.
    Returns a uniqueness score between 0.0 (completely repetitive) and 1.0 (fully unique).
    """
    if not response_body or not thread_id:
        return 1.0  # Cannot check, assume unique

    # Load cached responses if not already loaded
    if thread_id not in _THREAD_RESPONSES:
        _load_thread_responses()

    # Get previous responses for this thread
    prev_responses = _THREAD_RESPONSES.get(thread_id, [])
    if not prev_responses:
        # No previous responses, so this is unique
        return 1.0

    # Tokenize the new response
    new_tokens = _tokenize(response_body)

    # Compute similarity with each previous response and take the maximum
    max_similarity = 0.0
    for prev in prev_responses:
        prev_tokens = _tokenize(prev)
        similarity = _jaccard_similarity(new_tokens, prev_tokens)
        if similarity > max_similarity:
            max_similarity = similarity

    # Uniqueness is 1 - similarity (so high similarity -> low uniqueness)
    uniqueness = 1.0 - max_similarity
    # Clamp to [0, 1]
    uniqueness = max(0.0, min(1.0, uniqueness))

    # Save this response for future checks
    _THREAD_RESPONSES[thread_id].append(response_body)
    if len(_THREAD_RESPONSES[thread_id]) > _MAX_CACHE_PER_THREAD:
        _THREAD_RESPONSES[thread_id] = _THREAD_RESPONSES[thread_id][-_MAX_CACHE_PER_THREAD:]

    # Log the uniqueness check
    _save_uniqueness_record(thread_id, response_body, uniqueness)

    return uniqueness

def get_thread_uniqueness_stats(thread_id: str) -> Dict[str, Any]:
    """Get uniqueness statistics for a thread (for debugging/logging)."""
    if thread_id not in _THREAD_RESPONSES:
        _load_thread_responses()
    prev_responses = _THREAD_RESPONSES.get(thread_id, [])
    return {
        "thread_id": thread_id,
        "cached_responses_count": len(prev_responses),
        "responses": prev_responses[:3],  # first 3 for brevity,
    }

# Initialize on import
_load_thread_responses()