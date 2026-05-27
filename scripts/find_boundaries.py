#!/usr/bin/env python3
FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'
with open(FILE, 'r') as f:
    lines = f.readlines()

# Find each "];" followed by blank line then SECTION header
for i in range(len(lines)):
    stripped = lines[i].strip()
    if stripped == '];':
        # Look ahead for SECTION or COMBINED EXPORT
        for j in range(i+1, min(i+5, len(lines))):
            nxt = lines[j].strip()
            if 'SECTION' in nxt or 'COMBINED EXPORT' in nxt:
                print(f"Array closes at line {i+1}, header at line {j+1}")
                # Show context
                for k in range(max(0,i-2), min(len(lines), j+3)):
                    marker = ">>> " if k == i or k == j else "    "
                    print(f"  {k+1:5d} {marker} {repr(lines[k].rstrip())}")
                print()
                break
        else:
            # Also check if COMBINED EXPORT follows
            for j in range(i+1, min(i+10, len(lines))):
                if 'COMBINED EXPORT' in lines[j]:
                    print(f"Array closes at line {i+1}, COMBINED EXPORT at line {j+1}")
                    break

print("\nTotal lines:", len(lines))