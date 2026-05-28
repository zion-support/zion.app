#!/usr/bin/env python3
"""Fix servicesData.ts - add missing closing braces and commas"""
with open('/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts', 'r') as f:
    lines = f.readlines()

# Find all service objects that are missing closing braces
new_lines = []
i = 0
fixes = 0
while i < len(lines):
    line = lines[i]
    new_lines.append(line)

    stripped = line.strip()
    # Check if this line has contactUrl (end of a service object) but no closing },
    # and the next non-empty line starts a new service object
    if stripped.startswith('contactUrl:') and not stripped.endswith('},') and not stripped.endswith('},'):
        # This service is missing its closing },
        # Find next non-empty line
        next_idx = i + 1
        while next_idx < len(lines) and lines[next_idx].strip() == '':
            next_idx += 1
        if next_idx < len(lines):
            next_stripped = lines[next_idx].strip()
            if next_stripped.startswith("{") and not next_stripped.startswith("{{"):
                # Missing closing }, before this new object
                # Replace the current line by adding },
                new_lines[-1] = line.rstrip('\n') + '\n  },\n'
                fixes += 1
                print(f"  Fixed missing }}, at line {i+1} (after contactUrl)")
    i += 1

content = ''.join(new_lines)

# Also remove any duplicate ]; patterns
import re
old = ''
while old != content:
    old = content
    content = re.sub(r'\];\n\];', '];', content)

with open('/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"\nTotal fixes: {fixes}")
print(f"Line count: {content.count(chr(10))}")