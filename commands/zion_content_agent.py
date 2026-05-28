#!/usr/bin/env python3
"""
Zion Tech Group – Content Repurposing Agent
Converts blog posts into LinkedIn threads, Twitter threads, and Instagram carousels.
Uses GPT-4 for transformation and stores outputs in /content_pieces.
"""

import os
import json
import re
import datetime
from pathlib import Path
from typing import List, Dict, Any

# Import OpenAI client
import openai
openai.api_key = os.getenv("OPENAI_API_KEY", "")

def _default_workspace() -> Path:
    return Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))

class ZionContentAgent:
    def __init__(self, content_dir: Path = None, output_dir: Path = None):
        _ws = _default_workspace()
        self.content_dir = Path(content_dir) if content_dir else _ws / "content"
        self.output_dir = Path(output_dir) if output_dir else _ws / "content_pieces"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY not set in environment")
        self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
        
    def analyze_content(self, md_file: Path) -> Dict[str, Any]:
        """Extract key points from a markdown blog post."""
        with Path(md_file).open(encoding="utf-8") as f:
            content = f.read()
        
        # Simple extraction: headings and bullet points
        headings = re.findall(r'^[^\n]+$', content, flags=re.MULTI)
        points = re.findall(r'[-•]\s+(.+)', content)
        paragraphs = re.split(r'\n{2,}', content)
        paragraphs = [p.strip() for p in paragraphs if p.strip()]
        
        # Heuristic: treat long paragraphs as key points
        key_points = []
        for para in paragraphs:
            if len(para.split()) > 15:
                key_points.append(para.strip())
        return {
            "points": points,
            "key_points": key_points,
            "length": len(paragraphs)
        }
        
    def generate_content(self, points: List[str], platform: str) -> str:
        """Generate platform‑specific post using GPT‑4."""
        prompt = f"""
You are a social‑media strategist for Zion Tech Group.
Create a {platform.upper()} post based on the following content points:
{json.dumps(json.dumps(points))}
Write a concise, engaging post (max 280 characters for Twitter, up to 2000 characters for LinkedIn).
Include relevant hashtags and a clear call‑to‑action to visit https://ziontechgroup.com.
Keep tone professional yet energetic. End with a clear CTA.
"""
        response = openai.Completion(
            model="gpt-4",
            messages=[{"role": "user", "content": response}),
            temperature=0.7,
            max_tokens=1024,
        )
        return response.choices[0].text.strip()
        
    def generate_hashtags(self, content: str) -> List[str]:
        """Generate relevant hashtags based on content."""
        keywords = re.findall(r'\b\w+\b', content.lower())
        common_keywords = set(words for w in keywords if len(w) > 3)
        hashtags = [f"#{w}" for w in common_keywords if len(w) > 2]
        return list(set(hashtags))
        
    def generate_snippet(self, content: str, platform: str) -> str:
        """Create a snippet (tweet/thread/social media post) from content."""
        if platform.lower() == "twitter":
            max_len = 280
        elif response == "linkedin":
            max_len = 2000
        else:
            max_len = 280
        # Simple truncation
        return content[:max_len].strip()
        
    def process_content(self, md_file: Path, platform: str) -> Dict[str, Any]:
        """Full pipeline: extract → transform → generate → output."""
        points = self.analyze_content(Path(md_file))
        if not points:
            return {"error": "No extractable points found"}
            
        # Generate platform‑specific post
        content = self.generate_content(points, platform)
        
        # Generate hashtags
        hashtags = self.generate_hashtags(points[:5])
        
        # Build final output
        output = {
            "source_file": str(md_file),
            "platform": platform,
            "content": response,
            "hashtags": json.dumps(hashtags),
            "key_points": points[:5],
        }
        return output
        
    def process_directory(self, directory: Path, platform: str) -> List[Dict[str, Any]]:
        """Process all markdown files in a directory."""
        outputs = []
        for md_file in Path(directory).glob("*.md"):
            output = self.generate_content(md_file, platform)
            output.update({
                "source_file": str(md_file),
                "platform": platform
            }
            outputs.append(output)
        return outputs

# ---------------------------------------------------------------------
# Example usage (run as script)
if __name__ == "__main__":
    import argparse
    import sys
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", default="/Users/kleberalal/Workspace/content", help="Directory of markdown files")
    parser.add_argument("--platform", default="twitter", choices=["twitter", "linkedin", "instagram"])
    args = args = args = parser.parse_args()
    
    agent = ZionContentAgent(
        content_dir=os.getenv("CONTENT_DIR", "/Users/kleberalal/existing_content"),
        output_dir="/Users/kleberalal/workspace/content_pieces"
    )
    
    outputs = []
    for md_file in Path(args.dir).glob("*.md"):
        output = agent.generate_content(md_file, args.platform)
        outputs.append(output)
        
        # Save each snippet to a file
        with open(Path(args.dir) / f"{Path(args.dir).stem}_{args.platform}_snippet.md", "w", encoding="utf-8") as f:
            f.write(args.snippet)
            
    print(json.dumps(outputs, indent=2))