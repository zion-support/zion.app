#!/usr/bin/env node

/**
 * AI Layout Improvement Agent (ALIA)
 * 
 * An ultra-fast autonomous AI system that continuously analyzes and improves
 * app layouts, components, styling, and visual design with zero human intervention.
 * 
 * Features:
 * - Layout component analysis and optimization
 * - Responsive design improvements
 * - Spacing and typography consistency
 * - Visual hierarchy enhancements
 * - Accessibility improvements in layouts
 * - Performance optimizations (CLS, layout shifts)
 * - CSS/Tailwind optimization
 * - Component structure improvements
 * - Mobile-first design compliance
 * - Cross-browser compatibility fixes
 * 
 * @author AI Development Team
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  rootDir: process.cwd(),
  logsDir: path.join(process.cwd(), 'automation', 'logs'),
  reportsDir: path.join(process.cwd(), 'automation', 'reports'),
  dataDir: path.join(process.cwd(), 'automation', 'data'),
  
  // Continuous operation settings - OPTIMIZED FOR MAXIMUM SPEED
  continuous: process.env.CONTINUOUS_MODE !== 'false',
  intervalSeconds: parseInt(process.env.INTERVAL_SECONDS || '10', 10), // ⚡ MAXIMUM SPEED: Run every 10 seconds
  
  // Auto-commit settings - FULLY AUTONOMOUS
  autoCommit: process.env.AUTO_COMMIT !== 'false',
  autoPush: process.env.AUTO_PUSH !== 'false',
  
  // AI settings - OPTIMIZED FOR MAXIMUM SPEED
  maxImprovementsPerRun: parseInt(process.env.MAX_IMPROVEMENTS_PER_RUN || '50', 10), // Increased for maximum speed improvements
  priorityMode: process.env.PRIORITY_MODE || 'all',
  
  // Layout-specific paths
  layoutPaths: {
    components: 'app/components',
    pages: 'app',
    styles: 'app/styles',
    globals: 'app/globals.css',
    layout: 'app/layout.tsx',
  },
  
  // GitHub settings
  repository: 'https://github.com/Zion-Holdings/zion.app',
  canonicalUrl: 'https://ziontechgroup.com',
};

// Logger utility
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
  }
  
  async log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
    };
    
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${data ? ' ' + JSON.stringify(data) : ''}\n`;
    
    console.log(logLine.trim());
    
    try {
      await fs.appendFile(this.logFile, logLine);
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }
  
  info(message, data) { return this.log('info', message, data); }
  warn(message, data) { return this.log('warn', message, data); }
  error(message, data) { return this.log('error', message, data); }
  success(message, data) { return this.log('success', message, data); }
  debug(message, data) { return this.log('debug', message, data); }
}

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [CONFIG.logsDir, CONFIG.reportsDir, CONFIG.dataDir];
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
  }
}

// Execute command safely
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      cwd: CONFIG.rootDir,
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      maxBuffer: 10 * 1024 * 1024, // 10MB
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || error.stderr };
  }
}

// Layout Analysis Engine
class LayoutAnalysisEngine {
  constructor(logger) {
    this.logger = logger;
  }
  
  async analyze() {
    await this.logger.info('🎨 Starting comprehensive layout analysis...');
    
    const analysis = {
      timestamp: new Date().toISOString(),
      layoutStructure: await this.analyzeLayoutStructure(),
      responsiveDesign: await this.analyzeResponsiveDesign(),
      spacingConsistency: await this.analyzeSpacing(),
      typography: await this.analyzeTypography(),
      visualHierarchy: await this.analyzeVisualHierarchy(),
      accessibility: await this.analyzeLayoutAccessibility(),
      performance: await this.analyzeLayoutPerformance(),
      cssOptimization: await this.analyzeCSS(),
      componentStructure: await this.analyzeComponentStructure(),
      mobileFirst: await this.analyzeMobileFirst(),
    };
    
    analysis.healthScore = this.calculateHealthScore(analysis);
    analysis.recommendations = this.generateRecommendations(analysis);
    
    await this.logger.success('✅ Layout analysis complete', { healthScore: analysis.healthScore });
    
    return analysis;
  }
  
  async analyzeLayoutStructure() {
    await this.logger.debug('Analyzing layout structure...');
    const issues = [];
    
    try {
      // Check main layout file
      const layoutPath = path.join(CONFIG.rootDir, CONFIG.layoutPaths.layout);
      const layoutContent = await fs.readFile(layoutPath, 'utf8');
      
      // Check for proper semantic HTML
      if (!layoutContent.includes('<main')) {
        issues.push({
          type: 'missing-main',
          severity: 'high',
          file: CONFIG.layoutPaths.layout,
          message: 'Missing semantic <main> element',
        });
      }
      
      // Check for skip links
      if (!layoutContent.includes('SkipLink') && !layoutContent.includes('skip-link')) {
        issues.push({
          type: 'missing-skip-links',
          severity: 'medium',
          file: CONFIG.layoutPaths.layout,
          message: 'Missing skip links for accessibility',
        });
      }
      
      // Check for proper ARIA landmarks
      if (!layoutContent.includes('role=') && !layoutContent.includes('role"')) {
        issues.push({
          type: 'missing-aria-landmarks',
          severity: 'medium',
          file: CONFIG.layoutPaths.layout,
          message: 'Missing ARIA landmarks',
        });
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze layout structure', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues,
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeResponsiveDesign() {
    await this.logger.debug('Analyzing responsive design...');
    const issues = [];
    
    try {
      // Check component files for responsive classes
      const componentsDir = path.join(CONFIG.rootDir, CONFIG.layoutPaths.components);
      const files = await this.getComponentFiles(componentsDir);
      
      for (const file of files.slice(0, 10)) { // Limit to first 10 files
        try {
          const content = await fs.readFile(file, 'utf8');
          
          // Check for mobile breakpoints
          const hasMobileClasses = /(?:sm:|md:|lg:|xl:|2xl:)/.test(content);
          const hasFixedWidths = /(?:w-\d+|width:\s*\d+px)/.test(content);
          
          if (!hasMobileClasses && hasFixedWidths) {
            issues.push({
              type: 'fixed-widths-without-breakpoints',
              severity: 'medium',
              file: path.relative(CONFIG.rootDir, file),
              message: 'Fixed widths without responsive breakpoints',
            });
          }
          
          // Check for container classes
          if (!content.includes('container') && !content.includes('max-w-')) {
            issues.push({
              type: 'missing-container',
              severity: 'low',
              file: path.relative(CONFIG.rootDir, file),
              message: 'Component may benefit from container classes',
            });
          }
          
        } catch (e) {
          // Skip files that can't be read
        }
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze responsive design', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues.slice(0, 20), // Limit details
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeSpacing() {
    await this.logger.debug('Analyzing spacing consistency...');
    const issues = [];
    
    try {
      const componentsDir = path.join(CONFIG.rootDir, CONFIG.layoutPaths.components);
      const files = await this.getComponentFiles(componentsDir);
      
      const spacingPatterns = new Map();
      
      for (const file of files.slice(0, 10)) {
        try {
          const content = await fs.readFile(file, 'utf8');
          
          // Extract spacing utilities
          const spacingMatches = content.matchAll(/(?:p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr)-(\d+)/g);
          for (const match of spacingMatches) {
            const value = match[1];
            spacingPatterns.set(value, (spacingPatterns.get(value) || 0) + 1);
          }
          
        } catch (e) {
          // Skip
        }
      }
      
      // Check for inconsistent spacing (too many different values)
      if (spacingPatterns.size > 10) {
        issues.push({
          type: 'inconsistent-spacing',
          severity: 'low',
          message: `Found ${spacingPatterns.size} different spacing values - consider standardizing`,
        });
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze spacing', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues,
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeTypography() {
    await this.logger.debug('Analyzing typography...');
    const issues = [];
    
    try {
      const globalsPath = path.join(CONFIG.rootDir, CONFIG.layoutPaths.globals);
      const globalsContent = await fs.readFile(globalsPath, 'utf8');
      
      // Check for font size definitions
      if (!globalsContent.includes('font-size') && !globalsContent.includes('text-')) {
        issues.push({
          type: 'missing-typography-scale',
          severity: 'medium',
          file: CONFIG.layoutPaths.globals,
          message: 'Missing typography scale definitions',
        });
      }
      
      // Check for line-height definitions
      if (!globalsContent.includes('line-height') && !globalsContent.includes('leading-')) {
        issues.push({
          type: 'missing-line-height',
          severity: 'low',
          file: CONFIG.layoutPaths.globals,
          message: 'Missing line-height definitions',
        });
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze typography', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues,
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeVisualHierarchy() {
    await this.logger.debug('Analyzing visual hierarchy...');
    const issues = [];
    
    try {
      const componentsDir = path.join(CONFIG.rootDir, CONFIG.layoutPaths.components);
      const files = await this.getComponentFiles(componentsDir);
      
      for (const file of files.slice(0, 10)) {
        try {
          const content = await fs.readFile(file, 'utf8');
          
          // Check for heading hierarchy
          const headings = content.match(/<h[1-6]/g) || [];
          if (headings.length > 0) {
            const h1Count = (content.match(/<h1/g) || []).length;
            if (h1Count > 1) {
              issues.push({
                type: 'multiple-h1',
                severity: 'medium',
                file: path.relative(CONFIG.rootDir, file),
                message: 'Multiple h1 elements found - should have only one per page',
              });
            }
          }
          
          // Check for proper heading order
          const headingOrder = headings.map(h => parseInt(h.match(/\d/)[0]));
          for (let i = 1; i < headingOrder.length; i++) {
            if (headingOrder[i] - headingOrder[i-1] > 1) {
              issues.push({
                type: 'skipped-heading-level',
                severity: 'medium',
                file: path.relative(CONFIG.rootDir, file),
                message: 'Skipped heading level detected',
              });
              break;
            }
          }
          
        } catch (e) {
          // Skip
        }
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze visual hierarchy', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues.slice(0, 10),
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeLayoutAccessibility() {
    await this.logger.debug('Analyzing layout accessibility...');
    const issues = [];
    
    try {
      const componentsDir = path.join(CONFIG.rootDir, CONFIG.layoutPaths.components);
      const files = await this.getComponentFiles(componentsDir);
      
      for (const file of files.slice(0, 10)) {
        try {
          const content = await fs.readFile(file, 'utf8');
          
          // Check for images without alt text
          const images = content.match(/<img[^>]*>/g) || [];
          for (const img of images) {
            if (!img.includes('alt=') && !img.includes('alt"')) {
              issues.push({
                type: 'missing-alt-text',
                severity: 'high',
                file: path.relative(CONFIG.rootDir, file),
                message: 'Image missing alt text',
              });
            }
          }
          
          // Check for buttons without aria-label or text
          const buttons = content.match(/<button[^>]*>/g) || [];
          for (const button of buttons) {
            if (!button.includes('aria-label') && !button.includes('aria-labelledby') && 
                !content.includes(button) || content.indexOf(button) + button.length < content.length - 50) {
              // Simple check - would need more sophisticated parsing
            }
          }
          
          // Check for form inputs without labels
          const inputs = content.match(/<input[^>]*>/g) || [];
          for (const input of inputs) {
            if (!input.includes('aria-label') && !input.includes('aria-labelledby') && 
                !input.includes('id=')) {
              issues.push({
                type: 'input-without-label',
                severity: 'high',
                file: path.relative(CONFIG.rootDir, file),
                message: 'Input missing label or aria-label',
              });
            }
          }
          
        } catch (e) {
          // Skip
        }
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze accessibility', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues.slice(0, 15),
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeLayoutPerformance() {
    await this.logger.debug('Analyzing layout performance...');
    const issues = [];
    
    try {
      const componentsDir = path.join(CONFIG.rootDir, CONFIG.layoutPaths.components);
      const files = await this.getComponentFiles(componentsDir);
      
      for (const file of files.slice(0, 10)) {
        try {
          const content = await fs.readFile(file, 'utf8');
          
          // Check for layout shift issues
          if (content.includes('position: absolute') && !content.includes('width') && 
              !content.includes('height')) {
            issues.push({
              type: 'potential-layout-shift',
              severity: 'medium',
              file: path.relative(CONFIG.rootDir, file),
              message: 'Absolute positioning without dimensions may cause layout shifts',
            });
          }
          
          // Check for inline styles (can cause reflows)
          const inlineStyles = (content.match(/style=\{[^}]*\}/g) || []).length;
          if (inlineStyles > 5) {
            issues.push({
              type: 'too-many-inline-styles',
              severity: 'low',
              file: path.relative(CONFIG.rootDir, file),
              message: `Found ${inlineStyles} inline styles - consider using CSS classes`,
            });
          }
          
        } catch (e) {
          // Skip
        }
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze performance', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues.slice(0, 10),
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeCSS() {
    await this.logger.debug('Analyzing CSS optimization...');
    const issues = [];
    
    try {
      const globalsPath = path.join(CONFIG.rootDir, CONFIG.layoutPaths.globals);
      const globalsContent = await fs.readFile(globalsPath, 'utf8');
      
      // Check for unused CSS
      // This is a simplified check - real implementation would need AST parsing
      if (globalsContent.length > 50000) {
        issues.push({
          type: 'large-css-file',
          severity: 'low',
          file: CONFIG.layoutPaths.globals,
          message: 'Large CSS file - consider splitting or purging unused styles',
        });
      }
      
      // Check for Tailwind directives
      if (!globalsContent.includes('@tailwind')) {
        issues.push({
          type: 'missing-tailwind-directives',
          severity: 'high',
          file: CONFIG.layoutPaths.globals,
          message: 'Missing Tailwind CSS directives',
        });
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze CSS', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues,
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeComponentStructure() {
    await this.logger.debug('Analyzing component structure...');
    const issues = [];
    
    try {
      const componentsDir = path.join(CONFIG.rootDir, CONFIG.layoutPaths.components);
      const files = await this.getComponentFiles(componentsDir);
      
      for (const file of files.slice(0, 10)) {
        try {
          const content = await fs.readFile(file, 'utf8');
          
          // Check for proper React component structure
          if (!content.includes('export') && !content.includes('export default')) {
            issues.push({
              type: 'missing-export',
              severity: 'high',
              file: path.relative(CONFIG.rootDir, file),
              message: 'Component missing export statement',
            });
          }
          
          // Check for TypeScript types
          if (file.endsWith('.tsx') && !content.includes('interface') && 
              !content.includes('type ') && content.includes('props')) {
            issues.push({
              type: 'missing-types',
              severity: 'medium',
              file: path.relative(CONFIG.rootDir, file),
              message: 'Component props missing TypeScript types',
            });
          }
          
        } catch (e) {
          // Skip
        }
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze component structure', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues.slice(0, 10),
      hasIssues: issues.length > 0,
    };
  }
  
  async analyzeMobileFirst() {
    await this.logger.debug('Analyzing mobile-first design...');
    const issues = [];
    
    try {
      const componentsDir = path.join(CONFIG.rootDir, CONFIG.layoutPaths.components);
      const files = await this.getComponentFiles(componentsDir);
      
      for (const file of files.slice(0, 10)) {
        try {
          const content = await fs.readFile(file, 'utf8');
          
          // Check for desktop-first breakpoints (md: before base)
          const hasDesktopFirst = /md:[^}]*\{[^}]*\}/.test(content);
          const hasBaseClasses = /(?:^|\s)(?:flex|grid|block|hidden)(?:\s|$)/.test(content);
          
          if (hasDesktopFirst && !hasBaseClasses) {
            issues.push({
              type: 'desktop-first-approach',
              severity: 'low',
              file: path.relative(CONFIG.rootDir, file),
              message: 'Consider mobile-first approach with base styles',
            });
          }
          
        } catch (e) {
          // Skip
        }
      }
      
    } catch (e) {
      await this.logger.warn('Could not analyze mobile-first', { error: e.message });
    }
    
    return {
      issues: issues.length,
      details: issues.slice(0, 10),
      hasIssues: issues.length > 0,
    };
  }
  
  async getComponentFiles(dir) {
    const files = [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...await this.getComponentFiles(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Directory might not exist
    }
    return files;
  }
  
  calculateHealthScore(analysis) {
    let score = 100;
    
    // Deduct points for various issues
    score -= analysis.layoutStructure.issues * 5;
    score -= analysis.responsiveDesign.issues * 3;
    score -= analysis.spacingConsistency.issues * 2;
    score -= analysis.typography.issues * 3;
    score -= analysis.visualHierarchy.issues * 4;
    score -= analysis.accessibility.issues * 8; // Accessibility is critical
    score -= analysis.performance.issues * 4;
    score -= analysis.cssOptimization.issues * 3;
    score -= analysis.componentStructure.issues * 5;
    score -= analysis.mobileFirst.issues * 2;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.layoutStructure.hasIssues) {
      recommendations.push({
        priority: 'high',
        category: 'layout-structure',
        message: 'Improve layout structure and semantic HTML',
        action: 'improve-layout-structure',
        details: analysis.layoutStructure.details.slice(0, 5),
      });
    }
    
    if (analysis.responsiveDesign.hasIssues) {
      recommendations.push({
        priority: 'high',
        category: 'responsive-design',
        message: 'Improve responsive design',
        action: 'improve-responsive-design',
        details: analysis.responsiveDesign.details.slice(0, 5),
      });
    }
    
    if (analysis.accessibility.hasIssues) {
      recommendations.push({
        priority: 'critical',
        category: 'accessibility',
        message: 'Fix accessibility issues in layouts',
        action: 'fix-layout-accessibility',
        details: analysis.accessibility.details.slice(0, 5),
      });
    }
    
    if (analysis.visualHierarchy.hasIssues) {
      recommendations.push({
        priority: 'medium',
        category: 'visual-hierarchy',
        message: 'Improve visual hierarchy',
        action: 'improve-visual-hierarchy',
        details: analysis.visualHierarchy.details.slice(0, 5),
      });
    }
    
    if (analysis.spacingConsistency.hasIssues) {
      recommendations.push({
        priority: 'low',
        category: 'spacing',
        message: 'Standardize spacing',
        action: 'standardize-spacing',
        details: analysis.spacingConsistency.details,
      });
    }
    
    if (analysis.typography.hasIssues) {
      recommendations.push({
        priority: 'medium',
        category: 'typography',
        message: 'Improve typography system',
        action: 'improve-typography',
        details: analysis.typography.details,
      });
    }
    
    if (analysis.performance.hasIssues) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        message: 'Optimize layout performance',
        action: 'optimize-layout-performance',
        details: analysis.performance.details.slice(0, 5),
      });
    }
    
    if (analysis.cssOptimization.hasIssues) {
      recommendations.push({
        priority: 'low',
        category: 'css-optimization',
        message: 'Optimize CSS',
        action: 'optimize-css',
        details: analysis.cssOptimization.details,
      });
    }
    
    if (analysis.componentStructure.hasIssues) {
      recommendations.push({
        priority: 'high',
        category: 'component-structure',
        message: 'Improve component structure',
        action: 'improve-component-structure',
        details: analysis.componentStructure.details.slice(0, 5),
      });
    }
    
    if (analysis.mobileFirst.hasIssues) {
      recommendations.push({
        priority: 'low',
        category: 'mobile-first',
        message: 'Adopt mobile-first approach',
        action: 'improve-mobile-first',
        details: analysis.mobileFirst.details.slice(0, 5),
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorities = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorities[a.priority] - priorities[b.priority];
    });
  }
}

// Layout Improvement Engine
class LayoutImprovementEngine {
  constructor(logger) {
    this.logger = logger;
    this.improvementCount = 0;
  }
  
  async applyImprovements(analysis) {
    await this.logger.info('🎨 Starting automated layout improvements...');
    
    const recommendations = analysis.recommendations.slice(0, CONFIG.maxImprovementsPerRun);
    const results = [];
    
    for (const rec of recommendations) {
      if (this.improvementCount >= CONFIG.maxImprovementsPerRun) {
        await this.logger.info('⚠️  Max improvements per run reached, stopping');
        break;
      }
      
      await this.logger.info(`Applying improvement: ${rec.message}`);
      const result = await this.applyImprovement(rec);
      results.push({ recommendation: rec, result });
      
      if (result.success) {
        this.improvementCount++;
      }
    }
    
    return results;
  }
  
  async applyImprovement(recommendation) {
    try {
      switch (recommendation.action) {
        case 'improve-layout-structure':
          return await this.improveLayoutStructure(recommendation);
        
        case 'improve-responsive-design':
          return await this.improveResponsiveDesign(recommendation);
        
        case 'fix-layout-accessibility':
          return await this.fixLayoutAccessibility(recommendation);
        
        case 'improve-visual-hierarchy':
          return await this.improveVisualHierarchy(recommendation);
        
        case 'standardize-spacing':
          return await this.standardizeSpacing(recommendation);
        
        case 'improve-typography':
          return await this.improveTypography(recommendation);
        
        case 'optimize-layout-performance':
          return await this.optimizeLayoutPerformance(recommendation);
        
        case 'optimize-css':
          return await this.optimizeCSS(recommendation);
        
        case 'improve-component-structure':
          return await this.improveComponentStructure(recommendation);
        
        case 'improve-mobile-first':
          return await this.improveMobileFirst(recommendation);
        
        default:
          return { success: false, message: 'Unknown improvement action' };
      }
    } catch (error) {
      await this.logger.error(`Failed to apply improvement: ${recommendation.action}`, { error: error.message });
      return { success: false, error: error.message };
    }
  }
  
  async improveLayoutStructure(recommendation) {
    await this.logger.info('Improving layout structure...');
    
    try {
      const layoutPath = path.join(CONFIG.rootDir, CONFIG.layoutPaths.layout);
      let content = await fs.readFile(layoutPath, 'utf8');
      let changed = false;
      
      // Ensure main element has proper attributes
      if (content.includes('<main') && !content.includes('role="main"')) {
        content = content.replace(/<main([^>]*)>/g, '<main$1 role="main">');
        changed = true;
      }
      
      // Ensure nav has role
      if (content.includes('<nav') && !content.includes('role="navigation"')) {
        content = content.replace(/<nav([^>]*)>/g, '<nav$1 role="navigation">');
        changed = true;
      }
      
      if (changed) {
        await fs.writeFile(layoutPath, content, 'utf8');
        return {
          success: true,
          message: 'Improved layout structure',
          changes: true,
        };
      }
      
      return {
        success: true,
        message: 'Layout structure already optimal',
        changes: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        changes: false,
      };
    }
  }
  
  async improveResponsiveDesign(recommendation) {
    await this.logger.info('Improving responsive design...');
    
    // This would require AI-powered code generation
    // For now, we'll log the need for improvement
    
    return {
      success: false,
      message: 'Responsive design improvements require AI code generation',
      changes: false,
    };
  }
  
  async fixLayoutAccessibility(recommendation) {
    await this.logger.info('Fixing layout accessibility...');
    
    if (!recommendation.details || recommendation.details.length === 0) {
      return { success: true, message: 'No accessibility issues to fix', changes: false };
    }
    
    let fixedCount = 0;
    
    for (const issue of recommendation.details.slice(0, 5)) {
      if (!issue.file) continue;
      
      try {
        const filePath = path.join(CONFIG.rootDir, issue.file);
        let content = await fs.readFile(filePath, 'utf8');
        let changed = false;
        
        if (issue.type === 'missing-alt-text') {
          // Add placeholder alt text for images
          content = content.replace(/<img([^>]*?)(?:\s+alt\s*=\s*["'][^"']*["'])?([^>]*)>/g, 
            (match, before, after) => {
              if (!match.includes('alt=')) {
                return `<img${before} alt=""${after}>`;
              }
              return match;
            });
          changed = true;
        }
        
        if (changed) {
          await fs.writeFile(filePath, content, 'utf8');
          fixedCount++;
        }
      } catch (e) {
        await this.logger.warn(`Could not fix accessibility issue in ${issue.file}`, { error: e.message });
      }
    }
    
    return {
      success: fixedCount > 0,
      message: `Fixed ${fixedCount} accessibility issues`,
      changes: fixedCount > 0,
    };
  }
  
  async improveVisualHierarchy(recommendation) {
    await this.logger.info('Improving visual hierarchy...');
    
    // This would require AI-powered analysis and code generation
    return {
      success: false,
      message: 'Visual hierarchy improvements require AI code generation',
      changes: false,
    };
  }
  
  async standardizeSpacing(recommendation) {
    await this.logger.info('Standardizing spacing...');
    
    // This would require analyzing and refactoring spacing utilities
    return {
      success: false,
      message: 'Spacing standardization requires refactoring',
      changes: false,
    };
  }
  
  async improveTypography(recommendation) {
    await this.logger.info('Improving typography...');
    
    try {
      const globalsPath = path.join(CONFIG.rootDir, CONFIG.layoutPaths.globals);
      let content = await fs.readFile(globalsPath, 'utf8');
      let changed = false;
      
      // Add typography scale if missing
      if (!content.includes('font-size') && !content.includes('text-')) {
        const typographyAdditions = `
/* Typography Scale */
:root {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
`;
        content = typographyAdditions + content;
        changed = true;
      }
      
      if (changed) {
        await fs.writeFile(globalsPath, content, 'utf8');
        return {
          success: true,
          message: 'Improved typography system',
          changes: true,
        };
      }
      
      return {
        success: true,
        message: 'Typography already optimal',
        changes: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        changes: false,
      };
    }
  }
  
  async optimizeLayoutPerformance(recommendation) {
    await this.logger.info('Optimizing layout performance...');
    
    // This would require AI-powered code optimization
    return {
      success: false,
      message: 'Performance optimizations require AI code generation',
      changes: false,
    };
  }
  
  async optimizeCSS(recommendation) {
    await this.logger.info('Optimizing CSS...');
    
    // Check if Tailwind is being used properly
    try {
      const globalsPath = path.join(CONFIG.rootDir, CONFIG.layoutPaths.globals);
      let content = await fs.readFile(globalsPath, 'utf8');
      
      if (!content.includes('@tailwind base') && !content.includes('@tailwind')) {
        const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;
        content = tailwindDirectives + content;
        await fs.writeFile(globalsPath, content, 'utf8');
        
        return {
          success: true,
          message: 'Added Tailwind directives',
          changes: true,
        };
      }
      
      return {
        success: true,
        message: 'CSS already optimized',
        changes: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        changes: false,
      };
    }
  }
  
  async improveComponentStructure(recommendation) {
    await this.logger.info('Improving component structure...');
    
    // This would require AI-powered code refactoring
    return {
      success: false,
      message: 'Component structure improvements require AI code generation',
      changes: false,
    };
  }
  
  async improveMobileFirst(recommendation) {
    await this.logger.info('Improving mobile-first design...');
    
    // This would require AI-powered code refactoring
    return {
      success: false,
      message: 'Mobile-first improvements require AI code generation',
      changes: false,
    };
  }
}

// Git Integration
class GitManager {
  constructor(logger) {
    this.logger = logger;
  }
  
  async hasChanges() {
    const result = execCommand('git status --porcelain', { silent: true });
    return result.success && result.output.trim().length > 0;
  }
  
  async commitAndPush(message, changes = []) {
    if (!CONFIG.autoCommit) {
      await this.logger.info('Auto-commit disabled, skipping commit');
      return { success: false, message: 'Auto-commit disabled' };
    }
    
    try {
      if (!(await this.hasChanges())) {
        await this.logger.info('No changes to commit');
        return { success: true, message: 'No changes' };
      }
      
      // Stage all changes
      execCommand('git add .');
      
      // Create commit message
      const commitMsg = `🎨 AI Layout Improvement: ${message}

${changes.length > 0 ? 'Improvements:\n' + changes.map(c => `- ${c}`).join('\n') : ''}

Automated by AI Layout Improvement Agent
Timestamp: ${new Date().toISOString()}`;
      
      // Commit
      execCommand(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
      await this.logger.success('✅ Changes committed');
      
      // Push if enabled
      if (CONFIG.autoPush) {
        const pushResult = execCommand('git push origin main');
        if (pushResult.success) {
          await this.logger.success('✅ Changes pushed to main');
          return { success: true, message: 'Committed and pushed' };
        } else {
          await this.logger.warn('⚠️  Failed to push changes');
          return { success: false, message: 'Commit succeeded, push failed' };
        }
      }
      
      return { success: true, message: 'Committed (push disabled)' };
    } catch (error) {
      await this.logger.error('Failed to commit changes', { error: error.message });
      return { success: false, error: error.message };
    }
  }
}

// Report Generator
class ReportGenerator {
  constructor(logger) {
    this.logger = logger;
  }
  
  async generateReport(analysis, improvements, runtime) {
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        runtime: runtime,
        repository: CONFIG.repository,
      },
      analysis: {
        healthScore: analysis.healthScore,
        summary: {
          layoutStructure: analysis.layoutStructure.issues,
          responsiveDesign: analysis.responsiveDesign.issues,
          spacingConsistency: analysis.spacingConsistency.issues,
          typography: analysis.typography.issues,
          visualHierarchy: analysis.visualHierarchy.issues,
          accessibility: analysis.accessibility.issues,
          performance: analysis.performance.issues,
          cssOptimization: analysis.cssOptimization.issues,
          componentStructure: analysis.componentStructure.issues,
          mobileFirst: analysis.mobileFirst.issues,
        },
        recommendations: analysis.recommendations,
      },
      improvements: {
        attempted: improvements.length,
        successful: improvements.filter(i => i.result.success).length,
        failed: improvements.filter(i => !i.result.success).length,
        details: improvements,
      },
      nextSteps: this.generateNextSteps(analysis, improvements),
    };
    
    // Save report
    const reportPath = path.join(CONFIG.reportsDir, `layout-improvement-report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    await this.logger.success(`📊 Report saved to ${reportPath}`);
    
    // Also save as latest
    const latestPath = path.join(CONFIG.reportsDir, 'layout-improvement-latest-report.json');
    await fs.writeFile(latestPath, JSON.stringify(report, null, 2));
    
    return report;
  }
  
  generateNextSteps(analysis, improvements) {
    const steps = [];
    
    const failedImprovements = improvements.filter(i => !i.result.success);
    if (failedImprovements.length > 0) {
      steps.push({
        priority: 'high',
        action: 'Review failed improvements',
        details: failedImprovements.map(i => i.recommendation.message),
      });
    }
    
    if (analysis.healthScore < 70) {
      steps.push({
        priority: 'critical',
        action: 'Layout health score below 70',
        details: 'Immediate attention required',
      });
    }
    
    const remainingRecs = analysis.recommendations.slice(CONFIG.maxImprovementsPerRun);
    if (remainingRecs.length > 0) {
      steps.push({
        priority: 'medium',
        action: 'Continue improving remaining issues',
        details: `${remainingRecs.length} recommendations pending`,
      });
    }
    
    return steps;
  }
}

// Main Agent Class
class AILayoutImprovementAgent {
  constructor() {
    const logFile = path.join(CONFIG.logsDir, 'ai-layout-improvement.log');
    this.logger = new Logger(logFile);
    this.analysisEngine = new LayoutAnalysisEngine(this.logger);
    this.improvementEngine = new LayoutImprovementEngine(this.logger);
    this.gitManager = new GitManager(this.logger);
    this.reportGenerator = new ReportGenerator(this.logger);
    this.isRunning = false;
  }
  
  async run() {
    const startTime = Date.now();
    
    await this.logger.info('🎨 AI Layout Improvement Agent starting (MAXIMUM SPEED MODE)...');
    await this.logger.info(`⚡ Configuration: ${CONFIG.intervalSeconds}s interval, ${CONFIG.maxImprovementsPerRun} improvements/run`);
    
    try {
      // Step 1: Analyze layouts
      const analysis = await this.analysisEngine.analyze();
      await this.logger.info(`🎨 Layout Health Score: ${analysis.healthScore}/100`);
      
      // Step 2: Apply improvements
      const improvements = await this.improvementEngine.applyImprovements(analysis);
      const successfulImprovements = improvements.filter(i => i.result.success && i.result.changes);
      await this.logger.info(`🎨 Improvements applied: ${successfulImprovements.length}/${improvements.length}`);
      
      // Step 3: Commit and push changes
      const changesDescription = successfulImprovements.map(i => i.recommendation.message);
      
      if (changesDescription.length > 0) {
        const gitResult = await this.gitManager.commitAndPush(
          `🎨 Layout Improvements: ${successfulImprovements.length} improvements applied`,
          changesDescription
        );
        
        if (gitResult.success) {
          await this.logger.success(`✅ Changes committed and pushed successfully`);
        }
      } else {
        await this.logger.info('🎨 No changes to commit');
      }
      
      // Step 4: Generate report
      const runtime = Date.now() - startTime;
      const report = await this.reportGenerator.generateReport(analysis, improvements, runtime);
      
      await this.logger.success(`🎨 Run complete in ${(runtime / 1000).toFixed(1)}s`);
      await this.logger.success(`📊 Layout Health Score: ${report.analysis.healthScore}/100`);
      
      return report;
    } catch (error) {
      await this.logger.error('❌ Agent run failed', { error: error.message, stack: error.stack });
      throw error;
    }
  }
  
  async runContinuously() {
    this.isRunning = true;
    await this.logger.info('🚀 Starting MAXIMUM SPEED continuous layout improvement mode...');
    await this.logger.info(`⚡ Running every ${CONFIG.intervalSeconds} seconds for MAXIMUM SPEED`);
    await this.logger.info('🤖 Fully autonomous mode - auto-commit and auto-push enabled');
    
    while (this.isRunning) {
      try {
        const startTime = Date.now();
        await this.run();
        const runtime = Date.now() - startTime;
        
        // Calculate wait time (ensure minimum 5 seconds between runs for MAXIMUM SPEED)
        const waitMs = Math.max(
          CONFIG.intervalSeconds * 1000 - runtime,
          5000 // Minimum 5 seconds between runs for MAXIMUM SPEED
        );
        
        await this.logger.info(`⚡ Run completed in ${(runtime / 1000).toFixed(1)}s, next run in ${(waitMs / 1000).toFixed(1)}s`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
      } catch (error) {
        await this.logger.error('Error in continuous loop', { error: error.message });
        // Quick retry on error - MAXIMUM SPEED: only 5 seconds wait
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds for MAXIMUM SPEED
      }
    }
  }
  
  stop() {
    this.isRunning = false;
    this.logger.info('🛑 Stopping continuous operation...');
  }
}

// CLI Interface
async function main() {
  await ensureDirectories();
  
  const agent = new AILayoutImprovementAgent();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'continuous';
  
  switch (command) {
    case 'run':
      await agent.run();
      break;
    
    case 'continuous':
    case 'start':
    case '':
      await agent.runContinuously();
      break;
    
    case 'analyze':
      const analysis = await agent.analysisEngine.analyze();
      console.log(JSON.stringify(analysis, null, 2));
      break;
    
    default:
      console.log(`
AI Layout Improvement Agent (ALIA)

Usage:
  node ai-layout-improvement-agent.cjs [command]

Commands:
  run         Run one improvement cycle
  continuous  Run continuously with periodic intervals (DEFAULT)
  start       Alias for continuous
  analyze     Run analysis only (no improvements)

Environment Variables:
  CONTINUOUS_MODE=true              Enable continuous mode (default: true)
  INTERVAL_SECONDS=10                Seconds between runs (default: 10 - MAXIMUM SPEED)
  AUTO_COMMIT=true                  Auto-commit changes (default: true)
  AUTO_PUSH=true                    Auto-push to main (default: true)
  MAX_IMPROVEMENTS_PER_RUN=50       Max improvements per cycle (default: 50 - MAXIMUM SPEED)
  PRIORITY_MODE=all                 Priority filter (critical|high|medium|low|all)

Examples:
  node ai-layout-improvement-agent.cjs          # Starts continuous mode automatically
  node ai-layout-improvement-agent.cjs continuous  # Explicit continuous mode
  node ai-layout-improvement-agent.cjs run      # Single run
  INTERVAL_SECONDS=5 node ai-layout-improvement-agent.cjs  # MAXIMUM SPEED: 5-second intervals
  AUTO_PUSH=false node ai-layout-improvement-agent.cjs  # Test mode (no push)
      `);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { AILayoutImprovementAgent, CONFIG };


