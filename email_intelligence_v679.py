#!/usr/bin/env python3
"""
V679 - Email Project Risk Detector
Identifies project risks from email communications and generates
mitigation strategies to prevent project failures.

Key Features:
- Risk detection from communication patterns
- Timeline risk assessment
- Resource constraint detection
- Scope creep identification
- Stakeholder alignment monitoring
- Risk mitigation recommendations
"""

import json
import re
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from typing import Dict, List, Optional, Tuple

class EmailProjectRiskDetector:
    def __init__(self):
        self.project_risks = defaultdict(list)
        self.timeline_issues = []
        self.resource_constraints = []
        self.scope_changes = []
        self.stakeholder_issues = []
    
    def detect_project_risks(self, email: Dict) -> Dict:
        """
        Detect project risks from email
        
        Args:
            email: Email dictionary
        
        Returns:
            Dict with risk analysis
        """
        text = email.get('body', '') + ' ' + email.get('subject', '')
        sender = email.get('from', '')
        
        # Detect timeline risks
        timeline_risks = self._detect_timeline_risks(text)
        
        # Detect resource constraints
        resource_risks = self._detect_resource_constraints(text)
        
        # Detect scope creep
        scope_risks = self._detect_scope_creep(text)
        
        # Detect stakeholder issues
        stakeholder_risks = self._detect_stakeholder_issues(text)
        
        # Detect technical risks
        technical_risks = self._detect_technical_risks(text)
        
        # Detect communication risks
        communication_risks = self._detect_communication_risks(text)
        
        # Calculate overall risk score
        overall_risk = self._calculate_overall_risk(
            timeline_risks=timeline_risks,
            resource_risks=resource_risks,
            scope_risks=scope_risks,
            stakeholder_risks=stakeholder_risks,
            technical_risks=technical_risks,
            communication_risks=communication_risks
        )
        
        # Generate mitigation strategies
        mitigation_strategies = self._generate_mitigation_strategies(
            timeline_risks=timeline_risks,
            resource_risks=resource_risks,
            scope_risks=scope_risks,
            stakeholder_risks=stakeholder_risks,
            technical_risks=technical_risks,
            communication_risks=communication_risks
        )
        
        # Determine risk priority
        priority = self._determine_priority(overall_risk)
        
        result = {
            'email_id': email.get('id', ''),
            'sender': sender,
            'overall_risk_score': overall_risk,
            'risk_priority': priority,
            'timeline_risks': timeline_risks,
            'resource_risks': resource_risks,
            'scope_risks': scope_risks,
            'stakeholder_risks': stakeholder_risks,
            'technical_risks': technical_risks,
            'communication_risks': communication_risks,
            'mitigation_strategies': mitigation_strategies,
            'immediate_actions': self._get_immediate_actions(overall_risk, mitigation_strategies),
            'reply_all_required': len(email.get('to', [])) > 1
        }
        
        return result
    
    def _detect_timeline_risks(self, text: str) -> Dict:
        """Detect timeline-related risks"""
        text_lower = text.lower()
        risks = []
        score = 0
        
        # Delay indicators
        delay_keywords = ['delay', 'behind schedule', 'postponed', 'pushed back', 'extended', 'slipped']
        if any(kw in text_lower for kw in delay_keywords):
            risks.append('Project delay detected')
            score += 30
        
        # Deadline pressure
        deadline_keywords = ['deadline', 'due date', 'urgent', 'asap', 'critical timeline']
        if any(kw in text_lower for kw in deadline_keywords):
            risks.append('Tight deadline pressure')
            score += 20
        
        # Missed milestones
        milestone_keywords = ['missed milestone', 'milestone delayed', 'deliverable late']
        if any(kw in text_lower for kw in milestone_keywords):
            risks.append('Missed project milestones')
            score += 40
        
        # Time estimates
        if re.search(r'(?:estimate|estimated|will take)\s+\d+\s+(?:weeks?|months?)', text_lower):
            risks.append('Long time estimates detected')
            score += 15
        
        return {
            'detected': len(risks) > 0,
            'risks': risks,
            'score': min(100, score)
        }
    
    def _detect_resource_constraints(self, text: str) -> Dict:
        """Detect resource constraint risks"""
        text_lower = text.lower()
        risks = []
        score = 0
        
        # Staffing issues
        staffing_keywords = ['not enough people', 'understaffed', 'need more resources', 'short-staffed', 'bandwidth']
        if any(kw in text_lower for kw in staffing_keywords):
            risks.append('Insufficient staffing')
            score += 35
        
        # Budget constraints
        budget_keywords = ['budget', 'cost', 'expensive', 'over budget', 'funding', 'financial']
        if any(kw in text_lower for kw in budget_keywords):
            risks.append('Budget constraints')
            score += 25
        
        # Skill gaps
        skill_keywords = ['skill gap', 'expertise', 'knowledge', 'training needed', 'learning curve']
        if any(kw in text_lower for kw in skill_keywords):
            risks.append('Skill gaps in team')
            score += 30
        
        # Tool/resource limitations
        tool_keywords = ['tool limitation', 'software issue', 'infrastructure', 'system limitation']
        if any(kw in text_lower for kw in tool_keywords):
            risks.append('Tool or infrastructure limitations')
            score += 20
        
        return {
            'detected': len(risks) > 0,
            'risks': risks,
            'score': min(100, score)
        }
    
    def _detect_scope_creep(self, text: str) -> Dict:
        """Detect scope creep risks"""
        text_lower = text.lower()
        risks = []
        score = 0
        
        # New requirements
        requirement_keywords = ['new requirement', 'additional feature', 'extra functionality', 'also need', 'one more thing']
        if any(kw in text_lower for kw in requirement_keywords):
            risks.append('New requirements added')
            score += 35
        
        # Scope changes
        scope_keywords = ['change in scope', 'scope change', 'requirements changed', 'different than planned']
        if any(kw in text_lower for kw in scope_keywords):
            risks.append('Scope changes detected')
            score += 40
        
        # Unclear requirements
        unclear_keywords = ['unclear', 'not sure what', 'ambiguous', 'confusing requirements', 'need clarification']
        if any(kw in text_lower for kw in unclear_keywords):
            risks.append('Unclear requirements')
            score += 25
        
        # Feature creep
        feature_keywords = ['while we\'re at it', 'might as well', 'also add', 'bonus feature']
        if any(kw in text_lower for kw in feature_keywords):
            risks.append('Feature creep indicators')
            score += 30
        
        return {
            'detected': len(risks) > 0,
            'risks': risks,
            'score': min(100, score)
        }
    
    def _detect_stakeholder_issues(self, text: str) -> Dict:
        """Detect stakeholder-related risks"""
        text_lower = text.lower()
        risks = []
        score = 0
        
        # Stakeholder misalignment
        alignment_keywords = ['disagree', 'conflict', 'misaligned', 'different expectations', 'not on same page']
        if any(kw in text_lower for kw in alignment_keywords):
            risks.append('Stakeholder misalignment')
            score += 40
        
        # Lack of engagement
        engagement_keywords = ['no response', 'not engaged', 'hard to reach', 'unresponsive', 'waiting for feedback']
        if any(kw in text_lower for kw in engagement_keywords):
            risks.append('Low stakeholder engagement')
            score += 30
        
        # Changing priorities
        priority_keywords = ['priority changed', 'new priority', 'reprioritize', 'shift in focus']
        if any(kw in text_lower for kw in priority_keywords):
            risks.append('Changing stakeholder priorities')
            score += 35
        
        # Approval delays
        approval_keywords = ['waiting for approval', 'approval pending', 'sign-off needed', 'blocked by approval']
        if any(kw in text_lower for kw in approval_keywords):
            risks.append('Approval bottlenecks')
            score += 25
        
        return {
            'detected': len(risks) > 0,
            'risks': risks,
            'score': min(100, score)
        }
    
    def _detect_technical_risks(self, text: str) -> Dict:
        """Detect technical risks"""
        text_lower = text.lower()
        risks = []
        score = 0
        
        # Technical debt
        debt_keywords = ['technical debt', 'quick fix', 'workaround', 'hack', 'temporary solution']
        if any(kw in text_lower for kw in debt_keywords):
            risks.append('Technical debt accumulation')
            score += 30
        
        # Complexity issues
        complexity_keywords = ['complex', 'complicated', 'difficult', 'challenging', 'hard to implement']
        if any(kw in text_lower for kw in complexity_keywords):
            risks.append('High technical complexity')
            score += 25
        
        # Integration issues
        integration_keywords = ['integration issue', 'compatibility', 'doesn\'t work with', 'integration problem']
        if any(kw in text_lower for kw in integration_keywords):
            risks.append('Integration challenges')
            score += 35
        
        # Performance concerns
        performance_keywords = ['slow', 'performance issue', 'scalability', 'bottleneck', 'latency']
        if any(kw in text_lower for kw in performance_keywords):
            risks.append('Performance concerns')
            score += 30
        
        return {
            'detected': len(risks) > 0,
            'risks': risks,
            'score': min(100, score)
        }
    
    def _detect_communication_risks(self, text: str) -> Dict:
        """Detect communication-related risks"""
        text_lower = text.lower()
        risks = []
        score = 0
        
        # Miscommunication
        miscomm_keywords = ['confusion', 'misunderstanding', 'not clear', 'confusing', 'mixed messages']
        if any(kw in text_lower for kw in miscomm_keywords):
            risks.append('Communication breakdown')
            score += 35
        
        # Information silos
        silo_keywords = ['didn\'t know', 'wasn\'t informed', 'out of the loop', 'not communicated']
        if any(kw in text_lower for kw in silo_keywords):
            risks.append('Information silos')
            score += 30
        
        # Lack of documentation
        doc_keywords = ['no documentation', 'not documented', 'where is the doc', 'missing documentation']
        if any(kw in text_lower for kw in doc_keywords):
            risks.append('Lack of documentation')
            score += 25
        
        # Decision delays
        decision_keywords = ['waiting for decision', 'undecided', 'no decision yet', 'decision pending']
        if any(kw in text_lower for kw in decision_keywords):
            risks.append('Decision-making delays')
            score += 30
        
        return {
            'detected': len(risks) > 0,
            'risks': risks,
            'score': min(100, score)
        }
    
    def _calculate_overall_risk(self, timeline_risks: Dict, resource_risks: Dict,
                               scope_risks: Dict, stakeholder_risks: Dict,
                               technical_risks: Dict, communication_risks: Dict) -> float:
        """Calculate overall risk score"""
        scores = [
            timeline_risks['score'],
            resource_risks['score'],
            scope_risks['score'],
            stakeholder_risks['score'],
            technical_risks['score'],
            communication_risks['score']
        ]
        
        # Weighted average (stakeholder and scope are more critical)
        weights = [0.15, 0.15, 0.20, 0.20, 0.15, 0.15]
        
        weighted_score = sum(score * weight for score, weight in zip(scores, weights))
        
        return min(100, weighted_score)
    
    def _generate_mitigation_strategies(self, timeline_risks: Dict, resource_risks: Dict,
                                       scope_risks: Dict, stakeholder_risks: Dict,
                                       technical_risks: Dict, communication_risks: Dict) -> List[str]:
        """Generate mitigation strategies"""
        strategies = []
        
        # Timeline mitigation
        if timeline_risks['detected']:
            strategies.extend([
                "Reassess project timeline and adjust milestones",
                "Identify critical path and prioritize tasks",
                "Consider adding buffer time for high-risk activities"
            ])
        
        # Resource mitigation
        if resource_risks['detected']:
            strategies.extend([
                "Conduct resource allocation review",
                "Identify skill gaps and plan training",
                "Consider outsourcing or hiring temporary resources"
            ])
        
        # Scope mitigation
        if scope_risks['detected']:
            strategies.extend([
                "Implement formal change control process",
                "Document and prioritize all new requirements",
                "Communicate scope impact to stakeholders"
            ])
        
        # Stakeholder mitigation
        if stakeholder_risks['detected']:
            strategies.extend([
                "Schedule stakeholder alignment meeting",
                "Establish regular communication cadence",
                "Document decisions and expectations clearly"
            ])
        
        # Technical mitigation
        if technical_risks['detected']:
            strategies.extend([
                "Conduct technical risk assessment",
                "Plan for technical debt reduction",
                "Consider architectural review or spike"
            ])
        
        # Communication mitigation
        if communication_risks['detected']:
            strategies.extend([
                "Improve communication channels and frequency",
                "Document key decisions and share widely",
                "Establish clear decision-making process"
            ])
        
        return strategies
    
    def _determine_priority(self, risk_score: float) -> str:
        """Determine risk priority level"""
        if risk_score >= 75:
            return 'critical'
        elif risk_score >= 50:
            return 'high'
        elif risk_score >= 25:
            return 'medium'
        else:
            return 'low'
    
    def _get_immediate_actions(self, risk_score: float, strategies: List[str]) -> List[str]:
        """Get immediate actions based on risk level"""
        if risk_score >= 75:
            return [
                "URGENT: Schedule risk review meeting within 24 hours",
                "Escalate to project sponsor",
                "Implement top 3 mitigation strategies immediately"
            ]
        elif risk_score >= 50:
            return [
                "Schedule risk review meeting within 48 hours",
                "Begin implementing mitigation strategies",
                "Increase monitoring frequency"
            ]
        elif risk_score >= 25:
            return [
                "Monitor risks in next status meeting",
                "Prepare mitigation strategies for implementation if needed"
            ]
        else:
            return [
                "Continue regular monitoring",
                "Document lessons learned"
            ]
    
    def generate_risk_report(self, email_analyses: List[Dict]) -> Dict:
        """Generate comprehensive project risk report"""
        if not email_analyses:
            return {'message': 'No risk data available'}
        
        total_emails = len(email_analyses)
        
        # Average risk score
        avg_risk = sum(e['overall_risk_score'] for e in email_analyses) / total_emails
        
        # Risk distribution
        risk_dist = Counter(e['risk_priority'] for e in email_analyses)
        
        # Most common risks
        all_risks = []
        for email in email_analyses:
            all_risks.extend(email['timeline_risks']['risks'])
            all_risks.extend(email['resource_risks']['risks'])
            all_risks.extend(email['scope_risks']['risks'])
            all_risks.extend(email['stakeholder_risks']['risks'])
            all_risks.extend(email['technical_risks']['risks'])
            all_risks.extend(email['communication_risks']['risks'])
        
        common_risks = Counter(all_risks).most_common(5)
        
        # Critical risks
        critical_count = sum(1 for e in email_analyses if e['risk_priority'] == 'critical')
        
        # Mitigation coverage
        mitigation_coverage = sum(1 for e in email_analyses if len(e['mitigation_strategies']) > 0) / total_emails * 100
        
        return {
            'total_emails_analyzed': total_emails,
            'avg_risk_score': round(avg_risk, 1),
            'risk_priority_distribution': dict(risk_dist),
            'most_common_risks': common_risks,
            'critical_risk_count': critical_count,
            'mitigation_coverage_rate': round(mitigation_coverage, 1),
            'project_health': 'critical' if avg_risk >= 75 else 'at_risk' if avg_risk >= 50 else 'concerning' if avg_risk >= 25 else 'healthy',
            'recommended_focus_areas': self._get_focus_areas(email_analyses),
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_focus_areas(self, email_analyses: List[Dict]) -> List[str]:
        """Get top focus areas for risk mitigation"""
        focus_areas = []
        
        # Analyze which risk categories are most problematic
        category_scores = {
            'timeline': sum(e['timeline_risks']['score'] for e in email_analyses) / len(email_analyses),
            'resources': sum(e['resource_risks']['score'] for e in email_analyses) / len(email_analyses),
            'scope': sum(e['scope_risks']['score'] for e in email_analyses) / len(email_analyses),
            'stakeholders': sum(e['stakeholder_risks']['score'] for e in email_analyses) / len(email_analyses),
            'technical': sum(e['technical_risks']['score'] for e in email_analyses) / len(email_analyses),
            'communication': sum(e['communication_risks']['score'] for e in email_analyses) / len(email_analyses)
        }
        
        # Sort by score
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Return top 3
        return [f"{cat}: {score:.0f}/100" for cat, score in sorted_categories[:3]]


def test_v679():
    """Test V679 Email Project Risk Detector"""
    detector = EmailProjectRiskDetector()
    
    # Test 1: High-risk project email
    email1 = {
        'id': 'e001',
        'from': 'pm@company.com',
        'to': ['team@company.com', 'stakeholders@company.com'],
        'subject': 'URGENT: Project Delay and Scope Changes',
        'body': '''Team,
        
        We have some critical issues to address:
        
        1. The project is behind schedule by 2 weeks due to technical complexity
        2. New requirements have been added by the client (additional features)
        3. We're understaffed and need more resources
        4. Stakeholders are not aligned on priorities
        5. Waiting for approval on budget increase
        
        We need to reassess the timeline and scope immediately.
        
        PM''',
        'timestamp': '2026-05-30T09:00:00'
    }
    
    # Test 2: Medium-risk project email
    email2 = {
        'id': 'e002',
        'from': 'developer@company.com',
        'to': ['pm@company.com'],
        'subject': 'Technical Challenges with Integration',
        'body': '''Hi PM,
        
        I'm encountering some technical challenges with the API integration:
        
        - The third-party API has performance issues (slow response times)
        - Integration is more complex than estimated
        - We might need to implement a workaround
        
        Estimated additional time: 1 week
        
        Developer''',
        'timestamp': '2026-05-30T10:00:00'
    }
    
    # Test 3: Low-risk project email
    email3 = {
        'id': 'e003',
        'from': 'teamlead@company.com',
        'to': ['team@company.com'],
        'subject': 'Project Status Update',
        'body': '''Team,
        
        Quick update on project status:
        
        - All milestones are on track
        - No major blockers
        - Good progress on all fronts
        
        Keep up the great work!
        
        Team Lead''',
        'timestamp': '2026-05-30T11:00:00'
    }
    
    # Analyze all emails
    results = []
    for email in [email1, email2, email3]:
        result = detector.detect_project_risks(email)
        results.append(result)
        
        print(f"\n{'='*50}")
        print(f"Email: {email['subject'][:40]}...")
        print(f"Overall Risk Score: {result['overall_risk_score']}/100")
        print(f"Risk Priority: {result['risk_priority']}")
        print(f"Timeline Risks: {result['timeline_risks']['risks']}")
        print(f"Resource Risks: {result['resource_risks']['risks']}")
        print(f"Scope Risks: {result['scope_risks']['risks']}")
        print(f"Stakeholder Risks: {result['stakeholder_risks']['risks']}")
        print(f"Mitigation Strategies: {len(result['mitigation_strategies'])}")
        print(f"Immediate Actions: {result['immediate_actions'][:2]}")
    
    # Generate report
    report = detector.generate_risk_report(results)
    print(f"\n{'='*50}")
    print(f"✅ V679 Project Risk Detector Test Complete")
    print(f"Total Emails: {report['total_emails_analyzed']}")
    print(f"Avg Risk Score: {report['avg_risk_score']}/100")
    print(f"Project Health: {report['project_health']}")
    print(f"Critical Risks: {report['critical_risk_count']}")
    print(f"Mitigation Coverage: {report['mitigation_coverage_rate']:.1f}%")
    print(f"Focus Areas: {report['recommended_focus_areas']}")
    
    return report


if __name__ == '__main__':
    test_v679()
