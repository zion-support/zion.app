"""
V394 - Email Attachment Summarizer
Extracts key information from attachments (PDFs, docs, spreadsheets),
generates summaries, and highlights action items.
"""

import json
import re
import hashlib
from datetime import datetime, timezone


def classify_attachment(filename):
    """Classify attachment type based on file extension."""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    type_map = {
        "pdf": {"category": "document", "format": "pdf", "parseable": True},
        "doc": {"category": "document", "format": "word", "parseable": True},
        "docx": {"category": "document", "format": "word", "parseable": True},
        "xls": {"category": "spreadsheet", "format": "excel", "parseable": True},
        "xlsx": {"category": "spreadsheet", "format": "excel", "parseable": True},
        "csv": {"category": "spreadsheet", "format": "csv", "parseable": True},
        "ppt": {"category": "presentation", "format": "powerpoint", "parseable": True},
        "pptx": {"category": "presentation", "format": "powerpoint", "parseable": True},
        "txt": {"category": "text", "format": "plain", "parseable": True},
        "png": {"category": "image", "format": "png", "parseable": False},
        "jpg": {"category": "image", "format": "jpeg", "parseable": False},
        "zip": {"category": "archive", "format": "zip", "parseable": False},
    }

    return type_map.get(ext, {"category": "unknown", "format": ext, "parseable": False})


def extract_financial_data(content):
    """Extract financial figures and data from content."""
    patterns = {
        "currency_amounts": re.findall(r'\$[\d,]+\.?\d*', content),
        "percentages": re.findall(r'\d+\.?\d*\s*%', content),
        "dates": re.findall(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', content),
    }

    # Detect financial keywords
    fin_keywords = ["revenue", "cost", "budget", "expense", "profit", "loss",
                    "forecast", "projection", "estimate", "actual", "variance"]
    found_keywords = [kw for kw in fin_keywords if kw.lower() in content.lower()]

    return {
        "currency_amounts": patterns["currency_amounts"][:10],
        "percentages": patterns["percentages"][:10],
        "dates": patterns["dates"][:10],
        "financial_keywords": found_keywords,
        "is_financial_document": len(found_keywords) >= 2 or len(patterns["currency_amounts"]) >= 2,
    }


def extract_action_items(content):
    """Extract action items from document content."""
    action_patterns = [
        r'(?:action item|todo|action required)[:\s]+(.+?)(?:\.|$)',
        r'(?:please|kindly)\s+(.+?)(?:\.|$)',
        r'(?:deadline|due date|due by)[:\s]+(.+?)(?:\.|$)',
        r'(?:responsible|owner|assigned to)[:\s]+(.+?)(?:\.|$)',
    ]

    items = []
    for pattern in action_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            items.append(match.strip())

    # Also look for bulleted action items
    bullet_pattern = r'(?:^|\n)\s*[-•*]\s*(.+?)(?:\n|$)'
    bullets = re.findall(bullet_pattern, content)
    action_bullets = [b.strip() for b in bullets if any(
        kw in b.lower() for kw in ["need to", "must", "should", "complete", "submit", "review", "approve", "update"]
    )]
    items.extend(action_bullets)

    return list(set(items))


def summarize_document(content, doc_type):
    """Generate a summary of document content."""
    sentences = [s.strip() for s in re.split(r'[.!?]+', content) if len(s.strip()) > 10]

    # Extract key sentences (first, last, and those with important keywords)
    important_keywords = ["important", "critical", "key", "summary", "conclusion",
                          "recommendation", "finding", "result", "decision", "approved"]

    key_sentences = []
    if sentences:
        key_sentences.append(sentences[0])  # First sentence

    for sent in sentences:
        if any(kw in sent.lower() for kw in important_keywords):
            key_sentences.append(sent)

    if sentences and len(sentences) > 1:
        key_sentences.append(sentences[-1])  # Last sentence

    # Remove duplicates while preserving order
    seen = set()
    unique_sentences = []
    for s in key_sentences:
        if s not in seen:
            seen.add(s)
            unique_sentences.append(s)

    word_count = len(content.split())
    section_headers = re.findall(r'(?:^|\n)([A-Z][A-Za-z\s]{3,50}:)', content)

    return {
        "summary_sentences": unique_sentences[:8],
        "total_word_count": word_count,
        "total_sentences": len(sentences),
        "section_headers": section_headers[:10],
        "document_type": doc_type,
    }


def analyze_spreadsheet(attachment_data):
    """Analyze spreadsheet attachment data."""
    sheets = attachment_data.get("sheets", [])
    analysis = {
        "sheet_count": len(sheets),
        "sheets": [],
        "data_summary": {},
    }

    total_rows = 0
    total_cols = 0
    all_formulas = []
    all_headers = []

    for sheet in sheets:
        sheet_info = {
            "name": sheet.get("name", "Unknown"),
            "row_count": sheet.get("row_count", 0),
            "column_count": sheet.get("column_count", 0),
            "headers": sheet.get("headers", []),
            "has_formulas": sheet.get("has_formulas", False),
            "has_charts": sheet.get("has_charts", False),
        }
        analysis["sheets"].append(sheet_info)
        total_rows += sheet_info["row_count"]
        total_cols = max(total_cols, sheet_info["column_count"])
        all_headers.extend(sheet_info["headers"])

    analysis["data_summary"] = {
        "total_rows": total_rows,
        "max_columns": total_cols,
        "all_headers": list(set(all_headers))[:20],
    }

    return analysis


def detect_sensitive_content(content):
    """Detect potentially sensitive content in attachments."""
    sensitive_patterns = {
        "ssn": re.findall(r'\b\d{3}-\d{2}-\d{4}\b', content),
        "credit_card": re.findall(r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b', content),
        "password_fields": re.findall(r'(?:password|passwd|pwd)\s*[:=]\s*\S+', content, re.IGNORECASE),
        "api_keys": re.findall(r'(?:api[_-]?key|token|secret)\s*[:=]\s*\S+', content, re.IGNORECASE),
        "confidential_markers": re.findall(r'(?:confidential|proprietary|internal only|do not share)', content, re.IGNORECASE),
    }

    findings = {}
    has_sensitive = False
    for pattern_name, matches in sensitive_patterns.items():
        if matches:
            findings[pattern_name] = {"count": len(matches), "detected": True}
            has_sensitive = True
        else:
            findings[pattern_name] = {"count": 0, "detected": False}

    return {"has_sensitive_content": has_sensitive, "findings": findings}


def summarize_attachments(email_data):
    """Main engine: summarize email attachments."""
    sender = email_data.get("sender", "")
    recipients = email_data.get("recipients", {})
    attachments = email_data.get("attachments", [])
    email_content = email_data.get("content", "")

    attachment_analyses = []
    all_action_items = []
    has_sensitive = False

    for attachment in attachments:
        filename = attachment.get("filename", "unknown")
        content = attachment.get("extracted_content", "")
        file_type = classify_attachment(filename)

        analysis = {
            "filename": filename,
            "file_type": file_type,
            "size_bytes": attachment.get("size_bytes", 0),
        }

        if file_type["parseable"] and content:
            # Generate summary
            doc_summary = summarize_document(content, file_type["category"])
            analysis["summary"] = doc_summary

            # Extract action items
            action_items = extract_action_items(content)
            analysis["action_items"] = action_items
            all_action_items.extend(action_items)

            # Extract financial data
            financial_data = extract_financial_data(content)
            analysis["financial_data"] = financial_data

            # Check for sensitive content
            sensitive = detect_sensitive_content(content)
            analysis["sensitive_content"] = sensitive
            if sensitive["has_sensitive_content"]:
                has_sensitive = True

        # Special handling for spreadsheets
        if file_type["category"] == "spreadsheet" and "sheet_data" in attachment:
            sheet_analysis = analyze_spreadsheet(attachment["sheet_data"])
            analysis["spreadsheet_analysis"] = sheet_analysis

        attachment_analyses.append(analysis)

    # Also check email body for action items
    body_actions = extract_action_items(email_content)

    # Determine reply-all
    to_list = recipients.get("to", [])
    cc_list = recipients.get("cc", [])
    reply_all_required = len(to_list) + len(cc_list) > 1
    reply_all_enforced = reply_all_required

    result = {
        "version": "V394",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "engine": "Email Attachment Summarizer",
        "reply_all_required": reply_all_required,
        "reply_all_enforced": reply_all_enforced,
        "sender": sender,
        "subject": email_data.get("subject", ""),
        "attachment_count": len(attachments),
        "attachment_analyses": attachment_analyses,
        "combined_action_items": list(set(all_action_items + body_actions)),
        "security_warnings": {
            "has_sensitive_content": has_sensitive,
            "attachments_with_sensitive_data": sum(
                1 for a in attachment_analyses
                if a.get("sensitive_content", {}).get("has_sensitive_content", False)
            ),
        },
        "summary_overview": {
            "total_attachments": len(attachments),
            "parseable_attachments": sum(1 for a in attachment_analyses if a["file_type"]["parseable"]),
            "financial_documents": sum(
                1 for a in attachment_analyses
                if a.get("financial_data", {}).get("is_financial_document", False)
            ),
            "total_action_items": len(set(all_action_items + body_actions)),
        },
        "reply_all_recipients": to_list + cc_list if reply_all_enforced else [],
    }

    return result


def main():
    """Run the Email Attachment Summarizer with sample data."""
    sample_email_1 = {
        "sender": "finance@techcorp.com",
        "subject": "Q3 Financial Report and Budget Proposals",
        "content": "Please review the attached Q3 financial report and budget proposals. Action required: submit feedback by Friday.",
        "recipients": {
            "to": ["alice@techcorp.com", "bob@techcorp.com"],
            "cc": ["cfo@techcorp.com"]
        },
        "attachments": [
            {
                "filename": "Q3_Financial_Report.pdf",
                "size_bytes": 2450000,
                "extracted_content": (
                    "Q3 Financial Summary Report\n"
                    "Revenue: $4.2M (up 15% YoY). Operating costs: $2.8M. Net profit: $1.4M.\n"
                    "Key Findings: Marketing ROI improved by 22%. Engineering costs remained flat.\n"
                    "Recommendation: Increase R&D budget by 10% for Q4.\n"
                    "Action item: Department heads to submit revised forecasts by June 5th.\n"
                    "Deadline: All budget approvals must be finalized by June 15th.\n"
                    "Important: Cost reduction targets of 5% must be met in Q4."
                )
            },
            {
                "filename": "Budget_Proposals.xlsx",
                "size_bytes": 185000,
                "extracted_content": (
                    "Department Budget Proposals FY2026 Q4\n"
                    "Engineering: $1.2M - Infrastructure upgrade, 3 new hires\n"
                    "Marketing: $800K - Campaign expansion, trade shows\n"
                    "Sales: $600K - New CRM implementation, team expansion\n"
                    "HR: $200K - Training programs, recruitment\n"
                    "Action required: Review and approve allocations by June 10th.\n"
                    "Please submit any budget modification requests to finance team."
                ),
                "sheet_data": {
                    "sheets": [
                        {"name": "Summary", "row_count": 25, "column_count": 8,
                         "headers": ["Department", "Q3 Actual", "Q4 Proposed", "Variance", "Notes"],
                         "has_formulas": True, "has_charts": True},
                        {"name": "Engineering Detail", "row_count": 45, "column_count": 6,
                         "headers": ["Line Item", "Amount", "Category", "Owner", "Status"],
                         "has_formulas": True, "has_charts": False},
                    ]
                }
            }
        ]
    }

    sample_email_2 = {
        "sender": "hr@techcorp.com",
        "subject": "Updated Employee Handbook - Confidential",
        "content": "Attached is the updated employee handbook. Please review the changes to PTO policy.",
        "recipients": {
            "to": ["all-staff@techcorp.com"],
            "cc": []
        },
        "attachments": [
            {
                "filename": "Employee_Handbook_v3.docx",
                "size_bytes": 890000,
                "extracted_content": (
                    "Employee Handbook Version 3.0\n"
                    "CONFIDENTIAL - Internal Use Only\n"
                    "Chapter 1: Company Policies\n"
                    "Chapter 2: PTO and Leave Policy\n"
                    "Important: PTO carry-over limit changed from 5 to 10 days.\n"
                    "Key change: New flex day policy allows 2 additional remote days per month.\n"
                    "Action required: All employees must acknowledge receipt by signing the form.\n"
                    "Password: handbook2026 for encrypted sections.\n"
                    "Contact: hr@techcorp.com for questions."
                )
            }
        ]
    }

    sample_email_3 = {
        "sender": "vendor@supplier.com",
        "subject": "Invoice and Purchase Order Confirmation",
        "content": "Please find attached the invoice for PO-2026-1234 and delivery confirmation.",
        "recipients": {
            "to": ["procurement@techcorp.com", "ap@techcorp.com"],
            "cc": ["manager@techcorp.com"]
        },
        "attachments": [
            {
                "filename": "INV-2026-5678.pdf",
                "size_bytes": 125000,
                "extracted_content": (
                    "Invoice INV-2026-5678\n"
                    "Date: 05/25/2026\n"
                    "Bill To: TechCorp Inc.\n"
                    "Items: Server hardware x10 - $45,000.00\n"
                    "Installation services - $8,500.00\n"
                    "Annual maintenance - $12,000.00\n"
                    "Total: $65,500.00\n"
                    "Payment due: Net 30 - by 06/24/2026\n"
                    "Please submit payment to accounts@supplier.com"
                )
            }
        ]
    }

    samples = [sample_email_1, sample_email_2, sample_email_3]

    print("=" * 70)
    print("V394 - Email Attachment Summarizer")
    print("=" * 70)

    for i, email in enumerate(samples, 1):
        print(f"\n--- Email {i}: {email['subject']} ---")
        result = summarize_attachments(email)
        print(json.dumps(result, indent=2))
        print()


if __name__ == "__main__":
    main()
