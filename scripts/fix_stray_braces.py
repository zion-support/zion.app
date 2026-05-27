#!/usr/bin/env python3
"""
Fix structural issues in servicesData.ts:
1. Each batch 7 section needs proper }, between last existing service and new batch
2. Stray solo `}` lines before `];` array closers need to be `  },`
"""
import re

FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

with open(FILE, 'r') as f:
    lines = f.readlines()

# Fix pattern: a line with just "}" followed by blank line then "];"
# should be "}," followed by blank line then "];"
# This catches the stray closing braces in IT, SAAS, and consulting arrays

fixed_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    stripped = line.strip()

    # Check for the pattern: `  }` alone on a line, followed by a blank line, then `];`
    if stripped == '}' and i + 2 < len(lines):
        next_line = lines[i + 1].strip()
        next_next = lines[i + 2].strip()
        if next_line == '' and next_next == '];':
            # This is a stray brace — needs to be `  },`
            fixed_lines.append('  },\n')
            i += 1
            continue

    # Check for the pattern where `  }` is followed by blank line then `// ═════════...`
    # and then new services section — these are the batch 7 boundaries that need `},`
    if stripped == '}' and i + 2 < len(lines):
        next_line = lines[i + 1].strip()
        next_next = lines[i + 2].strip()
        if next_line == '' and next_next.startswith('// ════════════════════════════════════════') and i + 3 < len(lines):
            after_header = lines[i + 3].strip()
            if after_header == '// BATCH 7:':
                # Need to turn `  }` into `  },`
                fixed_lines.append('  },\n')
                i += 1
                continue

    fixed_lines.append(line)
    i += 1

with open(FILE, 'w') as f:
    f.writelines(fixed_lines)

print("Fixed stray braces")

# Now also fix the old-style # comments to // comments for batch headers
with open(FILE, 'r') as f:
    content = f.read()

# Fix any remaining "# ════" patterns (from earlier python script output)
content = content.replace('# ══════════════════════════════════════════', '// ═══════════════════════════════════════════')
content = content.replace('# BATCH', '// BATCH')

with open(FILE, 'w') as f:
    f.write(content)

print("Fixed comment styles")

# Remove duplicate blank lines (3+ consecutive newlines -> 2 newlines max)
with open(FILE, 'r') as f:
    content = f.read()

while '\n\n\n' in content:
    content = content.replace('\n\n\n', '\n\n')

with open(FILE, 'w') as f:
    f.write(content)

print("Removed excessive blank lines")

# Now verify brace balance
with open(FILE, 'r') as f:
    content = f.read()

# Count { and }
opens = content.count('{')
closes = content.count('}')
print(f"\nBrace check: opens={opens}, closes={closes}, delta={opens - closes}")

# Count array brackets
opens_br = content.count('[')
closes_br = content.count(']')
print(f"Bracket check: opens=[{opens_br}], closes=[]={closes_br}")