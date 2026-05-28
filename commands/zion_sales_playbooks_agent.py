#!/usr/bin/env python3
"""
Zion Sales Playbooks Agent

Purpose
--------
Generate AI‑driven, step‑by‑step sales playbooks for each representative
based on recent won deals, customer context, and win‑loss patterns.
Output is stored as markdown files under `sales_playbooks/` and can be
published to Confluence/Notion or emailed via SendGrid.

Key Features
------------
1. Queries PostgreSQL (`zion`) for deals closed in the last 30 days.
2. Groups deals by `sales_rep_id` and extracts key attributes (customer,
   deal size, pain‑points, objections, win‑loss notes).
3. Sends a templated prompt to OpenAI GPT‑4 to produce a playbook:
   - Intro & positioning
   - Top 3 value props
   - Typical objections & rebuttals
   - Success story snippet
   - Action checklist
4. Writes a markdown file per rep:
   `sales_playbooks/rep_<sales_rep_id>.md`
5. Optionally creates a GitHub PR to add/refresh the playbooks repo.
6. Logs every step to `Zion_Brain_Log.md`.
7. Can be triggered on a schedule (cron) or manually via HTTP endpoint
   (future extension).

Configuration (via `.env`)
---------------------------
- `OPENAI_API_KEY`
- `POSTGRES_*` – connection details for the `zion-db` container.
- `PLAYBOOK_OUTPUT_DIR` – defaults to `~/workspace/sales_playbooks`
- `GIT_REPO_PATH` – defaults to `~/workspace` for PR creation.
- `GH_TOKEN` – optional token for PR automation.

Run
----
  python3 commands/zion_sales_playbooks_agent.py

The script exits after generating/updating all playbooks.
"""

import os, json, logging, datetime, subprocess, pathlib
from typing import List, Dict, Any

import psycopg2
import openai

# ---------------------------------------------------------------------------
# Configuration & Logging
# ---------------------------------------------------------------------------
WORKDIR = pathlib.Path(os.environ.get("ZION_ROOT", str(pathlib.Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
LOG_MD.parent.mkdir(parents=True, exist_ok=True)

# Simple logger – append to Zion_Brain_Log.md
def log(msg: str) -> None:
    ts = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] SalesPlaybooks: {msg}\n")

# Load environment variables
from dotenv import load_dotenv
load_dotenv(WORKDIR / ".env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB   = os.getenv("POSTGRES_DB", "zion")
POSTGRES_USER = os.getenv("POSTGRES_USER", "zion_user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "zion_secret")

PLAYBOOK_OUTPUT_DIR = pathlib.Path(os.getenv("PLAYBOOK_OUTPUT_DIR",
                                            str(WORKDIR / "sales_playbooks")))
GIT_REPO_PATH = pathlib.Path(os.getenv("GIT_REPO_PATH", str(WORKDIR)))
GH_TOKEN = os.getenv("GH_TOKEN")   # optional – for PR automation

# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------
def get_db_connection():
    return psycopg2.connect(
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
        dbname=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
    )

def fetch_recent_won_deals(days: int = 30) -> List[Dict[str, Any]]:
    """Return a list of recent won deals (closed_at >= now() - interval)."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT
            d.deal_id,
            d.customer_name,
            d.amount,
            d.closed_at,
            d.sales_rep_id,
            d.notes,
            d.win_loss_notes
        FROM deals d
        WHERE d.status = 'won'
          AND d.closed_at >= NOW() - INTERVAL '{days} days';
        """.format(days=days)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "deal_id": r[0],
            "customer_name": r[1],
            "amount": float(r[2]),
            "closed_at": r[3].isoformat(),
            "sales_rep_id": r[4],
            "notes": r[5],
            "win_loss_notes": r[6],
        }
        for r in rows
    ]

# ---------------------------------------------------------------------------
# Playbook generation
# ---------------------------------------------------------------------------
def generate_playbook_md(
    deals: List[Dict[str, Any]], sales_rep_id: int
) -> str:
    """Prompt GPT‑4 to turn a list of deals into a markdown playbook."""
    # Build a quick summary of deals
    deal_summaries = "\n".join(
        f"- **Deal {d['deal_id']}** – ${d['amount']:,.0f} with {d['customer_name']}"
        f"{' – notes: ' + d['notes'] if d.get('notes') else ''}"
        for d in deals
    )

    prompt = f"""
You are a senior sales strategist for Zion Tech Group. Create a concise, actionable
sales playbook for Representative ID {sales_rep_id}. Use the following recent won deals
as the basis for the playbook.

--- Recent Won Deals ---
{deal_summaries}

From these deals, generate a markdown playbook that includes:

1. **Brief Intro** – who the rep is and their market focus.
2. **Top 3 Value Propositions** that resonated in these deals.
3. **Typical Objections** + concise rebuttals.
4. **Success Story Snippet** (max 2 sentences) that can be reused.
5. **Action Checklist** – 5 concrete steps the rep can follow for the next
   prospecting cycle (e.g., outreach cadence, demo focus, pricing angle).
6. **Key Metrics** – average deal size, sales‑cycle length, win‑rate.

Keep the playbook under 800 words, use markdown headings (`##`), bullet points,
and bold for emphasis. Do not include extra commentary.
"""

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=800,
        )
        playbook_md = resp.choices[0].message.content.strip()
        log(f"Generated playbook for rep {sales_rep_id} – {len(playbook_md)} chars")
        return playbook_md
    except Exception as e:
        log(f"GPT‑4 playbook generation failed for rep {sales_rep_id}: {e}")
        raise

# ---------------------------------------------------------------------------
# File I/O & PR automation
# ---------------------------------------------------------------------------
def write_playbook_to_disk(playbook_md: str, sales_rep_id: int) -> pathlib.Path:
    """Write the markdown playbook to `PLAYBOOK_OUTPUT_DIR/sales_rep_<id>.md`."""
    PLAYBOOK_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PLAYBOOK_OUTPUT_DIR / f"sales_rep_{sales_rep_id}.md"
    out_path.write_text(playbook_md, encoding="utf-8")
    log(f"Wrote playbook to {out_path}")
    return out_path

def create_or_update_pr(file_path: pathlib.Path, playbook_md: str):
    """If .git exists and GH token is set, stage, commit, and open a PR."""
    if not (GIT_REPO_PATH / ".git").exists():
        log("Git repo not found – skipping PR creation.")
        return
    try:
        # Configure git user if not set
        subprocess.run(
            ["git", "config", "--global", "user.name", "Zion Bot"],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        subprocess.run(
            ["git", "config", "--global", "user.email", "zeb@ziantech.com"],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        # Stage changes
        subprocess.run(
            ["git", "add", str(file_path)], cwd=str(GIT_REPO_PATH), check=True
        )
        # Commit with auto‑message
        commit_msg = (
            f"feat: update sales playbook for rep {file_path.stem}"
        )
        subprocess.run(
            ["git", "commit", "-m", commit_msg],
            cwd=str(GIT_REPO_PATH),
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        # Create PR via GitHub CLI (requires `gh` installed and authenticated)
        if GH_TOKEN:
            subprocess.run(
                [
                    "gh",
                    "pr",
                    "create",
                    "--title",
                    f"Update Playbook for Rep {file_path.stem}",
                    "--body",
                    "Automated playbook update from Zion Sales Playbooks Agent.",
                    "--base",
                    "main",
                ],
                cwd=str(GIT_REPO_PATH),
                check=True,
            )
            log("PR created for playbook.")
        else:
            log("GH token not set – PR not created.")
    except subprocess.CalledProcessError as e:
        log(f"Git/GitHub PR operation failed: {e}")

# ---------------------------------------------------------------------------
# Main orchestration
# ---------------------------------------------------------------------------
def main():
    log("=== Sales Playbooks Agent started ===")
    try:
        deals = fetch_recent_won_deals(days=30)
        if not deals:
            log("No recent won deals found – exiting.")
            return

        # Group deals by sales_rep_id
        deals_by_rep: Dict[int, List[Dict[str, Any]]] = {}
        for d in deals:
            rep_id = int(d["sales_rep_id"])
            deals_by_rep.setdefault(rep_id, []).append(d)

        for rep_id, rep_deals in deals_by_rep.items():
            log(f"Generating playbook for sales_rep_id={rep_id}")
            playbook_md = generate_playbook_md(rep_deals, rep_id)
            out_path = write_playbook_to_disk(playbook_md, rep_id)
            create_or_update_pr(out_path, playbook_md)

        log("=== Sales Playbooks Agent completed ===")
    except Exception as exc:
        log(f"Unhandled exception in SalesPlaybooksAgent: {exc}")

if __name__ == "__main__":
    main()