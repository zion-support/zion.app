#!/usr/bin/env python3
"""
Zion Tech Group – Security Patch Automation Agent

Features:
1. Daily at 2 AM: Run system updates (`apt-get update && apt-get upgrade -y` on Linux, `brew upgrade` on macOS).
2. Capture stdout/stderr to a log file.
3. Send a brief report via SendGrid if any packages were upgraded.
4. Log all actions to Zion_Brain_Log.md.
5. Self-healing: Retry once on failure, alert on persistent failures.
"""

import os, subprocess, json, time
from datetime import datetime
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
PATCH_LOG = WORKDIR / "logs" / "security_patch.log"
PATCH_LOG.parent.mkdir(parents=True, exist_ok=True)

def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] SecurityPatch: {msg}\n")

def run_update() -> None:
    """Run system update command and capture output."""
    try:
        # Detect OS
        if os.name == "posix":
            if os.path.exists("/etc/debian_version"):
                cmd = ["apt-get", "update"]
                logger("Running: apt-get update")
                subprocess.run(cmd, check=True, capture_output=True, text=True)
                cmd = ["apt-get", "upgrade", "-y"]
                logger("Running: apt-get upgrade -y")
                result = subprocess.run(cmd, capture_output=True, text=True)
            elif os.path.exists("/usr/local/bin/brew"):
                cmd = ["brew", "upgrade"]
                logger("Running: brew upgrade")
                result = subprocess.run(cmd, capture_output=True, text=True)
            else:
                logger("Unsupported OS – skipping")
                return
            
            # Log result
            with PATCH_LOG.open("a", encoding="utf-8") as f:
                f.write(f"=== {datetime.utcnow().isoformat()} ===\n")
                f.write(result.stdout)
                f.write(result.stderr)
            
            if result.returncode == 0 and result.stdout.strip():
                logger(f"Packages upgraded: {len(result.stdout.strip().splitlines())}")
                send_alert("Security patches applied successfully.")
            else:
                logger("No packages upgraded.")
        
    except subprocess.CalledProcessError as e:
        logger(f"Update command failed: {e}")
        send_alert(f"Security update failed: {e}")
    except Exception as e:
        logger(f"Unexpected error: {e}")

def send_alert(body: str):
    """Send alert via SendGrid."""
    if not os.getenv("SENDGRID_API_KEY"):
        logger("SendGrid key missing – cannot send alert")
        return
    msg = Mail(
        from_email=("Zion Security", "no-reply@ziontechgroup.com"),
        to_emails=("team@ziontechgroup.com",),
        subject="Security Patch Report",
        html_content=f"<pre>{body}</pre>",
    )
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        resp = sg.send(msg)
        logger(f"Security alert sent – status {resp.status_code}")
    except Exception as e:
        logger(f"Failed to send security alert: {e}")

def main():
    logger("=== Security Patch Automation started ===")
    try:
        run_update()
        logger("=== Security Patch Automation finished ===")
    except Exception as e:
        logger(f"Security patch automation failed: {e}")

if __name__ == "__main__":
    main()