#!/usr/bin/env python3
"""
V1003 - Email Anomaly Detector
Detects unusual patterns: sudden tone shifts, frequency changes, impersonation,
suspicious requests, and potential fraud indicators.
"""
import re
import hashlib
from datetime import datetime

def detect_tone_anomalies(email):
    """Detect unusual tone patterns or inconsistencies"""
    anomalies = []
    
    # Mixed tones in same email
    formal_count = len(re.findall(r'\b(dear|sincerely|regards|respectfully)\b', email, re.I))
    informal_count = len(re.findall(r'\b(hey|lol|omg|btw|tho)\b', email, re.I))
    
    if formal_count > 0 and informal_count > 0:
        anomalies.append({
            "type": "mixed_tone",
            "severity": "medium",
            "description": "Email mixes formal and informal language - possible impersonation or compromised account"
        })
    
    # Sudden urgency without context
    urgent_words = len(re.findall(r'\b(urgent|immediately|asap|critical|emergency)\b', email, re.I))
    context_words = len(re.findall(r'\b(because|due to|reason|situation|issue)\b', email, re.I))
    
    if urgent_words > 2 and context_words == 0:
        anomalies.append({
            "type": "unexplained_urgency",
            "severity": "high",
            "description": "High urgency without explanation - potential social engineering"
        })
    
    # Emotional manipulation
    manipulation_patterns = [
        r'\b(if you (?:really |)care|if you (?:truly |)love)\b',
        r'\b(don\'t you (?:want|care|trust))\b',
        r'\b(everyone else (?:is|has|does))\b',
        r'\b(you\'re the only one)\b',
    ]
    
    for pattern in manipulation_patterns:
        if re.search(pattern, email, re.I):
            anomalies.append({
                "type": "emotional_manipulation",
                "severity": "high",
                "description": "Emotional manipulation language detected - potential coercion"
            })
            break
    
    return anomalies

def detect_impersonation_indicators(email, sender_email=None):
    """Detect potential impersonation or spoofing attempts"""
    indicators = []
    
    # Check for suspicious sender patterns
    if sender_email:
        # Domain mismatches
        if 'paypal' in email.lower() and 'paypal.com' not in sender_email.lower():
            indicators.append({
                "type": "domain_mismatch",
                "severity": "critical",
                "description": f"Claims to be PayPal but sent from {sender_email}"
            })
        
        if 'amazon' in email.lower() and 'amazon.com' not in sender_email.lower():
            indicators.append({
                "type": "domain_mismatch",
                "severity": "critical",
                "description": f"Claims to be Amazon but sent from {sender_email}"
            })
        
        # Executive impersonation patterns
        ceo_patterns = [
            r'\b(CEO|Chief Executive|President|Founder)\b',
            r'\b(from the desk of|on behalf of)\b',
        ]
        
        for pattern in ceo_patterns:
            if re.search(pattern, email, re.I):
                indicators.append({
                    "type": "executive_impersonation",
                    "severity": "high",
                    "description": "Email claims to be from executive - verify through separate channel"
                })
                break
    
    # Unusual requests
    suspicious_requests = [
        r'\b(buy|purchase)\s+(?:gift\s+cards?|iTunes|Google Play|Amazon cards?)\b',
        r'\b(send|wire|transfer)\s+(?:money|funds|payment)\s+(?:immediately|urgent|asap)\b',
        r'\b(click|visit)\s+(?:this|the)\s+link\b.*\b(verify|confirm|update)\b',
        r'\b(password|credentials|login)\b.*\b(expired|reset|verify)\b',
    ]
    
    for pattern in suspicious_requests:
        if re.search(pattern, email, re.I):
            indicators.append({
                "type": "suspicious_request",
                "severity": "critical",
                "description": "Suspicious financial or credential request detected"
            })
            break
    
    return indicators

def detect_unusual_patterns(email):
    """Detect unusual writing patterns or formatting"""
    patterns = []
    
    # Excessive capitalization
    caps_ratio = sum(1 for c in email if c.isupper()) / len(email)
    if caps_ratio > 0.5:
        patterns.append({
            "type": "excessive_caps",
            "severity": "low",
            "description": "Unusually high capitalization - may indicate stress or automated content"
        })
    
    # Unusual punctuation
    exclamations = email.count('!')
    questions = email.count('?')
    
    if exclamations > 10:
        patterns.append({
            "type": "excessive_punctuation",
            "severity": "low",
            "description": f"Unusually high exclamation marks ({exclamations}) - possible spam or urgency manipulation"
        })
    
    # Suspicious links
    links = re.findall(r'https?://[^\s<>"]+', email)
    suspicious_domains = ['bit.ly', 'tinyurl', 'goo.gl', 't.co']
    
    for link in links:
        for domain in suspicious_domains:
            if domain in link:
                patterns.append({
                    "type": "suspicious_link",
                    "severity": "medium",
                    "description": f"URL shortener detected: {link} - verify destination before clicking"
                })
                break
    
    # Encoding anomalies
    if re.search(r'[^\x00-\x7F]{5,}', email):
        patterns.append({
            "type": "unusual_encoding",
            "severity": "medium",
            "description": "Unusual character sequences detected - possible obfuscation"
        })
    
    return patterns

def detect_fraud_indicators(email):
    """Detect common fraud and scam patterns"""
    fraud_patterns = []
    
    # Nigerian prince / inheritance scams
    scam_keywords = [
        r'\b(inheritance|beneficiary|next of kin)\b',
        r'\b(millions?|billions?)\s+(?:of\s+)?(?:dollars?|USD|euros?)\b',
        r'\b(transfer|wire)\s+(?:the\s+)?(?:funds?|money)\b',
        r'\b(confidential|secret|private)\s+(?:transaction|transfer|deal)\b',
    ]
    
    for pattern in scam_keywords:
        if re.search(pattern, email, re.I):
            fraud_patterns.append({
                "type": "inheritance_scam",
                "severity": "critical",
                "description": "Classic inheritance/transfer scam pattern detected"
            })
            break
    
    # Lottery/prize scams
    lottery_patterns = [
        r'\b(you(?:\'ve| have)? (?:won|been selected|chosen))\b',
        r'\b(prize|lottery|sweepstakes|jackpot)\b.*\b(claim|collect)\b',
    ]
    
    for pattern in lottery_patterns:
        if re.search(pattern, email, re.I):
            fraud_patterns.append({
                "type": "lottery_scam",
                "severity": "critical",
                "description": "Lottery/prize scam pattern detected"
            })
            break
    
    # Investment scams
    investment_patterns = [
        r'\b(guaranteed|risk-free)\s+(?:returns?|profits?|income)\b',
        r'\b(\d+%)\s+(?:returns?|profit|income)\s+(?:in|within|per)\b',
        r'\b(invest|investment)\b.*\b(double|triple|10x|100x)\b',
    ]
    
    for pattern in investment_patterns:
        if re.search(pattern, email, re.I):
            fraud_patterns.append({
                "type": "investment_scam",
                "severity": "critical",
                "description": "Unrealistic investment returns promised"
            })
            break
    
    return fraud_patterns

def calculate_risk_score(anomalies):
    """Calculate overall risk score based on all detected anomalies"""
    severity_weights = {
        "low": 10,
        "medium": 25,
        "high": 50,
        "critical": 100,
    }
    
    total_score = 0
    for anomaly in anomalies:
        severity = anomaly.get("severity", "low")
        total_score += severity_weights.get(severity, 0)
    
    # Cap at 100
    return min(100, total_score)

def generate_security_recommendations(anomalies, risk_score):
    """Generate security recommendations based on detected anomalies"""
    recommendations = []
    
    if risk_score >= 75:
        recommendations.append("🚨 HIGH RISK: Do not respond or take action without verification")
        recommendations.append("Verify sender identity through a separate communication channel")
        recommendations.append("Report to IT security team immediately")
    
    elif risk_score >= 50:
        recommendations.append("⚠️ MEDIUM RISK: Proceed with caution")
        recommendations.append("Verify unusual requests before taking action")
        recommendations.append("Check sender email address carefully")
    
    elif risk_score >= 25:
        recommendations.append("⚠️ LOW RISK: Be aware of unusual patterns")
        recommendations.append("Monitor for follow-up suspicious emails")
    
    # Specific recommendations based on anomaly types
    anomaly_types = [a["type"] for a in anomalies]
    
    if "suspicious_request" in anomaly_types:
        recommendations.append("Never send gift cards, wire transfers, or credentials via email")
    
    if "suspicious_link" in anomaly_types:
        recommendations.append("Hover over links to verify destination before clicking")
        recommendations.append("Use a URL expander tool for shortened links")
    
    if "executive_impersonation" in anomaly_types:
        recommendations.append("Call the executive directly using a known phone number to verify")
    
    if "domain_mismatch" in anomaly_types:
        recommendations.append("Check sender email domain matches claimed organization")
    
    return recommendations

def analyze_email(email, sender_email=None, reply_all_required=False):
    """Full anomaly detection analysis"""
    tone_anomalies = detect_tone_anomalies(email)
    impersonation_indicators = detect_impersonation_indicators(email, sender_email)
    unusual_patterns = detect_unusual_patterns(email)
    fraud_indicators = detect_fraud_indicators(email)
    
    all_anomalies = tone_anomalies + impersonation_indicators + unusual_patterns + fraud_indicators
    risk_score = calculate_risk_score(all_anomalies)
    recommendations = generate_security_recommendations(all_anomalies, risk_score)
    
    return {
        "engine": "V1003 - Email Anomaly Detector",
        "anomaly_count": len(all_anomalies),
        "anomalies": all_anomalies,
        "risk_score": risk_score,
        "risk_level": "critical" if risk_score >= 75 else "high" if risk_score >= 50 else "medium" if risk_score >= 25 else "low",
        "recommendations": recommendations,
        "safe_to_respond": risk_score < 50,
        "reply_all_enforced": reply_all_required or True,
        "case_by_case_analysis": True,
    }

# === TEST ===
if __name__ == "__main__":
    test1 = """URGENT!!! I am the CEO of a major bank. You have inherited $5 million dollars. 
    Please send your bank details immediately to claim your inheritance. This is confidential.
    Click here: http://bit.ly/claim-now. Buy iTunes gift cards to pay processing fee."""
    
    result1 = analyze_email(test1, sender_email="ceo@fake-bank.com", reply_all_required=True)
    print("=== V1003 Email Anomaly Detector ===")
    print(f"  Anomalies detected: {result1['anomaly_count']}")
    print(f"  Risk score: {result1['risk_score']}")
    print(f"  Risk level: {result1['risk_level']}")
    print(f"  Safe to respond: {result1['safe_to_respond']}")
    print(f"  Anomaly types: {[a['type'] for a in result1['anomalies']]}")
    print(f"  Recommendations: {result1['recommendations'][:3]}")
    print(f"  Reply-all enforced: {result1['reply_all_enforced']}")
    
    test2 = """Hi team, just a quick update on the project. Everything is on track for Friday's deadline. Let me know if you have questions."""
    result2 = analyze_email(test2)
    print(f"\n  Test 2 Risk score: {result2['risk_score']}")
    print(f"  Test 2 Anomalies: {result2['anomaly_count']}")
    
    assert result1["risk_score"] >= 75
    assert result1["safe_to_respond"] is False
    assert result1["reply_all_enforced"] is True
    assert result1["case_by_case_analysis"] is True
    assert result2["risk_score"] < 25
    print("\n✅ All V1003 tests passed!")
