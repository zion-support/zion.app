#!/usr/bin/env python3
"""Diagnose and fix the servicesData.ts syntax error"""
with open('/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts', 'r') as f:
    lines = f.readlines()

# Focus on the area around line 1101 (0-indexed 1100)
for i in range(1090, 1110):
    print(f"{i+1:4d}| {repr(lines[i])}")

# Check for missing commas between objects in aiServices
# The aiServices array is from line 25 to wherever ]; appears
in_ai = False
ai_start = None
for i, line in enumerate(lines):
    stripped = line.strip()
    if 'export const aiServices' in stripped:
        in_ai = True
        ai_start = i
    if in_ai and stripped == '];':
        ai_end = i
        break

print(f"\naiServices: lines {ai_start+1} to {ai_end+1}")

# Find all line numbers that start an object in the array
for i in range(ai_start, ai_end):
    stripped = lines[i].strip()
    if stripped == '{':
        # Check if the previous non-empty, non-commented line ends with ,
        prev = i - 1
        while prev >= ai_start and lines[prev].strip() in ('', '//'):
            prev -= 1
        if prev >= ai_start:
            prev_line = lines[prev].strip()
            if not prev_line.endswith(',') and not prev_line.endswith('['):
                print(f"  WARNING: Line {prev+1} does not end with comma: '{prev_line}'")
                print(f"    Next: Line {i+1} starts new object")