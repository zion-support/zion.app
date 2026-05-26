#!/usr/bin/env node
/**
 * Blog Audit Tool v2
 * Audits all 54 blog posts for:
 * 1) Broken internal/external links
 * 2) Missing images
 * 3) Outdated content
 * 4) Missing metadata
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'app', 'blog');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const APP_DIR = path.join(__dirname, '..', 'app');
const OUTPUT_PATH = path.join(__dirname, 'data', 'blog-audit-report.json');

// Get all blog post directories
const blogSlugs = fs.readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

console.log(`Found ${blogSlugs.length} blog posts\n`);

// Pre-build a map of all existing page routes for fast lookup
const existingRoutes = new Set();
function walkDir(dir, prefix) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, path.join(prefix, entry.name));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      // Register the route (path relative to app dir)
      let route = prefix;
      if (route === '') route = '/';
      else route = '/' + route;
      existingRoutes.add(route);
      existingRoutes.add(route + '/'); // Also add with trailing slash
    }
  }
}
walkDir(APP_DIR, '');
// Also add the root
existingRoutes.add('/');
existingRoutes.add('/');
console.log(`Pre-built route map: ${existingRoutes.size} routes loaded`);

const report = {
  generated_at: new Date().toISOString(),
  total_posts: blogSlugs.length,
  posts: [],
  summary: {
    posts_with_broken_links: 0,
    posts_with_missing_images: 0,
    posts_with_outdated_content: 0,
    posts_with_missing_metadata: 0,
    total_issues: 0,
  },
  all_images: [],
  all_links: [],
};

blogSlugs.forEach(slug => {
  const pagePath = path.join(BLOG_DIR, slug, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    report.posts.push({ slug, error: 'page.tsx not found' });
    return;
  }

  const content = fs.readFileSync(pagePath, 'utf-8');
  
  const post = {
    slug,
    path: `/blog/${slug}`,
    metadata: { title: null, description: null },
    links: [],
    images: [],
    outdated_content: [],
    issues: [],
  };

  // Extract metadata
  post.metadata.title = extractMetadataField(content, 'title');
  post.metadata.description = extractMetadataField(content, 'description');

  if (!post.metadata.title) {
    post.issues.push('MISSING_TITLE');
  }
  if (!post.metadata.description) {
    post.issues.push('MISSING_DESCRIPTION');
  }

  // Extract ALL href links from Link components and <a> tags
  const linkPatterns = [
    /<Link[^>]*href=["']([^"']+)["'][^>]*>/g,
    /href=["']([^"']+)["'][^>]*>/g,
  ];
  
  const foundHrefs = new Set();
  for (const pattern of linkPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      foundHrefs.add(match[1]);
    }
  }

  for (const href of foundHrefs) {
    const issue = checkLink(href, slug);
    post.links.push({ href, issue });
    report.all_links.push({ slug, href, issue });
  }

  // Extract img src references (both <img> and <Image>)
  const imgPatterns = [
    /<img[^>]*src=["']([^"']+)["'][^>]*>/g,
    /<Image[^>]*src=["']([^"']+)["'][^>]*>/g,
  ];
  const foundSrcs = new Set();
  for (const pattern of imgPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      foundSrcs.add(match[1]);
    }
  }

  for (const src of foundSrcs) {
    const issue = checkImage(src);
    post.images.push({ src, issue });
    report.all_images.push({ slug, src, issue });
  }

  // Check for outdated content
  checkOutdatedContent(content, post);

  // Count issues
  const brokenLinks = post.links.filter(l => l.issue).length;
  const missingImages = post.images.filter(i => i.issue).length;
  const outdatedCount = post.outdated_content.length;
  const missingMeta = post.issues.filter(i => i === 'MISSING_TITLE' || i === 'MISSING_DESCRIPTION').length;

  if (brokenLinks > 0) report.summary.posts_with_broken_links++;
  if (missingImages > 0) report.summary.posts_with_missing_images++;
  if (outdatedCount > 0) report.summary.posts_with_outdated_content++;
  if (missingMeta > 0) report.summary.posts_with_missing_metadata++;

  post.summary = {
    broken_links: brokenLinks,
    missing_images: missingImages,
    outdated_content_items: outdatedCount,
    missing_metadata: missingMeta,
    total_issues: brokenLinks + missingImages + outdatedCount + missingMeta,
  };
  report.summary.total_issues += post.summary.total_issues;

  report.posts.push(post);

  const icon = post.summary.total_issues > 0 ? '!' : '✓';
  console.log(`  [${icon}] ${slug} - ${post.summary.total_issues} issues`);
  if (brokenLinks > 0) console.log(`         Broken links: ${brokenLinks}`);
  if (missingImages > 0) console.log(`         Missing images: ${missingImages}`);
  if (outdatedCount > 0) console.log(`         Outdated content: ${outdatedCount}`);
  if (missingMeta > 0) console.log(`         Missing metadata: ${missingMeta}`);
});

// Write report
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\nReport written to ${OUTPUT_PATH}`);
console.log(`\n======= FINAL SUMMARY =======`);
console.log(`Total posts analyzed: ${report.summary.total_posts}`);
console.log(`Posts with broken links: ${report.summary.posts_with_broken_links}`);
console.log(`Posts with missing images: ${report.summary.posts_with_missing_images}`);
console.log(`Posts with outdated content: ${report.summary.posts_with_outdated_content}`);
console.log(`Posts with missing metadata: ${report.summary.posts_with_missing_metadata}`);
console.log(`Total issues found: ${report.summary.total_issues}`);

// ---- Helper Functions ----

function extractMetadataField(content, field) {
  // Check standard metadata object
  const regex1 = new RegExp(`${field}\\s*:\\s*['"]([^'"]+)['"]`);
  const match1 = content.match(regex1);
  if (match1) return match1[1];

  // Check export const title/description = '...'
  const regex2 = new RegExp(`export\\s+const\\s+${field}\\s*=\\s*['"]([^'"]+)['"]`);
  const match2 = content.match(regex2);
  if (match2) return match2[1];

  return null;
}

function checkLink(href, slug) {
  // Skip anchors, mailto, tel, javascript, protocol-relative
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || 
      href.startsWith('javascript:') || href.startsWith('data:')) {
    return null;
  }

  // Check external links for obvious issues
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
    if (href.includes('localhost') || href.includes('127.0.0.1')) {
      return `LOCALHOST_REF: ${href}`;
    }
    if (href.includes('example.com') || href.includes('your-domain.com') || href.includes('yoursite.com')) {
      return `PLACEHOLDER_DOMAIN: ${href}`;
    }
    try {
      new URL(href.startsWith('//') ? 'https:' + href : href);
    } catch (e) {
      return `MALFORMED_URL: ${href}`;
    }
    return null; // External link - assume valid
  }

  // Check internal links
  if (href.startsWith('/')) {
    // Normalize: strip trailing slash for comparison, but check both ways
    const normalized = href.replace(/\/$/, '') || '/';
    
    // Check if route exists in our pre-built map
    if (!existingRoutes.has(normalized) && !existingRoutes.has(normalized + '/') && 
        !existingRoutes.has(href) && !existingRoutes.has(href.replace(/\/$/, ''))) {
      // Try file-based check for complex paths or parameterized routes
      const appRelPath = href.replace(/^\//, '').replace(/\/$/, '');
      const possiblePaths = [
        path.join(APP_DIR, appRelPath, 'page.tsx'),
        path.join(APP_DIR, appRelPath, 'page.ts'),
        path.join(APP_DIR, appRelPath + '.tsx'),
        path.join(APP_DIR, appRelPath + '.ts'),
      ];
      
      let found = false;
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          found = true;
          break;
        }
      }

      // Also check if it's a static file in public
      const publicPath = path.join(PUBLIC_DIR, appRelPath);
      if (fs.existsSync(publicPath)) found = true;

      if (!found) {
        return `BROKEN_INTERNAL: ${href}`;
      }
    }
  }

  return null; // No issue
}

function checkImage(src) {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('blob:')) {
    return null; // External or data URI - can't verify locally
  }

  let filePath;
  if (src.startsWith('/')) {
    filePath = path.join(PUBLIC_DIR, src.replace(/^\//, '').split('?')[0]);
  } else {
    filePath = path.join(PUBLIC_DIR, src.split('?')[0]);
  }

  if (!fs.existsSync(filePath)) {
    return `FILE_NOT_FOUND: ${src}`;
  }

  return null;
}

function checkOutdatedContent(content, post) {
  const currentYear = new Date().getFullYear();

  // Check for old years
  const yearRegex = /\b(20[0-2]\d)\b/g;
  let match;
  while ((match = yearRegex.exec(content)) !== null) {
    const year = parseInt(match[1]);
    if (year < 2024) {
      post.outdated_content.push({
        type: 'OLD_YEAR',
        value: year,
        context: extractContext(content, match.index),
      });
    } else if (year > currentYear + 5) {
      post.outdated_content.push({
        type: 'FUTURE_YEAR',
        value: year,
        context: extractContext(content, match.index),
      });
    }
  }

  // Check for stale temporal references
  const stalePatterns = [
    /by\s+2025/i, /in\s+2024/i, /as\s+of\s+2023/i,
    /by\s+the\s+end\s+of\s+2024/i, /by\s+the\s+end\s+of\s+2025/i,
    /expected\s+by\s+2025/i, /projected\s+by\s+2025/i,
    /through\s+2025/i, /by\s+2024/i, /since\s+2023/i,
    /as\s+of\s+2024/i,
  ];
  
  for (const pattern of stalePatterns) {
    const m = content.match(pattern);
    if (m) {
      post.outdated_content.push({
        type: 'STALE_REFERENCE',
        match: m[0],
        context: extractContext(content, m.index),
      });
    }
  }

  // Check for "coming soon" type language
  const soonPattern = /coming\s+soon|launching\s+soon/i;
  const soonMatch = content.match(soonPattern);
  if (soonMatch) {
    post.outdated_content.push({
      type: 'COMING_SOON',
      context: extractContext(content, soonMatch.index),
    });
  }
}

function extractContext(content, index, radius = 40) {
  const start = Math.max(0, index - radius);
  const end = Math.min(content.length, index + radius);
  return content.substring(start, end).replace(/\n/g, '\\n').trim();
}