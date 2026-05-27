#!/usr/bin/env python3
"""
Zion Tech Group – Voice Agent Health Check

* Pings the Chrome CDP endpoint (127.0.0.1:18792) to verify the attached tab is alive.
* If the connection fails, logs a warning and attempts a simple reconnection command.
* Designed to run every 10 minutes via cron.
"""

import os, socket, time
from datetime import datetime
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
CDP_HOST = "127.0.0.1"
CDP_PORT = 18792

def log(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] VoiceHealth: {msg}\n")

def is_cdp_alive() -> bool:
    try:
        with socket.create_connection((CDP_HOST, CDP_PORT), timeout=5):
            return True
    except Exception as e:
        log(f"CDP connection error: {e}")
        return False

def attempt_reconnect():
    # Placeholder: In a real setup we could invoke a CLI to re‑attach the Chrome tab.
    # For now we just log the attempt.
    log("Attempting to re‑attach Chrome CDP tab (manual action may be required).")

def main():
    log("=== Voice Health Check started ===")
    if is_cdp_alive():
        log("Chrome CDP endpoint is reachable.")
    else:
        log("Chrome CDP endpoint NOT reachable.")
        attempt_reconnect()
    log("=== Voice Health Check finished ===")

if __name__ == "__main__":
    main()
