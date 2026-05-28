#!/usr/bin/env python3
"""Quick fix: update home page service count."""
HOME = '/Users/klebergarciaalcatrao/zion.app/app/page.tsx'
with open(HOME, 'r') as f:
    home = f.read()

changed = False
if '159+' in home:
    home = home.replace('159+', '172+')
    changed = True
    print("Updated: 159+ -> 172+")
if '138+' in home:
    home = home.replace('138+', '169+')
    changed = True
    print("Updated: 138+ -> 169+")

if changed:
    with open(HOME, 'w') as f:
        f.write(home)
    print("Home page saved.")
else:
    print("No changes needed.")