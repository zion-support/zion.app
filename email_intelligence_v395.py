"""
V395 - Email Signature Analyzer
Extracts contact information from signatures, builds contact database,
and detects signature changes (role changes, company changes).
"""

import json
import re
import hashlib
from datetime import datetime, timezone


def extract_signature_block(email_content):
    """Extract the signature block from email content."""
    # Common signature delimiters
    delimiters = [
        r'\n--\s*\n',           # Standard email signature separator
        r'\n_{3,}\n',           # Underscore line
        r'\n-{3,}\n',           # Dash line
        r'\nRegards,?\n',       # "Regards"
        r'\nBest regards,?\n',  # "Best regards"
        r'\nSincerely,?\n',     # "Sincerely"
        r'\nKind regards,?\n',  # "Kind regards"
        r'\nCheers,?\n',        # "Cheers"
        r'\nThanks,?\n',        # "Thanks"
        r'\nThank you,?\n',     # "Thank you"
    ]

    signature_text = ""
    for delimiter in delimiters:
        match = re.search(delimiter, email_content, re.IGNORECASE)
        if match:
            signature_text = email_content[match.start():].strip()
            break

    if not signature_text:
        # Try to get last few lines as potential signature
        lines = email_content.strip().split('\n')
        if len(lines) > 3:
            signature_text = '\n'.join(lines[-6:])

    return signature_text


def extract_contact_info(signature_text):
    """Extract structured contact information from a signature block."""
    contact = {
        "name": None,
        "title": None,
        "company": None,
        "department": None,
        "email_addresses": [],
        "phone_numbers": [],
        "websites": [],
        "social_media": {},
        "address": None,
    }

    if not signature_text:
        return contact

    # Extract email addresses
    emails = re.findall(r'[\w.+-]+@[\w.-]+\.\w+', signature_text)
    contact["email_addresses"] = list(set(emails))

    # Extract phone numbers (various formats)
    phone_patterns = [
        r'(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}',
        r'\+\d{1,3}\s?\d{2,4}\s?\d{3,4}\s?\d{3,4}',
    ]
    phones = []
    for pattern in phone_patterns:
        found = re.findall(pattern, signature_text)
        phones.extend([p.strip() for p in found if len(p.strip()) >= 10])
    contact["phone_numbers"] = list(set(phones))

    # Extract websites
    websites = re.findall(r'(?:https?://)?(?:www\.)?[\w.-]+\.(?:com|org|net|io|co|edu|gov)\b', signature_text)
    contact["websites"] = list(set(websites))

    # Extract social media
    social_patterns = {
        "linkedin": r'(?:linkedin\.com/in/|linkedin:)\s*([\w-]+)',
        "twitter": r'(?:twitter\.com/|@)([\w]+)',
        "github": r'(?:github\.com/)([\w-]+)',
    }
    for platform, pattern in social_patterns.items():
        match = re.search(pattern, signature_text, re.IGNORECASE)
        if match:
            contact["social_media"][platform] = match.group(1)

    # Extract name (first line after delimiter, usually)
    lines = [l.strip() for l in signature_text.split('\n') if l.strip()]
    if lines:
        # First non-empty line is usually the name
        first_line = lines[0].lstrip('- ').strip()
        if first_line and not any(c in first_line for c in ['@', 'http', '+']):
            # Check if it looks like a name
            if re.match(r'^[A-Z][a-zA-Z\s\.\-]+$', first_line) and len(first_line.split()) <= 4:
                contact["name"] = first_line

    # Extract title/role (often the line after name)
    title_keywords = ["manager", "director", "vp", "cto", "ceo", "cfo", "lead",
                      "engineer", "developer", "analyst", "specialist", "coordinator",
                      "head of", "chief", "officer", "president", "associate", "consultant"]
    for line in lines[1:5]:
        if any(kw in line.lower() for kw in title_keywords):
            contact["title"] = line.strip()
            break

    # Extract company
    company_indicators = ["inc", "llc", "corp", "ltd", "gmbh", "co", "company",
                          "technologies", "solutions", "systems", "group"]
    for line in lines:
        if any(ind in line.lower() for ind in company_indicators):
            contact["company"] = line.strip()
            break

    # Extract address (lines with city/state patterns)
    address_pattern = r'[\w\s]+,\s*[A-Z]{2}\s+\d{5}'
    for line in lines:
        if re.search(address_pattern, line):
            contact["address"] = line.strip()
            break

    return contact


def build_contact_database(emails):
    """Build a unified contact database from multiple emails."""
    database = {}

    for email in emails:
        sender = email.get("sender", "")
        content = email.get("content", "")
        timestamp = email.get("timestamp", "")

        signature = extract_signature_block(content)
        contact_info = extract_contact_info(signature)

        # Use sender email as key
        if sender not in database:
            database[sender] = {
                "email": sender,
                "signatures": [],
                "contact_history": [],
            }

        entry = {
            "timestamp": timestamp,
            "signature_raw": signature[:500] if signature else "",
            "extracted_info": contact_info,
            "signature_hash": hashlib.md5(signature.encode()).hexdigest() if signature else "",
        }

        database[sender]["signatures"].append(entry)
        database[sender]["contact_history"].append({
            "timestamp": timestamp,
            "name": contact_info.get("name"),
            "title": contact_info.get("title"),
            "company": contact_info.get("company"),
        })

    return database


def detect_signature_changes(contact_history):
    """Detect changes in signatures over time."""
    changes = []

    if len(contact_history) < 2:
        return changes

    sorted_history = sorted(contact_history, key=lambda x: x.get("timestamp", ""))

    for i in range(1, len(sorted_history)):
        prev = sorted_history[i - 1]
        curr = sorted_history[i]

        # Check for title/role changes
        if prev.get("title") and curr.get("title") and prev["title"] != curr["title"]:
            changes.append({
                "type": "role_change",
                "field": "title",
                "previous": prev["title"],
                "current": curr["title"],
                "detected_at": curr.get("timestamp"),
                "significance": "high",
            })

        # Check for company changes
        if prev.get("company") and curr.get("company") and prev["company"] != curr["company"]:
            changes.append({
                "type": "company_change",
                "field": "company",
                "previous": prev["company"],
                "current": curr["company"],
                "detected_at": curr.get("timestamp"),
                "significance": "high",
            })

        # Check for name changes
        if prev.get("name") and curr.get("name") and prev["name"] != curr["name"]:
            changes.append({
                "type": "name_change",
                "field": "name",
                "previous": prev["name"],
                "current": curr["name"],
                "detected_at": curr.get("timestamp"),
                "significance": "medium",
            })

    return changes


def generate_contact_profile(sender, contact_data):
    """Generate a comprehensive contact profile."""
    signatures = contact_data.get("signatures", [])
    history = contact_data.get("contact_history", [])

    if not signatures:
        return {"email": sender, "status": "no_signature_data"}

    # Get latest signature info
    latest = max(signatures, key=lambda s: s.get("timestamp", ""))
    latest_info = latest.get("extracted_info", {})

    # Detect changes
    changes = detect_signature_changes(history)

    # Aggregate all known contact info
    all_emails = set()
    all_phones = set()
    all_websites = set()
    all_social = {}

    for sig in signatures:
        info = sig.get("extracted_info", {})
        all_emails.update(info.get("email_addresses", []))
        all_phones.update(info.get("phone_numbers", []))
        all_websites.update(info.get("websites", []))
        all_social.update(info.get("social_media", {}))

    return {
        "email": sender,
        "current_name": latest_info.get("name"),
        "current_title": latest_info.get("title"),
        "current_company": latest_info.get("company"),
        "all_known_emails": sorted(list(all_emails)),
        "all_known_phones": sorted(list(all_phones)),
        "all_known_websites": sorted(list(all_websites)),
        "social_media": all_social,
        "address": latest_info.get("address"),
        "signature_changes": changes,
        "interaction_count": len(signatures),
        "first_seen": min(s.get("timestamp", "") for s in signatures) if signatures else None,
        "last_seen": max(s.get("timestamp", "") for s in signatures) if signatures else None,
        "has_signature_changes": len(changes) > 0,
    }


def analyze_signatures(email_data):
    """Main engine: analyze email signatures and build contact intelligence."""
    emails = email_data.get("emails", [])
    recipients = email_data.get("query_recipients", {})

    # Build contact database
    contact_db = build_contact_database(emails)

    # Generate profiles
    contact_profiles = {}
    all_changes = []
    for sender, data in contact_db.items():
        profile = generate_contact_profile(sender, data)
        contact_profiles[sender] = profile
        if profile.get("has_signature_changes"):
            all_changes.extend(profile.get("signature_changes", []))

    # Determine reply-all
    to_list = recipients.get("to", [])
    cc_list = recipients.get("cc", [])
    reply_all_required = len(to_list) + len(cc_list) > 1
    reply_all_enforced = reply_all_required

    result = {
        "version": "V395",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "engine": "Email Signature Analyzer",
        "reply_all_required": reply_all_required,
        "reply_all_enforced": reply_all_enforced,
        "contact_database": contact_profiles,
        "summary": {
            "total_contacts": len(contact_profiles),
            "contacts_with_changes": sum(1 for p in contact_profiles.values() if p.get("has_signature_changes")),
            "total_signature_changes": len(all_changes),
            "change_types": {
                "role_changes": sum(1 for c in all_changes if c["type"] == "role_change"),
                "company_changes": sum(1 for c in all_changes if c["type"] == "company_change"),
                "name_changes": sum(1 for c in all_changes if c["type"] == "name_change"),
            }
        },
        "all_detected_changes": all_changes,
        "reply_all_recipients": to_list + cc_list if reply_all_enforced else [],
    }

    return result


def main():
    """Run the Email Signature Analyzer with sample data."""
    sample_emails = [
        {
            "sender": "alice.johnson@techcorp.com",
            "timestamp": "2026-01-15T10:00:00Z",
            "content": (
                "Hi Team,\n\nPlease review the Q1 projections attached.\n\n"
                "--\nAlice Johnson\nSenior Financial Analyst\nTechCorp Inc.\n"
                "Phone: +1 (555) 123-4567\n"
                "Email: alice.johnson@techcorp.com\n"
                "www.techcorp.com\n"
                "LinkedIn: linkedin.com/in/alicejohnson"
            )
        },
        {
            "sender": "alice.johnson@techcorp.com",
            "timestamp": "2026-03-20T14:00:00Z",
            "content": (
                "Team,\n\nUpdated forecasts are ready for review.\n\n"
                "--\nAlice Johnson\nDirector of Finance\nTechCorp Inc.\n"
                "Phone: +1 (555) 123-4567\n"
                "Email: alice.johnson@techcorp.com\n"
                "www.techcorp.com\n"
                "LinkedIn: linkedin.com/in/alicejohnson"
            )
        },
        {
            "sender": "alice.johnson@techcorp.com",
            "timestamp": "2026-05-28T09:00:00Z",
            "content": (
                "All,\n\nQ3 budget kickoff meeting is scheduled for next Monday.\n\n"
                "--\nAlice Johnson\nVP of Finance\nTechCorp Global Solutions\n"
                "Phone: +1 (555) 123-4567\n"
                "Mobile: +1 (555) 987-6543\n"
                "Email: alice.johnson@techcorp.com\n"
                "www.techcorp.com\n"
                "LinkedIn: linkedin.com/in/alicejohnson\n"
                "Twitter: @alicejohnsonCFO"
            )
        },
        {
            "sender": "bob.smith@techcorp.com",
            "timestamp": "2026-05-20T11:00:00Z",
            "content": (
                "Alice,\n\nEngineering estimates are ready.\n\n"
                "Best regards,\nBob Smith\nEngineering Lead\nTechCorp Inc.\n"
                "Phone: +1 (555) 234-5678\n"
                "bob.smith@techcorp.com\n"
                "github.com/bobsmith-dev"
            )
        },
        {
            "sender": "carol.davis@eurofirm.co.uk",
            "timestamp": "2026-05-22T16:00:00Z",
            "content": (
                "Hello,\n\nPlease find the marketing report attached.\n\n"
                "Kind regards,\nCarol Davis\nMarketing Manager\nEuroFirm Ltd.\n"
                "London, UK\n"
                "+44 20 7946 0958\n"
                "carol.davis@eurofirm.co.uk\n"
                "www.eurofirm.co.uk"
            )
        },
        {
            "sender": "carol.davis@eurofirm.co.uk",
            "timestamp": "2026-05-29T10:00:00Z",
            "content": (
                "Hi,\n\nUpdated figures are in the shared drive.\n\n"
                "Kind regards,\nCarol Davis\nHead of Marketing\nEuroFirm Digital Ltd.\n"
                "London, UK\n"
                "+44 20 7946 0958\n"
                "carol.davis@eurofirm.co.uk\n"
                "www.eurofirm.co.uk\n"
                "LinkedIn: linkedin.com/in/caroldavis-mktg"
            )
        },
    ]

    query = {
        "emails": sample_emails,
        "query_recipients": {
            "to": ["alice.johnson@techcorp.com", "bob.smith@techcorp.com", "carol.davis@eurofirm.co.uk"],
            "cc": ["manager@techcorp.com"]
        }
    }

    print("=" * 70)
    print("V395 - Email Signature Analyzer")
    print("=" * 70)

    result = analyze_signatures(query)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
