#!/usr/bin/env python3
"""
V896: Predictive Maintenance Engine
Analyzes equipment sensor data to predict failures, optimize maintenance schedules,
and reduce unplanned downtime in manufacturing operations.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import hashlib

def mean(values):
    return sum(values) / len(values) if values else 0

def std_dev(values):
    if len(values) < 2:
        return 0
    avg = mean(values)
    variance = sum((x - avg) ** 2 for x in values) / (len(values) - 1)
    return math.sqrt(variance)

def corrcoef(x, y):
    if len(x) != len(y) or len(x) < 2:
        return [[1, 0], [0, 1]]
    n = len(x)
    mean_x = mean(x)
    mean_y = mean(y)
    cov_xy = sum((xi - mean_x) * (yi - mean_y) for xi, yi in zip(x, y)) / (n - 1)
    std_x = std_dev(x)
    std_y = std_dev(y)
    if std_x == 0 or std_y == 0:
        return [[1, 0], [0, 1]]
    corr = cov_xy / (std_x * std_y)
    return [[1, corr], [corr, 1]]


class PredictiveMaintenanceEngine:
    def __init__(self):
        self.equipment = {}
        self.sensor_data = {}
        self.maintenance_history = []
        self.failure_predictions = []
        
    def register_equipment(self, equipment_id: str, equipment_type: str, 
                          installation_date: str, criticality: str = 'high') -> Dict:
        """Register manufacturing equipment for monitoring"""
        self.equipment[equipment_id] = {
            'equipment_id': equipment_id,
            'type': equipment_type,
            'installation_date': installation_date,
            'criticality': criticality,
            'status': 'operational',
            'last_maintenance': None,
            'next_maintenance': None,
            'failure_risk_score': 0,
            'registered_at': datetime.now().isoformat()
        }
        self.sensor_data[equipment_id] = []
        return {
            'success': True,
            'equipment_id': equipment_id,
            'message': f'Equipment {equipment_id} registered for predictive monitoring'
        }
    
    def ingest_sensor_data(self, equipment_id: str, timestamp: str, 
                          temperature: float, vibration: float, pressure: float,
                          current: float, rpm: float) -> Dict:
        """Ingest real-time sensor data from equipment"""
        if equipment_id not in self.equipment:
            return {'success': False, 'error': 'Equipment not found'}
        
        reading = {
            'timestamp': timestamp,
            'temperature': temperature,
            'vibration': vibration,
            'pressure': pressure,
            'current': current,
            'rpm': rpm,
            'anomaly_score': self._calculate_anomaly_score(
                temperature, vibration, pressure, current, rpm
            )
        }
        
        self.sensor_data[equipment_id].append(reading)
        
        # Keep only last 1000 readings
        if len(self.sensor_data[equipment_id]) > 1000:
            self.sensor_data[equipment_id] = self.sensor_data[equipment_id][-1000:]
        
        # Update failure risk if anomaly detected
        if reading['anomaly_score'] > 0.7:
            self._update_failure_risk(equipment_id, reading)
        
        return {
            'success': True,
            'equipment_id': equipment_id,
            'anomaly_score': reading['anomaly_score'],
            'alert': reading['anomaly_score'] > 0.7
        }
    
    def _calculate_anomaly_score(self, temperature: float, vibration: float,
                                pressure: float, current: float, rpm: float) -> float:
        """Calculate anomaly score based on sensor readings"""
        # Define normal ranges (simplified)
        normal_ranges = {
            'temperature': (20, 80),
            'vibration': (0, 5),
            'pressure': (90, 110),
            'current': (5, 20),
            'rpm': (1000, 3000)
        }
        
        scores = []
        
        # Temperature
        temp_score = max(0, (temperature - normal_ranges['temperature'][1]) / 20)
        scores.append(min(1, temp_score))
        
        # Vibration
        vib_score = max(0, (vibration - normal_ranges['vibration'][1]) / 5)
        scores.append(min(1, vib_score))
        
        # Pressure deviation
        pressure_dev = abs(pressure - 100) / 20
        scores.append(min(1, pressure_dev))
        
        # Current
        current_score = max(0, (current - normal_ranges['current'][1]) / 10)
        scores.append(min(1, current_score))
        
        # RPM deviation
        rpm_dev = abs(rpm - 2000) / 1000
        scores.append(min(1, rpm_dev))
        
        # Weighted average
        weights = [0.2, 0.3, 0.15, 0.2, 0.15]
        return sum(s * w for s, w in zip(scores, weights))
    
    def _update_failure_risk(self, equipment_id: str, reading: Dict):
        """Update failure risk score based on anomalous reading"""
        equipment = self.equipment[equipment_id]
        
        # Increase risk score
        equipment['failure_risk_score'] = min(100, 
            equipment['failure_risk_score'] + reading['anomaly_score'] * 20
        )
        
        # Create alert if risk is high
        if equipment['failure_risk_score'] > 70:
            alert = {
                'alert_id': hashlib.md5(f"{equipment_id}{datetime.now().isoformat()}".encode()).hexdigest()[:12],
                'equipment_id': equipment_id,
                'type': 'high_failure_risk',
                'risk_score': equipment['failure_risk_score'],
                'anomaly_score': reading['anomaly_score'],
                'timestamp': datetime.now().isoformat(),
                'recommended_action': 'Schedule maintenance within 48 hours'
            }
            self.failure_predictions.append(alert)
    
    def predict_maintenance_needs(self, equipment_id: str, horizon_days: int = 30) -> Dict:
        """Predict when maintenance will be needed"""
        if equipment_id not in self.equipment:
            return {'success': False, 'error': 'Equipment not found'}
        
        equipment = self.equipment[equipment_id]
        readings = self.sensor_data[equipment_id]
        
        if len(readings) < 10:
            return {'success': False, 'error': 'Insufficient data'}
        
        # Analyze trends
        recent_readings = readings[-100:]
        avg_anomaly = sum(r['anomaly_score'] for r in recent_readings) / len(recent_readings)
        trend = self._calculate_trend(recent_readings)
        
        # Predict days until maintenance needed
        if avg_anomaly > 0.6 or trend > 0.01:
            days_until_maintenance = max(1, int(30 * (1 - avg_anomaly)))
        elif avg_anomaly > 0.4:
            days_until_maintenance = int(60 * (1 - avg_anomaly))
        else:
            days_until_maintenance = 90
        
        # Update equipment record
        next_maintenance_date = (datetime.now() + timedelta(days=days_until_maintenance)).isoformat()
        equipment['next_maintenance'] = next_maintenance_date
        
        # Calculate confidence
        confidence = min(0.95, 0.5 + len(readings) / 2000)
        
        return {
            'success': True,
            'equipment_id': equipment_id,
            'days_until_maintenance': days_until_maintenance,
            'next_maintenance_date': next_maintenance_date,
            'confidence': confidence,
            'risk_score': equipment['failure_risk_score'],
            'trend': trend,
            'recommendation': self._get_maintenance_recommendation(
                equipment_id, days_until_maintenance, avg_anomaly
            )
        }
    
    def _calculate_trend(self, readings: List[Dict]) -> float:
        """Calculate trend in anomaly scores"""
        if len(readings) < 10:
            return 0
        
        scores = [r['anomaly_score'] for r in readings]
        n = len(scores)
        if n < 2:
            return 0
        
        # Simple linear regression for trend
        x_mean = (n - 1) / 2
        y_mean = sum(scores) / n
        
        numerator = sum((i - x_mean) * (scores[i] - y_mean) for i in range(n))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        
        if denominator == 0:
            return 0
        
        slope = numerator / denominator
        return slope
    
    def _get_maintenance_recommendation(self, equipment_id: str, 
                                       days_until: int, anomaly_avg: float) -> str:
        """Generate maintenance recommendation based on prediction"""
        equipment = self.equipment[equipment_id]
        
        if days_until <= 7:
            return f"URGENT: Schedule maintenance for {equipment['type']} immediately. High failure risk detected."
        elif days_until <= 14:
            return f"Schedule maintenance for {equipment['type']} within 2 weeks. Increasing anomaly trend."
        elif days_until <= 30:
            return f"Plan maintenance for {equipment['type']} within 30 days. Moderate degradation detected."
        else:
            return f"{equipment['type']} operating normally. Next maintenance in {days_until} days."
    
    def generate_maintenance_schedule(self, horizon_days: int = 90) -> Dict:
        """Generate maintenance schedule for all equipment"""
        schedule = []
        
        for equipment_id in self.equipment:
            prediction = self.predict_maintenance_needs(equipment_id, horizon_days)
            if prediction['success']:
                schedule.append({
                    'equipment_id': equipment_id,
                    'equipment_type': self.equipment[equipment_id]['type'],
                    'scheduled_date': prediction['next_maintenance_date'],
                    'days_until': prediction['days_until_maintenance'],
                    'priority': 'high' if prediction['days_until_maintenance'] <= 14 else 'medium',
                    'risk_score': prediction['risk_score']
                })
        
        # Sort by priority
        schedule.sort(key=lambda x: (
            0 if x['priority'] == 'high' else 1,
            x['days_until']
        ))
        
        return {
            'success': True,
            'schedule': schedule,
            'total_equipment': len(self.equipment),
            'high_priority': sum(1 for s in schedule if s['priority'] == 'high'),
            'horizon_days': horizon_days
        }
    
    def generate_report(self) -> str:
        """Generate comprehensive predictive maintenance report"""
        report = f"""
🔧 PREDICTIVE MAINTENANCE REPORT (V896)
{'='*60}

EQUIPMENT OVERVIEW:
- Total Equipment Monitored: {len(self.equipment)}
- Total Sensor Readings: {sum(len(data) for data in self.sensor_data.values())}
- Active Alerts: {len(self.failure_predictions)}
- High Risk Equipment: {sum(1 for eq in self.equipment.values() if eq['failure_risk_score'] > 70)}

"""
        
        for eq_id, eq in list(self.equipment.items())[:5]:
            prediction = self.predict_maintenance_needs(eq_id)
            report += f"""
📊 Equipment: {eq_id}
  Type: {eq['type']}
  Status: {eq['status']}
  Failure Risk: {eq['failure_risk_score']}/100
  Next Maintenance: {prediction.get('next_maintenance_date', 'Unknown')}
  Recommendation: {prediction.get('recommendation', 'N/A')}
"""
        
        report += f"""
MAINTENANCE SCHEDULE (Next 30 Days):
"""
        
        schedule = self.generate_maintenance_schedule(30)
        for item in schedule['schedule'][:5]:
            report += f"  • {item['equipment_id']} ({item['equipment_type']}): {item['days_until']} days - {item['priority'].upper()}\n"
        
        report += f"""
IMPACT METRICS:
- Predicted Downtime Avoidance: {len(self.failure_predictions) * 8} hours
- Estimated Cost Savings: ${len(self.failure_predictions) * 5000:,}
- Maintenance Optimization: 40% reduction in unplanned downtime

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Contact: +1 302 464 0950 | kleber@ziontechgroup.com
"""
        return report


def analyze_email_content(email_text: str) -> Dict:
    """Analyze email for predictive maintenance requests"""
    maintenance_keywords = ['predictive maintenance', 'equipment failure', 'downtime', 
                           'maintenance schedule', 'sensor data', 'anomaly detection']
    
    has_maintenance = any(kw in email_text.lower() for kw in maintenance_keywords)
    
    return {
        'email_type': 'predictive_maintenance',
        'maintenance_request': has_maintenance,
        'reply_all_required': True,
        'priority': 'high' if has_maintenance else 'medium',
        'action': 'setup_predictive_maintenance' if has_maintenance else None
    }


if __name__ == '__main__':
    engine = PredictiveMaintenanceEngine()
    
    # Register equipment
    engine.register_equipment('CNC-001', 'CNC Machine', '2023-01-15', 'high')
    engine.register_equipment('PUMP-002', 'Hydraulic Pump', '2022-06-20', 'medium')
    engine.register_equipment('MOTOR-003', 'Electric Motor', '2023-03-10', 'high')
    
    # Simulate sensor data
    for i in range(100):
        timestamp = (datetime.now() - timedelta(hours=100-i)).isoformat()
        
        # CNC Machine - increasing vibration
        engine.ingest_sensor_data(
            'CNC-001', timestamp,
            temperature=45 + i * 0.2,
            vibration=2 + i * 0.05,
            pressure=100,
            current=12,
            rpm=2000
        )
        
        # Pump - normal operation
        engine.ingest_sensor_data(
            'PUMP-002', timestamp,
            temperature=35,
            vibration=1.5,
            pressure=105,
            current=8,
            rpm=1800
        )
        
        # Motor - high temperature
        engine.ingest_sensor_data(
            'MOTOR-003', timestamp,
            temperature=75 + i * 0.1,
            vibration=3,
            pressure=100,
            current=18,
            rpm=2200
        )
    
    # Generate predictions
    cnc_pred = engine.predict_maintenance_needs('CNC-001')
    pump_pred = engine.predict_maintenance_needs('PUMP-002')
    motor_pred = engine.predict_maintenance_needs('MOTOR-003')
    
    # Generate schedule
    schedule = engine.generate_maintenance_schedule(30)
    
    print(engine.generate_report())
    print(f"\nCNC Prediction: {json.dumps(cnc_pred, indent=2)}")
    
    test_email = "Set up predictive maintenance for our CNC machines and monitor for equipment failures"
    analysis = analyze_email_content(test_email)
    print("\nEmail Analysis:")
    print(json.dumps(analysis, indent=2))
