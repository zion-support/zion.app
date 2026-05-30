#!/usr/bin/env python3
"""
V107: AI Email Attachment Intelligence
Advanced processing of email attachments including PDF text extraction,
image OCR, spreadsheet analysis, document summarization, and automatic filing.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum


class AttachmentType(Enum):
    PDF = "pdf"
    IMAGE = "image"
    SPREADSHEET = "spreadsheet"
    DOCUMENT = "document"
    PRESENTATION = "presentation"
    ARCHIVE = "archive"
    OTHER = "other"


class ProcessingStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class AttachmentAnalysis:
    attachment_id: str
    filename: str
    file_type: AttachmentType
    file_size_kb: float
    page_count: Optional[int]
    extracted_text: str
    summary: str
    key_data: Dict
    tables: List[Dict]
    images: List[Dict]
    metadata: Dict
    processing_time_ms: int
    status: ProcessingStatus


@dataclass
class DocumentIntelligence:
    document_type: str  # "invoice", "contract", "report", "proposal", etc.
    entities_extracted: List[Dict]
    financial_data: Optional[Dict]
    dates_extracted: List[str]
    contact_info: Dict
    risk_indicators: List[str]
    action_items: List[str]


class V107AttachmentIntelligence:
    """
    V107: AI Email Attachment Intelligence
    
    Features:
    1. PDF text extraction and analysis
    2. Image OCR and analysis
    3. Spreadsheet processing and data extraction
    4. Document summarization
    5. Automatic filing and organization
    6. Risk detection in documents
    """
    
    def __init__(self):
        self.attachment_cache: Dict[str, AttachmentAnalysis] = {}
        self.filing_rules: List[Dict] = []
        
        # Initialize filing rules
        self._initialize_filing_rules()
    
    def _initialize_filing_rules(self):
        """Initialize automatic filing rules."""
        self.filing_rules = [
            {
                'pattern': r'invoice|receipt|bill',
                'folder': 'Financial/Invoices',
                'tags': ['financial', 'invoice']
            },
            {
                'pattern': r'contract|agreement|terms',
                'folder': 'Legal/Contracts',
                'tags': ['legal', 'contract']
            },
            {
                'pattern': r'proposal|quote|estimate',
                'folder': 'Sales/Proposals',
                'tags': ['sales', 'proposal']
            },
            {
                'pattern': r'report|analysis|summary',
                'folder': 'Reports',
                'tags': ['report', 'analysis']
            },
            {
                'pattern': r'presentation|deck|slides',
                'folder': 'Presentations',
                'tags': ['presentation']
            }
        ]
    
    def process_attachment(self, attachment_data: Dict) -> AttachmentAnalysis:
        """Process email attachment and extract information."""
        attachment_id = attachment_data.get('id', 'unknown')
        filename = attachment_data.get('filename', 'unknown')
        file_type = self._detect_file_type(filename)
        file_size_kb = attachment_data.get('size_kb', 0)
        
        # Simulate processing
        start_time = datetime.now()
        
        # Extract text based on file type
        extracted_text = self._extract_text(attachment_data, file_type)
        
        # Generate summary
        summary = self._generate_summary(extracted_text, file_type)
        
        # Extract key data
        key_data = self._extract_key_data(extracted_text, file_type)
        
        # Extract tables (for spreadsheets)
        tables = self._extract_tables(attachment_data, file_type)
        
        # Extract images (for PDFs with images)
        images = self._extract_images(attachment_data, file_type)
        
        # Extract metadata
        metadata = self._extract_metadata(attachment_data)
        
        # Calculate processing time
        processing_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        analysis = AttachmentAnalysis(
            attachment_id=attachment_id,
            filename=filename,
            file_type=file_type,
            file_size_kb=file_size_kb,
            page_count=metadata.get('page_count'),
            extracted_text=extracted_text,
            summary=summary,
            key_data=key_data,
            tables=tables,
            images=images,
            metadata=metadata,
            processing_time_ms=processing_time,
            status=ProcessingStatus.COMPLETED
        )
        
        self.attachment_cache[attachment_id] = analysis
        return analysis
    
    def _detect_file_type(self, filename: str) -> AttachmentType:
        """Detect file type from filename."""
        filename_lower = filename.lower()
        
        if filename_lower.endswith('.pdf'):
            return AttachmentType.PDF
        elif any(filename_lower.endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']):
            return AttachmentType.IMAGE
        elif any(filename_lower.endswith(ext) for ext in ['.xlsx', '.xls', '.csv']):
            return AttachmentType.SPREADSHEET
        elif any(filename_lower.endswith(ext) for ext in ['.doc', '.docx', '.txt', '.rtf']):
            return AttachmentType.DOCUMENT
        elif any(filename_lower.endswith(ext) for ext in ['.ppt', '.pptx']):
            return AttachmentType.PRESENTATION
        elif any(filename_lower.endswith(ext) for ext in ['.zip', '.rar', '.7z']):
            return AttachmentType.ARCHIVE
        else:
            return AttachmentType.OTHER
    
    def _extract_text(self, attachment_data: Dict, file_type: AttachmentType) -> str:
        """Extract text from attachment."""
        # Simulate text extraction
        content = attachment_data.get('content', '')
        
        if file_type == AttachmentType.PDF:
            return self._extract_pdf_text(content)
        elif file_type == AttachmentType.IMAGE:
            return self._perform_ocr(content)
        elif file_type == AttachmentType.SPREADSHEET:
            return self._extract_spreadsheet_text(content)
        elif file_type == AttachmentType.DOCUMENT:
            return content
        else:
            return "Text extraction not supported for this file type"
    
    def _extract_pdf_text(self, content: str) -> str:
        """Extract text from PDF."""
        # Simulate PDF text extraction
        return f"Extracted PDF content: {content[:500] if content else 'Sample PDF text with financial data, dates, and key information.'}"
    
    def _perform_ocr(self, content: str) -> str:
        """Perform OCR on image."""
        # Simulate OCR
        return f"OCR Result: {content[:500] if content else 'Extracted text from image using OCR technology.'}"
    
    def _extract_spreadsheet_text(self, content: str) -> str:
        """Extract text from spreadsheet."""
        # Simulate spreadsheet extraction
        return f"Spreadsheet data: {content[:500] if content else 'Revenue: $50,000, Expenses: $30,000, Profit: $20,000'}"
    
    def _generate_summary(self, text: str, file_type: AttachmentType) -> str:
        """Generate summary of extracted text."""
        if not text:
            return "No content extracted"
        
        # Simple summarization
        sentences = text.split('.')
        key_sentences = []
        
        for sentence in sentences[:5]:
            sentence = sentence.strip()
            if len(sentence) > 20:
                key_sentences.append(sentence)
        
        if not key_sentences:
            return "Document contains minimal extractable content"
        
        return '. '.join(key_sentences[:3]) + '.'
    
    def _extract_key_data(self, text: str, file_type: AttachmentType) -> Dict:
        """Extract key data from text."""
        key_data = {
            'amounts': [],
            'dates': [],
            'emails': [],
            'phones': [],
            'names': []
        }
        
        # Extract amounts
        amount_pattern = r'\$[\d,]+\.?\d*'
        amounts = re.findall(amount_pattern, text)
        key_data['amounts'] = amounts
        
        # Extract dates
        date_pattern = r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}'
        dates = re.findall(date_pattern, text)
        key_data['dates'] = dates
        
        # Extract emails
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        key_data['emails'] = emails
        
        # Extract phone numbers
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        phones = re.findall(phone_pattern, text)
        key_data['phones'] = phones
        
        return key_data
    
    def _extract_tables(self, attachment_data: Dict, file_type: AttachmentType) -> List[Dict]:
        """Extract tables from attachment."""
        if file_type != AttachmentType.SPREADSHEET:
            return []
        
        # Simulate table extraction
        return [
            {
                'table_id': 'table_1',
                'headers': ['Item', 'Quantity', 'Price', 'Total'],
                'rows': [
                    ['Product A', '10', '$100', '$1,000'],
                    ['Product B', '5', '$200', '$1,000'],
                    ['Product C', '20', '$50', '$1,000']
                ],
                'total_rows': 3
            }
        ]
    
    def _extract_images(self, attachment_data: Dict, file_type: AttachmentType) -> List[Dict]:
        """Extract images from attachment."""
        if file_type != AttachmentType.PDF:
            return []
        
        # Simulate image extraction
        return [
            {
                'image_id': 'img_1',
                'description': 'Company logo',
                'dimensions': '200x100',
                'format': 'PNG'
            }
        ]
    
    def _extract_metadata(self, attachment_data: Dict) -> Dict:
        """Extract metadata from attachment."""
        return {
            'author': attachment_data.get('author', 'Unknown'),
            'created_date': attachment_data.get('created_date', datetime.now().isoformat()),
            'modified_date': attachment_data.get('modified_date', datetime.now().isoformat()),
            'page_count': attachment_data.get('page_count', 1),
            'word_count': attachment_data.get('word_count', 0)
        }
    
    def analyze_document(self, attachment_id: str) -> DocumentIntelligence:
        """Perform deep document analysis."""
        if attachment_id not in self.attachment_cache:
            return DocumentIntelligence(
                document_type='unknown',
                entities_extracted=[],
                financial_data=None,
                dates_extracted=[],
                contact_info={},
                risk_indicators=[],
                action_items=[]
            )
        
        analysis = self.attachment_cache[attachment_id]
        text = analysis.extracted_text
        
        # Detect document type
        document_type = self._detect_document_type(text, analysis.filename)
        
        # Extract entities
        entities = self._extract_entities(text)
        
        # Extract financial data
        financial_data = self._extract_financial_data(text) if document_type in ['invoice', 'receipt', 'quote'] else None
        
        # Extract dates
        dates = analysis.key_data.get('dates', [])
        
        # Extract contact info
        contact_info = {
            'emails': analysis.key_data.get('emails', []),
            'phones': analysis.key_data.get('phones', [])
        }
        
        # Detect risk indicators
        risk_indicators = self._detect_risk_indicators(text, document_type)
        
        # Extract action items
        action_items = self._extract_action_items(text, document_type)
        
        return DocumentIntelligence(
            document_type=document_type,
            entities_extracted=entities,
            financial_data=financial_data,
            dates_extracted=dates,
            contact_info=contact_info,
            risk_indicators=risk_indicators,
            action_items=action_items
        )
    
    def _detect_document_type(self, text: str, filename: str) -> str:
        """Detect document type."""
        text_lower = (text + ' ' + filename).lower()
        
        type_keywords = {
            'invoice': ['invoice', 'bill', 'receipt', 'amount due', 'payment'],
            'contract': ['contract', 'agreement', 'terms', 'parties', 'obligations'],
            'proposal': ['proposal', 'quote', 'estimate', 'scope', 'deliverables'],
            'report': ['report', 'analysis', 'summary', 'findings', 'conclusion'],
            'resume': ['resume', 'cv', 'experience', 'education', 'skills'],
            'presentation': ['presentation', 'slide', 'deck']
        }
        
        for doc_type, keywords in type_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return doc_type
        
        return 'document'
    
    def _extract_entities(self, text: str) -> List[Dict]:
        """Extract named entities from text."""
        entities = []
        
        # Extract company names (capitalized words)
        company_pattern = r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|LLC|Corp|Ltd|Company)\b'
        companies = re.findall(company_pattern, text)
        for company in companies:
            entities.append({'type': 'company', 'value': company})
        
        # Extract person names
        person_pattern = r'\b[A-Z][a-z]+\s+[A-Z][a-z]+\b'
        persons = re.findall(person_pattern, text)
        for person in persons[:5]:  # Limit to 5
            entities.append({'type': 'person', 'value': person})
        
        return entities
    
    def _extract_financial_data(self, text: str) -> Optional[Dict]:
        """Extract financial data from document."""
        amounts = re.findall(r'\$[\d,]+\.?\d*', text)
        
        if not amounts:
            return None
        
        # Try to identify total, subtotal, tax
        financial_data = {
            'total': None,
            'subtotal': None,
            'tax': None,
            'line_items': []
        }
        
        # Find largest amount (likely total)
        if amounts:
            amounts_numeric = [float(a.replace('$', '').replace(',', '')) for a in amounts]
            financial_data['total'] = max(amounts_numeric)
        
        return financial_data
    
    def _detect_risk_indicators(self, text: str, document_type: str) -> List[str]:
        """Detect risk indicators in document."""
        risk_indicators = []
        text_lower = text.lower()
        
        # Financial risks
        if document_type in ['invoice', 'contract']:
            if 'penalty' in text_lower or 'late fee' in text_lower:
                risk_indicators.append('Contains penalty clauses')
            if 'termination' in text_lower:
                risk_indicators.append('Contains termination clauses')
        
        # Compliance risks
        if 'confidential' in text_lower or 'nda' in text_lower:
            risk_indicators.append('Contains confidential information')
        
        # Legal risks
        if 'liability' in text_lower or 'indemnification' in text_lower:
            risk_indicators.append('Contains liability clauses')
        
        return risk_indicators
    
    def _extract_action_items(self, text: str, document_type: str) -> List[str]:
        """Extract action items from document."""
        action_items = []
        
        # Look for action indicators
        action_patterns = [
            r'(?:due|deadline|by)\s+(.+?)(?:\.|$)',
            r'(?:please|must|should)\s+(.+?)(?:\.|$)',
            r'(?:action required|action item):(.+?)(?:\.|$)'
        ]
        
        for pattern in action_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                action_items.append(match.group(0))
        
        return action_items[:5]  # Limit to 5 action items
    
    def suggest_filing_location(self, attachment_id: str) -> Dict:
        """Suggest filing location for attachment."""
        if attachment_id not in self.attachment_cache:
            return {'folder': 'Miscellaneous', 'tags': [], 'confidence': 0.0}
        
        analysis = self.attachment_cache[attachment_id]
        filename_lower = analysis.filename.lower()
        
        for rule in self.filing_rules:
            if re.search(rule['pattern'], filename_lower, re.IGNORECASE):
                return {
                    'folder': rule['folder'],
                    'tags': rule['tags'],
                    'confidence': 0.9
                }
        
        return {
            'folder': 'Miscellaneous',
            'tags': [analysis.file_type.value],
            'confidence': 0.5
        }
    
    def get_processing_stats(self) -> Dict:
        """Get attachment processing statistics."""
        total = len(self.attachment_cache)
        
        by_type = {}
        for analysis in self.attachment_cache.values():
            file_type = analysis.file_type.value
            by_type[file_type] = by_type.get(file_type, 0) + 1
        
        avg_processing_time = sum(a.processing_time_ms for a in self.attachment_cache.values()) / total if total > 0 else 0
        
        return {
            'total_processed': total,
            'by_type': by_type,
            'average_processing_time_ms': avg_processing_time,
            'success_rate': sum(1 for a in self.attachment_cache.values() if a.status == ProcessingStatus.COMPLETED) / total if total > 0 else 0
        }


# Test the implementation
if __name__ == "__main__":
    intelligence = V107AttachmentIntelligence()
    
    # Test attachment
    test_attachment = {
        'id': 'attach_123',
        'filename': 'Invoice_2024_Q1.pdf',
        'size_kb': 250,
        'author': 'Accounting Department',
        'created_date': datetime.now().isoformat(),
        'page_count': 2,
        'content': '''INVOICE #12345
        
Date: 01/15/2024
Due Date: 02/15/2024

Bill To:
John Smith
john.smith@company.com
(555) 123-4567

Description              Quantity    Price      Total
Consulting Services      40 hrs      $150/hr    $6,000
Software License         1           $2,500     $2,500
Support Package          1           $1,500     $1,500

                                    Subtotal:              $10,000
                                    Tax (8%):              $800
                                    Total:                 $10,800

Payment Terms: Net 30
Late payment penalty: 1.5% per month

Please remit payment by 02/15/2024.

Thank you for your business!
'''
    }
    
    print("V107: AI Email Attachment Intelligence")
    print("=" * 60)
    
    analysis = intelligence.process_attachment(test_attachment)
    
    print(f"\nFilename: {analysis.filename}")
    print(f"File Type: {analysis.file_type.value}")
    print(f"Size: {analysis.file_size_kb} KB")
    print(f"Processing Time: {analysis.processing_time_ms} ms")
    
    print(f"\nSummary:")
    print(analysis.summary)
    
    print(f"\nKey Data Extracted:")
    print(f"  Amounts: {analysis.key_data['amounts'][:3]}")
    print(f"  Dates: {analysis.key_data['dates'][:3]}")
    print(f"  Emails: {analysis.key_data['emails'][:2]}")
    
    print(f"\n" + "=" * 60)
    print("Document Intelligence:")
    doc_intel = intelligence.analyze_document('attach_123')
    print(f"  Document Type: {doc_intel.document_type}")
    print(f"  Entities: {len(doc_intel.entities_extracted)}")
    print(f"  Financial Data: {doc_intel.financial_data}")
    print(f"  Risk Indicators: {doc_intel.risk_indicators}")
    print(f"  Action Items: {doc_intel.action_items}")
    
    print(f"\n" + "=" * 60)
    print("Filing Suggestion:")
    filing = intelligence.suggest_filing_location('attach_123')
    print(json.dumps(filing, indent=2))
    
    print(f"\n" + "=" * 60)
    print("Processing Stats:")
    stats = intelligence.get_processing_stats()
    print(json.dumps(stats, indent=2))
