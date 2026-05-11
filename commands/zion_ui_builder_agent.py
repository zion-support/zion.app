#!/usr/bin/env python3
"""
Zion Tech Group – UI Builder Agent

Features:
1. Watch `/designs/` directory for new markdown/JSON design files.
2. Generate React component code via GPT-4 from design specs.
3. Create Pull Request with code changes.
4. Auto-merge on approval or manual approval step.
5. Deploy to staging via Vercel (or Docker) on merge.
6. Log all steps to Zion_Brain_Log.md.
"""

import os, json, time, subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
DESIGNS_DIR = WORKDIR / "designs"
PR_BRANCH_PREFIX = "zion-ui-update"
REPO_OWNER = "kleberalcatrao"
REPO_NAME = "zion-ui"

def logger(msg: str) -> None:
    """Append timestamped entry to Zion_Brain_Log.md"""
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] UIBuilder: {msg}\n")

def read_design_file(path: Path) -> Dict[str, Any]:
    """Read design file (markdown or JSON) and parse its contents."""
    try:
        data = json.loads(path.read_text()) if path.suffix == ".json" else path.read_text()
        return json.loads(data)
    except Exception as e:
        logger(f"Failed to parse design file {path}: {e}")
        return {}

def generate_react_component(design: Dict[str, Any]) -> str:
    """Generate React component code using GPT-4."""
    prompt = (f"You are a React developer for Zion Tech Group. "
              f"Create a functional component {design.get('component_name', 'MyComponent')} "
              f"with props {list(design.get('props', {}).keys())}. "
              f"Include Tailwind CSS classes and Framer Motion animations. "
              f"Return only the component code.")
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        logger(f"GPT-4 generation failed: {e}")
        return ""

def create_pull_request(title: str, body: str, base_branch: str = "main") -> str:
    """Create a GitHub PR using the GitHub CLI."""
    try:
        # Assumes GitHub CLI is installed and authenticated
        cmd = f"gh pr create --title '{title}' --body '{body}' --base {base_branch} --head {REPO_OWNER}:{BRANCH_PREFIX}_{title.replace(' ', '_')}"
        result = subprocess.run(cmd.split(), capture_output=True, text=True)
        if result.returncode != 0:
            logger(f"PR creation failed: {result.stderr}")
            return ""
        pr_number = result.stdout.strip().splitlines()[0]
        logger(f"PR created: #{pr_number}")
        return pr_number
    except Exception as e:
        logger(f"PR creation error: {e}")
        return ""

def main():
    logger("=== UI Builder Agent started ===")
    try:
        # Scan designs directory
        new_files = [f for f in DESIGNS_DIR.iterdir() if f.is_file() and f.suffix in {'.md', '.json'}]
        for path in new_files:
            logger(f"Processing design file: {path.name}")
            design_data = read_design_file(path)
            component_code = generate_react_component(design_data)
            pr_title = f"Add {path.stem} UI"
            pr_body = f"Automated UI generation from {path.name}. Component code:\n```tsx\n{component_code}\n```"
            pr_number = create_pull_request(pr_title, pr_body)
            if pr_number:
                logger(f"PR #{pr_number} created for {path.name}")
                # Move processed file to /processed_designs
                processed_dir = WORKDIR / "processed_designs"
                processed_dir.mkdir(parents=True, exist_ok=True)
                dest = processed_dir / path.name
                dest.write_text(path.read_text())
                logger(f"Moved {path.name} to processed directory.")
            else:
                logger(f"Failed to create PR for {path.name}")
        logger("=== UI Builder Agent finished ===")
    except Exception as e:
        logger(f"UI Builder failed: {e}")

if __name__ == "__main__":
    main()