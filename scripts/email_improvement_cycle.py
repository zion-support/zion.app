#!/usr/bin/env python3
"""
Zion Tech Group — Email Intelligence Improvement Cycle
Autonomously analyzes email responder performance and suggests improvements.
Part of the continuous learning system for V44+ email responder.
"""

import json, os, sys, datetime, collections, re
from pathlib import Path

HERMES_HOME = os.environ.get("HERMES_HOME", os.path.expanduser("~/.hermes"))
LOG_DIR = os.path.join(HERMES_HOME, "email_logs_v44")
FEEDBACK_FILE = os.path.join(HERMES_HOME, "email_feedback.jsonl")
ANALYSIS_FILE = os.path.join(HERMES_HOME, "email_improvement_analysis.json")
TEMPLATES_FILE = os.path.join(HERMES_HOME, "email_response_templates.json")
PREDICTOR_STATE_FILE = os.path.join(HERMES_HOME, "email_predictor_state.json")
SERVICES_DATA_FILE = "/Users/klebergarciaalcatrao/app/data/servicesData.ts"

def load_jsonl(filepath):
    """Load JSONL file, return list of objects."""
    if not os.path.exists(filepath):
        return []
    results = []
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    results.append(json.loads(line))
                except:
                    pass
    return results

def save_json(filepath, data):
    """Save data to JSON file."""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, default=str)

def analyze_email_performance():
    """Analyze sent emails to compute performance metrics."""
    feedback = load_jsonl(FEEDBACK_FILE)
    if not feedback:
        return {"status": "no_feedback", "message": "No feedback data available"}
    
    # Basic metrics
    total = len(feedback)
    replied = sum(1 for f in feedback if f.get("action") in ["reply", "reply_all"])
    draft_only = sum(1 for f in feedback if f.get("action") == "draft_only")
    human_review = sum(1 for f in feedback if f.get("action") == "human_review")
    
    # Sentiment trajectory
    sentiment_changes = []
    for f in feedback:
        init = f.get("initial_sentiment")
        final = f.get("final_sentiment")
        if init and final:
            # Simple scoring: very_negative=-2, negative=-1, neutral=0, positive=1, very_positive=2
            sent_map = {"very_negative": -2, "negative": -1, "neutral": 0, "positive": 1, "very_positive": 2}
            change = sent_map.get(final, 0) - sent_map.get(init, 0)
            sentiment_changes.append(change)
    
    avg_sentiment_change = sum(sentiment_changes) / len(sentiment_changes) if sentiment_changes else 0
    
    # Intent distribution
    intent_counter = collections.Counter(f.get("detected_intent") for f in feedback if f.get("detected_intent"))
    top_intents = intent_counter.most_common(5)
    
    # Topics/services mentioned (from email content)
    # For simplicity, we'll extract keywords from subject/body
    # In reality, would use NLP
    keyword_counter = collections.Counter()
    for f in feedback:
        text = f"{(f.get('subject') or '')} {(f.get('body_snippet') or '')}".lower()
        # Simple keyword extraction (could be improved)
        words = re.findall(r'\b[a-z]{4,}\b', text)
        # Filter out common words
        stop_words = {"this", "that", "with", "have", "will", "your", "from", "they", "been", "have", "what", "when", "where", "why", "how", "than", "then", "them", "these", "those", "been", "have"}
        keywords = [w for w in words if w not in stop_words and len(w) > 3]
        keyword_counter.update(keywords)
    
    top_keywords = keyword_counter.most_common(10)
    
    # Reply-all effectiveness
    reply_all_attempts = [f for f in feedback if f.get("action") == "reply_all"]
    reply_all_success = [f for f in reply_all_attempts if f.get("outcome") == "positive"]
    reply_all_rate = len(reply_all_success) / len(reply_all_attempts) if reply_all_attempts else 0
    
    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "total_emails_processed": total,
        "actions": {
            "replied": replied,
            "reply_all": sum(1 for f in feedback if f.get("action") == "reply_all"),
            "draft_only": draft_only,
            "human_review": human_review,
            "other": total - (replied + draft_only + human_review)
        },
        "reply_rates": {
            "overall_reply": replied / total if total else 0,
            "reply_all_used": sum(1 for f in feedback if f.get("action") == "reply_all") / total if total else 0,
            "reply_all_success_rate": reply_all_rate
        },
        "sentiment_impact": {
            "average_change": avg_sentiment_change,
            "interpretation": "improving" if avg_sentiment_change > 0.1 else "declining" if avg_sentiment_change < -0.1 else "stable"
        },
        "top_intents": [{"intent": intent, "count": count} for intent, count in top_intents],
        "top_keywords": [{"keyword": kw, "count": count} for kw, count in top_keywords],
        "suggestions": []
    }

def generate_service_ideas_from_keywords(keywords):
    """Generate new service ideas based on frequent keywords in emails."""
    ideas = []
    # Map keywords to potential service areas
    keyword_to_service = {
        "ai": "AI-Powered Email Intelligence Suite",
        "automation": "Workflow Automation Platform",
        "security": "Threat Intelligence & Response System",
        "cloud": "Cloud Cost Optimization Service",
        "data": "Data Governance & Quality Platform",
        "customer": "Customer Experience Analytics",
        "sales": "Sales Enablement & CRM Automation",
        "marketing": "Marketing Automation & Personalization",
        "finance": "Financial Risk & Compliance AI",
        "health": "Healthcare Process Automation",
        "supply": "Supply Chain Optimization AI",
        "human": "HR Talent Acquisition & Retention AI",
        "legal": "Legal Document Analysis & Contract AI",
        "real": "Real Estate Investment AI",
        "retail": "Inventory & Demand Forecasting AI",
        "manufacturing": "Predictive Maintenance & Quality AI",
        "energy": "Smart Grid & Energy Optimization AI",
        "education": "Adaptive Learning & Student Success AI",
        "nonprofit": "Donor Engagement & Impact Measurement AI"
    }
    
    for kw, count in keywords[:5]:  # Top 5 keywords
        kw_lower = kw.lower()
        for key, service in keyword_to_service.items():
            if key in kw_lower:
                ideas.append({
                    "suggested_service": service,
                    "based_on_keyword": kw,
                    "frequency": count,
                    "description": f"Service idea derived from frequent email keyword '{kw}' appearing {count} times in recent communications."
                })
                break  # One idea per keyword
    
    # Deduplicate
    seen = set()
    unique_ideas = []
    for idea in ideas:
        if idea["suggested_service"] not in seen:
            seen.add(idea["suggested_service"])
            unique_ideas.append(idea)
    
    return unique_ideas[:3]  # Top 3

def update_templates_from_feedback():
    """Suggest template updates based on performance."""
    # Placeholder: in reality, would adjust template weights
    return [
        "Consider increasing formality for Finance industry emails based on positive feedback",
        "More concise templates show higher engagement for Technology sector"
    ]

def main():
    """Run the improvement cycle."""
    print("[🔧] Starting Email Intelligence Improvement Cycle...")
    
    # Analyze performance
    analysis = analyze_email_performance()
    
    # Generate service ideas from keywords
    if "top_keywords" in analysis and analysis["top_keywords"]:
        keyword_list = [(item["keyword"], item["count"]) for item in analysis["top_keywords"]]
        service_ideas = generate_service_ideas_from_keywords(keyword_list)
        analysis["service_ideas"] = service_ideas
    
    # Suggest template updates
    analysis["template_suggestions"] = update_templates_from_feedback()
    
    # Save analysis
    save_json(ANALYSIS_FILE, analysis)
    
    # Print summary
    print(f"[📊] Analyzed {analysis['total_emails_processed']} emails")
    print(f"[📈] Reply rate: {analysis['reply_rates']['overall_reply']:.1%}")
    print(f"[😊] Sentiment trend: {analysis['sentiment_impact']['interpretation']}")
    print(f"[💡] Generated {len(analysis.get('service_ideas', []))} service ideas")
    print(f"[💾] Analysis saved to {ANALYSIS_FILE}")
    
    # If we have service ideas, we could optionally create a proposal
    # For now, just log them
    if analysis.get("service_ideas"):
        print("\n[🚀] Suggested New Services:")
        for idea in analysis["service_ideas"]:
            print(f"  - {idea['suggested_service']} (from keyword '{idea['based_on_keyword']}')")
    
    return analysis

if __name__ == "__main__":
    main()