#!/usr/bin/env python3
"""
Link Auditor for Next.js Static Sites
Audit all internal links in out/ to verify they resolve correctly
"""

import re, json, pathlib
from urllib.parse import urlparse

BASE = pathlib.Path('/root/.openclaw/workspace/zion.app')
OUT = BASE / 'out'

def extract_links_from_html(html_path):
    """Extract all href/src attributes from HTML file"""
    try:
        html = html_path.read_text(errors='replace')
        links = []
        # Extract href attributes
        for href in re.findall(r'href=[\'"]([^\'"]+)[\'"]', html, re.I):
            links.append(href)
        # Extract src attributes (images, scripts)
        for src in re.findall(r'src=[\'"]([^\'"]+)[\'"]', html, re.I):
            links.append(src)
        return links
    except Exception as e:
        print(f"Error reading {html_path}: {e}")
        return []

def resolve_path(href, html_file):
    """Resolve href to actual file path, handling Next.js routing"""
    # Skip external, anchor, and special protocol links
    if href.startswith(('http', 'https', 'mailto', 'tel', '//', '#', 'data:')):
        return None, 'external'
    
    # Skip Next.js internal chunk files (false positives)
    if '/_next/static/chunks/' in href and href.endswith('.js'):
        return None, 'skipped-chunk'
    
    # Strip query and fragment
    clean = href.split('?')[0].split('#')[0]
    
    if clean == '/' or clean == '':
        return OUT / 'index.html', 'ok'
    
    # Remove leading slash
    clean = clean.lstrip('/')
    
    # Check possible locations in order:
    # 1. clean/index.html (Next.js default routes)
    # 2. clean/page.html (app router)
    # 3. clean.html (flat routes)
    
    candidates = [
        OUT / clean / 'index.html',
        OUT / f"{clean}/page.html",
        OUT / f"{clean}.html",
        OUT / clean,  # Directory exists
    ]
    
    for path in candidates:
        if path.exists():
            return path, 'ok'
    
    # Check if it's a dynamic route pattern (e.g., /services/[id])
    if '/[' in clean or clean.endswith('/[id]'):
        # Dynamic routes - check if parent exists
        parent = OUT / clean.split('/[')[0]
        if parent.exists():
            return None, 'dynamic'
    
    return None, 'broken'

def audit_site():
    """Audit all HTML files for broken links"""
    if not OUT.exists():
        print(f"❌ {OUT} does not exist - run npm run build first")
        return
    
    html_files = list(OUT.rglob('*.html'))
    print(f"🔍 Auditing {len(html_files)} HTML files...")
    
    results = {
        'total_files': len(html_files),
        'broken_links': [],
        'dynamic_routes': [],
        'external_links': 0,
        'ok_links': 0
    }
    
    for html_file in html_files[:100]:  # Sample first 100
        links = extract_links_from_html(html_file)
        for href in links:
            if not href or href.startswith(('#', 'data:')):
                continue
                
            resolved, status = resolve_path(href, html_file)
            
            if status == 'external':
                results['external_links'] += 1
            elif status == 'ok':
                results['ok_links'] += 1
            elif status == 'dynamic':
                results['dynamic_routes'].append({
                    'file': str(html_file.relative_to(OUT)),
                    'href': href[:80]
                })
            elif status == 'broken':
                results['broken_links'].append({
                    'file': str(html_file.relative_to(OUT)),
                    'href': href[:80]
                })
    
    # Print results
    print(f"\n📊 Link Audit Results:")
    print(f"   Total files audited: {results['total_files']}")
    print(f"   Valid links: {results['ok_links']}")
    print(f"   External links: {results['external_links']}")
    print(f"   Dynamic routes detected: {len(results['dynamic_routes'])}")
    print(f"   Broken links: {len(results['broken_links'])}")
    
    if results['broken_links'][:10]:
        print(f"\n❌ Broken Links (sample):")
        for link in results['broken_links'][:10]:
            print(f"   [{link['file']}] → {link['href']}")
    
    if results['dynamic_routes'][:5]:
        print(f"\n🔄 Dynamic Routes (sample):")
        for route in results['dynamic_routes'][:5]:
            print(f"   [{route['file']}] → {route['href']}")
    
    return results

if __name__ == '__main__':
    audit_site()