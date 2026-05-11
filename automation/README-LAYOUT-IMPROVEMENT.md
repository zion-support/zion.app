# AI Layout Improvement Agent (ALIA)

Ultra-fast autonomous AI system that continuously analyzes and improves app layouts, components, styling, and visual design with zero human intervention.

## 🎨 Features

- **Layout Component Analysis**: Analyzes Navigation, Footer, Layout, and all components
- **Responsive Design Improvements**: Ensures mobile-first, tablet, and desktop layouts
- **Spacing & Typography Consistency**: Standardizes spacing and typography across the app
- **Visual Hierarchy Enhancements**: Improves heading structure and content flow
- **Accessibility Improvements**: Fixes accessibility issues in layouts (ARIA, alt text, labels)
- **Performance Optimizations**: Reduces layout shifts (CLS), optimizes CSS
- **CSS/Tailwind Optimization**: Ensures proper Tailwind usage and CSS efficiency
- **Component Structure**: Improves component organization and TypeScript types
- **Mobile-First Compliance**: Enforces mobile-first design principles
- **Cross-Browser Compatibility**: Ensures layouts work across browsers

## 📋 Requirements

- Node.js 18+
- Git configured with write access
- Next.js app with Tailwind CSS

## ⚙️ Configuration

### Environment Variables

```bash
# Speed Settings
CONTINUOUS_MODE=true              # Enable continuous mode (default: true)
INTERVAL_SECONDS=10               # Seconds between runs (default: 10 - MAXIMUM SPEED)
MAX_IMPROVEMENTS_PER_RUN=50       # Max improvements per run (default: 50 - MAXIMUM SPEED)
PRIORITY_MODE=all                 # Priority filter (critical|high|medium|low|all)

# Git Settings
AUTO_COMMIT=true                  # Auto-commit changes (default: true)
AUTO_PUSH=true                    # Auto-push to main (default: true)
```

## 🎯 Usage

### Quick Start

```bash
# Run once
npm run layout:improve

# Run continuously
npm run layout:improve-continuous

# Analyze only (no improvements)
npm run layout:analyze

# Start with PM2
npm run layout:improve-start

# Stop
npm run layout:improve-stop

# View logs
npm run layout:improve-logs

# View latest report
npm run layout:improve-report
```

### Manual Execution

```bash
# Single run
node automation/ai-layout-improvement-agent.cjs run

# Continuous mode
node automation/ai-layout-improvement-agent.cjs continuous

# Ultra-fast mode (5 second intervals)
INTERVAL_SECONDS=5 node automation/ai-layout-improvement-agent.cjs continuous
```

## 🔧 How It Works

1. **Layout Analysis**: Scans all layout components and files
2. **Issue Detection**: Identifies layout, responsive, accessibility, and performance issues
3. **AI-Powered Improvements**: Applies automated fixes where possible
4. **Code Generation**: Uses AI to generate improved code for complex issues
5. **Auto-Commit**: Commits and pushes changes automatically

## 📊 Analysis Areas

The agent analyzes:

- **Layout Structure**: Semantic HTML, ARIA landmarks, skip links
- **Responsive Design**: Breakpoints, container usage, mobile-first
- **Spacing Consistency**: Spacing utilities, standardization
- **Typography**: Font scales, line heights, text styles
- **Visual Hierarchy**: Heading structure, content flow
- **Accessibility**: Alt text, labels, ARIA attributes, keyboard navigation
- **Performance**: Layout shifts, inline styles, CSS optimization
- **CSS Optimization**: Tailwind usage, file size, unused styles
- **Component Structure**: Exports, TypeScript types, organization
- **Mobile-First**: Base styles, breakpoint usage

## 🎨 Improvement Types

The agent can automatically fix:

- ✅ Missing semantic HTML elements
- ✅ Missing ARIA landmarks and roles
- ✅ Missing alt text on images
- ✅ Missing labels on form inputs
- ✅ Typography scale definitions
- ✅ Tailwind CSS directives
- ✅ Layout structure improvements

Complex improvements requiring AI code generation:
- 🔄 Responsive design refactoring
- 🔄 Visual hierarchy improvements
- 🔄 Spacing standardization
- 🔄 Component structure refactoring
- 🔄 Mobile-first conversion
- 🔄 Performance optimizations

## 📈 Performance

- **Speed**: Runs every 10 seconds by default (MAXIMUM SPEED)
- **Efficiency**: Processes up to 50 improvements per run
- **Coverage**: Analyzes all layout components and styles
- **Reliability**: Automatic retry on failures (5 second delay)
- **GitHub Actions**: Runs every 5 minutes automatically

## 🔍 Monitoring

Logs are saved to:
- `automation/logs/ai-layout-improvement.log`

Reports are saved to:
- `automation/reports/layout-improvement-latest-report.json`
- `automation/reports/layout-improvement-report-{timestamp}.json`

## 🚨 Troubleshooting

### No Changes Detected
If no improvements are being made:
- Check the health score in the report
- Review recommendations in the report
- Ensure layout files are in the correct paths

### Too Many Changes
- Reduce `MAX_IMPROVEMENTS_PER_RUN`
- Increase `INTERVAL_SECONDS` to slow down
- Set `PRIORITY_MODE` to filter by priority

### Build Failures
- Check that changes don't break the build
- Review the agent logs for errors
- Temporarily disable auto-push: `AUTO_PUSH=false`

## 🔗 Integration

The Layout Improvement Agent integrates with:
- **GitHub Actions**: Runs every 15 minutes automatically
- **PM2**: Can be managed via PM2 ecosystem
- **CI/CD**: Works with existing workflows
- **Other AI Agents**: Shares analysis with other improvement agents

## 📝 Examples

### View Latest Report

```bash
npm run layout:improve-report
```

### Run with Custom Settings

```bash
# Ultra-fast mode (15 second intervals, 30 improvements per run)
INTERVAL_SECONDS=15 MAX_IMPROVEMENTS_PER_RUN=30 npm run layout:improve-continuous

# Test mode (no auto-push)
AUTO_PUSH=false npm run layout:improve

# Focus on critical issues only
PRIORITY_MODE=critical npm run layout:improve
```

## 🎯 Best Practices

1. **Start Gradually**: Begin with longer intervals to review changes
2. **Monitor Reports**: Check reports regularly to understand improvements
3. **Set Appropriate Limits**: Adjust `MAX_IMPROVEMENTS_PER_RUN` based on needs
4. **Review Changes**: While autonomous, review critical layout changes
5. **Use PM2**: Run with PM2 for production reliability

## 🔄 Continuous Improvement

The agent learns from:
- Existing layout patterns
- Successful improvements
- Codebase structure
- Component styles
- Design system usage

## 📚 Related Documentation

- [AI Continuous Improvement Agent](./AI-CONTINUOUS-IMPROVEMENT-README.md)
- [AI Speed Accelerator](./README-SPEED-ACCELERATOR.md)
- [AI Supreme Agent](./AI-SUPREME-README.md)

## 🆘 Support

For issues or questions:
1. Check logs in `automation/logs/ai-layout-improvement.log`
2. Review latest report: `npm run layout:improve-report`
3. Check GitHub Actions workflow runs
4. Verify configuration settings

---

**Note**: This agent is designed for rapid layout improvements. Use responsibly and review critical layout changes before deployment to production.


