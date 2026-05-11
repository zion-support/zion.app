const fs = require('fs');
const path = require('path');

// Files that were broken by the previous script
const brokenFiles = [
  '/workspace/app/components/AdvancedPerformanceEnhancer.tsx',
  '/workspace/app/components/EnhancedAccessibilityManager.tsx',
  '/workspace/app/components/PerformanceMonitor.tsx',
  '/workspace/app/components/PerformanceMonitoring.tsx',
  '/workspace/app/components/PerformanceOptimizer.tsx'
];

function fixBrokenFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove all the extra closing braces that were added after every line
    content = content.replace(/}\n/g, '\n');
    content = content.replace(/;\n}/g, ';\n');
    content = content.replace(/;\n}\n/g, ';\n');
    
    // Fix interface declarations
    content = content.replace(/interface\s+(\w+)\s*{\s*}\s*(\w+):/g, 'interface $1 {\n  $2:');
    content = content.replace(/interface\s+(\w+)\s*{\s*}\s*(\w+):/g, 'interface $1 {\n  $2:');
    
    // Fix function parameters
    content = content.replace(/\(\s*}\s*(\w+),/g, '($1,');
    content = content.replace(/\(\s*}\s*(\w+)\s*\)/g, '($1)');
    
    // Fix object properties
    content = content.replace(/{\s*}\s*(\w+):/g, '{\n  $1:');
    content = content.replace(/{\s*}\s*(\w+),/g, '{\n  $1,');
    
    // Fix array elements
    content = content.replace(/\[\s*}\s*(\w+),/g, '[$1,');
    content = content.replace(/\[\s*}\s*(\w+)\s*\]/g, '[$1]');
    
    // Fix JSX
    content = content.replace(/{\s*}\s*(\w+);/g, '{$1}');
    content = content.replace(/{\s*}\s*(\w+)\s*}/g, '{$1}');
    
    // Clean up extra braces
    content = content.replace(/\n}\n/g, '\n');
    content = content.replace(/}\n}/g, '}');
    content = content.replace(/;\n}/g, ';');
    
    // Fix specific patterns
    content = content.replace(/interface PerformanceMetrics {\s*}\s*lcp:/g, 'interface PerformanceMetrics {\n  lcp:');
    content = content.replace(/interface PerformanceMetrics {\s*}\s*fid:/g, 'interface PerformanceMetrics {\n  fid:');
    content = content.replace(/interface PerformanceMetrics {\s*}\s*cls:/g, 'interface PerformanceMetrics {\n  cls:');
    content = content.replace(/interface PerformanceMetrics {\s*}\s*fcp:/g, 'interface PerformanceMetrics {\n  fcp:');
    content = content.replace(/interface PerformanceMetrics {\s*}\s*ttfb:/g, 'interface PerformanceMetrics {\n  ttfb:');
    content = content.replace(/interface PerformanceMetrics {\s*}\s*memoryUsage:/g, 'interface PerformanceMetrics {\n  memoryUsage:');
    content = content.replace(/interface PerformanceMetrics {\s*}\s*connectionSpeed:/g, 'interface PerformanceMetrics {\n  connectionSpeed:');
    
    // Fix function declarations
    content = content.replace(/export const (\w+): React\.FC<(\w+)> = \(\s*}\s*(\w+),/g, 'export const $1: React.FC<$2> = ({\n  $3,');
    content = content.replace(/export const (\w+): React\.FC<(\w+)> = \(\s*}\s*(\w+)\s*\)/g, 'export const $1: React.FC<$2> = ({\n  $3\n})');
    
    // Fix object literals
    content = content.replace(/const \[(\w+), set(\w+)\] = useState<(\w+)>\(\s*{\s*}\s*(\w+):/g, 'const [$1, set$2] = useState<$3>({\n  $4:');
    content = content.replace(/const \[(\w+), set(\w+)\] = useState<(\w+)>\(\s*{\s*}\s*(\w+),/g, 'const [$1, set$2] = useState<$3>({\n  $4,');
    
    // Fix JSX elements
    content = content.replace(/{\s*}\s*(\w+);/g, '{$1}');
    content = content.replace(/{\s*}\s*(\w+)\s*}/g, '{$1}');
    
    // Clean up multiple consecutive braces
    content = content.replace(/\n}\n}\n/g, '\n}\n');
    content = content.replace(/\n}\n}\n}/g, '\n}\n');
    
    // Fix specific broken patterns
    content = content.replace(/}\s*;\s*}/g, '};');
    content = content.replace(/}\s*;\s*}\s*}/g, '};');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Fix all broken files
let fixedCount = 0;
brokenFiles.forEach(file => {
  if (fixBrokenFile(file)) {
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} out of ${brokenFiles.length} files`);