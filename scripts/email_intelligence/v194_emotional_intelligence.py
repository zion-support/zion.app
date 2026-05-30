#!/usr/bin/env python3
"""
V194 - AI Email Emotional Intelligence Coach
Detects emotional state from email tone (stress, frustration, excitement, anxiety),
provides emotional regulation techniques, suggests empathy-building phrases,
tracks emotional patterns, and recommends optimal response timing.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any
from collections import defaultdict


class EmotionalIntelligenceCoach:
    """AI-powered emotional intelligence coaching for email."""
    
    def __init__(self):
        self.emotional_markers = self._build_emotional_markers()
        self.regulation_techniques = self._build_regulation_techniques()
        self.empathy_phrases = self._build_empathy_phrases()
        self.emotional_history = defaultdict(list)
    
    def _build_emotional_markers(self) -> Dict[str, Dict]:
        """Build emotional state markers."""
        return {
            'stress': {
                'indicators': ['overwhelmed', 'deadline', 'urgent', 'pressure', 'too much', 'can\'t handle', 'burning out', 'exhausted'],
                'physical_cues': ['tension', 'headache', 'sleepless', 'anxious'],
                'severity': 'high'
            },
            'frustration': {
                'indicators': ['frustrated', 'annoyed', 'irritated', 'fed up', 'again?', 'still not', 'why can\'t', 'this is ridiculous'],
                'physical_cues': ['angry', 'upset', 'mad'],
                'severity': 'high'
            },
            'excitement': {
                'indicators': ['excited', 'amazing', 'incredible', 'can\'t wait', 'thrilled', 'fantastic', 'love this', 'awesome'],
                'physical_cues': ['energy', 'motivated', 'enthusiastic'],
                'severity': 'low'
            },
            'anxiety': {
                'indicators': ['worried', 'concerned', 'nervous', 'what if', 'scared', 'uncertain', 'doubt', 'risky'],
                'physical_cues': ['panic', 'fear', 'apprehensive'],
                'severity': 'medium'
            },
            'disappointment': {
                'indicators': ['disappointed', 'let down', 'expected better', 'unfortunately', 'sorry to say', 'not what I hoped'],
                'physical_cues': ['sad', 'discouraged', 'deflated'],
                'severity': 'medium'
            },
            'gratitude': {
                'indicators': ['thank you', 'appreciate', 'grateful', 'means a lot', 'helpful', 'kind', 'generous'],
                'physical_cues': ['warm', 'touched', 'blessed'],
                'severity': 'low'
            },
            'confusion': {
                'indicators': ['confused', 'don\'t understand', 'unclear', 'what does this mean', 'help me understand', 'lost'],
                'physical_cues': ['puzzled', 'bewildered', 'perplexed'],
                'severity': 'low'
            },
            'urgency': {
                'indicators': ['asap', 'immediately', 'right now', 'critical', 'emergency', 'time-sensitive', 'must respond'],
                'physical_cues': ['rushed', 'pressured', 'panicked'],
                'severity': 'high'
            }
        }
    
    def _build_regulation_techniques(self) -> Dict[str, List[str]]:
        """Build emotional regulation techniques."""
        return {
            'stress': [
                "Take 3 deep breaths before responding",
                "Step away for 5 minutes - walk or stretch",
                "Break the task into smaller, manageable pieces",
                "Ask: 'Will this matter in 5 years?'",
                "Use the 4-7-8 breathing technique (inhale 4s, hold 7s, exhale 8s)"
            ],
            'frustration': [
                "Pause and count to 10 before typing",
                "Reframe: What can I learn from this situation?",
                "Write a draft, then delete it and write a professional version",
                "Ask: 'What outcome do I actually want?'",
                "Use 'I' statements instead of 'you' accusations"
            ],
            'anxiety': [
                "Ground yourself: Name 5 things you can see, 4 you can touch, 3 you can hear",
                "Challenge catastrophic thinking: What's the realistic worst case?",
                "Focus on what you can control vs. what you can't",
                "Break down the unknown into specific questions",
                "Remind yourself of past successes in similar situations"
            ],
            'disappointment': [
                "Acknowledge the feeling without judgment",
                "Ask: 'What can I control moving forward?'",
                "Separate the situation from your self-worth",
                "Look for the lesson or opportunity",
                "Practice self-compassion: 'It's okay to feel this way'"
            ],
            'urgency': [
                "Assess: Is this truly urgent or just feels urgent?",
                "Prioritize: What's the actual deadline vs. perceived deadline?",
                "Communicate: 'I received this and will respond by [specific time]'",
                "Delegate if possible",
                "Use the Eisenhower Matrix: Urgent vs. Important"
            ]
        }
    
    def _build_empathy_phrases(self) -> Dict[str, List[str]]:
        """Build empathy-building phrases."""
        return {
            'stress': [
                "I understand this is a demanding time...",
                "I can see you're juggling a lot right now...",
                "Let's work together to find a manageable solution...",
                "I appreciate you pushing through despite the pressure..."
            ],
            'frustration': [
                "I hear your frustration, and it's completely valid...",
                "I understand this has been a challenging process...",
                "Let's figure out how to make this work better...",
                "Thank you for your patience as we work through this..."
            ],
            'anxiety': [
                "I understand this uncertainty is concerning...",
                "Let me provide clarity on what we know and what's next...",
                "I'm here to support you through this...",
                "Your concerns are important, and here's how we'll address them..."
            ],
            'disappointment': [
                "I understand this isn't the outcome you hoped for...",
                "I appreciate your investment in this, and I'm sorry it didn't work out...",
                "Let's explore what we can learn and how to move forward...",
                "Thank you for your understanding as we navigate this..."
            ],
            'confusion': [
                "I appreciate you asking for clarification...",
                "Let me break this down step by step...",
                "I understand this can be complex, so here's a simpler explanation...",
                "Please let me know if anything is still unclear..."
            ]
        }
    
    def analyze_emotional_state(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze emotional state from email."""
        if not email:
            return {'error': 'No email provided'}
        
        body = email.get('body', '').lower()
        sender = email.get('from', '')
        
        # Detect emotional states
        detected_emotions = self._detect_emotions(body)
        
        # Identify dominant emotion
        dominant_emotion = self._identify_dominant_emotion(detected_emotions)
        
        # Assess emotional intensity
        intensity = self._assess_intensity(detected_emotions)
        
        # Check for emotional escalation
        escalation = self._check_escalation(sender, dominant_emotion)
        
        # Generate regulation recommendations
        regulation = self._generate_regulation_recommendations(dominant_emotion, intensity)
        
        # Suggest empathy phrases
        empathy_suggestions = self._suggest_empathy_phrases(dominant_emotion)
        
        # Recommend response timing
        timing = self._recommend_response_timing(dominant_emotion, intensity, escalation)
        
        # Track emotional pattern
        self._track_emotional_pattern(sender, dominant_emotion, intensity)
        
        # Burnout risk assessment
        burnout_risk = self._assess_burnout_risk(sender)
        
        return {
            'analysis_id': f"emotion_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'timestamp': datetime.now().isoformat(),
            'detected_emotions': detected_emotions,
            'dominant_emotion': dominant_emotion,
            'emotional_intensity': intensity,
            'escalation_detected': escalation,
            'regulation_recommendations': regulation,
            'empathy_phrases': empathy_suggestions,
            'response_timing': timing,
            'burnout_risk': burnout_risk,
            'reply_all_strategy': self._determine_reply_all_strategy(dominant_emotion, intensity),
            'coaching_tips': self._generate_coaching_tips(dominant_emotion, intensity)
        }
    
    def _detect_emotions(self, body: str) -> List[Dict[str, Any]]:
        """Detect emotional states from email body."""
        detected = []
        
        for emotion, markers in self.emotional_markers.items():
            indicators = markers['indicators']
            physical_cues = markers['physical_cues']
            
            # Count indicator matches
            indicator_count = sum(1 for ind in indicators if ind in body)
            physical_count = sum(1 for cue in physical_cues if cue in body)
            
            total_matches = indicator_count + physical_count
            
            if total_matches > 0:
                detected.append({
                    'emotion': emotion,
                    'confidence': min(total_matches / 3, 1.0),
                    'matches': total_matches,
                    'severity': markers['severity']
                })
        
        return sorted(detected, key=lambda x: x['confidence'], reverse=True)
    
    def _identify_dominant_emotion(self, detected_emotions: List) -> str:
        """Identify the dominant emotion."""
        if not detected_emotions:
            return 'neutral'
        
        return detected_emotions[0]['emotion']
    
    def _assess_intensity(self, detected_emotions: List) -> Dict[str, Any]:
        """Assess emotional intensity."""
        if not detected_emotions:
            return {'level': 'low', 'score': 0}
        
        max_confidence = max(e['confidence'] for e in detected_emotions)
        
        if max_confidence >= 0.8:
            return {'level': 'high', 'score': round(max_confidence * 100, 1)}
        elif max_confidence >= 0.5:
            return {'level': 'medium', 'score': round(max_confidence * 100, 1)}
        else:
            return {'level': 'low', 'score': round(max_confidence * 100, 1)}
    
    def _check_escalation(self, sender: str, current_emotion: str) -> Dict[str, Any]:
        """Check for emotional escalation."""
        history = self.emotional_history.get(sender, [])
        
        if len(history) < 3:
            return {'escalating': False, 'pattern': 'insufficient_data'}
        
        recent = history[-3:]
        intensities = [h['intensity'] for h in recent]
        
        if intensities[-1] > intensities[0] * 1.5:
            return {
                'escalating': True,
                'pattern': 'increasing',
                'change': round((intensities[-1] - intensities[0]) / intensities[0] * 100, 1)
            }
        elif intensities[-1] < intensities[0] * 0.5:
            return {
                'escalating': False,
                'pattern': 'decreasing',
                'change': round((intensities[-1] - intensities[0]) / intensities[0] * 100, 1)
            }
        else:
            return {'escalating': False, 'pattern': 'stable'}
    
    def _generate_regulation_recommendations(self, emotion: str, intensity: Dict) -> List[str]:
        """Generate emotional regulation recommendations."""
        if emotion == 'neutral' or intensity['level'] == 'low':
            return ["Your emotional state appears balanced - proceed with your response"]
        
        techniques = self.regulation_techniques.get(emotion, [])
        
        if intensity['level'] == 'high':
            return [
                "⚠️  HIGH EMOTIONAL INTENSITY DETECTED",
                "Take a 10-minute break before responding",
                "Practice deep breathing (4-7-8 technique)",
                "Write your response, then wait 30 minutes before sending"
            ] + techniques[:2]
        else:
            return techniques[:3]
    
    def _suggest_empathy_phrases(self, emotion: str) -> List[str]:
        """Suggest empathy-building phrases."""
        if emotion == 'neutral':
            return ["Maintain your professional tone"]
        
        phrases = self.empathy_phrases.get(emotion, [])
        return phrases[:2] if phrases else ["Acknowledge their perspective before responding"]
    
    def _recommend_response_timing(self, emotion: str, intensity: Dict, escalation: Dict) -> Dict[str, Any]:
        """Recommend optimal response timing."""
        if emotion == 'neutral':
            return {
                'recommendation': 'respond_now',
                'delay_minutes': 0,
                'reason': 'Emotional state is balanced'
            }
        
        if intensity['level'] == 'high' or escalation.get('escalating'):
            return {
                'recommendation': 'delay_response',
                'delay_minutes': 30,
                'reason': f'High emotional intensity detected - take time to regulate before responding'
            }
        elif intensity['level'] == 'medium':
            return {
                'recommendation': 'brief_pause',
                'delay_minutes': 10,
                'reason': 'Moderate emotion detected - brief pause recommended'
            }
        else:
            return {
                'recommendation': 'respond_soon',
                'delay_minutes': 5,
                'reason': 'Low emotion - quick check-in before sending'
            }
    
    def _track_emotional_pattern(self, sender: str, emotion: str, intensity: Dict):
        """Track emotional patterns over time."""
        self.emotional_history[sender].append({
            'timestamp': datetime.now().isoformat(),
            'emotion': emotion,
            'intensity': intensity['score']
        })
        
        # Keep only last 20 entries
        if len(self.emotional_history[sender]) > 20:
            self.emotional_history[sender] = self.emotional_history[sender][-20:]
    
    def _assess_burnout_risk(self, sender: str) -> Dict[str, Any]:
        """Assess burnout risk based on emotional patterns."""
        history = self.emotional_history.get(sender, [])
        
        if len(history) < 5:
            return {'risk': 'unknown', 'score': 0, 'message': 'Insufficient data'}
        
        # Count high-stress emotions
        stress_emotions = ['stress', 'frustration', 'anxiety', 'urgency']
        stress_count = sum(1 for h in history[-10:] if h['emotion'] in stress_emotions and h['intensity'] > 60)
        
        risk_score = (stress_count / 10) * 100
        
        if risk_score >= 70:
            return {
                'risk': 'high',
                'score': round(risk_score, 1),
                'message': 'High burnout risk detected - consider workload review and self-care'
            }
        elif risk_score >= 40:
            return {
                'risk': 'medium',
                'score': round(risk_score, 1),
                'message': 'Moderate burnout risk - monitor stress levels'
            }
        else:
            return {
                'risk': 'low',
                'score': round(risk_score, 1),
                'message': 'Low burnout risk - emotional patterns are healthy'
            }
    
    def _determine_reply_all_strategy(self, emotion: str, intensity: Dict) -> Dict[str, Any]:
        """Determine reply-all strategy based on emotional state."""
        if emotion in ['frustration', 'stress', 'anxiety'] and intensity['level'] == 'high':
            return {
                'reply_all_recommended': False,
                'reason': 'High emotion detected - consider private response first to avoid escalation',
                'alternative': 'Reply to sender, then forward to others if needed'
            }
        else:
            return {
                'reply_all_recommended': True,
                'reason': 'Emotional state is appropriate for group communication',
                'alternative': None
            }
    
    def _generate_coaching_tips(self, emotion: str, intensity: Dict) -> List[str]:
        """Generate personalized coaching tips."""
        tips = []
        
        if intensity['level'] == 'high':
            tips.append("Remember: Your response represents you and your organization")
            tips.append("Focus on the outcome you want, not the emotion you feel")
        
        if emotion == 'frustration':
            tips.append("Reframe: What would a mediator say in this situation?")
        
        if emotion == 'anxiety':
            tips.append("Ask: What's one small step I can take to move forward?")
        
        if emotion == 'stress':
            tips.append("Prioritize: What's the most important thing to address right now?")
        
        tips.append("Always maintain professionalism, even when emotions run high")
        
        return tips


def analyze_email_emotions(email: Dict[str, Any]) -> Dict[str, Any]:
    """Main entry point for emotional intelligence analysis."""
    coach = EmotionalIntelligenceCoach()
    return coach.analyze_emotional_state(email)


if __name__ == '__main__':
    test_email = {
        'from': 'frustrated.client@company.com',
        'subject': 'Still waiting for response!!!',
        'body': 'I am extremely frustrated that I still haven\'t received a response to my email from last week. This is ridiculous and I\'m fed up with the lack of communication. I need an answer ASAP or I will have to escalate this. This is urgent and time-sensitive.',
        'date': '2024-01-15T10:00:00'
    }
    
    result = analyze_email_emotions(test_email)
    print(json.dumps(result, indent=2))
