#!/usr/bin/env python3
"""Fix syntax errors in servicesData.ts"""
import re
from pathlib import Path

p = Path('app/data/servicesData.ts')
txt = p.read_text(encoding='utf-8')

# Escape apostrophes in single-quoted strings safely
def escape_inner_quotes(m):
    inner = m.group(1)
    # Only escape apostrophes that are not already escaped
    # Count: any ' that is not preceded by \
    escaped = re.sub(r"(?<!\\)'", r"\\'", inner)
    return f"'{escaped}'"

txt = re.sub(r"'((?:[^'\\]|\\.)*?)'", escape_inner_quotes, txt)

# Add missing commas between service blocks
txt = re.sub(r'}\s*\n\s*\n\s*\{', '},\n\n  {', txt)
txt = re.sub(r'}\s*\n\s*\{', '},\n  {', txt)

# Remove stray ;" 
txt = re.sub(r';\s*[\'"]\s*\n', '\n', txt)

p.write_text(txt, encoding='utf-8')
print("✅ Fixed servicesData.ts")
