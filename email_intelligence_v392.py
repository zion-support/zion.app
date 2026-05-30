"""
V392 - Email Thread Consolidator
Merges related email threads, detects duplicate conversations,
and creates unified thread views for better context.
"""

import json
import hashlib
import re
from datetime import datetime, timezone
from collections import defaultdict


def normalize_subject(subject):
    """Normalize email subject for thread matching."""
    cleaned = re.sub(r'^(re|fwd|fw|re:\s*fwd|re:\s*fw):\s*', '', subject.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip().lower()
    return cleaned


def compute_thread_signature(subject, participants):
    """Compute a signature hash for thread grouping."""
    normalized_subject = normalize_subject(subject)
    sorted_participants = sorted([p.lower() for p in participants])
    combined = f"{normalized_subject}|{'|'.join(sorted_participants)}"
    return hashlib.md5(combined.encode()).hexdigest()


def detect_duplicates(messages):
    """Detect duplicate or near-duplicate messages in a thread."""
    duplicates = []
    seen_content_hashes = {}

    for msg in messages:
        content = msg.get("content", "").strip().lower()
        content_hash = hashlib.md5(content.encode()).hexdigest()

        if content_hash in seen_content_hashes:
            duplicates.append({
                "message_id": msg.get("id"),
                "duplicate_of": seen_content_hashes[content_hash],
                "reason": "identical_content"
            })
        else:
            seen_content_hashes[content_hash] = msg.get("id")

        # Check for near-duplicates (forwarded copies)
        for other_id, other_hash in seen_content_hashes.items():
            if other_id != content_hash and other_id != msg.get("id"):
                if content[:100] == other_hash[:100] if len(content) > 100 else False:
                    duplicates.append({
                        "message_id": msg.get("id"),
                        "duplicate_of": other_id,
                        "reason": "near_duplicate"
                    })

    return duplicates


def extract_participants(messages):
    """Extract all unique participants from messages."""
    participants = set()
    for msg in messages:
        if msg.get("sender"):
            participants.add(msg["sender"])
        for r in msg.get("recipients", {}).get("to", []):
            participants.add(r)
        for r in msg.get("recipients", {}).get("cc", []):
            participants.add(r)
    return sorted(list(participants))


def build_thread_timeline(messages):
    """Build a chronological timeline for the thread."""
    sorted_msgs = sorted(messages, key=lambda m: m.get("timestamp", ""))
    timeline = []
    for i, msg in enumerate(sorted_msgs):
        timeline.append({
            "order": i + 1,
            "id": msg.get("id"),
            "from": msg.get("sender"),
            "to": msg.get("recipients", {}).get("to", []),
            "cc": msg.get("recipients", {}).get("cc", []),
            "timestamp": msg.get("timestamp"),
            "subject": msg.get("subject"),
            "content_preview": msg.get("content", "")[:200],
            "has_attachments": len(msg.get("attachments", [])) > 0,
        })
    return timeline


def identify_fork_points(messages):
    """Identify points where conversation forked into side discussions."""
    forks = []
    subject_variants = defaultdict(list)

    for msg in messages:
        normalized = normalize_subject(msg.get("subject", ""))
        subject_variants[normalized].append(msg.get("id"))

    base_subject = max(subject_variants.keys(), key=lambda k: len(subject_variants[k]))
    for subject, msg_ids in subject_variants.items():
        if subject != base_subject:
            forks.append({
                "fork_subject": subject,
                "message_ids": msg_ids,
                "forked_from": base_subject
            })

    return forks


def generate_thread_summary(messages):
    """Generate a summary of the consolidated thread."""
    participants = extract_participants(messages)
    msg_count = len(messages)

    first_msg = min(messages, key=lambda m: m.get("timestamp", ""))
    last_msg = max(messages, key=lambda m: m.get("timestamp", ""))

    # Extract action items
    action_keywords = ["please", "need", "action required", "todo", "deadline", "submit", "review"]
    action_items = []
    for msg in messages:
        content_lower = msg.get("content", "").lower()
        for keyword in action_keywords:
            if keyword in content_lower:
                sentences = msg.get("content", "").split(".")
                for sentence in sentences:
                    if keyword in sentence.lower():
                        action_items.append({
                            "text": sentence.strip(),
                            "from": msg.get("sender"),
                            "message_id": msg.get("id")
                        })
                        break

    # Count attachments
    total_attachments = sum(len(msg.get("attachments", [])) for msg in messages)

    return {
        "participant_count": len(participants),
        "participants": participants,
        "message_count": msg_count,
        "date_range": {
            "first": first_msg.get("timestamp"),
            "last": last_msg.get("timestamp")
        },
        "action_items": action_items,
        "total_attachments": total_attachments,
        "most_active_sender": _most_active(messages),
    }


def _most_active(messages):
    """Find the most active sender in a thread."""
    sender_counts = defaultdict(int)
    for msg in messages:
        sender_counts[msg.get("sender", "unknown")] += 1
    if not sender_counts:
        return "unknown"
    return max(sender_counts, key=sender_counts.get)


def consolidate_threads(email_groups):
    """Main engine: consolidate related email threads."""
    all_results = []

    for group_name, messages in email_groups.items():
        participants = extract_participants(messages)
        duplicates = detect_duplicates(messages)
        timeline = build_thread_timeline(messages)
        forks = identify_fork_points(messages)
        summary = generate_thread_summary(messages)

        # Determine reply-all requirement
        all_recipients = set()
        for msg in messages:
            for r in msg.get("recipients", {}).get("to", []):
                all_recipients.add(r)
            for r in msg.get("recipients", {}).get("cc", []):
                all_recipients.add(r)

        reply_all_required = len(all_recipients) > 1
        reply_all_enforced = reply_all_required

        # Remove duplicate messages from timeline
        duplicate_ids = {d["message_id"] for d in duplicates}
        clean_timeline = [t for t in timeline if t["id"] not in duplicate_ids]

        result = {
            "version": "V392",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "engine": "Email Thread Consolidator",
            "reply_all_required": reply_all_required,
            "reply_all_enforced": reply_all_enforced,
            "thread_group": group_name,
            "thread_signature": compute_thread_signature(
                messages[0].get("subject", ""), participants
            ),
            "summary": summary,
            "timeline": clean_timeline,
            "removed_duplicates": duplicates,
            "forked_conversations": forks,
            "reply_all_recipients": sorted(list(all_recipients)) if reply_all_enforced else [],
            "consolidation_stats": {
                "original_message_count": len(messages),
                "clean_message_count": len(clean_timeline),
                "duplicates_removed": len(duplicates),
                "forks_detected": len(forks),
            }
        }
        all_results.append(result)

    return all_results


def main():
    """Run the Email Thread Consolidator with sample data."""
    sample_threads = {
        "q3_budget_review": [
            {
                "id": "msg-001",
                "sender": "alice.johnson@techcorp.com",
                "subject": "Q3 Budget Review",
                "content": "Team, let's schedule a meeting to review Q3 budget allocations. Please share your department estimates.",
                "timestamp": "2026-05-20T09:00:00Z",
                "recipients": {"to": ["bob@techcorp.com", "carol@techcorp.com"], "cc": []},
                "attachments": []
            },
            {
                "id": "msg-002",
                "sender": "bob@techcorp.com",
                "subject": "Re: Q3 Budget Review",
                "content": "Alice, I've attached the engineering estimates. Total comes to $450K for Q3.",
                "timestamp": "2026-05-20T11:30:00Z",
                "recipients": {"to": ["alice.johnson@techcorp.com", "carol@techcorp.com"], "cc": []},
                "attachments": ["eng_budget_q3.xlsx"]
            },
            {
                "id": "msg-003",
                "sender": "carol@techcorp.com",
                "subject": "Re: Q3 Budget Review",
                "content": "Marketing estimates are $280K. Please review the breakdown attached.",
                "timestamp": "2026-05-20T14:00:00Z",
                "recipients": {"to": ["alice.johnson@techcorp.com", "bob@techcorp.com"], "cc": []},
                "attachments": ["marketing_q3.pdf"]
            },
            {
                "id": "msg-004",
                "sender": "alice.johnson@techcorp.com",
                "subject": "Fwd: Q3 Budget Review",
                "content": "Team, let's schedule a meeting to review Q3 budget allocations. Please share your department estimates.",
                "timestamp": "2026-05-20T15:00:00Z",
                "recipients": {"to": ["david@techcorp.com"], "cc": []},
                "attachments": []
            },
            {
                "id": "msg-005",
                "sender": "bob@techcorp.com",
                "subject": "Q3 Budget Review - Engineering Side Discussion",
                "content": "Carol, can we discuss the infrastructure costs separately? I think there's overlap with your digital tools budget.",
                "timestamp": "2026-05-21T10:00:00Z",
                "recipients": {"to": ["carol@techcorp.com"], "cc": ["alice.johnson@techcorp.com"]},
                "attachments": []
            },
        ],
        "project_launch": [
            {
                "id": "msg-101",
                "sender": "pm@techcorp.com",
                "subject": "Project Phoenix Launch Date",
                "content": "All, the launch date for Project Phoenix is confirmed for June 15th. Please ensure all deliverables are ready.",
                "timestamp": "2026-05-22T08:00:00Z",
                "recipients": {"to": ["dev-lead@techcorp.com", "qa-lead@techcorp.com", "design@techcorp.com"], "cc": ["vp-eng@techcorp.com"]},
                "attachments": ["launch_checklist.pdf"]
            },
            {
                "id": "msg-102",
                "sender": "dev-lead@techcorp.com",
                "subject": "Re: Project Phoenix Launch Date",
                "content": "Confirmed. All code freeze will be in place by June 12th. Need QA to start regression testing June 13th.",
                "timestamp": "2026-05-22T09:30:00Z",
                "recipients": {"to": ["pm@techcorp.com", "qa-lead@techcorp.com", "design@techcorp.com"], "cc": ["vp-eng@techcorp.com"]},
                "attachments": []
            },
            {
                "id": "msg-103",
                "sender": "qa-lead@techcorp.com",
                "subject": "Re: Project Phoenix Launch Date",
                "content": "QA team is ready. We'll need the test environment provisioned by June 10th. Please submit the infrastructure request ASAP.",
                "timestamp": "2026-05-22T11:00:00Z",
                "recipients": {"to": ["pm@techcorp.com", "dev-lead@techcorp.com", "design@techcorp.com"], "cc": ["vp-eng@techcorp.com"]},
                "attachments": []
            },
        ]
    }

    print("=" * 70)
    print("V392 - Email Thread Consolidator")
    print("=" * 70)

    results = consolidate_threads(sample_threads)
    for result in results:
        print(json.dumps(result, indent=2))
        print()


if __name__ == "__main__":
    main()
