# Monitoring Scripts — README

This directory contains automated monitoring scripts for the Zion Tech Group website.

## Scripts

### `check-broken-links.sh`
Crawls the sitemap and checks all internal links (HTTP status codes).
Reports broken links to `automation/data/broken-links-report.json`.

Usage:
```bash
# Check internal links only
./scripts/check-broken-links.sh

# Check internal + external links (slower)
./scripts/check-broken-links.sh --external
```

### `check-service-counts.sh`
Verifies that service counts in `searchServices.ts` and `servicesData.ts` match expected values (599 total). Reports category and stage breakdowns to `automation/data/service-counts-report.json`.

Usage:
```bash
./scripts/check-service-counts.sh
```

## Cron Setup

To run these scripts automatically via Hermes cron:

```bash
# Weekly broken link check (every Monday 9 AM):
hermes cron create \
  --name "broken-links-check" \
  --schedule "0 9 * * 1" \
  --prompt "Run ./scripts/check-broken-links.sh --external and report findings" \
  --deliver origin

# Daily service count verification (every day at 8 AM):
hermes cron create \
  --name "service-counts-check" \
  --schedule "0 8 * * *" \
  --prompt "Run ./scripts/check-service-counts.sh and report if discrepancy found" \
  --deliver origin
```

Or via crontab directly:
```cron
# Every Monday 9 AM — check broken links
0 9 * * 1 cd /path/to/zion-support.github.io && bash scripts/check-broken-links.sh --external

# Daily 8 AM — verify service counts
0 8 * * * cd /path/to/zion-support.github.io && bash scripts/check-service-counts.sh
```

## Reports

All reports are written to `automation/data/` as JSON files with timestamps.