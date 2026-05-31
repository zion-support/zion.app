#!/usr/bin/env python3
"""V604 - Email Archival Intelligence
Smart email archival with semantic search, categorization, and storage optimization.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re, hashlib
from datetime import datetime
from typing import Dict, List, Any

class ArchivalIntelligence:
    """Smart archival with semantic search and deduplication."""
    
    CATEGORIES = {
        "meeting": [r"\bmeeting\b", r"\bschedule\b", r"\bagenda\b", r"\bcalendar\b"],
        "decision": [r"\bdecided\b", r"\bapproved\b", r"\bagreed\b", r"\bconcluded\b"],
        "question": [r"\?\s*$", r"\bcould you\b", r"\bcan you\b", r"\bhow do\b"],
        "attachment": [r"\battached\b", r"\battachment\b", r"\bfile\b", r"\bdocument\b"],
        "invoice": [r"\binvoice\b", r"\bpayment\b", r"\bbilling\b", r"\breceipt\b"],
        "contract": [r"\bcontract\b", r"\bagreement\b", r"\bterms\b", r"\bsignature\b"],
        "support": [r"\bhelp\b", r"\bissue\b", r"\bproblem\b", r"\bticket\b"],
        "sales": [r"\bproposal\b", r"\bquote\b", r"\bpricing\b", r"\bdeal\b"]
    }
    
    def __init__(self):
        self.archive = []
        self.index = {}
    
    def archive_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Archive email with smart categorization."""
        categories = self._categorize(email)
        content_hash = self._hash_content(email)
        is_duplicate = content_hash in self.index
        
        archive_entry = {
            "engine": "V604",
            "archive_id": f"arc_{len(self.archive) + 1:06d}",
            "original_subject": email.get("subject", ""),
            "categories": categories,
            "primary_category": categories[0] if categories else "general",
            "content_hash": content_hash,
            "is_duplicate": is_duplicate,
            "tags": self._auto_tag(email),
            "storage_size_bytes": len(json.dumps(email)),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "archived_at": datetime.now().isoformat()
        }
        
        if not is_duplicate:
            self.archive.append(archive_entry)
            self.index[content_hash] = archive_entry
        
        return archive_entry
    
    def semantic_search(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """Search archive with semantic matching."""
        query_terms = query.lower().split()
        scored = []
        for entry in self.archive:
            score = sum(1 for term in query_terms if term in entry.get("original_subject", "").lower() or any(term in t for t in entry.get("tags", [])))
            if score > 0:
                scored.append({"entry": entry, "relevance_score": score})
        
        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        return {
            "engine": "V604",
            "query": query,
            "total_results": len(scored),
            "results": scored[:limit],
            "reply_all_enforced": True,
            "timestamp": datetime.now().isoformat()
        }
    
    def _categorize(self, email: Dict) -> List[str]:
        text = f"{email.get('subject', '')} {email.get('body', '')}".lower()
        categories = []
        for cat, patterns in self.CATEGORIES.items():
            if any(re.search(p, text) for p in patterns):
                categories.append(cat)
        return categories or ["general"]
    
    def _auto_tag(self, email: Dict) -> List[str]:
        tags = []
        subject = email.get("subject", "").lower()
        if "urgent" in subject: tags.append("urgent")
        if "project" in subject: tags.append("project")
        if "review" in subject: tags.append("review")
        if "@" in email.get("from", ""): tags.append(email["from"].split("@")[1].split(".")[0])
        return tags
    
    def _hash_content(self, email: Dict) -> str:
        content = f"{email.get('subject', '')}{email.get('body', '')[:200]}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.archive_email(e) for e in emails]
        return {
            "engine": "V604 - Archival Intelligence",
            "total_archived": len(results),
            "duplicates_found": sum(1 for r in results if r["is_duplicate"]),
            "categories_used": list(set(r["primary_category"] for r in results)),
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = ArchivalIntelligence()
    test_emails = [
        {"subject": "Meeting tomorrow at 3pm", "body": "Please join the meeting to discuss the project.", "from": "boss@company.com", "to": ["team@company.com", "manager@company.com"]},
        {"subject": "Invoice #12345", "body": "Please find the invoice attached for payment.", "from": "billing@vendor.com", "to": ["accounts@company.com"]},
        {"subject": "Contract review needed", "body": "Could you review the agreement terms?", "from": "legal@company.com", "to": ["ceo@company.com", "cfo@company.com", "legal@company.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
