import fs from 'fs';

// Function to fix remaining files with different import paths
function fixRemainingFiles() {
  const filesToFix = [
    'app/error.tsx',
    'app/global-error.tsx',
    'app/loading.tsx',
    'app/it-services/cybersecurity-audit/page.tsx'
  ];

  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add imports after Footer import
      if (content.includes("import Footer from './components/Footer'") && !content.includes("import { CheckCircle")) {
        content = content.replace(
          "import Footer from './components/Footer'",
          "import Footer from './components/Footer'\nimport { CheckCircle, ArrowRight, Brain, BarChart, Target, TrendingUp } from 'lucide-react'"
        );
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Function to fix Navigation component Search import
function fixNavigationSearch() {
  try {
    let content = fs.readFileSync('app/components/Navigation.tsx', 'utf8');
    
    // Remove unused Search import
    content = content.replace(/, Search/g, '');
    
    fs.writeFileSync('app/components/Navigation.tsx', content);
    console.log('Fixed Navigation Search import');
  } catch (error) {
    console.error('Error fixing Navigation:', error.message);
  }
}

// Function to fix hook files
function fixHookFiles() {
  try {
    let content = fs.readFileSync('app/hooks/useEnhancedPerformance.ts', 'utf8');
    
    // Remove the entire unused destructured elements line
    content = content.replace(/const \{ [^}]+ \} = useCallback\(\(\) => \{[\s\S]*?\}, \[\]\);\n/g, '');
    
    fs.writeFileSync('app/hooks/useEnhancedPerformance.ts', content);
    console.log('Fixed hook file');
  } catch (error) {
    console.error('Error fixing hook file:', error.message);
  }
}

// Function to fix component files with unused type declarations
function fixComponentTypes() {
  const filesToFix = [
    'app/components/AccessibilityComponents.tsx',
    'app/components/AdvancedPerformanceMonitor.tsx',
    'app/components/AdvancedPerformanceOptimizer.tsx',
    'app/components/ContentNewsletterSignup.tsx',
    'app/components/ContentStatistics.tsx',
    'app/components/EnhancedSEO.tsx',
    'app/components/GlobalErrorBoundary.tsx',
    'app/components/Header.tsx',
    'app/components/SEOOptimizer.tsx'
  ];

  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove unused type declarations
      content = content.replace(/interface \w+Props \{[^}]*\}\n/g, '');
      content = content.replace(/type \w+Props = \{[^}]*\}\n/g, '');
      
      // Clean up extra empty lines
      content = content.replace(/\n\n\n+/g, '\n\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed types in: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Main function
async function main() {
  console.log('Fixing remaining files...');
  fixRemainingFiles();
  
  console.log('Fixing Navigation Search import...');
  fixNavigationSearch();
  
  console.log('Fixing hook files...');
  fixHookFiles();
  
  console.log('Fixing component types...');
  fixComponentTypes();
  
  console.log('Done!');
}

main().catch(console.error);