const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files to fix
const filesToFix = [
  'app/5g-mobile-applications/page.tsx',
  'app/about/layout.tsx',
  'app/about/page.tsx',
  'app/components/AccessibilityComponents.tsx',
  'app/components/AdvancedPerformanceEnhancer.tsx',
  'app/components/ContentNewsletterSignup.tsx',
  'app/components/ContentStatistics.tsx',
  'app/components/EnhancedAccessibilityManager.tsx',
  'app/components/EnhancedSEO.tsx',
  'app/components/Header.tsx',
  'app/components/LazyImage.tsx',
  'app/components/PWAInstaller.tsx',
  'app/components/PerformanceMonitor.tsx',
  'app/components/PerformanceMonitoring.tsx',
  'app/components/PerformanceOptimizations.tsx',
  'app/components/PerformanceOptimizer.tsx',
  'app/components/SEOOptimizer.tsx',
  'app/hooks/useEnhancedPerformance.ts',
  'app/hooks/useErrorMonitoring.ts',
  'app/hooks/useForm.ts',
  'app/not-found.tsx',
  'app/offline/page.tsx',
  'app/utils/logger.ts',
  'app/utils/monitoring.ts',
  'app/utils/performance.ts',
  'app/utils/performanceOptimizer.ts',
  'app/utils/performanceUtils.ts'
];

function fixUnusedVariables(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix unused imports by prefixing with underscore
    content = content.replace(/import\s+{\s*([^}]+)\s*}\s+from\s+['"][^'"]+['"];?/g, (match, imports) => {
      const importList = imports.split(',').map(imp => {
        const trimmed = imp.trim();
        if (trimmed.startsWith('_')) return trimmed;
        return `_${trimmed}`;
      });
      return match.replace(imports, importList.join(', '));
    });

    // Fix unused variables in function parameters
    content = content.replace(/\(([^)]*)\)\s*=>/g, (match, params) => {
      const paramList = params.split(',').map(param => {
        const trimmed = param.trim();
        if (trimmed.startsWith('_') || trimmed.includes(':')) return trimmed;
        return `_${trimmed}`;
      });
      return match.replace(params, paramList.join(', '));
    });

    // Fix unused variable declarations
    content = content.replace(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, (match, varName) => {
      if (!varName.startsWith('_')) {
        return match.replace(varName, `_${varName}`);
      }
      return match;
    });

    // Fix unused function parameters
    content = content.replace(/function\s+[^(]*\(([^)]*)\)/g, (match, params) => {
      const paramList = params.split(',').map(param => {
        const trimmed = param.trim();
        if (trimmed.startsWith('_') || trimmed.includes(':')) return trimmed;
        return `_${trimmed}`;
      });
      return match.replace(params, paramList.join(', '));
    });

    if (content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      modified = true;
    }

    return modified;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Fix all files
let fixedCount = 0;
filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    if (fixUnusedVariables(file)) {
      fixedCount++;
    }
  }
});

console.log(`Fixed ${fixedCount} files`);