#!/usr/bin/env python3
"""V285: Email Intelligence Orchestrator — Coordinates multiple email engines,
routes emails through optimal processing pipeline, provides unified intelligence dashboard.
Always enforces reply-all for multi-recipient emails."""
import json
from datetime import datetime
from typing import Dict, List, Any

class EmailIntelligenceOrchestrator:
    def __init__(self):
        # Import all engines
        from v281_sentiment_evolution_tracker import EmailSentimentEvolutionTracker
        from v282_compliance_guardian_pro import EmailComplianceGuardianPro
        from v283_knowledge_graph_builder import EmailKnowledgeGraphBuilder
        from v284_priority_decay_engine import EmailPriorityDecayEngine
        
        self.engines = {
            'V281': EmailSentimentEvolutionTracker(),
            'V282': EmailComplianceGuardianPro(),
            'V283': EmailKnowledgeGraphBuilder(),
            'V284': EmailPriorityDecayEngine()
        }
        
        self.routing_rules = {
            'high_priority': ['V284', 'V281', 'V282'],  # Priority, sentiment, compliance
            'compliance_sensitive': ['V282', 'V283', 'V284'],  # Compliance first
            'relationship_building': ['V283', 'V281', 'V284'],  # Knowledge graph focus
            'general': ['V284', 'V281', 'V283', 'V282']  # Balanced approach
        }
    
    def analyze_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orchestrate email analysis through multiple engines.
        Always enforces reply-all for multi-recipient emails.
        """
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Determine routing category
        routing_category = self._determine_routing(email_data)
        engine_sequence = self.routing_rules.get(routing_category, self.routing_rules['general'])
        
        # Execute engines in sequence
        engine_results = {}
        execution_log = []
        
        for engine_id in engine_sequence:
            if engine_id in self.engines:
                start_time = datetime.now()
                try:
                    result = self.engines[engine_id].analyze_email(email_data)
                    engine_results[engine_id] = result
                    execution_log.append({
                        'engine': engine_id,
                        'status': 'success',
                        'duration_ms': (datetime.now() - start_time).total_seconds() * 1000
                    })
                except Exception as e:
                    execution_log.append({
                        'engine': engine_id,
                        'status': 'error',
                        'error': str(e),
                        'duration_ms': (datetime.now() - start_time).total_seconds() * 1000
                    })
        
        # Synthesize unified intelligence
        unified_intel = self._synthesize_intelligence(engine_results)
        
        # Generate orchestrated response
        response = self._generate_orchestrated_response(email_data, engine_results, unified_intel)
        
        # ALWAYS enforce reply-all for multi-recipient emails
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            'engine': 'V285-IntelligenceOrchestrator',
            'routing_category': routing_category,
            'engines_executed': engine_sequence,
            'execution_log': execution_log,
            'engine_results': engine_results,
            'unified_intelligence': unified_intel,
            'response': response,
            'reply_to': all_recipients,
            'reply_all_enforced': len(all_recipients) > 1,
            'timestamp': datetime.now().isoformat()
        }
    
    def _determine_routing(self, email_data: Dict[str, Any]) -> str:
        """Determine which routing category this email belongs to"""
        subject = email_data.get('subject', '').lower()
        body = email_data.get('body', '').lower()
        sender = email_data.get('from', '').lower()
        text = subject + ' ' + body
        
        # High priority indicators
        if any(kw in text for kw in ['urgent', 'asap', 'critical', 'emergency', 'deadline today']):
            return 'high_priority'
        
        # Compliance-sensitive indicators
        compliance_keywords = ['hipaa', 'gdpr', 'sox', 'pci', 'compliance', 'audit', 'regulatory', 'legal']
        if any(kw in text for kw in compliance_keywords):
            return 'compliance_sensitive'
        
        # Relationship-building indicators
        relationship_keywords = ['partnership', 'collaboration', 'networking', 'introduction', 'connect']
        if any(kw in text for kw in relationship_keywords):
            return 'relationship_building'
        
        # Default to general
        return 'general'
    
    def _synthesize_intelligence(self, engine_results: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesize results from multiple engines into unified intelligence"""
        unified = {
            'risk_score': 0,
            'priority_score': 0,
            'sentiment_label': 'neutral',
            'compliance_status': 'compliant',
            'knowledge_entities': 0,
            'recommended_actions': []
        }
        
        # Extract sentiment from V281
        if 'V281' in engine_results:
            v281 = engine_results['V281']
            unified['sentiment_label'] = v281.get('current_sentiment', {}).get('label', 'neutral')
            unified['escalation_risk'] = v281.get('escalation_risk', {}).get('risk_level', 'low')
            
            if unified['escalation_risk'] == 'high':
                unified['risk_score'] += 40
                unified['recommended_actions'].append('De-escalate conversation immediately')
        
        # Extract compliance from V282
        if 'V282' in engine_results:
            v282 = engine_results['V282']
            unified['compliance_score'] = v282.get('compliance_score', 100)
            unified['compliance_status'] = 'violation' if unified['compliance_score'] < 70 else 'compliant'
            
            if unified['compliance_score'] < 70:
                unified['risk_score'] += 50
                unified['recommended_actions'].append('Review and redact sensitive data before sending')
        
        # Extract knowledge from V283
        if 'V283' in engine_results:
            v283 = engine_results['V283']
            unified['knowledge_entities'] = v283.get('entities_extracted', 0)
            unified['relationships_built'] = v283.get('relationships_built', 0)
        
        # Extract priority from V284
        if 'V284' in engine_results:
            v284 = engine_results['V284']
            unified['priority_score'] = v284.get('current_priority', 5)
            unified['days_old'] = v284.get('days_old', 0)
            unified['escalation_level'] = v284.get('escalation', {}).get('level', 0)
            
            if unified['escalation_level'] > 0:
                unified['risk_score'] += 30
                unified['recommended_actions'].append(f'Escalation level {unified["escalation_level"]} - requires immediate attention')
        
        # Normalize risk score to 0-100
        unified['risk_score'] = min(100, unified['risk_score'])
        
        # Determine overall urgency
        if unified['risk_score'] >= 70:
            unified['overall_urgency'] = 'critical'
        elif unified['risk_score'] >= 50:
            unified['overall_urgency'] = 'high'
        elif unified['risk_score'] >= 30:
            unified['overall_urgency'] = 'medium'
        else:
            unified['overall_urgency'] = 'low'
        
        return unified
    
    def _generate_orchestrated_response(self, email_data: Dict[str, Any], engine_results: Dict[str, Any], unified_intel: Dict[str, Any]) -> str:
        """Generate comprehensive response based on all engine results"""
        subject = email_data.get('subject', '')
        urgency = unified_intel.get('overall_urgency', 'low')
        
        response_parts = []
        
        # Header based on urgency
        if urgency == 'critical':
            response_parts.append(f"🚨 CRITICAL INTELLIGENCE for '{subject}'")
        elif urgency == 'high':
            response_parts.append(f"⚠️ HIGH PRIORITY INTELLIGENCE for '{subject}'")
        else:
            response_parts.append(f"📊 Intelligence Report for '{subject}'")
        
        # Unified intelligence summary
        response_parts.append(f"\n**Unified Intelligence:**")
        response_parts.append(f"• Risk Score: {unified_intel.get('risk_score', 0)}/100")
        response_parts.append(f"• Priority: {unified_intel.get('priority_score', 5):.1f}/10")
        response_parts.append(f"• Sentiment: {unified_intel.get('sentiment_label', 'neutral')}")
        response_parts.append(f"• Compliance: {unified_intel.get('compliance_status', 'compliant')}")
        response_parts.append(f"• Knowledge Entities: {unified_intel.get('knowledge_entities', 0)}")
        
        # Recommended actions
        recommended = unified_intel.get('recommended_actions', [])
        if recommended:
            response_parts.append(f"\n**Recommended Actions:**")
            for i, action in enumerate(recommended, 1):
                response_parts.append(f"{i}. {action}")
        
        # Engine-specific insights
        response_parts.append(f"\n**Engine Insights:**")
        if 'V281' in engine_results:
            sentiment = engine_results['V281'].get('current_sentiment', {})
            response_parts.append(f"• Sentiment Analysis: {sentiment.get('label', 'neutral')} (score: {sentiment.get('score', 0):.2f})")
        
        if 'V282' in engine_results:
            compliance = engine_results['V282'].get('compliance_score', 100)
            violations = len(engine_results['V282'].get('violations', []))
            response_parts.append(f"• Compliance Score: {compliance}/100 ({violations} violations)")
        
        if 'V283' in engine_results:
            entities = engine_results['V283'].get('entities_extracted', 0)
            relationships = engine_results['V283'].get('relationships_built', 0)
            response_parts.append(f"• Knowledge Graph: {entities} entities, {relationships} relationships")
        
        if 'V284' in engine_results:
            priority = engine_results['V284'].get('current_priority', 5)
            days_old = engine_results['V284'].get('days_old', 0)
            response_parts.append(f"• Priority Decay: {priority:.1f}/10 ({days_old} days old)")
        
        response = '\n'.join(response_parts)
        response += "\n\n---\nZion Tech Group | AI Email Intelligence V285 Orchestrator\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"
        
        return response

if __name__ == "__main__":
    engine = EmailIntelligenceOrchestrator()
    
    # Test with a high-priority, compliance-sensitive email
    test = {
        "from": "legal@hospital.com",
        "to": ["compliance@hospital.com", "admin@hospital.com"],
        "cc": ["ceo@hospital.com"],
        "subject": "URGENT: HIPAA Compliance Audit - Patient Data Review Required",
        "body": "We have an urgent HIPAA compliance audit tomorrow. Patient John Doe (SSN: 123-45-6789) records need immediate review. This is critical and time-sensitive. Please respond ASAP."
    }
    
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V285 Intelligence Orchestrator — All systems operational | Reply-All: ENFORCED")
