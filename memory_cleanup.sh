#!/bin/bash
# Daily memory cleanup and status check

# Rotate logs
logrotate -f /etc/logrotate.d/openclaw

# Optimize tasks
/task_optimizer optimize --daily

# Compress memory files
memory_compressor --threshold 85% --compress

# Check Telegram status
if ! pgrep -x "telegram-cli" >/dev/null; then
  telegram-cli -s /path/to/status_check.py
fi

# Report status
