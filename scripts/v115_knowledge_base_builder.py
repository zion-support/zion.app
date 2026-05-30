#!/usr/bin/env python3
"""
V115: AI Knowledge Base Auto-Builder
Extract Q&A pairs, procedures, and FAQs from email threads to build a self-updating knowledge base.
"""
import re, json, hashlib
from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import Counter

@dataclass
class KBEntry:
    entry_id: str
    question: str
    answer: str
    category: str
    tags: List[str]
    source_emails: List[str]
    confidence: float
    usage_count: int = 0
    created_at: str = ""
    last_updated: str = ""

@dataclass
class FAQItem:
    question: str
    answer: str
    frequency: int
    category: str

class KnowledgeBaseAutoBuilder:
    """V115: Automatically build and maintain a knowledge base from email conversations."""
    
    QUESTION_PATTERNS = [
        r"how (do|can|does|would|should)\b",
        r"what (is|are|does|do)\b",
        r"when (do|can|does|will|should)\b",
        r"where (do|can|does|is|are)\b",
        r"why (do|does|is|are|would|should)\b",
        r"\?",
    ]
    
    ANSWER_SIGNALS = [
        r"\b(to do this|here\'s how|the process is|steps are|follow these)\b",
        r"\b(you need to|you should|you can|make sure to)\b",
        r"\b(first|second|then|next|finally|after that)\b",
        r"\d+[\.\)]\s",  # Numbered steps
    ]
    
    CATEGORIES = {
        "technical": ["install", "setup", "configure", "deploy", "error", "bug", "fix", "api", "code"],
        "billing": ["invoice", "payment", "billing", "charge", "refund", "subscription", "pricing"],
        "product": ["feature", "how to", "use", "access", "enable", "disable", "setting"],
        "account": ["login", "password", "account", "profile", "reset", "verify"],
        "integration": ["connect", "integrate", "api", "webhook", "sync", "import", "export"],
        "policy": ["policy", "terms", "privacy", "gdpr", "compliance", "sla"],
    }
    
    def __init__(self):
        self.knowledge_base: Dict[str, KBEntry] = {}
        self.faq_items: List[FAQItem] = []
        self.question_bank: List[Dict] = []
        self.processed_threads = 0
    
    def process_thread(self, emails: List[Dict]) -> List[KBEntry]:
        """Process an email thread to extract knowledge base entries."""
        self.processed_threads += 1
        entries = []
        
        # Find questions in the thread
        questions = self._extract_questions(emails)
        
        # Find answers
        answers = self._extract_answers(emails)
        
        # Match questions to answers
        for q_data in questions:
            best_answer = self._match_answer(q_data, answers)
            if best_answer and best_answer["confidence"] > 0.4:
                category = self._categorize(q_data["text"] + " " + best_answer["text"])
                tags = self._extract_tags(q_data["text"] + " " + best_answer["text"])
                
                entry_id = hashlib.md5(q_data["text"].encode()).hexdigest()[:12]
                
                # Check for duplicates
                if entry_id in self.knowledge_base:
                    # Update existing entry
                    existing = self.knowledge_base[entry_id]
                    existing.usage_count += 1
                    existing.last_updated = datetime.now().isoformat()
                    continue
                
                entry = KBEntry(
                    entry_id=entry_id,
                    question=q_data["text"][:200],
                    answer=best_answer["text"][:500],
                    category=category,
                    tags=tags,
                    source_emails=[e.get("id", "") for e in emails],
                    confidence=best_answer["confidence"],
                    created_at=datetime.now().isoformat(),
                    last_updated=datetime.now().isoformat()
                )
                self.knowledge_base[entry_id] = entry
                entries.append(entry)
        
        # Update FAQ from frequently asked questions
        self._update_faq(emails)
        
        return entries
    
    def _extract_questions(self, emails: List[Dict]) -> List[Dict]:
        questions = []
        for email in emails:
            body = email.get("body", "")
            sentences = re.split(r'[.!?]\s+', body)
            for sent in sentences:
                if any(re.search(p, sent, re.I) for p in self.QUESTION_PATTERNS):
                    questions.append({
                        "text": sent.strip(),
                        "sender": email.get("from", ""),
                        "email_id": email.get("id", ""),
                        "timestamp": email.get("date", "")
                    })
        return questions
    
    def _extract_answers(self, emails: List[Dict]) -> List[Dict]:
        answers = []
        for email in emails:
            body = email.get("body", "")
            confidence = 0
            for pattern in self.ANSWER_SIGNALS:
                if re.search(pattern, body, re.I):
                    confidence += 0.2
            
            if confidence > 0:
                # Extract the most informative paragraph
                paragraphs = body.split("\n\n")
                best_para = max(paragraphs, key=len) if paragraphs else body[:300]
                answers.append({
                    "text": best_para.strip()[:500],
                    "sender": email.get("from", ""),
                    "confidence": min(1.0, confidence),
                    "email_id": email.get("id", "")
                })
        return answers
    
    def _match_answer(self, question: Dict, answers: List[Dict]) -> Optional[Dict]:
        if not answers:
            return None
        # Simple keyword overlap scoring
        q_words = set(question["text"].lower().split())
        best = None
        best_score = 0
        for ans in answers:
            a_words = set(ans["text"].lower().split())
            overlap = len(q_words & a_words) / max(1, len(q_words))
            score = overlap * 0.5 + ans["confidence"] * 0.5
            if score > best_score:
                best_score = score
                best = {**ans, "confidence": score}
        return best
    
    def _categorize(self, text: str) -> str:
        text_lower = text.lower()
        scores = {}
        for cat, keywords in self.CATEGORIES.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                scores[cat] = score
        return max(scores, key=scores.get) if scores else "general"
    
    def _extract_tags(self, text: str) -> List[str]:
        words = re.findall(r'\b[a-z]{4,}\b', text.lower())
        common = Counter(words).most_common(5)
        return [w for w, _ in common]
    
    def _update_faq(self, emails: List[Dict]):
        """Track frequently asked questions and build FAQ."""
        for email in emails:
            body = email.get("body", "")
            for sent in re.split(r'[.!?]\s+', body):
                if "?" in sent and len(sent) > 15:
                    normalized = sent.strip().lower()[:100]
                    self.question_bank.append({"q": normalized, "date": datetime.now().isoformat()})
        
        # Build FAQ from top questions
        q_counts = Counter(q["q"] for q in self.question_bank)
        self.faq_items = [
            FAQItem(question=q, answer="(Auto-generated - pending expert review)", frequency=c, category="general")
            for q, c in q_counts.most_common(20)
        ]
    
    def search_kb(self, query: str, limit: int = 5) -> List[KBEntry]:
        """Search the knowledge base."""
        query_words = set(query.lower().split())
        scored = []
        for entry in self.knowledge_base.values():
            text = (entry.question + " " + entry.answer + " " + " ".join(entry.tags)).lower()
            score = sum(1 for w in query_words if w in text)
            if score > 0:
                scored.append((score, entry))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [e for _, e in scored[:limit]]
    
    def get_stats(self) -> Dict:
        categories = Counter(e.category for e in self.knowledge_base.values())
        return {
            "total_entries": len(self.knowledge_base),
            "faq_items": len(self.faq_items),
            "threads_processed": self.processed_threads,
            "questions_tracked": len(self.question_bank),
            "categories": dict(categories),
            "engine_version": "V115"
        }

if __name__ == "__main__":
    kb = KnowledgeBaseAutoBuilder()
    
    test_thread = [
        {"id": "e1", "from": "user@client.com", "body": "How do I set up the API integration? I'm getting a 401 error when trying to authenticate. What API key should I use?", "date": "2026-01-15"},
        {"id": "e2", "from": "support@zion.com", "body": "To set up the API integration, follow these steps:\n1. Go to Settings > API Keys\n2. Click Generate New Key\n3. Copy the key and add it to your Authorization header\nThe 401 error usually means the key is missing or expired. Make sure to use the latest key.", "date": "2026-01-15"},
        {"id": "e3", "from": "user@client.com", "body": "That worked! Now how do I configure webhooks for real-time notifications?", "date": "2026-01-16"},
        {"id": "e4", "from": "support@zion.com", "body": "To configure webhooks:\n1. Navigate to Settings > Integrations > Webhooks\n2. Enter your endpoint URL\n3. Select the events you want to subscribe to\n4. Click Save\nYou will receive POST requests for each selected event.", "date": "2026-01-16"},
    ]
    
    print("=" * 60)
    print("V115: AI Knowledge Base Auto-Builder")
    print("=" * 60)
    
    entries = kb.process_thread(test_thread)
    print(f"\nExtracted {len(entries)} KB entries:")
    for e in entries:
        print(f"\n  Q: {e.question[:80]}...")
        print(f"  A: {e.answer[:80]}...")
        print(f"  Category: {e.category}")
        print(f"  Tags: {e.tags}")
        print(f"  Confidence: {e.confidence:.0%}")
    
    # Test search
    results = kb.search_kb("API integration setup")
    print(f"\n--- Search Results for 'API integration setup' ---")
    for r in results:
        print(f"  - [{r.category}] {r.question[:60]}...")
    
    print(f"\n--- KB Stats ---")
    for k, v in kb.get_stats().items():
        print(f"  {k}: {v}")
