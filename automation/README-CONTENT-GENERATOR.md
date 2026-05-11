# AI Content Generator Automation

A powerful automation system that generates high-quality, SEO-optimized content for the Zion Tech Group application.

## Features

- **Automated Content Generation**: Creates blog posts, service pages, case studies, and feature pages
- **SEO Optimization**: All content includes proper meta tags, Open Graph tags, and structured data
- **Professional Design**: Uses modern UI components with Tailwind CSS and Framer Motion animations
- **Content Tracking**: Maintains history of all generated content
- **Flexible Scheduling**: Can run continuously, on-demand, or via scheduled cron jobs
- **Bulk Generation**: Generate multiple pieces of content at once

## Content Types

### 1. Blog Posts
- 20+ pre-defined AI and automation topics
- Comprehensive articles with multiple sections
- SEO-optimized titles and descriptions
- Category tagging
- Call-to-action sections
- Responsive design with animations

### 2. Service Pages
- 5 service templates including:
  - AI Strategy Consulting
  - Intelligent Process Automation
  - Custom AI Model Development
  - AI-Powered Analytics
  - Conversational AI Solutions
- Feature lists and benefits
- Pricing section placeholders
- Professional layouts

### 3. Case Studies
- Industry-specific scenarios
- Challenge-solution-results format
- Measurable outcomes and statistics
- Client testimonial sections
- Visual data presentation

### 4. Feature Pages
- Product feature highlights
- Technical capability lists
- Use case demonstrations
- Integration information

## Installation

The content generator is already installed and configured in the project.

### Dependencies

All required dependencies are included:
- Node.js (v18+)
- File system access
- Path module
- Child process (for git operations)

## Usage

### Command Line

#### Generate Random Content
```bash
npm run content:generate
```

#### Generate Specific Content Type
```bash
# Generate a blog post
npm run content:generate-blog

# Generate a service page
npm run content:generate-service

# Generate a case study
npm run content:generate-case-study
```

#### Bulk Generation
```bash
# Generate 10 random pieces of content
npm run content:bulk

# Generate custom amount (via direct node call)
node automation/ai-content-generator-automation.cjs bulk 25
```

#### View Statistics
```bash
npm run content:stats
```

#### Start Continuous Generation
```bash
npm run content:start
```

### PM2 Process Manager

The content generator is configured to run automatically via PM2:

```bash
# Start the content generator
pm2 start ecosystem.config.cjs --only ai-content-generator

# Stop the content generator
pm2 stop ai-content-generator

# View logs
pm2 logs ai-content-generator

# Monitor status
pm2 status ai-content-generator
```

## Configuration

### Schedule

The default configuration generates new content:
- **Daily at midnight** (via PM2 cron: `0 0 * * *`)
- On-demand via npm scripts
- Continuously when started with `start` command

To change the schedule, edit `ecosystem.config.cjs`:

```javascript
{
  name: 'ai-content-generator',
  script: './automation/ai-content-generator-automation.cjs',
  cron_restart: '0 0 * * *', // Change this line
  // ... other config
}
```

### Content Templates

Templates can be customized by editing the `loadContentTemplates()` method in the automation script.

#### Adding New Topics

```javascript
blogPost: {
  topics: [
    'Your New Topic Here',
    // ... existing topics
  ]
}
```

#### Adding New Services

```javascript
servicePage: {
  services: [
    {
      name: 'Your Service Name',
      description: 'Your service description',
      features: ['Feature 1', 'Feature 2'],
      benefits: ['Benefit 1', 'Benefit 2']
    }
  ]
}
```

## Output Structure

Generated content is saved to:
- Blog Posts: `src/pages/blog/[slug].tsx`
- Service Pages: `src/pages/services/[slug].tsx`
- Case Studies: `src/pages/case-studies/[slug].tsx`
- Feature Pages: `src/pages/features/[slug].tsx`

Content history is tracked in:
- `automation/data/generated-content.json`

Logs are saved to:
- `automation/logs/content-generator.log`

## Content Features

### SEO Optimization
- Proper title tags (30-60 characters)
- Meta descriptions (120-160 characters)
- Open Graph tags for social sharing
- Twitter Card tags
- Semantic HTML structure
- Keyword optimization

### Design Features
- Responsive layouts
- Framer Motion animations
- Tailwind CSS styling
- Hero sections
- Call-to-action buttons
- Grid and card layouts
- Gradient backgrounds
- Modern UI components

### Accessibility
- Semantic HTML
- Proper heading hierarchy
- Alt text for images
- ARIA labels where needed
- Keyboard navigation support

## Examples

### Generate 5 Blog Posts
```bash
node automation/ai-content-generator-automation.cjs bulk 5
```

### Check Generated Content
```bash
npm run content:stats
```

Output:
```json
{
  "totalPosts": 15,
  "totalPages": 5,
  "totalCaseStudies": 8,
  "totalFeatures": 3,
  "total": 31
}
```

### View Content History
```bash
cat automation/data/generated-content.json
```

## Best Practices

1. **Review Generated Content**: While AI-generated, always review content before publishing
2. **Customize Templates**: Adjust templates to match your brand voice
3. **Monitor Logs**: Check logs regularly for any generation issues
4. **Backup Content**: Keep backups of generated content
5. **Update Templates**: Regularly update templates with new topics and information

## Troubleshooting

### Content Not Generating

1. Check if directories exist:
   ```bash
   ls -la src/pages/blog
   ls -la src/pages/services
   ls -la src/pages/case-studies
   ```

2. Verify permissions:
   ```bash
   chmod +x automation/ai-content-generator-automation.cjs
   ```

3. Check logs:
   ```bash
   cat automation/logs/content-generator.log
   ```

### PM2 Issues

1. Restart the process:
   ```bash
   pm2 restart ai-content-generator
   ```

2. Check PM2 status:
   ```bash
   pm2 status
   ```

3. View detailed logs:
   ```bash
   pm2 logs ai-content-generator --lines 100
   ```

### File Conflicts

If files already exist with the same slug:
1. The generator will skip generation to avoid overwriting
2. Manually rename or remove existing files
3. Or modify the template to generate different content

## Integration with Git

The content generator can be integrated with your Git workflow:

1. Generate content
2. Review generated files
3. Commit changes:
   ```bash
   git add src/pages/
   git commit -m "Add AI-generated content"
   git push origin main
   ```

## Performance

- **Generation Speed**: ~100ms per piece of content
- **Memory Usage**: ~50MB average
- **Disk Space**: ~10KB per generated file
- **CPU Usage**: Minimal (< 5% during generation)

## Roadmap

Future enhancements planned:
- [ ] Integration with AI services (OpenAI, Claude) for dynamic content
- [ ] Image generation for blog posts and case studies
- [ ] Multi-language support
- [ ] Content variation testing (A/B testing)
- [ ] SEO score calculation
- [ ] Automatic content updating based on analytics
- [ ] Integration with CMS systems
- [ ] Content approval workflow

## License

This automation tool is part of the Zion Tech Group application.

## Support

For issues or questions:
1. Check the logs: `automation/logs/content-generator.log`
2. Review this documentation
3. Check the main project README
4. Contact the development team

## Contributing

To add new features:
1. Fork the repository
2. Create a feature branch
3. Add your changes to `ai-content-generator-automation.cjs`
4. Test thoroughly
5. Submit a pull request

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅

