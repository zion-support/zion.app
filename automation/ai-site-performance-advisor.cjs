#!/usr/bin/env node

/**
 * AI Site Performance Advisor
 *
 * Analyzes the Next.js build output, bundle sizes, route structure,
 * and page load characteristics, then uses an LLM to produce
 * actionable performance improvement recommendations.
 *
 * Designed for static-export Next.js sites.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const CONFIG = {
  projectRoot: process.cwd(),
  reportsDir: path.join(process.cwd(), 'automation', 'reports'),
  logsDir: path.join(process.cwd(), 'automation', 'logs'),
  outDir: path.join(process.cwd(), 'out'),
  nextDir: path.join(process.cwd(), '.next'),
  publicDir: path.join(process.cwd(), 'public'),
  maxFilesToAnalyze: 100,
};

function ensureDirs() {
  [CONFIG.reportsDir, CONFIG.logsDir].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function log(msg, level = 'INFO') {
  const line = `[${new Date().toISOString()}] [${level}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(
      path.join(CONFIG.logsDir, 'ai-site-performance-advisor.log'),
      line + '\n',
    );
  } catch {
    /* ignore */
  }
}

function getDirectorySize(dir) {
  let total = 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        total += getDirectorySize(full);
      } else if (e.isFile()) {
        total += fs.statSync(full).size;
      }
    }
  } catch {
    /* ignore */
  }
  return total;
}

function findFiles(dir, ext, maxDepth = 5, depth = 0) {
  if (depth > maxDepth) return [];
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
        results.push(...findFiles(full, ext, maxDepth, depth + 1));
      }
      if (e.isFile() && e.name.endsWith(ext)) {
        results.push(full);
      }
    }
  } catch {
    /* ignore */
  }
  return results;
}

function analyzeBuildOutput() {
  const metrics = {
    buildExists: false,
    totalBuildSize: 0,
    totalPublicSize: 0,
    htmlFiles: 0,
    jsFiles: 0,
    cssFiles: 0,
    imageFiles: 0,
    largestFiles: [],
    unoptimizedImages: [],
  };

  const buildDir = fs.existsSync(CONFIG.outDir) ? CONFIG.outDir : CONFIG.nextDir;
  metrics.buildExists = fs.existsSync(buildDir);
  if (!metrics.buildExists) return metrics;

  metrics.totalBuildSize = getDirectorySize(buildDir);
  metrics.totalPublicSize = getDirectorySize(CONFIG.publicDir);

  const htmlFiles = findFiles(buildDir, '.html');
  const jsFiles = findFiles(buildDir, '.js');
  const cssFiles = findFiles(buildDir, '.css');
  metrics.htmlFiles = htmlFiles.length;
  metrics.jsFiles = jsFiles.length;
  metrics.cssFiles = cssFiles.length;

  const allFiles = [...htmlFiles, ...jsFiles, ...cssFiles].map((f) => ({
    path: path.relative(CONFIG.projectRoot, f),
    size: fs.statSync(f).size,
  }));

  allFiles.sort((a, b) => b.size - a.size);
  metrics.largestFiles = allFiles.slice(0, 20);

  const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'];
  for (const ext of imgExts) {
    const imgs = findFiles(CONFIG.publicDir, ext);
    metrics.imageFiles += imgs.length;
    for (const img of imgs) {
      const stat = fs.statSync(img);
      if (stat.size > 200 * 1024) {
        metrics.unoptimizedImages.push({
          path: path.relative(CONFIG.projectRoot, img),
          sizeKB: Math.round(stat.size / 1024),
        });
      }
    }
  }

  return metrics;
}

function analyzePackageJson() {
  const pkgPath = path.join(CONFIG.projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const deps = Object.keys(pkg.dependencies || {});
    const devDeps = Object.keys(pkg.devDependencies || {});
    const heavyDeps = deps.filter((d) =>
      ['moment', 'lodash', 'jquery', 'rxjs', 'three', 'chart.js', 'd3'].some((h) =>
        d.includes(h),
      ),
    );
    return {
      totalDeps: deps.length,
      totalDevDeps: devDeps.length,
      heavyDeps,
      hasAnalyzer: deps.includes('@next/bundle-analyzer') || devDeps.includes('@next/bundle-analyzer'),
    };
  } catch {
    return null;
  }
}

function analyzeNextConfig() {
  const configPath = path.join(CONFIG.projectRoot, 'next.config.ts');
  const configPathMjs = path.join(CONFIG.projectRoot, 'next.config.mjs');
  const configPathJs = path.join(CONFIG.projectRoot, 'next.config.js');

  for (const p of [configPath, configPathMjs, configPathJs]) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      return {
        path: path.relative(CONFIG.projectRoot, p),
        hasImageOptimization: /images\s*:/i.test(content),
        hasCompression: /compress/i.test(content),
        hasStaticExport: /output.*export/i.test(content),
        hasSwcMinify: /swcMinify/i.test(content),
        hasBundleAnalyzer: /bundle.?analyzer/i.test(content),
        contentPreview: content.slice(0, 1500),
      };
    }
  }
  return null;
}

async function getAIRecommendations(llm, buildMetrics, pkgInfo, nextConfig) {
  if (!llm.isConfigured()) return null;

  const data = {
    build: {
      totalSizeMB: (buildMetrics.totalBuildSize / (1024 * 1024)).toFixed(2),
      publicSizeMB: (buildMetrics.totalPublicSize / (1024 * 1024)).toFixed(2),
      htmlPages: buildMetrics.htmlFiles,
      jsChunks: buildMetrics.jsFiles,
      cssFiles: buildMetrics.cssFiles,
      largeFiles: buildMetrics.largestFiles.slice(0, 10),
      unoptimizedImages: buildMetrics.unoptimizedImages.slice(0, 10),
    },
    dependencies: pkgInfo,
    nextConfig: nextConfig
      ? {
          hasImageOptimization: nextConfig.hasImageOptimization,
          hasStaticExport: nextConfig.hasStaticExport,
          hasBundleAnalyzer: nextConfig.hasBundleAnalyzer,
        }
      : null,
  };

  const prompt = `Analyze this Next.js static site's performance data and provide specific optimization recommendations.

Site data:
${JSON.stringify(data, null, 2)}

Return a JSON object with:
- "score": overall performance score 0-100
- "critical": array of critical issues to fix immediately
- "recommendations": array of objects with "title", "description", "impact" (high/medium/low), "effort" (easy/medium/hard)
- "quickWins": array of changes that are easy and high-impact

Return ONLY valid JSON, no markdown.`;

  try {
    const raw = await llm.chat(prompt, {
      maxTokens: 2048,
      systemPrompt: 'You are a web performance expert specializing in Next.js. Return only valid JSON.',
    });
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    log(`LLM analysis failed: ${err.message}`, 'WARN');
    return null;
  }
}

async function run() {
  ensureDirs();
  log('⚡ AI Site Performance Advisor starting...');

  const llm = createLLMClient({ appName: 'Zion Performance Advisor' });
  log(`LLM: ${llm.getProviderInfo().provider} (configured: ${llm.isConfigured()})`);

  log('Analyzing build output...');
  const buildMetrics = analyzeBuildOutput();

  log('Analyzing package.json...');
  const pkgInfo = analyzePackageJson();

  log('Analyzing next.config...');
  const nextConfig = analyzeNextConfig();

  const aiRecs = await getAIRecommendations(llm, buildMetrics, pkgInfo, nextConfig);

  const report = {
    timestamp: new Date().toISOString(),
    buildMetrics: {
      exists: buildMetrics.buildExists,
      totalSizeMB: +(buildMetrics.totalBuildSize / (1024 * 1024)).toFixed(2),
      publicSizeMB: +(buildMetrics.totalPublicSize / (1024 * 1024)).toFixed(2),
      pages: buildMetrics.htmlFiles,
      jsChunks: buildMetrics.jsFiles,
      cssFiles: buildMetrics.cssFiles,
      images: buildMetrics.imageFiles,
      unoptimizedImages: buildMetrics.unoptimizedImages.length,
    },
    packageInfo: pkgInfo,
    nextConfig: nextConfig
      ? {
          path: nextConfig.path,
          hasImageOptimization: nextConfig.hasImageOptimization,
          hasStaticExport: nextConfig.hasStaticExport,
          hasBundleAnalyzer: nextConfig.hasBundleAnalyzer,
        }
      : null,
    largestFiles: buildMetrics.largestFiles.slice(0, 10),
    unoptimizedImages: buildMetrics.unoptimizedImages,
    aiRecommendations: aiRecs,
  };

  const reportPath = path.join(CONFIG.reportsDir, 'performance-advisor-latest.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`✅ Performance report written to ${reportPath}`);

  if (buildMetrics.buildExists) {
    log(`   Build size: ${report.buildMetrics.totalSizeMB} MB`);
    log(`   Pages: ${report.buildMetrics.pages}`);
    log(`   JS chunks: ${report.buildMetrics.jsChunks}`);
    log(`   Unoptimized images: ${report.buildMetrics.unoptimizedImages}`);
  } else {
    log('   No build output found. Run `npm run build` first.', 'WARN');
  }

  if (aiRecs) {
    log(`   AI Performance Score: ${aiRecs.score}/100`);
    log(`   Critical issues: ${(aiRecs.critical || []).length}`);
    log(`   Recommendations: ${(aiRecs.recommendations || []).length}`);
  }

  return report;
}

if (require.main === module) {
  run()
    .then(() => {
      log('🏁 Performance analysis complete.');
      process.exit(0);
    })
    .catch((err) => {
      log(`Fatal error: ${err.message}`, 'ERROR');
      process.exit(1);
    });
}

module.exports = { run };
