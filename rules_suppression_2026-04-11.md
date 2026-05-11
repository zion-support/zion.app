# Alert Suppression Rules

## Version: 2026-04-11

## Time-Based Suppression
- **Quiet Hours**: 18:00 - 06:00 UTC+3 (America/Sao_Paulo)
  - Suppress all alerts except: `critical`, `emergency`

## Severity-Based Filtering
- **Never Suppress**: 
  - `critical`
  - `emergency`
- **Suppress By Default**:
  - `informational` / `warning` / `debug`
- **Optional Override**: 
  - `night_backup_suppression`: Allow specific informational alerts during nightly backup windows
    - Time Window: 00:00 - 06:00 UTC+3
    - Sources: `db_backup-*`, `backup-cluster-*`
    - Alert IDs: `db_backup_*` pattern
    - Cooldown: 8 hours before re-suppression
    - Override Window: 02:00 - 04:00 UTC+3

## Source-Based Filtering
- **Include**: 
  - `production-*`, `prod-*`, `database-*`, `db-*`
- **Exclude**: 
  - `staging-*`, `dev-*`, `test-*`

## Channel-Specific Rules
- **Discord**: Auto-suppress unless pinned
- **Telegram**: Suppress unless `alerts.rss` channel is mentioned
- **Slack**: Use `channel_id` matching and `channel_history` markers

## Cooldown Logic
- Once suppressed, alert ID must wait before suppression reinstatement:
  - Standard suppression: 1 hour cooldown
  - Night backup suppression: 8 hour cooldown
  - Critical alert re-suppression: Manual override only

## Implementation Notes
- Rules parsed order-sensitive: most recent match wins
- Pattern matching uses exact strings and regex wildcards
- Whitelisted rules bypass all other suppression
- Alerts with `urgent` tag never suppressed

## Validation Protocol
- Test with sample alerts using `validate_suppression.js`
- Check audit trail in `/logs/alert_suppression_audit.md`
- Ensure suppression decisions match documented behavior