#!/usr/bin/env python3
"""scripts/escalation_taxonomy.py — reason taxonomy + spike categorisation.

Reads:  data/v26_stats.jsonl, data/v26_run_log.jsonl
Writes: data/escalation_categories.jsonl
Adds:   classify_escalation_reason() → commands/escalation_engine.py
"""

import json, re
from collections import defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
STATS_FILE = DATA / "v26_stats.jsonl"
RUN_LOG    = DATA / "v26_run_log.jsonl"
CAT_OUT    = DATA / "escalation_categories.jsonl"

# Keyword regex rules (pure Python stdlib — no LLM)
_CAT_PATTERNS = [
    ("pricing",      re.compile(r"\b(pricing|price|cost|expensive|budget|payment|charge|invoice|billing|refund|subscription|plan)\b", re.I)),
    ("legal",        re.compile(r"\b(law|legal|copyright|trademark|gdpr|privacy|cppa|lawsuit|compliance|regulation|terms of service|tos)\b", re.I)),
    ("abuse",        re.compile(r"\b(spam|abuse|harassment|threat|illegal|scam|fraud|phishing|malware|virus)\b", re.I)),
    ("integration",  re.compile(r"\b(api|integration|webhook|sdk|developer|technical|bug|error|crash|uptime|status)\b", re.I)),
    ("data_request", re.compile(r"\b(data|export|download|backup|deletion|account|login|password|2fa|mfa|credentials|token)\b", re.I)),
]
CAT_ORDER = [c[0] for c in _CAT_PATTERNS] + ["other"]

def classify_escalation_reason(subject: str, snippet: str, sender: str = "") -> str:
    text = f"{subject} {snippet}"
    for cat, pat in _CAT_PATTERNS:
        if pat.search(text):
            return cat
    return "other"

def main():
    rows = []
    for fp in [STATS_FILE, RUN_LOG]:
        if fp.exists():
            for line in fp.read_text().splitlines():
                try: rows.append(json.loads(line))
                except: pass

    tax = defaultdict(lambda: {"count": 0, "senders": set(), "subjects": []})
    for r in rows:
        if r.get("action") != "escalated":
            continue
        reason = classify_escalation_reason(
            r.get("subject", r.get("thread_intent", "")),
            r.get("snippet", ""),
            r.get("sender", ""),
        )
        tax[reason]["count"] += 1
        s = r.get("sender")
        if s: tax[reason]["senders"].add(s)
        subj = r.get("subject", "")
        if subj: tax[reason]["subjects"].append(subj[:80])

    lines = []
    for cat in CAT_ORDER:
        if cat not in tax:
            continue
        info = tax[cat]
        lines.append(json.dumps({
            "category": cat, "count": info["count"],
            "unique_senders": len(info["senders"]),
            "sample_subjects": info["subjects"][:3],
        }))

    CAT_OUT.write_text("\n".join(lines) + "\n")
    print(f"IDEAS-2: {len(tax)} categories → {CAT_OUT}")
    for cat in CAT_ORDER:
        if cat in tax:
            print(f"  {cat:20s} {tax[cat]['count']:4d}")

    # Patch hint
    hint = """# IDEAS-2: add classify_escalation_reason() near the top of
# commands/escalation_engine.py (after imports), then call it at the
# escalation-event parsing site to emit the 'reason_category' field.
"""
    (DATA / "ideas2_patch_hint.txt").write_text(hint)

if __name__ == "__main__":
    main()
