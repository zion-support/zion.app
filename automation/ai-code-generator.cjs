#!/usr/bin/env node

/**
 * AI Code Generator - Advanced AI-powered code generation and improvement
 * 
 * Uses Anthropic Claude or OpenAI GPT to:
 * - Generate new features
 * - Refactor code
 * - Write tests
 * - Fix bugs
 * - Improve documentation
 * - Optimize performance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

class AICodeGenerator {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(__dirname, 'logs');
    this.logFile = path.join(this.logsDir, 'ai-code-generator.log');
    this.outputDir = path.join(__dirname, 'generated');
    
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
    this.provider = process.env.OPENROUTER_API_KEY ? 'openrouter' : (process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'openai');
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.logsDir, this.outputDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, logEntry);
  }

  async callAI(prompt, maxTokens = 4096) {
    if (!this.apiKey) {
      throw new Error('API key not found. Set OPENROUTER_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY environment variable.');
    }

    this.log(`Calling ${this.provider} AI...`);

    if (this.provider === 'openrouter') {
      return await this.callOpenRouter(prompt, maxTokens);
    } else if (this.provider === 'anthropic') {
      return await this.callAnthropic(prompt, maxTokens);
    } else {
      return await this.callOpenAI(prompt, maxTokens);
    }
  }

  async callOpenRouter(prompt, maxTokens) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: 'You are an expert software developer. Provide high-quality, production-ready code.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      });

      const options = {
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://ziontechgroup.com',
          'X-Title': 'Zion Tech Group AI Code Generator',
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (response.error) {
              reject(new Error(typeof response.error === 'string' ? response.error : response.error.message));
            } else if (response.choices && response.choices[0]) {
              resolve(response.choices[0].message.content);
            } else {
              reject(new Error('Invalid response format'));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  async callAnthropic(prompt, maxTokens) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': data.length
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            
            if (response.error) {
              reject(new Error(response.error.message));
            } else if (response.content && response.content[0]) {
              resolve(response.content[0].text);
            } else {
              reject(new Error('Invalid response format'));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });
  }

  async callOpenAI(prompt, maxTokens) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert software developer. Provide high-quality, production-ready code.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      });

      const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Length': data.length
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            
            if (response.error) {
              reject(new Error(response.error.message));
            } else if (response.choices && response.choices[0]) {
              resolve(response.choices[0].message.content);
            } else {
              reject(new Error('Invalid response format'));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });
  }

  async analyzeFile(filePath) {
    this.log(`Analyzing file: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.projectRoot, filePath);
    
    const prompt = `Analyze this TypeScript/JavaScript file and suggest improvements:

File: ${relativePath}

\`\`\`typescript
${content}
\`\`\`

Please provide:
1. Code quality issues
2. Performance improvements
3. Best practices violations
4. Security concerns
5. Accessibility issues
6. Suggested refactoring

Format your response as JSON with this structure:
{
  "issues": [{"type": "...", "severity": "...", "description": "...", "line": ...}],
  "suggestions": [{"type": "...", "description": "...", "code": "..."}]
}`;

    try {
      const response = await this.callAI(prompt, 2048);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return { issues: [], suggestions: [] };
    } catch (error) {
      this.log(`Error analyzing file: ${error.message}`, 'ERROR');
      return { issues: [], suggestions: [] };
    }
  }

  async generateComponent(name, description, type = 'functional') {
    this.log(`Generating component: ${name}`);
    
    const prompt = `Generate a production-ready React TypeScript component with the following specifications:

Component Name: ${name}
Description: ${description}
Type: ${type}

Requirements:
1. Use TypeScript with proper types
2. Follow React best practices
3. Include prop types
4. Add JSDoc comments
5. Make it accessible (ARIA attributes)
6. Include error handling
7. Use modern React patterns (hooks)
8. Add proper exports

Please provide the complete component code, formatted and ready to use.`;

    try {
      const code = await this.callAI(prompt, 4096);
      
      // Extract code block
      const codeMatch = code.match(/\`\`\`(?:typescript|tsx)?\n([\s\S]*?)\n\`\`\`/);
      const componentCode = codeMatch ? codeMatch[1] : code;
      
      // Save component
      const fileName = `${name}.tsx`;
      const filePath = path.join(this.outputDir, fileName);
      fs.writeFileSync(filePath, componentCode);
      
      this.log(`Component saved to: ${filePath}`);
      return { filePath, code: componentCode };
    } catch (error) {
      this.log(`Error generating component: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async generateTests(sourceFile) {
    this.log(`Generating tests for: ${sourceFile}`);
    
    const content = fs.readFileSync(sourceFile, 'utf8');
    const fileName = path.basename(sourceFile, path.extname(sourceFile));
    
    const prompt = `Generate comprehensive Jest tests for this TypeScript/React file:

\`\`\`typescript
${content}
\`\`\`

Requirements:
1. Use Jest and React Testing Library
2. Test all major functionality
3. Include edge cases
4. Test accessibility
5. Mock external dependencies
6. Achieve high coverage
7. Follow testing best practices
8. Include descriptive test names

Provide complete test file code.`;

    try {
      const code = await this.callAI(prompt, 4096);
      
      // Extract code block
      const codeMatch = code.match(/\`\`\`(?:typescript|tsx)?\n([\s\S]*?)\n\`\`\`/);
      const testCode = codeMatch ? codeMatch[1] : code;
      
      // Save test file
      const testFileName = `${fileName}.test.tsx`;
      const testFilePath = path.join(this.outputDir, testFileName);
      fs.writeFileSync(testFilePath, testCode);
      
      this.log(`Test file saved to: ${testFilePath}`);
      return { filePath: testFilePath, code: testCode };
    } catch (error) {
      this.log(`Error generating tests: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async refactorCode(sourceFile, instructions) {
    this.log(`Refactoring: ${sourceFile}`);
    
    const content = fs.readFileSync(sourceFile, 'utf8');
    
    const prompt = `Refactor this code according to the following instructions:

Instructions: ${instructions}

Original Code:
\`\`\`typescript
${content}
\`\`\`

Requirements:
1. Maintain functionality
2. Improve code quality
3. Add type safety
4. Follow best practices
5. Preserve comments
6. Improve readability
7. Optimize performance

Provide the refactored code only, ready to replace the original file.`;

    try {
      const code = await this.callAI(prompt, 4096);
      
      // Extract code block
      const codeMatch = code.match(/\`\`\`(?:typescript|tsx)?\n([\s\S]*?)\n\`\`\`/);
      const refactoredCode = codeMatch ? codeMatch[1] : code;
      
      // Save refactored code
      const fileName = path.basename(sourceFile);
      const refactoredPath = path.join(this.outputDir, `${fileName}.refactored`);
      fs.writeFileSync(refactoredPath, refactoredCode);
      
      this.log(`Refactored code saved to: ${refactoredPath}`);
      return { filePath: refactoredPath, code: refactoredCode };
    } catch (error) {
      this.log(`Error refactoring code: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async fixBugs(sourceFile, bugDescription) {
    this.log(`Fixing bugs in: ${sourceFile}`);
    
    const content = fs.readFileSync(sourceFile, 'utf8');
    
    const prompt = `Fix the following bug in this code:

Bug Description: ${bugDescription}

Code:
\`\`\`typescript
${content}
\`\`\`

Requirements:
1. Fix the bug completely
2. Add proper error handling
3. Add comments explaining the fix
4. Ensure no new bugs are introduced
5. Maintain code style
6. Add defensive programming

Provide the fixed code only.`;

    try {
      const code = await this.callAI(prompt, 4096);
      
      // Extract code block
      const codeMatch = code.match(/\`\`\`(?:typescript|tsx)?\n([\s\S]*?)\n\`\`\`/);
      const fixedCode = codeMatch ? codeMatch[1] : code;
      
      // Save fixed code
      const fileName = path.basename(sourceFile);
      const fixedPath = path.join(this.outputDir, `${fileName}.fixed`);
      fs.writeFileSync(fixedPath, fixedCode);
      
      this.log(`Fixed code saved to: ${fixedPath}`);
      return { filePath: fixedPath, code: fixedCode };
    } catch (error) {
      this.log(`Error fixing bugs: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async generateDocumentation(sourceFile) {
    this.log(`Generating documentation for: ${sourceFile}`);
    
    const content = fs.readFileSync(sourceFile, 'utf8');
    const fileName = path.basename(sourceFile, path.extname(sourceFile));
    
    const prompt = `Generate comprehensive documentation for this code:

\`\`\`typescript
${content}
\`\`\`

Requirements:
1. Include overview
2. Document all functions/components
3. Provide usage examples
4. List props/parameters
5. Add return value descriptions
6. Include edge cases
7. Add troubleshooting section
8. Format as Markdown

Provide complete documentation.`;

    try {
      const docs = await this.callAI(prompt, 4096);
      
      // Save documentation
      const docsFileName = `${fileName}.md`;
      const docsPath = path.join(this.outputDir, docsFileName);
      fs.writeFileSync(docsPath, docs);
      
      this.log(`Documentation saved to: ${docsPath}`);
      return { filePath: docsPath, content: docs };
    } catch (error) {
      this.log(`Error generating documentation: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async suggestFeatures() {
    this.log('Generating feature suggestions...');
    
    // Analyze package.json to understand the project
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
    );
    
    const prompt = `Based on this Next.js project configuration, suggest 5 valuable new features to implement:

Project: ${packageJson.name}
Description: ${packageJson.description || 'Zion Tech Group - AI Automation Solutions'}
Dependencies: ${Object.keys(packageJson.dependencies).join(', ')}

Current features should include:
- AI automation services
- Business solutions
- Technology consulting

Suggest features that:
1. Add business value
2. Improve user experience
3. Are technically feasible
4. Align with AI/automation theme
5. Can be implemented incrementally

Format each suggestion as:
{
  "name": "...",
  "description": "...",
  "priority": "high|medium|low",
  "estimatedEffort": "...",
  "benefits": ["...", "..."],
  "technicalApproach": "..."
}

Provide 5 suggestions as a JSON array.`;

    try {
      const response = await this.callAI(prompt, 3000);
      
      // Extract JSON array
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        
        // Save suggestions
        const suggestionsPath = path.join(this.outputDir, 'feature-suggestions.json');
        fs.writeFileSync(suggestionsPath, JSON.stringify(suggestions, null, 2));
        
        this.log(`Feature suggestions saved to: ${suggestionsPath}`);
        return suggestions;
      }
      
      return [];
    } catch (error) {
      this.log(`Error generating feature suggestions: ${error.message}`, 'ERROR');
      return [];
    }
  }

  async optimizePerformance(sourceFile) {
    this.log(`Optimizing performance for: ${sourceFile}`);
    
    const content = fs.readFileSync(sourceFile, 'utf8');
    
    const prompt = `Optimize this code for performance:

\`\`\`typescript
${content}
\`\`\`

Apply these optimizations:
1. React.memo for components
2. useMemo/useCallback hooks
3. Lazy loading
4. Code splitting
5. Reduce re-renders
6. Optimize loops
7. Use efficient data structures
8. Remove unnecessary operations

Provide the optimized code with comments explaining optimizations.`;

    try {
      const code = await this.callAI(prompt, 4096);
      
      // Extract code block
      const codeMatch = code.match(/\`\`\`(?:typescript|tsx)?\n([\s\S]*?)\n\`\`\`/);
      const optimizedCode = codeMatch ? codeMatch[1] : code;
      
      // Save optimized code
      const fileName = path.basename(sourceFile);
      const optimizedPath = path.join(this.outputDir, `${fileName}.optimized`);
      fs.writeFileSync(optimizedPath, optimizedCode);
      
      this.log(`Optimized code saved to: ${optimizedPath}`);
      return { filePath: optimizedPath, code: optimizedCode };
    } catch (error) {
      this.log(`Error optimizing code: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async run(command, ...args) {
    this.log(`🤖 AI Code Generator - ${command}`);
    
    try {
      let result;
      
      switch (command) {
        case 'analyze':
          if (!args[0]) {
            throw new Error('File path required');
          }
          result = await this.analyzeFile(args[0]);
          console.log(JSON.stringify(result, null, 2));
          break;
          
        case 'component':
          if (!args[0] || !args[1]) {
            throw new Error('Component name and description required');
          }
          result = await this.generateComponent(args[0], args[1], args[2]);
          console.log(`Component generated: ${result.filePath}`);
          break;
          
        case 'tests':
          if (!args[0]) {
            throw new Error('Source file path required');
          }
          result = await this.generateTests(args[0]);
          console.log(`Tests generated: ${result.filePath}`);
          break;
          
        case 'refactor':
          if (!args[0] || !args[1]) {
            throw new Error('File path and instructions required');
          }
          result = await this.refactorCode(args[0], args[1]);
          console.log(`Refactored code saved: ${result.filePath}`);
          break;
          
        case 'fix':
          if (!args[0] || !args[1]) {
            throw new Error('File path and bug description required');
          }
          result = await this.fixBugs(args[0], args[1]);
          console.log(`Fixed code saved: ${result.filePath}`);
          break;
          
        case 'docs':
          if (!args[0]) {
            throw new Error('Source file path required');
          }
          result = await this.generateDocumentation(args[0]);
          console.log(`Documentation generated: ${result.filePath}`);
          break;
          
        case 'features':
          result = await this.suggestFeatures();
          console.log('Feature suggestions generated:');
          result.forEach((suggestion, i) => {
            console.log(`\n${i + 1}. ${suggestion.name} (${suggestion.priority})`);
            console.log(`   ${suggestion.description}`);
          });
          break;
          
        case 'optimize':
          if (!args[0]) {
            throw new Error('Source file path required');
          }
          result = await this.optimizePerformance(args[0]);
          console.log(`Optimized code saved: ${result.filePath}`);
          break;
          
        default:
          console.log('AI Code Generator - Advanced AI-powered code generation');
          console.log('\nCommands:');
          console.log('  analyze <file>              - Analyze code and suggest improvements');
          console.log('  component <name> <desc>     - Generate a new component');
          console.log('  tests <file>                - Generate tests for a file');
          console.log('  refactor <file> <inst>      - Refactor code with instructions');
          console.log('  fix <file> <bug>            - Fix bugs in code');
          console.log('  docs <file>                 - Generate documentation');
          console.log('  features                    - Suggest new features');
          console.log('  optimize <file>             - Optimize performance');
          console.log('\nEnvironment Variables:');
          console.log('  ANTHROPIC_API_KEY or OPENAI_API_KEY required');
      }
      
      this.log('✅ Command completed successfully');
      process.exit(0);
      
    } catch (error) {
      this.log(`❌ Error: ${error.message}`, 'ERROR');
      console.error(error);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const generator = new AICodeGenerator();
  const [,, command, ...args] = process.argv;
  generator.run(command, ...args);
}

module.exports = AICodeGenerator;

