const fs = require('fs');

const filePath = '/workspace/app/it-services/cybersecurity-audit/page.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// Remove all extra closing braces
content = content.replace(/}\n/g, '\n');
content = content.replace(/;\n}/g, ';\n');
content = content.replace(/{\n}/g, '{\n');

// Fix specific patterns
content = content.replace(/export const metadata = {\s*}\s*title:/g, 'export const metadata = {\n  title:');
content = content.replace(/export const metadata = {\s*}\s*description:/g, 'export const metadata = {\n  description:');
content = content.replace(/export const metadata = {\s*}\s*keywords:/g, 'export const metadata = {\n  keywords:');
content = content.replace(/export const metadata = {\s*}\s*openGraph:/g, 'export const metadata = {\n  openGraph:');

// Fix function declarations
content = content.replace(/export default function\s+(\w+)\s*\(\s*}\s*\)/g, 'export default function $1()');
content = content.replace(/export default function\s+(\w+)\s*\(\s*}\s*(\w+),/g, 'export default function $1($2,');

// Fix JSX
content = content.replace(/{\s*}\s*(\w+);/g, '{$1}');
content = content.replace(/{\s*}\s*(\w+)\s*}/g, '{$1}');

// Clean up multiple consecutive braces
content = content.replace(/\n}\n}\n/g, '\n}\n');
content = content.replace(/\n}\n}\n}/g, '\n}\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed cybersecurity page');