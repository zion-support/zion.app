# TOOLS.md - Local Notes

### Telegram (Zion automation alerts)
- `TELEGRAM_BOT_TOKEN` - From @BotFather
- `TELEGRAM_CHAT_ID` - Chat ID for notifications
- Quiet hours: 23:00–08:00 (America/Sao_Paulo); use `[URGENTE]` prefix to bypass

### TTS
- Preferred voice: "Nova"
- Default speaker: "Kitchen HomePod"

### Heartbeat
- Check frequency: "Every 30 minutes"
- Platforms: "WhatsApp, Telegram"

### Note:
_These preferences can be updated anytime by editing this file._
<!-- BEGIN:kilo-cli -->
## Kilo CLI

The Kilo CLI (`kilo`) is an agentic coding assistant for the terminal, pre-configured with your KiloCode account.

- Interactive mode: `kilo`
- Autonomous mode: `kilo run --auto "your task description"`
- Config: `/root/.config/kilo/opencode.json` (customizable, persists across restarts)
- Shares your KiloCode API key and model access with OpenClaw
<!-- END:kilo-cli -->