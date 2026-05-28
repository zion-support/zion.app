#!/usr/bin/env python3
"""workspace_index.py — lean semantic index of zion.app workspace."""

import os, json, re
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path.home() / '.openclaw' / 'workspace' / 'zion.app'
INDEX_PATH = WORKSPACE / 'data' / 'workspace_index.json'

SKIP_DIRS = {'node_modules', '.git', '__pycache__', '.next', 'dist',
             'build', '.rej', '.tsbuildinfo', '.venv', 'venv', '.cache',
             'state-snapshots'}
CODE_EXTS = {'.py', '.ts', '.tsx', '.js', '.mjs', '.json', '.yaml',
             '.yml', '.toml', '.md', '.sh', '.bash'}

_FUNC_RE  = re.compile(r'^(?:async\s+)?def\s+(\w+)\s*\(', re.M)
_CLASS_RE = re.compile(r'^class\s+(\w+)', re.M)
_IMPORT_RE = re.compile(r'^(?:from\s+(\S+)\s+import|import\s+(\S+))', re.M)
_DECOR_RE = re.compile(r'^\s*@(\w+)\s*\(?', re.M)
_INTENT_RE = re.compile(r'\bV\d+(?:-FEAT\d)?[:\s]\s*([\w\s\-]+)', re.I)

index = {"generated_at": "", "stats": {"files": 0, "symbols": 0,
        "imports": 0, "events": 0, "intents": 0},
         "files": {}, "symbol_index": {}, "events": [], "intents": []}

def rel(p: Path) -> str:
    s = str(p).replace(str(WORKSPACE), '').lstrip('/')
    return s or p.name

def scan(root: Path):
    for p in root.rglob('*'):
        if not p.is_file():
            continue
        if any(seg in p.parts for seg in SKIP_DIRS):
            continue
        if p.suffix.lower() not in CODE_EXTS:
            continue
        yield p

def analyse(fp: Path):
    text = fp.read_text(errors='replace')
    symbols, imports, events, intents = [], [], [], []

    for m in _FUNC_RE.finditer(text):
        name = m.group(1)
        if name != '__init__':
            symbols.append(('def', name))
            index['symbol_index'].setdefault(name, []).append(rel(fp))
    for m in _CLASS_RE.finditer(text):
        name = m.group(1)
        symbols.append(('class', name))
        index['symbol_index'].setdefault(name, []).append(rel(fp))
    for m in _IMPORT_RE.finditer(text):
        mod = m.group(1) or m.group(2)
        if mod:
            imports.append(mod)
    for m in _DECOR_RE.finditer(text):
        ev = m.group(1)
        if ev not in ('property', 'staticmethod', 'classmethod', 'cached_property'):
            events.append(ev)
            index['events'].append({'file': rel(fp), 'event': ev})
    for m in _INTENT_RE.finditer(text):
        label = m.group(1).strip()
        if label:
            intents.append(label)
            index['intents'].append({'file': rel(fp), 'intent': label})

    return symbols, imports, events, intents

for fp in scan(WORKSPACE):
    r = rel(fp)
    syms, imps, evts, ints = analyse(fp)
    index['files'][r] = {
        'symbols': syms, 'imports': imps[:5], 'events': evts[:5],
        'intents': sorted(set(ints)), 'size_kb': round(fp.stat().st_size / 1024, 1),
    }
    index['stats']['files']   += 1
    index['stats']['symbols'] += len(syms)
    index['stats']['imports'] += len(imps)

index['generated_at'] = datetime.now(timezone.utc).isoformat()
index['stats']['events']  = len(index['events'])
index['stats']['intents'] = len(index['intents'])

INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
INDEX_PATH.write_text(json.dumps(index, indent=2))
print(f"workspace_index.json → {INDEX_PATH}")
print(f"Files: {index['stats']['files']} | Symbols: {index['stats']['symbols']}")
print(f"Events: {index['stats']['events']} | Intents: {index['stats']['intents']}")
