"""
V393 - Email Time Zone Optimizer
Detects sender/recipient time zones, suggests optimal send times,
and displays local times for all participants.
"""

import json
from datetime import datetime, timezone, timedelta


# Known timezone database based on email domains and locations
TIMEZONE_DATABASE = {
    "techcorp.com": {"tz": "America/New_York", "offset": -5, "label": "EST/EDT"},
    "startup.io": {"tz": "America/Los_Angeles", "offset": -8, "label": "PST/PDT"},
    "eurofirm.co.uk": {"tz": "Europe/London", "offset": 0, "label": "GMT/BST"},
    "berlin-gmbh.de": {"tz": "Europe/Berlin", "offset": 1, "label": "CET/CEST"},
    "tokyo-corp.jp": {"tz": "Asia/Tokyo", "offset": 9, "label": "JST"},
    "sydney-au.com": {"tz": "Australia/Sydney", "offset": 10, "label": "AEST/AEDT"},
    "mumbai-tech.in": {"tz": "Asia/Kolkata", "offset": 5.5, "label": "IST"},
    "saopaulo-br.com": {"tz": "America/Sao_Paulo", "offset": -3, "label": "BRT"},
    "dubai-llc.ae": {"tz": "Asia/Dubai", "offset": 4, "label": "GST"},
    "singapore-hq.sg": {"tz": "Asia/Singapore", "offset": 8, "label": "SGT"},
}

# Default timezone if domain not found
DEFAULT_TZ = {"tz": "UTC", "offset": 0, "label": "UTC"}

# Working hours in local time
WORKING_HOURS = {"start": 9, "end": 17}


def detect_timezone(email_address):
    """Detect the likely timezone for an email address."""
    domain = email_address.split("@")[-1].lower() if "@" in email_address else ""

    # Check for exact domain match
    if domain in TIMEZONE_DATABASE:
        return TIMEZONE_DATABASE[domain]

    # Check for partial domain matches
    for known_domain, tz_info in TIMEZONE_DATABASE.items():
        if known_domain in domain or domain in known_domain:
            return tz_info

    # Check TLD for country hints
    tld = domain.split(".")[-1] if "." in domain else ""
    tld_map = {
        "uk": {"tz": "Europe/London", "offset": 0, "label": "GMT/BST"},
        "de": {"tz": "Europe/Berlin", "offset": 1, "label": "CET/CEST"},
        "jp": {"tz": "Asia/Tokyo", "offset": 9, "label": "JST"},
        "au": {"tz": "Australia/Sydney", "offset": 10, "label": "AEST/AEDT"},
        "in": {"tz": "Asia/Kolkata", "offset": 5.5, "label": "IST"},
        "br": {"tz": "America/Sao_Paulo", "offset": -3, "label": "BRT"},
        "ae": {"tz": "Asia/Dubai", "offset": 4, "label": "GST"},
        "sg": {"tz": "Asia/Singapore", "offset": 8, "label": "SGT"},
        "fr": {"tz": "Europe/Paris", "offset": 1, "label": "CET/CEST"},
        "cn": {"tz": "Asia/Shanghai", "offset": 8, "label": "CST"},
    }

    if tld in tld_map:
        return tld_map[tld]

    return DEFAULT_TZ


def get_local_time(utc_time, tz_info):
    """Convert UTC time to local time for a given timezone."""
    offset_hours = tz_info.get("offset", 0)
    local_time = utc_time + timedelta(hours=offset_hours)
    return local_time


def is_working_hours(local_time):
    """Check if a given local time falls within working hours."""
    hour = local_time.hour
    weekday = local_time.weekday()  # 0=Monday, 6=Sunday
    if weekday >= 5:  # Weekend
        return False
    return WORKING_HOURS["start"] <= hour < WORKING_HOURS["end"]


def find_optimal_send_time(participants_tz, reference_utc=None):
    """Find optimal send times that maximize overlap in working hours."""
    if reference_utc is None:
        reference_utc = datetime.now(timezone.utc)

    # Try each hour of a business day (next 48 hours)
    candidates = []
    for hour_offset in range(0, 48):
        candidate_utc = reference_utc.replace(hour=0, minute=0, second=0) + timedelta(hours=hour_offset)
        local_times = {}
        all_working = True
        working_count = 0

        for participant, tz_info in participants_tz.items():
            local_time = get_local_time(candidate_utc, tz_info)
            local_times[participant] = {
                "local_time": local_time.strftime("%Y-%m-%d %H:%M"),
                "is_working_hours": is_working_hours(local_time),
                "hour": local_time.hour,
            }
            if is_working_hours(local_time):
                working_count += 1
            else:
                all_working = False

        candidates.append({
            "utc_time": candidate_utc.isoformat(),
            "local_times": local_times,
            "all_in_working_hours": all_working,
            "working_hours_count": working_count,
            "total_participants": len(participants_tz),
            "overlap_percentage": round(working_count / len(participants_tz) * 100, 1),
        })

    # Sort by overlap percentage (descending), then by UTC time
    candidates.sort(key=lambda c: (-c["overlap_percentage"], c["utc_time"]))

    return candidates[:5]  # Top 5 optimal times


def analyze_send_time_quality(send_time_utc, participants_tz):
    """Analyze how good a particular send time is for all participants."""
    send_dt = send_time_utc if isinstance(send_time_utc, datetime) else datetime.fromisoformat(send_time_utc.replace("Z", "+00:00"))

    analysis = {}
    issues = []
    good_points = []

    for participant, tz_info in participants_tz.items():
        local_time = get_local_time(send_dt, tz_info)
        hour = local_time.hour
        weekday = local_time.weekday()

        status = "good"
        if weekday >= 5:
            status = "poor"
            issues.append(f"{participant}: Sent on weekend ({local_time.strftime('%A')})")
        elif hour < 7:
            status = "poor"
            issues.append(f"{participant}: Very early ({local_time.strftime('%H:%M')} local)")
        elif hour < 9:
            status = "acceptable"
            issues.append(f"{participant}: Before work hours ({local_time.strftime('%H:%M')} local)")
        elif hour >= 21:
            status = "poor"
            issues.append(f"{participant}: Late night ({local_time.strftime('%H:%M')} local)")
        elif hour >= 17:
            status = "acceptable"
            issues.append(f"{participant}: After work hours ({local_time.strftime('%H:%M')} local)")
        else:
            good_points.append(f"{participant}: During work hours ({local_time.strftime('%H:%M')} local)")

        analysis[participant] = {
            "local_time": local_time.strftime("%Y-%m-%d %H:%M"),
            "timezone": tz_info["label"],
            "day_of_week": local_time.strftime("%A"),
            "status": status,
        }

    # Overall quality score
    status_values = [a["status"] for a in analysis.values()]
    score_map = {"good": 3, "acceptable": 2, "poor": 1}
    avg_score = sum(score_map.get(s, 1) for s in status_values) / len(status_values) if status_values else 0

    if avg_score >= 2.5:
        overall = "excellent"
    elif avg_score >= 2.0:
        overall = "good"
    elif avg_score >= 1.5:
        overall = "acceptable"
    else:
        overall = "poor"

    return {
        "participant_analysis": analysis,
        "overall_quality": overall,
        "quality_score": round(avg_score, 2),
        "issues": issues,
        "good_points": good_points,
    }


def generate_schedule_suggestions(email_data):
    """Generate scheduling suggestions for follow-up meetings."""
    participants_tz = {}
    sender = email_data.get("sender", "")
    recipients = email_data.get("recipients", {})

    all_participants = [sender]
    all_participants.extend(recipients.get("to", []))
    all_participants.extend(recipients.get("cc", []))

    for p in all_participants:
        participants_tz[p] = detect_timezone(p)

    # Find meeting windows
    suggestions = find_optimal_send_time(participants_tz)
    meeting_slots = []
    for candidate in suggestions:
        if candidate["overlap_percentage"] >= 75:
            meeting_slots.append({
                "utc_time": candidate["utc_time"],
                "overlap_percentage": candidate["overlap_percentage"],
                "local_times": candidate["local_times"],
            })

    return meeting_slots


def optimize_email_timing(email_data):
    """Main engine: optimize email timing across time zones."""
    sender = email_data.get("sender", "")
    recipients = email_data.get("recipients", {})
    sent_timestamp = email_data.get("sent_timestamp")
    proposed_send_time = email_data.get("proposed_send_time")

    all_participants = [sender]
    to_list = recipients.get("to", [])
    cc_list = recipients.get("cc", [])
    all_participants.extend(to_list)
    all_participants.extend(cc_list)

    # Detect timezones
    participants_tz = {}
    tz_details = {}
    for p in all_participants:
        tz_info = detect_timezone(p)
        participants_tz[p] = tz_info
        tz_details[p] = {
            "timezone": tz_info["tz"],
            "label": tz_info["label"],
            "utc_offset_hours": tz_info["offset"],
        }

    # Analyze sent time if available
    sent_analysis = None
    if sent_timestamp:
        sent_analysis = analyze_send_time_quality(sent_timestamp, participants_tz)

    # Find optimal send times
    optimal_times = find_optimal_send_time(participants_tz)

    # Generate meeting suggestions
    meeting_suggestions = generate_schedule_suggestions(email_data)

    # Current local times for all participants
    now_utc = datetime.now(timezone.utc)
    current_local_times = {}
    for p, tz_info in participants_tz.items():
        local = get_local_time(now_utc, tz_info)
        current_local_times[p] = {
            "local_time": local.strftime("%Y-%m-%d %H:%M:%S"),
            "timezone": tz_info["label"],
            "is_working_hours": is_working_hours(local),
        }

    reply_all_required = len(to_list) + len(cc_list) > 1
    reply_all_enforced = reply_all_required

    result = {
        "version": "V393",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "engine": "Email Time Zone Optimizer",
        "reply_all_required": reply_all_required,
        "reply_all_enforced": reply_all_enforced,
        "participants": tz_details,
        "current_local_times": current_local_times,
        "sent_time_analysis": sent_analysis,
        "optimal_send_times": optimal_times,
        "meeting_suggestions": meeting_suggestions,
        "timezone_spread": {
            "min_offset": min(tz["utc_offset_hours"] for tz in tz_details.values()),
            "max_offset": max(tz["utc_offset_hours"] for tz in tz_details.values()),
            "total_span_hours": max(tz["utc_offset_hours"] for tz in tz_details.values()) -
                                min(tz["utc_offset_hours"] for tz in tz_details.values()),
        },
        "reply_all_recipients": to_list + cc_list if reply_all_enforced else [],
    }

    return result


def main():
    """Run the Email Time Zone Optimizer with sample data."""
    sample_email_1 = {
        "sender": "alice@techcorp.com",
        "subject": "Global Team Sync - Project Update",
        "content": "Team, let's align on the global rollout plan.",
        "sent_timestamp": "2026-05-28T22:00:00Z",
        "recipients": {
            "to": ["raj@mumbai-tech.in", "hiroshi@tokyo-corp.jp"],
            "cc": ["hans@berlin-gmbh.de"]
        }
    }

    sample_email_2 = {
        "sender": "pm@startup.io",
        "subject": "Cross-continental Sprint Planning",
        "content": "Let's plan our next sprint across teams.",
        "proposed_send_time": "2026-05-30T14:00:00Z",
        "recipients": {
            "to": ["dev@eurofirm.co.uk", "design@sydney-au.com", "qa@techcorp.com"],
            "cc": ["lead@singapore-hq.sg"]
        }
    }

    sample_email_3 = {
        "sender": "sales@dubai-llc.ae",
        "subject": "Partnership Proposal Review",
        "content": "Please review the attached partnership proposal.",
        "sent_timestamp": "2026-05-29T06:00:00Z",
        "recipients": {
            "to": ["vp@saopaulo-br.com", "director@techcorp.com"],
            "cc": ["legal@eurofirm.co.uk"]
        }
    }

    samples = [sample_email_1, sample_email_2, sample_email_3]

    print("=" * 70)
    print("V393 - Email Time Zone Optimizer")
    print("=" * 70)

    for i, email in enumerate(samples, 1):
        print(f"\n--- Email {i}: {email['subject']} ---")
        result = optimize_email_timing(email)
        print(json.dumps(result, indent=2))
        print()


if __name__ == "__main__":
    main()
