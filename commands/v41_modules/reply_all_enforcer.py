#!/usr/bin/env python3
"""V41-B: Autopilot Reply-All Blocks"""
from __future__ import annotations
import json
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
DATA = REPO / "data"
CFG  = DATA / "config" / "static.config.json"
LOG_PATH = DATA / "logs" / "autopilot_blocks.log"


@dataclass
class AutopilotBlockEvent:
    ts:         str = field(default_factory=lambda: datetime.utcnow().isoformat())
    gate:       str = "autopilot_block"
    thread_id:  str = ""
    tier:       str = ""
    reply_depth:int = 0
    max_depth:  int = 0
    action:     str = ""
    reason:     str = ""
    def to_dict(self) -> dict:
        return asdict(self)


def _log(ev: AutopilotBlockEvent) -> None:
    try:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with LOG_PATH.open("a") as f:
            f.write(json.dumps(ev.to_dict()) + "\n")
    except Exception:
        pass


def load_cfg(path=None) -> dict:
    p = Path(path) if path else CFG
    try:
        if p.exists():
            return json.loads(p.read_text())
    except Exception:
        pass
    return {}


def tier_depth(tier="", cfg=None) -> int:
    c = cfg or load_cfg()
    tiers = c.get("autopilot", {}).get("tiers", {})
    if tier and tier in tiers:
        return int(tiers[tier].get("max_reply_all_depth", 0))
    return int(c.get("autopilot", {}).get("tiers_default", {}).get("max_reply_all_depth", 4))


class AutopilotBlocks:
    def __init__(self, cfg_path=None):
        self._cfg = load_cfg(cfg_path)

    def _tier_depth(self, tier="") -> int:
        return tier_depth(tier, self._cfg)

    def check(self, thread_id="", tier="",
              reply_all_depth=0,
              deadline_seconds=0, elapsed=0) -> dict:
        t_max  = self._tier_depth(tier)
        blocked = reply_all_depth > t_max
        r: dict = {"blocked": blocked, "reply_all_depth": reply_all_depth,
                   "max_allowed": t_max, "tier": tier or "default",
                   "thread_id": thread_id}
        if blocked:
            r["reason"] = f"depth={reply_all_depth} > tier_max={t_max} for tier={tier or 'default'}"
        ev = AutopilotBlockEvent(
            thread_id=thread_id, tier=tier or "default",
            reply_depth=reply_all_depth, max_depth=t_max,
            action="block" if blocked else "pass",
            reason=r["reason"] if blocked else "")
        _log(ev)
        return r


def inject_autopilot_blocks(thread_id="", tier="",
                            depth=0, deadline=0, elapsed=0) -> dict:
    return _APB.check(thread_id, tier, depth, deadline, elapsed)


_APB = AutopilotBlocks()
