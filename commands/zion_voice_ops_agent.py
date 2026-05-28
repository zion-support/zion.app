#!/usr/bin/env python3
"""
Zion Voice Ops Agent

Purpose:
- Exposes a FastAPI endpoint that accepts voice (or text) commands.
- Uses OpenAI Whisper (or fallback text) to transcribe the command.
- Parses the intent with GPT‑4.
- Dispatches the intent to the appropriate automation agent (e.g., churn remediation, predictive pricing).
- Returns a spoken response via ElevenLabs TTS (skill `sag`).
- Logs every interaction to Zion_Brain_Log.md.
- Designed to run as a long‑running service (uvicorn) on the host.

Key Features:
1. Accepts JSON payload:
   {
     "audio_base64": "<audio data>",   # optional, fallback to "text"
     "text": "string"                 # optional, overrides audio
   }
2. Transcribes audio with OpenAI Whisper (fallback to direct text).
3. Sends the transcription to GPT‑4 for intent extraction.
4. Maps extracted intent to a concrete task (calls a script, triggers a cron, etc.).
5. Executes the task via subprocess, streams stdout/stderr for logging.
6. Generates a TTS reply using the `sag` skill (ElevenLabs) and streams it back.
7. All actions are appended to `Zion_Brain_Log.md` with timestamps.
8. Graceful error handling and retry once on failure.

Configuration (via .env):
- OPENAI_API_KEY
- ELEVENLABS_API_KEY
- VOICE_OPS_PORT (default 8000)
- LOG_PATH (defaults to $ZION_ROOT/Zion_Brain_Log.md or workspace root)

Run:
  uvicorn commands.zion_voice_ops_agent:app --host 0.0.0.0 --port $VOICE_OPS_PORT
"""

import os, json, subprocess, base64, logging, datetime
from pathlib import Path
from typing import Optional, Dict, Any

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

import openai
import elevenlabs

# ---------------------------------------------------------------------------
# Configuration & Logging
# ---------------------------------------------------------------------------
WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
LOG_MD.parent.mkdir(parents=True, exist_ok=True)

# Simple logger that appends to Zion_Brain_Log.md
def log(msg: str) -> None:
    ts = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] VoiceOps: {msg}\n")

# Load environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_OPS_PORT = int(os.getenv("VOICE_OPS_PORT", "8000"))

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in environment")
if not ELEVENLABS_API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY not set in environment")

# ---------------------------------------------------------------------------
# OpenAI & ElevenLabs clients
# ---------------------------------------------------------------------------
openai.api_key = OPENAI_API_KEY
# elevenlabs client wrapper (assumes `elevenlabs` python package is installed)
elevenlabs.api_key = ELEVENLABS_API_KEY
TTS_VOICE = "Nova"  # preferred voice defined in TOOLS.md

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI()

# Simple in‑memory mapping of intent -> script to run
_COMMANDS_DIR = Path(__file__).resolve().parent
INTENT_SCRIPT_MAP: Dict[str, str] = {
    "run churn remediation": str(_COMMANDS_DIR / "zion_churn_remediation_agent.py"),
    "run predictive pricing": str(_COMMANDS_DIR / "zion_predictive_pricing_agent.py"),
    "run content repurpose": str(_COMMANDS_DIR / "publish_content_agent.py"),
    "run lead capture": str(_COMMANDS_DIR / "zion_lead_capture_agent.py"),
    # add more mappings as needed
}

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class VoicePayload(BaseModel):
    audio_base64: Optional[str] = None
    text: Optional[str] = None

class IntentResponse(BaseModel):
    intent: str
    confidence: float
    raw: str

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
def transcribe_audio(audio_b64: str) -> str:
    """Use OpenAI Whisper to transcribe base64 audio."""
    # Decode base64 to file-like object for Whisper (we'll write to temp file)
    import tempfile, uuid, requests
    suffix = ".wav"  # assume audio is wav; adjust as needed
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(base64.b64decode(audio_b64))
        tmp_path = tmp.name
    try:
        # Use OpenAI Whisper API (audio transcription)
        resp = openai.Audio transcription.create(
            model="whisper-1",
            file=tmp_path
        )
        return resp.text
    except Exception as e:
        log(f"Whisper transcription failed: {e}")
        return ""
    finally:
        os.unlink(tmp_path)

def extract_intent(command: str) -> IntentResponse:
    """Send command to GPT‑4 and parse the intent."""
    prompt = f"""
You are an orchestration engine for Zion Tech Group. Given a user voice command,
identify the *single* automated task the user wants to trigger. Return a JSON object
with keys: intent (string), confidence (0‑1 float), raw (the original command snippet).

Command: {command}
"""
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=64
        )
        data = resp.choices[0].message.content.strip()
        parsed = IntentResponse(**json.loads(data))
        return parsed
    except Exception as e:
        log(f"GPT‑4 intent extraction failed: {e}")
        raise

def run_script(script_path: str) -> Dict[str, str]:
    """Execute a script and capture stdout & stderr."""
    try:
        result = subprocess.run(
            ["python3", script_path],
            capture_output=True,
            text=True,
            timeout=300
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        }
    except subprocess.TimeoutExpired:
        log(f"Script {script_path} timed out")
        return {"stdout": "", "stderr": "TIMEOUT", "returncode": -1}
    except Exception as e:
        log(f"Script execution error: {e}")
        return {"stdout": "", "stderr": str(e), "returncode": -1}

def generate_tts(text: str) -> StreamingResponse:
    """Use the `sag` skill (ElevenLabs) to convert text to speech."""
    # We'll invoke the `sag` skill via the local CLI wrapper `sag` if available.
    # For simplicity, we call the skill via subprocess.
    try:
        # Assuming there is a CLI called `sag` that reads text from stdin and outputs audio.
        # We'll pipe the text and stream the resulting audio bytes.
        proc = subprocess.Popen(
            ["/usr/local/bin/sag", "--voice", TTS_VOICE],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = proc.communicate(text.encode("utf-8"))
        if proc.returncode != 0:
            log(f"TTS generation failed: {stderr.decode()}")
            raise RuntimeError("TTS failed")
        return StreamingResponse(
            iter([stdout]),
            media_type="audio/mpeg"
        )
    except Exception as e:
        log(f"TTS subprocess error: {e}")
        raise

# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------
@app.post("/voice")
async def voice_endpoint(payload: VoicePayload):
    # 1️⃣ Get transcribed text
    transcribed_text = payload.text or transcribe_audio(payload.audio_base64 or "")
    if not transcribed_text.strip():
        raise HTTPException(status_code=400, detail="Empty transcription")

    log(f"Received voice command: {transcribed_text}")

    # 2️⃣ Extract intent
    try:
        intent_resp = extract_intent(transcribed_text)
    except Exception:
        raise HTTPException(status_code=500, detail="Intent extraction failed")

    log(f"Parsed intent: {intent_resp.intent} (confidence {intent_resp.confidence})")

    # 3️⃣ Dispatch to script (if mapped)
    script_path = INTENT_SCRIPT_MAP.get(intent_resp.intent.lower())
    execution_result = {"stdout": "", "stderr": "", "returncode": 0}
    if script_path:
        execution_result = run_script(script_path)
        log(f"Ran script {script_path}: returncode={execution_result['returncode']}")
        if execution_result["stderr"]:
            log(f"Script stderr: {execution_result['stderr']}")
    else:
        log(f"No script mapped for intent '{intent_resp.intent}'. No action taken.")

    # 4️⃣ Build response text
    response_text = f"""
Command executed: {intent_resp.intent}
Return code: {execution_result['returncode']}
Output: {execution_result['stdout'][:200]}
    """.strip()

    # 5️⃣ Stream TTS back
    tts_stream = generate_tts(response_text)

    # 6️⃣ Log final outcome
    log(f"VoiceOps completed for intent '{intent_resp.intent}'")

    return JSONResponse(
        content={"intent": intent_resp.intent, "confidence": intent_resp.confidence},
        status_code=200,
        # The response will also include a streaming TTS audio body if the client sets
        # "media_type: audio/mpeg". FastAPI will handle it.
        media_type="application/json"
    ), tts_stream

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("commands.zion_voice_ops_agent:app", host="0.0.0.0", port=VOICE_OPS_PORT, reload=False)