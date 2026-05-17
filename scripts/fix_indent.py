#!/usr/bin/env python3
"""Fix indentation issue in git-tracked servicesData.ts"""
path = '/Users/klebergarciaalcatrao/app/data/servicesData.ts'
with open(path, 'r') as f:
    lines = f.readlines()

# Fix line 5731 (0-indexed: 5731) - category: 'it' lost its indentation
for i, line in enumerate(lines):
    if i == 5731:  # 0-indexed, corresponds to line 5732
        print(f"Before: {repr(line)}")
        if line.strip() == "category: 'it'" and not line.startswith('    '):
            lines[i] = "    " + line.lstrip()
            print(f"After:  {repr(lines[i])}")

with open(path, 'w') as f:
    f.writelines(lines)

print("Done")