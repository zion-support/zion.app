import fs from 'fs';
import { glob } from 'glob';

// Function to fix remaining unused imports
function fixRemainingImports() {
  const filesToFix = [
    'app/ai-powered-devops/page.tsx',
    'app/ai-powered-email-analyzer/page.tsx',
    'app/ecommerce-analytics-pro/page.tsx',
    'app/error.tsx',
    'app/global-error.tsx',
    'app/loading.tsx',
    'app/it-services/cybersecurity-audit/page.tsx',
    'app/legal-document-manager/page.tsx',
    'app/medical-records-manager/page.tsx',
    'app/online-learning-platform/page.tsx',
    'app/property-management-ai/page.tsx',
    'app/supply-chain-optimizer/page.tsx',
    'app/test/page.tsx',
    'app/page-new.tsx',
    'app/page-optimized.tsx'
  ];

  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove the entire unused icon import line
      const iconImportRegex = /import \{ CheckCircle, ArrowRight, Star, Clock, Zap, Shield, Brain, BarChart, Target, TrendingUp, Globe, Database, Users, Settings, Check \} from 'lucide-react';\n/g;
      content = content.replace(iconImportRegex, '');
      
      // Also try other variations
      const iconImportRegex2 = /import \{ Star, Clock, Zap, Shield, Globe, Database, Users, Settings, Check \} from 'lucide-react';\n/g;
      content = content.replace(iconImportRegex2, '');
      
      // Clean up extra empty lines
      content = content.replace(/\n\n\n+/g, '\n\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Function to fix component files
function fixComponentFiles() {
  const filesToFix = [
    'app/components/Navigation.tsx'
  ];

  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove unused Search import
      content = content.replace(/, Search/g, '');
      
      // Clean up extra empty lines
      content = content.replace(/\n\n\n+/g, '\n\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed component: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Function to fix hook files
function fixHookFiles() {
  const filesToFix = [
    'app/hooks/useEnhancedPerformance.ts'
  ];

  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove unused destructured elements
      content = content.replace(/const \{ [^}]+ \} = useCallback\(\(\) => \{[\s\S]*?\}, \[\]\);\n/g, '');
      
      // Clean up extra empty lines
      content = content.replace(/\n\n\n+/g, '\n\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed hook: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Main function
async function main() {
  console.log('Fixing remaining icon imports...');
  fixRemainingImports();
  
  console.log('Fixing component files...');
  fixComponentFiles();
  
  console.log('Fixing hook files...');
  fixHookFiles();
  
  console.log('Done!');
}

main().catch(console.error);