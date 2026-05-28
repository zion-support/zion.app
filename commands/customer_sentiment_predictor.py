#!/usr/bin/env python3
"""Customer Sentiment Predictor - Forecast client satisfaction trends"""
import sys, json
from pathlib import Path
from datetime import datetime, timezone
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')
try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def telegram_send(t): print(f"[TG] {t}")

PREDICT_LOG = Path('/root/.openclaw/workspace/zion.app/data/sentiment_predictions.json')

def predict_sentiment(limit=50):
    """Analyze email sentiment and predict trends."""
    emails = gmail_search('from:client OR from:customer', limit=limit)
    sentiments = {'positive': 0, 'neutral': 0, 'negative': 0}
    for e in emails:
        msg = gmail_get(e['id'])
        text = msg.get('snippet', '').lower()
        if any(w in text for w in ['great', 'excellent', 'thank', 'success']):
            sentiments['positive'] += 1
        elif any(w in text for w in ['issue', 'problem', 'concern', 'delay']):
            sentiments['negative'] += 1
        else:
            sentiments['neutral'] += 1
    return sentiments

def main(execute=True):
    print("📈 Customer Sentiment Predictor - Analyzing...")
    sentiments = predict_sentiment()
    PREDICT_LOG.write_text(json.dumps(sentiments, indent=2))
    if execute:
        telegram_send(f"📈 Sentiment: {sentiments}")
    return sentiments
