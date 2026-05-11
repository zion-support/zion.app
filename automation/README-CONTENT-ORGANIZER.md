# AI Content Organizer Agent (ACOA)

Ultra-fast autonomous AI system that continuously organizes app content with zero human intervention at maximum speed.

## 🚀 Features

- **Continuous Content Organization**: Automatically organizes pages, components, and files
- **Duplicate Detection & Removal**: Identifies and removes duplicate content
- **Automatic Categorization**: Organizes content into proper category directories
- **Naming Convention Standardization**: Fixes inconsistent naming (spaces, underscores → kebab-case)
- **Directory Structure Optimization**: Optimizes file structure for better maintainability
- **Import Path Fixing**: Automatically fixes broken import paths after reorganization
- **Metadata Standardization**: Ensures consistent metadata across all pages
- **Autonomous Operation**: Auto-commits and pushes changes without human intervention
- **Ultra-Fast Intervals**: Runs every 30 seconds by default for maximum speed

## 📋 Requirements

- Node.js 18+
- Git configured with write access
- File system write permissions

## ⚙️ Configuration

### Environment Variables

```bash
# Operation Settings
CONTINUOUS_MODE=true           # Enable continuous mode (default: true)
INTERVAL_SECONDS=30            # Seconds between runs (default: 30 - ULTRA-FAST)
AUTO_COMMIT=true               # Auto-commit changes (default: true)
AUTO_PUSH=true                 # Auto-push to main (default: true)

# Organization Settings
MAX_ORGANIZATIONS_PER_RUN=50   # Max organizations per cycle (default: 50)
PARALLEL_PROCESSING=true       # Enable parallel processing (default: true)
MAX_CONCURRENT_FILES=10        # Max concurrent file operations (default: 10)
```

## 🎯 Usage

### Quick Start

```bash
# Run once
npm run content:organize

# Run continuously
npm run content:organize-continuous

# Start with PM2
npm run content:organize-start

# Stop
npm run content:organize-stop

# View logs
npm run content:organize-logs
```

### Manual Execution

```bash
# Single run
node automation/ai-content-organizer-agent.cjs run

# Continuous mode
node automation/ai-content-organizer-agent.cjs continuous

# Ultra-fast mode (15 second intervals)
INTERVAL_SECONDS=15 node automation/ai-content-organizer-agent.cjs continuous

# Scan only (no organization)
node automation/ai-content-organizer-agent.cjs scan
```

## 🔧 How It Works

1. **Content Scanning**: Scans all pages and components in the app directory
2. **Duplicate Detection**: Identifies duplicate files by content and name
3. **Inconsistency Analysis**: Finds naming, metadata, and structure issues
4. **Organization Opportunities**: Identifies files that should be categorized
5. **Automatic Organization**: 
   - Removes duplicates (keeps older files)
   - Moves files to proper category directories
   - Fixes naming conventions (kebab-case)
   - Standardizes metadata
   - Fixes import paths
6. **Auto-Commit**: Commits and pushes changes automatically

## 📊 Content Categories

The agent automatically categorizes content into:

- **ai**: AI and artificial intelligence related
- **blockchain**: Blockchain, Web3, crypto
- **cloud**: Cloud infrastructure and services
- **security**: Security and cybersecurity
- **devops**: DevOps, CI/CD, automation
- **iot**: IoT and Internet of Things
- **data**: Data analytics and business intelligence
- **mobile**: Mobile app development
- **web**: Web and frontend development
- **api**: API and integration services
- **enterprise**: Enterprise solutions
- **healthcare**: Healthcare and medical
- **financial**: Financial services and fintech
- **education**: Education and learning
- **marketing**: Marketing and advertising
- **ecommerce**: E-commerce and commerce
- **automation**: Automation and workflow
- **consulting**: Consulting and advisory
- **services**: General services and solutions

## 🎨 Organization Rules

### Naming Conventions
- Converts spaces and underscores to hyphens
- Enforces kebab-case: `ai-business-advisor.tsx`
- Removes inconsistent capitalization

### Directory Structure
- Pages organized by category in `app/{category}/`
- Root-level pages moved to appropriate category directories
- Duplicate pages removed (keeps oldest version)

### Metadata Standardization
- Adds missing metadata exports
- Ensures consistent title format: `{Page Name} | Zion Tech Group`
- Adds canonical URLs
- Standardizes descriptions

## 📈 Performance

- **Speed**: Runs every 30 seconds (configurable)
- **Parallel**: Processes up to 10 files concurrently
- **Efficiency**: Processes up to 50 organizations per run
- **Reliability**: Automatic retry on failures

## 🔍 Monitoring

Logs are saved to:
- `automation/logs/ai-content-organizer.log`
- `automation/logs/ai-content-organizer-out.log`
- `automation/logs/ai-content-organizer-error.log`

Reports are saved to:
- `automation/reports/content-organizer-report-{timestamp}.json`
- `automation/reports/content-organizer-latest-report.json`

## 📊 Report Structure

```json
{
  "metadata": {
    "timestamp": "2025-01-XX...",
    "runtime": 1234,
    "repository": "https://github.com/Zion-Holdings/zion.app"
  },
  "scan": {
    "totalPages": 500,
    "duplicates": 25,
    "inconsistencies": 45,
    "organizationOpportunities": 120
  },
  "organization": {
    "deduplicated": 10,
    "renamed": 15,
    "categorized": 20,
    "metadataFixed": 8,
    "totalChanges": 53
  }
}
```

## 🚨 Troubleshooting

### No Changes Detected
- Check if files are already organized
- Verify file permissions
- Check git status manually

### Organization Skipped
- Target files may already exist
- Check logs for specific errors
- Verify directory permissions

### Too Many Changes
- Reduce `MAX_ORGANIZATIONS_PER_RUN`
- Increase `INTERVAL_SECONDS` to slow down
- Review changes before committing

## 🔗 Integration

The Content Organizer integrates with:
- **Git Workflow**: Auto-commits and pushes changes
- **PM2**: Can be managed via PM2 ecosystem
- **CI/CD**: Works with GitHub Actions
- **Other AI Agents**: Coordinates with continuous improvement agents

## 📝 Examples

### View Latest Report

```bash
cat automation/reports/content-organizer-latest-report.json | jq '.'
```

### Check Organization Status

```bash
npm run content:organize-logs | tail -50
```

### Custom Speed Configuration

```bash
# Very fast - 15 second intervals, 100 organizations per run
INTERVAL_SECONDS=15 MAX_ORGANIZATIONS_PER_RUN=100 npm run content:organize-continuous

# Moderate - 60 second intervals, 25 organizations per run
INTERVAL_SECONDS=60 MAX_ORGANIZATIONS_PER_RUN=25 npm run content:organize-continuous
```

## 🎯 Best Practices

1. **Start Gradually**: Begin with longer intervals to observe behavior
2. **Review Changes**: Check git commits to understand organization patterns
3. **Set Appropriate Limits**: Adjust `MAX_ORGANIZATIONS_PER_RUN` based on needs
4. **Monitor Logs**: Keep an eye on logs to ensure proper operation
5. **Use PM2**: Run with PM2 for production reliability

## 🔄 Continuous Improvement

The agent learns from:
- Existing directory structure
- Content patterns
- Successful organizations
- File relationships

## 📚 Related Documentation

- [AI Continuous Improvement Agent](./AI-CONTINUOUS-IMPROVEMENT-README.md)
- [AI Development Speed Accelerator](./README-SPEED-ACCELERATOR.md)
- [AI Supreme Agent](./AI-SUPREME-README.md)

## 🆘 Support

For issues or questions:
1. Check logs in `automation/logs/`
2. Review configuration settings
3. Verify Git permissions
4. Check file system permissions

---

**Note**: This agent is designed for rapid content organization. It operates autonomously and will commit and push changes automatically. Review git history to track all changes.


