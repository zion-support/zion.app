#!/usr/bin/env python3
"""Find and fix extra closing braces."""
FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'
with open(FILE, 'r') as f:
    lines = f.readlines()

# Find lines that are just "}," or "}" that look suspicious at section boundaries
for i, line in enumerate(lines, 1):
    stripped = line.strip()
    if stripped == '},' or stripped == '}':
        # Check context
        prev = lines[i-2].strip() if i > 1 else ''
        next_ = lines[i].strip() if i < len(lines) else ''
        if '};' == stripped or (stripped == '},' and 'SECTION' in next_):
            print(f"Line {i}: {repr(line.rstrip())} | prev: {repr(prev[:60])} | next: {repr(next_[:60])}")

# Count total
content = ''.join(lines)
print(f"\nTotal opens: {content.count('{')}, closes: {content.count('}')}, delta: {content.count('{') - content.count('}')}")