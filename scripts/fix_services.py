#!/usr/bin/env python3
"""Fix the servicesData.ts - remove duplicate ]; and fix syntax"""
with open('/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts', 'r') as f:
    content = f.read()

# Remove the extra ]; that was added by the previous script
# Replace any occurrence of ];\n]; which means a duplicate close
import re
while True:
    new_content = re.sub(r'\];\n\];', '];', content)
    if new_content == content:
        break
    content = new_content
    print("Fixed one duplicate ];")

# Now check each section has proper comma separation between objects
# Look for patterns like "},\n\n  {" which need a comma between the } and {
# But also check for "}\n\n  {" without comma

fixes = 0
lines = content.split('\n')
new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    # Check if this line ends a service object (contains } but not } from closing brackets/arrays)
    stripped = line.strip()
    if stripped == '},' or stripped == '}':
        # Check next non-empty line
        next_idx = i + 1
        while next_idx < len(lines) and lines[next_idx].strip() == '':
            next_idx += 1
        if next_idx < len(lines):
            next_stripped = lines[next_idx].strip()
            if next_stripped.startswith("{") and not next_stripped.startswith("{{"):
                # Next line starts an object but we don't have a comma
                if stripped == '}':
                    # Need to add comma
                    new_lines[-1] = line + ','
                    fixes += 1
                    print(f"  Fixed missing comma at line {i+1}, next object at line {next_idx+1}")

content = '\n'.join(new_lines)

# Now check for the specific area around the insertions:
# Ensure ai array closing is proper
# Ensure ]; followed by // SECTION 2 exists

with open('/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"\nDone! Fixes applied: {fixes}")
print(f"File now has {content.count(chr(10))} lines")

# Let's also verify the file can be loaded as valid JS
print("\n--- Checking around line 1101 ---")
lines = content.split('\n')
for i in range(1095, 1110):
    if i < len(lines):
        print(f"{i+1:4d}| {lines[i]}")