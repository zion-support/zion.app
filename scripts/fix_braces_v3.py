#!/usr/bin/env python3
"""
Fix remaining structural issues.
Pattern found at each error site:
  line N:   }          <- last existing service
  line N+1: (blank)
  line N+2: },         <- stray brace from batch 7 insertion
  line N+3: ];         <- array close

Fix to:
  N:   },
  N+1: ];
  (remove N+2 and N+3)

Also need to handle cases where batch 7 service entries have an extra } before ].
"""
import re

FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

with open(FILE, 'r') as f:
    content = f.read()

# Pattern: `  }\n\n  },\n];` 
# -> keep first `}` as `},`, remove second `},\n`, keep `];`
pattern = r'(\s+})\n\n\s+},\n(\];)'

matches = list(re.finditer(pattern, content))
print("Found %d matches" % len(matches))

replacement = r'\1,\n\2'
content, count = re.subn(pattern, replacement, content)
print("Fixed %d sites" % count)

# Also handle pattern without trailing comma on second brace: `  }\n\n  }\n];`
pattern2 = r'(\s+})\n\n\s+}\n(\];)'
matches2 = list(re.finditer(pattern2, content))
print("Found %d more matches (variant)" % len(matches2))

replacement2 = r'\1,\n\2'
content, count2 = re.subn(pattern2, replacement2, content)
print("Fixed %d more sites" % count2)

with open(FILE, 'w') as f:
    f.write(content)

# Verify
with open(FILE, 'r') as f:
    verify = f.read()
opens = verify.count('{')
closes = verify.count('}')
print("\nBrace check: opens=%d, closes=%d, delta=%d" % (opens, closes, opens - closes))