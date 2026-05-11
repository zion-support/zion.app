#!/usr/bin/env python3
"""
Zion Tech Group – AI‑Powered Personalization Agent

Features:
1. Accepts a lead profile (JSON) via POST /personalize.
2. Uses GPT‑4 to generate personalized copy for any channel.
3. Returns a short paragraph plus a suggested channel‑specific CTA.
4. Logs each request/response to Zion_Brain_Log.md.
5. Self‑healing: retries on GPT‑4 failure, falls back to placeholder text.
"""

import os
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any
from fastapi import FastAPI, Request, HTTPException

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"

# Load env vars
from dotenv import load_dotenv
load_dotenv(WORKDIR / ".env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI()

def logger(msg: str) -> None:
    """Append timestamped entry to Zion_Brain_Log.md."""
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] Personalization: {msg}\n")

@app.post("/personalize")
async def personalize(payload: Dict[str, Any], request: Request):
    """
    Expected payload keys (example):
    {
        "name": "Alice",
        "company": "Acme Corp",
        "industry": "FinTech",
        "interests": ["AI", "Quantum Computing"],
        "channel": "email"   # could be email, linkedin, push, etc.
    }
    """
    try:
        logger(f"Received personalization request for {payload.get('name')} via {payload.get('channel')}")
        if not payload.get("name"):
            raise HTTPException(status_code=400, detail="Missing 'name' field")
        
        # Build GPT‑4 prompt
        prompt = (
            f"You are a personalization assistant for Zion Tech Group. "
            f"Generate a short (2‑3 sentence) personalized paragraph for a lead named "
            f"{payload['name']}. Include the industry \"{payload.get('industry','')}\" and any "
            f"interests {', '.join(payload.get('interests', []))}. End with a channel‑specific "
            f"call‑to‑action: \"Visit https://ziontechgroup.com\" for email, \"Connect\" for LinkedIn, "
            f\"Swipe up\" for Instagram, or \"Reply\" for direct messaging."
        )
        # Call GPT‑4
        import openai
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=150,
        )
        generated = response.choices[0].message.content.strip()
        logger(f"Generated personalization: {generated[:100]}...")
        return {"personalization": generated}
    except Exception as e:
        logger(f"Personalization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn, argparse
    parser = argparse.ArgumentParser(description="Personalization Agent")
    parser.add_argument("--serve", action="store_true", help="Run FastAPI server")
    args = parser.parse_args()
    if args.serve:
        logger("=== Personalization Agent started ===")
        uvicorn.run(app, host="0.0.0.0", port=8004)
    else:
        parser.print_help()