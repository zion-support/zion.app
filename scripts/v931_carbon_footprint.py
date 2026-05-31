#!/usr/bin/env python3
"""
V931: Email Carbon Footprint Calculator
Calculates the environmental impact of email storage and transmission.
Tracks CO2 emissions and generates sustainability reports for ESG goals.
"""

import re
from datetime import datetime
from typing import Dict, List, Any, Optional


class EmailCarbonCalculator:
    """Calculate and track carbon footprint from email communications."""

    # Average carbon emissions per email (grams CO2)
    CARBON_PER_EMAIL_SMALL = 0.3  # Short email, no attachments
    CARBON_PER_EMAIL_MEDIUM = 4.0  # Average email with some content
    CARBON_PER_EMAIL_LARGE = 50.0  # Email with attachments
    CARBON_PER_ATTACHMENT_MB = 2.0  # Per MB of attachments
    CARBON_STORAGE_PER_YEAR = 0.01  # Per email stored per year

    def __init__(self):
        self.email_log = []
        self.total_carbon = 0.0
        self.equivalencies = {
            'trees': 21.77,  # kg CO2 absorbed per tree per year
            'car_miles': 0.411,  # kg CO2 per car mile
            'smartphone_charges': 0.0082,  # kg CO2 per smartphone charge
        }

    def analyze_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze carbon footprint of an email."""
        recipients = email_data.get('recipients', [])
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        attachments = email_data.get('attachments', [])
        is_reply_all = email_data.get('is_reply_all', False)

        # Calculate email size metrics
        body_size = len(body.encode('utf-8')) if body else 0
        subject_size = len(subject.encode('utf-8')) if subject else 0
        attachment_size = sum(a.get('size_mb', 0) for a in attachments)
        recipient_count = len(recipients)

        # Determine email size category
        if attachment_size > 0:
            size_category = 'large'
            base_carbon = self.CARBON_PER_EMAIL_LARGE + (attachment_size * self.CARBON_PER_ATTACHMENT_MB)
        elif body_size > 5000:
            size_category = 'large'
            base_carbon = self.CARBON_PER_EMAIL_LARGE
        elif body_size > 1000:
            size_category = 'medium'
            base_carbon = self.CARBON_PER_EMAIL_MEDIUM
        else:
            size_category = 'small'
            base_carbon = self.CARBON_PER_EMAIL_SMALL

        # Multiply by recipient count (each recipient = separate email sent)
        total_carbon = base_carbon * max(recipient_count, 1)

        # Reply-all multiplier warning
        reply_all_warning = False
        if is_reply_all and recipient_count > 5:
            reply_all_warning = True

        # Calculate equivalencies
        carbon_kg = total_carbon / 1000.0
        tree_equivalent = carbon_kg / self.equivalencies['trees']
        car_miles = carbon_kg / self.equivalencies['car_miles']
        phone_charges = carbon_kg / self.equivalencies['smartphone_charges']

        # Track
        self.total_carbon += total_carbon
        self.email_log.append({
            'timestamp': datetime.now().isoformat(),
            'carbon_grams': round(total_carbon, 2),
            'recipients': recipient_count,
            'size_category': size_category,
            'attachments_mb': round(attachment_size, 2)
        })

        # Generate optimization suggestions
        suggestions = self._generate_suggestions(size_category, recipient_count, attachment_size, is_reply_all)

        # Calculate carbon score (lower is better)
        score = self._calculate_score(total_carbon)

        result = {
            'carbon_grams': round(total_carbon, 2),
            'carbon_kg': round(carbon_kg, 6),
            'size_category': size_category,
            'recipients': recipient_count,
            'attachment_size_mb': round(attachment_size, 2),
            'equivalencies': {
                'trees_per_year': round(tree_equivalent, 6),
                'car_miles': round(car_miles, 4),
                'smartphone_charges': round(phone_charges, 1)
            },
            'carbon_score': score,
            'reply_all_warning': reply_all_warning,
            'suggestions': suggestions,
            'reply_all_required': recipient_count > 1
        }

        return result

    def _calculate_score(self, carbon_grams: float) -> str:
        """Calculate carbon efficiency score."""
        if carbon_grams < 1:
            return 'A+ (Excellent)'
        elif carbon_grams < 5:
            return 'A (Very Good)'
        elif carbon_grams < 15:
            return 'B (Good)'
        elif carbon_grams < 50:
            return 'C (Average)'
        elif carbon_grams < 100:
            return 'D (Below Average)'
        else:
            return 'F (High Impact)'

    def _generate_suggestions(self, size_cat: str, recipients: int,
                              attachment_mb: float, reply_all: bool) -> List[str]:
        """Generate carbon reduction suggestions."""
        suggestions = []

        if size_cat == 'large' and attachment_mb > 5:
            suggestions.append(f"Consider using cloud storage links instead of {attachment_mb:.1f}MB attachments")
        if recipients > 10:
            suggestions.append(f"Review if all {recipients} recipients need this email")
        if reply_all and recipients > 5:
            suggestions.append("Reply-all sends to many recipients - consider if everyone needs this response")
        if size_cat == 'medium' and attachment_mb == 0:
            suggestions.append("Consider using instant messaging for shorter communications")
        if not suggestions:
            suggestions.append("Good job! This email has a low carbon footprint")

        return suggestions

    def generate_report(self) -> Dict[str, Any]:
        """Generate cumulative carbon footprint report."""
        total_emails = len(self.email_log)
        total_carbon_kg = self.total_carbon / 1000.0

        return {
            'total_emails_analyzed': total_emails,
            'total_carbon_kg': round(total_carbon_kg, 4),
            'total_carbon_grams': round(self.total_carbon, 2),
            'average_carbon_per_email': round(self.total_carbon / max(total_emails, 1), 2),
            'annual_projection_kg': round(total_carbon_kg * 252, 4),  # ~252 working days
            'trees_needed_per_year': round((total_carbon_kg * 252) / self.equivalencies['trees'], 2),
            'car_miles_equivalent': round(total_carbon_kg / self.equivalencies['car_miles'], 2),
            'esg_ready': True
        }


def main():
    """Test the Carbon Calculator."""
    calc = EmailCarbonCalculator()

    test_emails = [
        {
            'subject': 'Quick check-in',
            'body': 'Hey, are we still on for tomorrow?',
            'recipients': ['alice@example.com'],
            'attachments': [],
            'is_reply_all': False
        },
        {
            'subject': 'Q4 Report with Attachments',
            'body': 'Please find attached the quarterly reports for your review. ' * 50,
            'recipients': ['team@example.com', 'manager@example.com', 'finance@example.com',
                          'ops@example.com', 'hr@example.com', 'legal@example.com'],
            'attachments': [
                {'name': 'report.pdf', 'size_mb': 12.5},
                {'name': 'data.xlsx', 'size_mb': 3.2}
            ],
            'is_reply_all': True
        },
        {
            'subject': 'Meeting notes',
            'body': 'Thanks everyone for the productive meeting. Action items listed below.',
            'recipients': ['dev@example.com', 'qa@example.com', 'pm@example.com'],
            'attachments': [],
            'is_reply_all': True
        }
    ]

    print("=" * 60)
    print("V931: Email Carbon Footprint Calculator - Test Results")
    print("=" * 60)

    for email in test_emails:
        result = calc.analyze_email(email)
        print(f"\nSubject: {email['subject']}")
        print(f"  Carbon: {result['carbon_grams']}g CO2 ({result['carbon_score']})")
        print(f"  Size: {result['size_category']}, Recipients: {result['recipients']}")
        print(f"  Equivalencies: {result['equivalencies']['car_miles']} car miles")
        if result['reply_all_warning']:
            print(f"  ⚠️ Reply-all warning triggered")
        for s in result['suggestions']:
            print(f"  💡 {s}")

    report = calc.generate_report()
    print(f"\n{'='*60}")
    print("Cumulative Report:")
    print(f"  Total Emails: {report['total_emails_analyzed']}")
    print(f"  Total Carbon: {report['total_carbon_grams']}g CO2")
    print(f"  Annual Projection: {report['annual_projection_kg']}kg CO2")
    print(f"  Trees Needed/Year: {report['trees_needed_per_year']}")
    print(f"  ESG Report Ready: {report['esg_ready']}")
    print(f"\n✅ V931 Carbon Footprint Calculator: OPERATIONAL")


if __name__ == '__main__':
    main()
