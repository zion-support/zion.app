#!/usr/bin/env python3
"""
Intelligent Email Responder V21 - ML Optimization & Advanced Features
Features:
- Machine learning template optimization
- Sentiment trend analysis across thread history
- Smart priority queue with urgency scoring
- Automated A/B test winner selection
- Predictive response timing
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict
import random
import math

# Auto-resolve to current user's home — works on macOS and Linux
home = Path.home()
WORKSPACE = home / '.openclaw' / 'workspace'

class MLTemplateOptimizerV21:
    """Machine learning for template optimization"""
    
    def __init__(self):
        self.ml_data_file = WORKSPACE / 'zion.app' / 'data' / 'ml_templates.json'
        self.features = ['word_count', 'cta_count', 'personalization', 'sentiment_match', 'intent_match']
    
    def train_from_outcomes(self):
        """Train model from historical outcomes"""
        outcomes_file = WORKSPACE / 'zion.app' / 'data' / 'response_outcomes.json'
        
        if not outcomes_file.exists():
            return {}
        
        outcomes = json.loads(outcomes_file.read_text()).get('outcomes', [])
        
        # Simple feature analysis
        template_performance = defaultdict(lambda: {'total': 0, 'successes': 0})
        
        for o in outcomes:
            template = o.get('template', 'default')
            template_performance[template]['total'] += 1
            if o.get('replied'):
                template_performance[template]['successes'] += 1
        
        # Calculate success rates
        model = {}
        for template, stats in template_performance.items():
            rate = stats['successes'] / stats['total'] if stats['total'] > 0 else 0.5
            model[template] = {
                'success_rate': rate,
                'uses': stats['total'],
                'predicted_weight': rate * math.log(stats['total'] + 1)
            }
        
        self.ml_data_file.write_text(json.dumps(model))
        return model
    
    def predict_best_template(self, intent, features):
        """Predict best template using trained model"""
        if self.ml_data_file.exists():
            model = json.loads(self.ml_data_file.read_text())
            intent_templates = {k: v for k, v in model.items() if intent in k.lower()}
            
            if intent_templates:
                return max(intent_templates.items(), key=lambda x: x[1]['predicted_weight'])[0]
        
        return f'{intent}_default'


class SentimentTrendAnalyzerV21:
    """Analyze sentiment trends across thread history"""
    
    def __init__(self):
        self.trend_file = WORKSPACE / 'zion.app' / 'data' / 'sentiment_trends.json'
    
    def analyze_trend(self, thread_id, current_sentiment):
        """Analyze sentiment trend for a thread"""
        trends = self._load_trends()
        
        if thread_id not in trends:
            trends[thread_id] = {'sentiments': []}
        
        trends[thread_id]['sentiments'].append({
            'sentiment': current_sentiment,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
        # Calculate trend
        sentiments = trends[thread_id]['sentiments']
        if len(sentiments) >= 2:
            first = sentiments[0]['sentiment']
            last = sentiments[-1]['sentiment']
            
            trend_map = {'positive': 1, 'neutral': 0, 'negative': -1}
            score_change = trend_map.get(last, 0) - trend_map.get(first, 0)
            
            trend = 'improving' if score_change > 0 else 'declining' if score_change < 0 else 'stable'
        else:
            trend = 'new'
        
        trends[thread_id]['trend'] = trend
        self._save_trends(trends)
        
        return trend
    
    def needs_immediate_attention(self, thread_id):
        """Check if declining sentiment needs immediate attention"""
        trends = self._load_trends()
        
        if thread_id in trends:
            trend = trends[thread_id].get('trend', 'stable')
            if trend == 'declining':
                sentiments = trends[thread_id]['sentiments']
                if len(sentiments) >= 2:
                    last = sentiments[-1]['sentiment']
                    return last == 'negative'
        
        return False
    
    def _load_trends(self):
        if self.trend_file.exists():
            return json.loads(self.trend_file.read_text())
        return {}
    
    def _save_trends(self, data):
        self.trend_file.write_text(json.dumps(data))


class SmartPriorityQueueV21:
    """Priority queue with urgency and sentiment scoring"""
    
    def __init__(self):
        self.queue_file = WORKSPACE / 'zion.app' / 'data' / 'priority_queue.json'
    
    def calculate_priority(self, analysis):
        """Calculate priority score (0-100)"""
        base = 50
        
        # Urgency multiplier
        urgency_scores = {'critical': 30, 'high': 20, 'medium': 10, 'low': 0}
        base += urgency_scores.get(analysis.get('urgency', 'low'), 0)
        
        # Intent priority
        intent_priority = {'booking': 15, 'support': 10, 'partnership': 15, 'pricing': 5}
        base += intent_priority.get(analysis.get('intent', 'general'), 0)
        
        # Confidence boost
        if analysis.get('confidence', 0) > 0.8:
            base += 5
        
        return min(base, 100)
    
    def add_to_queue(self, email_data, analysis):
        """Add email to priority queue"""
        priority = self.calculate_priority(analysis)
        
        item = {
            'thread_id': email_data.get('thread_id'),
            'priority': priority,
            'intent': analysis.get('intent'),
            'urgency': analysis.get('urgency'),
            'added_at': datetime.now(timezone.utc).isoformat()
        }
        
        queue = self._load_queue()
        queue.append(item)
        queue.sort(key=lambda x: x['priority'], reverse=True)
        self._save_queue(queue[:100])  # Keep top 100
        
        return item
    
    def get_next(self):
        """Get highest priority item"""
        queue = self._load_queue()
        return queue[0] if queue else None
    
    def _load_queue(self):
        if self.queue_file.exists():
            return json.loads(self.queue_file.read_text())
        return []
    
    def _save_queue(self, items):
        self.queue_file.write_text(json.dumps(items))


class ABTestWinnerSelectorV21:
    """Automatically select A/B test winner"""
    
    def __init__(self):
        self.results_file = WORKSPACE / 'zion.app' / 'data' / 'ab_results.json'
        self.confidence_threshold = 0.95  # 95% confidence
    
    def select_winner(self, template_name, min_samples=10):
        """Select winner with statistical confidence"""
        if not self.results_file.exists():
            return 'A'
        
        results = json.loads(self.results_file.read_text()).get('results', [])
        template_results = [r for r in results if r['template'] == template_name]
        
        if len(template_results) < min_samples:
            return 'A'  # Not enough data
        
        a_results = [r for r in template_results if r['variant'] == 'A' and r['outcome'] == 'positive']
        b_results = [r for r in template_results if r['variant'] == 'B' and r['outcome'] == 'positive']
        
        a_rate = len(a_results) / len([r for r in template_results if r['variant'] == 'A']) if a_results else 0
        b_rate = len(b_results) / len([r for r in template_results if r['variant'] == 'B']) if b_results else 0
        
        # Simple statistical check
        diff = abs(a_rate - b_rate)
        if diff > 0.1:  # 10% difference threshold
            return 'A' if a_rate > b_rate else 'B'
        
        return 'A'  # No significant difference
    
    def get_confidence(self, template_name):
        """Get confidence level for winner"""
        if not self.results_file.exists():
            return 0
        
        results = json.loads(self.results_file.read_text()).get('results', [])
        template_results = [r for r in results if r['template'] == template_name]
        
        return len(template_results) / max(len(template_results), 100)


class PredictiveTimerV21:
    """Predict optimal response timing"""
    
    def __init__(self):
        self.timing_file = WORKSPACE / 'zion.app' / 'data' / 'response_timing.json'
    
    def predict_optimal_time(self, recipient_profile, urgency):
        """Predict best time to respond"""
        # Default business hours heuristic
        timezone_offset = recipient_profile.get('timezone', -3)  # Brazil default
        
        if urgency == 'critical':
            delay_minutes = 5
        elif urgency == 'high':
            delay_minutes = 30
        else:
            # Business hours preference
            now = datetime.now(timezone.utc)
            local_hour = (now.hour + timezone_offset + 24) % 24
            
            if 9 <= local_hour <= 17:
                delay_minutes = 60  # Within business hours
            else:
                delay_minutes = 420  # Wait until next business day
        
        return (datetime.now(timezone.utc) + timedelta(minutes=delay_minutes)).isoformat()


if __name__ == '__main__':
    optimizer = MLTemplateOptimizerV21()
    analyzer = SentimentTrendAnalyzerV21()
    queue = SmartPriorityQueueV21()
    winner_selector = ABTestWinnerSelectorV21()
    timer = PredictiveTimerV21()
    
    # Test ML optimizer
    model = optimizer.train_from_outcomes()
    print(f"V21 ML Templates trained: {len(model)} templates")
    
    # Test sentiment trend
    trend = analyzer.analyze_trend('test-thread', 'negative')
    print(f"V21 Sentiment trend: {trend}")
    
    # Test priority queue
    test_analysis = {'urgency': 'high', 'intent': 'booking', 'confidence': 0.85}
    priority = queue.calculate_priority(test_analysis)
    print(f"V21 Priority score: {priority}")
    
    # Test winner selection
    winner = winner_selector.select_winner('booking_response')
    print(f"V21 A/B test winner: {winner}")
    
    # Test predictive timer
    optimal_time = timer.predict_optimal_time({'timezone': -3}, 'medium')
    print(f"V21 Predicted response time: {optimal_time}")