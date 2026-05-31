#!/usr/bin/env python3
"""
V935: Email Predictive Analytics Engine
Predicts email volumes, workload distribution, and response bottlenecks.
AI-driven capacity planning for support and sales teams.
"""

import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict
import math


class PredictiveAnalyticsEngine:
    """Predict email patterns and optimize workload distribution."""

    def __init__(self):
        self.historical_data = []
        self.daily_patterns = defaultdict(list)
        self.weekly_patterns = defaultdict(list)
        self.team_capacity = {}

    def add_historical_data(self, data: List[Dict[str, Any]]):
        """Load historical email data for analysis."""
        self.historical_data.extend(data)
        self._build_patterns()

    def _build_patterns(self):
        """Build daily and weekly patterns from historical data."""
        for entry in self.historical_data:
            ts = entry.get('timestamp', '')
            try:
                dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                day_of_week = dt.strftime('%A')
                hour = dt.hour
                self.daily_patterns[hour].append(entry)
                self.weekly_patterns[day_of_week].append(entry)
            except (ValueError, AttributeError):
                continue

    def predict_volume(self, days_ahead: int = 7) -> Dict[str, Any]:
        """Predict email volume for the next N days."""
        if not self.weekly_patterns:
            return self._generate_default_prediction(days_ahead)

        predictions = []
        today = datetime.now()

        for i in range(days_ahead):
            future_date = today + timedelta(days=i)
            day_name = future_date.strftime('%A')
            day_data = self.weekly_patterns.get(day_name, [])

            if day_data:
                avg_volume = len(day_data) / max(len(self.historical_data) / 7, 1)
                predicted_volume = round(avg_volume * (len(self.historical_data) / 7))
            else:
                predicted_volume = round(len(self.historical_data) / 7)

            # Apply seasonal adjustment
            month = future_date.month
            seasonal_factor = self._get_seasonal_factor(month)
            predicted_volume = round(predicted_volume * seasonal_factor)

            # Confidence level
            confidence = min(95, 60 + len(day_data) * 2)

            predictions.append({
                'date': future_date.strftime('%Y-%m-%d'),
                'day': day_name,
                'predicted_volume': predicted_volume,
                'confidence': confidence,
                'peak_hours': self._predict_peak_hours(day_name),
                'recommended_staff': self._recommend_staff(predicted_volume)
            })

        total_predicted = sum(p['predicted_volume'] for p in predictions)
        avg_daily = total_predicted / max(days_ahead, 1)

        return {
            'forecast_days': days_ahead,
            'total_predicted': total_predicted,
            'average_daily': round(avg_daily, 1),
            'peak_day': max(predictions, key=lambda x: x['predicted_volume']),
            'quiet_day': min(predictions, key=lambda x: x['predicted_volume']),
            'predictions': predictions,
            'trend': self._detect_trend()
        }

    def _get_seasonal_factor(self, month: int) -> float:
        """Get seasonal adjustment factor by month."""
        factors = {
            1: 1.15,  # January - post-holiday catch-up
            2: 0.95,  # February - moderate
            3: 1.05,  # March - Q1 close
            4: 1.0,   # April - normal
            5: 1.0,   # May - normal
            6: 1.1,   # June - Q2 close
            7: 0.85,  # July - summer slowdown
            8: 0.9,   # August - summer
            9: 1.15,  # September - back to work
            10: 1.05, # October - Q3 close
            11: 1.1,  # November - pre-holiday rush
            12: 0.8   # December - holiday slowdown
        }
        return factors.get(month, 1.0)

    def _predict_peak_hours(self, day_name: str) -> List[int]:
        """Predict peak email hours for a given day."""
        hour_counts = defaultdict(int)
        for entry in self.weekly_patterns.get(day_name, []):
            ts = entry.get('timestamp', '')
            try:
                dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                hour_counts[dt.hour] += 1
            except:
                continue

        if hour_counts:
            sorted_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)
            return [h for h, _ in sorted_hours[:3]]
        return [9, 11, 14]  # Default peak hours

    def _recommend_staff(self, volume: int) -> int:
        """Recommend number of staff based on predicted volume."""
        # Assume each person can handle ~50 emails/day effectively
        emails_per_person = 50
        return max(1, math.ceil(volume / emails_per_person))

    def _detect_trend(self) -> str:
        """Detect overall email volume trend."""
        if len(self.historical_data) < 14:
            return 'insufficient_data'

        midpoint = len(self.historical_data) // 2
        first_half = len(self.historical_data[:midpoint])
        second_half = len(self.historical_data[midpoint:])

        if second_half > first_half * 1.2:
            return 'increasing'
        elif second_half < first_half * 0.8:
            return 'decreasing'
        return 'stable'

    def _generate_default_prediction(self, days_ahead: int) -> Dict[str, Any]:
        """Generate default prediction when no historical data."""
        today = datetime.now()
        predictions = []
        default_volume = 50  # Default estimate

        for i in range(days_ahead):
            future_date = today + timedelta(days=i)
            predictions.append({
                'date': future_date.strftime('%Y-%m-%d'),
                'day': future_date.strftime('%A'),
                'predicted_volume': default_volume,
                'confidence': 30,
                'peak_hours': [9, 11, 14],
                'recommended_staff': self._recommend_staff(default_volume)
            })

        return {
            'forecast_days': days_ahead,
            'total_predicted': default_volume * days_ahead,
            'average_daily': default_volume,
            'predictions': predictions,
            'trend': 'insufficient_data',
            'note': 'Add more historical data for better predictions'
        }

    def analyze_bottlenecks(self, response_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze response time bottlenecks."""
        if not response_data:
            return {'bottlenecks': [], 'avg_response_minutes': 0, 'recommendations': ['Add response time data for analysis']}

        response_times = []
        hour_response_times = defaultdict(list)
        day_response_times = defaultdict(list)

        for entry in response_data:
            rt = entry.get('response_time_minutes')
            if rt is not None:
                response_times.append(rt)
                ts = entry.get('timestamp', '')
                try:
                    dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    hour_response_times[dt.hour].append(rt)
                    day_response_times[dt.strftime('%A')].append(rt)
                except:
                    continue

        if not response_times:
            return {'bottlenecks': [], 'avg_response_minutes': 0}

        avg_response = sum(response_times) / len(response_times)
        median_response = sorted(response_times)[len(response_times) // 2]

        # Find bottleneck hours
        bottlenecks = []
        for hour, times in hour_response_times.items():
            hour_avg = sum(times) / len(times)
            if hour_avg > avg_response * 1.5:
                bottlenecks.append({
                    'type': 'hour',
                    'identifier': f'{hour:02d}:00',
                    'avg_response': round(hour_avg, 1),
                    'vs_average': f'+{round((hour_avg / avg_response - 1) * 100)}%'
                })

        # Find bottleneck days
        for day, times in day_response_times.items():
            day_avg = sum(times) / len(times)
            if day_avg > avg_response * 1.3:
                bottlenecks.append({
                    'type': 'day',
                    'identifier': day,
                    'avg_response': round(day_avg, 1),
                    'vs_average': f'+{round((day_avg / avg_response - 1) * 100)}%'
                })

        # SLA analysis
        sla_1h = sum(1 for t in response_times if t <= 60) / len(response_times) * 100
        sla_4h = sum(1 for t in response_times if t <= 240) / len(response_times) * 100
        sla_24h = sum(1 for t in response_times if t <= 1440) / len(response_times) * 100

        recommendations = []
        if bottlenecks:
            recommendations.append(f"Consider additional staffing during {len(bottlenecks)} identified bottleneck periods")
        if sla_1h < 50:
            recommendations.append("1-hour SLA compliance below 50% - review staffing and processes")
        if avg_response > 120:
            recommendations.append("Average response time over 2 hours - consider auto-responses for common queries")

        return {
            'avg_response_minutes': round(avg_response, 1),
            'median_response_minutes': round(median_response, 1),
            'total_responses_analyzed': len(response_times),
            'bottlenecks': bottlenecks,
            'sla_compliance': {
                'within_1_hour': round(sla_1h, 1),
                'within_4_hours': round(sla_4h, 1),
                'within_24_hours': round(sla_24h, 1)
            },
            'recommendations': recommendations,
            'reply_all_required': True
        }

    def capacity_planning(self, team_size: int, avg_emails_per_person: int = 50) -> Dict[str, Any]:
        """Generate capacity planning recommendations."""
        current_capacity = team_size * avg_emails_per_person

        # Predict next week's volume
        prediction = self.predict_volume(7)
        predicted_weekly = prediction['total_predicted']

        utilization = (predicted_weekly / max(current_capacity, 1)) * 100

        if utilization > 100:
            status = 'overloaded'
            additional_needed = math.ceil((predicted_weekly - current_capacity) / avg_emails_per_person)
        elif utilization > 85:
            status = 'near_capacity'
            additional_needed = 1
        elif utilization < 50:
            status = 'underutilized'
            additional_needed = 0
        else:
            status = 'optimal'
            additional_needed = 0

        return {
            'team_size': team_size,
            'current_capacity_per_week': current_capacity * 7,
            'predicted_weekly_volume': predicted_weekly,
            'utilization_percent': round(utilization, 1),
            'status': status,
            'additional_staff_needed': additional_needed,
            'recommendation': self._capacity_recommendation(status, additional_needed, utilization)
        }

    def _capacity_recommendation(self, status: str, additional: int, utilization: float) -> str:
        """Generate capacity recommendation."""
        if status == 'overloaded':
            return f"⚠️ Team is overloaded ({utilization:.0f}% utilization). Hire {additional} additional staff or redistribute workload."
        elif status == 'near_capacity':
            return f"⚡ Team nearing capacity ({utilization:.0f}%). Consider 1 additional hire or overtime planning."
        elif status == 'underutilized':
            return f"📊 Team underutilized ({utilization:.0f}%). Could handle more volume or reduce headcount."
        return f"✅ Team capacity is optimal ({utilization:.0f}% utilization). Continue current staffing."


def main():
    """Test the Predictive Analytics Engine."""
    engine = PredictiveAnalyticsEngine()

    # Generate sample historical data (4 weeks)
    import random
    random.seed(42)
    historical = []
    today = datetime.now()

    for days_back in range(28):
        date = today - timedelta(days=days_back)
        day_name = date.strftime('%A')

        # More emails on Mon/Tue, fewer on Fri/weekend
        base = {'Monday': 60, 'Tuesday': 55, 'Wednesday': 50, 'Thursday': 45,
                'Friday': 35, 'Saturday': 10, 'Sunday': 8}
        daily_count = base.get(day_name, 40) + random.randint(-10, 10)

        for j in range(max(1, daily_count)):
            hour = random.choice([8, 9, 9, 10, 10, 10, 11, 11, 13, 14, 14, 15, 16])
            ts = date.replace(hour=hour, minute=random.randint(0, 59))
            historical.append({
                'timestamp': ts.isoformat(),
                'response_time_minutes': random.randint(5, 300),
                'sender': f'user{random.randint(1, 20)}@example.com'
            })

    engine.add_historical_data(historical)

    print("=" * 60)
    print("V935: Predictive Analytics Engine - Test Results")
    print("=" * 60)

    # Volume prediction
    prediction = engine.predict_volume(7)
    print(f"\n7-Day Volume Forecast:")
    print(f"  Total Predicted: {prediction['total_predicted']} emails")
    print(f"  Daily Average: {prediction['average_daily']}")
    print(f"  Trend: {prediction['trend']}")
    print(f"  Peak Day: {prediction['peak_day']['day']} ({prediction['peak_day']['predicted_volume']} emails)")

    print(f"\nDaily Breakdown:")
    for p in prediction['predictions'][:7]:
        print(f"  {p['day'][:3]}: {p['predicted_volume']} emails, Staff: {p['recommended_staff']}, Peak: {p['peak_hours']}")

    # Bottleneck analysis
    bottlenecks = engine.analyze_bottlenecks(historical)
    print(f"\nBottleneck Analysis:")
    print(f"  Avg Response: {bottlenecks['avg_response_minutes']} min")
    print(f"  SLA 1h: {bottlenecks['sla_compliance']['within_1_hour']}%")
    print(f"  SLA 4h: {bottlenecks['sla_compliance']['within_4_hours']}%")
    print(f"  Bottlenecks Found: {len(bottlenecks['bottlenecks'])}")
    for b in bottlenecks['bottlenecks'][:3]:
        print(f"    - {b['type']}: {b['identifier']} ({b['vs_average']} slower)")

    # Capacity planning
    capacity = engine.capacity_planning(team_size=5)
    print(f"\nCapacity Planning (5 staff):")
    print(f"  Utilization: {capacity['utilization_percent']}%")
    print(f"  Status: {capacity['status']}")
    print(f"  {capacity['recommendation']}")

    print(f"\n✅ V935 Predictive Analytics Engine: OPERATIONAL")


if __name__ == '__main__':
    main()
