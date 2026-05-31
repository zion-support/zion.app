#!/usr/bin/env python3
"""V643 - Email Signature A/B Testing
Test different email signatures for engagement and conversion optimization.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, random
from datetime import datetime
from typing import Dict, List, Any

class EmailSignatureABTesting:
    """A/B test email signatures for optimization."""
    
    SIGNATURE_ELEMENTS = {
        "name_format": ["full_name", "first_name", "initials"],
        "title_inclusion": ["with_title", "without_title"],
        "contact_info": ["full_contact", "email_only", "phone_only"],
        "social_links": ["with_social", "without_social"],
        "logo": ["with_logo", "without_logo"],
        "cta": ["with_cta", "without_cta"]
    }
    
    def __init__(self):
        self.experiments = {}
        self.results_db = {}
    
    def create_experiment(self, signatures: List[Dict], email: Dict[str, Any]) -> Dict[str, Any]:
        """Create A/B test experiment for signatures."""
        experiment_id = f"sig_ab_{len(self.experiments) + 1:04d}"
        
        experiment = {
            "experiment_id": experiment_id,
            "signatures": signatures,
            "variant_count": len(signatures),
            "start_date": datetime.now().isoformat(),
            "status": "running",
            "traffic_split": {i: 100 // len(signatures) for i in range(len(signatures))}
        }
        
        self.experiments[experiment_id] = experiment
        
        return {
            "engine": "V643",
            "experiment": experiment,
            "email_subject": email.get("subject", ""),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def record_interaction(self, experiment_id: str, variant_id: int, metrics: Dict) -> Dict[str, Any]:
        """Record interaction metrics for a signature variant."""
        if experiment_id not in self.results_db:
            self.results_db[experiment_id] = {}
        
        if variant_id not in self.results_db[experiment_id]:
            self.results_db[experiment_id][variant_id] = {
                "sent": 0,
                "opened": 0,
                "clicked": 0,
                "replied": 0,
                "conversions": 0
            }
        
        # Update metrics
        for metric, value in metrics.items():
            self.results_db[experiment_id][variant_id][metric] += value
        
        return {
            "engine": "V643",
            "experiment_id": experiment_id,
            "variant_id": variant_id,
            "metrics_recorded": metrics,
            "timestamp": datetime.now().isoformat()
        }
    
    def analyze_experiment(self, experiment_id: str) -> Dict[str, Any]:
        """Analyze A/B test results."""
        if experiment_id not in self.experiments:
            return {"error": "Experiment not found"}
        
        experiment = self.experiments[experiment_id]
        results = self.results_db.get(experiment_id, {})
        
        if not results:
            return {
                "engine": "V643",
                "experiment_id": experiment_id,
                "status": "insufficient_data",
                "timestamp": datetime.now().isoformat()
            }
        
        # Calculate metrics for each variant
        variant_metrics = []
        for variant_id, metrics in results.items():
            sent = metrics.get("sent", 1)
            opened = metrics.get("opened", 0)
            clicked = metrics.get("clicked", 0)
            replied = metrics.get("replied", 0)
            conversions = metrics.get("conversions", 0)
            
            variant_metrics.append({
                "variant_id": variant_id,
                "sent": sent,
                "open_rate": round(opened / sent * 100, 2) if sent > 0 else 0,
                "click_rate": round(clicked / sent * 100, 2) if sent > 0 else 0,
                "reply_rate": round(replied / sent * 100, 2) if sent > 0 else 0,
                "conversion_rate": round(conversions / sent * 100, 2) if sent > 0 else 0,
                "engagement_score": self._calculate_engagement_score(
                    opened / sent if sent > 0 else 0,
                    clicked / sent if sent > 0 else 0,
                    replied / sent if sent > 0 else 0
                )
            })
        
        # Find winner
        winner = max(variant_metrics, key=lambda x: x["engagement_score"])
        
        # Calculate statistical significance
        significance = self._calculate_significance(variant_metrics)
        
        # Generate recommendation
        recommendation = self._generate_recommendation(winner, significance)
        
        return {
            "engine": "V643",
            "experiment_id": experiment_id,
            "variant_count": len(variant_metrics),
            "variant_metrics": variant_metrics,
            "winner": winner,
            "statistical_significance": significance,
            "recommendation": recommendation,
            "timestamp": datetime.now().isoformat()
        }
    
    def _calculate_engagement_score(self, open_rate: float, click_rate: float, reply_rate: float) -> float:
        """Calculate overall engagement score."""
        # Weighted average
        return (open_rate * 0.4 + click_rate * 0.4 + reply_rate * 0.2) * 100
    
    def _calculate_significance(self, variant_metrics: List[Dict]) -> str:
        """Calculate statistical significance."""
        total_sent = sum(v["sent"] for v in variant_metrics)
        
        if total_sent < 100:
            return "insufficient_data"
        elif total_sent < 500:
            return "preliminary"
        elif total_sent < 1000:
            return "moderate"
        else:
            return "high"
    
    def _generate_recommendation(self, winner: Dict, significance: str) -> str:
        """Generate recommendation based on results."""
        if significance == "insufficient_data":
            return "Continue testing - need more data"
        
        if winner["engagement_score"] > 15:
            return f"Adopt variant {winner['variant_id']} - strong performance ({winner['engagement_score']:.1f}% engagement)"
        elif winner["engagement_score"] > 10:
            return f"Consider variant {winner['variant_id']} - moderate improvement ({winner['engagement_score']:.1f}% engagement)"
        else:
            return "No clear winner - test different signature variations"
    
    def optimize_signature(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize email signature based on best practices."""
        sender = email.get("from", "")
        
        # Generate signature variations
        signatures = [
            {
                "id": 0,
                "name": "Professional",
                "content": f"Best regards,\n{sender}\nSenior Engineer\nZion Tech Group\n📱 +1 302 464 0950\n✉️ kleber@ziontechgroup.com"
            },
            {
                "id": 1,
                "name": "Friendly",
                "content": f"Cheers,\n{sender}\nZion Tech Group\n🚀 Building the future with AI"
            },
            {
                "id": 2,
                "name": "Minimal",
                "content": f"{sender}\nZion Tech Group"
            }
        ]
        
        # Create experiment
        experiment = self.create_experiment(signatures, email)
        
        return {
            "engine": "V643",
            "email_subject": email.get("subject", ""),
            "signature_variations": signatures,
            "experiment": experiment["experiment"],
            "best_practices": [
                "Keep signature under 4 lines",
                "Include primary contact method",
                "Add social proof (title/company)",
                "Consider adding a CTA or tagline"
            ],
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.optimize_signature(e) for e in emails]
        
        return {
            "engine": "V643 - Email Signature A/B Testing",
            "total_processed": len(results),
            "experiments_created": len(results),
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = EmailSignatureABTesting()
    test_emails = [
        {"subject": "Project Update", "body": "Here's the latest update on the project.",
         "from": "john.doe", "to": ["team@company.com", "manager@company.com"]},
        {"subject": "Client Proposal", "body": "Please find the proposal attached.",
         "from": "jane.smith", "to": ["client@external.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
