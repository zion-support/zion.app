#!/usr/bin/env python3
"""
Vector Index Builder for Zion Org Memory
Crawls Gmail + Drive, generates embeddings, and stores in Chroma.

Requires: pip install chromadb
If chromadb is not available, commands will print helpful error.
"""

import sys, os, json, datetime, argparse, hashlib, struct, math
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / 'zion.app' / 'commands'))
from google_workspace import (
    gmail_search, gmail_get, extract_body_from_gmail_message,
    drive_list, drive_get
)
from llm_client import chat  # we'll use for embeddings if needed (future)

WORKSPACE = Path('/root/.openclaw/workspace')
ZION_APP = WORKSPACE / 'zion.app'
VECTOR_DB = ZION_APP / 'data' / 'chroma'
VECTOR_DB.mkdir(parents=True, exist_ok=True)

# ── Chroma (optional) ────────────────────────────────────────────────────────
_chroma_available = False
try:
    import chromadb
    from chromadb.config import Settings
    _chroma_available = True
except ImportError:
    pass

if _chroma_available:
    chroma_client = chromadb.Client(Settings(
        chroma_db_impl="duckdb+parquet",
        persist_directory=str(VECTOR_DB),
        anonymized_telemetry=False
    ))
else:
    chroma_client = None

COLLECTION_NAME = "org_memory"

def get_collection():
    if not _chroma_available:
        raise RuntimeError("chromadb not installed. Install with: pip install chromadb")
    try:
        return chroma_client.get_collection(name=COLLECTION_NAME)
    except Exception:
        return chroma_client.create_collection(name=COLLECTION_NAME, metadata={"hnsw:space": "cosine"})

# ── Embeddings ───────────────────────────────────────────────────────────────

def embed_text(text: str) -> list[float]:
    """Generate embedding via local Ollama if available, else deterministic hash fallback."""
    import urllib.request, json
    # Try Ollama embeddings (local)
    for model in ['nomic-embed-text', 'mxbai-embed-large', 'all-minilm']:
        try:
            req = urllib.request.Request(
                'http://localhost:11434/api/embeddings',
                data=json.dumps({'model': model, 'prompt': text[:2000]}).encode(),
                headers={'Content-Type': 'application/json'}
            )
            resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
            return resp['embedding']
        except Exception:
            continue
    # Deterministic fallback (hash-based pseudo-embedding)
    h = hashlib.sha256(text.encode()).digest()
    nums = list(struct.unpack('13f', h[:52]))
    norm = math.sqrt(sum(x*x for x in nums))
    normalized = [x/norm for x in nums]
    # Pad to 384
    while len(normalized) < 384:
        normalized.extend(normalized[:384-len(normalized)])
    return normalized[:384]

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunks.append(' '.join(words[i:i+chunk_size]))
    return chunks

# ── Indexing ─────────────────────────────────────────────────────────────────

collection = None
if _chroma_available:
    collection = get_collection()

def index_email_message(msg):
    headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
    subject = headers.get('Subject', '(no subject)')
    body = extract_body_from_gmail_message(msg)
    full_text = f"Subject: {subject}\n\n{body}"
    for chunk in chunk_text(full_text):
        chunk_id = f"email_{msg['id']}_{hash(chunk) % 10000}"
        collection.add(
            documents=[chunk],
            metadatas=[{"type": "email", "id": msg['id'], "subject": subject}],
            ids=[chunk_id]
        )

def index_drive_file(file_meta):
    if file_meta['mimeType'].startswith('application/vnd.google-apps'):
        return 0  # skip native Google Docs for now
    try:
        content = drive_get(file_meta['id'])
        count = 0
        for chunk in chunk_text(content):
            chunk_id = f"drive_{file_meta['id']}_{hash(chunk) % 10000}"
            collection.add(
                documents=[chunk],
                metadatas=[{"type": "drive", "id": file_meta['id'], "name": file_meta['name']}],
                ids=[chunk_id]
            )
            count += 1
        return count
    except Exception as e:
        print(f"Drive index error {file_meta['id']}: {e}", file=sys.stderr)
        return 0

# ── Search ───────────────────────────────────────────────────────────────────

def vector_search(query: str, n_results: int = 5):
    results = collection.query(query_texts=[query], n_results=n_results)
    return results

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    global collection
    parser = argparse.ArgumentParser(description='Vector Index Builder for Org Memory')
    sub = parser.add_subparsers(dest='cmd')

    p_index = sub.add_parser('index', help='Index Gmail + Drive into vector DB')
    p_index.add_argument('--query', default='', help='Gmail search filter')
    p_index.add_argument('--limit', type=int, default=100)
    p_index.add_argument('--drive-limit', type=int, default=50)

    p_search = sub.add_parser('vsearch', help='Semantic vector search')
    p_search.add_argument('query')
    p_search.add_argument('--limit', type=int, default=5)

    p_reset = sub.add_parser('reset', help='Clear vector index')

    args = parser.parse_args()

    if not _chroma_available:
        print("⚠️ chromadb is not installed. Vector operations are disabled.", file=sys.stderr)
        print("Install with: pip install chromadb", file=sys.stderr)
        if args.cmd:
            sys.exit(1)
        else:
            parser.print_help()
            sys.exit(0)

    collection = get_collection()

    if args.cmd == 'index':
        print(f"🔍 Indexing Gmail (filter='{args.query}', limit={args.limit})...")
        msgs = gmail_search(args.query, limit=args.limit)
        for m in msgs:
            msg = gmail_get(m['id'])
            index_email_message(msg)
        print(f"✅ Indexed {len(msgs)} emails")
        print("📁 Indexing Drive files...")
        files = drive_list(limit=args.drive_limit)
        total_chunks = sum(index_drive_file(f) for f in files)
        print(f"✅ Indexed {len(files)} Drive files ({total_chunks} chunks)")
        if chroma_client:
            chroma_client.persist()
        print(f"📦 Total vectors: {collection.count()}")
    elif args.cmd == 'vsearch':
        results = vector_search(args.query, n_results=args.limit)
        ids = results['ids'][0]
        docs = results['documents'][0]
        metas = results['metadatas'][0]
        dists = results['distances'][0]
        print(f"🔍 Vector search: '{args.query}'\n")
        for i, (doc_id, doc, meta, dist) in enumerate(zip(ids, docs, metas, dists)):
            score = 1 - dist
            src = f"[{meta.get('type','?')} {meta.get('id','')[:8]}]"
            title = meta.get('subject') or meta.get('name','')[:50]
            print(f"{i+1}. {src} {title}\n   Score: {score:.2f}\n   {doc[:150]}...\n")
    elif args.cmd == 'reset':
        chroma_client.delete_collection(COLLECTION_NAME)
        print("🗑️ Vector index cleared.")
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
