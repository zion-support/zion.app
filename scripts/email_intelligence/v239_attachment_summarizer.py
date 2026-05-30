#!/usr/bin/env python3
"""V239: Email Attachment Summarizer
Generate previews and summaries of email attachments without opening them.
CRITICAL: Enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, os
from typing import Dict, List

class AttachmentSummarizer:
    FILE_TYPE_HANDLERS = {
        ".pdf": {"icon": "📄", "type": "document", "preview": True},
        ".doc": {"icon": "📝", "type": "document", "preview": True},
        ".docx": {"icon": "📝", "type": "document", "preview": True},
        ".xls": {"icon": "📊", "type": "spreadsheet", "preview": True},
        ".xlsx": {"icon": "📊", "type": "spreadsheet", "preview": True},
        ".csv": {"icon": "📈", "type": "data", "preview": True},
        ".ppt": {"icon": "📽️", "type": "presentation", "preview": True},
        ".pptx": {"icon": "📽️", "type": "presentation", "preview": True},
        ".jpg": {"icon": "🖼️", "type": "image", "preview": True},
        ".png": {"icon": "🖼️", "type": "image", "preview": True},
        ".zip": {"icon": "📦", "type": "archive", "preview": False},
        ".mp4": {"icon": "🎬", "type": "video", "preview": False},
    }
    
    RISKY_EXTENSIONS = {".exe", ".bat", ".cmd", ".scr", ".pif", ".vbs", ".js"}
    
    def summarize_attachment(self, attachment: Dict) -> Dict:
        filename = attachment.get("filename", "unknown")
        size_mb = attachment.get("size_mb", 0)
        ext = os.path.splitext(filename)[1].lower()
        
        handler = self.FILE_TYPE_HANDLERS.get(ext, {"icon": "📎", "type": "unknown", "preview": False})
        
        # Risk assessment
        risk = "low"
        warnings = []
        if ext in self.RISKY_EXTENSIONS:
            risk = "critical"
            warnings.append(f"⚠️ Executable file ({ext}) - scan before opening")
        if size_mb > 25:
            risk = "medium"
            warnings.append(f"Large file ({size_mb:.1f}MB) - consider cloud link")
        if size_mb > 100:
            risk = "high"
            warnings.append(f"Very large file ({size_mb:.1f}MB) - use cloud storage")
        
        # Generate preview summary
        preview = f"{handler['icon']} {filename} ({handler['type']})"
        if size_mb > 0:
            preview += f" - {size_mb:.1f}MB"
        if handler.get("preview"):
            preview += " | Preview available"
        
        return {
            "filename": filename,
            "file_type": handler["type"],
            "icon": handler["icon"],
            "size_mb": round(size_mb, 2),
            "risk_level": risk,
            "warnings": warnings,
            "preview_available": handler.get("preview", False),
            "summary": preview,
            "recommendation": self._get_recommendation(risk, handler, size_mb)
        }
    
    def _get_recommendation(self, risk: str, handler: Dict, size_mb: float) -> str:
        if risk == "critical":
            return "DO NOT OPEN - scan with antivirus first"
        if size_mb > 50:
            return "Request sender to use cloud storage link instead"
        if handler.get("preview"):
            return "Safe to preview inline"
        return "Download to view"
    
    def process_email(self, email: Dict, recipients: List[str] = None) -> Dict:
        attachments = email.get("attachments", [])
        summaries = [self.summarize_attachment(a) for a in attachments]
        
        total_size = sum(s["size_mb"] for s in summaries)
        risky = sum(1 for s in summaries if s["risk_level"] in ("critical", "high"))
        
        return {
            "email_id": email.get("id", ""),
            "attachments_count": len(summaries),
            "total_size_mb": round(total_size, 2),
            "risky_attachments": risky,
            "summaries": summaries,
            "reply_all_required": len(recipients or []) > 1,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    summarizer = AttachmentSummarizer()
    email = {"id": "att-001", "attachments": [
        {"filename": "Q3_Report_2026.pdf", "size_mb": 3.2},
        {"filename": "Budget_2026.xlsx", "size_mb": 1.5},
        {"filename": "setup.exe", "size_mb": 45.0},
        {"filename": "Presentation.pptx", "size_mb": 78.0},
    ]}
    print(json.dumps(summarizer.process_email(email, ["finance@co.com", "ceo@co.com"]), indent=2))
