#!/usr/bin/env python3
"""Fix truncated strings and broken pricing in servicesData.ts"""
import re

with open('app/data/servicesData.ts', 'r') as f:
    content = f.read()

fixed = 0

# Fix 1: Broken pricing like enterprise: '499 }, -> enterprise: '$499/mo' },
pat = r"enterprise: '(\d+) \},"
for m in re.finditer(pat, content):
    replacement = "enterprise: '$" + m.group(1) + "/mo' },"
    content = content.replace(m.group(0), replacement)
    fixed += 1

# Fix 2: enterprise: 'Custom }, -> enterprise: 'Custom' },
content2 = content.replace("enterprise: 'Custom },", "enterprise: 'Custom' },")
if content2 != content:
    fixed += content.count("enterprise: 'Custom },") 
    content = content2

# Fix 3: Truncated descriptions - find description lines that don't end with ',
lines = content.split('\n')
new_lines = []
for i, line in enumerate(lines):
    if "description: '" in line and not line.rstrip().endswith("',"):
        # Check if this is inside an object (next line has features/id)
        if i + 1 < len(lines) and ('features:' in lines[i + 1] or 'benefits:' in lines[i + 1]):
            line = line.rstrip()
            if line.endswith(','):
                line = line[:-1]
            if not line.endswith("'"):
                line += "'.',"
            fixed += 1
    new_lines.append(line)

content = '\n'.join(new_lines)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"Fixed {fixed} issues")
