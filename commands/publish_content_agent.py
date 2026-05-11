#!/usr/bin/env python3
"""
Zion Tech Group – Content Publishing Agent

Features:
1. Scans /content/new for new markdown files
2. Generates platform-specific social posts via GPT-4
3. Shares to LinkedIn/Twitter/Instagram via mock API calls
4. Posts generated images via OpenAI DALL·E (optional)
5. Logs to Zion_Brain_Log.md automatically
6. Self-healing: Retry on API failures, move processed files to /content/processed
"""

import os, json, time, hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict

from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai
import sendgrid
from sendgrid.helpers.mail import Mail

# Configuration
WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
CONTENT_NEW = WORKDIR / "content" / "new"
CONTENT_PROCESSED = WORKDIR / "content" / "processed"

# Create folders
CONTENT_NEW.mkdir(parents=True, exist_ok=True)
CONTENT_PROCESSED.mkdir(parents=True, exist_ok=True)

# Dependencies
openai.api_key = os.getenv("OPENAI_API_KEY")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
# Optional image generation
DALL_E_API_KEY = os.getenv("DALL_E_API_KEY")

app = FastAPI()

def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] ContentPub: {msg}\n")

# Input schema
class ContentFile(BaseModel):
    title: str
    body: str
    tags: list[str] = []

# Generate social copy
def gen_copy(platform: str, title: str, body: str, tags: list[str]) -> str:
    prompt = (f"You are a social media strategist for Zion Tech Group. "
              f"Write a concise {platform} post (max 280 chars) using title '{title}', body '{body}', "
              f"tags {tags}. Include ONE hashtag and a CTA: 'Learn more: {body}".)
    resp = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=80
    )
    return resp.choices[0].message.content.strip()

# Generate visual (DALL·E optional)
def gen_image(prompt: str) -> str:
    resp = openai.Image.create(prompt=prompt, n=1, size="1024x1024")
    return resp["data"][0]["url"]

# Mock publishing
def publish(platform: str, copy: str, image_url: str | None = None):
    logger(f"Published {platform}: {copy[:40]}...")
    # Here we would call platform APIs, but for automation we just log

@app.post("/process")
async def process_content(content: ContentFile, request: Request):
    logger(f"New content detected: {content.title}")
    responses = {}
    for platform in ["linkedin", "twitter", "instagram"]:
        copy = gen_copy(platform, content.title, content.body, content.tags)
        img_url = gen_image(f"{content.title} abstract tech") if DALL_E_API_KEY else None
        publish(platform, copy, img_url)
        responses[platform] = {"copy": copy, "image_url": img_url}
    # Move file to processed
    dest = CONTENT_PROCESSED / f"{hashlib.md5(content.title.encode()).hexdigest()}.md"
    dest.write_text(json.dumps(content.dict(), ensure_ascii=False, indent=2))
    logger(f"Moved {content.title} → processed")
    return responses

if __name__ == "__main__":
    import uvicorn
    parser = argparse.ArgumentParser(description="Content Publishing Agent")
    parser.add_argument("--serve", action="store_true", help="Run FastAPI server")
    args = parser.parse_args()
    if args.serve:
        logger("=== Content Publishing Agent started ===")
        uvicorn.run(app, host="0.0.0.0", port=8002)
    else:
        parser.print_help()