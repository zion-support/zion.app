#!/usr/bin/env python3
"""
V25 Wave 8 — Attachment Awareness Module

Detects *both*:
  1. Gmail attachment metadata (filename, MIME type, size) via google_workspace
  2. Inline mentions of "attached file" / "see attached" / "see the document"
  3. Blob URLs referencing attached data in conversation context

Two modes:
  • stub mode  — fast-path pre-check (no Gmail call needed, snippet-based)
  • full mode  — calls gmail_get() for full message payload; parsing MIME tree

Output: dict with has_attachments, attachment_names, attachment_summary,
        stub_mode, and confidence. Can be included in response quality judgment
        and acknowledgment text in the reply body.
"""

import re, json
from datetime import datetime, timezone
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent
DATA      = WORKSPACE / 'data'

_ATTACH_RE = re.compile(
    r'\b(?:attached|attachment|enclosed|see attached|see the file|'
    r'anexo|documento|arquivo csv|pdf|spreadsheet|docx|xlsx)\b',
    re.IGNORECASE
)
_BLOB_URL   = re.compile(r'https?://[^\s]+/(blob|download|file)/[^\s]+', re.I)
_FNAME_RE   = re.compile(r'[\w.+-]+\.(pdf|xlsx?|docx?|csv|txt|png|jpg|zip|pptx?)', re.I)


def _fast_attachment_check(snippet: str, subject: str = '') -> dict:
    text = f"{subject} {snippet}"
    names = list(dict.fromkeys(_FNAME_RE.findall(text)))  # unique, order-preserved
    hits  = list(dict.fromkeys(_ATTACH_RE.findall(text)))
    urls  = _BLOB_URL.findall(text)
    has   = bool(names) or bool(hits) or bool(urls)
    return {
        "has_attachments":   has,
        "stub_mode":         True,
        "attachment_names":  names[:5],
        "attachment_hits":   hits[:3],
        "attachment_urls":   urls[:2],
        "attachment_summary": _describe(names[:3]),
        "confidence":        0.6 if has else 0.9,
    }


def _full_attachment_check(msg_id: str, gmail_get) -> dict:
    try:
        msg = gmail_get(msg_id)
        parts = msg.get("payload", {}).get("parts", [])
        attachments = []
        for part in parts:
            fname = part.get("filename", "")
            if fname and not fname.startswith("."):
                attachments.append({
                    "filename": fname,
                    "mimetype": part.get("mimeType", ""),
                    "size":     part.get("body", {}).get("size", 0),
                })
        names = [a["filename"] for a in attachments]
        return {
            "has_attachments":   bool(attachments),
            "stub_mode":         False,
            "attachment_names":  names[:10],
            "attachment_details": attachments,
            "attachment_summary": _describe(names[:5]),
            "confidence":        0.95 if attachments else 0.9,
        }
    except Exception as ex:
        _log({"phase": "full_attachment_check_error", "err": str(ex)})
        return {"has_attachments": False, "stub_mode": True,
                "attachment_names": [], "attachment_summary": "",
                "confidence": 0.0}


def _describe(names: list[str]) -> str:
    if not names:
        return ""
    n = len(names)
    if n == 1:  return f"attached file: {names[0]}"
    if n == 2:  return f"attached files: {names[0]} and {names[1]}"
    return f"attached files: {', '.join(names[:-1])} and {names[-1]}"


def check_attachments(msg_id: str = '', snippet: str = '', subject: str = '',
                       gmail_get=None) -> dict:
    if gmail_get and msg_id:
        return _full_attachment_check(msg_id, gmail_get)
    return _fast_attachment_check(snippet, subject)


# ── Logging ───────────────────────────────────────────────────
def _log(event: dict):
    try:
        log_path = DATA / 'attachment_log.jsonl'
        with open(log_path, 'a') as f:
            f.write(json.dumps({"ts": datetime.now(timezone.utc).isoformat(),
                                **event}) + '\n')
    except Exception:
        pass


# ── CLI self-test ────────────────────────────────────────────
if __name__ == '__main__':
    print("=== V25 Wave 8 — Attachment Awareness ===\n")
    cases = [
        ("No attach",       "Just checking in on the project status.", {}, False),
        ("PDF in body",     "Please review the attached report.pdf and let me know.",
                            {}, True),
        ("Spreadsheet",     "I've attached Q1_Revenue.xlsx — see the numbers.", {}, True),
        ("Blob URL",        "Deploy log is at https://files.example.com/blob/abc123", {}, True),
        ("Multiple names",  "Files: proposal.pdf, contract.docx, and budget.xlsx attached.",
                            {}, True),
    ]
    for label, text, kw, expected in cases:
        r = _fast_attachment_check(text)
        ok = "✓" if r["has_attachments"] == expected else "?"
        print(f"  [{ok}] {label:<15}  has={r['has_attachments']}  summary='{r['attachment_summary'][:60]}'")
    print("\n=== Self-test complete ===")
