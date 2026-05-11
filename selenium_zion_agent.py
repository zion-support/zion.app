#!/usr/bin/env python3
"""Definitive browser automation fallback (no OpenClaw extension/CDP required).

Actions:
  - screenshot: open Zion site and save timestamped screenshot
  - smoke: open site, grab title + basic DOM stats

Outputs:
  - logs/screenshots/<ts>.png
  - logs/runs/<ts>.json
  - append summary line to Zion_Brain_Log.md
"""

from __future__ import annotations

import argparse
import json
import os
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
RUN_DIR = WORKDIR / "logs" / "runs"
SHOT_DIR = WORKDIR / "logs" / "screenshots"

DEFAULT_URL = "https://ziontechgroup.com"


def md_log(line: str) -> None:
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"\n- [{ts}] {line}\n")


def make_driver(headless: bool = True) -> webdriver.Chrome:
    opts = Options()
    if headless:
        # Chrome 109+ "new" headless is more stable.
        opts.add_argument("--headless=new")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--window-size=1920,1080")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--lang=en-US")
    return webdriver.Chrome(options=opts)  # Selenium Manager resolves chromedriver.


def run(action: str, url: str, headless: bool) -> dict:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    SHOT_DIR.mkdir(parents=True, exist_ok=True)

    started = time.time()
    ts = time.strftime("%Y%m%d-%H%M%S")

    out: dict = {
        "action": action,
        "url": url,
        "headless": headless,
        "ts": ts,
        "ok": False,
    }

    driver = None
    try:
        driver = make_driver(headless=headless)
        driver.get(url)
        time.sleep(3)

        out["title"] = driver.title
        out["current_url"] = driver.current_url

        if action in ("screenshot", "smoke"):
            shot_path = SHOT_DIR / f"{ts}.png"
            driver.save_screenshot(str(shot_path))
            out["screenshot"] = str(shot_path)

        if action == "smoke":
            html = driver.page_source or ""
            out["html_len"] = len(html)
            out["has_form"] = ("<form" in html.lower())

        out["ok"] = True
        return out
    except Exception as e:
        out["error"] = repr(e)
        return out
    finally:
        out["duration_s"] = round(time.time() - started, 3)
        if driver is not None:
            try:
                driver.quit()
            except Exception:
                pass

        run_path = RUN_DIR / f"{ts}.json"
        run_path.write_text(json.dumps(out, indent=2), encoding="utf-8")

        if out.get("ok"):
            md_log(f"Selenium agent OK: action={action} url={url} title={out.get('title')} screenshot={out.get('screenshot')} duration_s={out.get('duration_s')}")
        else:
            md_log(f"Selenium agent FAIL: action={action} url={url} error={out.get('error')} duration_s={out.get('duration_s')}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--action", choices=["screenshot", "smoke"], default="smoke")
    ap.add_argument("--url", default=DEFAULT_URL)
    ap.add_argument("--headless", action="store_true", default=True)
    ap.add_argument("--headed", action="store_true", default=False)
    args = ap.parse_args()

    headless = args.headless and not args.headed
    result = run(action=args.action, url=args.url, headless=headless)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
