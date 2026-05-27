#!/usr/bin/env python3
"""
Zion Tech Group – Grafana Deployment Agent

Features:
1. Ensures a Grafana container is running (Docker).
2. Mounts a pre-built dashboard JSON (grafana_dashboard.json).
3. Configures Prometheus as a data source (assumes Prometheus is reachable at http://host.docker.internal:9090).
4. Logs every step to Zion_Brain_Log.md.
5. Self-healing: restarts container if it crashes.
"""

import os, json, subprocess, time
from datetime import datetime
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
DASH_JSON = WORKDIR / "grafana_dashboard.json"

# Ensure dashboard file exists
DASH_JSON.parent.mkdir(parents=True, exist_ok=True)
if not DASH_JSON.exists():
    # Create a minimal dashboard placeholder
    DASH_JSON.write_text(json.dumps({
        "dashboard": {
            "title": "Zion Tech Group Metrics",
            "panels": [
                {"type": "graph", "title": "Leads", "targets": [{"expr": "zion_leads_total"}]},
                {"type": "graph", "title": "Conversion Rate", "targets": [{"expr": "zion_leads_converted / zion_leads_total"}]}
            ]
        }
    }, indent=2))
    LOG_MD.open("a", encoding="utf-8").write(f"- [{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}] Grafana: Created placeholder dashboard.\n")

def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] GrafanaDeploy: {msg}\n")

def container_running() -> bool:
    try:
        out = subprocess.check_output(
            ["docker", "ps", "--filter", "name=grafana", "--format", "{{.Names}}"],
            text=True
        )
        return "grafana" in out.strip()
    except subprocess.CalledProcessError:
        return False

def start_grafana() -> None:
    logger("Starting Grafana container...")
    # Pull latest image (quiet if already present)
    subprocess.run(["docker", "pull", "grafana/grafana"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # Run container with persistent volume for dashboards
    # Use a named volume for simplicity
    vol_path = WORKDIR / "grafana_data"
    vol_path.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        "docker", "run", "-d",
        "--name", "grafana",
        "-p", "3000:3000",
        "-v", f"{vol_path}:/var/lib/grafana",
        "-e", "GF_SECURITY_ADMIN_PASSWORD=admin",
        "grafana/grafana"
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    logger("Grafana container launched (port 3000).")

def stop_old_grafana() -> None:
    """Stop and remove any existing grafana container."""
    try:
        subprocess.run(["docker", "rm", "-f", "grafana"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        logger("Stopped and removed old Grafana container.")
    except subprocess.CalledProcessError:
        pass  # container didn't exist

def configure_datasource_and_dashboard() -> None:
    """Uses Grafana HTTP API to add Prometheus datasource and upload dashboard."""
    try:
        import requests
    except ImportError:
        logger("requests library missing – cannot configure Grafana. Install with pip install requests.")
        return
    base = "http://localhost:3000/api"
    auth = ("admin", "admin")

    # 1️⃣ Add Prometheus datasource (idempotent: try to create, ignore if exists)
    ds_payload = {
        "name": "Prometheus",
        "type": "prometheus",
        "url": "http://host.docker.internal:9090",
        "access": "proxy",
        "basicAuth": False,
        "isDefault": True
    }
    try:
        r = requests.post(f"{base}/datasources", json=ds_payload, auth=auth)
        if r.status_code == 200:
            logger("Prometheus datasource added.")
        elif r.status_code == 409:
            logger("Prometheus datasource already exists.")
        else:
            logger(f"Datasource config returned {r.status_code}")
    except Exception as e:
        logger(f"Datasource configuration failed: {e}")

    # 2️⃣ Upload dashboard JSON
    if DASH_JSON.exists():
        with DASH_JSON.open() as f:
            dash = json.load(f)
        dash_payload = {"dashboard": dash, "overwrite": True}
        try:
            r = requests.post(f"{base}/dashboards/db", json=dash_payload, auth=auth)
            if r.status_code == 200:
                logger("Grafana dashboard uploaded.")
            else:
                logger(f"Dashboard upload returned {r.status_code}")
        except Exception as e:
            logger(f"Dashboard upload failed: {e}")
    else:
        logger("Dashboard JSON not found – skipping upload.")

def main() -> None:
    logger("=== Grafana Deployment Agent started ===")
    # If container not running, start it
    if not container_running():
        # In case a dead container exists with same name, remove it first
        stop_old_grafana()
        start_grafana()
        time.sleep(5)  # give container time to start
    else:
        logger("Grafana container already running.")
    configure_datasource_and_dashboard()
    logger("=== Grafana Deployment Agent finished ===")

if __name__ == "__main__":
    main()
