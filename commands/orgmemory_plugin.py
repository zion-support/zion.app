#!/usr/bin/env python3
"""
OpenClaw Agent Plugin: OrgMemory Tools
Adds /orgmem commands directly to the main OpenClaw Telegram agent.
This module is imported by the main agent and registers command handlers.
"""

import os, sys
from pathlib import Path

# Ensure zion.app is importable
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

def register(agent):
    """Register org_memory commands with the OpenClaw agent.
    Called from agent's plugin loading or manual import.
    """
    import subprocess

    async def handle_orgmem(update, context):
        """Telegram command: /orgmem <subcommand> [args...]"""
        text = update.message.text.strip()
        parts = text.split()
        if len(parts) < 2:
            await update.message.reply_text(
                "📚 *Org Memory Commands*\n"
                "• `/orgmem search <query>` — search emails/docs\n"
                "• `/orgmem ask <question>` — AI synthesis\n"
                "• `/orgmem summarize <thread_id>` — thread summary\n"
                "• `/orgmem digest` — yesterday's activity",
                parse_mode='Markdown'
            )
            return

        cmd = parts[1]
        args = parts[2:]

        # Build command
        agent_script = str(WORKSPACE / 'zion.app' / 'commands' / 'org_memory_agent.py')
        proc = subprocess.Popen(
            [sys.executable, agent_script, cmd] + args,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=str(WORKSPACE)
        )
        stdout, stderr = proc.communicate(timeout=30)
        if proc.returncode != 0:
            await update.message.reply_text(f"❌ Error:\n`{stderr.decode()}`", parse_mode='Markdown')
            return
        output = stdout.decode().strip() or "(No results)"
        if len(output) > 4000:
            output = output[:3900] + "\n... (truncated)"
        await update.message.reply_text(output, parse_mode='Markdown')

    # Register with agent (assuming agent has add_command or similar)
    # For OpenClaw, slash commands are auto‑routed; we may need to hook into message handling
    # This is a placeholder — actual integration depends on agent plugin architecture.
    # We'll instead use OpenClaw's exec tool in commands.cmd file.
    pass

# Alternative: Create a simple wrapper script that OpenClaw can exec directly
def make_wrapper():
    """Generate a small script that OpenClaw can call for /orgmem."""
    wrapper = WORKSPACE / 'zion.app' / 'commands' / 'orgmem_wrapper.sh'
    script = f"""#!/bin/bash
# OpenClaw → Org Memory wrapper
# Called as: orgmem_wrapper.sh <command> [args...]
cd {WORKSPACE}
python3 {WORKSPACE / 'zion.app' / 'commands' / 'org_memory_agent.py'} "$@"
"""
    with open(wrapper, 'w') as f:
        f.write(script)
    os.chmod(wrapper, 0o755)
    return wrapper

# Generate wrapper on import
make_wrapper()
