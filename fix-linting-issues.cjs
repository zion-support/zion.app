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

function fixUnusedVariables(content) {
  // Remove unused variable assignments
  content = content.replace(/const\s+_\w+\s*=\s*[^;]+;/g, '');
  content = content.replace(/let\s+_\w+\s*=\s*[^;]+;/g, '');
  content = content.replace(/var\s+_\w+\s*=\s*[^;]+;/g, '');
  
  // Remove unused destructured variables
  content = content.replace(/const\s*{\s*_\w+\s*}\s*=\s*[^;]+;/g, '');
  content = content.replace(/let\s*{\s*_\w+\s*}\s*=\s*[^;]+;/g, '');
  content = content.replace(/var\s*{\s*_\w+\s*}\s*=\s*[^;]+;/g, '');
  
  // Remove unused function parameters
  content = content.replace(/\(\s*_\w+\s*\)/g, '()');
  content = content.replace(/\(\s*_\w+\s*,\s*_\w+\s*\)/g, '()');
  content = content.replace(/\(\s*_\w+\s*,\s*[^_][^)]*\)/g, (match) => {
    return match.replace(/,\s*_\w+\s*/g, '');
  });
  
  // Remove unused imports
  content = content.replace(/import\s*{\s*_\w+\s*}\s*from\s*[^;]+;/g, '');
  content = content.replace(/import\s*{\s*[^}]*,\s*_\w+\s*[^}]*}\s*from\s*[^;]+;/g, (match) => {
    return match.replace(/,\s*_\w+\s*/g, '');
  });
  
  // Remove unused variable declarations in function parameters
  content = content.replace(/function\s+\w+\s*\(\s*_\w+\s*\)/g, (match) => {
    return match.replace(/\(\s*_\w+\s*\)/, '()');
  });
  
  return content;
}

function fixAnyTypes(content) {
  // Replace any with unknown where appropriate
  content = content.replace(/:\s*any\b/g, ': unknown');
  return content;
}

function fixUnusedImports(content) {
  // Remove unused imports
  const lines = content.split('\n');
  const usedImports = new Set();
  
  // Find all used identifiers
  lines.forEach(line => {
    const matches = line.match(/\b[A-Z][a-zA-Z0-9]*\b/g);
    if (matches) {
      matches.forEach(match => usedImports.add(match));
    }
  });
  
  // Filter out unused imports
  const filteredLines = lines.filter(line => {
    if (line.trim().startsWith('import ')) {
      const importMatch = line.match(/import\s*{\s*([^}]+)\s*}\s*from/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(imp => imp.trim());
        const usedImportsInLine = imports.filter(imp => usedImports.has(imp));
        if (usedImportsInLine.length === 0) {
          return false; // Remove entire import line
        } else if (usedImportsInLine.length < imports.length) {
          // Replace with only used imports
          const newLine = line.replace(/{\s*[^}]+\s*}/, `{ ${usedImportsInLine.join(', ')} }`);
          return newLine;
        }
      }
    }
    return true;
  });
  
  return filteredLines.join('\n');
}

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply fixes
    content = fixUnusedVariables(content);
    content = fixAnyTypes(content);
    content = fixUnusedImports(content);
    
    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    } else {
      console.log(`No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all files
console.log('Fixing linting issues...');
filesToFix.forEach(processFile);
console.log('Done!');