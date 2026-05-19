#!/usr/bin/env python3
"""
V61 - Website Contact Route Fix
Creates the /contact route that CI expects
"""

import os
from pathlib import Path

# Check if there's a website directory
WEBSITE_DIR = Path('/root/.openclaw/workspace/zion.app/commands/website')
CONTACT_FILE = WEBSITE_DIR / 'contact.html'

def create_contact_route():
    """Create /contact route for CI validation"""
    
    contact_html = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Zion Tech Group</title>
</head>
<body>
    <header>
        <h1>Zion Tech Group</h1>
    </header>
    <main>
        <h2>Contact Us</h2>
        <p>Email: <a href="mailto:commercial@ziontechgroup.com">commercial@ziontechgroup.com</a></p>
        <p>Phone: +1 302 464 0950</p>
        <p>Address: 364 E Main St STE 1008, Middletown, DE</p>
    </main>
</body>
</html>"""
    
    WEBSITE_DIR.mkdir(parents=True, exist_ok=True)
    CONTACT_FILE.write_text(contact_html)
    
    print(f"✅ Created contact.html at {CONTACT_FILE}")
    print("This provides the /contact route CI expects with:")
    print("  - commercial@ziontechgroup.com email")
    print("  - Valid contact information")

if __name__ == '__main__':
    create_contact_route()