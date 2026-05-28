#!/usr/bin/env python3
"""Fix deprecated next/head imports across the app."""
import os, re

def fix_next_head(path):
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except:
        return "SKIP"

    if "from 'next/head'" not in content and 'from "next/head"' not in content:
        return "OK-skip"
    if "<Head" not in content and "<head" not in content:
        return "OK-skip"

    original = content

    # Remove import line
    content = re.sub(r"import\s+\{[^}]*\}\s+from\s+'next/head'\s*;?\n?", '', content)
    content = re.sub(r"import\s+\{[^}]*\}\s+from\s+\"next/head\"\s*;?\n?", '', content)
    content = re.sub(r"import\s+Head\s+from\s+'next/head'\s*;?\n?", '', content)
    content = re.sub(r"import\s+Head\s+from\s+\"next/head\"\s*;?\n?", '', content)

    # Extract content from <Head>...</Head> before removing
    head_blocks = re.findall(r'<Head>(.*?)</Head>', content, re.DOTALL)
    head_content = '\n'.join(head_blocks)

    # Remove all <Head>...</Head> blocks
    content = re.sub(r'<Head>.*?</Head>', '', content, flags=re.DOTALL)
    content = re.sub(r'<head>.*?</head>', '', content, flags=re.DOTALL)

    # Collapse extra blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Extract title/description from head content
    title_match = re.search(r'<title>(.*?)</title>', head_content, re.DOTALL)
    desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', head_content)

    # Check if metadata already exists
    existing_meta = re.search(r"export\s+const\s+metadata\s*[:=]\s*\{", content) is not None

    meta_added = False
    if title_match and not existing_meta:
        title = title_match.group(1).strip().replace('"', '\\"')
        desc = ''
        if desc_match:
            desc = desc_match.group(1).strip().replace('"', '\\"')

        meta_export = f'''
export const metadata = {{
  title: "{title}",
  description: "{desc}",
}};

'''
        # Find where to insert (after last import/use client directive)
        lines = content.split('\n')
        insert_at = 0
        for i, line in enumerate(lines):
            stripped = line.strip()
            if (stripped.startswith('import ') or stripped.startswith('export ') or
                stripped == "'use client'" or stripped == '"use client"'):
                insert_at = i + 1

        lines.insert(insert_at, meta_export)
        content = '\n'.join(lines)
        meta_added = True

    if content == original:
        return "NOCHANGE"

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    return "FIXED-meta" if meta_added else "FIXED"

root = '/Users/miami2/zion.app/app'
fixed = []
fixed_meta = []
for dirpath, dirs, files in os.walk(root):
    for fn in files:
        if fn.endswith('.tsx'):
            path = os.path.join(dirpath, fn)
            result = fix_next_head(path)
            if result == 'FIXED-meta':
                fixed_meta.append(path.replace('/Users/miami2/zion.app/', ''))
            elif result == 'FIXED':
                fixed.append(path.replace('/Users/miami2/zion.app/', ''))

print(f"Fixed {len(fixed)+len(fixed_meta)} files ({len(fixed_meta)} with metadata)")
for f in fixed_meta:
    print(f"  META: {f}")
for f in fixed:
    print(f"  head: {f}")
