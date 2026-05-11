#!/usr/bin/env python3
"""
Zion Tech Group — AI‑Generated Design System Agent

Features:
1. Watches /design_system_specs/ for a `theme.json` that defines colors, typography, spacing.
2. Uses GPT‑4 to generate a set of accessible, animated UI components (Button, Card, Input, Modal, etc.).
3. Writes each component to `frontend/src/components/design-system/`.
4. Creates a GitHub PR with the new library and updates the documentation.
5. Logs all actions to Zion_Brain_Log.md.
"""

import os, json, time, subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
SPECS_DIR = WORKDIR / "design_system_specs"
OUT_DIR = WORKDIR / "frontend" / "src" / "components" / "design-system"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Dependencies
import openai
from sendgrid.helpers.mail import Mail
import sendgrid

openai.api_key = os.getenv("OPENAI_API_KEY")

def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] DesignSystem: {msg}\n")

def load_theme() -> Dict[str, Any]:
    theme_path = SPECS_DIR / "theme.json"
    if not theme_path.exists():
        logger("Theme spec missing – aborting.")
        return None
    with theme_path.open() as f:
        return json.load(f)

def generate_component(theme: Dict[str, Any], component_name: str) -> str:
    prompt = f"""
You are a senior UI engineer for Zion Tech Group. Generate a fully accessible, animated React component using TypeScript, Tailwind CSS, and Framer Motion.

Design system theme:
- Colors: {json.dumps(theme.get('colors', {}), indent=2)}
- Typography: {json.dumps(theme.get('typography', {}), indent=2)}
- Spacing: {json.dumps(theme.get('spacing', {}), indent=2)}

Component: {component_name}
Return only the code (no markdown block), using the following template for other components (if needed): motion.button, motion.div, etc.
Include ARIA attributes, focus rings, and a dark‑mode variant using the theme.
"""
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        code = resp.choices[0].message.content.strip()
        logger(f"Generated {component_name} component.")
        return code
    except Exception as e:
        logger(f"GPT‑4 generation failed for {component_name}: {e}")
        return ""

def write_component_file(name: str, code: str) -> Path:
    file_path = OUT_DIR / f"{name}.tsx"
    file_path.write_text(code, encoding="utf-8")
    logger(f"Wrote component: {file_path}")
    return file_path

def create_design_system_index(components: list) -> None:
    """Create an index.ts that exports all components."""
    index_lines = ["// Auto‑generated design system index\n"]
    for comp in components:
        index_lines.append(f"export {{ default as {comp} }} from './{comp}.tsx';")
    (OUT_DIR / "index.ts").write_text("\n".join(index_lines), encoding="utf-8")
    logger("Design system index.ts generated.")

def commit_and_pr(component_files: list) -> None:
    """Stage, commit, and open a PR via gh."""
    try:
        subprocess.run(["git","add","-A"], cwd=WORKDIR, check=True)
        subprocess.run(["git","commit","-m","chore: AI‑generated design system components"], cwd=WORKDIR, check=True)
        branch = f"design-system-{int(time.time())}"
        subprocess.run(["git","push","-u","origin",branch], cwd=WORKDIR, check=True)
        pr_title = "AI‑generated design system components"
        pr_body = "This PR adds the following UI components:\n" + "\n".join(f"- {c}" for c in component_files)
        subprocess.run(["gh","pr","create","--title",pr_title,"--body",pr_body,"--base","main","--head",branch], cwd=WORKDIR, check=True)
        logger("PR created for design system library.")
    except subprocess.CalledProcessError as e:
        logger(f"Git/GitHub operation failed: {e}")

def main() -> None:
    logger("=== AI Design System generation started ===")
    theme = load_theme()
    if not theme:
        return
    components = ["Button", "Card", "Input", "Modal", "Spinner"]  # fixed list for now
    generated = []
    for comp in components:
        code = generate_component(theme, comp)
        if code:
            path = write_component_file(comp.lower(), code)
            generated.append(comp)
    if generated:
        create_design_system_index(generated)
        # Only create PR if GitHub CLI is installed and authenticated
        try:
            subprocess.run(["gh","auth","status"], capture_output=True, check=True)
            commit_and_pr(generated)
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger("GitHub CLI not available – skipping PR creation. Components are saved locally.")
    logger("=== AI Design System generation finished ===")

if __name__ == "__main__":
    main()