#!/usr/bin/env python3
"""
V31-P2: Cron Schedule Definitions
Job spec builder for hermetic cron jobs (outcome_learner, daily digest, etc.).
No external deps — produces a Structured job dict consumed by Hermes scheduler.
"""
import re

_CRON_RE = re.compile(r'^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)$')

def validate_cron_schedule(expr: str) -> bool:
    """Return True if expr is a valid 5-field cron expression."""
    return bool(_CRON_RE.match(expr.strip()))

def build_outcome_learner_job(
    schedule: str = "0 2 * * *",
    workdir: str = "",
    skills: list = None,
    log_path: str = "",
    deliver: str = "local",
) -> dict:
    """Return a job spec for the daily outcome learner cron.
    
    Args:
        schedule: cron expression (default 2am daily)
        workdir: workspace path for the job
        skills: ordered skill list to load before running
        log_path: where fp_rates.json is written
        deliver: 'local', 'telegram', or 'origin'
    """
    return {
        "name": "Daily Outcome Learner",
        "schedule": schedule,
        "workdir": workdir,
        "skills": skills or ["outcome_auto_learner"],
        "prompt": (
            "Run learn_from_outcomes(window_hours=48) and tune_thresholds_from_fp(). "
            "Write fp_rates.json and v30_policy_learned.json. "
            f"Read fp_rates.json and report: intents_analyzed, any intent below min_samples=5."
        ),
        "deliver": deliver,
        "no_agent": True,
    }

def build_digest_job(
    schedule: str = "30 8 * * *",
    deliver: str = "telegram",
    window_hours: int = 24,
) -> dict:
    """Daily morning digest: unread count, urgent threads, stats delta."""
    return {
        "name": "Daily Email Digest",
        "schedule": schedule,
        "workdir": "",
        "skills": [],
        "prompt": (
            f"Summarise last {window_hours}h: unread count, urgent threads, "
            "outcome_auto_learner fp_rates highlight, CC cooldown hits. "
            "Keep to 8 lines max."
        ),
        "deliver": deliver,
        "no_agent": False,
    }

def build_cc_memory_prune_job(
    schedule: str = "0 3 * * 0",
) -> dict:
    """Weekly Sunday prune: remove stale CC memory entries >90 days old."""
    return {
        "name": "Weekly CC Memory Prune",
        "schedule": schedule,
        "workdir": "",
        "skills": [],
        "prompt": (
            "Read reply_all_cache.json. Remove entries where last_cc_action > 90 days ago. "
            "Report: removed count, remaining count."
        ),
        "deliver": "local",
        "no_agent": True,
    }
