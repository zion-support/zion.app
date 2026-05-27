#!/usr/bin/env python3
"""
Telegram Bot — Zion Org Memory Commands
Listens for /orgmem* commands and dispatches to org_memory_agent.py
Runs as a lightweight async polling bot.
"""

import asyncio, os, sys, subprocess
try:
    from telegram import Update, Bot
    from telegram.ext import Application, CommandHandler, ContextTypes
    TELEGRAM_AVAILABLE = True
except ImportError:
    TELEGRAM_AVAILABLE = False
    print("ERROR: python-telegram-bot not installed. Install with: pip install python-telegram-bot", file=sys.stderr)
    sys.exit(1)

async def orgmem_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /orgmem [command] [args]"""
    user_id = update.effective_user.id
    if user_id != ALLOWED_USER_ID:
        await update.message.reply_text("❌ Unauthorized")
        return

    text = update.message.text.strip()
    # Parse: /orgmem command args...
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
    args_text = ' '.join(parts[2:])

    # Dispatch to agent
    agent_path = '/root/.openclaw/workspace/zion.app/commands/org_memory_agent.py'
    proc = await asyncio.create_subprocess_exec(
        sys.executable, agent_path, cmd, *args_text.split(),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()
    if proc.returncode != 0:
        await update.message.reply_text(f"❌ Error:\n`{stderr.decode()}`", parse_mode='Markdown')
        return

    output = stdout.decode().strip()
    if not output:
        output = "(No results)"
    if len(output) > 4000:
        output = output[:3900] + "\n... (truncated)"
    await update.message.reply_text(output, parse_mode='Markdown')

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"⚠️ Error: {context.error}")

async def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("orgmem", orgmem_handler))
    app.add_error_handler(error_handler)
    print("🤖 Org Memory Telegram bot starting...")
    await app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    asyncio.run(main())
