#!/usr/bin/env python3
"""
Fix the 5 boundary issues where:
  }            <- last existing service (needs comma)
               <- blank line
  }            <- stray extra brace (needs removal)
];             <- array close

Should become:
  },
];
"""
import re

FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

with open(FILE, 'r') as f:
    content = f.read()

# Pattern: `  }\n\n  }\n];` at section boundaries
# The first `}` belongs to the last service (needs comma), the second is stray
pattern = r'(\s+}\n\n\s+})\n(\];)'

matches = list(re.finditer(pattern, content))
print("Found %d matches for the stray brace pattern" % len(matches))

for m in matches:
    start = max(0, m.start() - 30)
    end = min(len(content), m.end() + 30)
    ctx = content[start:end].replace(chr(10), '\\n')
    print("  Match at pos %d: ...%s..." % (m.start(), ctx))

# Replace: first } gets comma, second } is removed
replacement = r'\1,\n\2'
new_content, count = re.subn(pattern, replacement, content)
print("\nReplaced %d occurrences" % count)

# Also fix cases where the pattern has the comma on the wrong line
# Pattern: `contactUrl: '/contact'\n  // ═══` should be `contactUrl: '/contact'\n  },\n// ═══`
pattern2 = r"(contactUrl: '/contact')\n(\s+// =)"
matches2 = list(re.finditer(pattern2, new_content))
print("Found %d matches for missing closing brace before comment" % len(matches2))

replacement2 = r"\1\n  },\n\2"
new_content, count2 = re.subn(pattern2, replacement2, new_content)
print("Fixed %d missing closing braces" % count2)

with open(FILE, 'w') as f:
    f.write(new_content)

# Verify
with open(FILE, 'r') as f:
    verify = f.read()
opens = verify.count('{')
closes = verify.count('}')
print("\nBrace check: opens=%d, closes=%d, delta=%d" % (opens, closes, opens - closes))

br_o = verify.count('[')
br_c = verify.count(']')
print("Bracket check: opens=[%d], closes=[]=%d" % (br_o, br_c))