# ⚡ AI Performance Optimizer Agent (APOA)

Ultra-fast autonomous AI system that continuously analyzes and optimizes application performance with zero human intervention.

## 🚀 Features

### Performance Analysis
- **Bundle Size Analysis** - Detects large files and bundles
- **Code Splitting** - Identifies opportunities for better code splitting
- **Lazy Loading** - Finds components and images that need lazy loading
- **Image Optimization** - Detects unoptimized images
- **Route Optimization** - Analyzes routes for SSR/SSG opportunities
- **Memoization** - Identifies components that would benefit from memoization
- **Build Optimization** - Analyzes build output for optimization opportunities
- **Memory Usage** - Detects potential memory leaks
- **Render Performance** - Finds unnecessary re-renders
- **API Performance** - Analyzes API routes for caching opportunities

### Performance Optimizations
- **Bundle Size Reduction** - Automatically optimizes bundle sizes
- **Code Splitting** - Adds dynamic imports to large components
- **Lazy Loading** - Adds lazy loading to images and components
- **Image Optimization** - Optimizes images and converts to WebP
- **Route Optimization** - Converts client-side fetching to SSR/SSG
- **Memoization** - Adds React.memo, useMemo, and useCallback
- **Build Optimization** - Optimizes Next.js build configuration
- **Memory Leak Fixes** - Adds cleanup functions to useEffect hooks
- **Render Optimization** - Optimizes inline functions and objects
- **API Caching** - Adds caching headers to API routes

## 📋 Requirements

- Node.js 18+
- Git configured with write access
- Next.js application

## ⚙️ Configuration

### Environment Variables

```bash
# Continuous operation
CONTINUOUS_MODE=true           # Enable continuous mode (default: true)
INTERVAL_MINUTES=2             # Minutes between runs (default: 2 - ULTRA-FAST)

# Auto-commit settings
AUTO_COMMIT=true               # Auto-commit changes (default: true)
AUTO_PUSH=true                # Auto-push to main (default: true)

# Optimization settings
MAX_OPTIMIZATIONS_PER_RUN=20   # Max optimizations per cycle (default: 20)
PRIORITY_MODE=all             # Priority filter (critical|high|medium|low|all)
```

## 🎯 Usage

### Quick Start

```bash
# Run once
npm run perf:optimize

# Run continuously
npm run perf:optimize-continuous

# Analyze only (no optimizations)
npm run perf:optimize-analyze

# Start with PM2
npm run perf:optimize-start

# Stop
npm run perf:optimize-stop

# View logs
npm run perf:optimize-logs

# View latest report
npm run perf:optimize-report
```

### Manual Execution

```bash
# Single run
node automation/ai-performance-optimizer.cjs run

# Continuous mode
node automation/ai-performance-optimizer.cjs continuous

# Analysis only
node automation/ai-performance-optimizer.cjs analyze

# Ultra-fast mode (1-minute intervals)
INTERVAL_MINUTES=1 node automation/ai-performance-optimizer.cjs continuous
```

## 🔧 How It Works

1. **Performance Analysis** - Analyzes bundle size, code splitting, lazy loading, images, routes, memoization, build output, memory usage, render performance, and API performance
2. **Optimization Generation** - Generates prioritized list of optimizations based on analysis
3. **Optimization Application** - Applies optimizations automatically
4. **Auto-Commit** - Commits and pushes changes automatically
5. **Reporting** - Generates comprehensive performance reports

## 📊 Performance Metrics

The agent tracks and optimizes:

- **Bundle Size** - Total bundle size and large files
- **Code Splitting** - Dynamic imports and lazy loading usage
- **Image Optimization** - Image sizes and Next.js Image usage
- **Route Performance** - SSR/SSG opportunities
- **Memoization** - React.memo, useMemo, useCallback usage
- **Build Performance** - Build output and chunk sizes
- **Memory Usage** - Memory leaks and cleanup functions
- **Render Performance** - Inline functions and objects
- **API Performance** - Caching headers and response times

### Performance Score

The agent calculates a performance score (0-100) based on:
- Bundle size optimization
- Code splitting effectiveness
- Lazy loading coverage
- Image optimization
- Route optimization
- Memoization usage
- Build performance
- Memory efficiency
- Render performance
- API performance

## 🎨 Optimization Strategies

### Bundle Optimization
- Identifies large files (>100KB)
- Suggests code splitting for large components
- Recommends dynamic imports

### Code Splitting
- Detects files exceeding 500 lines
- Suggests component splitting
- Identifies opportunities for dynamic imports

### Lazy Loading
- Finds images without `loading="lazy"`
- Identifies components that could use React.lazy
- Suggests Next.js dynamic imports

### Image Optimization
- Detects images larger than 200KB
- Identifies images not using Next.js Image component
- Suggests WebP conversion

### Route Optimization
- Finds pages using client-side fetching
- Suggests SSR/SSG implementation
- Optimizes API routes

### Memoization
- Identifies components that would benefit from React.memo
- Finds expensive computations for useMemo
- Suggests useCallback for event handlers

### Memory Optimization
- Detects useEffect hooks without cleanup
- Identifies potential memory leaks
- Suggests cleanup functions

### Render Optimization
- Finds inline functions in JSX
- Detects inline style objects
- Suggests moving to constants or useMemo

### API Optimization
- Identifies API routes without caching
- Suggests Cache-Control headers
- Recommends revalidate settings

## 📈 Performance Thresholds

Default thresholds (configurable):

- **Bundle Size**: 500KB
- **Page Load Time**: 3 seconds
- **First Contentful Paint**: 1.8 seconds
- **Largest Contentful Paint**: 2.5 seconds
- **Cumulative Layout Shift**: 0.1
- **First Input Delay**: 100ms

## 🔍 Monitoring

### Reports

Reports are saved to:
- `automation/reports/performance-optimizer-report-{timestamp}.json`
- `automation/reports/performance-optimizer-latest.json`

### Logs

Logs are saved to:
- `automation/logs/ai-performance-optimizer.log`
- `automation/logs/ai-performance-optimizer-out.log`
- `automation/logs/ai-performance-optimizer-error.log`

### Report Structure

```json
{
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "runtime": 5000,
    "repository": "https://github.com/Zion-Holdings/zion.app"
  },
  "analysis": {
    "performanceScore": 85,
    "summary": {
      "bundleSizeMB": "2.5",
      "bundleIssues": 3,
      "codeSplittingIssues": 2,
      "lazyLoadingIssues": 5,
      "imageIssues": 8,
      "routeIssues": 2,
      "memoizationIssues": 1,
      "buildStatus": "passing",
      "memoryIssues": 3,
      "renderIssues": 10,
      "apiIssues": 2
    },
    "optimizations": [...]
  },
  "optimizations": {
    "attempted": 15,
    "successful": 12,
    "failed": 3,
    "details": [...]
  },
  "nextSteps": [...]
}
```

## 🚨 Troubleshooting

### No Optimizations Being Applied

1. Check if there are actual performance issues
2. Review logs for error messages
3. Verify `AUTO_COMMIT` is enabled
4. Check Git permissions

### High Memory Usage

1. Reduce `MAX_OPTIMIZATIONS_PER_RUN`
2. Increase `INTERVAL_MINUTES` to run less frequently
3. Review optimization strategies

### Build Failures

1. Check build logs
2. Verify Next.js configuration
3. Review error messages in reports

## 🔗 Integration

The Performance Optimizer integrates with:
- **GitHub Actions** - Runs every 15 minutes automatically
- **PM2** - Can be managed via PM2 ecosystem
- **CI/CD** - Works with Netlify and other CI/CD platforms
- **Other AI Agents** - Shares performance data with other agents

## 📚 Related Documentation

- [AI Continuous Improvement Agent](./AI-CONTINUOUS-IMPROVEMENT-README.md)
- [AI Bundle Optimizer](./README.md)
- [AI Image Optimizer](./README.md)
- [AI Route Optimizer](./README.md)

## 🆘 Support

For issues or questions:
1. Check logs in `automation/logs/`
2. Review reports in `automation/reports/`
3. Verify configuration settings
4. Check Git permissions

---

**⚡ Powered by AI - Continuously optimizing your application performance**

