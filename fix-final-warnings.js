import fs from 'fs';

// Function to fix unused props warnings
function fixUnusedProps() {
  const components = [
    'Analytics',
    'AnimatedCounter',
    'ContactForm',
    'ContentPreviewCard',
    'ContentPromotionBanner',
    'DynamicContentShowcase',
    'EnhancedErrorBoundary',
    'EnhancedLoading',
    'EnhancedLoadingStates',
    'EnhancedPerformanceOptimizer',
    'EnhancedSEOHead',
    'EnhancedSkipLink',
    'ErrorHandler',
    'FuturisticBackground',
    'LazyImage',
    'LoadingSpinner',
    'LoadingStates',
    'NeonButton',
    'OptimizedImage',
    'OptimizedLoadingSpinner',
    'PerformanceDashboard',
    'PerformanceOptimizations',
    'PerformanceOptimizer',
    'ResponsiveContainer',
    'SEOEnhancer',
    'SecurityEnhancer',
    'ServiceCard',
    'ServiceCardSkeleton',
    'Sidebar',
    'SkipLink'
  ];

  components.forEach(componentName => {
    const filePath = `app/components/${componentName}.tsx`;
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace unused props with underscore
      content = content.replace(/\(props\)/g, '(_props)');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed props in: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Function to fix Navigation Search import
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

// Function to fix page-new and page-optimized files
function fixPageFiles() {
  const filesToFix = ['app/page-new.tsx', 'app/page-optimized.tsx'];
  
  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix import paths
      content = content.replace('../components/Navigation', './components/Navigation');
      content = content.replace('../components/Footer', './components/Footer');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed imports in: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Main function
async function main() {
  console.log('Fixing unused props...');
  fixUnusedProps();
  
  console.log('Fixing Navigation Search import...');
  fixNavigationSearch();
  
  console.log('Fixing hook files...');
  fixHookFiles();
  
  console.log('Fixing page files...');
  fixPageFiles();
  
  console.log('Done!');
}

main().catch(console.error);