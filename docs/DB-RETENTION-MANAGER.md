# Autonomous SQLite/Alarms Retention Policy Manager

**Status:** ✅ Active  
**Triggers:** Weekly Sunday 03:00 UTC (scheduled), manual dispatch  
**Fail condition:** Errors during DB scan or purge  
**Telegram alerts:** On errors; weekly success digest

---

## Problem

SQLite databases accumulate logs, error records, analytics events, and alarm history over time. Without automated cleanup:
- Disk usage grows unbounded
- Query performance degrades
- Compliance requirements (data retention limits) may be violated
- Backup/restore times increase

## Solution

Weekly retention manager that:
- Discovers all `*.db` files across project (`.hermes/db/`, `.hermes/memory/`, etc.)
- Inspects table schemas to find timestamp/date columns
- Deletes records older than configured TTL (default: 90 days)
- Runs `VACUUM` to reclaim disk space
- Reports storage freed, rows purged, and DB sizes
- Sends weekly success digest; alerts on failures

---

## How It Works

1. Loads retention policy from `.hermes/config/retention-policy.json` (optional)
2. Recursively scans for `.db` files in known directories
3. For each DB:
   - Lists tables via `.tables`
   - Inspects schema via `PRAGMA table_info` to find timestamp columns (created_at, timestamp, updated_at, date)
   - Counts rows older than `now - TTL` per table
   - In dry-run mode: reports only
   - In live mode: executes `DELETE FROM table WHERE ts_col < cutoff`
4. After purges: runs `VACUUM` to defragment and shrink file
5. Writes report JSON to `.hermes/memory/db-retention/retention-<timestamp>.json`
6. Uploads as artifact (30-day retention)
7. Sends weekly digest Telegram message

---

## Configuration

Create `.hermes/config/retention-policy.json`:

```json
{
  "ttlDays": 90,
  "dryRun": false,
  "vacuum": true,
  "databases": [
    { "path": ".hermes/db/alarms.db", "ttlDays": 30 },
    { "path": ".hermes/memory/errors.db", "ttlDays": 60 }
  ]
}
```

- `ttlDays`: default retention window (90 days)
- `dryRun`: if true, only reports; set to `false` to actually delete
- `vacuum`: run `VACUUM` after purges (recommended)
- `databases`: array of specific DB configs to override defaults (optional)

---

## Reports

- **Latest report**: `.hermes/memory/db-retention/retention-<timestamp>.json`
- **Artifact**: `db-retention-report` (uploaded to workflow, 30-day retention)

Report schema:
```json
{
  "timestamp": "...",
  "dryRun": true,
  "dbs": [
    {
      "filepath": "/path/to/file.db",
      "sizeBefore": 123456,
      "sizeAfter": 123000,
      "freed": 456,
      "tables": [
        { "table": "events", "count": 1000, "oldRows": 250 }
      ]
    }
  ],
  "totalSizeBefore": 123456,
  "totalSizeAfter": 123000,
  "totalFreed": 456,
  "totalPurged": 250
}
```

---

## Safety

- **Dry-run by default**: Set `dryRun: false` only after reviewing reports
- **Transaction-safe**: Each table purge runs independently; failures logged but don't stop other DBs
- **No external dependencies**: Uses system `sqlite3` CLI (preinstalled on GitHub Actions runners)
- **No application changes**: Read-only DB access; no code modification
- **Backups**: Consider backing up DBs before first live run (manual step outside automation)

---

## Enabling Pixelmatch for Visual Regression (Related #45)

Note: Visual Regression Detector (#45) optionally uses `pixelmatch` for image diffs. To ensure full functionality:

```bash
npm i -D pixelmatch
npx playwright install chromium
```

If `pixelmatch` is not installed, the visual regression script falls back to coarse file-size comparison.

---

## Related Guardrails

- **#22 GDPR Privacy Audit** — retention policies for personal data
- **#23 Log Retention Manager** — file-based log rotation (complementary)
- **#44 Heap Diff Detector** — runtime memory health (different focus)
- **#45 Visual Regression** — UI consistency (uses baseline images stored long-term)
