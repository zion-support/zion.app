#!/usr/bin/env python3
"""V215 - AI Email Negotiation Strategist
Analyze negotiation emails in real-time, suggest optimal counter-offers,
detect anchoring tactics, track concession patterns, and provide
strategic recommendations based on game theory.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple

@dataclass
class NegotiationSignal:
    signal_type: str  # "anchor", "concession", "deadline", "ultimatum", "walk_away"
    content: str
    strength: float  # 0.0 to 1.0
    counter_tactic: str

@dataclass
class NegotiationState:
    thread_id: str
    current_phase: str  # "opening", "bargaining", "closing", "deadlock"
    our_position: Dict
    their_position: Dict
    signals_detected: List[NegotiationSignal]
    leverage_score: float  # -1.0 (they have leverage) to 1.0 (we have leverage)
    recommended_action: str
    optimal_counter: Optional[Dict]
    batna_assessment: str  # Best Alternative To Negotiated Agreement

class TacticDetector:
    """Detect negotiation tactics in email content."""
    
    TACTICS = {
        "anchoring": {
            "patterns": [r"\$[\d,]+", r"budget (?:is|of|at) \$?[\d,]+", r"(?:quote|price|offer) (?:of|is|at) \$?[\d,]+"],
            "description": "Setting initial price reference point",
            "counter": "Re-anchor with your own number or question the basis of their anchor"
        },
        "deadline_pressure": {
            "patterns": [r"(?:by|before|until|deadline)\s+(?:today|tomorrow|Friday|EOD|COB|next week|\d{1,2}/\d{1,2})",
                        r"(?:expires|valid|offer ends)", r"(?:limited time|act now|last chance)"],
            "description": "Creating artificial time pressure",
            "counter": "Verify urgency is real. Propose alternative timeline if needed."
        },
        "ultimatum": {
            "patterns": [r"(?:final|last) offer", r"take it or leave it", r"non-negotiable",
                        r"(?:or else|otherwise) we (?:will|shall|must)"],
            "description": "Ultimatum or take-it-or-leave-it tactic",
            "counter": "Test the ultimatum. Most are bluff. Ask what happens if we don't agree."
        },
        "flinch": {
            "patterns": [r"(?:way too|far too|absurdly|ridiculously) (?:high|expensive|much)",
                        r"(?:shocked|surprised|stunned) (?:by|at) (?:the|that|this) (?:price|number|quote)"],
            "description": "Exaggerated negative reaction to create doubt",
            "counter": "Don't immediately concede. Ask what specifically concerns them."
        },
        "nibble": {
            "patterns": [r"(?:just|also|additionally|one more thing) (?:include|add|throw in|can we get)",
                        r"(?:small|little|minor) (?:addition|request|favor)"],
            "description": "Small additional requests after main agreement",
            "counter": "Bundle all requests before final agreement. Each nibble should have a trade-off."
        },
        "walk_away": {
            "patterns": [r"(?:exploring|evaluating|considering) (?:alternatives|other options|competitors|other vendors)",
                        r"(?:might|may|will) (?:go with|choose|select) (?:another|different|someone else)",
                        r"(?:not sure|unsure) (?:if|whether) we (?:can|should) (?:continue|proceed)"],
            "description": "Signaling willingness to walk away",
            "counter": "Assess BATNA. If real, consider value-add rather than price concession."
        },
        "concession": {
            "patterns": [r"(?:can|could|would) (?:do|offer|provide|accept) \$?[\d,]+",
                        r"(?:willing to|prepared to|happy to) (?:reduce|lower|adjust|meet)",
                        r"(?:discount|reduction|concession) (?:of|at) \$?\d+%?"],
            "description": "Making a concession or offer",
            "counter": "Extract maximum value from their concession. Never accept first offer."
        },
    }
    
    def detect(self, text: str) -> List[NegotiationSignal]:
        signals = []
        for tactic_name, tactic_info in self.TACTICS.items():
            for pattern in tactic_info["patterns"]:
                matches = re.findall(pattern, text, re.IGNORECASE)
                if matches:
                    strength = min(1.0, len(matches) * 0.4)
                    signals.append(NegotiationSignal(
                        signal_type=tactic_name,
                        content=matches[0][:100],
                        strength=strength,
                        counter_tactic=tactic_info["counter"]
                    ))
                    break
        return signals

class LeverageAnalyzer:
    """Analyze who has leverage in the negotiation."""
    
    def analyze(self, signals: List[NegotiationSignal], phase: str) -> float:
        leverage = 0.0
        
        # Their tactics reduce our leverage
        for signal in signals:
            if signal.signal_type in ("walk_away", "ultimatum"):
                leverage -= signal.strength * 0.3
            elif signal.signal_type == "concession":
                leverage += signal.strength * 0.2
            elif signal.signal_type == "anchoring":
                leverage -= signal.strength * 0.1
        
        # Phase affects leverage
        if phase == "opening":
            leverage += 0.1  # First mover advantage
        elif phase == "deadlock":
            leverage -= 0.2  # Both sides losing
        
        return max(-1.0, min(1.0, leverage))

class NegotiationStrategist:
    """Main negotiation strategy engine."""
    
    def __init__(self):
        self.tactic_detector = TacticDetector()
        self.leverage_analyzer = LeverageAnalyzer()
    
    def analyze_thread(self, thread_id: str, messages: List[Dict],
                       recipients: List[str] = None) -> Dict:
        all_signals = []
        our_offers = []
        their_offers = []
        
        for msg in messages:
            body = msg.get("body", "")
            sender = msg.get("from", "")
            
            signals = self.tactic_detector.detect(body)
            all_signals.extend(signals)
            
            # Extract numeric offers
            numbers = re.findall(r'\$([\d,]+(?:\.\d{2})?)', body)
            for num in numbers:
                try:
                    value = float(num.replace(",", ""))
                    if "zion" in sender.lower() or "our" in sender.lower():
                        our_offers.append(value)
                    else:
                        their_offers.append(value)
                except ValueError:
                    pass
        
        # Determine phase
        msg_count = len(messages)
        if msg_count <= 2:
            phase = "opening"
        elif any(s.signal_type == "ultimatum" for s in all_signals):
            phase = "deadlock"
        elif any(s.signal_type == "concession" for s in all_signals):
            phase = "bargaining"
        else:
            phase = "closing" if msg_count > 6 else "bargaining"
        
        leverage = self.leverage_analyzer.analyze(all_signals, phase)
        
        # BATNA assessment
        walk_away_signals = [s for s in all_signals if s.signal_type == "walk_away"]
        if walk_away_signals:
            batna = "They have alternatives - strengthen our unique value proposition"
        else:
            batna = "No clear alternatives detected - maintain current position"
        
        # Generate recommendation
        if leverage > 0.3:
            recommendation = "Strong position: hold firm on price, offer value-adds instead of discounts"
        elif leverage > 0:
            recommendation = "Slight advantage: make small concession to close, tie to their commitment"
        elif leverage > -0.3:
            recommendation = "Balanced: find creative middle ground, focus on mutual value"
        else:
            recommendation = "Weak position: understand their core needs, reframe around value not price"
        
        # Optimal counter-offer
        counter = None
        if their_offers and our_offers:
            their_latest = their_offers[-1]
            our_latest = our_offers[-1]
            midpoint = (their_latest + our_latest) / 2
            counter = {
                "suggested_price": round(midpoint, 2),
                "their_latest": their_latest,
                "our_latest": our_latest,
                "rationale": f"Midpoint between positions: ${midpoint:,.2f}"
            }
        
        reply_all = len(recipients or []) > 1
        
        return {
            "thread_id": thread_id,
            "phase": phase,
            "leverage_score": round(leverage, 2),
            "signals_detected": [{"type": s.signal_type, "content": s.content,
                                  "strength": round(s.strength, 2), "counter": s.counter_tactic}
                                 for s in all_signals],
            "batna": batna,
            "recommendation": recommendation,
            "counter_offer": counter,
            "reply_all_required": reply_all,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    strategist = NegotiationStrategist()
    sample = [
        {"from": "client@acme.com", "body": "Our budget is $80,000 for this project. That's our firm number."},
        {"from": "sales@zion.com", "body": "We can offer the full solution at $120,000 with premium support included."},
        {"from": "client@acme.com", "body": "That's way too high. We're shocked at that price. We're evaluating two other vendors who quoted $75,000."},
        {"from": "sales@zion.com", "body": "We understand the concern. We can reduce to $105,000 if you commit to a 2-year term."},
        {"from": "client@acme.com", "body": "Final offer: $85,000 or we go with the alternative. This is non-negotiable. We need an answer by Friday."},
    ]
    result = strategist.analyze_thread("neg-001", sample, ["client@acme.com", "sales@zion.com", "vp@zion.com"])
    print(json.dumps(result, indent=2))
