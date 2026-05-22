#!/usr/bin/env python3
"""IDEAS-3 CC Memory Indexer — reads reply_all_cache.json, emits data/cc_memory.jsonl.

Usage:
    python scripts/cc_memory_indexer.py          # prod (DATA/)
    python scripts/cc_memory_indexer.py --dry-run # /tmp/data/

Output: data/cc_memory.jsonl
  {"thread_id", "cc_addresses": [...], "last_used_at", "use_count"}
"""
import json, pathlib, sys, argparse
from datetime import datetime, timezone, timedelta

_CC_COOLDOWN_DAYS = 14
_RECENT_WINDOW = timedelta(days=90)

def run(src: pathlib.Path, dst: pathlib.Path) -> dict:
    """Index reply_all_cache.json → cc_memory.jsonl."""
    dst.parent.mkdir(parents=True, exist_ok=True)
    if not src.exists():
        print(f"Cache not found: {src}", file=sys.stderr)
        return {"indexed": 0, "skipped_cooldown": 0, "skipped_empty": 0}

    cache = json.loads(src.read_text())
    rows = []
    now = datetime.now(timezone.utc)
    indexed = skipped_cooldown = skipped_empty = 0

    for tid, entry in cache.items():
        participants = entry.get("thread_participants", [])
        if not participants:
            skipped_empty += 1
            continue

        decided_at_str = entry.get("decided_at", "")
        decided_at = None
        if decided_at_str:
            try:
                decided_at = datetime.fromisoformat(decided_at_str)
            except Exception:
                pass

        decided_ts = decided_at.isoformat() if decided_at else entry.get("decided_at", "")
        now_ts      = now.isoformat()

        recent_days = (now - decided_at).total_seconds() / 86400 if decided_at else 999
        too_recent = 0 <= recent_days < 1  # don't suggest CC used in the last 24 h

        cc_list = sorted(set(p.strip() for p in participants if "@" in p))

        rows.append({
            "thread_id":         tid,
            "cc_addresses":      cc_list[:10],
            "last_used_at":      decided_ts,
            "use_count":         entry.get("score", 0),
            "too_recent":        too_recent,
            "indexed_at":        now_ts,
        })
        indexed += 1

    with dst.open("w") as f:
        for row in rows:
            f.write(json.dumps(row) + "\n")

    print(f"cc_memory.jsonl: {indexed} threads indexed, "
          f"{skipped_cooldown} cooldown, {skipped_empty} empty → {dst}")
    return {"indexed": indexed, "skipped_cooldown": skipped_cooldown, "skipped_empty": skipped_empty}

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    root = pathlib.Path("/tmp/data") if args.dry_run else pathlib.Path.home() / ".openclaw/workspace/zion.app/data"
    src  = root / "reply_all_cache.json"
    dst  = root / "cc_memory.jsonl"
    run(src, dst)
