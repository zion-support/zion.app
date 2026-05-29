#!/usr/bin/env python3
"""
Case Analyzer for Email Responder
Performs case-by-case analysis of emails to determine sentiment, urgency, and intent.
"""

import re
from typing import Dict, Any


class CaseAnalyzer:
    def __init__(self):
        # Define keyword lists for sentiment, urgency, and intent
        self.positive_words = {
            'good', 'great', 'excellent', 'awesome', 'fantastic', 'thanks', 'thank you',
            'happy', 'pleased', 'satisfied', 'appreciate', 'love', 'liked', 'best',
            'amazing', 'wonderful', 'perfect', 'brilliant', 'outstanding'
        }
        self.negative_words = {
            'bad', 'poor', 'terrible', 'awful', 'horrible', 'disappointed', 'unhappy',
            'angry', 'frustrated', 'upset', 'annoyed', 'irritated', 'hate', 'dislike',
            'worst', 'pathetic', 'subpar', 'inadequate', 'defective', 'broken', 'fail',
            'failure', 'error', 'issue', 'problem', 'complaint'
        }
        self.urgency_high = {
            'urgent', 'asap', 'emergency', 'critical', 'immediately', 'right now',
            'stat', 'priority', 'urgent', 'rush', 'emergent', 'pressing'
        }
        self.urgency_medium = {
            'soon', 'today', 'tomorrow', 'promptly', 'quickly', 'expedite', 'expedited',
            'timely', 'in a timely manner', 'by end of day', 'eod', 'by tomorrow'
        }
        self.intent_inquiry = {
            'question', 'ask', 'inquire', 'inquiry', 'how to', 'what is', 'where is',
            'when is', 'who is', 'why', 'can you', 'could you', 'would you', 'do you know',
            'information', 'info', 'details', 'clarify', 'clarification', 'explain'
        }
        self.intent_complaint = {
            'complaint', 'issue', 'problem', 'not working', 'broken', 'defect', 'error',
            'fail', 'failure', 'mistake', 'wrong', 'disappointed', 'unsatisfied',
            'dissatisfied', 'concern', 'concerns', 'trouble', 'troubleshooting'
        }
        self.intent_request = {
            'request', 'please', 'could you', 'would you', 'can you', 'would you mind',
            'i would like', 'i want', 'i need', 'need', 'want', 'desire', 'seek',
            'looking for', 'seek', 'pursue', 'request for', 'requesting'
        }
        self.intent_feedback = {
            'feedback', 'suggestion', 'idea', 'suggest', 'propose', 'proposal',
            'recommendation', 'recommend', 'comment', 'comments', 'thought', 'thoughts',
            'opinion', 'opinions', 'view', 'views', 'input', 'review', 'review'
        }

    def analyze(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze an email and return a dictionary with sentiment, urgency, intent, and suggested actions.
        :param email: Dictionary containing at least 'subject' and 'body' (or 'thread' if available)
        :return: Dictionary with keys: sentiment, urgency, intent, suggested_actions
        """
        # Combine subject and body/thread for analysis
        subject = email.get('subject', '').lower()
        # Try to get the body; if not available, try to get the first thread entry
        body = ''
        if 'body' in email:
            body = email['body'].lower()
        elif 'thread' in email and isinstance(email['thread'], list) and len(email['thread']) > 0:
            # Assuming thread is a list of strings (email bodies)
            body = ' '.join(email['thread']).lower()
        else:
            body = email.get('text', '').lower()  # fallback

        full_text = f"{subject} {body}"

        # Sentiment analysis
        pos_count = sum(1 for word in self.positive_words if word in full_text)
        neg_count = sum(1 for word in self.negative_words if word in full_text)
        if pos_count > neg_count:
            sentiment = 'positive'
        elif neg_count > pos_count:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'

        # Urgency analysis
        urgency = 'low'  # default
        if any(word in full_text for word in self.urgency_high):
            urgency = 'high'
        elif any(word in full_text for word in self.urgency_medium):
            urgency = 'medium'

        # Intent analysis
        intent_scores = {
            'inquiry': sum(1 for word in self.intent_inquiry if word in full_text),
            'complaint': sum(1 for word in self.intent_complaint if word in full_text),
            'request': sum(1 for word in self.intent_request if word in full_text),
            'feedback': sum(1 for word in self.intent_feedback if word in full_text)
        }
        # Determine the intent with the highest score; if tie, choose the first in order: inquiry, complaint, request, feedback
        intent_order = ['inquiry', 'complaint', 'request', 'feedback']
        max_score = 0
        selected_intent = 'other'
        for intent in intent_order:
            score = intent_scores[intent]
            if score > max_score:
                max_score = score
                selected_intent = intent
        intent = selected_intent

        # Suggested actions based on analysis
        suggested_actions = []
        if sentiment == 'negative' and urgency == 'high':
            suggested_actions.append('high_priority_negative')
        if intent == 'complaint':
            suggested_actions.append('handle_complaint')
        if intent == 'request' and urgency in ['high', 'medium']:
            suggested_actions.append('prompt_response')
        if sentiment == 'positive':
            suggested_actions.append('acknowledge_positive')

        # Reply-all suggestion: we suggest reply-all for negative sentiments, complaints, and high urgency
        # but this is just a suggestion; the final decision will be made by the responder's logic
        reply_all_suggested = (
            sentiment == 'negative' or
            intent == 'complaint' or
            urgency == 'high'
        )

        return {
            'sentiment': sentiment,
            'urgency': urgency,
            'intent': intent,
            'suggested_actions': suggested_actions,
            'reply_all_suggested': reply_all_suggested
        }


def analyze_email(email: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convenience function to analyze an email using the CaseAnalyzer.
    :param email: Dictionary containing email data
    :return: Analysis dictionary
    """
    analyzer = CaseAnalyzer()
    return analyzer.analyze(email)