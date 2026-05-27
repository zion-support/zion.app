#!/usr/bin/env python3
from __future__ import annotations

"""
V25 Wave 2 — KB Grounding RAG

Lightweight retrieval from local knowledge bases to ground email responses
in *Zion Tech Group's* actual facts, not generic LLM training data.

No new database — reads from:
  • app/data/servicesData.json   (602 services, flat list of dicts)
  • docs/CTO-OPERATING-PHILOSOPHY.md
  • MEMORY.md / memory/           (curated company/process context)
  • USER.md                       (contact info, preferences)

Index is cheap: 602 services keyword-inverted index on (title + description + features),
built at module load.  Memoized per-session — no disk I/O after first call.

Public API:
  retrieve_context(category=None, keywords=None, max_services=3) -> dict
  build_prompt_context(email_subject, email_snippet) -> rich_text

Tracks grounding events to data/kb_grounding_log.jsonl for monitoring.
"""

import json, re, time
from datetime import datetime, timezone
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────
WORKSPACE = Path(__file__).resolve().parent.parent.parent
KB_SERVICES = WORKSPACE / 'app' / 'data' / 'servicesData.json'
KB_CTO      = WORKSPACE / 'docs' / 'CTO-OPERATING-PHILOSOPHY.md'
KB_USER     = WORKSPACE / 'USER.md'
KB_MEMORY   = WORKSPACE / 'MEMORY.md'
KB_LOGGING  = WORKSPACE / 'data' / 'kb_grounding_log.jsonl'

# ── Logging ──────────────────────────────────────────────────
def _log(event: dict):
    try:
        with open(KB_LOGGING, 'a') as f:
            f.write(json.dumps({**event, 'ts': datetime.now(timezone.utc).isoformat()},
                               ensure_ascii=False) + '\n')
    except Exception:
        pass

# ── Service Index (in-memory inverted keyword index) ─────────
_services_index: list[dict] = []
_category_buckets: dict[str, list[dict]] = {}
_index_built = False

def _build_index():
    global _services_index, _category_buckets, _index_built
    if _index_built:
        return

    # Load services
    if KB_SERVICES.exists():
        try:
            with open(KB_SERVICES) as f:
                raw = json.load(f)
            # Normalize: may be list or {"services": [...]}
            _services_index = raw if isinstance(raw, list) else raw.get('services',
                                    raw.get('ai', []))[:1000]
        except Exception as e:
            _log({'phase': 'index_build', 'error': str(e)})
            _services_index = []

    # Category buckets
    _category_buckets = {}
    for svc in _services_index:
        cat = svc.get('category', 'other').lower()
        _category_buckets.setdefault(cat, []).append(svc)

    _index_built = True
    _log({'phase': 'index_built', 'services': len(_services_index)})

def _search_services(query: str, category: str | None = None,
                     limit: int = 3) -> list[dict]:
    """Return top services matching query (keyword, case-insensitive)."""
    _build_index()
    pool = (_category_buckets.get(category, []) if category
            else _services_index)
    q = re.sub(r'[^\w\s]', '', query.lower()).strip()
    scored = []
    for svc in pool:
        blob = ' '.join([
            svc.get('title', ''),
            svc.get('description', ''),
            ' '.join(svc.get('features', [])),
            svc.get('category', ''),
        ]).lower()
        # Simple density score
        hits = sum(1 for w in q.split() if w and w in blob)
        if hits:
            scored.append((hits, svc))
    scored.sort(reverse=True)
    return [s for _, s in scored[:limit]]

# ── Company KB Loaders ───────────────────────────────────────
_cto_cache: str | None = None
_user_cache: str | None = None
_memory_cache: str | None = None

def _load_file(p: Path) -> str | None:
    try:
        return p.read_text(encoding='utf-8', errors='replace').strip()
    except Exception:
        return None

def get_cto_philosophy() -> str:
    global _cto_cache
    if _cto_cache is None:
        raw = _load_file(KB_CTO)
        _cto_cache = raw[:3000] if raw else '(CTO doc not found)'
    return _cto_cache

def get_user_profile() -> str:
    global _user_cache
    if _user_cache is None:
        raw = _load_file(KB_USER)
        _user_cache = raw[:2000] if raw else '(USER.md not found)'
    return _user_cache

def get_curated_memory() -> str:
    global _memory_cache
    if _memory_cache is None:
        raw = _load_file(KB_MEMORY)
        _memory_cache = raw[:2000] if raw else '(MEMORY.md not found)'
    return _memory_cache

# ── Contact info extractor ───────────────────────────────────
_CONTACT_CACHE = None

def get_contact_info() -> dict:
    global _CONTACT_CACHE
    if _CONTACT_CACHE is not None:
        return _CONTACT_CACHE

    defaults = {
        'email': 'kleber@ziontechgroup.com',
        'phone': '+1 302 464 0950',
        'address': '364 E Main St STE 1008, Middletown DE 19709',
        'commercial': 'commercial@ziontechgroup.com',
        'support': 'support@ziontechgroup.com',
        'website': 'https://ziontechgroup.com',
    }
    try:
        from userlens_contact_extractor import get_userlens_contact  # type: ignore
        _CONTACT_CACHE = {**defaults, **get_userlens_contact()}
        return _CONTACT_CACHE
    except Exception:
        _CONTACT_CACHE = defaults
        return defaults

# ── Main Public API ──────────────────────────────────────────

def retrieve_context(category: str | None = None,
                     keywords: list[str] | None = None,
                     max_services: int = 3) -> dict:
    """
    Return structured KB context suitable for prompt injection.

    Response shape:
    {
      'services': [title, desc, features, pricing, href] × max_services,
      'company':       'Zion Tech Group — AI & IT solutions …',
      'contact':       'email · phone · address · website',
      'cto_philosophy': '… max 3000 chars …',
      'curated_memory':'… max 2000 chars …',
      'grounding_note': 'You are answering as Kleber, CTO, Zion Tech Group.',
    }
    """
    t0 = time.monotonic()
    _build_index()

    # ── Services ────────────────────────────────────────────
    services = []
    if category or keywords:
        for kw in (keywords or [])[:3]:
            hits = _search_services(kw, category=category, limit=max_services)
            for h in hits:
                if h['id'] not in [s['id'] for s in services]:
                    services.append(h)
            if len(services) >= max_services:
                break
        if not services:
            # Fallback: browse category top services
            if category:
                services = _category_buckets.get(category, [])[:max_services]
            else:
                services = _services_index[:max_services]

    services_out = []
    for svc in services[:max_services]:
        services_out.append({
            'title':       svc.get('title', ''),
            'description': svc.get('description', ''),
            'features':    svc.get('features', [])[:4],
            'pricing':     svc.get('pricing', {}),
            'href':        svc.get('href', ''),
        })

    # ── Company ─────────────────────────────────────────────
    company = ('Zion Tech Group — AI and IT services for enterprises: '
               'AI agents · cloud · security · data · automation · SaaS. '
               'Status: live → https://ziontechgroup.com/status')
    contact = get_contact_info()
    contact_str = (f"email: {contact['email']} | commercial: {contact['commercial']} | "
                   f"phone: {contact['phone']} | address: {contact['address']}")

    context = {
        'services':       services_out,
        'company':        company,
        'contact':        contact_str,
        'cto_philosophy': get_cto_philosophy()[:3000],
        'curated_memory': get_curated_memory()[:2000],
        'grounding_note': (
            'You are Kleber Garcia Alcatrão, CTO of Zion Tech Group. '
            'Answer factually from the company context above — never invent services, '
            'prices, or capabilities not listed. When unsure, say so and offer to follow up.'
        ),
    }

    elapsed = round((time.monotonic() - t0) * 1000, 1)
    _log({'phase': 'retrieve', 'category': category, 'keywords': keywords,
          'services_returned': len(services_out), 'elapsed_ms': elapsed})
    return context

def build_prompt_context(email_subject: str, email_snippet: str,
                          category: str | None = None) -> str:
    """
    Build a ready-to-inject prompt context string.
    Call this at the top of `_pipeline` (before template selection).
    """
    ctx = retrieve_context(category=category,
                           keywords=[email_subject, *email_snippet.split()[:5]])
    lines = [
        '=== COMPANY CONTEXT (ground truth — do not contradict) ===',
        f'Company: {ctx["company"]}',
        f'Contact: {ctx["contact"]}',
    ]
    if ctx['services']:
        lines.append('Relevant services:')
        for svc in ctx['services']:
            lines.append(f"  • {svc['title']}: {svc['description'][:120]}")
    if ctx['cto_philosophy']:
        lines.append(f'Operating philosophy (excerpt):\n{ctx["cto_philosophy"][:1200]}')
    if ctx['curated_memory']:
        lines.append(f'Company context (excerpt):\n{ctx["curated_memory"][:800]}')
    lines.append(f'Guidance: {ctx["grounding_note"]}')
    return '\n'.join(lines)


# ── Self-test ─────────────────────────────────────────────────
if __name__ == '__main__':
    print("=== V25 Wave 2: KB Grounding RAG — Self-Test ===\n")
    ctx = retrieve_context(category='ai', keywords=['AI agent'])
    print(f"Company: {ctx['company'][:80]} …")
    print(f"Contact: {ctx['contact'][:80]} …")
    print(f"Services returned: {len(ctx['services'])}")
    if ctx['services']:
        print(f"Top service: {ctx['services'][0]['title']}")
    print(f"\nCTO philosophy excerpt: {ctx['cto_philosophy'][:80]} …")
    print(f"Memory excerpt: {ctx['curated_memory'][:80]} …")
    print(f"\nPrompt context (first 400 chars):\n{build_prompt_context('AI agent builder', 'need a tool builder')[:400]}")
    print("\n=== Self-test complete ===")
