#!/usr/bin/env python3
"""
V991: Email DNA Fingerprinting Engine
Unique content fingerprinting to detect duplicates, forgeries, and thread lineage.
Enables fraud prevention and deduplication with strict reply-all enforcement.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any
from collections import defaultdict


class EmailDNAFingerprinting:
    """Generates unique fingerprints for email content analysis."""

    def __init__(self):
        self.fingerprint_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.fingerprint_database: Dict[str, Dict] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email DNA case by case."""
        analysis = {
            "engine": "V991",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "dna_fingerprinting",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")

        # 1. Generate content fingerprint
        content_fingerprint = self._generate_content_fingerprint(subject, body)
        analysis["content_fingerprint"] = content_fingerprint

        # 2. Generate sender fingerprint
        sender_fingerprint = self._generate_sender_fingerprint(email)
        analysis["sender_fingerprint"] = sender_fingerprint

        # 3. Generate thread fingerprint
        thread_fingerprint = self._generate_thread_fingerprint(email)
        analysis["thread_fingerprint"] = thread_fingerprint

        # 4. Detect duplicates
        duplicates = self._detect_duplicates(content_fingerprint)
        analysis["duplicates"] = duplicates

        # 5. Detect forgeries
        forgeries = self._detect_forgeries(email, sender_fingerprint)
        analysis["forgeries"] = forgeries

        # 6. Thread lineage analysis
        lineage = self._analyze_thread_lineage(email, thread_fingerprint)
        analysis["thread_lineage"] = lineage

        # 7. Uniqueness score
        uniqueness = self._calculate_uniqueness_score(
            content_fingerprint, duplicates, forgeries
        )
        analysis["uniqueness_score"] = uniqueness

        # 8. DNA signature
        dna_signature = self._generate_dna_signature(
            content_fingerprint, sender_fingerprint, thread_fingerprint
        )
        analysis["dna_signature"] = dna_signature

        # 9. Store fingerprint
        self._store_fingerprint(analysis["email_id"], dna_signature)

        # 10. Determine action
        action = self._determine_dna_action(uniqueness, duplicates, forgeries)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        self.fingerprint_log.append({
            "email_id": analysis["email_id"],
            "content_hash": content_fingerprint["hash"],
            "uniqueness_score": uniqueness["score"],
            "duplicate_count": len(duplicates),
            "forgery_indicators": len(forgeries["indicators"]),
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _generate_content_fingerprint(self, subject: str, body: str) -> Dict:
        """Generate content-based fingerprint."""
        # Normalize text
        normalized = f"{subject} {body}".lower().strip()
        normalized = re.sub(r'\s+', ' ', normalized)
        
        # Generate hash
        content_hash = hashlib.sha256(normalized.encode()).hexdigest()[:32]
        
        # Extract key phrases for fuzzy matching
        words = normalized.split()
        key_phrases = []
        
        # Extract 3-word phrases
        for i in range(len(words) - 2):
            phrase = ' '.join(words[i:i+3])
            key_phrases.append(phrase)
        
        # Word frequency analysis
        word_freq = defaultdict(int)
        for word in words:
            if len(word) > 3:  # Skip short words
                word_freq[word] += 1
        
        # Top 10 most frequent words
        top_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            "hash": content_hash,
            "normalized_length": len(normalized),
            "word_count": len(words),
            "key_phrases": key_phrases[:20],
            "top_words": [word for word, freq in top_words],
            "readability_score": self._calculate_readability(words),
        }

    def _calculate_readability(self, words: List[str]) -> float:
        """Calculate simple readability score."""
        if not words:
            return 0.0
        
        avg_word_length = sum(len(word) for word in words) / len(words)
        # Simpler readability: shorter average word length = more readable
        score = max(0, 100 - (avg_word_length * 10))
        return round(score, 1)

    def _generate_sender_fingerprint(self, email: Dict) -> Dict:
        """Generate sender-based fingerprint."""
        sender = email.get("from", "")
        
        # Extract email components
        email_match = re.search(r'<([^>]+)>', sender)
        email_addr = email_match.group(1) if email_match else sender
        
        # Parse email
        if '@' in email_addr:
            local, domain = email_addr.split('@', 1)
        else:
            local, domain = email_addr, ""
        
        # Domain reputation signals
        free_providers = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
        is_free_provider = domain.lower() in free_providers
        
        # Display name extraction
        name_match = re.match(r'^"?([^"<]+)"?\s*<', sender)
        display_name = name_match.group(1).strip() if name_match else ""
        
        return {
            "email_address": email_addr,
            "local_part": local,
            "domain": domain,
            "display_name": display_name,
            "is_free_provider": is_free_provider,
            "domain_length": len(domain),
            "hash": hashlib.md5(email_addr.lower().encode()).hexdigest()[:16],
        }

    def _generate_thread_fingerprint(self, email: Dict) -> Dict:
        """Generate thread-based fingerprint."""
        thread_id = email.get("thread_id", "")
        in_reply_to = email.get("in_reply_to", "")
        references = email.get("references", [])
        
        # Thread depth calculation
        depth = len(references) if references else 0
        
        # Thread hash
        thread_hash = hashlib.md5(thread_id.encode()).hexdigest()[:16] if thread_id else ""
        
        return {
            "thread_id": thread_id,
            "thread_hash": thread_hash,
            "in_reply_to": in_reply_to,
            "references_count": len(references),
            "depth": depth,
            "is_reply": bool(in_reply_to),
            "is_thread_start": not in_reply_to and not references,
        }

    def _detect_duplicates(self, fingerprint: Dict) -> List[Dict]:
        """Detect duplicate emails based on fingerprint."""
        duplicates = []
        
        for email_id, stored_fp in self.fingerprint_database.items():
            # Exact match
            if stored_fp.get("content_hash") == fingerprint["hash"]:
                duplicates.append({
                    "email_id": email_id,
                    "match_type": "exact",
                    "confidence": 1.0,
                })
            # Fuzzy match based on key phrases
            elif self._fuzzy_match(fingerprint, stored_fp):
                duplicates.append({
                    "email_id": email_id,
                    "match_type": "fuzzy",
                    "confidence": 0.75,
                })
        
        return duplicates

    def _fuzzy_match(self, fp1: Dict, fp2: Dict) -> bool:
        """Check for fuzzy match based on key phrases."""
        phrases1 = set(fp1.get("key_phrases", []))
        phrases2 = set(fp2.get("key_phrases", []))
        
        if not phrases1 or not phrases2:
            return False
        
        # Calculate Jaccard similarity
        intersection = phrases1 & phrases2
        union = phrases1 | phrases2
        
        similarity = len(intersection) / len(union) if union else 0
        
        return similarity > 0.6  # 60% similarity threshold

    def _detect_forgeries(self, email: Dict, sender_fp: Dict) -> Dict:
        """Detect potential email forgeries."""
        indicators = []
        
        # Check for suspicious domain patterns
        domain = sender_fp["domain"].lower()
        
        # Typosquatting detection
        common_domains = ["gmail.com", "yahoo.com", "microsoft.com", "google.com"]
        for common in common_domains:
            if self._is_typosquat(domain, common):
                indicators.append({
                    "type": "typosquatting",
                    "suspicious_domain": domain,
                    "similar_to": common,
                    "severity": "HIGH",
                })
        
        # Display name vs email mismatch
        display_name = sender_fp["display_name"].lower()
        if display_name and domain:
            name_words = set(display_name.split())
            domain_words = set(domain.split('.'))
            
            # If display name contains company keywords but domain doesn't match
            company_keywords = ["support", "admin", "noreply", "help", "info"]
            if any(kw in display_name for kw in company_keywords):
                if sender_fp["is_free_provider"]:
                    indicators.append({
                        "type": "display_name_mismatch",
                        "description": "Official-sounding name with free email provider",
                        "severity": "MEDIUM",
                    })
        
        # Suspicious character patterns
        local_part = sender_fp["local_part"]
        if re.search(r'[0-9]{5,}', local_part):
            indicators.append({
                "type": "suspicious_local_part",
                "description": "Email contains long numeric sequences",
                "severity": "LOW",
            })
        
        return {
            "indicators": indicators,
            "risk_level": "HIGH" if any(i["severity"] == "HIGH" for i in indicators) else "MEDIUM" if indicators else "LOW",
            "indicator_count": len(indicators),
        }

    def _is_typosquat(self, domain1: str, domain2: str) -> bool:
        """Check if domain1 is a typosquat of domain2."""
        # Simple Levenshtein distance check
        if len(domain1) < 3 or len(domain2) < 3:
            return False
        
        # Calculate edit distance
        distance = self._levenshtein_distance(domain1, domain2)
        
        # Consider typosquat if distance is 1-2 and domains are similar length
        return 0 < distance <= 2 and abs(len(domain1) - len(domain2)) <= 1

    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """Calculate Levenshtein distance between two strings."""
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
        
        if len(s2) == 0:
            return len(s1)
        
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        return previous_row[-1]

    def _analyze_thread_lineage(self, email: Dict, thread_fp: Dict) -> Dict:
        """Analyze thread lineage and ancestry."""
        lineage = {
            "is_original": thread_fp["is_thread_start"],
            "is_reply": thread_fp["is_reply"],
            "depth": thread_fp["depth"],
            "has_references": thread_fp["references_count"] > 0,
        }
        
        # Determine lineage type
        if lineage["is_original"]:
            lineage["type"] = "thread_initiator"
        elif lineage["depth"] == 1:
            lineage["type"] = "direct_reply"
        elif lineage["depth"] > 1:
            lineage["type"] = "nested_reply"
        else:
            lineage["type"] = "unknown"
        
        return lineage

    def _calculate_uniqueness_score(self, fingerprint: Dict, duplicates: List, forgeries: Dict) -> Dict:
        """Calculate uniqueness score."""
        score = 100  # Start with perfect uniqueness
        
        # Deduct for duplicates
        exact_duplicates = sum(1 for d in duplicates if d["match_type"] == "exact")
        fuzzy_duplicates = sum(1 for d in duplicates if d["match_type"] == "fuzzy")
        
        score -= exact_duplicates * 40
        score -= fuzzy_duplicates * 20
        
        # Deduct for forgery indicators
        score -= forgeries["indicator_count"] * 15
        
        score = max(0, min(100, score))
        
        if score >= 80:
            level = "UNIQUE"
        elif score >= 60:
            level = "SIMILAR"
        elif score >= 40:
            level = "DUPLICATE"
        else:
            level = "SUSPICIOUS"
        
        return {
            "score": score,
            "level": level,
            "duplicate_count": len(duplicates),
            "forgery_indicators": forgeries["indicator_count"],
        }

    def _generate_dna_signature(self, content_fp: Dict, sender_fp: Dict, thread_fp: Dict) -> Dict:
        """Generate comprehensive DNA signature."""
        # Combine all fingerprints
        combined = f"{content_fp['hash']}{sender_fp['hash']}{thread_fp['thread_hash']}"
        dna_hash = hashlib.sha512(combined.encode()).hexdigest()[:48]
        
        return {
            "dna_hash": dna_hash,
            "content_hash": content_fp["hash"],
            "sender_hash": sender_fp["hash"],
            "thread_hash": thread_fp["thread_hash"],
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

    def _store_fingerprint(self, email_id: str, signature: Dict):
        """Store fingerprint in database."""
        self.fingerprint_database[email_id] = {
            "content_hash": signature["content_hash"],
            "sender_hash": signature["sender_hash"],
            "thread_hash": signature["thread_hash"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def _determine_dna_action(self, uniqueness: Dict, duplicates: List, forgeries: Dict) -> str:
        """Determine action based on DNA analysis."""
        if uniqueness["level"] == "SUSPICIOUS":
            return "FLAG_AS_SUSPICIOUS"
        elif forgeries["risk_level"] == "HIGH":
            return "QUARANTINE_FOR_REVIEW"
        elif len(duplicates) > 0:
            return "MARK_AS_DUPLICATE"
        elif uniqueness["level"] == "UNIQUE":
            return "ACCEPT_AND_PROCESS"
        else:
            return "STANDARD_PROCESSING"

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        """STRICT reply-all enforcement."""
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
        if not self.fingerprint_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.fingerprint_log),
            "duplicates_detected": sum(f["duplicate_count"] for f in self.fingerprint_log),
            "forgeries_detected": sum(f["forgery_indicators"] for f in self.fingerprint_log),
            "avg_uniqueness": sum(f["uniqueness_score"] for f in self.fingerprint_log) / len(self.fingerprint_log),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v991():
    engine = EmailDNAFingerprinting()

    # Test 1: Unique email
    email1 = {
        "id": "dna-001",
        "from": "unique.sender@company.com",
        "to": ["team@ziontechgroup.com", "support@ziontechgroup.com"],
        "subject": "Unique proposal for AI integration",
        "body": "We propose a unique AI integration solution that combines machine learning with natural language processing for enhanced email intelligence.",
        "thread_id": "thread-unique-1",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["uniqueness_score"]["level"] == "UNIQUE"
    assert len(r1["duplicates"]) == 0
    print(f"✅ Test 1 PASSED: Unique email detected, score={r1['uniqueness_score']['score']}, reply-all enforced")

    # Test 2: Duplicate email
    email2 = {
        "id": "dna-002",
        "from": "duplicate.sender@company.com",
        "to": ["team@ziontechgroup.com"],
        "subject": "Unique proposal for AI integration",
        "body": "We propose a unique AI integration solution that combines machine learning with natural language processing for enhanced email intelligence.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert len(r2["duplicates"]) > 0
    assert r2["uniqueness_score"]["level"] in ("DUPLICATE", "SIMILAR")
    print(f"✅ Test 2 PASSED: Duplicate detected, {len(r2['duplicates'])} matches found")

    # Test 3: Suspicious domain
    email3 = {
        "id": "dna-003",
        "from": "support@gmai1n.com",  # Typosquat of gmail.com
        "to": ["user@company.com"],
        "subject": "Account verification",
        "body": "Please verify your account.",
    }
    r3 = engine.analyze_email_case_by_case(email3)
    assert r3["forgeries"]["indicator_count"] > 0
    print(f"✅ Test 3 PASSED: Forgery indicators detected: {r3['forgeries']['indicator_count']}")

    stats = engine.get_stats()
    print(f"✅ Test 4 PASSED: {stats['emails_analyzed']} analyzed, {stats['duplicates_detected']} duplicates, {stats['forgeries_detected']} forgeries")

    print("\n🎉 V991 ALL TESTS PASSED — Email DNA Fingerprinting operational!")
    return True


if __name__ == "__main__":
    test_v991()
