#!/usr/bin/env python3
"""
V68 - Ultra-Advanced Email Responder with 37+ Intelligence Layers
Enhanced with Email Priority Scoring, Smart CC/BCC Analysis, Auto-Categorization,
Response Time Prediction, Thread Sentiment Tracking, and Reply Quality Feedback

Author: Kleber Garcia Alcatrao
Contact: kleber@ziontechgroup.com | +1 302 464 0950
Address: 364 E Main St STE 1008, Middletown, DE 19709
"""

import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from pathlib import Path
import re
import sys

# Add commands directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Import V67 base
from email_responder_v67 import V67EmailResponder, V67AdvancedFeatures


class V68AdvancedFeatures(V67AdvancedFeatures):
    """
    V68 Advanced Intelligence Features (Building on V67):
    1. Email Priority Scoring (0-100 based on sender importance, content urgency, deadline proximity)
    2. Smart CC/BCC Analysis (detects when you should/shouldn't be included)
    3. Email Categorization (auto-tag: action-required, FYI, newsletter, spam)
    4. Response Time Prediction (estimates how long to respond based on complexity)
    5. Email Thread Sentiment Tracking (tracks sentiment changes across conversation)
    6. Auto-Reply Quality Feedback (rates draft responses before sending)
    """
    
    def __init__(self):
        super().__init__()
        self.sender_importance_db = {}
        self.response_time_history = []
        self.thread_sentiment_history = {}
    
    def calculate_email_priority_score(self, email_data: Dict, analysis: Dict) -> Dict:
        """
        Calculate comprehensive email priority score (0-100)
        
        Factors:
        - Sender importance (VIP, executive, client, colleague, unknown)
        - Content urgency (keywords, deadlines, sentiment)
        - Deadline proximity (hours until deadline)
        - Thread depth (ongoing conversations get higher priority)
        - Attachment presence (documents need review)
        
        Returns:
            Priority score and breakdown
        """
        score = 50  # Base score
        breakdown = {
            'sender_importance': 0,
            'content_urgency': 0,
            'deadline_proximity': 0,
            'thread_depth': 0,
            'attachments': 0
        }
        
        # 1. Sender Importance (0-25 points)
        sender = email_data.get('from', '').lower()
        sender_hash = hashlib.md5(sender.encode()).hexdigest()[:8]
        
        # Check if sender is in conversation history (established relationship)
        if sender_hash in self.conversation_history:
            context = self.conversation_history[sender_hash]
            interaction_count = context.get('interaction_count', 0)
            
            if interaction_count >= 10:
                breakdown['sender_importance'] = 25  # VIP
            elif interaction_count >= 5:
                breakdown['sender_importance'] = 20  # Important
            elif interaction_count >= 2:
                breakdown['sender_importance'] = 15  # Known
            else:
                breakdown['sender_importance'] = 10  # New contact
        else:
            # Check for executive keywords
            if any(keyword in sender for keyword in ['ceo', 'cto', 'cfo', 'president', 'vp', 'director']):
                breakdown['sender_importance'] = 25
            elif any(keyword in sender for keyword in ['manager', 'lead', 'senior']):
                breakdown['sender_importance'] = 15
            else:
                breakdown['sender_importance'] = 5
        
        score += breakdown['sender_importance']
        
        # 2. Content Urgency (0-25 points)
        body = email_data.get('body', '').lower()
        subject = email_data.get('subject', '').lower()
        text = f"{subject} {body}"
        
        urgent_keywords = [
            ('urgent', 10), ('asap', 10), ('immediately', 10),
            ('critical', 8), ('emergency', 10), ('deadline', 5),
            ('important', 5), ('priority', 5), ('time-sensitive', 8)
        ]
        
        urgency_score = 0
        for keyword, points in urgent_keywords:
            if keyword in text:
                urgency_score += points
        
        # Cap at 25
        breakdown['content_urgency'] = min(urgency_score, 25)
        score += breakdown['content_urgency']
        
        # 3. Deadline Proximity (0-25 points)
        deadlines = self.extract_deadlines(email_data)
        if deadlines:
            # Get the most urgent deadline
            most_urgent = min(deadlines, key=lambda x: x['hours_until'])
            hours = most_urgent['hours_until']
            
            if hours <= 24:
                breakdown['deadline_proximity'] = 25
            elif hours <= 72:
                breakdown['deadline_proximity'] = 20
            elif hours <= 168:  # 1 week
                breakdown['deadline_proximity'] = 15
            else:
                breakdown['deadline_proximity'] = 10
        
        score += breakdown['deadline_proximity']
        
        # 4. Thread Depth (0-15 points)
        if sender_hash in self.conversation_history:
            context = self.conversation_history[sender_hash]
            thread_count = len(context.get('conversations', []))
            
            if thread_count >= 5:
                breakdown['thread_depth'] = 15
            elif thread_count >= 3:
                breakdown['thread_depth'] = 10
            elif thread_count >= 2:
                breakdown['thread_depth'] = 5
        
        score += breakdown['thread_depth']
        
        # 5. Attachments (0-10 points)
        attachments = email_data.get('attachments', [])
        if attachments:
            breakdown['attachments'] = min(len(attachments) * 3, 10)
        
        score += breakdown['attachments']
        
        # Cap total score at 100
        score = min(score, 100)
        
        # Determine priority level
        if score >= 80:
            priority_level = 'critical'
        elif score >= 60:
            priority_level = 'high'
        elif score >= 40:
            priority_level = 'medium'
        else:
            priority_level = 'low'
        
        return {
            'score': score,
            'level': priority_level,
            'breakdown': breakdown,
            'recommendation': self._get_priority_recommendation(priority_level, breakdown)
        }
    
    def _get_priority_recommendation(self, level: str, breakdown: Dict) -> str:
        """Get recommendation based on priority level"""
        recommendations = {
            'critical': 'Respond immediately. This email requires urgent attention.',
            'high': 'Respond within 2 hours. Important sender or content.',
            'medium': 'Respond within 24 hours. Standard priority.',
            'low': 'Respond when convenient. Low urgency.'
        }
        
        # Customize based on breakdown
        if breakdown['deadline_proximity'] >= 20:
            return f"{recommendations[level]} Deadline approaching."
        elif breakdown['sender_importance'] >= 20:
            return f"{recommendations[level]} Important sender."
        
        return recommendations[level]
    
    def analyze_cc_bcc_smart(self, email_data: Dict) -> Dict:
        """
        Smart CC/BCC analysis to determine if you should be included
        
        Returns:
            Analysis with recommendations
        """
        recipients = email_data.get('to', [])
        cc_list = email_data.get('cc', [])
        bcc_list = email_data.get('bcc', [])
        
        analysis = {
            'should_be_included': True,
            'reason': 'Direct recipient',
            'cc_appropriate': True,
            'bcc_detected': len(bcc_list) > 0,
            'recipient_count': len(recipients) + len(cc_list) + len(bcc_list),
            'recommendations': []
        }
        
        # Check if you're in BCC (you shouldn't reply-all)
        if bcc_list:
            analysis['recommendations'].append(
                'You are BCC\'d - do not reply-all unless necessary'
            )
            analysis['cc_appropriate'] = False
        
        # Check recipient count
        if analysis['recipient_count'] > 20:
            analysis['recommendations'].append(
                'Large distribution list - consider if your response is relevant to all'
            )
        
        # Check if you're only in CC (FYI only)
        if not recipients and cc_list:
            analysis['should_be_included'] = False
            analysis['reason'] = 'You are CC\'d only - this is FYI, no response expected'
            analysis['recommendations'].append(
                'You are CC\'d - only respond if you have valuable input'
            )
        
        # Check for "reply-all" traps
        body = email_data.get('body', '').lower()
        if 'reply all' in body or 'reply-all' in body:
            analysis['recommendations'].append(
                'Sender explicitly asked to reply-all - include all recipients'
            )
        
        return analysis
    
    def categorize_email(self, email_data: Dict, analysis: Dict) -> Dict:
        """
        Auto-categorize email into predefined categories
        
        Categories:
        - action-required: Needs response or action
        - fyi: Informational, no action needed
        - newsletter: Marketing/newsletter content
        - spam: Unsolicited/unwanted
        - meeting: Meeting invitation or update
        - support: Support ticket or issue
        - sales: Sales inquiry or opportunity
        
        Returns:
            Category with confidence score
        """
        body = email_data.get('body', '').lower()
        subject = email_data.get('subject', '').lower()
        text = f"{subject} {body}"
        
        categories = {
            'action-required': {
                'keywords': ['please', 'need', 'request', 'action', 'deadline', 'urgent', 'asap'],
                'confidence': 0
            },
            'fyi': {
                'keywords': ['fyi', 'information', 'update', 'announcement', 'notice'],
                'confidence': 0
            },
            'newsletter': {
                'keywords': ['newsletter', 'subscribe', 'unsubscribe', 'weekly', 'monthly', 'digest'],
                'confidence': 0
            },
            'spam': {
                'keywords': ['winner', 'prize', 'free money', 'click here', 'limited time'],
                'confidence': 0
            },
            'meeting': {
                'keywords': ['meeting', 'calendar', 'schedule', 'invite', 'zoom', 'teams'],
                'confidence': 0
            },
            'support': {
                'keywords': ['help', 'issue', 'problem', 'error', 'bug', 'ticket'],
                'confidence': 0
            },
            'sales': {
                'keywords': ['quote', 'pricing', 'proposal', 'demo', 'interested', 'purchase'],
                'confidence': 0
            }
        }
        
        # Calculate confidence for each category
        for category, data in categories.items():
            score = 0
            for keyword in data['keywords']:
                if keyword in text:
                    score += 1
            data['confidence'] = score / len(data['keywords'])
        
        # Find highest confidence category
        best_category = max(categories.items(), key=lambda x: x[1]['confidence'])
        
        # If confidence is too low, default to action-required
        if best_category[1]['confidence'] < 0.3:
            best_category = ('action-required', {'confidence': 0.5})
        
        return {
            'category': best_category[0],
            'confidence': best_category[1]['confidence'],
            'all_categories': {k: v['confidence'] for k, v in categories.items()}
        }
    
    def predict_response_time(self, email_data: Dict, analysis: Dict) -> Dict:
        """
        Predict how long it will take to respond based on complexity
        
        Factors:
        - Email length
        - Number of questions
        - Technical complexity
        - Attachment review needed
        - Historical response times
        
        Returns:
            Estimated response time in minutes
        """
        body = email_data.get('body', '')
        
        # Base time: 5 minutes
        estimated_minutes = 5
        
        # Factor 1: Email length (1 min per 100 words)
        word_count = len(body.split())
        estimated_minutes += word_count / 100
        
        # Factor 2: Number of questions (2 min per question)
        questions = re.findall(r'\?[^.!?]*', body)
        estimated_minutes += len(questions) * 2
        
        # Factor 3: Technical complexity
        technical_keywords = [
            'api', 'code', 'technical', 'architecture', 'integration',
            'debug', 'error', 'configuration', 'setup', 'deployment'
        ]
        
        technical_count = sum(1 for keyword in technical_keywords if keyword in body.lower())
        estimated_minutes += technical_count * 3
        
        # Factor 4: Attachments (5 min per attachment)
        attachments = email_data.get('attachments', [])
        estimated_minutes += len(attachments) * 5
        
        # Factor 5: Deal/opportunity complexity
        if analysis.get('v67_analysis', {}).get('deal', {}).get('is_opportunity'):
            estimated_minutes += 15
        
        # Cap at 120 minutes (2 hours)
        estimated_minutes = min(estimated_minutes, 120)
        
        # Determine complexity level
        if estimated_minutes <= 10:
            complexity = 'simple'
        elif estimated_minutes <= 30:
            complexity = 'moderate'
        elif estimated_minutes <= 60:
            complexity = 'complex'
        else:
            complexity = 'very-complex'
        
        return {
            'estimated_minutes': round(estimated_minutes),
            'complexity': complexity,
            'factors': {
                'word_count': word_count,
                'questions': len(questions),
                'technical_terms': technical_count,
                'attachments': len(attachments)
            },
            'recommendation': self._get_response_time_recommendation(complexity, estimated_minutes)
        }
    
    def _get_response_time_recommendation(self, complexity: str, minutes: float) -> str:
        """Get recommendation based on response time"""
        if complexity == 'simple':
            return 'Quick response possible. Consider replying immediately.'
        elif complexity == 'moderate':
            return f'Response will take ~{int(minutes)} minutes. Block time in your calendar.'
        elif complexity == 'complex':
            return f'Complex response (~{int(minutes)} min). Consider scheduling dedicated time.'
        else:
            return f'Very complex (~{int(minutes)} min). May need to research or consult others first.'
    
    def track_thread_sentiment(self, email_data: Dict, analysis: Dict) -> Dict:
        """
        Track sentiment changes across email thread
        
        Returns:
            Sentiment trend analysis
        """
        sender = email_data.get('from', '')
        sender_hash = hashlib.md5(sender.encode()).hexdigest()[:8]
        
        current_sentiment = analysis.get('v60', {}).get('sentiment', 'neutral')
        
        # Initialize history if not exists
        if sender_hash not in self.thread_sentiment_history:
            self.thread_sentiment_history[sender_hash] = []
        
        # Add current sentiment
        self.thread_sentiment_history[sender_hash].append({
            'date': datetime.now().isoformat(),
            'sentiment': current_sentiment,
            'subject': email_data.get('subject', '')
        })
        
        # Keep only last 10 entries
        history = self.thread_sentiment_history[sender_hash][-10:]
        
        # Analyze trend
        sentiments = [entry['sentiment'] for entry in history]
        
        positive_count = sentiments.count('positive')
        negative_count = sentiments.count('negative')
        neutral_count = sentiments.count('neutral')
        
        # Determine trend
        if len(history) < 3:
            trend = 'insufficient_data'
        elif positive_count > negative_count and positive_count > neutral_count:
            trend = 'improving'
        elif negative_count > positive_count:
            trend = 'declining'
        else:
            trend = 'stable'
        
        # Check recent change
        if len(history) >= 2:
            recent = history[-2:]
            if recent[0]['sentiment'] != recent[1]['sentiment']:
                trend = f"recent_change_to_{recent[1]['sentiment']}"
        
        return {
            'current_sentiment': current_sentiment,
            'trend': trend,
            'history_count': len(history),
            'breakdown': {
                'positive': positive_count,
                'negative': negative_count,
                'neutral': neutral_count
            },
            'recommendation': self._get_sentiment_trend_recommendation(trend, current_sentiment)
        }
    
    def _get_sentiment_trend_recommendation(self, trend: str, current: str) -> str:
        """Get recommendation based on sentiment trend"""
        if trend == 'improving':
            return 'Relationship sentiment is improving. Continue current approach.'
        elif trend == 'declining':
            return 'Sentiment is declining. Consider proactive outreach to address concerns.'
        elif trend == 'stable':
            return 'Sentiment is stable. Maintain consistent communication.'
        elif 'recent_change_to_negative' in trend:
            return '⚠️ Sentiment recently turned negative. Address concerns immediately.'
        elif 'recent_change_to_positive' in trend:
            return 'Sentiment recently improved. Reinforce positive relationship.'
        else:
            return 'Continue monitoring sentiment trends.'
    
    def evaluate_reply_quality(self, draft_reply: str, email_data: Dict, analysis: Dict) -> Dict:
        """
        Evaluate quality of draft reply before sending
        
        Factors:
        - Completeness (addresses all questions)
        - Tone appropriateness
        - Professionalism
        - Clarity
        - Call-to-action presence
        
        Returns:
            Quality score (0-100) with feedback
        """
        score = 70  # Base score
        feedback = []
        
        # Factor 1: Addresses questions (0-20 points)
        questions = re.findall(r'\?[^.!?]*', email_data.get('body', ''))
        if questions:
            # Check if draft contains answers (simplified check)
            question_keywords = [q.split()[0:3] for q in questions[:3]]
            addressed = sum(1 for q in question_keywords if any(word in draft_reply.lower() for word in q))
            
            if addressed == len(questions):
                score += 20
                feedback.append('✓ All questions addressed')
            elif addressed > 0:
                score += 10
                feedback.append(f'⚠ Only {addressed}/{len(questions)} questions addressed')
            else:
                feedback.append('✗ No questions addressed')
        
        # Factor 2: Tone appropriateness (0-15 points)
        current_sentiment = analysis.get('v60', {}).get('sentiment', 'neutral')
        
        empathetic_words = ['understand', 'appreciate', 'sorry', 'thank', 'glad']
        professional_words = ['please', 'regards', 'sincerely', 'thank you']
        
        if current_sentiment == 'negative':
            if any(word in draft_reply.lower() for word in empathetic_words):
                score += 15
                feedback.append('✓ Appropriate empathetic tone')
            else:
                feedback.append('⚠ Consider more empathetic language')
        else:
            if any(word in draft_reply.lower() for word in professional_words):
                score += 15
                feedback.append('✓ Professional tone')
            else:
                feedback.append('⚠ Add professional closing')
        
        # Factor 3: Clarity (0-15 points)
        sentences = draft_reply.split('.')
        avg_length = sum(len(s.split()) for s in sentences) / len(sentences) if sentences else 0
        
        if 10 <= avg_length <= 25:
            score += 15
            feedback.append('✓ Good sentence length')
        elif avg_length > 25:
            feedback.append('⚠ Sentences too long, consider breaking up')
        else:
            feedback.append('⚠ Sentences too short, add more detail')
        
        # Factor 4: Call-to-action (0-10 points)
        cta_keywords = ['please', 'let me know', 'schedule', 'call', 'meeting', 'next steps']
        if any(keyword in draft_reply.lower() for keyword in cta_keywords):
            score += 10
            feedback.append('✓ Clear call-to-action')
        else:
            feedback.append('⚠ Add clear next steps')
        
        # Factor 5: Length appropriateness (0-10 points)
        original_length = len(email_data.get('body', ''))
        reply_length = len(draft_reply)
        
        if 0.5 <= reply_length / original_length <= 2.0:
            score += 10
            feedback.append('✓ Appropriate length')
        elif reply_length < original_length * 0.5:
            feedback.append('⚠ Reply too brief, add more detail')
        else:
            feedback.append('⚠ Reply too long, consider being more concise')
        
        # Cap score at 100
        score = min(score, 100)
        
        # Determine quality level
        if score >= 90:
            quality = 'excellent'
        elif score >= 75:
            quality = 'good'
        elif score >= 60:
            quality = 'acceptable'
        else:
            quality = 'needs_improvement'
        
        return {
            'score': score,
            'quality': quality,
            'feedback': feedback,
            'ready_to_send': score >= 75,
            'recommendation': self._get_reply_quality_recommendation(quality, score)
        }
    
    def _get_reply_quality_recommendation(self, quality: str, score: int) -> str:
        """Get recommendation based on reply quality"""
        if quality == 'excellent':
            return f'Excellent reply (score: {score}/100). Ready to send.'
        elif quality == 'good':
            return f'Good reply (score: {score}/100). Minor improvements possible.'
        elif quality == 'acceptable':
            return f'Acceptable (score: {score}/100). Review feedback before sending.'
        else:
            return f'Needs improvement (score: {score}/100). Address feedback before sending.'


class V68EmailResponder(V67EmailResponder):
    """
    V68 Email Responder - Ultra-Advanced with 37+ Intelligence Layers
    """
    
    def __init__(self):
        super().__init__()
        self.v68 = V68AdvancedFeatures()
        
        # Enable V68 features
        self.features_enabled.update({
            'priority_scoring': True,
            'smart_cc_bcc': True,
            'email_categorization': True,
            'response_time_prediction': True,
            'thread_sentiment_tracking': True,
            'reply_quality_evaluation': True
        })
    
    def process_email(self, email_data: dict) -> dict:
        """
        Enhanced email processing with V68 features
        """
        # Run base V67 processing
        result = super().process_email(email_data)
        
        # Add V68 enhancements
        result['v68_analysis'] = {}
        
        # 1. Priority Scoring
        if self.features_enabled.get('priority_scoring'):
            priority = self.v68.calculate_email_priority_score(email_data, result['analysis'])
            result['v68_analysis']['priority'] = priority
            
            # Add to recommended actions based on priority
            if priority['level'] in ['critical', 'high']:
                result['recommended_actions'].insert(0, {
                    'action': 'prioritize_email',
                    'priority': 'urgent' if priority['level'] == 'critical' else 'high',
                    'reason': f"Priority score: {priority['score']}/100 ({priority['level']})",
                    'recommendation': priority['recommendation']
                })
        
        # 2. Smart CC/BCC Analysis
        if self.features_enabled.get('smart_cc_bcc'):
            cc_analysis = self.v68.analyze_cc_bcc_smart(email_data)
            result['v68_analysis']['cc_bcc'] = cc_analysis
            
            # Add recommendations
            for rec in cc_analysis['recommendations']:
                result['recommended_actions'].append({
                    'action': 'cc_bcc_guidance',
                    'priority': 'medium',
                    'reason': rec
                })
        
        # 3. Email Categorization
        if self.features_enabled.get('email_categorization'):
            category = self.v68.categorize_email(email_data, result['analysis'])
            result['v68_analysis']['category'] = category
            
            # Add category-specific actions
            if category['category'] == 'action-required':
                result['recommended_actions'].append({
                    'action': 'flag_for_action',
                    'priority': 'high',
                    'reason': f"Email categorized as: {category['category']} (confidence: {category['confidence']:.0%})"
                })
            elif category['category'] == 'spam':
                result['recommended_actions'].append({
                    'action': 'mark_as_spam',
                    'priority': 'urgent',
                    'reason': f"Email categorized as: {category['category']} (confidence: {category['confidence']:.0%})"
                })
        
        # 4. Response Time Prediction
        if self.features_enabled.get('response_time_prediction'):
            response_time = self.v68.predict_response_time(email_data, result['analysis'])
            result['v68_analysis']['response_time'] = response_time
            
            # Add scheduling recommendation
            if response_time['complexity'] in ['complex', 'very-complex']:
                result['recommended_actions'].append({
                    'action': 'schedule_response_time',
                    'priority': 'medium',
                    'reason': f"Estimated response time: {response_time['estimated_minutes']} minutes ({response_time['complexity']})",
                    'recommendation': response_time['recommendation']
                })
        
        # 5. Thread Sentiment Tracking
        if self.features_enabled.get('thread_sentiment_tracking'):
            sentiment_trend = self.v68.track_thread_sentiment(email_data, result['analysis'])
            result['v68_analysis']['sentiment_trend'] = sentiment_trend
            
            # Add sentiment-based actions
            if 'declining' in sentiment_trend['trend'] or 'negative' in sentiment_trend['trend']:
                result['recommended_actions'].append({
                    'action': 'address_sentiment_decline',
                    'priority': 'high',
                    'reason': f"Sentiment trend: {sentiment_trend['trend']}",
                    'recommendation': sentiment_trend['recommendation']
                })
        
        # 6. Reply Quality Evaluation (if draft provided)
        draft_reply = email_data.get('draft_reply')
        if draft_reply and self.features_enabled.get('reply_quality_evaluation'):
            quality = self.v68.evaluate_reply_quality(draft_reply, email_data, result['analysis'])
            result['v68_analysis']['reply_quality'] = quality
            
            # Add quality-based actions
            if quality['ready_to_send']:
                result['recommended_actions'].append({
                    'action': 'ready_to_send',
                    'priority': 'high',
                    'reason': f"Reply quality: {quality['score']}/100 ({quality['quality']})",
                    'recommendation': quality['recommendation']
                })
            else:
                result['recommended_actions'].append({
                    'action': 'improve_reply',
                    'priority': 'high',
                    'reason': f"Reply quality: {quality['score']}/100 ({quality['quality']})",
                    'feedback': quality['feedback'],
                    'recommendation': quality['recommendation']
                })
        
        # Re-prioritize actions
        result['recommended_actions'] = self._prioritize_actions(result['recommended_actions'])
        
        return result
    
    def generate_v68_report(self, result: dict) -> str:
        """
        Generate comprehensive V68 analysis report
        """
        lines = [
            "=" * 80,
            "V68 ULTRA-ADVANCED EMAIL ANALYSIS REPORT",
            "=" * 80,
            f"Email ID: {result.get('email_id', 'unknown')}",
            f"From: {result.get('sender', 'unknown')}",
            f"Subject: {result.get('subject', 'N/A')}",
            f"Timestamp: {result.get('timestamp', 'N/A')}",
            "",
            "🎯 V68 ADVANCED ANALYSIS:",
        ]
        
        v68 = result.get('v68_analysis', {})
        
        # Priority Scoring
        if 'priority' in v68:
            priority = v68['priority']
            lines.append(f"  ⚡ Priority Score: {priority['score']}/100 ({priority['level'].upper()})")
            lines.append(f"     {priority['recommendation']}")
            breakdown = priority['breakdown']
            lines.append(f"     Breakdown: Sender={breakdown['sender_importance']}, Urgency={breakdown['content_urgency']}, Deadline={breakdown['deadline_proximity']}")
        
        # Category
        if 'category' in v68:
            category = v68['category']
            lines.append(f"  📁 Category: {category['category'].upper()} (confidence: {category['confidence']:.0%})")
        
        # CC/BCC Analysis
        if 'cc_bcc' in v68:
            cc = v68['cc_bcc']
            lines.append(f"  👥 CC/BCC: {cc['recipient_count']} recipients")
            if not cc['should_be_included']:
                lines.append(f"     ⚠️  {cc['reason']}")
        
        # Response Time
        if 'response_time' in v68:
            rt = v68['response_time']
            lines.append(f"  ⏱️  Response Time: ~{rt['estimated_minutes']} minutes ({rt['complexity']})")
            lines.append(f"     {rt['recommendation']}")
        
        # Sentiment Trend
        if 'sentiment_trend' in v68:
            st = v68['sentiment_trend']
            lines.append(f"  📈 Sentiment Trend: {st['trend']} (current: {st['current_sentiment']})")
            lines.append(f"     {st['recommendation']}")
        
        # Reply Quality
        if 'reply_quality' in v68:
            rq = v68['reply_quality']
            lines.append(f"  ✍️  Reply Quality: {rq['score']}/100 ({rq['quality']})")
            lines.append(f"     {rq['recommendation']}")
            if rq['feedback']:
                for fb in rq['feedback'][:3]:
                    lines.append(f"     {fb}")
        
        lines.extend([
            "",
            "📋 PRIORITIZED ACTIONS:",
        ])
        
        for i, action in enumerate(result.get('recommended_actions', [])[:10], 1):
            priority_icon = {'urgent': '🚨', 'high': '⚡', 'medium': '📌', 'low': 'ℹ️'}.get(action['priority'], '•')
            lines.append(f"  {i}. {priority_icon} [{action['priority'].upper()}] {action['action']}")
            lines.append(f"     {action['reason']}")
        
        lines.extend(["", "=" * 80])
        
        return '\n'.join(lines)


def main():
    """
    Test V68 Email Responder
    """
    print("V68 Ultra-Advanced Email Responder")
    print("=" * 80)
    
    # Test emails
    test_emails = [
        {
            'id': 'v68_test_001',
            'date': '2026-05-29T14:30:00Z',
            'from': 'ceo@enterprise.com',
            'to': ['kleber@ziontechgroup.com'],
            'cc': ['team@ziontechgroup.com'],
            'subject': 'URGENT: Project Deadline Tomorrow',
            'body': 'Hi Kleber,\n\nWe need the final deliverables by tomorrow 5pm. This is critical for our Q2 launch. Can you confirm everything is on track?\n\nAlso, please review the attached contract and let me know if you have any questions.\n\nThanks,\nJohn Smith\nCEO\nEnterprise Corp',
            'attachments': [{'filename': 'contract.pdf', 'size': 500000}]
        }
    ]
    
    # Process emails
    responder = V68EmailResponder()
    
    for email in test_emails:
        print(f"\n{'='*80}")
        print(f"Processing: {email['subject']}")
        print(f"{'='*80}")
        
        result = responder.process_email(email)
        report = responder.generate_v68_report(result)
        print(report)
    
    print("\n" + "=" * 80)
    print("✅ V68 Ultra-Advanced Email Responder initialized successfully!")
    print(f"   Features enabled: {sum(responder.features_enabled.values())}/{len(responder.features_enabled)}")
    print(f"   Total intelligence layers: 37+")
    print("\n📞 Contact: Kleber Garcia Alcatrao")
    print("   Email: kleber@ziontechgroup.com")
    print("   Phone: +1 302 464 0950")
    print("   Address: 364 E Main St STE 1008, Middletown, DE 19709")
    print("=" * 80)


if __name__ == '__main__':
    main()
