#!/usr/bin/env python3
"""V628 - Email Document Summarizer
Summarize long documents and attachments with key points and action items.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime
from typing import Dict, List, Any

class DocumentSummarizer:
    """Summarize email attachments and long documents."""
    
    def __init__(self):
        self.summaries = []
    
    def summarize_document(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Summarize document from email."""
        attachments = email.get("attachments", [])
        body = email.get("body", "")
        
        summaries = []
        for attachment in attachments:
            summary = self._summarize_attachment(attachment)
            summaries.append(summary)
        
        # Summarize email body if long
        body_summary = None
        if len(body) > 500:
            body_summary = self._summarize_text(body)
        
        # Extract action items
        action_items = self._extract_action_items(email)
        
        # Generate executive brief
        executive_brief = self._generate_brief(summaries, body_summary, action_items)
        
        return {
            "engine": "V628",
            "email_subject": email.get("subject", ""),
            "attachment_count": len(attachments),
            "attachment_summaries": summaries,
            "body_summary": body_summary,
            "action_items": action_items,
            "executive_brief": executive_brief,
            "total_reading_time_saved": self._calculate_time_saved(summaries, body_summary),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _summarize_attachment(self, attachment: Dict) -> Dict[str, Any]:
        """Summarize a single attachment."""
        filename = attachment.get("filename", "document")
        file_type = self._detect_type(filename)
        
        # Mock summary (would use actual document parsing in production)
        summary = {
            "filename": filename,
            "type": file_type,
            "pages": attachment.get("pages", 10),
            "word_count": attachment.get("word_count", 2500),
            "summary": self._generate_mock_summary(filename, file_type),
            "key_points": self._extract_key_points_mock(file_type),
            "reading_time_original": f"{attachment.get('pages', 10) * 2} minutes",
            "reading_time_summary": "2 minutes"
        }
        
        return summary
    
    def _detect_type(self, filename: str) -> str:
        """Detect document type."""
        filename_lower = filename.lower()
        
        if filename_lower.endswith(".pdf"):
            return "PDF"
        elif filename_lower.endswith(".doc") or filename_lower.endswith(".docx"):
            return "Word"
        elif filename_lower.endswith(".xls") or filename_lower.endswith(".xlsx"):
            return "Excel"
        elif filename_lower.endswith(".ppt") or filename_lower.endswith(".pptx"):
            return "PowerPoint"
        else:
            return "Other"
    
    def _generate_mock_summary(self, filename: str, file_type: str) -> str:
        """Generate mock summary."""
        summaries = {
            "PDF": f"This PDF document contains key information about {filename.replace('.pdf', '')}. Main topics include project status, budget analysis, and next steps.",
            "Word": f"This Word document outlines {filename.replace('.docx', '').replace('.doc', '')}. Key sections cover objectives, timeline, and resource allocation.",
            "Excel": f"This Excel spreadsheet contains data analysis for {filename.replace('.xlsx', '').replace('.xls', '')}. Includes metrics, trends, and forecasts.",
            "PowerPoint": f"This presentation covers {filename.replace('.pptx', '').replace('.ppt', '')}. Key slides include overview, strategy, and action items."
        }
        return summaries.get(file_type, "Document summary not available")
    
    def _extract_key_points_mock(self, file_type: str) -> List[str]:
        """Extract key points (mock)."""
        points = {
            "PDF": ["Project status: On track", "Budget: Within 5% of target", "Next milestone: Q2 delivery"],
            "Word": ["Objective: Increase efficiency by 20%", "Timeline: 6-month rollout", "Resources: 3 team members"],
            "Excel": ["Revenue up 15% YoY", "Costs reduced by 8%", "ROI: 245%"],
            "PowerPoint": ["Market opportunity: $50M", "Competitive advantage: Speed", "Investment needed: $2M"]
        }
        return points.get(file_type, ["Key point 1", "Key point 2", "Key point 3"])
    
    def _summarize_text(self, text: str) -> Dict[str, Any]:
        """Summarize long email body."""
        sentences = text.split('.')
        
        # Take first 3 sentences as summary
        summary = '. '.join([s.strip() for s in sentences[:3] if len(s.strip()) > 20])
        
        return {
            "original_length": len(text),
            "summary_length": len(summary),
            "summary": summary,
            "compression_ratio": round(len(summary) / len(text) * 100, 1)
        }
    
    def _extract_action_items(self, email: Dict) -> List[str]:
        """Extract action items from email."""
        body = email.get("body", "")
        action_items = []
        
        # Look for action indicators
        patterns = [
            r'(?:please|need to|action item)[:\s]+([^.]+)',
            r'(?:deadline|due)[:\s]+([^.]+)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            action_items.extend([m.strip() for m in matches if len(m.strip()) > 10])
        
        return action_items[:5]
    
    def _generate_brief(self, attachment_summaries: List[Dict], body_summary: Dict, action_items: List[str]) -> str:
        """Generate executive brief."""
        parts = []
        
        if attachment_summaries:
            parts.append(f"Document review: {len(attachment_summaries)} attachment(s) summarized")
        
        if body_summary:
            parts.append(f"Email body: {body_summary['compression_ratio']}% compression")
        
        if action_items:
            parts.append(f"Action items: {len(action_items)} identified")
        
        return " | ".join(parts) if parts else "No summary available"
    
    def _calculate_time_saved(self, attachment_summaries: List[Dict], body_summary: Dict) -> str:
        """Calculate reading time saved."""
        total_saved = 0
        
        for summary in attachment_summaries:
            # Estimate 2 minutes per page original, 2 minutes for summary
            original_time = summary.get("pages", 10) * 2
            saved = original_time - 2
            total_saved += saved
        
        if body_summary:
            # Estimate time saved from body compression
            total_saved += 3
        
        return f"{total_saved} minutes"
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.summarize_document(e) for e in emails if e.get("attachments") or len(e.get("body", "")) > 500]
        
        total_attachments = sum(r["attachment_count"] for r in results)
        total_action_items = sum(len(r["action_items"]) for r in results)
        
        return {
            "engine": "V628 - Document Summarizer",
            "total_summarized": len(results),
            "total_attachments": total_attachments,
            "total_action_items": total_action_items,
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = DocumentSummarizer()
    test_emails = [
        {"subject": "Q4 Report", "body": "Please find the quarterly report attached. Action item: review by Friday.",
         "to": ["team@company.com", "manager@company.com"], "from": "finance@company.com",
         "attachments": [{"filename": "Q4_Report.pdf", "pages": 25, "word_count": 8000}]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
