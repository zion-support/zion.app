#!/usr/bin/env python3
"""
OpenClaw Command Bridge — Org Memory
Allows the main OpenClaw agent to invoke org_memory_agent.py and return results.
Place this in /root/.openclaw/workspace/zion.app/commands/
The main OpenClaw agent will discover and route /orgmem commands here.
"""

import subprocess
import sys
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
AGENT_PATH = WORKSPACE / 'zion.app' / 'commands' / 'org_memory_agent.py'

def handle(args: list[str]) -> str:
    """Called by OpenClaw agent when user types /orgmem ..."""
    if not args:
        return (
            "📚 *Org Memory Commands*\n"
            "• `/orgmem search <query>` — search emails/docs\n"
            "• `/orgmem ask <question>` — AI synthesis\n"
            "• `/orgmem summarize <thread_id>` — thread summary\n"
            "• `/orgmem digest` — yesterday's activity"
        )
    cmd = args[0]
    cmd_args = args[1:]
    # Build subprocess call
    proc = subprocess.Popen(
        [sys.executable, str(AGENT_PATH), cmd] + cmd_args,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=str(WORKSPACE)
    )
    stdout, stderr = proc.communicate(timeout=30)
    if proc.returncode != 0:
        return f"❌ Error:\n```\n{stderr.decode()}\n```"
    output = stdout.decode().strip()
    if not output:
        return "(No results)"
    return output

# For direct testing
if __name__ == '__main__':
    print(handle(sys.argv[1:]))
