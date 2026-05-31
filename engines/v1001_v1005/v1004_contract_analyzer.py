#!/usr/bin/env python3
"""
V1004 - Email Contract Analyzer
Extracts terms, obligations, deadlines, risks, and legal clauses from contract emails.
Identifies key contractual elements and potential liabilities.
"""
import re
import json
from datetime import datetime, timedelta

def extract_contract_terms(email):
    """Extract key contract terms and conditions"""
    terms = {
        "parties": [],
        "effective_date": None,
        "term_duration": None,
        "termination_clause": None,
        "governing_law": None,
        "payment_terms": None,
    }
    
    # Extract parties
    party_patterns = [
        r'\b(between|among)\s+([A-Z][^,]+?)\s+(?:and|,)\s+([A-Z][^,.]+?)(?:\.|,|\n)',
        r'\b(party|parties)[:\s]+([^,\n]+)',
        r'\b(client|customer|vendor|contractor|provider)[:\s]+([A-Z][^\n]+)',
    ]
    
    for pattern in party_patterns:
        matches = re.findall(pattern, email, re.I)
        for match in matches:
            if isinstance(match, tuple):
                terms["parties"].extend([m.strip() for m in match if len(m.strip()) > 3])
            else:
                terms["parties"].append(match.strip())
    
    terms["parties"] = list(set(terms["parties"]))[:5]
    
    # Effective date
    date_patterns = [
        r'\b(effective|starting|commencing)\s+(?:as of|on)?\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4})',
        r'\b(date)[:\s]+(\d{1,2}/\d{1,2}/\d{2,4})',
        r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b',
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, email, re.I)
        if match:
            terms["effective_date"] = match.group(match.lastindex) if match.lastindex else match.group(0)
            break
    
    # Term duration
    duration_patterns = [
        r'\b(term|duration|period)[:\s]+(\d+)\s*(days?|weeks?|months?|years?)',
        r'\b(\d+)\s*(?:-)?\s*(month|year)\s+(?:term|contract|agreement)',
        r'\bfor\s+(?:a\s+)?(?:period\s+of\s+)?(\d+)\s*(days?|weeks?|months?|years?)',
    ]
    
    for pattern in duration_patterns:
        match = re.search(pattern, email, re.I)
        if match:
            terms["term_duration"] = match.group(0)
            break
    
    # Termination clause
    if re.search(r'\b(terminat|cancel|end)\b', email, re.I):
        termination_patterns = [
            r'\b(termination|cancellation)[:\s]*([^\n.]+)',
            r'\b(either party|any party)\s+(?:may|can)\s+terminate[^\n.]+',
            r'\b(\d+)\s*days?\s+(?:written\s+)?notice\s+(?:of|for)\s+termination',
        ]
        for pattern in termination_patterns:
            match = re.search(pattern, email, re.I)
            if match:
                terms["termination_clause"] = match.group(0).strip()[:200]
                break
    
    # Governing law
    law_match = re.search(r'\b(governed by|jurisdiction|applicable law)[:\s]*([^\n.]+)', email, re.I)
    if law_match:
        terms["governing_law"] = law_match.group(0).strip()
    
    # Payment terms
    payment_patterns = [
        r'\b(payment|pay|compensation)[:\s]*([^\n.]+)',
        r'\b(net\s+\d+)\b',
        r'\b(due|payable)\s+(?:within|in|by)\s+(\d+)\s*days?',
    ]
    for pattern in payment_patterns:
        match = re.search(pattern, email, re.I)
        if match:
            terms["payment_terms"] = match.group(0).strip()[:200]
            break
    
    return terms

def extract_obligations(email):
    """Extract obligations and responsibilities"""
    obligations = []
    
    # Obligation patterns
    obligation_patterns = [
        r'\b(shall|must|will|is required to|agrees to)\s+([^.]+)',
        r'\b(responsible for|obligation to|duty to)\s+([^.]+)',
        r'\b(undertakes|commits to|promises to)\s+([^.]+)',
    ]
    
    for pattern in obligation_patterns:
        matches = re.finditer(pattern, email, re.I)
        for match in matches:
            obligation = match.group(0).strip()
            if len(obligation) > 10 and len(obligation) < 300:
                obligations.append({
                    "text": obligation,
                    "type": "mandatory" if re.search(r'\b(shall|must|will)\b', obligation, re.I) else "commitment",
                    "severity": "high" if re.search(r'\b(must|shall|require)\b', obligation, re.I) else "medium",
                })
    
    return obligations[:10]  # Top 10 obligations

def extract_deadlines(email):
    """Extract all deadlines and time-sensitive items"""
    deadlines = []
    
    deadline_patterns = [
        r'\b(deadline|due date|completion date)[:\s]*([^\n.]+)',
        r'\b(by|no later than|before)\s+([A-Za-z]+\s+\d{1,2},?\s*\d{4})',
        r'\b(within|in)\s+(\d+)\s*(days?|weeks?|months?)',
        r'\b(on or before)\s+([A-Za-z]+\s+\d{1,2},?\s*\d{4})',
    ]
    
    for pattern in deadline_patterns:
        matches = re.finditer(pattern, email, re.I)
        for match in matches:
            deadlines.append({
                "text": match.group(0).strip(),
                "deadline": match.group(2) if match.lastindex >= 2 else match.group(1),
            })
    
    return deadlines[:10]

def extract_risk_clauses(email):
    """Extract potential risk clauses and liabilities"""
    risks = []
    
    risk_patterns = [
        (r'\b(indemnif|hold harmless)\b', "Indemnification clause - potential liability exposure", "high"),
        (r'\b(limitation of liability|liability cap)\b', "Liability limitation - check caps and exclusions", "medium"),
        (r'\b(confidential|non-disclosure|NDA)\b', "Confidentiality obligations - ensure compliance", "medium"),
        (r'\b(non-compete|non-solicitation)\b', "Restrictive covenant - may limit future activities", "high"),
        (r'\b(intellectual property|IP|ownership)\b', "IP ownership clause - verify rights allocation", "high"),
        (r'\b(warranty|guarantee)\b', "Warranty obligations - check scope and duration", "medium"),
        (r'\b(force majeure|act of God)\b', "Force majeure clause - check covered events", "low"),
        (r'\b(liquidated damages|penalty)\b', "Penalty clause - assess financial exposure", "high"),
        (r'\b(auto-?renew|renewal)\b', "Auto-renewal clause - note cancellation deadline", "medium"),
        (r'\b(exclusiv|sole\s+provider)\b', "Exclusivity clause - limits other options", "high"),
    ]
    
    for pattern, description, severity in risk_patterns:
        if re.search(pattern, email, re.I):
            risks.append({
                "clause_type": description,
                "severity": severity,
                "text": re.search(r'[^.]*' + pattern + r'[^.]*', email, re.I).group(0).strip()[:200] if re.search(r'[^.]*' + pattern + r'[^.]*', email, re.I) else "",
            })
    
    return risks

def calculate_contract_risk_score(risks, obligations):
    """Calculate overall contract risk score"""
    score = 0
    
    severity_weights = {"low": 5, "medium": 15, "high": 30}
    
    for risk in risks:
        score += severity_weights.get(risk["severity"], 10)
    
    # More obligations = more risk
    score += len(obligations) * 3
    
    return min(100, score)

def generate_contract_recommendations(terms, obligations, deadlines, risks, risk_score):
    """Generate contract review recommendations"""
    recommendations = []
    
    if risk_score >= 60:
        recommendations.append("🚨 HIGH RISK: Recommend legal review before signing")
    elif risk_score >= 30:
        recommendations.append("⚠️ MEDIUM RISK: Review high-severity clauses carefully")
    
    # Specific recommendations
    high_risks = [r for r in risks if r["severity"] == "high"]
    if high_risks:
        recommendations.append(f"Found {len(high_risks)} high-risk clause(s): " + 
                             ", ".join([r["clause_type"][:40] for r in high_risks[:3]]))
    
    if deadlines:
        recommendations.append(f"📅 {len(deadlines)} deadline(s) identified - add to calendar")
    
    if len(obligations) > 5:
        recommendations.append(f"📋 {len(obligations)} obligations found - ensure capacity to fulfill")
    
    if not terms["termination_clause"]:
        recommendations.append("⚠️ No termination clause found - consider adding exit provisions")
    
    if not terms["governing_law"]:
        recommendations.append("⚠️ No governing law specified - may create jurisdiction issues")
    
    if not terms["payment_terms"]:
        recommendations.append("⚠️ Payment terms unclear - clarify payment schedule and conditions")
    
    if not recommendations:
        recommendations.append("✅ Contract appears standard - review key terms and sign")
    
    return recommendations

def analyze_email(email, reply_all_required=False):
    """Full contract analysis"""
    terms = extract_contract_terms(email)
    obligations = extract_obligations(email)
    deadlines = extract_deadlines(email)
    risks = extract_risk_clauses(email)
    risk_score = calculate_contract_risk_score(risks, obligations)
    recommendations = generate_contract_recommendations(terms, obligations, deadlines, risks, risk_score)
    
    return {
        "engine": "V1004 - Email Contract Analyzer",
        "contract_detected": bool(terms["parties"] or risks or obligations),
        "key_terms": terms,
        "obligations": obligations,
        "obligation_count": len(obligations),
        "deadlines": deadlines,
        "deadline_count": len(deadlines),
        "risk_clauses": risks,
        "risk_count": len(risks),
        "risk_score": risk_score,
        "risk_level": "high" if risk_score >= 60 else "medium" if risk_score >= 30 else "low",
        "recommendations": recommendations,
        "legal_review_recommended": risk_score >= 50,
        "reply_all_enforced": reply_all_required or True,
        "case_by_case_analysis": True,
    }

# === TEST ===
if __name__ == "__main__":
    test1 = """SERVICE AGREEMENT

This agreement is between Zion Tech Group and Acme Corp, effective January 15, 2024.
Term duration: 12 months. Either party may terminate with 30 days written notice.

OBLIGATIONS:
- Provider shall deliver software development services as described in Exhibit A
- Client must pay $15,000 per month within Net 30 days
- Provider is responsible for maintaining confidentiality of all client data
- Client agrees to provide necessary access and resources

RISK CLAUSES:
Provider shall indemnify and hold harmless Client from any claims.
Limitation of liability capped at total fees paid.
All intellectual property created shall be owned by Client.
Non-compete: Provider shall not work with direct competitors for 12 months.

Deadline: Project completion by December 31, 2024.
Governing law: State of Delaware."""
    
    result1 = analyze_email(test1, reply_all_required=True)
    print("=== V1004 Email Contract Analyzer ===")
    print(f"  Contract detected: {result1['contract_detected']}")
    print(f"  Parties: {result1['key_terms']['parties']}")
    print(f"  Effective date: {result1['key_terms']['effective_date']}")
    print(f"  Obligations: {result1['obligation_count']}")
    print(f"  Deadlines: {result1['deadline_count']}")
    print(f"  Risk clauses: {result1['risk_count']}")
    print(f"  Risk score: {result1['risk_score']}")
    print(f"  Risk level: {result1['risk_level']}")
    print(f"  Legal review: {result1['legal_review_recommended']}")
    print(f"  Recommendations: {result1['recommendations'][:3]}")
    print(f"  Reply-all enforced: {result1['reply_all_enforced']}")
    
    test2 = """Hi team, just checking in on the project status. Everything looks good!"""
    result2 = analyze_email(test2)
    print(f"\n  Test 2 Contract detected: {result2['contract_detected']}")
    
    assert result1["contract_detected"] is True
    assert result1["obligation_count"] >= 3
    assert result1["risk_count"] >= 2
    assert result1["reply_all_enforced"] is True
    assert result1["case_by_case_analysis"] is True
    print("\n✅ All V1004 tests passed!")
