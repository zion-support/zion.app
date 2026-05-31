#!/usr/bin/env python3
"""
V590 - Email Accessibility Checker
WCAG compliance checking for emails with screen reader compatibility testing.
Color contrast validation and alt-text suggestions for images.
Enforces reply-all for all communications.
"""
import json
import re
from datetime import datetime
from typing import Dict, List, Tuple

class EmailAccessibilityChecker:
    def __init__(self):
        self.reply_all_enforced = True
        self.wcag_levels = {
            'A': ['1.1.1', '1.3.1', '1.3.2', '2.1.1', '2.4.1', '3.1.1', '4.1.1'],
            'AA': ['1.4.3', '1.4.4', '1.4.5', '2.4.7', '3.2.3', '3.2.4'],
            'AAA': ['1.4.6', '1.4.7', '1.4.8', '2.4.8', '2.4.9', '2.4.10']
        }
    
    def check_accessibility(self, email: Dict) -> Dict:
        """Check email accessibility compliance"""
        html_content = email.get('html_content', '')
        text_content = email.get('body', '')
        attachments = email.get('attachments', [])
        
        # Check WCAG compliance
        wcag_results = self._check_wcag_compliance(html_content, text_content)
        
        # Check screen reader compatibility
        screen_reader_results = self._check_screen_reader_compatibility(html_content, text_content)
        
        # Check color contrast
        color_contrast_results = self._check_color_contrast(html_content)
        
        # Check alt text for images
        alt_text_results = self._check_alt_text(html_content)
        
        # Check heading structure
        heading_results = self._check_heading_structure(html_content)
        
        # Check link accessibility
        link_results = self._check_link_accessibility(html_content)
        
        # Generate accessibility score
        accessibility_score = self._calculate_accessibility_score(
            wcag_results, screen_reader_results, color_contrast_results,
            alt_text_results, heading_results, link_results
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            wcag_results, screen_reader_results, color_contrast_results,
            alt_text_results, heading_results, link_results
        )
        
        return {
            'engine': 'V590_Email_Accessibility_Checker',
            'timestamp': datetime.now().isoformat(),
            'email_id': email.get('id', 'unknown'),
            'accessibility_score': accessibility_score,
            'wcag_compliance': wcag_results,
            'screen_reader_compatibility': screen_reader_results,
            'color_contrast': color_contrast_results,
            'alt_text': alt_text_results,
            'heading_structure': heading_results,
            'link_accessibility': link_results,
            'recommendations': recommendations,
            'reply_all_enforced': self.reply_all_enforced,
            'all_recipients': email.get('to', []) + email.get('cc', [])
        }
    
    def _check_wcag_compliance(self, html: str, text: str) -> Dict:
        """Check WCAG 2.1 compliance"""
        issues = []
        passed = []
        
        # 1.1.1 Non-text Content (Level A)
        if '<img' in html:
            if 'alt=' not in html:
                issues.append({
                    'criterion': '1.1.1',
                    'level': 'A',
                    'issue': 'Images without alt text',
                    'description': 'All images must have alternative text'
                })
            else:
                passed.append('1.1.1')
        
        # 1.3.1 Info and Relationships (Level A)
        if '<table' in html and '<th' not in html:
            issues.append({
                'criterion': '1.3.1',
                'level': 'A',
                'issue': 'Tables without headers',
                'description': 'Data tables must have header cells'
            })
        else:
            passed.append('1.3.1')
        
        # 2.4.1 Bypass Blocks (Level A)
        if len(html) > 1000 and '<h1' not in html:
            issues.append({
                'criterion': '2.4.1',
                'level': 'A',
                'issue': 'No main heading',
                'description': 'Long content should have a main heading'
            })
        else:
            passed.append('2.4.1')
        
        # 3.1.1 Language of Page (Level A)
        if 'lang=' not in html:
            issues.append({
                'criterion': '3.1.1',
                'level': 'A',
                'issue': 'Language not specified',
                'description': 'HTML should specify language'
            })
        else:
            passed.append('3.1.1')
        
        # 1.4.3 Contrast (Minimum) (Level AA)
        # This is checked separately in color contrast
        
        # 1.4.4 Resize text (Level AA)
        if 'font-size' in html and 'px' in html:
            issues.append({
                'criterion': '1.4.4',
                'level': 'AA',
                'issue': 'Fixed font sizes',
                'description': 'Use relative units (em, rem) instead of px'
            })
        else:
            passed.append('1.4.4')
        
        return {
            'level_A': {'passed': [c for c in passed if c in self.wcag_levels['A']], 'issues': [i for i in issues if i['level'] == 'A']},
            'level_AA': {'passed': [c for c in passed if c in self.wcag_levels['AA']], 'issues': [i for i in issues if i['level'] == 'AA']},
            'level_AAA': {'passed': [c for c in passed if c in self.wcag_levels['AAA']], 'issues': [i for i in issues if i['level'] == 'AAA']},
            'total_issues': len(issues),
            'compliance_level': 'AA' if not any(i['level'] == 'A' for i in issues) else 'A' if not any(i['level'] == 'AA' for i in issues) else 'Failed'
        }
    
    def _check_screen_reader_compatibility(self, html: str, text: str) -> Dict:
        """Check screen reader compatibility"""
        issues = []
        
        # Check for semantic HTML
        semantic_elements = ['<header', '<nav', '<main', '<article', '<section', '<footer']
        has_semantic = any(elem in html for elem in semantic_elements)
        
        if not has_semantic and len(html) > 500:
            issues.append({
                'type': 'semantic',
                'issue': 'No semantic HTML elements',
                'impact': 'high',
                'recommendation': 'Use semantic elements like <header>, <main>, <section>'
            })
        
        # Check for ARIA labels
        if '<button' in html and 'aria-label' not in html:
            issues.append({
                'type': 'aria',
                'issue': 'Buttons without ARIA labels',
                'impact': 'medium',
                'recommendation': 'Add aria-label to buttons'
            })
        
        # Check for reading order
        if '<table' in html and 'role="presentation"' not in html:
            issues.append({
                'type': 'structure',
                'issue': 'Layout tables may confuse screen readers',
                'impact': 'medium',
                'recommendation': 'Add role="presentation" to layout tables'
            })
        
        # Check for skip links
        if len(html) > 2000 and 'skip' not in html.lower():
            issues.append({
                'type': 'navigation',
                'issue': 'No skip navigation link',
                'impact': 'low',
                'recommendation': 'Add skip link for long content'
            })
        
        return {
            'compatible': len([i for i in issues if i['impact'] == 'high']) == 0,
            'issues': issues,
            'score': max(0, 100 - len(issues) * 15)
        }
    
    def _check_color_contrast(self, html: str) -> Dict:
        """Check color contrast ratios"""
        # Extract color values
        color_pattern = r'color:\s*#([0-9a-fA-F]{3,6})|background(?:-color)?:\s*#([0-9a-fA-F]{3,6})'
        colors = re.findall(color_pattern, html, re.IGNORECASE)
        
        issues = []
        
        # Simplified contrast check (in real implementation, calculate actual ratios)
        if len(colors) >= 2:
            # Check if colors are too similar (simplified check)
            for i in range(0, len(colors) - 1, 2):
                color1 = colors[i][0] or colors[i][1]
                color2 = colors[i+1][0] if i+1 < len(colors) else (colors[i+1][1] if i+1 < len(colors) else '')
                
                if color1 and color2:
                    # Simplified: check if colors are very light or very similar
                    if self._is_low_contrast(color1, color2):
                        issues.append({
                            'colors': [color1, color2],
                            'issue': 'Low contrast ratio',
                            'recommendation': 'Ensure 4.5:1 ratio for normal text, 3:1 for large text'
                        })
        
        return {
            'compliant': len(issues) == 0,
            'issues': issues,
            'recommendations': [
                'Use contrast ratio of at least 4.5:1 for normal text',
                'Use contrast ratio of at least 3:1 for large text (18pt+ or 14pt+ bold)',
                'Test with color blindness simulators'
            ] if issues else []
        }
    
    def _is_low_contrast(self, color1: str, color2: str) -> bool:
        """Simplified low contrast check"""
        # This is a simplified check - real implementation would calculate luminance
        try:
            # Convert hex to RGB
            rgb1 = self._hex_to_rgb(color1)
            rgb2 = self._hex_to_rgb(color2)
            
            # Calculate simple luminance difference
            lum1 = (rgb1[0] * 0.299 + rgb1[1] * 0.587 + rgb1[2] * 0.114) / 255
            lum2 = (rgb2[0] * 0.299 + rgb2[1] * 0.587 + rgb2[2] * 0.114) / 255
            
            # If luminance difference is too small, it's low contrast
            return abs(lum1 - lum2) < 0.3
        except:
            return False
    
    def _hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convert hex color to RGB"""
        hex_color = hex_color.lstrip('#')
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def _check_alt_text(self, html: str) -> Dict:
        """Check alt text for images"""
        img_pattern = r'<img[^>]*>'
        images = re.findall(img_pattern, html, re.IGNORECASE)
        
        issues = []
        good_examples = []
        
        for img in images:
            if 'alt=' not in img:
                issues.append({
                    'image': img[:100],
                    'issue': 'Missing alt text',
                    'recommendation': 'Add descriptive alt text'
                })
            elif 'alt=""' in img or "alt=''" in img:
                issues.append({
                    'image': img[:100],
                    'issue': 'Empty alt text',
                    'recommendation': 'Provide meaningful description or mark as decorative'
                })
            elif 'alt="image"' in img.lower() or "alt='image'" in img.lower():
                issues.append({
                    'image': img[:100],
                    'issue': 'Non-descriptive alt text',
                    'recommendation': 'Describe the image content specifically'
                })
            else:
                # Extract alt text
                alt_match = re.search(r'alt=["\']([^"\']+)["\']', img, re.IGNORECASE)
                if alt_match:
                    good_examples.append(alt_match.group(1))
        
        return {
            'total_images': len(images),
            'images_with_issues': len(issues),
            'issues': issues,
            'good_examples': good_examples[:3],
            'compliance_rate': round((len(images) - len(issues)) / len(images) * 100, 1) if images else 100
        }
    
    def _check_heading_structure(self, html: str) -> Dict:
        """Check heading structure"""
        heading_pattern = r'<h([1-6])[^>]*>'
        headings = re.findall(heading_pattern, html, re.IGNORECASE)
        
        issues = []
        
        if not headings:
            issues.append({
                'issue': 'No headings found',
                'recommendation': 'Add headings to structure content'
            })
        else:
            # Check for skipped heading levels
            heading_levels = [int(h) for h in headings]
            for i in range(1, len(heading_levels)):
                if heading_levels[i] > heading_levels[i-1] + 1:
                    issues.append({
                        'issue': f'Skipped heading level: H{heading_levels[i-1]} to H{heading_levels[i]}',
                        'recommendation': 'Use sequential heading levels'
                    })
                    break
            
            # Check for multiple H1s
            if heading_levels.count(1) > 1:
                issues.append({
                    'issue': 'Multiple H1 headings',
                    'recommendation': 'Use only one H1 per page'
                })
        
        return {
            'total_headings': len(headings),
            'heading_levels': heading_levels,
            'issues': issues,
            'valid_structure': len(issues) == 0
        }
    
    def _check_link_accessibility(self, html: str) -> Dict:
        """Check link accessibility"""
        link_pattern = r'<a[^>]*href=["\']([^"\']+)["\'][^>]*>([^<]*)</a>'
        links = re.findall(link_pattern, html, re.IGNORECASE)
        
        issues = []
        
        for href, text in links:
            if not text.strip():
                issues.append({
                    'link': href,
                    'issue': 'Empty link text',
                    'recommendation': 'Add descriptive link text'
                })
            elif text.lower() in ['click here', 'here', 'read more', 'more']:
                issues.append({
                    'link': href,
                    'issue': 'Non-descriptive link text',
                    'recommendation': 'Use descriptive text that makes sense out of context'
                })
            elif href.startswith('javascript:'):
                issues.append({
                    'link': href,
                    'issue': 'JavaScript link',
                    'recommendation': 'Use proper href with fallback'
                })
        
        return {
            'total_links': len(links),
            'links_with_issues': len(issues),
            'issues': issues,
            'compliance_rate': round((len(links) - len(issues)) / len(links) * 100, 1) if links else 100
        }
    
    def _calculate_accessibility_score(self, *results) -> float:
        """Calculate overall accessibility score"""
        scores = []
        
        # WCAG compliance (40% weight)
        wcag = results[0]
        wcag_score = 100 - (wcag['total_issues'] * 10)
        scores.append(wcag_score * 0.4)
        
        # Screen reader compatibility (20% weight)
        screen_reader = results[1]
        scores.append(screen_reader['score'] * 0.2)
        
        # Color contrast (15% weight)
        color_contrast = results[2]
        color_score = 100 if color_contrast['compliant'] else 50
        scores.append(color_score * 0.15)
        
        # Alt text (15% weight)
        alt_text = results[3]
        scores.append(alt_text['compliance_rate'] * 0.15)
        
        # Heading structure (5% weight)
        heading = results[4]
        heading_score = 100 if heading['valid_structure'] else 50
        scores.append(heading_score * 0.05)
        
        # Link accessibility (5% weight)
        link = results[5]
        scores.append(link['compliance_rate'] * 0.05)
        
        return round(sum(scores), 1)
    
    def _generate_recommendations(self, *results) -> List[Dict]:
        """Generate accessibility recommendations"""
        recommendations = []
        
        # WCAG recommendations
        wcag = results[0]
        for issue in wcag['level_A']['issues'] + wcag['level_AA']['issues']:
            recommendations.append({
                'priority': 'high' if issue['level'] == 'A' else 'medium',
                'category': 'WCAG',
                'issue': issue['issue'],
                'recommendation': issue['description']
            })
        
        # Screen reader recommendations
        screen_reader = results[1]
        for issue in screen_reader['issues']:
            recommendations.append({
                'priority': issue['impact'],
                'category': 'Screen Reader',
                'issue': issue['issue'],
                'recommendation': issue['recommendation']
            })
        
        # Color contrast recommendations
        color_contrast = results[2]
        for issue in color_contrast['issues']:
            recommendations.append({
                'priority': 'high',
                'category': 'Color Contrast',
                'issue': issue['issue'],
                'recommendation': issue['recommendation']
            })
        
        # Alt text recommendations
        alt_text = results[3]
        for issue in alt_text['issues'][:3]:  # Limit to 3
            recommendations.append({
                'priority': 'high',
                'category': 'Alt Text',
                'issue': issue['issue'],
                'recommendation': issue['recommendation']
            })
        
        return recommendations[:10]  # Limit to top 10

if __name__ == "__main__":
    checker = EmailAccessibilityChecker()
    test_email = {
        'id': 'test-590',
        'to': ['user@example.com'],
        'html_content': '''
        <html>
        <body>
            <img src="logo.png">
            <h1>Welcome</h1>
            <h3>Our Services</h3>
            <p>Check out our services. <a href="/services">Click here</a></p>
            <p style="color: #666666; background-color: #999999;">Low contrast text</p>
        </body>
        </html>
        ''',
        'body': 'Welcome to our services. Check out our services.'
    }
    result = checker.check_accessibility(test_email)
    print(json.dumps(result, indent=2))
