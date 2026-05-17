#!/usr/bin/env python3
\"\"\"Generate full sitemap.xml from all service entries in servicesData.ts + static pages.\"\"\"
import re
from datetime import date

SERVICES_FILE = "app/data/servicesData.ts"
SITEMAP_FILE = "public/sitemap.xml"

STATIC_PAGES = [
    ("https://ziontechgroup.com/", "daily", "1.0"),
    ("https://ziontechgroup.com/ai", "weekly", "0.9"),
    ("https://ziontechgroup.com/it-services", "weekly", "0.9"),
    ("https://ziontechgroup.com/pricing", "weekly", "0.8"),
    ("https://ziontechgroup.com/contact", "monthly", "0.8"),
    ("https://ziontechgroup.com/faq", "weekly", "0.7"),
]

def parse_services(filepath):
    with open(filepath, encoding="utf-8") as f:
        text = f.read()
    services = []
    depth = 0
    in_object = False
    current = []
    for ch in text:
        if ch == "{":
            if depth == 0:
                in_object = True
                current = [ch]
            else:
                current.append(ch)
            depth += 1
        elif ch == "}":
            depth -= 1
            if in_object:
                current.append(ch)
                if depth == 0:
                    services.append("".join(current))
                    in_object = False
        else:
            if in_object:
                current.append(ch)
    results = []
    for obj in services:
        id_m = re.search(r"id\s*:\s*['\\\"]([^'\\\"]+)['\\\"]", obj)
        href_m = re.search(r"href\s*:\s*['\\\"]([^'\\\"]+)['\\\"]", obj)
        if id_m and href_m:
            results.append((id_m.group(1), href_m.group(1)))
    return results

def build_sitemap(services, static_pages, today_iso):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, cf, pr in static_pages:
        lines.append(f"  <url><loc>{loc}</loc><changefreq>{cf}</changefreq><priority>{pr}</priority></url>")
    for sid, href in services:
        loc = f"https://ziontechgroup.com{href}"
        lines.append(f"  <url><loc>{loc}</loc><lastmod>{today_iso}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>")
    lines.append("</urlset>")
    return "\\n".join(lines)

def main():
    print("🔍 Parsing services from", SERVICES_FILE)
    services = parse_services(SERVICES_FILE)
    print(f"✅ Found {len(services)} service entries with href")
    today = date.today().isoformat()
    sitemap_xml = build_sitemap(services, STATIC_PAGES, today)
    with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
        f.write(sitemap_xml + "\\n")
    print(f"✅ Wrote {SITEMAP_FILE} — {sitemap_xml.count('<url>')} URLs total")

if __name__ == "__main__":
    main()
