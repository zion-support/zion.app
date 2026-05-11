#!/usr/bin/env node

/**
 * AI Content Optimization Automation System
 * Automatically optimizes content for SEO, readability, and engagement using AI
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIContentOptimizationAutomation {
  constructor() {
    this.contentDir = path.join(process.cwd(), 'app');
    this.componentsDir = path.join(process.cwd(), 'app', 'components');
    this.logFile = path.join(__dirname, 'logs', 'content-optimization.log');
    this.ensureLogDir();
    this.optimizationRules = this.loadOptimizationRules();
    this.seoKeywords = this.loadSEOKeywords();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, logEntry);
  }

  loadOptimizationRules() {
    return {
      seo: {
        titleLength: { min: 30, max: 60 },
        descriptionLength: { min: 120, max: 160 },
        headingStructure: ['h1', 'h2', 'h3', 'h4'],
        keywordDensity: { min: 0.5, max: 2.0 },
        imageAltText: true,
        internalLinks: { min: 2, max: 10 }
      },
      readability: {
        sentenceLength: { max: 20 },
        paragraphLength: { max: 150 },
        passiveVoice: { max: 10 },
        complexWords: { max: 15 }
      },
      engagement: {
        callToAction: true,
        bulletPoints: true,
        questions: true,
        emotionalWords: true
      }
    };
  }

  loadSEOKeywords() {
    return [
      'AI automation',
      'artificial intelligence',
      'machine learning',
      'business automation',
      'digital transformation',
      'Zion Tech Group',
      'AI solutions',
      'automation services',
      'intelligent systems',
      'AI consulting'
    ];
  }

  async optimizeContent(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const optimizedContent = await this.applyOptimizations(content, filePath);
      
      if (content !== optimizedContent) {
        fs.writeFileSync(filePath, optimizedContent);
        this.log(`Optimized content: ${filePath}`);
        return true;
      }
      
      return false;
    } catch (error) {
      this.log(`Error optimizing ${filePath}: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async applyOptimizations(content, filePath) {
    let optimized = content;

    // SEO Optimizations
    optimized = await this.optimizeSEO(optimized, filePath);
    
    // Readability Optimizations
    optimized = await this.optimizeReadability(optimized);
    
    // Engagement Optimizations
    optimized = await this.optimizeEngagement(optimized);
    
    // Meta Tags Optimization
    optimized = await this.optimizeMetaTags(optimized, filePath);

    return optimized;
  }

  async optimizeSEO(content, filePath) {
    let optimized = content;

    // Add missing alt attributes to images
    optimized = optimized.replace(
      /<img([^>]*?)(?:\s+alt\s*=\s*["'][^"']*["'])?([^>]*?)>/gi,
      (match, before, after) => {
        if (!match.includes('alt=')) {
          const srcMatch = match.match(/src\s*=\s*["']([^"']*)["']/);
          const altText = srcMatch ? this.generateAltText(srcMatch[1]) : 'Image';
          return `<img${before} alt="${altText}"${after}>`;
        }
        return match;
      }
    );

    // Optimize heading structure
    optimized = this.optimizeHeadingStructure(optimized);

    // Add internal links
    optimized = this.addInternalLinks(optimized, filePath);

    return optimized;
  }

  generateAltText(imagePath) {
    const filename = path.basename(imagePath, path.extname(imagePath));
    const keywords = filename.split(/[-_\s]+/).filter(word => word.length > 2);
    
    if (keywords.length > 0) {
      return keywords.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ') + ' - Zion Tech Group';
    }
    
    return 'Zion Tech Group Image';
  }

  optimizeHeadingStructure(content) {
    // Ensure proper heading hierarchy
    const headingRegex = /<(h[1-6])([^>]*)>(.*?)<\/h[1-6]>/gi;
    let headingLevel = 0;
    
    return content.replace(headingRegex, (match, tag, attributes, text) => {
      const currentLevel = parseInt(tag.charAt(1));
      
      if (currentLevel > headingLevel + 1) {
        headingLevel = currentLevel - 1;
        return `<h${headingLevel}${attributes}>${text}</h${headingLevel}>`;
      }
      
      headingLevel = currentLevel;
      return match;
    });
  }

  addInternalLinks(content, filePath) {
    // Add internal links to relevant pages
    const internalLinks = [
      { text: 'AI Services', url: '/services/ai-services' },
      { text: 'Automation Solutions', url: '/services/automation' },
      { text: 'Contact Us', url: '/contact' },
      { text: 'About Zion Tech Group', url: '/about' }
    ];

    let optimized = content;
    let linkCount = 0;

    internalLinks.forEach(link => {
      if (linkCount < 3 && !optimized.includes(link.url)) {
        const linkRegex = new RegExp(`\\b${link.text}\\b`, 'gi');
        optimized = optimized.replace(linkRegex, (match) => {
          if (linkCount < 3) {
            linkCount++;
            return `<a href="${link.url}" class="internal-link">${match}</a>`;
          }
          return match;
        });
      }
    });

    return optimized;
  }

  async optimizeReadability(content) {
    let optimized = content;

    // Break long sentences
    optimized = this.breakLongSentences(optimized);
    
    // Break long paragraphs
    optimized = this.breakLongParagraphs(optimized);
    
    // Add bullet points where appropriate
    optimized = this.addBulletPoints(optimized);

    return optimized;
  }

  breakLongSentences(content) {
    return content.replace(/[.!?]\s+([A-Z][^.!?]{50,}[.!?])/g, (match, sentence) => {
      if (sentence.length > 100) {
        const words = sentence.split(' ');
        const midPoint = Math.floor(words.length / 2);
        const firstHalf = words.slice(0, midPoint).join(' ');
        const secondHalf = words.slice(midPoint).join(' ');
        return `. ${firstHalf}. ${secondHalf}`;
      }
      return match;
    });
  }

  breakLongParagraphs(content) {
    return content.replace(/<p>([^<]{200,})<\/p>/g, (match, text) => {
      if (text.length > 200) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const midPoint = Math.floor(sentences.length / 2);
        const firstHalf = sentences.slice(0, midPoint).join('. ') + '.';
        const secondHalf = sentences.slice(midPoint).join('. ') + '.';
        return `<p>${firstHalf}</p><p>${secondHalf}</p>`;
      }
      return match;
    });
  }

  addBulletPoints(content) {
    // Convert lists to proper bullet points
    return content.replace(/(\d+\.\s+[^\n]+(?:\n\d+\.\s+[^\n]+)*)/g, (match) => {
      const items = match.split(/\n\d+\.\s+/).map(item => item.trim()).filter(item => item);
      return '<ul>' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';
    });
  }

  async optimizeEngagement(content) {
    let optimized = content;

    // Add call-to-action buttons
    optimized = this.addCallToAction(optimized);
    
    // Add engaging questions
    optimized = this.addEngagingQuestions(optimized);
    
    // Add emotional words
    optimized = this.addEmotionalWords(optimized);

    return optimized;
  }

  addCallToAction(content) {
    const ctaPatterns = [
      'Learn more',
      'Get started',
      'Contact us',
      'Discover',
      'Explore'
    ];

    let optimized = content;
    
    ctaPatterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      optimized = optimized.replace(regex, (match) => {
        return `<strong class="cta-highlight">${match}</strong>`;
      });
    });

    return optimized;
  }

  addEngagingQuestions(content) {
    // Add questions to increase engagement
    const questions = [
      'Ready to transform your business?',
      'Want to learn more about AI automation?',
      'Curious about our solutions?',
      'Need help getting started?'
    ];

    let optimized = content;
    
    // Add a question at the end of long content sections
    if (content.length > 500 && !content.includes('?')) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      optimized += `<p class="engagement-question">${randomQuestion}</p>`;
    }

    return optimized;
  }

  addEmotionalWords(content) {
    const emotionalWords = {
      'good': 'excellent',
      'bad': 'challenging',
      'big': 'significant',
      'small': 'focused',
      'fast': 'lightning-fast',
      'slow': 'methodical',
      'easy': 'effortless',
      'hard': 'sophisticated'
    };

    let optimized = content;
    
    Object.entries(emotionalWords).forEach(([weak, strong]) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      optimized = optimized.replace(regex, strong);
    });

    return optimized;
  }

  async optimizeMetaTags(content, filePath) {
    let optimized = content;

    // Extract page title and generate meta description
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

    if (titleMatch && !descriptionMatch) {
      const title = titleMatch[1];
      const description = this.generateMetaDescription(title, content);
      
      // Add meta description after title
      optimized = optimized.replace(
        /(<title[^>]*>.*?<\/title>)/i,
        `$1\n  <meta name="description" content="${description}">`
      );
    }

    // Add Open Graph tags
    optimized = this.addOpenGraphTags(optimized, filePath);

    return optimized;
  }

  generateMetaDescription(title, content) {
    // Extract first meaningful paragraph
    const paragraphMatch = content.match(/<p[^>]*>([^<]{100,200})<\/p>/i);
    if (paragraphMatch) {
      let description = paragraphMatch[1]
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      if (description.length > 160) {
        description = description.substring(0, 157) + '...';
      }
      
      return description;
    }
    
    // Fallback to title-based description
    return `${title} - Zion Tech Group provides cutting-edge AI automation solutions to transform your business.`;
  }

  addOpenGraphTags(content, filePath) {
    if (!content.includes('og:title')) {
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : 'Zion Tech Group';
      
      const ogTags = `
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="Transform your business with AI-powered automation solutions from Zion Tech Group.">
  <meta property="og:image" content="https://ziontechgroup.com/og-image.jpg">
  <meta property="og:url" content="https://ziontechgroup.com${filePath.replace(/.*\/pages/, '').replace(/\.(tsx?|jsx?)$/, '')}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="Transform your business with AI-powered automation solutions from Zion Tech Group.">
  <meta name="twitter:image" content="https://ziontechgroup.com/og-image.jpg">`;
      
      // Add after existing meta tags
      const metaEnd = content.lastIndexOf('</head>');
      if (metaEnd !== -1) {
        content = content.slice(0, metaEnd) + ogTags + '\n' + content.slice(metaEnd);
      }
    }
    
    return content;
  }

  async scanAndOptimize() {
    this.log('Starting AI Content Optimization Scan');
    
    const files = this.getAllContentFiles();
    let optimizedCount = 0;
    
    for (const file of files) {
      try {
        const wasOptimized = await this.optimizeContent(file);
        if (wasOptimized) {
          optimizedCount++;
        }
      } catch (error) {
        this.log(`Error processing ${file}: ${error.message}`, 'ERROR');
      }
    }
    
    this.log(`Content optimization complete. ${optimizedCount} files optimized.`);
    return optimizedCount;
  }

  getAllContentFiles() {
    const files = [];
    
    // Scan pages directory
    if (fs.existsSync(this.contentDir)) {
      this.scanDirectory(this.contentDir, files);
    }
    
    // Scan components directory
    if (fs.existsSync(this.componentsDir)) {
      this.scanDirectory(this.componentsDir, files);
    }
    
    return files.filter(file => 
      file.endsWith('.tsx') || 
      file.endsWith('.jsx') || 
      file.endsWith('.ts') || 
      file.endsWith('.js')
    );
  }

  scanDirectory(dir, files) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.scanDirectory(fullPath, files);
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    });
  }

  async startAutomation() {
    this.log('Starting AI Content Optimization Automation');
    
    // Run optimization every 6 hours
    setInterval(async () => {
      await this.scanAndOptimize();
    }, 6 * 60 * 60 * 1000);
    
    // Initial optimization
    await this.scanAndOptimize();
  }
}

// CLI interface
if (require.main === module) {
  const automation = new AIContentOptimizationAutomation();
  const command = process.argv[2];

  switch (command) {
    case 'start':
      automation.startAutomation();
      break;
    case 'scan':
      automation.scanAndOptimize();
      break;
    case 'optimize':
      const filePath = process.argv[3];
      if (filePath) {
        automation.optimizeContent(filePath);
      } else {
        console.log('Usage: node ai-content-optimization-automation.js optimize <file-path>');
      }
      break;
    default:
      console.log('Available commands:');
      console.log('  start - Start the automation system');
      console.log('  scan - Run one-time content optimization scan');
      console.log('  optimize <file-path> - Optimize specific file');
  }
}

module.exports = AIContentOptimizationAutomation;
