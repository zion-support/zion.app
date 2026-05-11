import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common icons that are used but might be missing
const commonIcons = [
  'ArrowRight', 'Github', 'Target', 'CheckCircle', 'Users', 'BarChart', 
  'TrendingUp', 'Brain', 'Lock', 'Shield', 'Zap', 'Star', 'Heart',
  'Mail', 'Phone', 'MapPin', 'Calendar', 'Clock', 'Globe', 'Settings',
  'Search', 'Menu', 'X', 'Plus', 'Minus', 'Edit', 'Trash', 'Save',
  'Download', 'Upload', 'Eye', 'EyeOff', 'ChevronDown', 'ChevronUp',
  'ChevronLeft', 'ChevronRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
  'ExternalLink', 'Copy', 'Share', 'Bookmark', 'Flag', 'AlertCircle',
  'Info', 'HelpCircle', 'Check', 'XCircle', 'AlertTriangle', 'Ban',
  'RefreshCw', 'RotateCcw', 'Play', 'Pause', 'Stop', 'SkipForward',
  'SkipBack', 'Volume2', 'VolumeX', 'Mic', 'MicOff', 'Camera',
  'Video', 'Image', 'File', 'Folder', 'Database', 'Server', 'Cloud',
  'Wifi', 'Bluetooth', 'Battery', 'BatteryCharging', 'Power',
  'Monitor', 'Smartphone', 'Tablet', 'Laptop', 'Desktop', 'Tv',
  'Headphones', 'Speaker', 'Mouse', 'Keyboard', 'Gamepad2',
  'Cpu', 'HardDrive', 'MemoryStick', 'Usb', 'Plug', 'Cable',
  'Wrench', 'Tool', 'Hammer', 'Screwdriver', 'Nut', 'Bolt',
  'Ruler', 'Compass', 'Triangle', 'Square', 'Circle', 'Hexagon',
  'Diamond', 'Star', 'Heart', 'Smile', 'Frown', 'Meh', 'Laugh',
  'Wink', 'Angry', 'Sad', 'Surprised', 'Confused', 'Neutral',
  'Linkedin', 'Twitter', 'Facebook', 'Instagram', 'Youtube', 'Discord',
  'Award', 'Trophy', 'Medal', 'Ribbon', 'Badge', 'Certificate',
  'Home', 'Building', 'Building2', 'Office', 'Store', 'Shop',
  'Slack', 'Trello', 'Figma', 'Dribbble', 'Behance', 'Pinterest',
  'Reddit', 'Tiktok', 'Snapchat', 'Whatsapp', 'Telegram', 'Skype',
  'Zoom', 'Teams', 'Google', 'Apple', 'Microsoft', 'Amazon',
  'Netflix', 'Spotify', 'Paypal', 'Stripe', 'Visa', 'Mastercard',
  'Bitcoin', 'Ethereum', 'Docker', 'Kubernetes', 'Jenkins', 'Gitlab',
  'Bitbucket', 'Jira', 'Confluence', 'Notion', 'Airtable', 'Asana',
  'Monday', 'Clickup', 'Linear', 'Framer', 'Webflow', 'Squarespace',
  'Wix', 'Shopify', 'WooCommerce', 'Magento', 'PrestaShop', 'OpenCart'
];

function fixMissingIcons(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Find all icons used in the file
    const usedIcons = new Set();
    
    // Look for icon: IconName patterns
    const iconMatches = content.matchAll(/icon:\s*(\w+)/g);
    for (const match of iconMatches) {
      usedIcons.add(match[1]);
    }
    
    // Look for <IconName patterns
    const jsxMatches = content.matchAll(/<(\w+)(?:\s|>)/g);
    for (const match of jsxMatches) {
      const iconName = match[1];
      if (commonIcons.includes(iconName)) {
        usedIcons.add(iconName);
      }
    }

    if (usedIcons.size === 0) return false;

    // Check which icons are already imported
    const lucideImportMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?/);
    let importedIcons = new Set();
    
    if (lucideImportMatch) {
      const imports = lucideImportMatch[1].split(',').map(imp => imp.trim());
      importedIcons = new Set(imports);
    }

    // Find missing icons
    const missingIcons = Array.from(usedIcons).filter(icon => !importedIcons.has(icon));
    
    if (missingIcons.length === 0) return false;

    if (lucideImportMatch) {
      // Add missing icons to existing import
      const existingImports = lucideImportMatch[1].trim();
      const newImports = existingImports + ', ' + missingIcons.join(', ');
      const newImportLine = `import { ${newImports} } from 'lucide-react';`;
      content = content.replace(lucideImportMatch[0], newImportLine);
      modified = true;
    } else {
      // Add new import line
      const newImportLine = `import { ${missingIcons.join(', ')} } from 'lucide-react';\n`;
      
      // Find the best place to insert the import
      const useClientMatch = content.match(/('use client';?\s*\n)/);
      if (useClientMatch) {
        content = content.replace(useClientMatch[0], useClientMatch[0] + newImportLine);
      } else {
        content = newImportLine + content;
      }
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added missing icons (${missingIcons.join(', ')}): ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFixed = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      totalFixed += processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixMissingIcons(filePath)) {
        totalFixed++;
      }
    }
  }

  return totalFixed;
}

console.log('Starting missing icon fixes...');
const appDir = path.join(__dirname, 'app');
const totalFixed = processDirectory(appDir);
console.log(`Fixed missing icons in ${totalFixed} files`);
console.log('Missing icon fixes completed!');