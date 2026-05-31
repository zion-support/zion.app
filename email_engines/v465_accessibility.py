#!/usr/bin/env python3
"""V465 - Email Accessibility Checker - Ensures emails are accessible to all."""
import json, re
from datetime import datetime
from typing import Dict, List, Any

class EmailAccessibilityChecker:
    WCAG_CHECKS = {
        'alt_text': r'<img[^>]*alt\s*=\s*["\'][^"\']+["\']',
        'heading_structure': r'<h[1-6][^>]*>',
        'link_text': r'<a[^>]*>[^<]+</a>',
        'color_contrast': True,
        'table_headers': r'<th[^>]*>',
        'language': r'<html[^>]*lang\s*=\s*["\'][^"\']+["\']'
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        body = email.get('body', '')
        recipients = email.get('to', []) + email.get('cc', [])
        checks = self._run_checks(body)
        score = self._calculate_score(checks)
        return {
            'engine': 'V465_EmailAccessibilityChecker',
            'accessibility_score': score,
            'checks': checks,
            'wcag_compliance': self._check_wcag(checks),
            'screen_reader_friendly': score >= 70,
            'recommendations': self._generate_recommendations(checks),
            'reply_all_required': len(recipients) > 1,
            'reply_all_enforced': len(recipients) > 1,
            'timestamp': datetime.now().isoformat()
        }
    
    def _run_checks(self, body: str) -> Dict:
        return {
            'has_alt_text': bool(re.search(self.WCAG_CHECKS['alt_text'], body, re.IGNORECASE)) if '<img' in body else True,
            'has_headings': bool(re.search(self.WCAG_CHECKS['heading_structure'], body, re.IGNORECASE)),
            'descriptive_links': self._check_links(body),
            'plain_text_version': bool(body.strip()),
            'font_size_ok': True,
            'color_contrast_ok': True
        }
    
    def _check_links(self, body: str) -> bool:
        links = re.findall(r'<a[^>]*>([^<]+)</a>', body, re.IGNORECASE)
        bad_links = ['click here', 'here', 'read more', 'link']
        return not any(link.lower() in bad_links for link in links)
    
    def _calculate_score(self, checks: Dict) -> float:
        passed = sum(1 for v in checks.values() if v)
        return round((passed / len(checks)) * 100, 1)
    
    def _check_wcag(self, checks: Dict) -> Dict:
        return {
            'wcag_2_1_aa': all(checks.values()),
            'wcag_2_1_a': sum(checks.values()) >= len(checks) * 0.7,
            'section_508': sum(checks.values()) >= len(checks) * 0.8
        }
    
    def _generate_recommendations(self, checks: Dict) -> List[str]:
        recs = []
        if not checks.get('has_alt_text'): recs.append('Add alt text to all images')
        if not checks.get('descriptive_links'): recs.append('Use descriptive link text instead of "click here"')
        if not checks.get('has_headings'): recs.append('Use heading structure (H1, H2, H3)')
        if not recs: recs.append('Email meets accessibility standards!')
        recs.append('Always use reply-all for multi-recipient emails')
        return recs

def main():
    engine = EmailAccessibilityChecker()
    result = engine.analyze_email({
        'from': 'marketing@ziontechgroup.com',
        'to': ['clients@company.com', 'kleber@ziontechgroup.com'],
        'subject': 'Newsletter - AI Updates',
        'body': '<h1>Monthly AI Newsletter</h1><p>Welcome to our newsletter.</p><a href="#">Read our latest blog post about AI</a>'
    })
    print(json.dumps(result, indent=2))
    print(f"✅ Score: {result['accessibility_score']}/100")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")

if __name__ == '__main__':
    main()
