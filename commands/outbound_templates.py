#!/usr/bin/env python3
"""
Outbound Email Template Library — Zion Tech Group

Scans Drive "Templates/" folder for .md/.txt templates. Render with variables
or insert as Gmail draft directly.

Usage:
  python3 outbound_templates.py list
  python3 outbound_templates.py render "template_name" --var key=value --var name=value
  python3 outbound_templates.py insert "template_name" --to email@example.com --var key=val
"""

import sys, os, re, json, argparse, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gog_headers

TEMPLATE_FOLDER = 'Templates'

def gog_headers_local():
    try:
        from google_workspace import gog_headers as _gh
        return _gh()
    except Exception:
        return {}

def list_templates():
    params = {
        'q': f"name='{TEMPLATE_FOLDER}' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        'pageSize': 5, 'fields': 'files(id,name)'
    }
    url = 'https://www.googleapis.com/drive/v3/files?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=gog_headers_local())
    resp = json.loads(urllib.request.urlopen(req).read())
    folders = resp.get('files', [])
    if not folders:
        return []
    folder_id = folders[0]['id']

    params2 = {'q': f"'{folder_id}' in parents and trashed=false", 'pageSize': 50, 'fields': 'files(id,name,mimeType)'}
    url2 = 'https://www.googleapis.com/drive/v3/files?' + urllib.parse.urlencode(params2)
    req2 = urllib.request.Request(url2, headers=gog_headers_local())
    resp2 = json.loads(urllib.request.urlopen(req2).read())
    files = resp2.get('files', [])
    return [f for f in files if f['name'].lower().endswith(('.md', '.txt'))]

def render_template(file_id: str, variables: dict) -> str:
    dl_url = f'https://www.googleapis.com/drive/v3/files/{file_id}?alt=media'
    req = urllib.request.Request(dl_url, headers=gog_headers_local())
    content = urllib.request.urlopen(req).read().decode('utf-8')
    for key, val in variables.items():
        content = content.replace(f'{{{{{key}}}}}', val)
    return content

def create_draft(subject: str, body: str, to_addr: str) -> str:
    import base64, json
    raw = f"Subject: {subject}\r\nTo: {to_addr}\r\n\r\n{body}"
    encoded = base64.urlsafe_b64encode(raw.encode()).decode().rstrip('=')
    url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
    payload = json.dumps({'message': {'raw': encoded}}).encode()
    req = urllib.request.Request(url, data=payload, headers=gog_headers_local(), method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id')

def cmd_list():
    templates = list_templates()
    if not templates:
        print("No templates found in Drive/Templates/")
        return
    print("📋 Templates:")
    for t in templates:
        print(f"  • {t['name']}")

def cmd_render(name: str, variables: dict):
    templates = list_templates()
    match = next((t for t in templates if t['name'].lower() == name.lower() or t['name'] == name), None)
    if not match:
        print(f"❌ Template '{name}' not found.")
        return
    rendered = render_template(match['id'], variables)
    print(rendered)

def cmd_insert(name: str, to_addr: str, variables: dict):
    templates = list_templates()
    match = next((t for t in templates if t['name'].lower() == name.lower() or t['name'] == name), None)
    if not match:
        print(f"❌ Template '{name}' not found.")
        return
    rendered = render_template(match['id'], variables)
    # Extract subject if first line is "Subject: ..."
    if rendered.startswith('Subject:'):
        subject = rendered.split('\n')[0].replace('Subject:', '').strip()
        body = '\n'.join(rendered.split('\n')[1:]).strip()
    else:
        subject = rendered.split('\n')[0][:80]
        body = rendered
    draft_id = create_draft(subject, body, to_addr)
    print(f"✅ Draft created (ID: {draft_id[:8]}…)")

def main():
    parser = argparse.ArgumentParser(description='Outbound Email Template Library')
    sub = parser.add_subparsers(dest='cmd', required=True)
    sub.add_parser('list', help='List templates')
    p_render = sub.add_parser('render', help='Render template to stdout')
    p_render.add_argument('template')
    p_render.add_argument('--var', action='append')
    p_insert = sub.add_parser('insert', help='Create Gmail draft from template')
    p_insert.add_argument('template')
    p_insert.add_argument('--to', required=True)
    p_insert.add_argument('--var', action='append')
    args = parser.parse_args()
    variables = {}
    if hasattr(args, 'var') and args.var:
        for v in args.var:
            if '=' in v:
                k, val = v.split('=', 1)
                variables[k.strip()] = val.strip()
    if args.cmd == 'list':
        cmd_list()
    elif args.cmd == 'render':
        cmd_render(args.template, variables)
    elif args.cmd == 'insert':
        cmd_insert(args.template, args.to, variables)

if __name__ == '__main__':
    main()
