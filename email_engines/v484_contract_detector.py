#!/usr/bin/env python3
"""
V484 - Email Contract and Agreement Detector
Identify contracts, agreements, commitments, and legal obligations in emails.
Features: Contract detection, commitment extraction, obligation tracking, legal clause identification.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any


class EmailContractAgreementDetector:
    """Detect contracts, agreements, and commitments in emails."""
    
    CONTRACT_INDICATORS = [
        'contract', 'agreement', 'proposal', 'terms', 'conditions',
        'offer', 'acceptance', 'binding', 'legal', 'signature'
    ]
    
    COMMITMENT_INDICATORS = [
        'will', 'shall', 'commit', 'promise', 'guarantee', 'ensure',
        'agree to', 'undertake', 'obligated', 'responsible for'
    ]
    
    OBLIGATION_INDICATORS = [
        'must', 'required', 'mandatory', 'obligation', 'duty',
        'shall', 'need to', 'have to', 'expected to'
    ]
    
    DEADLINE_INDICATORS = [
        'by', 'before', 'deadline', 'due', 'no later than',
        'by end of', 'by close of business', 'eod', 'cob'
    ]
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for contracts, agreements, and commitments."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        attachments = email.get('attachments', [])
        
        # Detect contract/agreement presence
        contract_detection = self._detect_contract(body, subject, attachments)
        
        # Extract commitments
        commitments = self._extract_commitments(body)
        
        # Extract obligations
        obligations = self._extract_obligations(body)
        
        # Extract deadlines
        deadlines = self._extract_deadlines(body)
        
        # Identify legal clauses
        legal_clauses = self._identify_legal_clauses(body)
        
        # Calculate risk level
        risk_assessment = self._assess_risk(contract_detection, commitments, obligations)
        
        # Generate summary
        summary = self._generate_summary(
            contract_detection, commitments, obligations, deadlines, risk_assessment
        )
        
        # Generate action items
        action_items = self._generate_action_items(
            commitments, obligations, deadlines, risk_assessment
        )
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V484_EmailContractAgreementDetector',
            'contract_detection': contract_detection,
            'commitments': commitments,
            'obligations': obligations,
            'deadlines': deadlines,
            'legal_clauses': legal_clauses,
            'risk_assessment': risk_assessment,
            'summary': summary,
            'action_items': action_items,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_contract(self, body: str, subject: str, attachments: List[Dict]) -> Dict:
        """Detect if email contains contract or agreement."""
        text = (body + ' ' + subject).lower()
        
        # Check for contract indicators
        indicators_found = []
        for indicator in self.CONTRACT_INDICATORS:
            if indicator in text:
                indicators_found.append(indicator)
        
        # Check attachments for contracts
        contract_attachments = []
        for attachment in attachments:
            filename = attachment.get('filename', '').lower()
            if any(word in filename for word in ['contract', 'agreement', 'proposal', 'terms']):
                contract_attachments.append(attachment['filename'])
        
        has_contract = len(indicators_found) > 0 or len(contract_attachments) > 0
        
        # Determine contract type
        if 'proposal' in text or 'offer' in text:
            contract_type = 'proposal'
            status = 'pending_acceptance'
        elif 'acceptance' in text or 'accepted' in text or 'approved' in text:
            contract_type = 'accepted_agreement'
            status = 'accepted'
        elif 'contract' in text or 'agreement' in text:
            contract_type = 'contract'
            status = 'under_review'
        else:
            contract_type = 'informal_agreement'
            status = 'informal'
        
        # Check for signature requirement
        requires_signature = any(word in text for word in ['sign', 'signature', 'execute', 'signed'])
        
        return {
            'has_contract': has_contract,
            'contract_type': contract_type,
            'status': status,
            'indicators': indicators_found,
            'contract_attachments': contract_attachments,
            'requires_signature': requires_signature,
            'confidence': min(1.0, len(indicators_found) * 0.2 + len(contract_attachments) * 0.3)
        }
    
    def _extract_commitments(self, body: str) -> List[Dict]:
        """Extract commitments from email."""
        commitments = []
        
        # Split into sentences
        sentences = re.split(r'[.!?]+', body)
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            sentence_lower = sentence.lower()
            
            # Check for commitment indicators
            for indicator in self.COMMITMENT_INDICATORS:
                if indicator in sentence_lower:
                    # Extract who is committing
                    committer = self._extract_committer(sentence)
                    
                    # Extract what is being committed
                    commitment_text = self._extract_commitment_text(sentence, indicator)
                    
                    # Extract deadline if present
                    deadline = self._extract_deadline_from_text(sentence)
                    
                    commitments.append({
                        'text': sentence,
                        'committer': committer,
                        'commitment': commitment_text,
                        'indicator': indicator,
                        'deadline': deadline,
                        'confidence': 0.8
                    })
                    break  # Only capture first indicator per sentence
        
        return commitments
    
    def _extract_committer(self, sentence: str) -> str:
        """Extract who is making the commitment."""
        # Look for "I will", "We will", "The team will", etc.
        patterns = [
            r'\b(I|we|the team|our team|I\'ll|we\'ll)\b',
            r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:will|shall|commit)',
            r'\b(he|she|they)\s+(?:will|shall)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, sentence, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return 'Unknown'
    
    def _extract_commitment_text(self, sentence: str, indicator: str) -> str:
        """Extract the actual commitment text."""
        # Find text after the indicator
        indicator_pos = sentence.lower().find(indicator)
        if indicator_pos >= 0:
            commitment_part = sentence[indicator_pos + len(indicator):].strip()
            # Clean up
            commitment_part = re.sub(r'^[\s,]+', '', commitment_part)
            return commitment_part[:100]  # Limit length
        
        return sentence
    
    def _extract_deadline_from_text(self, text: str) -> Optional[str]:
        """Extract deadline from text."""
        # Look for deadline patterns
        for indicator in self.DEADLINE_INDICATORS:
            if indicator in text.lower():
                # Extract the deadline phrase
                pattern = rf'{indicator}\s+([^.!?]+)'
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
        
        return None
    
    def _extract_obligations(self, body: str) -> List[Dict]:
        """Extract obligations from email."""
        obligations = []
        
        # Split into sentences
        sentences = re.split(r'[.!?]+', body)
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            sentence_lower = sentence.lower()
            
            # Check for obligation indicators
            for indicator in self.OBLIGATION_INDICATORS:
                if indicator in sentence_lower:
                    # Extract who has the obligation
                    obligated_party = self._extract_committer(sentence)
                    
                    # Extract the obligation
                    obligation_text = self._extract_commitment_text(sentence, indicator)
                    
                    obligations.append({
                        'text': sentence,
                        'obligated_party': obligated_party,
                        'obligation': obligation_text,
                        'indicator': indicator,
                        'mandatory': indicator in ['must', 'required', 'mandatory'],
                        'confidence': 0.85
                    })
                    break
        
        return obligations
    
    def _extract_deadlines(self, body: str) -> List[Dict]:
        """Extract deadlines from email."""
        deadlines = []
        
        # Split into sentences
        sentences = re.split(r'[.!?]+', body)
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            sentence_lower = sentence.lower()
            
            # Check for deadline indicators
            for indicator in self.DEADLINE_INDICATORS:
                if indicator in sentence_lower:
                    # Extract deadline text
                    deadline_text = self._extract_deadline_from_text(sentence)
                    
                    if deadline_text:
                        deadlines.append({
                            'text': sentence,
                            'deadline': deadline_text,
                            'indicator': indicator,
                            'confidence': 0.75
                        })
                    break
        
        return deadlines
    
    def _identify_legal_clauses(self, body: str) -> List[Dict]:
        """Identify legal clauses in email."""
        clauses = []
        
        legal_terms = {
            'confidentiality': ['confidential', 'nda', 'non-disclosure', 'proprietary'],
            'liability': ['liability', 'indemnification', 'hold harmless', 'damages'],
            'termination': ['termination', 'cancel', 'terminate', 'end date'],
            'payment': ['payment', 'invoice', 'billing', 'fee', 'price', 'cost'],
            'warranty': ['warranty', 'guarantee', 'assurance'],
            'intellectual_property': ['intellectual property', 'copyright', 'trademark', 'patent']
        }
        
        body_lower = body.lower()
        
        for clause_type, terms in legal_terms.items():
            for term in terms:
                if term in body_lower:
                    # Find context
                    pattern = rf'[^.!?]*{term}[^.!?]*[.!?]'
                    matches = re.finditer(pattern, body, re.IGNORECASE)
                    
                    for match in matches:
                        clauses.append({
                            'type': clause_type,
                            'term': term,
                            'context': match.group(0).strip(),
                            'confidence': 0.8
                        })
        
        return clauses
    
    def _assess_risk(self, contract_detection: Dict, commitments: List[Dict],
                    obligations: List[Dict]) -> Dict:
        """Assess risk level of the email."""
        risk_score = 0
        risk_factors = []
        
        # Contract presence increases risk
        if contract_detection['has_contract']:
            risk_score += 30
            risk_factors.append('Contains contract/agreement')
            
            if contract_detection['requires_signature']:
                risk_score += 20
                risk_factors.append('Requires signature')
        
        # Multiple commitments increase risk
        if len(commitments) > 3:
            risk_score += 15
            risk_factors.append(f'Multiple commitments ({len(commitments)})')
        
        # Mandatory obligations increase risk
        mandatory_obligations = [o for o in obligations if o.get('mandatory')]
        if mandatory_obligations:
            risk_score += len(mandatory_obligations) * 10
            risk_factors.append(f'Mandatory obligations ({len(mandatory_obligations)})')
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = 'high'
        elif risk_score >= 40:
            risk_level = 'medium'
        elif risk_score >= 20:
            risk_level = 'low'
        else:
            risk_level = 'minimal'
        
        return {
            'risk_score': risk_score,
            'risk_level': risk_level,
            'risk_factors': risk_factors,
            'requires_review': risk_level in ['high', 'medium'],
            'requires_legal_review': risk_level == 'high' and contract_detection['has_contract']
        }
    
    def _generate_summary(self, contract_detection: Dict, commitments: List[Dict],
                         obligations: List[Dict], deadlines: List[Dict],
                         risk_assessment: Dict) -> str:
        """Generate human-readable summary."""
        summary_parts = []
        
        if contract_detection['has_contract']:
            summary_parts.append(
                f"This email contains a {contract_detection['contract_type']} "
                f"(status: {contract_detection['status']})"
            )
        
        if commitments:
            summary_parts.append(f"{len(commitments)} commitment(s) identified")
        
        if obligations:
            summary_parts.append(f"{len(obligations)} obligation(s) identified")
        
        if deadlines:
            summary_parts.append(f"{len(deadlines)} deadline(s) mentioned")
        
        summary_parts.append(f"Risk level: {risk_assessment['risk_level']}")
        
        if risk_assessment['requires_legal_review']:
            summary_parts.append("⚠️ Legal review recommended")
        
        return '. '.join(summary_parts) + '.'
    
    def _generate_action_items(self, commitments: List[Dict], obligations: List[Dict],
                              deadlines: List[Dict], risk_assessment: Dict) -> List[str]:
        """Generate action items based on analysis."""
        actions = []
        
        # Based on risk
        if risk_assessment['requires_legal_review']:
            actions.append('⚖️ Send to legal team for review')
        elif risk_assessment['requires_review']:
            actions.append('👁️ Review carefully before responding')
        
        # Based on commitments
        if commitments:
            actions.append(f'📋 Track {len(commitments)} commitment(s) made')
            for i, commitment in enumerate(commitments[:3], 1):
                actions.append(f'  {i}. {commitment["committer"]}: {commitment["commitment"][:50]}...')
        
        # Based on obligations
        if obligations:
            mandatory = [o for o in obligations if o.get('mandatory')]
            if mandatory:
                actions.append(f'⚠️ {len(mandatory)} mandatory obligation(s) to fulfill')
        
        # Based on deadlines
        if deadlines:
            actions.append(f'⏰ {len(deadlines)} deadline(s) to track')
        
        # General
        actions.append('Document all agreements and commitments')
        actions.append('Always use reply-all for multi-recipient emails')
        
        return actions


def main():
    """Test V484 engine."""
    engine = EmailContractAgreementDetector()
    
    test_email = {
        'from': 'legal@client.com',
        'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['legal@ziontechgroup.com', 'ceo@client.com'],
        'subject': 'Service Agreement - Review Required',
        'body': '''Hi,

Please find attached the service agreement for your review. We will need your signature by Friday.

Key terms:
- You will provide 24/7 support with 1-hour response time
- Payment of $50,000 is due within 30 days of signing
- The contract includes a confidentiality clause and NDA
- You must maintain 99.9% uptime or face penalties
- We agree to provide access to all necessary systems
- The team will complete onboarding by March 15th

Please review and let us know if you have any questions.

Thanks''',
        'attachments': [
            {'filename': 'Service_Agreement_2026.pdf', 'size': 2048000},
            {'filename': 'NDA_Confidentiality.pdf', 'size': 512000}
        ]
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Contract Detected: {result['contract_detection']['has_contract']}")
    print(f"✅ Contract Type: {result['contract_detection']['contract_type']}")
    print(f"✅ Commitments: {len(result['commitments'])}")
    print(f"✅ Obligations: {len(result['obligations'])}")
    print(f"✅ Deadlines: {len(result['deadlines'])}")
    print(f"✅ Risk Level: {result['risk_assessment']['risk_level']}")
    print(f"✅ Legal Review Required: {result['risk_assessment']['requires_legal_review']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
