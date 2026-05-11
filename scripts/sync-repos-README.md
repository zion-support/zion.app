# GitHub Synchronizer

This script (`sync-repos.js`) automatically synchronizes issues and pull requests between GitHub repositories.

## Features

- Automated creation of issues in target repo when they appear in source repo
- Auto-labeling of synced issues with `cross-repo-sync`
- Dry-run mode for testing
- Pagination support for large issue lists

## Usage

### Manual Execution

```bash
# Set environment variables:
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
export SOURCE_OWNER=ziontechgroup
export SOURCE_REPO=zion-app
export TARGET_OWNER=ziontechgroup
export TARGET_REPO=zion-dashboard
export SYNC_LABEL=cross-repo-sync
export DRY_RUN=true  # set to "false" or omit for real sync

# Run the script:
node scripts/sync-repos.js
```

### GitHub Action Integration

The script is also triggered via `.github/workflows/github_synchronizer.yml` on a 5-minute schedule.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | ✅ | GitHub token with repo scope |
| `SOURCE_OWNER` | ✅ | Owner of source repo |
| `SOURCE_REPO` | ✅ | Name of source repo |
| `TARGET_OWNER` | ✅ | Owner of target repo |
| `TARGET_REPO` | ✅ | Name of target repo |
| `SYNC_LABEL` | ❌ | Label to add on synced items (default: "cross-repo-sync") |
| `DRY_RUN` | ❌ | Set to "true" to test without making changes |

## Notes

- Issues are matched by title (simple approach; for production, consider adding a unique ID in the issue body)
- The script only creates new issues; it does not update existing ones
- Pull requests support can be added by adapting the fetch and create logic
