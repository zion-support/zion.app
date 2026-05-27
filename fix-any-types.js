import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function fixAnyTypes() {
  // Find all page.tsx files in the app directory
  const files = await glob('app/**/page.tsx', { cwd: '/workspace' });

  console.log(`Found ${files.length} page files to fix`);

  let fixedCount = 0;

  files.forEach(file => {
    const filePath = path.join('/workspace', file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace the any type with a proper interface
      if (content.includes('export default function Wrapped(props: any)')) {
        content = content.replace(
          'export default function Wrapped(props: any)',
          'export default function Wrapped(props: Record<string, unknown>)'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
        console.log(`Fixed: ${file}`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });

  console.log(`\nFixed ${fixedCount} files`);
}

fixAnyTypes().catch(console.error);