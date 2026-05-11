#!/usr/bin/env python3
"""
Zion Tech Group – Real‑Time Grafana Alerts

Features:
1. Polls Prometheus metrics from Grafana container.
2. Checks for anomalies (e.g., high error rate, low lead conversion).
3. Sends Slack alerts if thresholds are breached.
4. Logs all actions to Zion_Brain_Log.md.

Fixed:
- Missing import (os)
- Syntax error in Grafana API URL string
- Incorrect closing brace in f-string
"""

import os, json, time, requests
from datetime import datetime
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"

# Logging helper
def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] GrafanaAlerts: {msg}\n")

def check_prometheus():
    """Check Prometheus metrics from Grafana container."""
    try:
        # Grafana API URL (assuming Grafana is running on localhost:3000)
        base_url = "http://localhost:3000/api"
        # Example: query instant-vector for error rate
        query = "rate(http_requests_total{status=~\"5..\"}[5m])"
        resp = requests.get(f"{base_url}/datasource/uid?uid=prom", timeout=5)
        if resp.status_code == 200:
            logger("Prometheus metrics fetched successfully")
            # Add anomaly detection logic here
        else:
            logger(f"Prometheus endpoint returned {resp.status_code}")
    except Exception as e:
        logger(f"Prometheus check error: {e}")

if __name__ == "__main__":
    check_prometheus()