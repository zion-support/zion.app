#!/usr/bin/env python3
"""
V34-C: Account Tag Isolation
Batch jobs carry an account/gmail_source tag so GRC rules apply per-account.
"""

def tag_email(
    email_id: str,
    gmail_source: str,
    account_meta: dict = None,
    extras: dict = None,
) -> dict:
    meta = account_meta or {}
    ex = extras or {}
    tags = []

    if meta.get("dc_only"):
        tags.append("dc-only")
    if meta.get("agency_cco"):
        tags.append("agency-cco")
    if meta.get("esp_verified"):
        tags.append("esp-verified")
    if meta.get("production"):
        tags.append("production")

    for t in ex.get("force_tags") or []:
        if t not in tags:
            tags.append(t)

    return {
        "email_id": email_id,
        "gmail_source": gmail_source,
        "tags": tags,
    }


def batch_tag(emails: list[dict]) -> list[dict]:
    return [tag_email(e["email_id"], e["gmail_source"], e.get("account_meta")) for e in emails]


def filter_by_tag(tagged: list[dict], tag: str) -> list[dict]:
    return [t for t in tagged if tag in t.get("tags", [])]
