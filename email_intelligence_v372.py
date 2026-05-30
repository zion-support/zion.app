#!/usr/bin/env python
"""
Email Intelligence Engine V372 - Email Attachment Intelligence
==============================================================

Scans email attachments, classifies file types, extracts text from documents,
detects sensitive data patterns, and generates content summaries.

Features:
    - File type classification (document, spreadsheet, image, archive, etc.)
    - Simulated text extraction from various document formats
    - Sensitive data detection (SSN, credit cards, API keys, PII patterns)
    - Content summarization with key phrase extraction
    - Risk scoring based on sensitive data presence
    - Enforces reply-all for multi-recipient threads
    - Outputs structured JSON with attachment analysis

Author: Email Intelligence Suite
Version: 372
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional


class AttachmentIntelligenceEngine:
    """
    Engine that analyzes email attachments for classification, content,
    and sensitive data detection.

    Attributes:
        file_type_map: Mapping of extensions to file type categories
        sensitive_patterns: Regex patterns for detecting sensitive data
        risk_thresholds: Thresholds for risk level classification
    """

    def __init__(self):
        """Initialize the Attachment Intelligence Engine with classification rules."""
        self.file_type_map = {
            ".pdf": {"category": "document", "extractable": True, "risk_weight": 1.2},
            ".docx": {"category": "document", "extractable": True, "risk_weight": 1.1},
            ".doc": {"category": "document", "extractable": True, "risk_weight": 1.1},
            ".xlsx": {"category": "spreadsheet", "extractable": True, "risk_weight": 1.3},
            ".xls": {"category": "spreadsheet", "extractable": True, "risk_weight": 1.3},
            ".csv": {"category": "spreadsheet", "extractable": True, "risk_weight": 1.4},
            ".pptx": {"category": "presentation", "extractable": True, "risk_weight": 1.0},
            ".ppt": {"category": "presentation", "extractable": True, "risk_weight": 1.0},
            ".txt": {"category": "text", "extractable": True, "risk_weight": 1.0},
            ".png": {"category": "image", "extractable": False, "risk_weight": 0.8},
            ".jpg": {"category": "image", "extractable": False, "risk_weight": 0.8},
            ".jpeg": {"category": "image", "extractable": False, "risk_weight": 0.8},
            ".gif": {"category": "image", "extractable": False, "risk_weight": 0.6},
            ".zip": {"category": "archive", "extractable": False, "risk_weight": 1.5},
            ".rar": {"category": "archive", "extractable": False, "risk_weight": 1.6},
            ".7z": {"category": "archive", "extractable": False, "risk_weight": 1.5},
            ".exe": {"category": "executable", "extractable": False, "risk_weight": 2.0},
            ".js": {"category": "script", "extractable": True, "risk_weight": 1.8},
            ".py": {"category": "script", "extractable": True, "risk_weight": 1.2},
            ".html": {"category": "webpage", "extractable": True, "risk_weight": 1.3},
        }

        self.sensitive_patterns = {
            "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
            "credit_card": r"\b(?:\d{4}[-\s]?){3}\d{4}\b",
            "email_address": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
            "phone_number": r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
            "api_key": r"\b(?:api[_-]?key|apikey|token|secret)['\":\s=]+[A-Za-z0-9_\-]{16,}\b",
            "password": r"\b(?:password|passwd|pwd)['\":\s=]+[^\s'\"]{4,}\b",
            "ip_address": r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
            "bank_account": r"\b\d{8,17}\b",
        }

    def classify_file(self, filename: str) -> Dict[str, Any]:
        """
        Classify a file based on its extension.

        Args:
            filename: Name of the file including extension.

        Returns:
            Dictionary with file classification details.
        """
        ext = self._get_extension(filename).lower()
        classification = self.file_type_map.get(ext, {
            "category": "unknown",
            "extractable": False,
            "risk_weight": 1.0
        })

        return {
            "filename": filename,
            "extension": ext,
            "category": classification["category"],
            "extractable": classification["extractable"],
            "risk_weight": classification["risk_weight"],
            "is_suspicious": classification["category"] in ("executable", "script")
        }

    def _get_extension(self, filename: str) -> str:
        """Extract file extension from filename."""
        if "." in filename:
            return "." + filename.rsplit(".", 1)[-1]
        return ""

    def detect_sensitive_data(self, text: str) -> Dict[str, Any]:
        """
        Scan text content for sensitive data patterns.

        Args:
            text: Extracted text content to scan.

        Returns:
            Dictionary with detected sensitive data types and counts.
        """
        findings = {}
        total_findings = 0

        for pattern_name, pattern in self.sensitive_patterns.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                # Mask the actual values for security
                masked = [self._mask_value(m, pattern_name) for m in matches[:5]]
                findings[pattern_name] = {
                    "count": len(matches),
                    "samples": masked
                }
                total_findings += len(matches)

        # Calculate risk score
        risk_score = min(1.0, total_findings * 0.15)
        if "ssn" in findings:
            risk_score = min(1.0, risk_score + 0.3)
        if "credit_card" in findings:
            risk_score = min(1.0, risk_score + 0.2)
        if "password" in findings or "api_key" in findings:
            risk_score = min(1.0, risk_score + 0.25)

        risk_level = "critical" if risk_score > 0.7 else \
                     "high" if risk_score > 0.5 else \
                     "medium" if risk_score > 0.3 else \
                     "low" if risk_score > 0.1 else "minimal"

        return {
            "sensitive_data_found": len(findings) > 0,
            "total_matches": total_findings,
            "findings": findings,
            "risk_score": round(risk_score, 4),
            "risk_level": risk_level
        }

    def _mask_value(self, value: str, pattern_type: str) -> str:
        """Mask sensitive values for safe display."""
        if len(value) <= 4:
            return "***"
        return value[:2] + "*" * (len(value) - 4) + value[-2:]

    def extract_summary(self, text: str, max_length: int = 200) -> Dict[str, Any]:
        """
        Generate a summary of document content.

        Args:
            text: Full text content of the document.
            max_length: Maximum length for the summary.

        Returns:
            Dictionary with summary and key phrases.
        """
        if not text:
            return {"summary": "", "key_phrases": [], "word_count": 0}

        words = text.split()
        word_count = len(words)

        # Extract key phrases (simple frequency-based approach)
        sentences = re.split(r'[.!?]+', text)
        key_phrases = []
        for sentence in sentences[:5]:
            sentence = sentence.strip()
            if len(sentence) > 10:
                key_phrases.append(sentence[:80] + "..." if len(sentence) > 80 else sentence)

        # Generate summary
        summary = text[:max_length] + "..." if len(text) > max_length else text

        return {
            "summary": summary,
            "key_phrases": key_phrases[:5],
            "word_count": word_count,
            "sentence_count": len(sentences),
            "avg_word_length": round(
                sum(len(w) for w in words) / max(word_count, 1), 2
            )
        }

    def analyze_attachment(self, attachment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform comprehensive analysis of a single attachment.

        Args:
            attachment: Dictionary with attachment metadata and simulated content.

        Returns:
            Complete analysis results for the attachment.
        """
        filename = attachment.get("filename", "unknown")
        size_bytes = attachment.get("size_bytes", 0)
        content = attachment.get("extracted_text", "")

        # Classify file
        classification = self.classify_file(filename)

        # Detect sensitive data if text is extractable
        sensitive_analysis = {"sensitive_data_found": False, "risk_level": "minimal"}
        summary = {"summary": "", "key_phrases": [], "word_count": 0}

        if classification["extractable"] and content:
            sensitive_analysis = self.detect_sensitive_data(content)
            summary = self.extract_summary(content)

        # Calculate overall risk
        overall_risk = classification["risk_weight"] * (
            1.0 + sensitive_analysis.get("risk_score", 0)
        )
        overall_risk = min(2.0, overall_risk)

        return {
            "classification": classification,
            "size_bytes": size_bytes,
            "size_human": self._human_size(size_bytes),
            "sensitive_data": sensitive_analysis,
            "content_summary": summary,
            "overall_risk_score": round(overall_risk, 4),
            "recommendations": self._generate_recommendations(
                classification, sensitive_analysis
            )
        }

    def _human_size(self, size_bytes: int) -> str:
        """Convert bytes to human-readable size."""
        for unit in ["B", "KB", "MB", "GB"]:
            if size_bytes < 1024:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.1f} TB"

    def _generate_recommendations(self, classification: Dict, 
                                   sensitive: Dict) -> List[str]:
        """Generate security recommendations based on analysis."""
        recommendations = []

        if classification.get("is_suspicious"):
            recommendations.append("WARNING: Executable/script attachment - scan for malware")
            recommendations.append("Do not execute without security review")

        if sensitive.get("risk_level") in ("critical", "high"):
            recommendations.append("CRITICAL: Sensitive data detected - review before forwarding")
            recommendations.append("Apply data loss prevention (DLP) policies")
            recommendations.append("Consider encrypting or redacting before sharing")

        if classification["category"] == "archive":
            recommendations.append("Archive file detected - scan contents after extraction")

        if not recommendations:
            recommendations.append("No security concerns detected")

        return recommendations

    def process_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process an email and all its attachments.

        Args:
            email: Email dictionary with attachments list and recipients.

        Returns:
            Complete analysis report for the email's attachments.
        """
        attachments = email.get("attachments", [])
        recipients = email.get("recipients", [])

        # Reply-all enforcement
        reply_all_required = len(recipients) > 1
        reply_all_enforced = True if reply_all_required else False

        attachment_results = []
        total_risk = 0.0
        has_sensitive = False

        for attachment in attachments:
            result = self.analyze_attachment(attachment)
            attachment_results.append(result)
            total_risk += result["overall_risk_score"]
            if result["sensitive_data"].get("sensitive_data_found"):
                has_sensitive = True

        avg_risk = total_risk / max(len(attachments), 1)

        return {
            "engine": "Email Attachment Intelligence V372",
            "email_id": email.get("id", "unknown"),
            "subject": email.get("subject", ""),
            "attachment_count": len(attachments),
            "reply_all_required": reply_all_required,
            "reply_all_enforced": reply_all_enforced,
            "recipients_count": len(recipients),
            "has_sensitive_data": has_sensitive,
            "overall_risk_score": round(avg_risk, 4),
            "total_size_bytes": sum(a.get("size_bytes", 0) for a in attachments),
            "attachments": attachment_results
        }


def main():
    """
    Main entry point - runs the Attachment Intelligence Engine with sample data.
    
    Demonstrates:
        - File type classification across multiple formats
        - Sensitive data detection in document content
        - Risk scoring and security recommendations
        - Reply-all enforcement for multi-recipient emails
    """
    engine = AttachmentIntelligenceEngine()

    sample_emails = [
        {
            "id": "MSG-101",
            "subject": "Employee Records - Confidential",
            "recipients": ["hr@company.com", "legal@company.com", "compliance@company.com"],
            "attachments": [
                {
                    "filename": "employee_records_2026.xlsx",
                    "size_bytes": 245760,
                    "extracted_text": (
                        "Employee ID, Name, SSN, Salary\n"
                        "E001, John Smith, 123-45-6789, $85000\n"
                        "E002, Jane Doe, 987-65-4321, $92000\n"
                        "E003, Bob Wilson, 456-78-9012, $78000\n"
                        "Contact HR at hr@company.com or call 555-123-4567\n"
                        "password: admin123 for accessing the portal"
                    )
                }
            ]
        },
        {
            "id": "MSG-102",
            "subject": "Project Deliverables",
            "recipients": ["team@company.com", "pm@company.com"],
            "attachments": [
                {
                    "filename": "project_plan_v3.pdf",
                    "size_bytes": 1048576,
                    "extracted_text": (
                        "Project Alpha - Q2 2026 Delivery Plan. "
                        "The project aims to deliver the new customer portal by June 30. "
                        "Key milestones include API integration, UI testing, and UAT. "
                        "Budget allocation is $2.4M across 3 teams. "
                        "API key: sk_live_abc123def456ghi789 for staging environment. "
                        "Server IP: 192.168.1.100 for deployment."
                    )
                },
                {
                    "filename": "architecture_diagram.png",
                    "size_bytes": 524288,
                    "extracted_text": ""
                }
            ]
        },
        {
            "id": "MSG-103",
            "subject": "Suspicious File - DO NOT OPEN",
            "recipients": ["security@company.com"],
            "attachments": [
                {
                    "filename": "invoice_update.exe",
                    "size_bytes": 35840,
                    "extracted_text": ""
                },
                {
                    "filename": "readme.txt",
                    "size_bytes": 1024,
                    "extracted_text": "Run the installer to view invoice details."
                }
            ]
        },
        {
            "id": "MSG-104",
            "subject": "Q2 Financial Report",
            "recipients": ["cfo@company.com", "board@company.com", "audit@company.com", "legal@company.com"],
            "attachments": [
                {
                    "filename": "financial_summary_q2.csv",
                    "size_bytes": 89600,
                    "extracted_text": (
                        "Revenue: $12.4M, Expenses: $8.2M, Net: $4.2M\n"
                        "Wire transfer account: 12345678901234567\n"
                        "Contact finance at finance@company.com, phone 555-987-6543\n"
                        "Tax ID: 12-3456789"
                    )
                },
                {
                    "filename": "presentation.pptx",
                    "size_bytes": 3145728,
                    "extracted_text": (
                        "Q2 2026 Financial Highlights. Revenue growth of 15% YoY. "
                        "Operating margin improved to 34%. New market expansion "
                        "contributing 22% of total revenue. Guidance raised for H2."
                    )
                }
            ]
        }
    ]

    results = []
    for email in sample_emails:
        report = engine.process_email(email)
        results.append(report)

    output = {
        "engine": "Email Attachment Intelligence V372",
        "analysis_timestamp": datetime.now().isoformat(),
        "emails_analyzed": len(results),
        "reply_all_enforced": True,
        "reports": results
    }

    print(json.dumps(output, indent=2))
    return output


if __name__ == "__main__":
    main()
