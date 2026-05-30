#!/usr/bin/env python3
"""V225 - AI Email Attachment Intelligence
Scan attachments for sensitive data, extract key information,
generate summaries, detect malware risks, suggest cloud alternatives.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, os
from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class AttachmentAnalysis:
    filename: str
    file_type: str
    size_mb: float
    risk_level: str
    sensitive_data_detected: List[str]
    summary: str
    cloud_alternative: str
    recommendations: List[str]

class AttachmentAnalyzer:
    RISKY_EXTENSIONS = {
        "high": [".exe", ".bat", ".cmd", ".scr", ".pif", ".vbs", ".js"],
        "medium": [".zip", ".rar", ".7z", ".doc", ".xls", ".ppt"],
        "low": [".pdf", ".png", ".jpg", ".txt", ".csv"],
    }
    
    LARGE_FILE_THRESHOLD_MB = 10
    SENSITIVE_PATTERNS = {
        "financial": r'(?:revenue|profit|salary|compensation|budget|financial)',
        "legal": r'(?:contract|agreement|nda|confidential|privileged)',
        "personal": r'(?:ssn|social security|passport|license|medical)',
        "credentials": r'(?:password|credential|api.?key|secret|token)',
    }
    
    def analyze(self, attachment: Dict) -> AttachmentAnalysis:
        filename = attachment.get("filename", "unknown")
        ext = os.path.splitext(filename)[1].lower()
        size_mb = attachment.get("size_mb", 0)
        
        # Risk assessment
        risk = "low"
        for level, exts in self.RISKY_EXTENSIONS.items():
            if ext in exts:
                risk = level
                break
        if size_mb > self.LARGE_FILE_THRESHOLD_MB:
            risk = "high" if risk == "medium" else risk
        
        # Sensitive data (from filename and metadata)
        sensitive = []
        combined = f"{filename} {attachment.get('description', '')}".lower()
        for category, pattern in self.SENSITIVE_PATTERNS.items():
            if re.search(pattern, combined):
                sensitive.append(category)
        
        # Cloud alternative
        cloud = "Use cloud link (Google Drive/OneDrive/SharePoint)" if size_mb > 5 else ""
        
        recommendations = []
        if risk == "high":
            recommendations.append("Scan with antivirus before opening")
        if size_mb > 5:
            recommendations.append(f"Large file ({size_mb:.1f}MB) — use cloud storage link instead")
        if sensitive:
            recommendations.append(f"Contains {', '.join(sensitive)} data — encrypt before sharing")
        if ext in [".doc", ".xls", ".ppt"]:
            recommendations.append("Consider converting to PDF for security")
        
        summary = f"{filename} ({size_mb:.1f}MB, {ext[1:].upper()}) — Risk: {risk}"
        if sensitive:
            summary += f" — Sensitive: {', '.join(sensitive)}"
        
        return AttachmentAnalysis(
            filename=filename, file_type=ext[1:] if ext else "unknown",
            size_mb=size_mb, risk_level=risk,
            sensitive_data_detected=sensitive, summary=summary,
            cloud_alternative=cloud, recommendations=recommendations
        )

class AttachmentIntelligenceEngine:
    def __init__(self):
        self.analyzer = AttachmentAnalyzer()
    
    def process_email(self, email: Dict, recipients: List[str] = None) -> Dict:
        attachments = email.get("attachments", [])
        if not attachments:
            return {"email_id": email.get("id", ""), "attachments_count": 0,
                    "analyses": [], "reply_all_required": len(recipients or []) > 1}
        
        analyses = [self.analyzer.analyze(a) for a in attachments]
        
        high_risk = sum(1 for a in analyses if a.risk_level == "high")
        with_sensitive = sum(1 for a in analyses if a.sensitive_data_detected)
        total_size = sum(a.size_mb for a in analyses)
        
        overall_recommendations = []
        if high_risk > 0:
            overall_recommendations.append(f"⚠️ {high_risk} high-risk attachment(s) detected — scan before opening")
        if with_sensitive > 0:
            overall_recommendations.append(f"🔒 {with_sensitive} attachment(s) contain sensitive data — encrypt")
        if total_size > 20:
            overall_recommendations.append(f"☁️ Total size {total_size:.1f}MB — use cloud storage links")
        
        return {
            "email_id": email.get("id", ""),
            "attachments_count": len(analyses),
            "total_size_mb": round(total_size, 2),
            "high_risk_count": high_risk,
            "sensitive_data_count": with_sensitive,
            "analyses": [a.__dict__ for a in analyses],
            "overall_recommendations": overall_recommendations,
            "reply_all_required": len(recipients or []) > 1,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = AttachmentIntelligenceEngine()
    sample = {"id": "attach-001", "attachments": [
        {"filename": "Q3_Financial_Report.xlsx", "size_mb": 2.5, "description": "Quarterly financial report"},
        {"filename": "Employee_Salary_Data_2026.csv", "size_mb": 0.8, "description": "HR salary data"},
        {"filename": "setup.exe", "size_mb": 45.0, "description": "Software installer"},
    ]}
    result = engine.process_email(sample, ["finance@zion.com", "hr@zion.com", "it@zion.com"])
    print(json.dumps(result, indent=2))
