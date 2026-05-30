#!/usr/bin/env python3
"""
V167 - AI Email Attachment Intelligence v2
Deep document analysis (contracts, financial statements, technical specs), automatic data extraction
and validation, version comparison and change tracking, and intelligent file organization.
"""

import json
import re
import hashlib
from datetime import datetime
from typing import Dict, List, Optional
from collections import defaultdict

class AttachmentIntelligenceV2:
    def __init__(self):
        self.document_store = defaultdict(dict)
        self.version_history = defaultdict(list)
        self.extracted_data = defaultdict(dict)
        self.file_types = {
            'contract': ['.pdf', '.docx', '.doc'],
            'financial': ['.xlsx', '.xls', '.csv', '.pdf'],
            'technical': ['.pdf', '.docx', '.txt', '.md'],
            'presentation': ['.pptx', '.ppt', '.pdf'],
            'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
        }
    
    def analyze_attachment(self, attachment: Dict) -> Dict:
        """Analyze an email attachment comprehensively."""
        filename = attachment.get('filename', 'unknown')
        content = attachment.get('content', '')
        file_type = self._detect_file_type(filename)
        
        # Generate document fingerprint
        fingerprint = hashlib.md5(content.encode()).hexdigest()[:16]
        
        # Determine document category
        category = self._classify_document(filename, content)
        
        # Extract data based on category
        extracted = self._extract_data_by_category(category, content, filename)
        
        # Validate extracted data
        validation = self._validate_extracted_data(extracted, category)
        
        # Check for version history
        version_info = self._check_version_history(filename, fingerprint)
        
        # Store document
        doc_record = {
            'fingerprint': fingerprint,
            'filename': filename,
            'file_type': file_type,
            'category': category,
            'analyzed_at': datetime.now().isoformat(),
            'extracted_data': extracted,
            'validation': validation,
            'version': version_info
        }
        
        self.document_store[fingerprint] = doc_record
        
        return {
            'attachment_id': fingerprint,
            'filename': filename,
            'file_type': file_type,
            'category': category,
            'category_confidence': self._calculate_category_confidence(category, content),
            'extracted_data': extracted,
            'data_validation': validation,
            'version_info': version_info,
            'risks_detected': self._detect_risks(category, extracted, content),
            'summary': self._generate_summary(category, extracted, filename),
            'recommended_actions': self._recommend_actions(category, extracted, validation)
        }
    
    def _detect_file_type(self, filename: str) -> str:
        """Detect file type from extension."""
        ext = filename.lower().split('.')[-1] if '.' in filename else ''
        type_map = {
            'pdf': 'pdf', 'doc': 'word', 'docx': 'word',
            'xls': 'excel', 'xlsx': 'excel', 'csv': 'csv',
            'ppt': 'powerpoint', 'pptx': 'powerpoint',
            'txt': 'text', 'md': 'markdown',
            'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image'
        }
        return type_map.get(ext, 'unknown')
    
    def _classify_document(self, filename: str, content: str) -> str:
        """Classify document into category."""
        filename_lower = filename.lower()
        content_lower = content.lower()[:2000]  # Check first 2000 chars
        
        # Contract indicators
        contract_keywords = ['agreement', 'contract', 'terms', 'parties', 'hereby', 'whereas',
                             'obligations', 'liability', 'warranty', 'indemnification', 'governing law']
        contract_score = sum(1 for kw in contract_keywords if kw in content_lower)
        
        # Financial indicators
        financial_keywords = ['revenue', 'profit', 'expense', 'balance sheet', 'income statement',
                              'cash flow', 'assets', 'liabilities', 'equity', 'fiscal', 'quarterly']
        financial_score = sum(1 for kw in financial_keywords if kw in content_lower)
        
        # Technical indicators
        technical_keywords = ['specification', 'architecture', 'api', 'endpoint', 'protocol',
                              'implementation', 'configuration', 'deployment', 'infrastructure']
        technical_score = sum(1 for kw in technical_keywords if kw in content_lower)
        
        # Presentation indicators
        presentation_keywords = ['slide', 'presentation', 'overview', 'summary', 'agenda', 'key points']
        presentation_score = sum(1 for kw in presentation_keywords if kw in content_lower or kw in filename_lower)
        
        scores = {
            'contract': contract_score,
            'financial': financial_score,
            'technical': technical_score,
            'presentation': presentation_score,
            'general': 1
        }
        
        return max(scores, key=scores.get)
    
    def _calculate_category_confidence(self, category: str, content: str) -> float:
        """Calculate confidence in document classification."""
        content_lower = content.lower()[:2000]
        
        keyword_counts = {
            'contract': len([kw for kw in ['agreement', 'contract', 'terms', 'parties', 'obligations'] if kw in content_lower]),
            'financial': len([kw for kw in ['revenue', 'profit', 'expense', 'balance sheet', 'assets'] if kw in content_lower]),
            'technical': len([kw for kw in ['specification', 'architecture', 'api', 'endpoint', 'implementation'] if kw in content_lower]),
            'presentation': len([kw for kw in ['slide', 'overview', 'summary', 'agenda'] if kw in content_lower])
        }
        
        score = keyword_counts.get(category, 0)
        return min(score / 5.0, 1.0)
    
    def _extract_data_by_category(self, category: str, content: str, filename: str) -> Dict:
        """Extract data based on document category."""
        if category == 'contract':
            return self._extract_contract_data(content)
        elif category == 'financial':
            return self._extract_financial_data(content)
        elif category == 'technical':
            return self._extract_technical_data(content)
        elif category == 'presentation':
            return self._extract_presentation_data(content)
        else:
            return self._extract_general_data(content, filename)
    
    def _extract_contract_data(self, content: str) -> Dict:
        """Extract key contract data."""
        data = {}
        
        # Extract parties
        party_patterns = [r'(?:between|party of the first part)[:\s]*(.+?)(?:\n|and)',
                         r'(?:party of the second part)[:\s]*(.+?)(?:\n)']
        parties = []
        for pattern in party_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            parties.extend(matches[:3])
        data['parties'] = parties[:5]
        
        # Extract dates
        date_patterns = [r'(?:effective date|date)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
                         r'(?:commencing|starting)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})']
        dates = {}
        for pattern in date_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                dates['effective_date'] = matches[0]
        data['dates'] = dates
        
        # Extract monetary values
        money = re.findall(r'\$[\d,]+(?:\.\d{2})?', content)
        data['monetary_values'] = list(set(money))[:10]
        
        # Extract key clauses
        clause_keywords = ['termination', 'confidentiality', 'liability', 'indemnification',
                           'governing law', 'dispute resolution', 'force majeure']
        clauses = [kw for kw in clause_keywords if kw.lower() in content.lower()]
        data['key_clauses'] = clauses
        
        # Extract term/duration
        term_pattern = r'(?:term|duration|period)[:\s]*(\d+\s*(?:days?|months?|years?))'
        term_match = re.search(term_pattern, content, re.IGNORECASE)
        data['term'] = term_match.group(1) if term_match else None
        
        return data
    
    def _extract_financial_data(self, content: str) -> Dict:
        """Extract financial data."""
        data = {}
        
        # Extract monetary values with context
        money_pattern = r'([\w\s]+)[:\s]*\$?([\d,]+(?:\.\d{2})?)'
        money_matches = re.findall(money_pattern, content, re.IGNORECASE)
        
        financial_items = {}
        for label, value in money_matches[:20]:
            label_clean = label.strip().lower()
            if any(kw in label_clean for kw in ['revenue', 'profit', 'expense', 'total', 'net', 'gross']):
                financial_items[label_clean] = value
        
        data['financial_items'] = financial_items
        
        # Extract percentages
        percentages = re.findall(r'(\d+(?:\.\d+)?%)', content)
        data['percentages'] = percentages[:10]
        
        # Extract periods
        periods = re.findall(r'(Q[1-4]\s+\d{4}|FY\s*\d{4}|\d{4})', content)
        data['periods'] = list(set(periods))[:5]
        
        return data
    
    def _extract_technical_data(self, content: str) -> Dict:
        """Extract technical specification data."""
        data = {}
        
        # Extract API endpoints
        endpoints = re.findall(r'(?:GET|POST|PUT|DELETE|PATCH)\s+(/[^\s]+)', content)
        data['api_endpoints'] = endpoints[:20]
        
        # Extract configuration values
        config_pattern = r'(\w+)[:\s=]+([^\n]+)'
        configs = re.findall(config_pattern, content)
        data['configuration'] = {k.strip(): v.strip() for k, v in configs[:20]}
        
        # Extract version numbers
        versions = re.findall(r'(?:version|v)\s*(\d+(?:\.\d+)+)', content, re.IGNORECASE)
        data['versions'] = list(set(versions))[:5]
        
        # Extract technical requirements
        req_keywords = ['requirement', 'must', 'shall', 'should', 'specification']
        requirements = []
        for line in content.split('\n'):
            if any(kw in line.lower() for kw in req_keywords):
                requirements.append(line.strip()[:200])
        data['requirements'] = requirements[:15]
        
        return data
    
    def _extract_presentation_data(self, content: str) -> Dict:
        """Extract presentation data."""
        data = {}
        
        # Extract slide titles (heuristic: short lines at beginning)
        lines = [l.strip() for l in content.split('\n') if l.strip()]
        potential_titles = [l for l in lines[:20] if len(l) < 100 and not l.startswith('-')]
        data['potential_titles'] = potential_titles[:10]
        
        # Extract bullet points
        bullets = re.findall(r'(?:[-•*]\s*)(.+?)(?:\n|$)', content)
        data['bullet_points'] = [b.strip() for b in bullets[:30]]
        
        # Extract key numbers
        numbers = re.findall(r'\b\d+(?:\.\d+)?(?:%|x)?\b', content)
        data['key_numbers'] = numbers[:15]
        
        return data
    
    def _extract_general_data(self, content: str, filename: str) -> Dict:
        """Extract general document data."""
        return {
            'word_count': len(content.split()),
            'filename': filename,
            'preview': content[:500]
        }
    
    def _validate_extracted_data(self, data: Dict, category: str) -> Dict:
        """Validate extracted data."""
        validation = {'status': 'valid', 'issues': [], 'confidence': 0.8}
        
        if category == 'contract':
            if not data.get('parties'):
                validation['issues'].append('No parties detected')
                validation['confidence'] -= 0.2
            if not data.get('dates'):
                validation['issues'].append('No dates detected')
                validation['confidence'] -= 0.1
            if not data.get('key_clauses'):
                validation['issues'].append('No key clauses detected')
                validation['confidence'] -= 0.1
        
        elif category == 'financial':
            if not data.get('financial_items'):
                validation['issues'].append('No financial items detected')
                validation['confidence'] -= 0.2
        
        validation['confidence'] = max(validation['confidence'], 0.3)
        
        if validation['confidence'] < 0.5:
            validation['status'] = 'low_confidence'
        
        return validation
    
    def _check_version_history(self, filename: str, fingerprint: str) -> Dict:
        """Check if this is a new version of an existing document."""
        base_name = re.sub(r'[\s_-]*v?\d+(\.\d+)*', '', filename.lower())
        base_name = re.sub(r'\.[^.]+$', '', base_name)
        
        if base_name in self.version_history:
            versions = self.version_history[base_name]
            is_new_version = fingerprint not in [v['fingerprint'] for v in versions]
            
            if is_new_version:
                self.version_history[base_name].append({
                    'fingerprint': fingerprint,
                    'filename': filename,
                    'timestamp': datetime.now().isoformat()
                })
                return {
                    'is_new_version': True,
                    'version_number': len(versions) + 1,
                    'previous_versions': len(versions)
                }
        else:
            self.version_history[base_name] = [{
                'fingerprint': fingerprint,
                'filename': filename,
                'timestamp': datetime.now().isoformat()
            }]
        
        return {'is_new_version': False, 'version_number': 1}
    
    def _detect_risks(self, category: str, data: Dict, content: str) -> List[Dict]:
        """Detect risks in the document."""
        risks = []
        
        if category == 'contract':
            # Check for missing key clauses
            required_clauses = ['termination', 'confidentiality', 'liability', 'governing law']
            missing = [c for c in required_clauses if c not in data.get('key_clauses', [])]
            if missing:
                risks.append({
                    'type': 'missing_clauses',
                    'severity': 'medium',
                    'details': f'Missing clauses: {", ".join(missing)}'
                })
            
            # Check for unlimited liability
            if 'unlimited' in content.lower() and 'liability' in content.lower():
                risks.append({
                    'type': 'unlimited_liability',
                    'severity': 'high',
                    'details': 'Unlimited liability clause detected'
                })
        
        elif category == 'financial':
            # Check for negative values
            if data.get('financial_items'):
                for item, value in data['financial_items'].items():
                    if '-' in str(value):
                        risks.append({
                            'type': 'negative_value',
                            'severity': 'low',
                            'details': f'Negative value in {item}: {value}'
                        })
        
        return risks
    
    def _generate_summary(self, category: str, data: Dict, filename: str) -> str:
        """Generate human-readable summary."""
        if category == 'contract':
            parties = len(data.get('parties', []))
            clauses = len(data.get('key_clauses', []))
            return f"Contract with {parties} parties and {clauses} key clauses detected."
        elif category == 'financial':
            items = len(data.get('financial_items', {}))
            return f"Financial document with {items} financial items extracted."
        elif category == 'technical':
            endpoints = len(data.get('api_endpoints', []))
            reqs = len(data.get('requirements', []))
            return f"Technical spec with {endpoints} API endpoints and {reqs} requirements."
        else:
            return f"Document: {filename} ({category})"
    
    def _recommend_actions(self, category: str, data: Dict, validation: Dict) -> List[str]:
        """Recommend actions based on analysis."""
        actions = []
        
        if validation['confidence'] < 0.5:
            actions.append("Manual review recommended - low confidence in extraction")
        
        if category == 'contract':
            actions.append("Legal review required before signing")
            if data.get('monetary_values'):
                actions.append("Verify monetary values with finance team")
        elif category == 'financial':
            actions.append("Cross-reference with accounting records")
        elif category == 'technical':
            actions.append("Technical review by engineering team")
        
        if not actions:
            actions.append("Document processed successfully - no action required")
        
        return actions
    
    def compare_versions(self, fingerprint1: str, fingerprint2: str) -> Dict:
        """Compare two versions of a document."""
        doc1 = self.document_store.get(fingerprint1)
        doc2 = self.document_store.get(fingerprint2)
        
        if not doc1 or not doc2:
            return {'error': 'One or both documents not found'}
        
        # Compare extracted data
        changes = {}
        data1 = doc1.get('extracted_data', {})
        data2 = doc2.get('extracted_data', {})
        
        all_keys = set(data1.keys()) | set(data2.keys())
        for key in all_keys:
            val1 = data1.get(key)
            val2 = data2.get(key)
            if val1 != val2:
                changes[key] = {'old': val1, 'new': val2}
        
        return {
            'document1': doc1.get('filename'),
            'document2': doc2.get('filename'),
            'changes_detected': len(changes),
            'changes': changes,
            'category': doc1.get('category'),
            'timestamp': datetime.now().isoformat()
        }

# Usage Example
if __name__ == "__main__":
    analyzer = AttachmentIntelligenceV2()
    
    # Analyze a contract
    result = analyzer.analyze_attachment({
        'filename': 'service_agreement_v2.pdf',
        'content': 'This Agreement is between Zion Tech Group and Client Corp. '
                   'Effective date: 01/15/2024. The parties agree to the following terms: '
                   'Termination clause: Either party may terminate with 30 days notice. '
                   'Confidentiality: All information shared shall remain confidential. '
                   'Liability: Limited to contract value of $50,000. '
                   'Governing law: State of Delaware.'
    })
    print(json.dumps(result, indent=2))
