#!/usr/bin/env python3
"""v24 wrapper."""
import os, sys, subprocess
HERMES_HOME = os.environ.get("HERMES_HOME", r"C:\Users\Zion\AppData\Local\hermes")
SCRIPT = os.path.join(HERMES_HOME, "scripts", "email-responder-v24.0.py")
PYTHON_EXE = os.path.join(HERMES_HOME, "hermes-agent", "venv", "Scripts", "python.exe")
if not os.path.exists(PYTHON_EXE): PYTHON_EXE = "python"
result = subprocess.run([PYTHON_EXE, SCRIPT], capture_output=True, text=True, timeout=300,
    env={**os.environ, "HERMES_HOME": HERMES_HOME})
print(result.stdout[-3000:] if result.stdout else "")
if result.stderr: print("ERR:", result.stderr[-500:])
sys.exit(result.returncode)
