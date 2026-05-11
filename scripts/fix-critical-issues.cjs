#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Fix unused imports in specific files
const filesToFix = [
  "app/ai-audio-processor/page.tsx",
  "app/ai-code-assistant/page.tsx",
  "app/ai-customer-feedback-analyzer/page.tsx",
  "app/ai-inventory-optimizer-pro/page.tsx",
  "app/ai-legal-document-analyzer/page.tsx",
  "app/ai-medical-diagnosis-assistant/page.tsx",
  "app/ai-project-manager-pro/page.tsx",
  "app/ai-translator/page.tsx",
  "app/ai-video-generator/page.tsx",
  "app/micro-saas-solutions/page.tsx",
  "app/quantum-computing-solutions/page.tsx",
];

function removeUnusedImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Common unused imports to remove
    // const unusedImports = [
    //   "SparklesIcon",
    //   "ClockIcon",
    //   "ChatBubbleLeftRightIcon",
    //   "UserGroupIcon",
    //   "EyeIcon",
    //   "ChartBarIcon",
    //   "TruckIcon",
    //   "CurrencyDollarIcon",
    //   "ShieldCheckIcon",
    //   "CogIcon",
    //   "GlobeAltIcon",
    //   "DocumentTextIcon",
    //   "CodeBracketIcon",
    //   "DevicePhoneMobileIcon",
    //   "CloudIcon",
    //   "SignalIcon",
    //   "BoltIcon",
    //   "StarIcon",
    // ];

    // Check if any of these imports are actually used
    const lines = content.split("\n");
    const importLines = [];
    const otherLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("import") && line.includes("from")) {
        importLines.push({ line: i, content: line });
      } else {
        otherLines.push({ line: i, content: line });
      }
    }

    const allOtherContent = otherLines.map((l) => l.content).join("\n");

    // Process import lines
    for (const importLine of importLines) {
      const lineContent = importLine.content;

      if (lineContent.includes("{") && lineContent.includes("}")) {
        const importMatch = lineContent.match(
          /import\s*{\s*([^}]+)\s*}\s*from/,
        );
        if (importMatch) {
          const imports = importMatch[1].split(",").map((imp) => imp.trim());
          const usedImports = imports.filter((imp) => {
            const importName = imp.replace(/\s+as\s+\w+/, "").trim();
            return allOtherContent.includes(importName);
          });

          if (usedImports.length !== imports.length) {
            if (usedImports.length === 0) {
              lines[importLine.line] = "";
            } else {
              const newImportLine = lineContent.replace(
                /{\s*[^}]+\s*}/,
                `{ ${usedImports.join(", ")} }`,
              );
              lines[importLine.line] = newImportLine;
            }
            modified = true;
          }
        }
      }
    }

    if (modified) {
      const newContent = lines.join("\n");
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`Fixed unused imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process files
filesToFix.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    removeUnusedImports(fullPath);
  }
});

console.log("Critical issues fix completed!");
