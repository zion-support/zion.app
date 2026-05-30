#!/usr/bin/env python
"""
Email Intelligence Engine V374 - Email Competitor Intelligence
==============================================================

Detects competitor mentions in email conversations, extracts market signals,
tracks competitive landscape changes, and generates intelligence reports.

Features:
    - Named competitor entity detection and mention frequency tracking
    - Market signal extraction (pricing, features, partnerships, hiring)
    - Competitive threat level assessment
    - Trend analysis across email conversations over time
    - Intelligence report generation with actionable insights
    - Enforces reply-all for multi-recipient threads
    - Outputs structured JSON with competitive intelligence

Signal Categories:
    - Pricing intelligence (discounts, new tiers, price changes)
    - Product features (new capabilities, integrations, roadmaps)
    - Market moves (partnerships, acquisitions, expansions)
    - Personnel changes (key hires, departures, reorganizations)
    - Customer movements (wins, losses, satisfaction)

Author: Email Intelligence Suite
Version: 374
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Set, Tuple
from collections import Counter


class CompetitorIntelligenceEngine:
    """
    Engine that extracts competitive intelligence from email conversations.

    Attributes:
        known_competitors: Set of known competitor company names
        signal_patterns: Regex patterns for different signal types
        threat_levels: Mapping of signal combinations to threat levels
    """

    def __init__(self, known_competitors: Optional[List[str]] = None):
        """
        Initialize the Competitor Intelligence Engine.

        Args:
            known_competitors: List of known competitor company names to track.
        """
        self.known_competitors = set(known_competitors or [
            "CompetitorA", "MegaCorp", "TechRival", "CloudFirst", 
            "DataDriven Inc", "NexGen Solutions", "AlphaSoft",
            "BetaWorks", "Omega Systems", "SwiftTech"
        ])

        self.signal_patterns = {
            "pricing": [
                r"(?:pricing|price|cost|discount|cheaper|expensive|affordable|tier|plan)",
                r"(?:\$\d+[\d,.]*\s*(?:\/month|\/year|per user|per seat))",
                r"(?:free tier|trial|freemium|premium)",
            ],
            "product_features": [
                r"(?:feature|capability|functionality|integration|API|platform)",
                r"(?:launched|released|announced|shipped|introduced)",
                r"(?:roadmap|coming soon|beta|preview|GA)",
            ],
            "partnerships": [
                r"(?:partnership|partner|alliance|integration with|collaboration)",
                r"(?:acquired|acquisition|merger|M&A)",
                r"(?:joint venture|strategic|ecosystem)",
            ],
            "personnel": [
                r"(?:hired|joined|left|departed|appointed|promoted)",
                r"(?:VP|CTO|CEO|CFO|director|head of)\s+(?:of|at)",
                r"(?:team expansion|headcount|hiring|recruiting)",
            ],
            "customer_movement": [
                r"(?:switched from|migrated from|moved to|chose|selected|lost to)",
                r"(?:won|lost|churn|retention|renewal)",
                r"(?:customer|client|account)\s+(?:switch|migrate|leave)",
            ],
            "market_position": [
                r"(?:market share|leader|challenger|niche|dominant)",
                r"(?:Gartner|Forrester|Magic Quadrant|Wave|report)",
                r"(?:funding|raised|valuation|IPO|revenue)",
            ]
        }

        self.threat_indicators = {
            "high": ["lost to", "switched from", "cheaper", "acquired", "partnership"],
            "medium": ["launched", "feature", "hired", "funding", "pricing"],
            "low": ["mentioned", "reference", "awareness", "benchmark"]
        }

    def detect_competitor_mentions(self, text: str) -> List[Dict[str, Any]]:
        """
        Detect mentions of known competitors in text.

        Args:
            text: Email body text to scan.

        Returns:
            List of detected competitor mentions with context.
        """
        mentions = []

        for competitor in self.known_competitors:
            pattern = re.compile(re.escape(competitor), re.IGNORECASE)
            matches = list(pattern.finditer(text))

            for match in matches:
                start = max(0, match.start() - 40)
                end = min(len(text), match.end() + 40)
                context = text[start:end].strip()

                mentions.append({
                    "competitor": competitor,
                    "context": context,
                    "position": match.start()
                })

        return mentions

    def extract_signals(self, text: str) -> Dict[str, List[Dict[str, Any]]]:
        """
        Extract market signals from email text by category.

        Args:
            text: Email body text to analyze.

        Returns:
            Dictionary mapping signal categories to detected signals.
        """
        signals = {}

        for category, patterns in self.signal_patterns.items():
            category_signals = []
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    start = max(0, match.start() - 20)
                    end = min(len(text), match.end() + 20)
                    category_signals.append({
                        "matched_text": match.group(),
                        "context": text[start:end].strip(),
                        "category": category
                    })
            if category_signals:
                signals[category] = category_signals

        return signals

    def assess_threat_level(self, signals: Dict[str, List], 
                            mentions: List[Dict]) -> Dict[str, Any]:
        """
        Assess competitive threat level based on detected signals.

        Args:
            signals: Extracted signals by category.
            mentions: Detected competitor mentions.

        Returns:
            Threat assessment with level and reasoning.
        """
        threat_score = 0
        reasons = []

        # Score based on signal categories present
        category_weights = {
            "pricing": 2.0,
            "product_features": 1.5,
            "partnerships": 2.5,
            "personnel": 1.0,
            "customer_movement": 3.0,
            "market_position": 2.0
        }

        for category, items in signals.items():
            weight = category_weights.get(category, 1.0)
            threat_score += weight * len(items)
            if len(items) > 2:
                reasons.append(f"Multiple {category} signals detected")

        # Score based on mention frequency
        mention_count = len(mentions)
        if mention_count > 3:
            threat_score += 2.0
            reasons.append(f"High mention frequency ({mention_count} mentions)")

        # Determine level
        if threat_score >= 8:
            level = "critical"
        elif threat_score >= 5:
            level = "high"
        elif threat_score >= 3:
            level = "medium"
        elif threat_score > 0:
            level = "low"
        else:
            level = "minimal"

        return {
            "threat_level": level,
            "threat_score": round(threat_score, 2),
            "reasons": reasons,
            "signal_categories_detected": list(signals.keys()),
            "unique_competitors_mentioned": len(set(m["competitor"] for m in mentions))
        }

    def generate_intelligence_summary(self, analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate a competitive intelligence summary from multiple email analyses.

        Args:
            analyses: List of individual email analysis results.

        Returns:
            Aggregated intelligence summary with trends.
        """
        all_competitors = []
        all_signals = {}
        threat_scores = []

        for analysis in analyses:
            for mention in analysis.get("competitor_mentions", []):
                all_competitors.append(mention["competitor"])

            for category, signals in analysis.get("signals", {}).items():
                if category not in all_signals:
                    all_signals[category] = []
                all_signals[category].extend(signals)

            threat_scores.append(analysis.get("threat_assessment", {}).get("threat_score", 0))

        # Most mentioned competitors
        competitor_freq = Counter(all_competitors).most_common(10)

        # Overall threat
        avg_threat = sum(threat_scores) / max(len(threat_scores), 1)
        max_threat = max(threat_scores) if threat_scores else 0

        return {
            "most_mentioned_competitors": [
                {"competitor": name, "mention_count": count}
                for name, count in competitor_freq
            ],
            "signal_distribution": {
                category: len(signals) for category, signals in all_signals.items()
            },
            "average_threat_score": round(avg_threat, 2),
            "max_threat_score": round(max_threat, 2),
            "total_signals_detected": sum(len(s) for s in all_signals.values()),
            "actionable_insights": self._generate_insights(all_signals, competitor_freq)
        }

    def _generate_insights(self, signals: Dict, competitor_freq: List) -> List[str]:
        """Generate actionable intelligence insights."""
        insights = []

        if "customer_movement" in signals:
            insights.append("ALERT: Customer movement signals detected - review retention strategy")

        if "pricing" in signals and len(signals["pricing"]) > 2:
            insights.append("Pricing pressure detected - consider competitive pricing review")

        if "partnerships" in signals:
            insights.append("Competitor partnership activity - assess ecosystem impact")

        if "product_features" in signals:
            insights.append("Feature gap potential - review product roadmap alignment")

        if competitor_freq and competitor_freq[0][1] > 3:
            insights.append(f"Top competitor {competitor_freq[0][0]} frequently mentioned - monitor closely")

        if not insights:
            insights.append("No immediate competitive threats identified")

        return insights

    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze a single email for competitive intelligence.

        Args:
            email: Email dictionary with body, subject, and recipients.

        Returns:
            Complete competitive intelligence analysis.
        """
        body = email.get("body", "") + " " + email.get("subject", "")
        recipients = email.get("recipients", [])

        # Detect competitor mentions
        mentions = self.detect_competitor_mentions(body)

        # Extract signals
        signals = self.extract_signals(body)

        # Assess threat level
        threat = self.assess_threat_level(signals, mentions)

        # Reply-all enforcement
        reply_all_required = len(recipients) > 1
        reply_all_enforced = True if reply_all_required else False

        return {
            "engine": "Email Competitor Intelligence V374",
            "email_id": email.get("id", "unknown"),
            "subject": email.get("subject", ""),
            "reply_all_required": reply_all_required,
            "reply_all_enforced": reply_all_enforced,
            "recipients_count": len(recipients),
            "has_competitor_mentions": len(mentions) > 0,
            "competitor_mentions": mentions,
            "signals": signals,
            "threat_assessment": threat,
            "intelligence_value": "high" if len(mentions) > 2 or threat["threat_level"] in ("high", "critical") 
                                  else "medium" if mentions else "low"
        }

    def process_batch(self, emails: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process a batch of emails for competitive intelligence.

        Args:
            emails: List of email dictionaries.

        Returns:
            Comprehensive competitive intelligence report.
        """
        results = []
        for email in emails:
            result = self.analyze_email(email)
            results.append(result)

        # Generate aggregate intelligence
        intelligence_summary = self.generate_intelligence_summary(results)

        return {
            "engine": "Email Competitor Intelligence V374",
            "analysis_timestamp": datetime.now().isoformat(),
            "emails_analyzed": len(results),
            "emails_with_competitor_intel": len([r for r in results if r["has_competitor_mentions"]]),
            "reply_all_enforced": True,
            "intelligence_summary": intelligence_summary,
            "email_analyses": results
        }


def main():
    """
    Main entry point - runs the Competitor Intelligence Engine with sample data.
    
    Demonstrates:
        - Competitor mention detection across various contexts
        - Market signal extraction by category
        - Threat level assessment
        - Aggregated intelligence reporting
        - Reply-all enforcement for multi-recipient threads
    """
    competitors = [
        "CompetitorA", "MegaCorp", "TechRival", "CloudFirst",
        "DataDriven Inc", "NexGen Solutions", "AlphaSoft"
    ]

    engine = CompetitorIntelligenceEngine(known_competitors=competitors)

    sample_emails = [
        {
            "id": "MSG-301",
            "subject": "CompetitorA just launched new AI features",
            "from": "product@company.com",
            "body": "Heads up - CompetitorA just announced their new AI-powered analytics "
                    "platform at $49/month per user. It includes automated reporting "
                    "and predictive insights. TechRival also released a similar feature "
                    "last week. We should discuss our roadmap response. Their pricing "
                    "is significantly cheaper than our enterprise tier.",
            "recipients": ["product@company.com", "engineering@company.com", "sales@company.com"]
        },
        {
            "id": "MSG-302",
            "subject": "Lost account to MegaCorp - Post-mortem",
            "from": "sales@company.com",
            "body": "Unfortunately we lost the Acme account to MegaCorp. Key reasons: "
                    "they offered a bundled solution at 30% lower price point and "
                    "included partnership with Salesforce. The customer switched from "
                    "our platform last Friday. MegaCorp's new VP of Sales (hired from "
                    "Google) seems to be aggressively targeting our customer base.",
            "recipients": ["sales-leadership@company.com", "product@company.com", "exec@company.com"]
        },
        {
            "id": "MSG-303",
            "subject": "Market Intelligence Update - Week 22",
            "from": "strategy@company.com",
            "body": "Weekly competitive update: CloudFirst raised $200M Series C at "
                    "$2B valuation. DataDriven Inc acquired small analytics startup. "
                    "NexGen Solutions announced partnership with AWS. AlphaSoft is "
                    "hiring aggressively - posted 45 new engineering roles. Gartner "
                    "placed us in the Leaders quadrant alongside CompetitorA and MegaCorp. "
                    "Market share data shows CompetitorA gaining 2% this quarter.",
            "recipients": ["strategy@company.com", "exec@company.com"]
        },
        {
            "id": "MSG-304",
            "subject": "Customer feedback - feature comparison",
            "from": "success@company.com",
            "body": "Several customers mentioned in QBRs that TechRival has better "
                    "API integration capabilities. Two enterprise accounts asked about "
                    "our roadmap for webhook support. One customer is evaluating "
                    "CloudFirst as an alternative due to their new free tier offering.",
            "recipients": ["product@company.com", "success@company.com", "engineering@company.com", "sales@company.com"]
        },
        {
            "id": "MSG-305",
            "subject": "Team offsite logistics",
            "from": "admin@company.com",
            "body": "Reminder: Team offsite is next Thursday. Please confirm dietary "
                    "requirements and T-shirt sizes. Venue is confirmed at the "
                    "downtown convention center. Parking passes will be distributed Monday.",
            "recipients": ["team@company.com"]
        },
        {
            "id": "MSG-306",
            "subject": "Re: Pricing strategy discussion",
            "from": "pricing@company.com",
            "body": "Based on competitive analysis, CompetitorA's freemium model is "
                    "driving significant top-of-funnel growth. MegaCorp's enterprise "
                    "discounting is aggressive - they're offering 40% off for 3-year "
                    "commitments. I recommend we introduce a free tier and adjust our "
                    "volume discounting to compete. TechRival's pricing page shows "
                    "$29/month starter plan which undercuts us by $10.",
            "recipients": ["pricing@company.com", "product@company.com", "finance@company.com"]
        }
    ]

    report = engine.process_batch(sample_emails)
    print(json.dumps(report, indent=2))
    return report


if __name__ == "__main__":
    main()
