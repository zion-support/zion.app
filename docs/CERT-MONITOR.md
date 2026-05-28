# Autonomous SSL/TLS Certificate Expiration Monitor

**Status:** ✅ Active  
**Triggers:** Weekly Sunday 07:00 UTC (scheduled), manual dispatch  
**Fail condition:** Any certificate expiring within 30 days or check failure  
**Telegram alerts:** On issues; success confirmation on healthy

---

## Problem

SSL/TLS certificates expire. An expired certificate causes browsers to show security warnings, breaks HTTPS, and damages user trust. Manual checks are easy to forget, especially for multiple domains/subdomains.

## Solution

Weekly certificate checker that:
- Connects to each configured domain on port 443
- Fetches certificate `notAfter` date using `openssl s_client`
- Computes days remaining
- Alerts at 30, 7, and 1 day before expiry
- Optionally attempts Let's Encrypt auto-renew for known ACME endpoints (future)
- Opens GitHub issues for any expiring/error certificates
- Sends Telegram notifications

---

## How It Works

1. Reads domain list from `.hermes/config/cert-monitor.json`
2. For each domain:
   - Runs `openssl s_client -servername <domain> -connect <domain>:443` and extracts `notAfter` via `openssl x509 -noout -dates`
   - Calculates days left
   - If ≤30 days: flags as alert
3. Saves history to `.hermes/memory/cert-monitor/history.json`
4. If any alerts: CI fails, GitHub issue opened, Telegram sent
5. If all healthy: Telegram success message

---

## Configuration

Create `.hermes/config/cert-monitor.json`:

```json
{
  "domains": [
    "ziontechgroup.com",
    "www.ziontechgroup.com",
    "ai.ziontechgroup.com"
  ],
  "autoRenew": false,
  "notifications": {
    "telegram": true
  }
}
```

- `domains`: list of hostnames to check (no protocol, just domain)
- `autoRenew`: if true, attempts Let's Encrypt renewal (requires certbot setup; not fully implemented yet)
- `notifications.telegram`: enable/disable Telegram alerts

---

## Alerts

- **30 days warning** — plan renewal
- **7 days critical** — immediate action needed
- **1 day emergency** — certificate will expire tomorrow
- **Connection error** — domain not reachable on 443 or handshake failed

---

## Safety

- **Read-only**: Uses `openssl` to inspect certificates; does not modify servers
- **Non-invasive**: No changes to certs or configs unless `autoRenew` explicitly enabled with proper setup
- **Local**: No external API calls (except optional Telegram)
- **Fail-closed**: If cert fetch fails, alerts — safer than missing expiry

---

## Dependencies

- `openssl` CLI (preinstalled on GitHub Actions Ubuntu runners)
- Node.js standard library

---

## Future Enhancements

- Integrate `certbot` for automatic renewal when `autoRenew: true`
- Support for wildcard certificates (ACME DNS-01 challenge)
- Add email alerts (SMTP)
- Include certificate transparency log monitoring
- Track SHA-256 fingerprint changes to detect unauthorized replacements

---

## Related Guardrails

- **#22 GDPR Privacy Audit** — certificate validity part of security compliance
- **#23 Log Retention Manager** — stores cert check history
- **#24 Error Tracker** — may surface HTTPS-related errors
- **#36 Security Headers Audit** — includes HSTS which requires valid cert
