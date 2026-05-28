#!/usr/bin/env python3
"""
ML Template Optimizer V21 — extracted from intelligent_email_responder_v22.py
Trains on historical outcomes and predicts best template by intent.
"""

import json, math
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')

class MLTemplateOptimizerV21:
    def __init__(self):
        self.ml_data_file = WORKSPACE / 'zion.app' / 'data' / 'ml_templates.json'

    def train_from_outcomes(self):
        """Load outcomes → build per-template success-rate model."""
        outcomes_file = WORKSPACE / 'zion.app' / 'data' / 'response_outcomes.json'
        if not outcomes_file.exists():
            return {}
        try:
            outcomes = json.loads(outcomes_file.read_text()).get('outcomes', [])
        except Exception:
            outcomes = []
        tp = defaultdict(lambda: {'total': 0, 'successes': 0})
        for o in outcomes:
            t = o.get('template', 'default')
            tp[t]['total'] += 1
            if o.get('replied'):
                tp[t]['successes'] += 1
        model = {}
        for t, s in tp.items():
            rate = s['successes'] / s['total'] if s['total'] > 0 else 0.5
            model[t] = {
                'success_rate': rate,
                'uses': s['total'],
                'predicted_weight': rate * math.log(s['total'] + 1),
                'successes': s['successes'],
            }
        self.ml_data_file.write_text(json.dumps(model, indent=2))
        return model

    def predict_best_template(self, intent, features=None):
        if self.ml_data_file.exists():
            model = json.loads(self.ml_data_file.read_text())
            it = {k: v for k, v in model.items() if intent.lower() in k.lower()}
            if it:
                return max(it.items(), key=lambda x: x[1]['predicted_weight'])[0]
        return f'{intent}_default'

    def get_weights(self):
        if self.ml_data_file.exists():
            return json.loads(self.ml_data_file.read_text())
        return {}

    def pick_template(self, intent_category, formality='neutral',
                      urgency_score=3, weights=None):
        weights = weights or self.get_weights()
        best_label = self.predict_best_template(intent_category, {'formality': formality, 'urgency': urgency_score})
        return best_label
