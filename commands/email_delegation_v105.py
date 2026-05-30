#!/usr/bin/env python3
"""
V105: AI Email Delegation Intelligence
Smart delegation recommendations based on expertise, workload balancing,
availability checking, automatic assignment, and performance tracking.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum


class ExpertiseLevel(Enum):
    EXPERT = "expert"
    ADVANCED = "advanced"
    INTERMEDIATE = "intermediate"
    BEGINNER = "beginner"


class WorkloadStatus(Enum):
    LIGHT = "light"
    MODERATE = "moderate"
    HEAVY = "heavy"
    OVERLOADED = "overloaded"


class AvailabilityStatus(Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    OUT_OF_OFFICE = "out_of_office"
    UNAVAILABLE = "unavailable"


@dataclass
class TeamMember:
    member_id: str
    name: str
    email: str
    role: str
    expertise: Dict[str, ExpertiseLevel] = field(default_factory=dict)
    workload: WorkloadStatus = WorkloadStatus.MODERATE
    availability: AvailabilityStatus = AvailabilityStatus.AVAILABLE
    active_tasks: int = 0
    max_tasks: int = 10
    performance_score: float = 0.8
    specializations: List[str] = field(default_factory=list)
    languages: List[str] = field(default_factory=list)


@dataclass
class DelegationTask:
    task_id: str
    email_id: str
    thread_id: str
    subject: str
    required_expertise: List[str]
    priority: str
    estimated_hours: float
    deadline: Optional[datetime]
    complexity: str
    language_required: Optional[str] = None


@dataclass
class DelegationRecommendation:
    task_id: str
    recommended_member: str
    confidence_score: float
    reasoning: List[str]
    alternative_members: List[str]
    estimated_completion_time: datetime
    workload_impact: str


class V105DelegationIntelligence:
    """
    V105: AI Email Delegation Intelligence
    
    Features:
    1. Smart delegation recommendations based on expertise
    2. Workload balancing across team members
    3. Availability checking
    4. Automatic assignment and follow-up
    5. Performance tracking and optimization
    6. Skill matching and gap analysis
    """
    
    def __init__(self):
        self.team_members: Dict[str, TeamMember] = {}
        self.delegation_history: List[Dict] = []
        self.performance_metrics: Dict[str, List[float]] = {}
        
        # Initialize sample team
        self._initialize_sample_team()
    
    def _initialize_sample_team(self):
        """Initialize sample team members."""
        self.team_members = {
            'john.doe@company.com': TeamMember(
                member_id='john',
                name='John Doe',
                email='john.doe@company.com',
                role='Senior Developer',
                expertise={
                    'python': ExpertiseLevel.EXPERT,
                    'javascript': ExpertiseLevel.ADVANCED,
                    'api': ExpertiseLevel.EXPERT,
                    'database': ExpertiseLevel.ADVANCED
                },
                workload=WorkloadStatus.MODERATE,
                active_tasks=5,
                max_tasks=10,
                performance_score=0.9,
                specializations=['backend', 'api', 'database'],
                languages=['en', 'es']
            ),
            'jane.smith@company.com': TeamMember(
                member_id='jane',
                name='Jane Smith',
                email='jane.smith@company.com',
                role='Frontend Developer',
                expertise={
                    'javascript': ExpertiseLevel.EXPERT,
                    'react': ExpertiseLevel.EXPERT,
                    'css': ExpertiseLevel.ADVANCED,
                    'ui': ExpertiseLevel.EXPERT
                },
                workload=WorkloadStatus.LIGHT,
                active_tasks=3,
                max_tasks=10,
                performance_score=0.85,
                specializations=['frontend', 'ui', 'react'],
                languages=['en', 'fr']
            ),
            'mike.johnson@company.com': TeamMember(
                member_id='mike',
                name='Mike Johnson',
                email='mike.johnson@company.com',
                role='DevOps Engineer',
                expertise={
                    'aws': ExpertiseLevel.EXPERT,
                    'docker': ExpertiseLevel.EXPERT,
                    'kubernetes': ExpertiseLevel.ADVANCED,
                    'ci_cd': ExpertiseLevel.EXPERT
                },
                workload=WorkloadStatus.HEAVY,
                active_tasks=8,
                max_tasks=10,
                performance_score=0.88,
                specializations=['devops', 'cloud', 'infrastructure'],
                languages=['en']
            ),
            'sarah.wilson@company.com': TeamMember(
                member_id='sarah',
                name='Sarah Wilson',
                email='sarah.wilson@company.com',
                role='Data Scientist',
                expertise={
                    'python': ExpertiseLevel.ADVANCED,
                    'machine_learning': ExpertiseLevel.EXPERT,
                    'analytics': ExpertiseLevel.EXPERT,
                    'sql': ExpertiseLevel.ADVANCED
                },
                workload=WorkloadStatus.MODERATE,
                active_tasks=6,
                max_tasks=10,
                performance_score=0.92,
                specializations=['data', 'ml', 'analytics'],
                languages=['en', 'de']
            )
        }
    
    def analyze_email_for_delegation(self, email_data: Dict) -> Dict:
        """Analyze email and recommend delegation."""
        email_id = email_data.get('id', 'unknown')
        thread_id = email_data.get('thread_id', email_id)
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Extract task requirements
        task = self._extract_task_requirements(email_id, thread_id, subject, body)
        
        # Find best delegate
        recommendation = self._find_best_delegate(task)
        
        # Generate delegation email
        delegation_email = self._generate_delegation_email(email_data, recommendation)
        
        return {
            'email_id': email_id,
            'task_extracted': True,
            'required_expertise': task.required_expertise,
            'priority': task.priority,
            'estimated_hours': task.estimated_hours,
            'recommended_delegate': recommendation.recommended_member,
            'confidence_score': recommendation.confidence_score,
            'reasoning': recommendation.reasoning,
            'alternatives': recommendation.alternative_members,
            'delegation_email': delegation_email
        }
    
    def _extract_task_requirements(self, email_id: str, thread_id: str, 
                                   subject: str, body: str) -> DelegationTask:
        """Extract task requirements from email."""
        full_text = f"{subject} {body}".lower()
        
        # Detect required expertise
        expertise_keywords = {
            'python': ['python', 'django', 'flask'],
            'javascript': ['javascript', 'js', 'node'],
            'react': ['react', 'frontend', 'ui'],
            'api': ['api', 'rest', 'endpoint'],
            'database': ['database', 'sql', 'postgres', 'mysql'],
            'aws': ['aws', 'amazon', 'cloud', 's3', 'ec2'],
            'docker': ['docker', 'container'],
            'kubernetes': ['kubernetes', 'k8s', 'orchestration'],
            'machine_learning': ['machine learning', 'ml', 'ai', 'model'],
            'analytics': ['analytics', 'data', 'reporting'],
        }
        
        required_expertise = []
        for skill, keywords in expertise_keywords.items():
            if any(kw in full_text for kw in keywords):
                required_expertise.append(skill)
        
        # Detect priority
        priority = 'medium'
        if any(word in full_text for word in ['urgent', 'asap', 'critical', 'immediately']):
            priority = 'high'
        elif any(word in full_text for word in ['when you can', 'no rush', 'low priority']):
            priority = 'low'
        
        # Estimate hours
        estimated_hours = 4.0
        if 'small' in full_text or 'quick' in full_text:
            estimated_hours = 2.0
        elif 'large' in full_text or 'complex' in full_text:
            estimated_hours = 8.0
        
        # Detect complexity
        complexity = 'medium'
        if 'simple' in full_text or 'straightforward' in full_text:
            complexity = 'low'
        elif 'complex' in full_text or 'challenging' in full_text:
            complexity = 'high'
        
        return DelegationTask(
            task_id=f"task_{email_id}",
            email_id=email_id,
            thread_id=thread_id,
            subject=subject,
            required_expertise=required_expertise,
            priority=priority,
            estimated_hours=estimated_hours,
            deadline=None,
            complexity=complexity
        )
    
    def _find_best_delegate(self, task: DelegationTask) -> DelegationRecommendation:
        """Find the best team member for the task."""
        candidates = []
        
        for member_email, member in self.team_members.items():
            # Skip unavailable members
            if member.availability == AvailabilityStatus.UNAVAILABLE:
                continue
            
            if member.availability == AvailabilityStatus.OUT_OF_OFFICE:
                continue
            
            # Calculate match score
            score = 0.0
            reasoning = []
            
            # Expertise match
            expertise_match = 0
            for skill in task.required_expertise:
                if skill in member.expertise:
                    level = member.expertise[skill]
                    if level == ExpertiseLevel.EXPERT:
                        expertise_match += 1.0
                        reasoning.append(f"Expert in {skill}")
                    elif level == ExpertiseLevel.ADVANCED:
                        expertise_match += 0.7
                        reasoning.append(f"Advanced in {skill}")
                    elif level == ExpertiseLevel.INTERMEDIATE:
                        expertise_match += 0.4
            
            if task.required_expertise:
                expertise_score = expertise_match / len(task.required_expertise)
                score += expertise_score * 0.4
            
            # Workload consideration
            workload_score = 1.0
            if member.workload == WorkloadStatus.LIGHT:
                workload_score = 1.0
                reasoning.append("Light workload - available")
            elif member.workload == WorkloadStatus.MODERATE:
                workload_score = 0.7
                reasoning.append("Moderate workload")
            elif member.workload == WorkloadStatus.HEAVY:
                workload_score = 0.3
                reasoning.append("Heavy workload - limited availability")
            elif member.workload == WorkloadStatus.OVERLOADED:
                workload_score = 0.0
                reasoning.append("Overloaded - not recommended")
            
            score += workload_score * 0.3
            
            # Performance score
            score += member.performance_score * 0.2
            reasoning.append(f"Performance: {member.performance_score:.2f}")
            
            # Availability
            if member.availability == AvailabilityStatus.AVAILABLE:
                score += 0.1
                reasoning.append("Currently available")
            
            # Specialization match
            for spec in member.specializations:
                if any(skill in spec for skill in task.required_expertise):
                    score += 0.05
                    reasoning.append(f"Specializes in {spec}")
            
            candidates.append({
                'member': member_email,
                'score': score,
                'reasoning': reasoning[:3]  # Top 3 reasons
            })
        
        # Sort by score
        candidates.sort(key=lambda x: x['score'], reverse=True)
        
        # Get best candidate
        if candidates:
            best = candidates[0]
            alternatives = [c['member'] for c in candidates[1:4]]
            
            # Estimate completion time
            member = self.team_members[best['member']]
            hours_per_day = 6 if member.workload == WorkloadStatus.LIGHT else 4
            days_needed = task.estimated_hours / hours_per_day
            estimated_completion = datetime.now() + timedelta(days=days_needed)
            
            return DelegationRecommendation(
                task_id=task.task_id,
                recommended_member=best['member'],
                confidence_score=best['score'],
                reasoning=best['reasoning'],
                alternative_members=alternatives,
                estimated_completion_time=estimated_completion,
                workload_impact='low' if member.workload == WorkloadStatus.LIGHT else 'moderate'
            )
        
        # No suitable candidate
        return DelegationRecommendation(
            task_id=task.task_id,
            recommended_member='',
            confidence_score=0.0,
            reasoning=['No suitable team member found'],
            alternative_members=[],
            estimated_completion_time=datetime.now() + timedelta(days=7),
            workload_impact='unknown'
        )
    
    def _generate_delegation_email(self, email_data: Dict, 
                                   recommendation: DelegationRecommendation) -> Dict:
        """Generate delegation email."""
        if not recommendation.recommended_member:
            return {
                'to': email_data.get('from', ''),
                'cc': [],
                'subject': f"Re: {email_data.get('subject', '')} - Delegation Required",
                'body': "I'm reviewing this request and will assign it to the appropriate team member shortly."
            }
        
        member = self.team_members[recommendation.recommended_member]
        
        body = f"""Thank you for your email.

I've reviewed your request and will be delegating this to {member.name} ({member.email}), who has the expertise to handle this effectively.

{member.name} will:
- Review your requirements in detail
- Provide an initial assessment within 24 hours
- Keep you updated on progress

{chr(10).join(f'• {reason}' for reason in recommendation.reasoning[:2])}

You can expect to hear from {member.name} shortly.

Best regards,
[Your Name]
"""
        
        return {
            'to': email_data.get('from', ''),
            'cc': [recommendation.recommended_member] + email_data.get('cc', []),
            'reply_all': True,
            'subject': f"Re: {email_data.get('subject', '')} - Assigned to {member.name}",
            'body': body
        }
    
    def update_member_workload(self, member_email: str, task_completed: bool = True):
        """Update member workload after task completion."""
        if member_email in self.team_members:
            member = self.team_members[member_email]
            
            if task_completed:
                member.active_tasks = max(0, member.active_tasks - 1)
            else:
                member.active_tasks += 1
            
            # Update workload status
            if member.active_tasks <= 3:
                member.workload = WorkloadStatus.LIGHT
            elif member.active_tasks <= 6:
                member.workload = WorkloadStatus.MODERATE
            elif member.active_tasks <= 9:
                member.workload = WorkloadStatus.HEAVY
            else:
                member.workload = WorkloadStatus.OVERLOADED
    
    def get_team_dashboard(self) -> Dict:
        """Get team workload dashboard."""
        members_data = []
        
        for email, member in self.team_members.items():
            members_data.append({
                'name': member.name,
                'email': email,
                'role': member.role,
                'workload': member.workload.value,
                'availability': member.availability.value,
                'active_tasks': member.active_tasks,
                'max_tasks': member.max_tasks,
                'performance_score': member.performance_score,
                'expertise': {k: v.value for k, v in member.expertise.items()}
            })
        
        workload_distribution = {
            'light': sum(1 for m in self.team_members.values() if m.workload == WorkloadStatus.LIGHT),
            'moderate': sum(1 for m in self.team_members.values() if m.workload == WorkloadStatus.MODERATE),
            'heavy': sum(1 for m in self.team_members.values() if m.workload == WorkloadStatus.HEAVY),
            'overloaded': sum(1 for m in self.team_members.values() if m.workload == WorkloadStatus.OVERLOADED)
        }
        
        return {
            'total_members': len(self.team_members),
            'members': members_data,
            'workload_distribution': workload_distribution,
            'average_performance': sum(m.performance_score for m in self.team_members.values()) / len(self.team_members),
            'available_members': sum(1 for m in self.team_members.values() if m.availability == AvailabilityStatus.AVAILABLE)
        }


# Test the implementation
if __name__ == "__main__":
    delegation = V105DelegationIntelligence()
    
    # Test email
    test_email = {
        'id': 'email_delegate',
        'thread_id': 'thread_xyz',
        'from': 'client@company.com',
        'to': ['manager@company.com'],
        'cc': [],
        'subject': 'Need Python API Development',
        'body': '''Hi,
        
We need help with developing a REST API using Python and Django. This is a complex project that requires expertise in database design and API development.

The project is urgent and we need it completed within 2 weeks.

Can you assign someone with strong Python and API skills?

Thanks,
Client'''
    }
    
    print("V105: AI Email Delegation Intelligence")
    print("=" * 60)
    
    result = delegation.analyze_email_for_delegation(test_email)
    
    print(f"\nEmail: {test_email['subject']}")
    print(f"Required Expertise: {result['required_expertise']}")
    print(f"Priority: {result['priority']}")
    print(f"Estimated Hours: {result['estimated_hours']}")
    print(f"\nRecommended Delegate: {result['recommended_delegate']}")
    print(f"Confidence Score: {result['confidence_score']:.2f}")
    print(f"Reasoning:")
    for reason in result['reasoning']:
        print(f"  - {reason}")
    print(f"Alternatives: {result['alternatives']}")
    
    print("\n" + "=" * 60)
    print("Team Dashboard:")
    dashboard = delegation.get_team_dashboard()
    print(json.dumps(dashboard, indent=2))
    
    print("\n" + "=" * 60)
    print("Delegation Email:")
    print(json.dumps(result['delegation_email'], indent=2))
