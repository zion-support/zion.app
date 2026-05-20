#!/usr/bin/env python3
"""
Minimal exercise harness for V27ProfileEnricher.

Exercises all public methods and prints structured results for CI/audit.
run: python3 commands/test_index.py
"""
import sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from intelligent_email_responder_v27 import V27ProfileEnricher, get_cycle_state_record


def banner(title: str) -> None:
    bar = "=" * 60
    print(f"\n{bar}")
    print(f"  {title}")
    print(bar)


def main() -> None:
    enricher = V27ProfileEnricher()
    banner("V27ProfileEnricher exercise run")  # 1. Enrich one sender/category block
    enriched = enricher.enrich(
        sender="alice@example.com",
        intent_label="support",
        intent_categories=["support", "urgent"],
        confidence=0.82,
    )
    print(json.dumps(enriched, indent=2))

    # 2. Enrich another with lower confidence
    enriched2 = enricher.enrich(
        sender="bob@partner.com",
        intent_label="sales",
        intent_categories=["sales"],
        confidence=0.55,
    )
    print(json.dumps(enriched2, indent=2))

    # 3. Snapshot + elapsed_s
    snap = enricher.snapshot()
    print(f"\nCycle elapsed_s : {snap['elapsed_s']:.4f}s")
    print(f"Total enriched   : {snap['total_enriched']}")
    print(f"Sender buckets   : {list(snap['by_sender'].keys())}")

    # 4. Cycle-state record  (get_cycle_state_record)
    record = get_cycle_state_record(enricher)
    print(f"\nCycle-state record:")
    print(json.dumps(record, indent=2))

    # 5. Synthetic event loop (no LLM mock)
    banner("V27ProfileEnricher synthetic event loop")
    senders = ["alice@example.com", "bob@partner.com"]
    intents = [("support", 0.88), ("sales", 0.72), ("urgent", 0.91)]

    for _ in range(8):
        enr = enricher.enrich(
            sender=senders[_ % 2],
            intent_label=intents[_ % 3][0],
            intent_categories=[intents[_ % 3][0]],
            confidence=intents[_ % 3][1],
        )
        print(
            f"  event {_:2d}  sender={enr['sender'][:30]:30s}  "
            f"intent={enr['intent_label']:12s}  "
            f"risk={enr['risk']}"
        )

    snap2 = enricher.snapshot()
    print(f"\nTotal: {snap2['total_enriched']}, avg_ms: {snap2['avg_ms_per_enrichment']:.1f}")

    # 6. Manual rebalance
    enricher.rebalance("alice@example.com")
    new_rr = enricher.snapshot()["by_sender"]["alice@example.com"]
    print(f"\nAfter rebalance  alice@example.com rr={new_rr['rr']:.3f}")

    print("\n✅ V27ProfileEnricher exercise run PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
