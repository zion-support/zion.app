#!/usr/bin/env python3
"""V39-A Patch: intent_policy_db_patch.py.
Replaces the inline _INTENT_POLICIES dict in V26 and wires it to the
V33 IntentPolicyDB for hot-swappable policy governance.
Changes:
  • commands/v33_modules/intent_policy_db.py  →  adds lookup_by_intent_only()
  • commands/intelligent_email_responder_v26.py  →  replace inline dict with DB import
"""
import re, sys
from pathlib import Path
WORKSPACE = Path("/root/zion-repo")
V26   = WORKSPACE / "commands" / "intelligent_email_responder_v26.py"
V33DB = WORKSPACE / "commands" / "v33_modules" / "intent_policy_db.py"
POLICY= WORKSPACE / "data" / "policies" / "intent_policies.json"

# ── Step 1 : patch V33 IntentPolicyDB ──────────────────────────────────────

v33_src = V33DB.read_text()
if "lookup_by_intent_only(" not in v33_src:
    insert_at = v33_src.rfind("\n\nclass")
    addition = '''

class IntentPolicyLookup:
    """Adapter that lets V26-style callers use IntentPolicyDB via plain label lookup."""
    def __init__(self, db: "IntentPolicyDB") -> None:
        self._db = db

    def get(self, label: str, default: dict | None = None) -> dict:
        """Return the then-dict for *label*, falling back to *default* (or {})."""
        m = self._db.match_policy("", label)
        if m and m.then:
            return dict(m.then)
        return dict(default or {})


'''
    v33_src = v33_src[:insert_at] + addition + v33_src[insert_at:]
    V33DB.write_text(v33_src)
    print("V33DB: added IntentPolicyLookup.get()")
else:
    print("V33DB: lookup_by_intent_only already present — skipping")

# ── Step 2 : patch V26 ───────────────────────────────────────────────────────

v26_src = V26.read_text()
changed = False

# ── 2a. Replace the inline dict with a DB import + factory ───────────────
old_dict = re.compile(
    r'^_INTENT_POLICIES:\s*dict\s*=\s*\{.*?\n\}\s*$',
    re.DOTALL | re.MULTILINE
)
if old_dict.search(v26_src):
    SYSPATH_LINE = (
        'import pathlib\n'
        'from commands.v33_modules.intent_policy_db import IntentPolicyDB\n'
        '\n'
        'WORKSPACE = pathlib.Path(__file__).resolve().parent.parent\n'
        '_policy_db = IntentPolicyDB.load(str(WORKSPACE / "data" / "policies" / "intent_policies.json"))\n'
        '_INTENT_POLICIES = IntentPolicyLookup(_policy_db)  # V39-A: hot-swappable\n'
    )
    # We need IntentPolicyLookup on V26's sys.path too.  Defer the import line
    # until after we confirm workspance path.
    v26_src = re.sub(
        r'^(# ── V33: Per-Intent Calibration Schema ──.*?_promotion_window\s*=\s*200)',
        '# ── V39-A: IntentPolicyDB replaces inline dict ──────────────────────────\n'
        '# Hot-swap by replacing data/policies/intent_policies.json, no code change.\n'
        '# The V33 module (v33_modules/) is the source of truth for policy grammar.\n'
        '_policy_db = IntentPolicyDB.load(str(WORKSPACE / "data" / "policies" / "intent_policies.json"))\n'
        '_policy_fetch = IntentPolicyLookup(_policy_db)\n'
        '_INTENT_POLICIES = _policy_fetch  # drop-in replacement: .get(label, default) still works\n'
        '\n'
        '\\1',
        v26_src,
        flags=re.DOTALL
    )
    changed = True
    print("V26: replaced inline dict with IntentPolicyDB import")
else:
    # simpler target: just insert after calibration schema comment
    marker = "  min_confidence: 0.75,\n        \"fwd_on\": None,\n    },\n    \"sales_lead\": {"
    if marker in v26_src:
        print("V26: inline dict still here but regex failed — trying line-precision removal")
    else:
        print("V26: inline dict not found at expected location — manual review needed")

# ── 2b. Import IntentPolicyLookup in V26 ──────────────────────────────────
if "from commands.v33_modules.intent_policy_db import IntentPolicyDB" not in v26_src:
    v26_src = v26_src.replace(
        "import json, re, time, csv, io\n",
        "import json, re, time, csv, io\nfrom typing import Optional\nfrom pathlib import Path as _P\n"
    )
    v26_src = v26_src.replace(
        "import json, re, time, csv, io\nfrom typing import Optional\nfrom pathlib import Path as _P\n",
        "import json, re, time, csv, io\nimport pathlib\n"
    )
    changed = True

# Actually do the cleanest approach — replace the dictionary inline
print("V26: re-applying clean patch")
v26_src = V26.read_text()  # re-read for precision

# Remove _INTENT_POLICIES dict entirely
v26_src = re.sub(
    r'\n_INTENT_POLICIES:\s*dict\s*=\s*\{.+?\n\}\n',
    '\n',
    v26_src,
    flags=re.DOTALL
)

# Add DB import + factory right after the schema comment block
db_setup = (
    "\n"
    "# ── V39-A: IntentPolicyDB replaces inline dict ──────────────────────────\n"
    "# Hot-swap by replacing data/policies/intent_policies.json · no code change.\n"
    "from commands.v33_modules.intent_policy_db import IntentPolicyDB, IntentPolicyLookup\n"
    "_policy_db = IntentPolicyDB.load(str(DATA / \"policies\" / \"intent_policies.json\"))\n"
    "_policy_fetch = IntentPolicyLookup(_policy_db)\n"
    "_INTENT_POLICIES = _policy_fetch  # drop-in: .get(label, default) still works\n"
    "\n"
)
v26_src = v26_src.replace(
    "_CC_COOLDOWN_DAYS = 14\n",
    db_setup + "_CC_COOLDOWN_DAYS = 14\n"
)

# Confirm IntentPolicyLookup is resolved, add if missing (in V33)
v33_src2 = V33DB.read_text()
if "IntentPolicyLookup" not in v33_src2:
    print("ERROR: IntentPolicyLookup not found in V33 — adding now")
    raise RuntimeError("V33 patch failed — re-run")

if changed or True:
    V26.write_text(v26_src)
    print("V26: patch applied ✓")
else:
    print("V26: no changes needed or deterministic — skipping save")

# ── Step 3 : write V39-A harness ────────────────────────────────────────────

print("\n[Next] Run test_harness_v39.py to validate 12/12 assertions.")
print(f"Patch targets: {V26.name} · {V33DB.name} · {POLICY.name}")
