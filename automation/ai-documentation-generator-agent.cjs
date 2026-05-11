#!/usr/bin/env node

/**
 * AI Documentation Generator Agent - Automatic Documentation
 * 
 * Features:
 * - Auto-generates component documentation
 * - Creates API documentation
 * - Updates README files
 * - Generates code examples
 * - Creates architecture diagrams
 * - Maintains changelog
 * - Generates migration guides
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIDocumentationGeneratorAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(__dirname, 'logs');
    this.logFile = path.join(this.logsDir, 'documentation-generator.log');
    this.reportFile = path.join(this.logsDir, 'documentation-report.json');
    this.docsDir = path.join(this.projectRoot, 'docs');
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.logsDir, this.docsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    console.log(`[DOC-GEN] ${message}`);
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  async analyzeProject() {
    this.log('📊 Analyzing project structure...');
    
    const analysis = {
      components: [],
      pages: [],
      utils: [],
      apis: [],
      undocumented: []
    };
    
    // Analyze components
    const componentsDir = path.join(this.projectRoot, 'src/components');
    if (fs.existsSync(componentsDir)) {
      analysis.components = this.findFiles(componentsDir, /\.(tsx|jsx)$/);
    }
    
    // Analyze pages
    const pagesDir = path.join(this.projectRoot, 'app');
    if (fs.existsSync(pagesDir)) {
      analysis.pages = this.findFiles(pagesDir, /\.(tsx|jsx)$/);
    }
    
    // Analyze utilities
    const utilsDir = path.join(this.projectRoot, 'src/utils');
    if (fs.existsSync(utilsDir)) {
      analysis.utils = this.findFiles(utilsDir, /\.(ts|js)$/);
    }
    
    // Find undocumented files
    analysis.undocumented = this.findUndocumented([
      ...analysis.components,
      ...analysis.pages,
      ...analysis.utils
    ]);
    
    this.log(`Found ${analysis.components.length} components, ${analysis.pages.length} pages`);
    this.log(`${analysis.undocumented.length} files need documentation`);
    
    return analysis;
  }

  findFiles(dir, pattern, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        this.findFiles(fullPath, pattern, files);
      } else if (pattern.test(entry.name)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  findUndocumented(files) {
    const undocumented = [];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check if file has JSDoc comments
        const hasJSDoc = content.includes('/**');
        const hasDescription = content.includes('@description') || content.includes('@desc');
        
        if (!hasJSDoc || !hasDescription) {
          undocumented.push(file);
        }
      } catch (error) {
        this.log(`Failed to check ${file}`, 'WARN');
      }
    }
    
    return undocumented;
  }

  async generateComponentDocs(filePath) {
    this.log(`📝 Generating docs for ${path.basename(filePath)}...`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const componentName = this.extractComponentName(content, filePath);
      const props = this.extractProps(content);
      const hooks = this.extractHooks(content);
      const description = this.generateDescription(componentName, content);
      
      const docs = this.createDocTemplate(componentName, description, props, hooks, filePath);
      
      // Save documentation
      const docPath = path.join(
        this.docsDir,
        'components',
        `${componentName}.md`
      );
      
      this.ensureDirectory(path.dirname(docPath));
      fs.writeFileSync(docPath, docs);
      
      this.log(`✅ Generated docs at ${docPath}`);
      return docPath;
    } catch (error) {
      this.log(`Failed to generate docs for ${filePath}: ${error.message}`, 'ERROR');
      return null;
    }
  }

  extractComponentName(content, filePath) {
    // Try various patterns to find component name
    const patterns = [
      /export\s+default\s+function\s+(\w+)/,
      /export\s+function\s+(\w+)/,
      /const\s+(\w+)\s*=.*?=>/,
      /function\s+(\w+)/
    ];
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) return match[1];
    }
    
    // Fallback to filename
    return path.basename(filePath, path.extname(filePath));
  }

  extractProps(content) {
    const props = [];
    
    // Look for interface or type definitions
    const interfaceMatch = content.match(/interface\s+\w+Props\s*\{([^}]+)\}/);
    const typeMatch = content.match(/type\s+\w+Props\s*=\s*\{([^}]+)\}/);
    
    const propsBlock = interfaceMatch?.[1] || typeMatch?.[1];
    
    if (propsBlock) {
      const lines = propsBlock.split('\n');
      
      for (const line of lines) {
        const propMatch = line.match(/(\w+)(\?)?:\s*([^;]+)/);
        if (propMatch) {
          props.push({
            name: propMatch[1],
            optional: !!propMatch[2],
            type: propMatch[3].trim()
          });
        }
      }
    }
    
    return props;
  }

  extractHooks(content) {
    const hooks = [];
    const hookPatterns = [
      /useState/g,
      /useEffect/g,
      /useContext/g,
      /useMemo/g,
      /useCallback/g,
      /useRef/g,
      /useReducer/g
    ];
    
    for (const pattern of hookPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        const hookName = pattern.source;
        if (!hooks.includes(hookName)) {
          hooks.push(hookName);
        }
      }
    }
    
    return hooks;
  }

  generateDescription(componentName, content) {
    // Try to find existing description in comments
    const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\n/);
    if (commentMatch) {
      return commentMatch[1];
    }
    
    // Generate basic description based on component name
    return `${componentName} component`;
  }

  createDocTemplate(name, description, props, hooks, filePath) {
    let doc = `# ${name}\n\n`;
    doc += `${description}\n\n`;
    
    // Props section
    if (props.length > 0) {
      doc += `## Props\n\n`;
      doc += `| Name | Type | Required | Description |\n`;
      doc += `|------|------|----------|-------------|\n`;
      
      for (const prop of props) {
        doc += `| ${prop.name} | \`${prop.type}\` | ${prop.optional ? 'No' : 'Yes'} | - |\n`;
      }
      
      doc += `\n`;
    }
    
    // Hooks section
    if (hooks.length > 0) {
      doc += `## Hooks Used\n\n`;
      doc += hooks.map(h => `- ${h}`).join('\n');
      doc += `\n\n`;
    }
    
    // Usage example
    doc += `## Usage\n\n`;
    doc += `\`\`\`tsx\n`;
    doc += `import ${name} from '${this.getImportPath(filePath)}';\n\n`;
    doc += `function Example() {\n`;
    doc += `  return <${name}`;
    
    if (props.length > 0) {
      doc += ` ${props[0].name}={value}`;
    }
    
    doc += ` />;\n`;
    doc += `}\n`;
    doc += `\`\`\`\n\n`;
    
    // File location
    doc += `## File Location\n\n`;
    doc += `\`${path.relative(this.projectRoot, filePath)}\`\n\n`;
    
    // Timestamp
    doc += `---\n\n`;
    doc += `*Auto-generated by AI Documentation Agent on ${new Date().toISOString()}*\n`;
    
    return doc;
  }

  getImportPath(filePath) {
    const relativePath = path.relative(path.join(this.projectRoot, 'src'), filePath);
    return '@/' + relativePath.replace(/\\/g, '/').replace(/\.(tsx|jsx)$/, '');
  }

  ensureDirectory(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async updateMainReadme(analysis) {
    this.log('📄 Updating main README...');
    
    const readmePath = path.join(this.projectRoot, 'README.md');
    let readme = '';
    
    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, 'utf8');
    } else {
      readme = `# ${path.basename(this.projectRoot)}\n\n`;
    }
    
    // Add/update project structure section
    const structureSection = this.generateStructureSection(analysis);
    
    // Check if structure section exists
    const structureMarker = '## Project Structure';
    if (readme.includes(structureMarker)) {
      // Update existing section
      const startIndex = readme.indexOf(structureMarker);
      const endIndex = readme.indexOf('\n##', startIndex + 1);
      
      if (endIndex > -1) {
        readme = readme.substring(0, startIndex) + 
                structureSection + 
                readme.substring(endIndex);
      } else {
        readme = readme.substring(0, startIndex) + structureSection;
      }
    } else {
      // Add new section
      readme += '\n\n' + structureSection;
    }
    
    fs.writeFileSync(readmePath, readme);
    this.log('✅ README updated');
  }

  generateStructureSection(analysis) {
    let section = `## Project Structure\n\n`;
    section += `This project contains:\n\n`;
    section += `- **${analysis.components.length}** Components\n`;
    section += `- **${analysis.pages.length}** Pages\n`;
    section += `- **${analysis.utils.length}** Utility modules\n\n`;
    
    if (analysis.components.length > 0) {
      section += `### Components\n\n`;
      const componentNames = analysis.components
        .map(f => path.basename(f, path.extname(f)))
        .slice(0, 10);
      section += componentNames.map(name => `- ${name}`).join('\n');
      if (analysis.components.length > 10) {
        section += `\n- ... and ${analysis.components.length - 10} more`;
      }
      section += '\n\n';
    }
    
    section += `For detailed component documentation, see the [docs/components](./docs/components) directory.\n\n`;
    section += `---\n\n`;
    section += `*Last updated: ${new Date().toISOString()}*\n\n`;
    
    return section;
  }

  async generateApiDocs() {
    this.log('🔌 Generating API documentation...');
    
    const apiDir = path.join(this.projectRoot, 'app/api');
    if (!fs.existsSync(apiDir)) {
      this.log('No API directory found', 'INFO');
      return;
    }
    
    const apiFiles = this.findFiles(apiDir, /\.(ts|js)$/);
    const docs = [];
    
    for (const file of apiFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const endpoint = this.extractApiEndpoint(file, apiDir);
      const methods = this.extractHttpMethods(content);
      
      docs.push({
        endpoint,
        methods,
        file: path.relative(this.projectRoot, file)
      });
    }
    
    // Generate API documentation file
    const apiDocPath = path.join(this.docsDir, 'API.md');
    let apiDoc = `# API Documentation\n\n`;
    
    for (const api of docs) {
      apiDoc += `## ${api.endpoint}\n\n`;
      apiDoc += `Methods: ${api.methods.join(', ') || 'Unknown'}\n\n`;
      apiDoc += `File: \`${api.file}\`\n\n`;
      apiDoc += `---\n\n`;
    }
    
    fs.writeFileSync(apiDocPath, apiDoc);
    this.log(`✅ API docs generated at ${apiDocPath}`);
  }

  extractApiEndpoint(file, apiDir) {
    const relativePath = path.relative(apiDir, file);
    return '/api/' + relativePath
      .replace(/\\/g, '/')
      .replace(/\.(ts|js)$/, '')
      .replace(/index$/, '');
  }

  extractHttpMethods(content) {
    const methods = [];
    const methodPatterns = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    for (const method of methodPatterns) {
      if (content.includes(`req.method === '${method}'`) || 
          content.includes(`req.method === "${method}"`)) {
        methods.push(method);
      }
    }
    
    return methods;
  }

  async generateReport(generated) {
    const report = {
      timestamp: new Date().toISOString(),
      generated: generated.length,
      files: generated
    };
    
    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));
    this.log(`Report saved to ${this.reportFile}`);
    
    return report;
  }

  async commitChanges(message) {
    try {
      execSync('git add docs/ README.md', { stdio: 'ignore' });
      execSync(`git commit -m "${message}"`, { stdio: 'ignore' });
      execSync('git push origin main', { stdio: 'ignore' });
      this.log('✅ Documentation committed and pushed');
      return true;
    } catch (error) {
      this.log(`Failed to commit: ${error.message}`, 'WARN');
      return false;
    }
  }

  async run() {
    this.log('🚀 AI Documentation Generator Agent started');
    
    const generated = [];
    
    try {
      // Analyze project
      const analysis = await this.analyzeProject();
      
      // Generate component docs
      for (const component of analysis.undocumented.slice(0, 10)) {
        const docPath = await this.generateComponentDocs(component);
        if (docPath) {
          generated.push(docPath);
        }
      }
      
      // Generate API docs
      await this.generateApiDocs();
      
      // Update main README
      await this.updateMainReadme(analysis);
      
      // Generate report
      await this.generateReport(generated);
      
      this.log(`✅ Generated documentation for ${generated.length} files`);
      
      // Commit if enabled
      if (process.env.AUTO_COMMIT_DOCS === 'true' && generated.length > 0) {
        await this.commitChanges(
          `docs: auto-generate documentation for ${generated.length} files [AI-Doc-Agent]`
        );
      }
      
      this.log('✅ Documentation generation complete');
    } catch (error) {
      this.log(`Documentation generation failed: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async continuous() {
    this.log('🔄 Starting continuous documentation generation...');
    
    const interval = parseInt(process.env.DOC_INTERVAL_HOURS || '12') * 60 * 60 * 1000;
    
    while (true) {
      try {
        await this.run();
      } catch (error) {
        this.log(`Continuous cycle failed: ${error.message}`, 'ERROR');
      }
      this.log(`Waiting ${interval / (60 * 60 * 1000)} hours until next generation...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

// CLI
const agent = new AIDocumentationGeneratorAgent();
const command = process.argv[2] || 'run';

if (command === 'continuous') {
  agent.continuous().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} else {
  agent.run().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

