const fs = require('fs');
const path = require('path');

// Files with syntax errors that need fixing
const filesToFix = [
  'app/components/AdvancedPerformanceEnhancer.tsx',
  'app/components/EnhancedAccessibilityManager.tsx',
  'app/components/LazyImage.tsx',
  'app/components/PWAInstaller.tsx',
  'app/components/PerformanceMonitor.tsx',
  'app/components/PerformanceMonitoring.tsx',
  'app/components/PerformanceOptimizations.tsx',
  'app/components/PerformanceOptimizer.tsx',
  'app/components/SEOOptimizer.tsx',
  'app/hooks/useEnhancedPerformance.ts',
  'app/hooks/useErrorMonitoring.ts',
  'app/not-found.tsx',
  'app/offline/page.tsx',
  'app/utils/monitoring.ts',
  'app/utils/performance.ts',
  'app/utils/performanceOptimizer.ts',
  'app/utils/performanceUtils.ts'
];

function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix malformed function declarations
    content = content.replace(/export default _function/g, 'export default function');
    content = content.replace(/export default _const/g, 'export default const');
    
    // Fix malformed arrow functions
    content = content.replace(/const _([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(([^)]*)\)\s*=>/g, (match, funcName, params) => {
      const paramList = params.split(',').map(param => {
        const trimmed = param.trim();
        if (trimmed.startsWith('_') || trimmed.includes(':')) return trimmed;
        return `_${trimmed}`;
      });
      return `const ${funcName} = (${paramList.join(', ')}) =>`;
    });

    // Fix malformed function parameters
    content = content.replace(/\(([^)]*)\)\s*=>/g, (match, params) => {
      const paramList = params.split(',').map(param => {
        const trimmed = param.trim();
        if (trimmed.startsWith('_') || trimmed.includes(':')) return trimmed;
        return `_${trimmed}`;
      });
      return `(${paramList.join(', ')}) =>`;
    });

    // Fix malformed object destructuring
    content = content.replace(/{\s*([^}]+)\s*}\s*:\s*{/g, (match, destructured) => {
      const destructuredList = destructured.split(',').map(item => {
        const trimmed = item.trim();
        if (trimmed.startsWith('_') || trimmed.includes(':')) return trimmed;
        return `_${trimmed}`;
      });
      return `{ ${destructuredList.join(', ')} }: {`;
    });

    // Fix malformed useCallback calls
    content = content.replace(/useCallback_\(/g, 'useCallback(');
    content = content.replace(/useCallback\(_/g, 'useCallback(');

    // Fix malformed function calls
    content = content.replace(/\(_([^)]*)\)/g, '($1)');

    // Fix malformed variable declarations
    content = content.replace(/const _([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, 'const $1 =');

    // Fix malformed imports
    content = content.replace(/import\s+{\s*_([^}]+)\s*}\s+from/g, 'import { $1 } from');

    // Fix malformed exports
    content = content.replace(/export\s+{\s*_([^}]+)\s*}/g, 'export { $1 }');

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
    if (fixSyntaxErrors(file)) {
      fixedCount++;
    }
  }
});

console.log(`Fixed ${fixedCount} files`);