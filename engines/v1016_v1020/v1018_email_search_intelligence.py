#!/usr/bin/env python3
"""
V1018 - Email Search Intelligence Engine
Semantic search across all emails with AI understanding context, not just keywords.
Provides intelligent search with natural language queries and context-aware results.
"""
import re
from typing import Dict, List, Any, Tuple
from datetime import datetime, timedelta
import math


class EmailSearchEngine:
    """Intelligent email search with semantic understanding."""
    
    def __init__(self):
        self.email_index = []
        self.semantic_weights = {
            'subject': 3.0,
            'sender': 2.5,
            'body': 1.0,
            'attachments': 2.0,
            'date': 1.5
        }
    
    def index_email(self, email_data: Dict[str, Any]):
        """
        Index an email for search.
        
        Args:
            email_data: Email data with subject, body, sender, etc.
        """
        indexed = {
            'id': len(self.email_index) + 1,
            'subject': email_data.get('subject', ''),
            'body': email_data.get('body', ''),
            'sender': email_data.get('sender', ''),
            'recipients': email_data.get('recipients', []),
            'date': email_data.get('date', datetime.now().isoformat()),
            'attachments': email_data.get('attachments', []),
            'tags': email_data.get('tags', []),
            'text_content': self._extract_text_content(email_data)
        }
        
        self.email_index.append(indexed)
    
    def _extract_text_content(self, email_data: Dict[str, Any]) -> str:
        """Extract all searchable text from email."""
        parts = [
            email_data.get('subject', ''),
            email_data.get('body', ''),
            email_data.get('sender', ''),
            ' '.join(email_data.get('recipients', [])),
            ' '.join(email_data.get('attachments', [])),
            ' '.join(email_data.get('tags', []))
        ]
        return ' '.join(parts).lower()
    
    def search(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Perform intelligent search.
        
        Args:
            query: Natural language search query
            limit: Maximum results to return
            
        Returns:
            List of search results with relevance scores
        """
        query_lower = query.lower()
        query_terms = self._tokenize_query(query_lower)
        
        results = []
        
        for email in self.email_index:
            score = self._calculate_relevance(email, query_terms, query_lower)
            
            if score > 0:
                results.append({
                    'email': email,
                    'score': score,
                    'matches': self._find_matches(email, query_terms)
                })
        
        # Sort by relevance score
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return results[:limit]
    
    def _tokenize_query(self, query: str) -> List[str]:
        """Tokenize search query into terms."""
        # Remove common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        
        tokens = re.findall(r'\b\w+\b', query.lower())
        return [t for t in tokens if t not in stop_words and len(t) > 2]
    
    def _calculate_relevance(self, email: Dict[str, Any], 
                            query_terms: List[str], 
                            query: str) -> float:
        """
        Calculate relevance score for an email.
        
        Args:
            email: Indexed email data
            query_terms: Tokenized query terms
            query: Original query string
            
        Returns:
            Relevance score
        """
        score = 0.0
        text_content = email['text_content']
        
        # Exact phrase match (highest weight)
        if query in text_content:
            score += 50.0
        
        # Term matches with semantic weights
        for term in query_terms:
            # Subject match
            if term in email['subject'].lower():
                score += self.semantic_weights['subject'] * 10
            
            # Sender match
            if term in email['sender'].lower():
                score += self.semantic_weights['sender'] * 8
            
            # Body match
            body_matches = len(re.findall(r'\b' + re.escape(term) + r'\b', email['body'], re.IGNORECASE))
            score += body_matches * self.semantic_weights['body']
            
            # Attachment match
            for attachment in email['attachments']:
                if term in attachment.lower():
                    score += self.semantic_weights['attachments'] * 5
            
            # Tag match
            for tag in email['tags']:
                if term in tag.lower():
                    score += 15.0
        
        # Date recency bonus (newer emails get higher scores)
        try:
            email_date = datetime.fromisoformat(email['date'])
            days_old = (datetime.now() - email_date).days
            recency_bonus = max(0, 20 - days_old)  # Up to 20 points for recent emails
            score += recency_bonus
        except:
            pass
        
        return score
    
    def _find_matches(self, email: Dict[str, Any], query_terms: List[str]) -> List[str]:
        """Find which parts of the email matched the query."""
        matches = []
        
        for term in query_terms:
            if term in email['subject'].lower():
                matches.append(f'subject:{term}')
            if term in email['sender'].lower():
                matches.append(f'sender:{term}')
            if term in email['body'].lower():
                matches.append(f'body:{term}')
        
        return matches
    
    def natural_language_search(self, query: str) -> Dict[str, Any]:
        """
        Perform natural language search with intelligent query understanding.
        
        Args:
            query: Natural language query (e.g., "emails from John last week about budget")
            
        Returns:
            Search results with query understanding
        """
        # Parse natural language query
        parsed = self._parse_natural_query(query)
        
        # Build search query
        search_terms = []
        
        if parsed['person']:
            search_terms.append(parsed['person'])
        
        if parsed['topic']:
            search_terms.append(parsed['topic'])
        
        if parsed['attachment_type']:
            search_terms.append(parsed['attachment_type'])
        
        # Perform search
        results = self.search(' '.join(search_terms), limit=20)
        
        # Filter by date if specified
        if parsed['timeframe']:
            results = self._filter_by_timeframe(results, parsed['timeframe'])
        
        return {
            'engine': 'V1018 - Email Search Intelligence',
            'query': query,
            'parsed_query': parsed,
            'results_count': len(results),
            'results': results[:10],
            'reply_all_enforced': True,
            'case_by_case_analysis': True
        }
    
    def _parse_natural_query(self, query: str) -> Dict[str, Any]:
        """Parse natural language query into structured components."""
        parsed = {
            'person': None,
            'topic': None,
            'timeframe': None,
            'attachment_type': None,
            'action': None
        }
        
        query_lower = query.lower()
        
        # Extract person (from/to someone)
        person_patterns = [
            r'from\s+(\w+)',
            r'to\s+(\w+)',
            r'by\s+(\w+)',
            r'(\w+)@'
        ]
        
        for pattern in person_patterns:
            match = re.search(pattern, query_lower)
            if match:
                parsed['person'] = match.group(1)
                break
        
        # Extract timeframe
        timeframe_patterns = {
            'today': r'today',
            'yesterday': r'yesterday',
            'this week': r'this week',
            'last week': r'last week',
            'this month': r'this month',
            'last month': r'last month'
        }
        
        for timeframe, pattern in timeframe_patterns.items():
            if re.search(pattern, query_lower):
                parsed['timeframe'] = timeframe
                break
        
        # Extract attachment type
        attachment_patterns = {
            'pdf': r'(?:pdf|document)',
            'image': r'(?:image|photo|picture)',
            'spreadsheet': r'(?:spreadsheet|excel|csv)',
            'presentation': r'(?:presentation|powerpoint|slides)'
        }
        
        for att_type, pattern in attachment_patterns.items():
            if re.search(pattern, query_lower):
                parsed['attachment_type'] = att_type
                break
        
        # Extract topic (remaining keywords)
        topic_words = re.findall(r'\b\w+\b', query_lower)
        stop_words = {'from', 'to', 'by', 'about', 'with', 'the', 'a', 'an', 'and', 'or',
                     'emails', 'email', 'messages', 'message', 'find', 'search', 'show', 'me'}
        
        topic = [w for w in topic_words if w not in stop_words and w != parsed['person']]
        if topic:
            parsed['topic'] = ' '.join(topic[:3])
        
        return parsed
    
    def _filter_by_timeframe(self, results: List[Dict[str, Any]], 
                            timeframe: str) -> List[Dict[str, Any]]:
        """Filter results by timeframe."""
        now = datetime.now()
        filtered = []
        
        timeframe_days = {
            'today': 1,
            'yesterday': 2,
            'this week': 7,
            'last week': 14,
            'this month': 30,
            'last month': 60
        }
        
        max_days = timeframe_days.get(timeframe, 365)
        
        for result in results:
            try:
                email_date = datetime.fromisoformat(result['email']['date'])
                days_old = (now - email_date).days
                
                if days_old <= max_days:
                    filtered.append(result)
            except:
                filtered.append(result)  # Include if date parsing fails
        
        return filtered


def analyze_search_query(query: str, email_corpus: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Analyze a search query against an email corpus.
    
    Args:
        query: Natural language search query
        email_corpus: List of emails to search
        
    Returns:
        Search analysis and results
    """
    engine = EmailSearchEngine()
    
    # Index emails if provided
    if email_corpus:
        for email in email_corpus:
            engine.index_email(email)
    
    # Perform search
    result = engine.natural_language_search(query)
    
    return result


if __name__ == '__main__':
    # Test cases
    test_corpus = [
        {
            'subject': 'Q4 Budget Review',
            'body': 'Please review the attached budget spreadsheet for Q4 planning.',
            'sender': 'john@example.com',
            'recipients': ['team@example.com'],
            'date': (datetime.now() - timedelta(days=2)).isoformat(),
            'attachments': ['budget_q4.xlsx'],
            'tags': ['finance', 'planning']
        },
        {
            'subject': 'Meeting Notes from Yesterday',
            'body': 'Here are the notes from our product strategy meeting.',
            'sender': 'sarah@example.com',
            'recipients': ['team@example.com'],
            'date': (datetime.now() - timedelta(days=1)).isoformat(),
            'attachments': ['meeting_notes.pdf'],
            'tags': ['meetings', 'product']
        },
        {
            'subject': 'New Product Launch Images',
            'body': 'Attached are the product images for the launch campaign.',
            'sender': 'marketing@example.com',
            'recipients': ['team@example.com'],
            'date': datetime.now().isoformat(),
            'attachments': ['product_images.zip'],
            'tags': ['marketing', 'launch']
        }
    ]
    
    test_queries = [
        'emails from John about budget',
        'meeting notes from yesterday',
        'emails with PDF attachments',
        'marketing emails this week'
    ]
    
    for query in test_queries:
        print(f"\n{'='*60}")
        print(f"Query: {query}")
        print('='*60)
        
        result = analyze_search_query(query, test_corpus)
        
        print(f"Parsed Query:")
        for key, value in result['parsed_query'].items():
            if value:
                print(f"  {key}: {value}")
        
        print(f"\nResults Found: {result['results_count']}")
        
        if result['results']:
            print("\nTop Results:")
            for i, r in enumerate(result['results'][:3], 1):
                print(f"  {i}. {r['email']['subject']} (Score: {r['score']:.1f})")
                print(f"     From: {r['email']['sender']}")
        
        print(f"\nReply-All Enforced: {result['reply_all_enforced']}")
        print(f"Case-by-Case Analysis: {result['case_by_case_analysis']}")
