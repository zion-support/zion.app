# Changelog

All notable changes to the intelligent email responder workspace.

## [V30] — 2026-05-22

### Intelligence Layer — 9 new modules (`commands/v30_modules/`)

| Module | Purpose |
|--------|---------|
| `reply_all_extractor` | CC address chain: thread_participants → original CC → to_others → contacts |
| `response_self_verifier` | 6-dimension post-compose check: placeholders, sign-off, name reference, policy, leakage, tone |
| `reply_all_validator` | Fail-closed CC gate: invalid CC → review, empty CC → block |
| `intent_reasoning_auditor` | Per-case WHY log: intent score, route, boost applied, reply-all rationale, overrides |
| `attachment_content_analyzer` | Content-based routing: filename + content preview → category → action (invoice, legal, deck…) |
| `sender_reputation_tracker` | Tier progression: unknown → known → trusted → vip; escalation signal on risky/spam senders |
| `urgency_normalizer` | Thread-age decay: urgent <24h keep, 24-48h → high, >48h → medium; multi-message thread decay too |
| `meeting_slot_suggester` | 2-3 concrete time slots in reply body (EN/PT templates) |
| `outcome_auto_learner` | Daily FP rate computation from v26_run_log.jsonl → auto grammar_threshold tuning |

### Test infrastructure
- `commands/v30_modules/test_harness_v30.py` — 8 scenarios × 3 assertions = 24 checks
- `commands/v30_modules/golden_responses.json` — 8 × 16 case fixtures (types × GRC variants)

### Policy changes
- Reply-all enforced for: urgent, meeting, partnership (profile-driven)
- Financial & invoice intents added to `_INTENT_POLICIES` (grammar=85, conf=0.90, cc=no_cc)
- Urgency decay: 24h window for urgent→high, 48h for high→medium
- CC cooldown: skip `use_cc` when sender had last CC action <14 calendar days ago

### GRC additions
- Agency CC enforcement: agencies always in copy on replies
- ESP-verified domain pass-through
- DC (data center) email segregation
- Dedicated IP setup documented in `_INTENT_POLICIES`
- DMARC recipient routing

---
### Prior versions (references)

#### [V29]
- FEAT-1: calendar_overlay injected into meeting reply body
- FEAT-2: deadline injection in forcesend.txt
- FEAT-3: CC cooldown (14 days) + reply_to_override (Reply-To MIME header)
- FEAT-4: invoice/billing intents in `_INTENT_POLICIES`
- Commit: `2d873ba34607`

#### [V28]
- FEAT-1: reply_all enforcement — only suppress if spelling/fuzzy match in sending message, not same-person heuristic
- Commit: `3889a2df804b`

#### [V27]
- `CascadingLatencyDetector`: relaxed `_SEGMENT_CACHE` TTL from 300 to 600 s; `count_same_sender` whitelist extended to 32 addresses (regex `vip|partner|founder|stealth|hunter|hart|pontes|dias|hori`)
- `force_send_every()` threshold: 2 → 3
- HOTFIX: suppress `---forwarded message---` headers leaking in reply-all sends (only suppress in non-auto forward context)
- Commit: `3889a2df804b`
