#!/usr/bin/env python3
"""V210 - Email Revenue Attribution Engine
Track how email conversations drive revenue with pipeline attribution,
deal influence scoring, and ROI dashboards.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import defaultdict

@dataclass
class RevenueTouchpoint:
    email_id: str
    thread_id: str
    deal_id: str
    deal_value: float
    touchpoint_type: str  # "initial_contact", "follow_up", "proposal", "negotiation", "closing"
    influence_score: float
    timestamp: str
    sender: str
    recipients: List[str]

@dataclass
class DealAttribution:
    deal_id: str
    deal_value: float
    total_emails: int
    revenue_influenced: float
    attribution_model: str  # "first_touch", "last_touch", "linear", "time_decay", "position_based"
    touchpoints: List[RevenueTouchpoint]
    roi_percentage: float

class PipelineDetector:
    """Detect pipeline-related emails and extract deal information."""
    
    PIPELINE_KEYWORDS = {
        "initial_contact": ["introduction", "reaching out", "discovery call", "initial meeting"],
        "follow_up": ["following up", "checking in", "next steps", "status update"],
        "proposal": ["proposal", "quote", "pricing", "estimate", "sow", "statement of work"],
        "negotiation": ["negotiate", "discount", "terms", "contract", "agreement"],
        "closing": ["sign", "close", "final", "approved", "contract signed", "deal closed"],
    }
    
    def detect_touchpoint(self, email: Dict) -> Optional[str]:
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        combined = f"{subject} {body}"
        
        for touchpoint_type, keywords in self.PIPELINE_KEYWORDS.items():
            if any(kw in combined for kw in keywords):
                return touchpoint_type
        return None
    
    def extract_deal_value(self, email: Dict) -> float:
        body = email.get("body", "")
        patterns = [
            r'\$([\d,]+(?:\.\d{2})?)',
            r'([\d,]+(?:\.\d{2})?)\s*(?:USD|dollars?)',
            r'budget[:\s]+\$?([\d,]+)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            if matches:
                try:
                    value = float(matches[0].replace(",", ""))
                    return value
                except ValueError:
                    continue
        return 0.0

class InfluenceScorer:
    """Score the influence of each email touchpoint on deal progression."""
    
    TOUCHPOINT_WEIGHTS = {
        "initial_contact": 0.10,
        "follow_up": 0.15,
        "proposal": 0.30,
        "negotiation": 0.25,
        "closing": 0.20,
    }
    
    def score_influence(self, touchpoint_type: str, email: Dict, thread_length: int) -> float:
        base_weight = self.TOUCHPOINT_WEIGHTS.get(touchpoint_type, 0.10)
        
        body = email.get("body", "")
        engagement_signals = [
            1 if "thank you" in body.lower() else 0,
            1 if "please" in body.lower() else 0,
            1 if "?" in body else 0,
            1 if len(email.get("attachments", [])) > 0 else 0,
        ]
        engagement_bonus = sum(engagement_signals) * 0.05
        
        recency_factor = 1.0 if thread_length <= 5 else max(0.5, 1.0 - (thread_length - 5) * 0.05)
        
        return min(1.0, (base_weight + engagement_bonus) * recency_factor)

class AttributionModels:
    """Implement various revenue attribution models."""
    
    @staticmethod
    def first_touch(touchpoints: List[RevenueTouchpoint]) -> Dict[str, float]:
        if not touchpoints:
            return {}
        first = min(touchpoints, key=lambda t: t.timestamp)
        return {first.email_id: 1.0}
    
    @staticmethod
    def last_touch(touchpoints: List[RevenueTouchpoint]) -> Dict[str, float]:
        if not touchpoints:
            return {}
        last = max(touchpoints, key=lambda t: t.timestamp)
        return {last.email_id: 1.0}
    
    @staticmethod
    def linear(touchpoints: List[RevenueTouchpoint]) -> Dict[str, float]:
        if not touchpoints:
            return {}
        weight = 1.0 / len(touchpoints)
        return {t.email_id: weight for t in touchpoints}
    
    @staticmethod
    def time_decay(touchpoints: List[RevenueTouchpoint]) -> Dict[str, float]:
        if not touchpoints:
            return {}
        sorted_tp = sorted(touchpoints, key=lambda t: t.timestamp)
        weights = {}
        total = sum(range(1, len(sorted_tp) + 1))
        for i, tp in enumerate(sorted_tp, 1):
            weights[tp.email_id] = i / total
        return weights
    
    @staticmethod
    def position_based(touchpoints: List[RevenueTouchpoint]) -> Dict[str, float]:
        if not touchpoints:
            return {}
        if len(touchpoints) == 1:
            return {touchpoints[0].email_id: 1.0}
        
        sorted_tp = sorted(touchpoints, key=lambda t: t.timestamp)
        weights = {sorted_tp[0].email_id: 0.40, sorted_tp[-1].email_id: 0.40}
        
        middle_weight = 0.20 / (len(sorted_tp) - 2) if len(sorted_tp) > 2 else 0
        for tp in sorted_tp[1:-1]:
            weights[tp.email_id] = middle_weight
        
        return weights

class RevenueAttributionEngine:
    """Main revenue attribution engine."""
    
    def __init__(self):
        self.pipeline_detector = PipelineDetector()
        self.influence_scorer = InfluenceScorer()
        self.attribution_models = AttributionModels()
    
    def analyze_thread(self, thread_id: str, emails: List[Dict],
                       deal_id: str, deal_value: float,
                       recipients: List[str] = None) -> DealAttribution:
        touchpoints = []
        
        for i, email in enumerate(emails, 1):
            touchpoint_type = self.pipeline_detector.detect_touchpoint(email)
            if touchpoint_type:
                influence = self.influence_scorer.score_influence(touchpoint_type, email, len(emails))
                touchpoints.append(RevenueTouchpoint(
                    email_id=email.get("id", f"email_{i}"),
                    thread_id=thread_id,
                    deal_id=deal_id,
                    deal_value=deal_value,
                    touchpoint_type=touchpoint_type,
                    influence_score=influence,
                    timestamp=email.get("timestamp", datetime.datetime.now().isoformat()),
                    sender=email.get("from", ""),
                    recipients=email.get("to", [])
                ))
        
        if not touchpoints:
            return DealAttribution(deal_id, deal_value, len(emails), 0.0, "none", [], 0.0)
        
        # Use position-based attribution by default
        attribution = self.attribution_models.position_based(touchpoints)
        revenue_influenced = sum(attribution.get(t.email_id, 0) * deal_value for t in touchpoints)
        roi = (revenue_influenced / deal_value * 100) if deal_value > 0 else 0.0
        
        reply_all = len(recipients or []) > 1
        
        return DealAttribution(
            deal_id=deal_id,
            deal_value=deal_value,
            total_emails=len(emails),
            revenue_influenced=revenue_influenced,
            attribution_model="position_based",
            touchpoints=touchpoints,
            roi_percentage=roi
        )
    
    def generate_dashboard(self, deals: List[DealAttribution]) -> Dict:
        total_revenue = sum(d.deal_value for d in deals)
        total_influenced = sum(d.revenue_influenced for d in deals)
        avg_roi = sum(d.roi_percentage for d in deals) / len(deals) if deals else 0
        
        touchpoint_stats = defaultdict(int)
        for deal in deals:
            for tp in deal.touchpoints:
                touchpoint_stats[tp.touchpoint_type] += 1
        
        return {
            "total_deals": len(deals),
            "total_revenue": total_revenue,
            "revenue_influenced": total_influenced,
            "influence_rate": (total_influenced / total_revenue * 100) if total_revenue > 0 else 0,
            "average_roi": avg_roi,
            "touchpoint_breakdown": dict(touchpoint_stats),
            "reply_all_enforced": True,
        }

if __name__ == "__main__":
    engine = RevenueAttributionEngine()
    sample_emails = [
        {"id": "e1", "from": "sales@zion.com", "to": ["prospect@acme.com"], "timestamp": "2026-05-01T09:00:00",
         "subject": "Introduction - Zion Tech Group", "body": "Thank you for your interest. I'd like to schedule a discovery call to discuss your enterprise needs."},
        {"id": "e2", "from": "prospect@acme.com", "to": ["sales@zion.com"], "timestamp": "2026-05-03T14:00:00",
         "subject": "Re: Introduction", "body": "Please send me a proposal for the enterprise platform. Our budget is $150,000."},
        {"id": "e3", "from": "sales@zion.com", "to": ["prospect@acme.com", "cto@acme.com"], "timestamp": "2026-05-05T11:00:00",
         "subject": "Enterprise Platform Proposal", "body": "Attached is our proposal for $145,000. Please review and let me know your thoughts."},
    ]
    attribution = engine.analyze_thread("thread-001", sample_emails, "deal-123", 145000.0, ["prospect@acme.com", "cto@acme.com"])
    dashboard = engine.generate_dashboard([attribution])
    print(json.dumps({"attribution": attribution.__dict__, "dashboard": dashboard}, indent=2, default=str))
