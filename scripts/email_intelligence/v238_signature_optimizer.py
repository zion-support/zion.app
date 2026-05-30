#!/usr/bin/env python3
"""V238: Email Signature Optimizer
Dynamic signatures based on recipient type, email context, and business goals.
CRITICAL: Enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from typing import Dict, List

class SignatureOptimizer:
    SIGNATURE_TEMPLATES = {
        "executive": {
            "format": "formal",
            "include_title": True,
            "include_phone": True,
            "include_social": False,
            "cta": "Schedule a meeting"
        },
        "client": {
            "format": "professional",
            "include_title": True,
            "include_phone": True,
            "include_social": True,
            "cta": "Book a consultation"
        },
        "vendor": {
            "format": "standard",
            "include_title": True,
            "include_phone": True,
            "include_social": False,
            "cta": None
        },
        "internal": {
            "format": "casual",
            "include_title": False,
            "include_phone": True,
            "include_social": False,
            "cta": None
        }
    }
    
    BASE_INFO = {
        "name": "Kleber Garcia",
        "title": "CEO & Founder",
        "company": "Zion Tech Group",
        "phone": "+1 302 464 0950",
        "email": "kleber@ziontechgroup.com",
        "website": "ziontechgroup.com",
        "address": "364 E Main St STE 1008, Middletown DE 19709"
    }
    
    def detect_recipient_type(self, email_data: Dict) -> str:
        sender = email_data.get("from", "").lower()
        domain = sender.split("@")[-1] if "@" in sender else ""
        
        if "zion" in domain:
            return "internal"
        elif any(tld in domain for tld in [".gov", ".edu"]):
            return "executive"
        elif any(kw in domain for kw in ["client", "customer", "partner"]):
            return "client"
        else:
            return "vendor"
    
    def generate_signature(self, recipient_type: str, context: str = "") -> Dict:
        template = self.SIGNATURE_TEMPLATES.get(recipient_type, self.SIGNATURE_TEMPLATES["vendor"])
        info = self.BASE_INFO
        
        lines = [info["name"]]
        if template["include_title"]:
            lines.append(f'{info["title"]} | {info["company"]}')
        else:
            lines.append(info["company"])
        
        if template["include_phone"]:
            lines.append(f'📞 {info["phone"]}')
        
        lines.append(f'✉️ {info["email"]}')
        lines.append(f'🌐 {info["website"]}')
        lines.append(f'📍 {info["address"]}')
        
        if template.get("cta"):
            lines.append(f'\n👉 {template["cta"]}: {info["website"]}/contact')
        
        return {
            "signature": "\n".join(lines),
            "format": template["format"],
            "recipient_type": recipient_type,
            "reply_all_required": True
        }
    
    def process_email(self, email_data: Dict, recipients: List[str] = None) -> Dict:
        recipient_type = self.detect_recipient_type(email_data)
        signature = self.generate_signature(recipient_type)
        reply_all = len(recipients or []) > 1
        
        return {
            "email_id": email_data.get("id", ""),
            "recipient_type": recipient_type,
            "signature": signature,
            "reply_all_required": reply_all,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    optimizer = SignatureOptimizer()
    emails = [
        {"id": "sig-001", "from": "ceo@fortune500.com", "to": ["kleber@ziontechgroup.com"]},
        {"id": "sig-002", "from": "prospect@startup.io", "to": ["kleber@ziontechgroup.com"]},
        {"id": "sig-003", "from": "dev@ziontechgroup.com", "to": ["kleber@ziontechgroup.com"]},
    ]
    for e in emails:
        print(json.dumps(optimizer.process_email(e, ["ceo@fortune500.com", "cto@fortune500.com"]), indent=2))
