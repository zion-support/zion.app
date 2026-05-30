#!/usr/bin/env python3
"""V219 - AI Email Energy & Carbon Tracker
Calculate the carbon footprint of email communications, suggest optimization
strategies, and generate sustainability reports for ESG compliance.
Always enforces reply-all for multi-recipient emails.
"""
import json, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class EmailCarbonFootprint:
    email_id: str
    size_bytes: int
    recipients_count: int
    attachments_count: int
    co2_grams: float
    energy_wh: float
    optimization_score: float
    suggestions: List[str]

@dataclass
class SustainabilityReport:
    period: str
    total_emails: int
    total_co2_kg: float
    total_energy_kwh: float
    avg_co2_per_email: float
    optimization_potential_percent: float
    top_waste_categories: List[str]
    recommendations: List[str]
    esg_score: float
    equivalent_trees_needed: float

class CarbonCalculator:
    """Calculate email carbon footprint based on multiple factors."""
    
    # Carbon factors (grams CO2)
    BASE_EMAIL_CO2 = 0.3  # Average email: 0.3g CO2
    PER_KB_CO2 = 0.002  # Per KB of data transferred
    ATTACHMENT_CO2 = 4.0  # Per MB of attachment
    SPAM_CO2 = 0.3  # Spam emails still consume energy
    LONG_THREAD_PENALTY = 0.1  # Per message in thread beyond 5
    CC_RECIPIENT_CO2 = 0.1  # Per CC/BCC recipient
    
    def calculate(self, email: Dict) -> EmailCarbonFootprint:
        body = email.get("body", "")
        size_bytes = len(body.encode("utf-8"))
        recipients = email.get("to", [])
        if isinstance(recipients, str):
            recipients = [recipients]
        cc = email.get("cc", [])
        if isinstance(cc, str):
            cc = [cc]
        attachments = email.get("attachments", [])
        attachment_size_mb = sum(a.get("size_mb", 1) for a in attachments) if attachments else 0
        
        # Calculate CO2
        co2 = self.BASE_EMAIL_CO2
        co2 += (size_bytes / 1024) * self.PER_KB_CO2
        co2 += attachment_size_mb * self.ATTACHMENT_CO2
        co2 += len(cc) * self.CC_RECIPIENT_CO2
        
        # Energy calculation (Wh)
        energy_wh = co2 * 2.5  # Approximate conversion
        
        # Optimization score and suggestions
        suggestions = []
        opt_score = 1.0
        
        if len(recipients) + len(cc) > 10:
            suggestions.append(f"Reduce recipient list ({len(recipients)+len(cc)} recipients). Only include those who need to act.")
            opt_score -= 0.2
        
        if attachment_size_mb > 5:
            suggestions.append(f"Use cloud links instead of {attachment_size_mb:.1f}MB attachments")
            opt_score -= 0.2
        
        if size_bytes > 50000:
            suggestions.append(f"Email body is large ({size_bytes//1024}KB). Consider summarizing.")
            opt_score -= 0.1
        
        if len(cc) > 5:
            suggestions.append(f"Too many CC'd ({len(cc)}). Use BCC or targeted distribution.")
            opt_score -= 0.1
        
        if not suggestions:
            suggestions.append("Email is well-optimized for carbon efficiency")
        
        opt_score = max(0, opt_score)
        
        return EmailCarbonFootprint(
            email_id=email.get("id", ""),
            size_bytes=size_bytes,
            recipients_count=len(recipients) + len(cc),
            attachments_count=len(attachments),
            co2_grams=round(co2, 3),
            energy_wh=round(energy_wh, 3),
            optimization_score=round(opt_score, 2),
            suggestions=suggestions
        )

class SustainabilityReporter:
    """Generate sustainability reports."""
    
    def generate(self, footprints: List[EmailCarbonFootprint], period: str = "monthly") -> SustainabilityReport:
        total_co2 = sum(f.co2_grams for f in footprints) / 1000  # Convert to kg
        total_energy = sum(f.energy_wh for f in footprints) / 1000  # Convert to kWh
        avg_co2 = total_co2 / len(footprints) * 1000 if footprints else 0  # Back to grams
        avg_opt = sum(f.optimization_score for f in footprints) / len(footprints) if footprints else 1.0
        
        waste_categories = []
        large_attachments = sum(1 for f in footprints if f.attachments_count > 0)
        many_recipients = sum(1 for f in footprints if f.recipients_count > 10)
        large_body = sum(1 for f in footprints if f.size_bytes > 50000)
        
        if large_attachments > len(footprints) * 0.3:
            waste_categories.append(f"Large attachments ({large_attachments} emails)")
        if many_recipients > len(footprints) * 0.2:
            waste_categories.append(f"Over-distribution ({many_recipients} emails)")
        if large_body > len(footprints) * 0.2:
            waste_categories.append(f"Verbose emails ({large_body} emails)")
        
        optimization_potential = (1 - avg_opt) * 100
        
        # ESG score (0-100)
        esg_score = max(0, min(100, 100 - (total_co2 * 10) + (avg_opt * 30)))
        
        # Trees needed to offset (1 tree absorbs ~22kg CO2/year)
        trees_needed = total_co2 / 22.0 * 12  # Annualized
        
        recommendations = [
            "Implement email size limits and attachment policies",
            "Use cloud storage links instead of email attachments",
            "Reduce CC chains - only include action-required recipients",
            "Implement email digest options for non-urgent communications",
            "Set up automated carbon reporting for ESG compliance",
        ]
        
        return SustainabilityReport(
            period=period,
            total_emails=len(footprints),
            total_co2_kg=round(total_co2, 3),
            total_energy_kwh=round(total_energy, 3),
            avg_co2_per_email=round(avg_co2, 2),
            optimization_potential_percent=round(optimization_potential, 1),
            top_waste_categories=waste_categories,
            recommendations=recommendations,
            esg_score=round(esg_score, 1),
            equivalent_trees_needed=round(trees_needed, 2)
        )

class EnergyCarbonTracker:
    """Main energy and carbon tracking engine."""
    
    def __init__(self):
        self.calculator = CarbonCalculator()
        self.reporter = SustainabilityReporter()
    
    def process_emails(self, emails: List[Dict], recipients: List[str] = None) -> Dict:
        footprints = [self.calculator.calculate(e) for e in emails]
        report = self.reporter.generate(footprints)
        
        reply_all = len(recipients or []) > 1
        
        return {
            "emails_analyzed": len(footprints),
            "per_email_footprint": [
                {"id": f.email_id, "co2_grams": f.co2_grams, "recipients": f.recipients_count,
                 "optimization_score": f.optimization_score, "suggestions": f.suggestions}
                for f in footprints
            ],
            "sustainability_report": {
                "total_co2_kg": report.total_co2_kg,
                "total_energy_kwh": report.total_energy_kwh,
                "avg_co2_per_email_g": report.avg_co2_per_email,
                "optimization_potential": f"{report.optimization_potential_percent}%",
                "esg_score": report.esg_score,
                "trees_to_offset": report.equivalent_trees_needed,
                "waste_categories": report.top_waste_categories,
                "recommendations": report.recommendations
            },
            "reply_all_required": reply_all,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    tracker = EnergyCarbonTracker()
    sample_emails = [
        {"id": "e1", "body": "Short update email", "to": ["a@co.com", "b@co.com"], "attachments": []},
        {"id": "e2", "body": "x" * 60000, "to": ["a@co.com"] * 15, "cc": ["c@co.com"] * 8,
         "attachments": [{"name": "report.pdf", "size_mb": 12}]},
        {"id": "e3", "body": "Quick question about the project timeline", "to": ["d@co.com"], "attachments": []},
    ]
    result = tracker.process_emails(sample_emails, ["a@co.com", "b@co.com"])
    print(json.dumps(result, indent=2))
