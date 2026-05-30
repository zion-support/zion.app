#!/usr/bin/env python3
"""
Email Intelligence V307 - Email Goal Alignment Engine
Maps every email to OKR/KPI goals
Tracks time spent per goal, suggests delegation for off-goal emails
"""
import json, re
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailGoalAlignmentEngine:
    def __init__(self):
        self.version = "V307"
        self.name = "Email Goal Alignment Engine"
        self.goals = {
            'revenue': {'keywords': ['sales', 'deal', 'revenue', 'contract', 'client', 'proposal', 'quote', 'pricing'], 'weight': 1.0},
            'product': {'keywords': ['feature', 'product', 'roadmap', 'sprint', 'release', 'bug', 'enhancement', 'design'], 'weight': 0.9},
            'operations': {'keywords': ['process', 'workflow', 'efficiency', 'automation', 'infrastructure', 'system', 'deploy'], 'weight': 0.8},
            'customer_success': {'keywords': ['customer', 'support', 'satisfaction', 'onboarding', 'retention', 'feedback', 'nps'], 'weight': 0.85},
            'security': {'keywords': ['security', 'vulnerability', 'compliance', 'audit', 'breach', 'access', 'encryption'], 'weight': 0.95},
            'hiring': {'keywords': ['hiring', 'interview', 'candidate', 'recruitment', 'onboarding', 'position', 'role'], 'weight': 0.7},
            'marketing': {'keywords': ['marketing', 'campaign', 'content', 'brand', 'social', 'seo', 'leads', 'awareness'], 'weight': 0.75},
            'admin': {'keywords': ['meeting', 'schedule', 'travel', 'expense', 'admin', 'update', 'status'], 'weight': 0.3}
        }
    
    def align_email_to_goals(self, email: Dict, user_goals: Dict = None) -> Dict:
        """Map email to organizational goals"""
        print(f"[{self.version}] 🎯 Aligning email to goals...")
        
        content = email.get('content', '').lower()
        subject = email.get('subject', '').lower()
        full_text = f"{subject} {content}"
        
        # Score alignment with each goal
        alignments = {}
        for goal, config in self.goals.items():
            matches = sum(1 for kw in config['keywords'] if kw in full_text)
            score = min(100, matches * 20) * config['weight']
            alignments[goal] = round(score, 1)
        
        # Primary goal
        primary_goal = max(alignments, key=alignments.get) if alignments else 'admin'
        primary_score = alignments.get(primary_goal, 0)
        
        # Alignment quality
        if primary_score >= 60:
            quality = 'STRONG'
        elif primary_score >= 30:
            quality = 'MODERATE'
        else:
            quality = 'WEAK'
        
        # Time investment recommendation
        estimated_minutes = self._estimate_time(content)
        should_delegate = quality == 'WEAK' and primary_goal == 'admin'
        
        # Goal impact assessment
        impact = self._assess_impact(primary_goal, primary_score, email)
        
        all_recipients = email.get('to', []) + email.get('cc', [])
        
        result = {
            'version': self.version,
            'engine': self.name,
            'alignment': {
                'primary_goal': primary_goal,
                'primary_score': primary_score,
                'quality': quality,
                'all_scores': alignments,
                'estimated_time_minutes': estimated_minutes,
                'should_delegate': should_delegate,
                'delegation_suggestion': self._suggest_delegation(primary_goal) if should_delegate else None
            },
            'impact': impact,
            'weekly_goal_tracking': {
                'time_on_primary_goal': f'{estimated_minutes}min',
                'goal_alignment_rate': f'{primary_score}%',
                'recommendation': 'Focus time' if primary_score >= 60 else 'Consider delegating' if should_delegate else 'Process normally'
            },
            'reply_all_enforced': True,
            'all_recipients': all_recipients,
            'case_by_case_analysis': True,
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"[{self.version}] ✅ Aligned to: {primary_goal} ({quality}, score: {primary_score:.0f})")
        print(f"[{self.version}] 📬 REPLY-ALL enforced: {len(all_recipients)} recipients")
        
        return result
    
    def _estimate_time(self, content: str) -> int:
        words = len(content.split())
        if words < 50: return 5
        if words < 200: return 10
        if words < 500: return 20
        return 30
    
    def _suggest_delegation(self, goal: str) -> Dict:
        return {
            'admin': 'Delegate to executive assistant or automate',
            'operations': 'Route to operations team',
            'marketing': 'Forward to marketing coordinator'
        }.get(goal, {'suggestion': 'Process personally'})
    
    def _assess_impact(self, goal: str, score: float, email: Dict) -> Dict:
        return {
            'goal': goal,
            'impact_level': 'HIGH' if score >= 60 else 'MEDIUM' if score >= 30 else 'LOW',
            'strategic_value': score >= 60,
            'priority_in_goal': 'Top' if score >= 80 else 'Important' if score >= 50 else 'Background'
        }
    
    def analyze_and_respond(self, email_data: Dict) -> Dict:
        """Align to goals and respond - REPLY-ALL enforced"""
        return self.align_email_to_goals(email_data)

if __name__ == '__main__':
    engine = EmailGoalAlignmentEngine()
    test = {
        'subject': 'New enterprise deal - $500K contract ready for review',
        'content': 'Hi team, We have a $500K enterprise contract ready for legal review. The client wants to close by end of quarter. This aligns with our Q2 revenue target of $2M. Please prioritize the review.',
        'sender': {'email': 'sales@company.com'},
        'to': ['legal@company.com', 'finance@company.com'],
        'cc': ['vp-sales@company.com', 'ceo@company.com']
    }
    result = engine.align_email_to_goals(test)
    print(json.dumps(result, indent=2))
