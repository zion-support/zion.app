#!/usr/bin/env python3
f = open('/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts').read()
opens = f.count('{')
closes = f.count('}')
print("opens: %d, closes: %d, delta: %d" % (opens, closes, opens - closes))

# Find all lines that are just {
lines = f.split('\n')
for i, line in enumerate(lines, 1):
    s = line.strip()
    if s == '{':
        print("Solo { at line %d" % i)
    elif s == '{ ':
        print("Solo {{ at line %d" % i)