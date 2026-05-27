#!/usr/bin/env python3
"""Feature Promotion Agent – generates index.html from feature_promo.yml and writes to repo root.
"""

import os
import re
from pathlib import Path
from datetime import datetime

WORKSPACE = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
MEMORY = WORKSPACE / "MEMORY.md"
FEATURES_FILE = WORKSPACE / "feature_promo.yml"
INDEX_FILE = WORKSPACE / "index.html"


def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(MEMORY, "a", encoding="utf-8") as f:
        f.write(f"[{ts}] {msg}\n")
    print(f"[{ts}] {msg}")


def parse_yaml_simple(path: Path):
    """Very small YAML parser for the specific feature_promo.yml format.
    Returns list of dicts with keys name, description, link, icon.
    Handles both top-level and features:-indented list items.
    """
    data = []
    current = None
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip()
            s = line.lstrip()
            if s.startswith("- name:"):
                if current:
                    data.append(current)
                current = {"name": s.split(":", 1)[1].strip().strip("\"")}
            elif s.startswith("description:"):
                if current:
                    current["description"] = s.split(":", 1)[1].strip().strip("\"")
            elif s.startswith("link:"):
                if current:
                    current["link"] = s.split(":", 1)[1].strip().strip("\"")
            elif s.startswith("icon:"):
                if current:
                    current["icon"] = s.split(":", 1)[1].strip().strip("\"")
    if current:
        data.append(current)
    return data


def generate_html(features):
    cards = []
    for f in features:
        cards.append(
            f"""<div class=\"feature-card\">\n  <h2>{f.get('icon','')} {f.get('name','')}\n  </h2>\n  <p>{f.get('description','')}</p>\n  <a href=\"{f.get('link','')}\">Learn More</a>\n</div>"""
        )
    style = """<style>\n  body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;margin:0;padding:0;background:#f9f9f9;}\n  h1{text-align:center;margin-top:1rem;}\n  .grid{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;padding:1rem;}\n  .feature-card{border:1px solid #ddd;border-radius:8px;padding:1rem;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.1);max-width:300px;display:flex;flex-direction:column;}\n  .feature-card h2{margin-top:0;font-size:1.2rem;}\n  .feature-card p{flex-grow:1;}\n  .feature-card a{align-self:flex-start;color:#0069d9;text-decoration:none;}\n  .feature-card a:hover{text-decoration:underline;}\n</style>"""
    html = f"""<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Zion Tech Features</title>\n  {style}\n</head>\n<body>\n  <h1>Our Features</h1>\n  <div class=\"grid\">\n    {"\n    ".join(cards)}\n  </div>\n</body>\n</html>"""
    return html


def main():
    log("=== Feature Promotion Agent Started ===")
    try:
        features = parse_yaml_simple(FEATURES_FILE)
        if not features:
            log("No features found – aborting")
            return
        html = generate_html(features)
        with open(INDEX_FILE, "w", encoding="utf-8") as f:
            f.write(html)
        log("index.html generated successfully")
    except Exception as e:
        log(f"Error: {e}")
    log("=== Feature Promotion Agent Completed ===")

if __name__ == "__main__":
    main()
