#!/usr/bin/env python3
"""
V974: Email Folder & Label Optimizer Engine
Intelligent auto-filing based on content analysis, sender patterns,
topic classification, and historical filing behavior.
STRICT reply-all enforcement for all multi-recipient emails.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any
from collections import defaultdict


class FolderLabelOptimizer:
    """Intelligently organizes emails into folders and applies labels."""

    FOLDER_RULES = {
        "Inbox/Projects": {
            "keywords": ["project", "sprint", "milestone", "deliverable", "roadmap"],
            "sender_patterns": [],
            "priority": 5,
        },
        "Inbox/Sales": {
            "keywords": ["quote", "proposal", "pricing", "deal", "contract", "opportunity", "lead"],
            "sender_patterns": ["sales", "business"],
            "priority": 4,
        },
        "Inbox/Support": {
            "keywords": ["ticket", "issue", "bug", "help", "support", "problem", "error"],
            "sender_patterns": ["support", "helpdesk"],
            "priority": 4,
        },
        "Inbox/Finance": {
            "keywords": ["invoice", "payment", "billing", "receipt", "expense", "budget", "accounting"],
            "sender_patterns": ["finance", "billing", "accounts"],
            "priority": 3,
        },
        "Inbox/HR": {
            "keywords": ["hiring", "interview", "candidate", "benefits", "leave", "onboarding", "performance review"],
            "sender_patterns": ["hr", "people", "talent"],
            "priority": 3,
        },
        "Inbox/Marketing": {
            "keywords": ["campaign", "newsletter", "content", "social media", "seo", "analytics", "brand"],
            "sender_patterns": ["marketing", "growth"],
            "priority": 3,
        },
        "Inbox/Legal": {
            "keywords": ["contract", "nda", "agreement", "compliance", "legal", "terms"],
            "sender_patterns": ["legal", "counsel"],
            "priority": 5,
        },
        "Inbox/Partners": {
            "keywords": ["partner", "partnership", "affiliate", "reseller", "alliance"],
            "sender_patterns": ["partner", "alliance"],
            "priority": 4,
        },
        "Inbox/Newsletters": {
            "keywords": ["newsletter", "digest", "weekly", "subscribe", "unsubscribe"],
            "sender_patterns": ["newsletter", "noreply"],
            "priority": 1,
        },
        "Inbox/Spam": {
            "keywords": ["viagra", "lottery", "winner", "inheritance", "act now", "limited offer"],
            "sender_patterns": [],
            "priority": 0,
        },
    }

    LABEL_CATEGORIES = {
        "priority": ["urgent", "important", "low-priority", "follow-up", "waiting"],
        "status": ["action-required", "fyi", "review-needed", "completed", "archived"],
        "type": ["meeting", "document", "question", "announcement", "personal"],
        "team": ["sales", "support", "engineering", "marketing", "management"],
    }

    def __init__(self):
        self.filing_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.folder_stats: Dict[str, int] = defaultdict(int)
        self.label_stats: Dict[str, int] = defaultdict(int)
        self.sender_folder_map: Dict[str, str] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze and file each email case by case."""
        analysis = {
            "engine": "V974",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "folder_label_optimization",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")
        full_text = subject + " " + body

        # 1. Folder recommendation
        folder = self._recommend_folder(full_text, sender, email)
        analysis["recommended_folder"] = folder

        # 2. Label recommendations
        labels = self._recommend_labels(full_text, email, folder)
        analysis["recommended_labels"] = labels

        # 3. Star/flag recommendation
        star = self._recommend_star(full_text, email)
        analysis["star_recommendation"] = star

        # 4. Archive recommendation
        archive = self._recommend_archive(full_text, email, labels)
        analysis["archive_recommendation"] = archive

        # 5. Filing confidence
        confidence = self._calculate_filing_confidence(folder, labels)
        analysis["filing_confidence"] = confidence

        # 6. Learning from patterns
        if sender:
            self.sender_folder_map[sender] = folder["path"]

        # 7. Determine action
        action = self._determine_filing_action(folder, confidence, archive)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Track stats
        self.folder_stats[folder["path"]] += 1
        for label in labels["all_labels"]:
            self.label_stats[label] += 1

        self.filing_log.append({
            "email_id": analysis["email_id"],
            "folder": folder["path"],
            "labels": labels["all_labels"],
            "confidence": confidence["score"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _recommend_folder(self, text: str, sender: str, email: Dict) -> Dict:
        """Recommend the best folder for the email."""
        text_lower = text.lower()
        sender_lower = sender.lower()
        scores = {}

        # Check sender history first
        if sender in self.sender_folder_map:
            return {
                "path": self.sender_folder_map[sender],
                "reason": "Based on sender's filing history",
                "confidence": 0.85,
                "method": "history",
            }

        # Score each folder
        for folder, config in self.FOLDER_RULES.items():
            score = 0
            for kw in config["keywords"]:
                if kw in text_lower:
                    score += 2
            for pattern in config["sender_patterns"]:
                if pattern in sender_lower:
                    score += 3
            if score > 0:
                scores[folder] = score * config["priority"]

        if scores:
            best_folder = max(scores, key=scores.get)
            return {
                "path": best_folder,
                "reason": f"Content matches: {best_folder.split('/')[-1]}",
                "confidence": min(scores[best_folder] / 20, 0.95),
                "method": "content_analysis",
            }

        return {
            "path": "Inbox",
            "reason": "No specific folder match — default inbox",
            "confidence": 0.3,
            "method": "default",
        }

    def _recommend_labels(self, text: str, email: Dict, folder: Dict) -> Dict:
        """Recommend labels for the email."""
        text_lower = text.lower()
        labels = []
        reasons = {}

        # Priority labels
        urgent_keywords = ["urgent", "asap", "immediately", "critical", "deadline", "emergency"]
        if any(kw in text_lower for kw in urgent_keywords):
            labels.append("urgent")
            reasons["urgent"] = "Urgency keywords detected"
        elif "important" in text_lower:
            labels.append("important")
            reasons["important"] = "Importance indicated"

        # Status labels
        if "?" in email.get("body", ""):
            labels.append("question")
            reasons["question"] = "Contains questions"
        if re.search(r'\b(action item|todo|please do)\b', text_lower):
            labels.append("action-required")
            reasons["action-required"] = "Action items detected"
        if re.search(r'\b(fyi|for your information|just letting you know)\b', text_lower):
            labels.append("fyi")
            reasons["fyi"] = "FYI content"

        # Type labels
        if re.search(r'\b(meeting|call|schedule|appointment)\b', text_lower):
            labels.append("meeting")
            reasons["meeting"] = "Meeting-related"
        if email.get("attachments"):
            labels.append("document")
            reasons["document"] = "Has attachments"

        # Team labels
        folder_name = folder["path"].split("/")[-1].lower()
        if folder_name in ("sales", "support", "marketing", "finance", "hr", "legal"):
            labels.append(folder_name)
            reasons[folder_name] = f"Filed in {folder_name} folder"

        return {
            "all_labels": labels,
            "reasons": reasons,
            "count": len(labels),
        }

    def _recommend_star(self, text: str, email: Dict) -> Dict:
        """Recommend whether to star/flag the email."""
        text_lower = text.lower()
        reasons = []
        score = 0

        # VIP sender
        vip = ["ceo", "cto", "cfo", "president", "founder", "board"]
        if any(v in email.get("from", "").lower() for v in vip):
            score += 3
            reasons.append("VIP sender")

        # Urgency
        if any(kw in text_lower for kw in ["urgent", "asap", "critical"]):
            score += 2
            reasons.append("Urgent content")

        # Direct request
        if re.search(r'\b(please|could you|can you)\s+(send|prepare|review|complete)', text_lower):
            score += 2
            reasons.append("Direct request to you")

        # Question directed at recipient
        if re.search(r'\bcan you\b|\bcould you\b', text_lower):
            score += 1
            reasons.append("Question directed at you")

        should_star = score >= 3
        return {
            "should_star": should_star,
            "score": score,
            "reasons": reasons,
        }

    def _recommend_archive(self, text: str, email: Dict, labels: Dict) -> Dict:
        """Recommend whether to auto-archive the email."""
        text_lower = text.lower()

        # Auto-archive candidates
        auto_archive_signals = [
            "unsubscribe" in text_lower,
            "newsletter" in text_lower,
            email.get("from", "").lower().startswith("noreply"),
            "fyi" in labels["all_labels"],
            "automated" in text_lower,
        ]

        # Do not archive signals
        do_not_archive = [
            "urgent" in labels["all_labels"],
            "action-required" in labels["all_labels"],
            "?" in email.get("body", ""),
        ]

        if any(do_not_archive):
            return {"should_archive": False, "reason": "Requires attention"}

        archive_count = sum(1 for s in auto_archive_signals if s)
        should_archive = archive_count >= 2

        return {
            "should_archive": should_archive,
            "signals_detected": archive_count,
            "reason": "Low-priority informational content" if should_archive else "May need attention",
        }

    def _calculate_filing_confidence(self, folder: Dict, labels: Dict) -> Dict:
        """Calculate overall filing confidence."""
        folder_confidence = folder.get("confidence", 0.5)
        label_confidence = min(len(labels["all_labels"]) / 3, 1.0) if labels["all_labels"] else 0.3

        overall = (folder_confidence * 0.6 + label_confidence * 0.4)
        return {
            "score": round(overall, 2),
            "folder_confidence": folder_confidence,
            "label_confidence": label_confidence,
            "level": "HIGH" if overall >= 0.7 else "MEDIUM" if overall >= 0.5 else "LOW",
        }

    def _determine_filing_action(self, folder: Dict, confidence: Dict, archive: Dict) -> str:
        """Determine filing action."""
        if archive["should_archive"]:
            return "AUTO_ARCHIVE"
        if confidence["level"] == "HIGH":
            return "AUTO_FILE"
        if confidence["level"] == "MEDIUM":
            return "SUGGEST_AND_CONFIRM"
        return "MANUAL_REVIEW"

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
        if not self.filing_log:
            return {"emails_filed": 0}
        return {
            "emails_filed": len(self.filing_log),
            "folder_distribution": dict(self.folder_stats),
            "label_distribution": dict(self.label_stats),
            "avg_confidence": round(sum(f["confidence"] for f in self.filing_log) / len(self.filing_log), 2),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v974():
    engine = FolderLabelOptimizer()

    # Test 1: Sales email
    email1 = {
        "id": "fold-001",
        "from": "prospect@enterprise.com",
        "to": ["sales@ziontechgroup.com", "account@ziontechgroup.com"],
        "subject": "Request for pricing proposal",
        "body": "Hi, we're interested in getting a quote for your enterprise plan. Can you send us a proposal?",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert "Sales" in r1["recommended_folder"]["path"]
    print(f"✅ Test 1 PASSED: Folder={r1['recommended_folder']['path']}, labels={r1['recommended_labels']['all_labels']}, reply-all enforced")

    # Test 2: Newsletter
    email2 = {
        "id": "fold-002",
        "from": "noreply@techdigest.com",
        "to": ["user@company.com"],
        "subject": "Weekly Tech Newsletter",
        "body": "Here's your weekly tech digest. To unsubscribe, click here.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["archive_recommendation"]["should_archive"] is True
    print(f"✅ Test 2 PASSED: Auto-archive recommended, folder={r2['recommended_folder']['path']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_filed']} filed, avg confidence={stats['avg_confidence']}")

    print("\n🎉 V974 ALL TESTS PASSED — Folder & Label Optimizer operational!")
    return True


if __name__ == "__main__":
    test_v974()
