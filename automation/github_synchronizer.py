#!/usr/bin/env python3
"""
GitHub Synchronizer - Cross-repo issue/PR labeling, autocomplete, and conflict resolution
"""

import os
import json
import subprocess
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple

class GitHubSynchronizer:
    """Handles synchronization with GitHub repositories"""
    
    def __init__(self, repo_owner: str = "Zion-Holdings", repo_name: str = "zion"):
        self.repo_owner = repo_owner
        self.repo_name = repo_name
        self.config_path = "automation/config/github_sync.json"
        self.config = self.load_config()
        self.labeling_rules = self.load_labeling_rules()
        
    def load_config(self) -> Dict:
        """Load synchronization configuration"""
        if os.path.exists(self.config_path):
            with open(self.config_path, 'r') as f:
                return json.load(f)
        return {
            "repos": [f"{self.repo_owner}/{self.repo_name}"],
            "sync_interval": 3600,
            "last_sync": None,
            "auto_merge": True,
            "label_rules_enabled": True
        }
    
    def save_config(self):
        """Save synchronization configuration"""
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def load_labeling_rules(self) -> List[Dict]:
        """Load automated labeling rules"""
        return [
            {
                "name": "bug",
                "patterns": ["fix", "bug", "error", "issue", "crash", "broken"],
                "color": "d73a4a",
                "description": "Something isn't working"
            },
            {
                "name": "enhancement",
                "patterns": ["feature", "add", "new", "implement", "create"],
                "color": "a2eeef",
                "description": "New feature or improvement"
            },
            {
                "name": "cursor",
                "patterns": ["cursor/"],
                "color": "7057ff",
                "description": "Cursor-generated branch"
            },
            {
                "name": "automation",
                "patterns": ["automation", "auto", "pm2", "script"],
                "color": "008672",
                "description": "Automation related"
            },
            {
                "name": "github-actions",
                "patterns": ["github-actions", "ci", "workflow"],
                "color": "f9d0c4",
                "description": "GitHub Actions related"
            },
            {
                "name": "merge-ready",
                "patterns": ["fix-errors-and-merge", "merge-to-main"],
                "color": "0e8a16",
                "description": "Ready to be merged to main"
            }
        ]
    
    def run_gh_command(self, args: List[str]) -> Tuple[bool, str]:
        """Run GitHub CLI command"""
        try:
            result = subprocess.run(
                ["gh"] + args,
                capture_output=True,
                text=True,
                check=True
            )
            return True, result.stdout.strip()
        except subprocess.CalledProcessError as e:
            return False, e.stderr.strip()
    
    def get_open_prs(self) -> List[Dict]:
        """Get all open pull requests"""
        success, output = self.run_gh_command([
            "pr", "list",
            "--repo", f"{self.repo_owner}/{self.repo_name}",
            "--json", "number,title,headRefName,headRepositoryOwner,labels,state"
        ])
        if success:
            return json.loads(output)
        return []
    
    def get_open_issues(self) -> List[Dict]:
        """Get all open issues"""
        success, output = self.run_gh_command([
            "issue", "list",
            "--repo", f"{self.repo_owner}/{self.repo_name}",
            "--json", "number,title,labels,state"
        ])
        if success:
            return json.loads(output)
        return []
    
    def apply_labeling_rules(self, title: str, body: str = "") -> List[str]:
        """Apply automated labeling rules to determine labels"""
        text = f"{title} {body}".lower()
        labels = []
        
        for rule in self.labeling_rules:
            for pattern in rule["patterns"]:
                if pattern.lower() in text:
                    if rule["name"] not in labels:
                        labels.append(rule["name"])
                    break
        
        return labels
    
    def ensure_labels_exist(self):
        """Ensure all labeling rule labels exist in the repo"""
        for rule in self.labeling_rules:
            success, _ = self.run_gh_command([
                "label", "create",
                rule["name"],
                "--repo", f"{self.repo_owner}/{self.repo_name}",
                "--color", rule["color"],
                "--description", rule["description"]
            ])
            if not success:
                # Label might already exist, try to update it
                self.run_gh_command([
                    "label", "edit",
                    rule["name"],
                    "--repo", f"{self.repo_owner}/{self.repo_name}",
                    "--color", rule["color"],
                    "--description", rule["description"]
                ])
    
    def label_pr(self, pr_number: int, labels: List[str]):
        """Add labels to a PR"""
        for label in labels:
            self.run_gh_command([
                "pr", "edit",
                str(pr_number),
                "--repo", f"{self.repo_owner}/{self.repo_name}",
                "--add-label", label
            ])
    
    def label_issue(self, issue_number: int, labels: List[str]):
        """Add labels to an issue"""
        for label in labels:
            self.run_gh_command([
                "issue", "edit",
                str(issue_number),
                "--repo", f"{self.repo_owner}/{self.repo_name}",
                "--add-label", label
            ])
    
    def sync_labels(self):
        """Synchronize labels across PRs and issues"""
        print("🔄 Syncing labels...")
        
        # Ensure labels exist
        self.ensure_labels_exist()
        
        # Process PRs
        prs = self.get_open_prs()
        for pr in prs:
            existing_labels = [label["name"] for label in pr.get("labels", [])]
            suggested_labels = self.apply_labeling_rules(pr["title"])
            
            labels_to_add = [l for l in suggested_labels if l not in existing_labels]
            if labels_to_add:
                print(f"  📌 PR #{pr['number']}: Adding labels {labels_to_add}")
                self.label_pr(pr["number"], labels_to_add)
        
        # Process Issues
        issues = self.get_open_issues()
        for issue in issues:
            existing_labels = [label["name"] for label in issue.get("labels", [])]
            suggested_labels = self.apply_labeling_rules(issue["title"])
            
            labels_to_add = [l for l in suggested_labels if l not in existing_labels]
            if labels_to_add:
                print(f"  📌 Issue #{issue['number']}: Adding labels {labels_to_add}")
                self.label_issue(issue["number"], labels_to_add)
        
        print("✅ Label sync complete")
    
    def check_conflicts(self, pr_number: int) -> bool:
        """Check if a PR has merge conflicts"""
        success, output = self.run_gh_command([
            "pr", "view",
            str(pr_number),
            "--repo", f"{self.repo_owner}/{self.repo_name}",
            "--json", "mergeable,mergeStateStatus"
        ])
        if success:
            data = json.loads(output)
            return data.get("mergeable") == False or data.get("mergeStateStatus") == "DIRTY"
        return False
    
    def resolve_conflicts(self, pr_number: int) -> bool:
        """Attempt to resolve conflicts (placeholder for auto-resolution logic)"""
        print(f"  ⚠️  PR #{pr_number} has conflicts - manual resolution required")
        return False
    
    def auto_merge_prs(self):
        """Auto-merge PRs that are ready"""
        print("🔄 Checking PRs for auto-merge...")
        
        prs = self.get_open_prs()
        for pr in prs:
            # Check if PR has "merge-ready" label
            labels = [label["name"] for label in pr.get("labels", [])]
            
            if "merge-ready" in labels or "cursor" in labels:
                if self.check_conflicts(pr["number"]):
                    self.resolve_conflicts(pr["number"])
                else:
                    print(f"  ✅ Auto-merging PR #{pr['number']}: {pr['title']}")
                    self.run_gh_command([
                        "pr", "merge",
                        str(pr["number"]),
                        "--repo", f"{self.repo_owner}/{self.repo_name}",
                        "--merge",
                        "--auto"
                    ])
        
        print("✅ Auto-merge check complete")
    
    def get_branch_autocomplete(self, partial: str) -> List[str]:
        """Get branch name autocomplete suggestions"""
        success, output = self.run_gh_command([
            "api",
            f"repos/{self.repo_owner}/{self.repo_name}/git/refs/heads",
            "--jq", ".[].ref | split(\"/\") | .[2:] | join(\"/\")"
        ])
        if success:
            branches = output.split("\n")
            return [b for b in branches if partial.lower() in b.lower()]
        return []
    
    def get_label_autocomplete(self, partial: str) -> List[str]:
        """Get label name autocomplete suggestions"""
        return [rule["name"] for rule in self.labeling_rules if partial.lower() in rule["name"].lower()]
    
    def setup_webhook(self, webhook_url: str):
        """Setup webhook for PR/issue events"""
        print(f"🔗 Setting up webhook: {webhook_url}")
        
        success, _ = self.run_gh_command([
            "api",
            f"repos/{self.repo_owner}/{self.repo_name}/hooks",
            "-X", "POST",
            "-f", f"name=web",
            "-f", f"active=true",
            "-f", f"events[]=pull_request",
            "-f", f"events[]=issues",
            "-f", f"events[]=label",
            "-f", f"config[url]={webhook_url}",
            "-f", f"config[content_type]=json"
        ])
        
        if success:
            print("✅ Webhook configured successfully")
        else:
            print("❌ Failed to configure webhook")
    
    def sync_all(self):
        """Run full synchronization"""
        print(f"🚀 Starting GitHub Sync for {self.repo_owner}/{self.repo_name}")
        print(f"⏰ {datetime.now().isoformat()}")
        
        # Sync labels
        if self.config.get("label_rules_enabled", True):
            self.sync_labels()
        
        # Auto-merge if enabled
        if self.config.get("auto_merge", True):
            self.auto_merge_prs()
        
        # Update last sync time
        self.config["last_sync"] = datetime.now().isoformat()
        self.save_config()
        
        print("✅ Sync complete\n")

def main():
    """Main entry point"""
    synchronizer = GitHubSynchronizer()
    
    # Run full sync
    synchronizer.sync_all()
    
    # Example: Show autocomplete suggestions
    print("Branch autocomplete for 'cursor':")
    branches = synchronizer.get_branch_autocomplete("cursor")
    for branch in branches[:5]:
        print(f"  - {branch}")
    
    print("\nLabel autocomplete for 'bug':")
    labels = synchronizer.get_label_autocomplete("bug")
    for label in labels:
        print(f"  - {label}")

if __name__ == "__main__":
    main()
