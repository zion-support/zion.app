#!/usr/bin/env python3
"""Rebuild app/data/servicesData.json from app/data/servicesData.ts"""
import json, re, os, sys

src = 'app/data/servicesData.ts'
out = 'app/data/servicesData.json'

with open(src, 'r') as f:
    text = f.read()

# Find the allServices array - it aggregates all other arrays
idx = text.find('export const allServices')
if idx == -1:
    print("ERROR: Cannot find allServices export"); sys.exit(1)

bracket_start = text.index('[', idx)
depth = 0
i = bracket_start
while i < len(text):
    if text[i] == '[': depth += 1
    elif text[i] == ']':
        depth -= 1
        if depth == 0: break
    i += 1

array_text = text[bracket_start+1:i]

# Convert TS/JS object literals to JSON
import re

# Replace single quotes with double quotes for strings
# Handle escaped apostrophes (\u2019) - convert back to normal apostrophe
result = array_text.replace('\u2019', "'")

# Now quote all single-quoted strings as double-quoted
# Strategy: find '...' patterns and replace with "..."
# But skip already-quoted and nested cases

# Simple state machine approach
output = []
j = 0
in_string = False
string_char = None
escaped = False

while j < len(result):
    ch = result[j]
    
    if escaped:
        output.append(ch)
        escaped = False
        j += 1
        continue
    
    if ch == '\\':
        output.append(ch)
        escaped = True
        j += 1
        continue
    
    if not in_string:
        if ch == "'":
            output.append('"')
            in_string = True
        elif ch == '/':
            # Skip comments
            if j+1 < len(result) and result[j+1] == '/':
                while j < len(result) and result[j] != '\n':
                    j += 1
                continue
            elif j+1 < len(result) and result[j+1] == '*':
                end = result.find('*/', j+2)
                if end != -1:
                    j = end + 2
                    continue
                else:
                    break
            else:
                output.append(ch)
        else:
            output.append(ch)
    else:
        if ch == "'":
            output.append('"')
            in_string = False
        elif ch == '"':
            output.append('\\"')
        elif ch == '\n':
            output.append('\\n')
        else:
            output.append(ch)
    
    j += 1

json_str = ''.join(output)

# Remove trailing commas before } or ]
json_str = re.sub(r',\s*([}\]])', r'\1', json_str)

# Fix any undefined values from spread operators
json_str = json_str.replace('undefined,', '')
json_str = json_str.replace('undefined]', ']')
json_str = json_str.replace('undefined}', '}')

# Parse
try:
    services = json.loads(json_str)
except json.JSONDecodeError as e:
    print(f"JSON parse error at pos {e.pos}: {e.msg}")
    # Try to fix: remove any trailing content after last valid ]
    # Save the problematic section for debugging
    with open('/tmp/debug_json_error.txt', 'w') as f:
        f.write(json_str[max(0, e.pos-200):e.pos+200])
    print(f"Debug saved to /tmp/debug_json_error.txt")
    sys.exit(1)

with open(out, 'w') as f:
    json.dump(services, f, ensure_ascii=False, indent=2)

print(f"✅ Wrote {len(services)} services to {out}")

# Count by category
cats = {}
for s in services:
    c = s.get('category', 'unknown')
    cats[c] = cats.get(c, 0) + 1
print(f"Categories: {json.dumps(cats)}")
