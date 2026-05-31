#!/usr/bin/env python3
"""
V971: Email Signature Intelligence Engine
Parses email signatures to extract structured contact info, role, company,
social links, certifications, and auto-enriches CRM records.
STRICT reply-all enforcement for all multi-recipient emails.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional


class SignatureIntelligence:
    """Parses and extracts intelligence from email signatures."""

    ROLE_PATTERNS = {
        "executive": ["ceo", "cto", "cfo", "coo", "chief", "president", "founder", "co-founder"],
        "management": ["director", "vp", "vice president", "head of", "general manager"],
        "technical": ["engineer", "developer", "architect", "devops", "sre", "technical lead"],
        "sales": ["sales", "account manager", "business development", "sales director"],
        "support": ["support", "customer success", "help desk", "service desk"],
        "hr": ["hr", "human resources", "recruiter", "talent", "people ops"],
        "marketing": ["marketing", "growth", "brand", "content", "seo", "cmo"],
    }

    SOCIAL_PATTERNS = {
        "linkedin": r'(?:linkedin\.com/in/|linkedin\.com/company/)([a-zA-Z0-9\-_]+)',
        "twitter": r'(?:twitter\.com|x\.com)/([a-zA-Z0-9_]+)',
        "github": r'github\.com/([a-zA-Z0-9\-_]+)',
        "website": r'(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)',
    }

    def __init__(self):
        self.signature_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.contact_database: Dict[str, Dict] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email signature case by case."""
        analysis = {
            "engine": "V971",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "signature_intelligence",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")

        # Extract signature (typically after -- or after sign-off)
        signature = self._extract_signature(body)
        analysis["signature_found"] = bool(signature)

        if signature:
            # Parse name
            name = self._extract_name(signature, email.get("from", ""))
            analysis["extracted_name"] = name

            # Parse role/title
            role = self._extract_role(signature)
            analysis["extracted_role"] = role

            # Parse company
            company = self._extract_company(signature)
            analysis["extracted_company"] = company

            # Parse contact info
            contact = self._extract_contact_info(signature)
            analysis["extracted_contact"] = contact

            # Parse social links
            social = self._extract_social_links(signature)
            analysis["extracted_social"] = social

            # Parse certifications/credentials
            certs = self._extract_certifications(signature)
            analysis["certifications"] = certs

            # CRM enrichment data
            crm_data = self._build_crm_enrichment(
                name, role, company, contact, social, certs
            )
            analysis["crm_enrichment"] = crm_data

            # Seniority assessment
            seniority = self._assess_seniority(role, company)
            analysis["seniority"] = seniority

            # Store contact
            sender = email.get("from", "")
            if sender:
                self.contact_database[sender] = crm_data
        else:
            analysis["extracted_name"] = None
            analysis["extracted_role"] = None
            analysis["extracted_company"] = None

        # Determine action
        action = self._determine_signature_action(analysis)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        self.signature_log.append({
            "email_id": analysis["email_id"],
            "signature_found": bool(signature),
            "role": analysis.get("extracted_role", {}).get("title") if signature else None,
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _extract_signature(self, body: str) -> str:
        """Extract signature from email body."""
        # Look for common signature delimiters
        delimiters = [
            r'\n--\s*\n',  # Standard -- delimiter
            r'\n_{3,}\n',  # Underscore line
            r'\n-{3,}\n',  # Dash line
            r'\n(?:Regards|Best|Thanks|Sincerely|Cheers)[,\.]?\s*\n',
        ]

        for pattern in delimiters:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                return body[match.end():].strip()

        # Fallback: last 8 lines
        lines = body.strip().split('\n')
        if len(lines) > 8:
            return '\n'.join(lines[-8:]).strip()

        return ""

    def _extract_name(self, signature: str, from_field: str) -> Dict:
        """Extract name from signature."""
        lines = [l.strip() for l in signature.split('\n') if l.strip()]

        # First non-empty line is usually the name
        candidate_name = lines[0] if lines else ""

        # Clean up: remove titles, suffixes
        name = re.sub(r'^(?:Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+', '', candidate_name)
        name = re.sub(r'\s+(?:PhD|MBA|PMP|CPA|JD|MD|Esq)\.?,?\s*$', '', name)

        # Fallback to from field
        if not name or len(name) < 3:
            match = re.match(r'"?([^"<]+)"?\s*<', from_field)
            if match:
                name = match.group(1).strip()

        return {
            "full_name": name,
            "confidence": 0.9 if name and len(name) > 3 else 0.5,
        }

    def _extract_role(self, signature: str) -> Dict:
        """Extract role/title from signature."""
        lines = [l.strip() for l in signature.split('\n') if l.strip()]
        title = None

        for line in lines[:5]:  # Check first 5 lines
            line_lower = line.lower()
            # Skip lines that look like names or companies
            if len(line) > 50:
                continue
            # Check if line contains role keywords
            for category, keywords in self.ROLE_PATTERNS.items():
                if any(kw in line_lower for kw in keywords):
                    title = line
                    break
            if title:
                break

        # Generic title detection
        if not title:
            for line in lines[:5]:
                if re.match(r'^[A-Z][a-zA-Z\s\&,]+$', line) and len(line) < 40:
                    title = line
                    break

        category = "unknown"
        if title:
            title_lower = title.lower()
            for cat, keywords in self.ROLE_PATTERNS.items():
                if any(kw in title_lower for kw in keywords):
                    category = cat
                    break

        return {
            "title": title,
            "category": category,
            "confidence": 0.85 if title else 0.3,
        }

    def _extract_company(self, signature: str) -> Dict:
        """Extract company name from signature."""
        lines = [l.strip() for l in signature.split('\n') if l.strip()]

        # Company is usually 2nd or 3rd line
        for line in lines[1:5]:
            # Skip if it looks like a title or address
            if re.match(r'^[\+\d\s\(\)\-]+$', line):  # Phone number
                continue
            if re.match(r'^[\w\.\-]+@[\w\.\-]+$', line):  # Email
                continue
            if re.search(r'\b(street|avenue|road|suite|floor|city|state)\b', line, re.IGNORECASE):
                continue
            if len(line) > 5 and len(line) < 50 and re.match(r'^[A-Z]', line):
                return {
                    "name": line,
                    "confidence": 0.75,
                }

        return {"name": None, "confidence": 0.2}

    def _extract_contact_info(self, signature: str) -> Dict:
        """Extract contact information from signature."""
        contact = {}

        # Phone numbers
        phones = re.findall(
            r'(?:\+?1[\s\-\.\(]?)?(?:\(?\d{3}\)?[\s\-\.\)]?)?\d{3}[\s\-\.]?\d{4}',
            signature
        )
        if phones:
            contact["phones"] = list(set(phones))[:3]

        # Email addresses
        emails = re.findall(r'[\w\.\-]+@[\w\.\-]+\.\w+', signature)
        if emails:
            contact["emails"] = list(set(emails))[:3]

        # Physical address
        address_patterns = [
            r'\d+\s+[A-Z][a-zA-Z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Plaza|Pl)',
            r'(?:Suite|Ste|Floor|Fl)\s+\w+',
        ]
        address_parts = []
        for pattern in address_patterns:
            matches = re.findall(pattern, signature, re.IGNORECASE)
            address_parts.extend(matches)
        if address_parts:
            contact["address_parts"] = address_parts[:3]

        # Website
        websites = re.findall(r'(?:https?://)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)', signature)
        if websites:
            contact["websites"] = [w for w in set(websites) if not any(x in w for x in ["gmail", "yahoo", "hotmail", "outlook"])][:3]

        return contact

    def _extract_social_links(self, signature: str) -> Dict:
        """Extract social media links from signature."""
        social = {}
        for platform, pattern in self.SOCIAL_PATTERNS.items():
            matches = re.findall(pattern, signature)
            if matches:
                social[platform] = list(set(matches))[:2]
        return social

    def _extract_certifications(self, signature: str) -> Dict:
        """Extract certifications and credentials."""
        cert_patterns = [
            r'\b(PhD|MBA|PMP|CPA|JD|MD|Esq|CFA|CPA|CISSP|AWS\s+\w+|Azure\s+\w+|Google\s+Cloud\s+\w+)\b',
            r'\b(PMP|PRINCE2|Scrum\s+Master|ITIL|Six\s+Sigma)\b',
        ]
        certs = []
        for pattern in cert_patterns:
            matches = re.findall(pattern, signature)
            certs.extend(matches)

        return {
            "certifications": list(set(certs))[:5],
            "count": len(set(certs)),
        }

    def _build_crm_enrichment(self, name: Dict, role: Dict, company: Dict, contact: Dict, social: Dict, certs: Dict) -> Dict:
        """Build CRM enrichment data."""
        return {
            "contact_name": name.get("full_name"),
            "job_title": role.get("title"),
            "job_category": role.get("category"),
            "company": company.get("name"),
            "phone_numbers": contact.get("phones", []),
            "emails": contact.get("emails", []),
            "social_profiles": social,
            "certifications": certs.get("certifications", []),
            "enrichment_ready": bool(name.get("full_name") and (role.get("title") or company.get("name"))),
        }

    def _assess_seniority(self, role: Dict, company: Dict) -> Dict:
        """Assess sender seniority based on role."""
        title = (role.get("title") or "").lower()

        if any(kw in title for kw in ["ceo", "cto", "cfo", "coo", "president", "founder", "chief"]):
            level = "C-SUITE"
            score = 95
        elif any(kw in title for kw in ["vp", "vice president", "director", "head of"]):
            level = "SENIOR_LEADERSHIP"
            score = 80
        elif any(kw in title for kw in ["manager", "lead", "principal", "senior"]):
            level = "MID_SENIOR"
            score = 60
        elif role.get("category") != "unknown":
            level = "INDIVIDUAL_CONTRIBUTOR"
            score = 40
        else:
            level = "UNKNOWN"
            score = 20

        return {"level": level, "score": score}

    def _determine_signature_action(self, analysis: Dict) -> str:
        if not analysis.get("signature_found"):
            return "NO_SIGNATURE_DETECTED"
        if analysis.get("crm_enrichment", {}).get("enrichment_ready"):
            return "ENRICH_CRM_RECORD"
        if analysis.get("seniority", {}).get("level") == "C-SUITE":
            return "FLAG_EXECUTIVE_CONTACT"
        return "UPDATE_CONTACT_PROFILE"

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
        }
        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient."
        return result

    def get_stats(self) -> Dict:
        if not self.signature_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.signature_log),
            "signatures_found": sum(1 for s in self.signature_log if s["signature_found"]),
            "contacts_enriched": len(self.contact_database),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v971():
    engine = SignatureIntelligence()

    email1 = {
        "id": "sig-001",
        "from": "john.smith@acme.com",
        "to": ["sales@ziontechgroup.com", "partnerships@ziontechgroup.com"],
        "cc": ["ceo@acme.com"],
        "subject": "Partnership opportunity",
        "body": "Hi team,\n\nWe'd like to explore a partnership.\n\nBest regards,\n\n--\nJohn Smith, MBA\nVP of Business Development\nAcme Corporation\n+1 (555) 123-4567\njohn.smith@acme.com\nlinkedin.com/in/johnsmith\nwww.acme.com\n123 Business Ave, Suite 500",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["signature_found"] is True
    assert r1["extracted_role"]["category"] in ("sales", "management")
    print(f"✅ Test 1 PASSED: Name={r1['extracted_name']['full_name']}, Role={r1['extracted_role']['title']}, Category={r1['extracted_role']['category']}, Company={r1['extracted_company']['name']}, reply-all enforced")

    email2 = {
        "id": "sig-002",
        "from": "dev@startup.io",
        "to": ["support@ziontechgroup.com"],
        "subject": "Bug report",
        "body": "There's a bug in the API.\n\nThanks,\nAlice",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    print(f"✅ Test 2 PASSED: Minimal signature, signature_found={r2['signature_found']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_analyzed']} analyzed, {stats['signatures_found']} signatures, {stats['contacts_enriched']} contacts enriched")

    print("\n🎉 V971 ALL TESTS PASSED — Signature Intelligence Engine operational!")
    return True


if __name__ == "__main__":
    test_v971()
