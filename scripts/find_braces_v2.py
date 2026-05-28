#!/usr/bin/env python3
"""Find and fix extra closing braces in servicesData.ts"""
FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'
with open(FILE, 'r') as f:
    lines = f.readlines()

content = ''.join(lines)
print(f"Total opens: {content.count('{')}, closes: {content.count('}')}, delta: {content.count('{') - content.count('}')}")

# Find section boundaries to inspect
for i, line in enumerate(lines):
    stripped = line.strip()
    if '// SECTION ' in stripped or '// COMBINED' in stripped or '// NEW:' in stripped:
        # Show 5 lines before and after
        start = max(0, i-3)
        end = min(len(lines), i+5)
        for j in range(start, end):
            marker = ">>>" if j == i else "   "
            print(f"{j+1:5d} {marker} {repr(lines[j].rstrip())}")
        print("---")