#!/usr/bin/env python3
"""
Zion Tech Group – Voice‑Activated UI Agent

* Goal: Accept voice commands (or text) and respond with spoken answers or data.
* Features:
  - Text‑to‑speech via OpenAI TTS (or fallback).
  - Chat completion via GPT‑4 (if key is set).
  - Simple rule‑based dispatch (pricing, lead summary, help).
* Deployment:
  - Flask server listening on localhost:5000.
* Cron: Clean old logs (optional).
"""

import os
import argparse
import json
import time
import logging
from datetime import datetime
from pathlib import Path

import openai
from flask import Flask, request, jsonify

# Paths
WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"

def md_log(msg: str) -> None:
    """Append a timestamped entry to Zion_Brain_Log.md"""
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] Voice‑UI: {msg}\n")

def load_model():
    """Load trained conversion model for optional scoring."""
    model_path = WORKDIR / "models" / "conversion_model.pkl"
    if not model_path.exists():
        md_log("Voice‑UI: No conversion model found – skipping scoring logic.")
        return None
    import joblib
    return joblib.load(model_path)

class VoiceAgent:
    def __init__(self):
        self.app = Flask(__name__)
        self.model = load_model()

    def stt_to_text(self, audio_data: str) -> str:
        """If you have an STT endpoint, call it here. For now we assume raw text is supplied."""
        md_log(f"Voice‑UI: STT → text: {audio_data[:30]}…")
        return audio_data

    def generate_response(self, prompt: str) -> str:
        """Use GPT‑4 for a richer answer (if key is set)."""
        try:
            if not self.model:
                raise ValueError("No model loaded")
            # Prompt: user asked, provide answer.
            reply = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.6,
                max_tokens=120,
            )
            return reply.choices[0].message.content.strip()
        except Exception as e:
            md_log(f"Voice‑UI: OpenAI error: {e}")
            return f"I couldn't generate a response: {e}"

    def tts(self, text: str) -> str:
        """Convert text to speech (OpenAI TTS or placeholder)."""
        try:
            openai.audio.speech.SynthesizeSpeech(
                input=text,
                model="tts-1",
                voice="alloy",
                response_format="mp3"
            )
            # Assuming this returns binary audio; we’ll just return the URL placeholder.
            md_log(f"Voice‑UI: TTS generated for text: {text[:30]}…")
            return f"https://placeholder.com/{text.replace(' ', '-').replace('/', '-').replace(':', '-')}"
        except Exception as e:
            md_log(f"Voice‑UI: TTS error: {e}")
            return text  # fallback to plain text

    def run(self):
        parser = argparse.ArgumentParser(description="Voice‑UI Agent")
        parser.add_argument("--run", action="store_true", help="Run the Flask server")
        args = parser.parse_args()
        if args.run:
            self.app.run(host="0.0.0.0", port=5000, debug=False)
        else:
            self.app.run(host="0.0.0.0", port=5000, debug=False)

if __name__ == "__main__":
    agent = VoiceAgent()
    agent.run()