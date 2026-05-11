#!/usr/bin/env node
/**
 * AI Announcement Detector
 * Detects new announcements, promotions, or time-sensitive content on the site.
 */
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Running Announcement Detection Scan...');

try {
  // In a real implementation, this would:
  // 1. Crawl the site for announcement banners, promo bars, etc.
  // 2. Check for time-sensitive content
  // 3. Compare with previous scans to detect new/removed announcements
  // 4. Alert on stale promotions that should be removed
  
  // For now, we'll simulate by checking for known announcement patterns in built files
  const publicDir = './out'; // Next.js export directory
  
  if (!fs.existsSync(publicDir)) {
    console.log('⚠️  No build output found. Run next build first.');
    // Try to build
    execSync('npm run build', { stdio: 'ignore' });
  }
  
  if (fs.existsSync(publicDir)) {
    // Look for HTML files that might contain announcements
    const htmlFiles = execSync(`find ${publicDir} -name "*.html" -type f`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(f => f.length > 0);
    
    let announcementCount = 0;
    const announcementPatterns = [
      /promo|banner|announcement|offer|sale|discount|limited/i,
      /class=".*(promo|banner|announcement).*"/i,
      /id=".*(promo|banner|announcement).*"/i
    ];
    
    htmlFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        announcementPatterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches && matches.length > 0) {
            announcementCount += matches.length;
          }
        });
      } catch (e) {
        // Ignore file read errors
      }
    });
    
    console.log(`📊 Found ${announcementCount} potential announcement elements`);
    
    // If we find many announcement elements, it might indicate active promotions
    // In a real system, we'd track these over time to detect stale ones
    if (announcementCount > 10) {
      console.log('⚠️  High number of announcement elements detected - possible stale promotions');
      // In a full implementation, we'd create an issue here
    }
  }
  
  console.log('✅ Announcement detection scan complete');
  
} catch (err) {
  console.error('Announcement detection failed:', err.message);
  // Don't exit with error for monitoring scripts - just log
}
