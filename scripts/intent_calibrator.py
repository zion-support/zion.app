#!/usr/bin/env python3
"""scripts/intent_calibrator.py — per-intent grammar threshold calibration.

Reads: data/v26_stats.jsonl
Writes: data/calibration_adj.jsonl
Exit 0: py_compile passes (self-contained, no deps on _INTENT_POLICIES source file)
"""

import json
from collections import defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
STATS_FILE = DATA / "v26_stats.jsonl"
ADJ_OUT    = DATA / "calibration_adj.jsonl"
IMMUNE    = {"invoice", "billing"}
MIN_N     = 10        # minimum sample per intent

def main(auto_apply=False):
    rows = []
    if STATS_FILE.exists():
        for line in STATS_FILE.read_text().splitlines():
            try: rows.append(json.loads(line))
            except Exception: pass

    by_intent = defaultdict(lambda: {"sent": [], "blocked": []})
    for r in rows:
        intent = r.get("intent", r.get("thread_intent", "?"))
        action = r.get("action", "")
        g      = r.get("grammar_score", r.get("overall", 0))
        try: g = float(g)
        except Exception: g = 0.0
        if action in ("send", "send_fast", "sent"):
            by_intent[intent]["sent"].append(g)
        elif action in ("review", "reviewed"):
            by_intent[intent]["blocked"].append(g)

    adj = {}
    for intent, d in sorted(by_intent.items()):
        n = len(d["sent"]) + len(d["blocked"])
        if n < MIN_N:
            adj[intent] = {"adjustment": 0, "reason": "insufficient_data", "n": n}
            continue
        if intent.lower().replace(" ", "_") in IMMUNE:
            adj[intent] = {"adjustment": 0, "reason": "immune_intent", "n": n}
            continue

        fp_rate = sum(1 for g in d["sent"] if g < 65) / max(len(d["sent"]), 1)
        fn_rate = sum(1 for g in d["blocked"] if g >= 75) / max(len(d["blocked"]), 1)
        delta = 0
        reasons = []
        if fp_rate > 0.05:
            delta += max(1, int(fp_rate * 100 / 5))
            reasons.append(f"fp_rate={fp_rate:.1%}")
        if fn_rate > 0.03:
            delta -= max(1, int(fn_rate * 100 / 3))
            reasons.append(f"fn_rate={fn_rate:.1%}")
        adj[intent] = {
            "adjustment": delta, "reason": "; ".join(reasons) or "stable",
            "n": n,
            "fp_rate": round(fp_rate, 4),
            "fn_rate": round(fn_rate, 4),
        }

    lines = [json.dumps({"intent": k, **v}) for k, v in adj.items()]
    ADJ_OUT.write_text("\n".join(lines) + "\n")
    print(f"IDEAS-1: {len(adj)} intents → {ADJ_OUT}")
    for i, v in adj.items():
        print(f"  {str(i):30s} adj={v['adjustment']:+3d}  reason={v['reason']}")

    if auto_apply:
        # Read source, patch thresholds
        src = COMMANDS / "intelligent_email_responder_v26.py"
        if src.exists():
            text = src.read_text()
            for intent, info in adj.items():
                delta = info["adjustment"]
                if delta == 0:
                    continue
                key  = f'"{intent}":'
                # Find "_INTENT_POLICIES" block then each intent dict
                # Grammar threshold line is the next "grammar_threshold": <N> line
                pos  = text.find(key)
                if pos == -1:
                    continue
                start = text.find('"grammar_threshold"', pos)
                end   = text.find(',', start)
                snippet = text[start:end]
                # Extract current value
                m = __import__('re').search(r'(\d+)', snippet)
                if not m:
                    continue
                old_val = int(m.group(1))
                new_val = max(50, min(95, old_val + delta))
                if new_val == old_val:
                    continue
                print(f"  AUTO-APPLY {intent}: {old_val} → {new_val}  (delta={delta:+d})")
                new_snippet = f'"grammar_threshold": {new_val}'
                text = text[:start] + new_snippet + text[end:]
            src.write_text(text)
            print("AUTO-APPLY: _INTENT_POLICIES patched in intelligent_email_responder_v26.py")

if __name__ == "__main__":
    import sys
    auto = "--auto-apply" in sys.argv
    main(auto_apply=auto)
