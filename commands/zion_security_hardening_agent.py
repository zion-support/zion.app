#!/usr/bin/env python3
"""
Zion Security Hardening Agent

Purpose:
- Automate Linux security hardening for Zion Tech Group hosts.
- Apply fail2ban, ufw/iptables, SSH key rotation, and vulnerability scanning.
- Create a Git‑tracked security audit log and automatically open PRs for any
  detected issues.
- Log every step to Zion_Brain_Log.md.

Key Features:
1. **Fail2ban** – Install and enable, with custom jail configs for SSH, nginx, etc.
2. **Firewall** – Configure ufw (or iptables) to allow only necessary ports.
3. **SSH Hardening** – Disable root login, enforce key auth, rotate keys.
4. **Vulnerability Scan** – Run `trivy` (or `grype`) against installed packages.
5. **Log Rotation & Auditing** – Rotate logs, set proper permissions, store audit.
6. **Auto‑PR** – If any issues found, stage, commit, and open a GitHub PR.
7. **Self‑Healing** – If any hardening step fails, log and retry once.

Configuration (via `.env`):
- `SECURITY_LOG_PATH` – defaults to `~/workspace/security_audit.log`
- `GIT_REPO_PATH` – defaults to `~/workspace` for PR creation.
- `GH_TOKEN` – optional for PR automation.

Run:
  python3 commands/zion_security_hardening_agent.py

Dependencies:
- `trivy` (vulnerability scanner)
- `ufw` or `iptables` (firewall)
- `fail2ban` (intrusion prevention)
- `ssh-keygen` (key rotation)
- `logrotate` (log management)
"""

import os, json, logging, datetime, subprocess, pathlib
from typing import List, Dict, Any

import psycopg2  # only if we need to query DB for SSH users

# ---------------------------------------------------------------------------
# Configuration & Logging
# ---------------------------------------------------------------------------
WORKDIR = pathlib.Path(os.environ.get("ZION_ROOT", str(pathlib.Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
LOG_MD.parent.mkdir(parents=True, exist_ok=True)
SECURITY_LOG_PATH = pathlib.Path(os.getenv("SECURITY_LOG_PATH",
                                           str(WORKDIR / "security_audit.log")))
GIT_REPO_PATH = pathlib.Path(os.getenv("GIT_REPO_PATH", str(WORKDIR)))
GH_TOKEN = os.getenv("GH_TOKEN")   # optional for PR automation

# Simple logger – append to Zion_Brain_Log.md
def log(msg: str) -> None:
    ts = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] SecurityHardening: {msg}\n")

# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------
def run_cmd(cmd: List[str], check: bool = True, **kwargs) -> str:
    """Run a shell command and return stdout. Log stderr on failure."""
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, **kwargs)
        if check and result.returncode != 0:
            raise subprocess.CalledProcessError(
                result.returncode, cmd, result.stdout, result.stderr
            )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        log(f"Command failed: {' '.join(cmd)}: {e.stderr}")
        raise

# ---------------------------------------------------------------------------
# Fail2ban hardening
# ---------------------------------------------------------------------------
def harden_fail2ban():
    """Install & configure fail2ban."""
    log("=== Hardening Fail2ban ===")
    try:
        # Install if not present
        if not pathlib.Path("/etc/fail2ban").exists():
            run_cmd(["sudo", "apt-get", "install", "-y", "fail2ban"])
        # Enable and start service
        run_cmd(["sudo", "systemctl", "enable", "fail2ban"])
        run_cmd(["sudo", "systemctl", "start", "fail2ban"])
        # Ensure default jail is enabled
        jail_conf = pathlib.Path("/etc/fail2ban/jail.local")
        if not jail_conf.exists():
            jail_conf.write_text("")  # create empty
        # Set SSH jail config
        with jail_conf.open("a") as f:
            f.write("""
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
""")
        # Restart fail2ban
        run_cmd(["sudo", "systemctl", "restart", "fail2ban"])
        log("Fail2ban configured and restarted.")
    except Exception as e:
        log(f"Fail2ban hardening failed: {e}")

# ---------------------------------------------------------------------------
# Firewall hardening
# ---------------------------------------------------------------------------
def harden_firewall():
    """Configure ufw or iptables to allow only needed ports."""
    log("=== Hardening Firewall ===")
    try:
        # Prefer ufw if available
        if pathlib.Path("/usr/sbin/ufw").exists():
            # Install ufw if not present
            if not pathlib.Path("/usr/sbin/ufw").exists():
                run_cmd(["sudo", "apt-get", "install", "-y", "ufw"])
            # Default deny incoming
            run_cmd(["sudo", "ufw", "default", "deny", "incoming"])
            # Default allow outgoing
            run_cmd(["sudo", "ufw", "default", "allow", "outgoing"])
            # Open SSH (port 22)
            run_cmd(["sudo", "ufw", "allow", "ssh"])
            # Open HTTP (80) & HTTPS (443) if running web services
            run_cmd(["sudo", "ufw", "allow", "http"])
            run_cmd(["sudo", "ufw", "allow", "https"])
            # Enable ufw
            run_cmd(["sudo", "ufw", "--force", "enable"])
            log("UFW firewall configured and enabled.")
        else:
            # Fallback to iptables
            run_cmd(["sudo", "iptables", "-P", "INPUT", "DROP"])
            run_cmd(["sudo", "iptables", "-P", "OUTPUT", "ACCEPT"])
            run_cmd(["sudo", "iptables", "-P", "FORWARD", "DROP"])
            run_cmd(["sudo", "iptables", "-A", "INPUT", "-i", "lo", "-j", "ACCEPT"])
            run_cmd(["sudo", "iptables", "-A", "INPUT", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"])
            run_cmd(["sudo", "iptables", "-A", "INPUT", "-p", "tcp", "--dport", "22", "-j", "ACCEPT"])
            run_cmd(["sudo", "iptables", "-A", "INPUT", "-p", "tcp", "--dport", "80", "-j", "ACCEPT"])
            run_cmd(["sudo", "iptables", "-A", "INPUT", "-p", "tcp", "--dport", "443", "-j", "ACCEPT"])
            log("iptables firewall configured.")
    except Exception as e:
        log(f"Firewall hardening failed: {e}")

# ---------------------------------------------------------------------------
# SSH hardening
# ---------------------------------------------------------------------------
def harden_ssh():
    """Disable root login, enforce key auth, rotate keys."""
    log("=== Hardening SSH ===")
    try:
        ssh_conf = pathlib.Path("/etc/ssh/sshd_config")
        if not ssh_conf.exists():
            log("SSH config not found.")
            return
        # Backup original
        ssh_conf.rename(str(ssh_conf) + ".bak")
        # Read & modify
        with ssh_conf.open("r") as f:
            lines = f.readlines()
        new_lines = []
        for line in lines:
            if line.strip().startswith("PermitRootLogin"):
                new_lines.append("PermitRootLogin no\n")
            elif line.strip().startswith("PasswordAuthentication"):
                new_lines.append("PasswordAuthentication no\n")
            elif line.strip().startswith("PubkeyAuthentication"):
                new_lines.append("PubkeyAuthentication yes\n")
            else:
                new_lines.append(line)
        # Ensure these are present
        if not any(l.strip().startswith("PermitRootLogin") for l in new_lines):
            new_lines.append("PermitRootLogin no\n")
        if not any(l.strip().startswith("PasswordAuthentication") for l in new_lines):
            new_lines.append("PasswordAuthentication no\n")
        if not any(l.strip().startswith("PubkeyAuthentication") for l in new_lines):
            new_lines.append("PubkeyAuthentication yes\n")
        # Write back
        with ssh_conf.open("w") as f:
            f.writelines(new_lines)
        # Restart sshd
        run_cmd(["sudo", "systemctl", "restart", "ssh"])
        log("SSH config hardened and service restarted.")
        # Generate new SSH key for Zion Bot
        key_path = pathlib.Path.home() / ".ssh" / "zion_bot_ed25519"
        if not key_path.exists():
            run_cmd(["ssh-keygen", "-t", "ed25519", "-f", str(key_path), "-N", "", "-C", "zion_bot@ziontech.com"])
            log(f"Generated new SSH key at {key_path}")
    except Exception as e:
        log(f"SSH hardening failed: {e}")

# ---------------------------------------------------------------------------
# Vulnerability scanning
# ---------------------------------------------------------------------------
def scan_vulnerabilities():
    """Run trivy (or grype) to scan for package vulnerabilities."""
    log("=== Scanning for Vulnerabilities ===")
    issues_found = []
    try:
        # Check if trivy is installed
        if not pathlib.Path("/usr/local/bin/trivy").exists():
            log("Trivy not installed – skipping scan.")
            return issues_found
        # Scan system packages
        result = run_cmd(["/usr/local/bin/trivy", "fs", "/"], check=False)
        # Parse output for CRITICAL/HIGH issues
        for line in result.split("\n"):
            if "CRITICAL" in line or "HIGH" in line:
                issues_found.append(line.strip())
        if issues_found:
            log(f"Found {len(issues_found)} critical/high vulnerabilities.")
        else:
            log("No critical/high vulnerabilities found.")
    except Exception as e:
        log(f"Vulnerability scan failed: {e}")
    return issues_found

# ---------------------------------------------------------------------------
# Log rotation & auditing
# ---------------------------------------------------------------------------
def harden_log_rotation():
    """Set up logrotate for system logs and ensure proper permissions."""
    log("=== Hardening Log Rotation ===")
    try:
        # Ensure logrotate is installed
        if not pathlib.Path("/usr/sbin/logrotate").exists():
            run_cmd(["sudo", "apt-get", "install", "-y", "logrotate"])
        # Create a custom logrotate config for Zion logs
        logrotate_conf = pathlib.Path("/etc/logrotate.d/zion")
        with logrotate_conf.open("w") as f:
            f.write(f"""
{WORKDIR}/logs/*.log {{
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
    postrotate
        /usr/bin/systemctl reload rsyslog > /dev/null 2>&1 || true
    endscript
}}
""