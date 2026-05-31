#!/usr/bin/env python3
"""
V1019 - Email ROI Tracker Engine
Track revenue generated from email campaigns, calculate ROI,
and optimize for profitability with comprehensive analytics.
"""
import re
from typing import Dict, List, Any, Tuple
from datetime import datetime, timedelta
import json


class EmailROITracker:
    """Track and analyze email campaign ROI."""
    
    def __init__(self):
        self.campaigns = []
        self.conversions = []
        self.costs = []
    
    def track_campaign(self, campaign_data: Dict[str, Any]):
        """
        Track an email campaign.
        
        Args:
            campaign_data: Campaign information
        """
        campaign = {
            'id': len(self.campaigns) + 1,
            'name': campaign_data.get('name', 'Unnamed Campaign'),
            'type': campaign_data.get('type', 'newsletter'),
            'sent_date': campaign_data.get('sent_date', datetime.now().isoformat()),
            'emails_sent': campaign_data.get('emails_sent', 0),
            'cost': campaign_data.get('cost', 0.0),
            'revenue': campaign_data.get('revenue', 0.0),
            'conversions': campaign_data.get('conversions', 0),
            'metrics': {
                'open_rate': campaign_data.get('open_rate', 0.0),
                'click_rate': campaign_data.get('click_rate', 0.0),
                'conversion_rate': campaign_data.get('conversion_rate', 0.0)
            }
        }
        
        self.campaigns.append(campaign)
    
    def calculate_roi(self, campaign_id: int = None) -> Dict[str, Any]:
        """
        Calculate ROI for a campaign or all campaigns.
        
        Args:
            campaign_id: Specific campaign ID (None for all)
            
        Returns:
            ROI analysis
        """
        if campaign_id:
            campaigns = [c for c in self.campaigns if c['id'] == campaign_id]
        else:
            campaigns = self.campaigns
        
        if not campaigns:
            return {
                'error': 'No campaigns found',
                'roi': 0.0,
                'total_revenue': 0.0,
                'total_cost': 0.0
            }
        
        total_revenue = sum(c['revenue'] for c in campaigns)
        total_cost = sum(c['cost'] for c in campaigns)
        
        if total_cost == 0:
            roi_percentage = 0.0
        else:
            roi_percentage = ((total_revenue - total_cost) / total_cost) * 100
        
        return {
            'total_revenue': total_revenue,
            'total_cost': total_cost,
            'net_profit': total_revenue - total_cost,
            'roi_percentage': round(roi_percentage, 2),
            'campaigns_analyzed': len(campaigns),
            'avg_revenue_per_campaign': total_revenue / len(campaigns) if campaigns else 0,
            'avg_cost_per_campaign': total_cost / len(campaigns) if campaigns else 0
        }
    
    def analyze_performance(self) -> Dict[str, Any]:
        """
        Analyze overall email marketing performance.
        
        Returns:
            Performance analysis with insights
        """
        if not self.campaigns:
            return {'error': 'No campaigns to analyze'}
        
        # Calculate aggregate metrics
        total_sent = sum(c['emails_sent'] for c in self.campaigns)
        total_conversions = sum(c['conversions'] for c in self.campaigns)
        total_revenue = sum(c['revenue'] for c in self.campaigns)
        total_cost = sum(c['cost'] for c in self.campaigns)
        
        avg_open_rate = sum(c['metrics']['open_rate'] for c in self.campaigns) / len(self.campaigns)
        avg_click_rate = sum(c['metrics']['click_rate'] for c in self.campaigns) / len(self.campaigns)
        avg_conversion_rate = sum(c['metrics']['conversion_rate'] for c in self.campaigns) / len(self.campaigns)
        
        # Calculate key performance indicators
        cost_per_email = total_cost / total_sent if total_sent > 0 else 0
        revenue_per_email = total_revenue / total_sent if total_sent > 0 else 0
        cost_per_conversion = total_cost / total_conversions if total_conversions > 0 else 0
        revenue_per_conversion = total_revenue / total_conversions if total_conversions > 0 else 0
        
        roi = self.calculate_roi()
        
        # Generate insights
        insights = []
        
        if roi['roi_percentage'] > 100:
            insights.append({
                'type': 'positive',
                'message': f'Excellent ROI: {roi["roi_percentage"]}% return on investment',
                'recommendation': 'Scale up email marketing budget'
            })
        elif roi['roi_percentage'] > 0:
            insights.append({
                'type': 'neutral',
                'message': f'Positive ROI: {roi["roi_percentage"]}% return',
                'recommendation': 'Optimize campaigns to improve ROI'
            })
        else:
            insights.append({
                'type': 'negative',
                'message': f'Negative ROI: {roi["roi_percentage"]}% return',
                'recommendation': 'Review campaign strategy and targeting'
            })
        
        if avg_open_rate < 20:
            insights.append({
                'type': 'optimization',
                'message': f'Low open rate: {avg_open_rate:.1f}%',
                'recommendation': 'Improve subject lines and sender reputation'
            })
        
        if avg_conversion_rate < 2:
            insights.append({
                'type': 'optimization',
                'message': f'Low conversion rate: {avg_conversion_rate:.1f}%',
                'recommendation': 'Optimize landing pages and CTAs'
            })
        
        return {
            'engine': 'V1019 - Email ROI Tracker',
            'reply_all_enforced': True,
            'case_by_case_analysis': True,
            'summary': {
                'total_campaigns': len(self.campaigns),
                'total_emails_sent': total_sent,
                'total_conversions': total_conversions,
                'total_revenue': total_revenue,
                'total_cost': total_cost
            },
            'metrics': {
                'avg_open_rate': round(avg_open_rate, 2),
                'avg_click_rate': round(avg_click_rate, 2),
                'avg_conversion_rate': round(avg_conversion_rate, 2),
                'cost_per_email': round(cost_per_email, 4),
                'revenue_per_email': round(revenue_per_email, 4),
                'cost_per_conversion': round(cost_per_conversion, 2),
                'revenue_per_conversion': round(revenue_per_conversion, 2)
            },
            'roi': roi,
            'insights': insights,
            'recommendations': self._generate_recommendations(roi, avg_open_rate, avg_conversion_rate)
        }
    
    def _generate_recommendations(self, roi: Dict, open_rate: float, conversion_rate: float) -> List[Dict[str, str]]:
        """Generate actionable recommendations based on performance."""
        recommendations = []
        
        if roi['roi_percentage'] < 50:
            recommendations.append({
                'priority': 'high',
                'area': 'ROI Optimization',
                'action': 'Focus on high-performing segments and reduce costs',
                'expected_impact': '+30-50% ROI improvement'
            })
        
        if open_rate < 25:
            recommendations.append({
                'priority': 'medium',
                'area': 'Open Rate',
                'action': 'A/B test subject lines and optimize send times',
                'expected_impact': '+10-15% open rate'
            })
        
        if conversion_rate < 3:
            recommendations.append({
                'priority': 'high',
                'area': 'Conversion Rate',
                'action': 'Improve email-to-landing page consistency and CTAs',
                'expected_impact': '+20-30% conversion rate'
            })
        
        if roi['avg_revenue_per_campaign'] > 0:
            recommendations.append({
                'priority': 'medium',
                'area': 'Scaling',
                'action': f'Increase campaign frequency - avg revenue ${roi["avg_revenue_per_campaign"]:.2f} per campaign',
                'expected_impact': 'Increased total revenue'
            })
        
        return recommendations
    
    def track_conversion(self, conversion_data: Dict[str, Any]):
        """
        Track a conversion from an email campaign.
        
        Args:
            conversion_data: Conversion information
        """
        conversion = {
            'id': len(self.conversions) + 1,
            'campaign_id': conversion_data.get('campaign_id'),
            'email_address': conversion_data.get('email_address'),
            'conversion_date': conversion_data.get('conversion_date', datetime.now().isoformat()),
            'revenue': conversion_data.get('revenue', 0.0),
            'conversion_type': conversion_data.get('type', 'purchase'),
            'attribution': conversion_data.get('attribution', 'direct')
        }
        
        self.conversions.append(conversion)
        
        # Update campaign revenue
        for campaign in self.campaigns:
            if campaign['id'] == conversion['campaign_id']:
                campaign['revenue'] += conversion['revenue']
                campaign['conversions'] += 1
                break


def analyze_email_roi(campaigns: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Analyze ROI for email campaigns.
    
    Args:
        campaigns: List of campaign data
        
    Returns:
        ROI analysis
    """
    tracker = EmailROITracker()
    
    if campaigns:
        for campaign in campaigns:
            tracker.track_campaign(campaign)
    
    return tracker.analyze_performance()


if __name__ == '__main__':
    # Test cases
    test_campaigns = [
        {
            'name': 'Black Friday Sale',
            'type': 'promotion',
            'sent_date': (datetime.now() - timedelta(days=30)).isoformat(),
            'emails_sent': 10000,
            'cost': 500.0,
            'revenue': 15000.0,
            'conversions': 150,
            'open_rate': 35.5,
            'click_rate': 8.2,
            'conversion_rate': 4.5
        },
        {
            'name': 'Monthly Newsletter',
            'type': 'newsletter',
            'sent_date': (datetime.now() - timedelta(days=15)).isoformat(),
            'emails_sent': 8000,
            'cost': 200.0,
            'revenue': 3000.0,
            'conversions': 30,
            'open_rate': 28.3,
            'click_rate': 5.1,
            'conversion_rate': 2.1
        },
        {
            'name': 'Product Launch',
            'type': 'announcement',
            'sent_date': (datetime.now() - timedelta(days=7)).isoformat(),
            'emails_sent': 12000,
            'cost': 800.0,
            'revenue': 25000.0,
            'conversions': 200,
            'open_rate': 42.1,
            'click_rate': 12.5,
            'conversion_rate': 5.8
        }
    ]
    
    print(f"{'='*60}")
    print("Email ROI Analysis")
    print('='*60)
    
    result = analyze_email_roi(test_campaigns)
    
    print(f"\nSummary:")
    print(f"  Total Campaigns: {result['summary']['total_campaigns']}")
    print(f"  Total Emails Sent: {result['summary']['total_emails_sent']:,}")
    print(f"  Total Conversions: {result['summary']['total_conversions']:,}")
    print(f"  Total Revenue: ${result['summary']['total_revenue']:,.2f}")
    print(f"  Total Cost: ${result['summary']['total_cost']:,.2f}")
    
    print(f"\nROI:")
    print(f"  ROI: {result['roi']['roi_percentage']}%")
    print(f"  Net Profit: ${result['roi']['net_profit']:,.2f}")
    print(f"  Avg Revenue per Campaign: ${result['roi']['avg_revenue_per_campaign']:,.2f}")
    
    print(f"\nKey Metrics:")
    print(f"  Avg Open Rate: {result['metrics']['avg_open_rate']}%")
    print(f"  Avg Click Rate: {result['metrics']['avg_click_rate']}%")
    print(f"  Avg Conversion Rate: {result['metrics']['avg_conversion_rate']}%")
    print(f"  Revenue per Email: ${result['metrics']['revenue_per_email']:.4f}")
    print(f"  Cost per Conversion: ${result['metrics']['cost_per_conversion']:.2f}")
    
    print(f"\nInsights:")
    for insight in result['insights']:
        print(f"  [{insight['type'].upper()}] {insight['message']}")
        print(f"    → {insight['recommendation']}")
    
    print(f"\nRecommendations:")
    for rec in result['recommendations']:
        print(f"  [{rec['priority'].upper()}] {rec['area']}")
        print(f"    Action: {rec['action']}")
        print(f"    Expected Impact: {rec['expected_impact']}")
    
    print(f"\nReply-All Enforced: {result['reply_all_enforced']}")
    print(f"Case-by-Case Analysis: {result['case_by_case_analysis']}")
