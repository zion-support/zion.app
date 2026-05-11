#!/usr/bin/env bash
set -euo pipefail
cd /Users/kleberalcatrao/.openclaw/workspace
/usr/bin/python3 /Users/kleberalcatrao/.openclaw/workspace/selenium_zion_agent.py --action screenshot --url https://ziontechgroup.com >/dev/null 2>&1
