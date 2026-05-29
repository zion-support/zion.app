#!/usr/bin/env python3
"""v21 wrapper — patches SSL thread safety and runs the pipeline."""
import os, sys

HERMES_HOME = os.environ.get("HERMES_HOME", r"C:\Users\Zion\AppData\Local\hermes")
SCRIPT = os.path.join(HERMES_HOME, "scripts", "email-responder-v21.0.py")

# Patch MAX_PARALLEL_FETCH in target script if needed
import importlib.util
spec = importlib.util.spec_from_file_location("v21", SCRIPT)
mod = importlib.util.module_from_spec(spec)
sys.modules["v21"] = mod

# Set env to avoid SSL issues
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "0"
os.environ["PYTHONHASHSEED"] = "0"

# Run
exec(open(SCRIPT).read())
