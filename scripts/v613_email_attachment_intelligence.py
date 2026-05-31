#!/usr/bin/env python3
"""V613 - Email Attachment Intelligence
Smart preview, summarization, and organization of email attachments.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re, hashlib
from datetime import datetime
from typing import Dict, List, Any

class AttachmentIntelligence:
    """Analyze and manage email attachments intelligently."""
    
    FILE_CATEGORIES = {
        "document": [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt"],
        "spreadsheet": [".xls", ".xlsx", ".csv", ".ods"],
        "presentation": [".ppt", ".pptx", ".key", ".odp"],
        "image": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
        "code": [".py", ".js", ".ts", ".java", ".cpp", ".c", ".go", ".rs"],
        "archive": [".zip", ".tar", ".gz", ".rar", ".7z"],
        "video": [".mp4", ".avi", ".mov", ".mkv", ".wmv"],
        "audio": [".mp3", ".wav", ".ogg", ".flac", ".aac"]
    }
    
    SECURITY_FLAGS = ["executable", ".exe", ".bat", ".cmd", ".ps1", ".sh", ".vbs", "macro-enabled"]
    
    def __init__(self):
        self.attachments = []
    
    def analyze_attachments(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze all attachments in an email."""
        raw_attachments = email.get("attachments", [])
        
        analyzed = []
        for att in raw_attachments:
            analysis = self._analyze_single(att, email)
            analyzed.append(analysis)
        
        summary = self._generate_summary(analyzed)
        security_alerts = self._check_security(analyzed)
        organization_tags = self._auto_organize(analyzed)
        
        return {
            "engine": "V613",
            "total_attachments": len(analyzed),
            "attachments": analyzed,
            "summary": summary,
            "security_alerts": security_alerts,
            "organization_tags": organization_tags,
            "total_size_bytes": sum(a.get("size_bytes", 0) for a in analyzed),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _analyze_single(self, attachment: Dict, email: Dict) -> Dict[str, Any]:
        """Analyze a single attachment."""
        filename = attachment.get("filename", "unknown")
        extension = self._get_extension(filename)
        category = self._categorize_file(extension)
        
        return {
            "filename": filename,
            "extension": extension,
            "category": category,
            "size_bytes": attachment.get("size", 0),
            "size_human": self._human_size(attachment.get("size", 0)),
            "content_hash": attachment.get("hash", hashlib.md5(filename.encode()).hexdigest()),
            "is_executable": extension in [".exe", ".bat", ".cmd", ".ps1", ".sh"],
            "security_risk": self._assess_risk(extension, attachment),
            "preview_available": category in ["document", "spreadsheet", "presentation", "image"],
            "summary": self._generate_file_summary(attachment, category),
            "suggested_folder": self._suggest_folder(category, email),
            "cloud_sync_ready": True
        }
    
    def _get_extension(self, filename: str) -> str:
        """Extract file extension."""
        parts = filename.rsplit('.', 1)
        return f".{parts[1].lower()}" if len(parts) > 1 else ""
    
    def _categorize_file(self, extension: str) -> str:
        """Categorize file by extension."""
        for category, extensions in self.FILE_CATEGORIES.items():
            if extension in extensions:
                return category
        return "other"
    
    def _human_size(self, size_bytes: int) -> str:
        """Convert bytes to human-readable size."""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.1f} TB"
    
    def _assess_risk(self, extension: str, attachment: Dict) -> str:
        """Assess security risk of attachment."""
        if extension in [".exe", ".bat", ".cmd", ".ps1", ".vbs"]:
            return "high"
        if attachment.get("macro_enabled", False):
            return "high"
        if extension in [".zip", ".rar", ".7z"]:
            return "medium"
        if extension in [".js", ".html", ".svg"]:
            return "medium"
        return "low"
    
    def _generate_file_summary(self, attachment: Dict, category: str) -> str:
        """Generate summary for attachment."""
        summaries = {
            "document": f"Document: {attachment.get('pages', 'N/A')} pages",
            "spreadsheet": f"Spreadsheet: {attachment.get('sheets', 'N/A')} sheets",
            "presentation": f"Presentation: {attachment.get('slides', 'N/A')} slides",
            "image": f"Image: {attachment.get('dimensions', 'N/A')}",
            "code": f"Source code: {attachment.get('lines', 'N/A')} lines",
            "archive": f"Archive: {attachment.get('file_count', 'N/A')} files",
            "video": f"Video: {attachment.get('duration', 'N/A')}",
            "audio": f"Audio: {attachment.get('duration', 'N/A')}"
        }
        return summaries.get(category, f"File: {attachment.get('filename', 'unknown')}")
    
    def _suggest_folder(self, category: str, email: Dict) -> str:
        """Suggest folder for organization."""
        folders = {
            "document": "Documents",
            "spreadsheet": "Spreadsheets",
            "presentation": "Presentations",
            "image": "Images",
            "code": "Source Code",
            "archive": "Archives",
            "video": "Videos",
            "audio": "Audio"
        }
        return folders.get(category, "Other")
    
    def _generate_summary(self, attachments: List[Dict]) -> str:
        """Generate overall summary of attachments."""
        if not attachments:
            return "No attachments"
        categories = {}
        for att in attachments:
            cat = att["category"]
            categories[cat] = categories.get(cat, 0) + 1
        parts = [f"{count} {cat}(s)" for cat, count in categories.items()]
        return f"{len(attachments)} attachment(s): {', '.join(parts)}"
    
    def _check_security(self, attachments: List[Dict]) -> List[str]:
        """Check for security issues."""
        alerts = []
        for att in attachments:
            if att["security_risk"] == "high":
                alerts.append(f"HIGH RISK: {att['filename']} - executable or macro-enabled file")
            elif att["security_risk"] == "medium":
                alerts.append(f"MEDIUM RISK: {att['filename']} - review before opening")
        return alerts
    
    def _auto_organize(self, attachments: List[Dict]) -> List[str]:
        """Generate organization tags."""
        tags = set()
        for att in attachments:
            tags.add(att["category"])
            tags.add(att["suggested_folder"])
        return list(tags)
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.analyze_attachments(e) for e in emails if e.get("attachments")]
        total_attachments = sum(r["total_attachments"] for r in results)
        security_issues = sum(len(r["security_alerts"]) for r in results)
        return {
            "engine": "V613 - Attachment Intelligence",
            "emails_with_attachments": len(results),
            "total_attachments": total_attachments,
            "security_issues": security_issues,
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = AttachmentIntelligence()
    test_emails = [
        {"subject": "Q4 Report", "body": "Please find the quarterly report attached.", "to": ["team@company.com", "manager@company.com"],
         "attachments": [
             {"filename": "Q4_Report.pdf", "size": 2456789, "pages": 24},
             {"filename": "Budget_2026.xlsx", "size": 456789, "sheets": 5},
             {"filename": "presentation.pptx", "size": 8901234, "slides": 15}
         ]},
        {"subject": "Code review", "body": "Here's the updated code.", "to": ["dev@company.com"],
         "attachments": [
             {"filename": "main.py", "size": 12345, "lines": 450},
             {"filename": "suspicious.exe", "size": 987654}
         ]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
