#!/usr/bin/env python3
"""
Zion Tech Group – Real‑Time Grafana Alerts

Features:
1. Polls Prometheus metrics from Grafana container.
2. Checks for anomalies (e.g., high error rate, low lead conversion).
3. Sends Slack alerts if thresholds are breached.
4. Logs all actions to Zion_Brain_Log.md.
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
        headers = {"Authorization": f"Bearer {os.getenv('GRAFANA_API_KEY', '')}")
        # Get Prometheus datasource
        ds_resp = requests.get(f"{base_url}/datasources", headers=headers)
        if ds_resp.status_code != 200:
            logger(f"Failed to get datasources: {ds_resp.status_code}")
            return None
        
        # Find Prometheus datasource
        prometheus_ds = next((ds for ds in ds_resp.json() if ds["name"] == "Prometheus"), None)
        if not prometheus_ds:
            logger("Prometheus datasource not found.")
            return None
        
        # Query metrics
        query = "rate(http_requests_total[5m])"  # example query
        query_resp = requests.get(f"{base_url}/datasources/proxy/{prometheus_ds["id"]}/api/v1/query", params={"query": query}, headers=headers)
        if query_resp.status_code == 200:
            data = query_resp.json().get("data", {})
            if data.get("resultType") == "vector":
                result = data["result"][0]
                value = result["value"][1]
                logger(f"Prometheus query result: {value}")
                return float(value)
            else:
                logger("Unexpected result type from Prometheus.")
                return None
        else:
            logger(f"Prometheus query failed: {query_resp.status_code}")
            return None
    except Exception as e:
        logger(f"Error checking Prometheus: {e}")
        return None

def send_slack_alert(message: str) -> None:
    """Send Slack alert if thresholds are breached."""
    slack_webhook = os.getenv("SLACK_WEBHOOK_URL")
    if not slack_webhook:
        logger("Slack webhook not configured – skipping alert.")
        return
    
    payload = {
        "text": f"🚨 Zion Tech Alert: {message}",
        "username": "GrafanaBot",
        "icon_emoji": ":chart_with_upwards_trend:"
    }
    
    try:
        resp = requests.post(slack_webhook, json=payload)
        if resp.status_code == 200:
            logger("Slack alert sent.")
        else:
            logger(f"Slack alert failed: {resp.status_code}")
    except Exception as e:
        logger(f"Failed to send Slack alert: {e}")

def main():
    logger("=== Grafana Alerts check started ===")
    value = check_prometheus()
    if value is not None:
        # Example threshold: alert if error rate > 5%
        if value > 0.05:
            send_slack_alert(f"High error rate detected: {value:.2%}")
    else:
        logger("Prometheus query failed – no alert sent.")
    logger("=== Grafana Alerts check finished ===")

if __name__ == "__main__":
    main()