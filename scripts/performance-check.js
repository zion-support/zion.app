#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
// import { fileURLToPath } from 'url';

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

console.log('🚀 Starting comprehensive performance analysis...\n');

// Function to run command and return output
function runCommand(command, description) {
  console.log(`📊 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return null;
  }
}

// Function to analyze bundle size
function analyzeBundleSize() {
  console.log('\n📦 Analyzing bundle size...');
  
  const buildDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Please run "npm run build" first.');
    return;
  }

  // Check static files
  const staticDir = path.join(buildDir, 'static');
  if (fs.existsSync(staticDir)) {
    const staticFiles = fs.readdirSync(staticDir, { recursive: true });
    let totalSize = 0;
    
    staticFiles.forEach(file => {
      if (typeof file === 'string') {
        const filePath = path.join(staticDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
        }
      }
    });
    
    console.log(`📁 Static files size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }

  // Check pages
  const pagesDir = path.join(buildDir, 'server', 'pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir, { recursive: true });
    console.log(`📄 Total pages generated: ${pageFiles.length}`);
  }
}

// Function to check dependencies
function checkDependencies() {
  console.log('\n🔍 Checking dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  
  console.log(`📦 Production dependencies: ${dependencies.length}`);
  console.log(`🛠️  Development dependencies: ${devDependencies.length}`);
  
  // Check for potential issues
  const largeDeps = ['@storybook', 'webpack', 'babel'];
  const foundLargeDeps = dependencies.filter(dep => 
    largeDeps.some(largeDep => dep.includes(largeDep))
  );
  
  if (foundLargeDeps.length > 0) {
    console.log(`⚠️  Large dependencies found: ${foundLargeDeps.join(', ')}`);
  }
}

// Function to check TypeScript configuration
function checkTypeScript() {
  console.log('\n🔧 Checking TypeScript configuration...');
  
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    console.log('✅ TypeScript configuration found');
    
    if (tsconfig.compilerOptions?.strict) {
      console.log('✅ Strict mode enabled');
    }
    
    if (tsconfig.compilerOptions?.noUnusedLocals) {
      console.log('✅ Unused locals checking enabled');
    }
  } else {
    console.log('❌ TypeScript configuration not found');
  }
}

// Function to check Next.js configuration
function checkNextConfig() {
  console.log('\n⚙️  Checking Next.js configuration...');
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    console.log('✅ Next.js configuration found');
    
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (config.includes('swcMinify')) {
      console.log('✅ SWC minification enabled');
    }
    
    if (config.includes('compress')) {
      console.log('✅ Compression enabled');
    }
    
    if (config.includes('optimizePackageImports')) {
      console.log('✅ Package imports optimization enabled');
    }
  } else {
    console.log('❌ Next.js configuration not found');
  }
}

// Function to check ESLint configuration
function checkESLint() {
  console.log('\n🔍 Checking ESLint configuration...');
  
  const eslintConfigPath = path.join(process.cwd(), 'eslint.config.js');
  if (fs.existsSync(eslintConfigPath)) {
    console.log('✅ ESLint configuration found');
  } else {
    console.log('❌ ESLint configuration not found');
  }
}

// Function to generate performance report
function generateReport() {
  console.log('\n📋 Generating performance report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    bundleSize: 'See build output above',
    dependencies: 'See dependency check above',
    configurations: {
      typescript: fs.existsSync('tsconfig.json'),
      nextjs: fs.existsSync('next.config.js'),
      eslint: fs.existsSync('eslint.config.js'),
    },
    recommendations: [
      'Consider using dynamic imports for large components',
      'Optimize images with next/image',
      'Use React.memo for expensive components',
      'Implement code splitting for better performance',
      'Consider using a CDN for static assets',
    ]
  };
  
  const reportPath = path.join(process.cwd(), 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Performance report saved to: ${reportPath}`);
}

// Main execution
async function main() {
  try {
    // Run type checking
    runCommand('npm run type-check', 'Type checking');
    
    // Run linting
    runCommand('npm run lint', 'Linting');
    
    // Check configurations
    checkTypeScript();
    checkNextConfig();
    checkESLint();
    
    // Check dependencies
    checkDependencies();
    
    // Analyze bundle size
    analyzeBundleSize();
    
    // Generate report
    generateReport();
    
    console.log('\n🎉 Performance analysis completed!');
    console.log('\n💡 Recommendations:');
    console.log('   • Use dynamic imports for code splitting');
    console.log('   • Optimize images with next/image');
    console.log('   • Implement React.memo for expensive components');
    console.log('   • Consider using a CDN for static assets');
    console.log('   • Monitor Core Web Vitals in production');
    
  } catch (error) {
    console.error('❌ Performance analysis failed:', error.message);
    process.exit(1);
  }
}

main();