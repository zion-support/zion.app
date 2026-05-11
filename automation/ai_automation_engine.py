"""
AI Automation Engine - Core orchestration system for autonomous operations
"""

import os
import json
import subprocess
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

class AIAutomationEngine:
    """
    Core automation engine that orchestrates all AI-driven operations
    """
    
    def __init__(self):
        self.config = self.load_config()
        self.running_jobs = {}
        self.last_execution = {}
    
    def load_config(self) -> Dict[str, Any]:
        """Load automation configuration"""
        config_path = "automation/config.json"
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                return json.load(f)
        return {
            "jobs": [],
            "triggers": [],
            "notifications": {
                "enabled": True,
                "channels": ["email", "slack", "telegram"]
            },
            "logging": {
                "level": "INFO",
                "path": "automation/logs/"
            }
        }
    
    def save_config(self):
        """Save automation configuration"""
        config_path = "automation/config.json"
        os.makedirs(os.path.dirname(config_path), exist_ok=True)
        with open(config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def register_job(self, job_name: str, job_function, interval_seconds: int, enabled: bool = True):
        """Register a new automation job"""
        job = {
            "name": job_name,
            "function": job_function,
            "interval": interval_seconds,
            "enabled": enabled,
            "last_run": None,
            "next_run": datetime.now() + timedelta(seconds=interval_seconds)
        }
        self.config["jobs"].append(job)
        self.save_config()
        return job
    
    def trigger_job(self, job_name: str):
        """Trigger a job immediately"""
        for job in self.config["jobs"]:
            if job["name"] == job_name:
                self.execute_job(job)
                return
    
    def execute_job(self, job: Dict):
        """Execute a registered job"""
        try:
            print(f"Executing job: {job['name']}")
            job["function"]()
            job["last_run"] = datetime.now().isoformat()
            job["next_run"] = (datetime.now() + 
                              timedelta(seconds=job["interval"])).isoformat()
            self.save_config()
            self.notify(f"Job completed: {job['name']}")
        except Exception as e:
            print(f"Job {job['name']} failed: {str(e)}")
            self.notify(f"Job failed: {job['name']} - {str(e)}", level="ERROR")
    
    def check_jobs(self):
        """Check all jobs and execute if due"""
        now = datetime.now()
        for job in self.config["jobs"]:
            if job["enabled"]:
                next_run = datetime.fromisoformat(job["next_run"])
                if now >= next_run:
                    self.execute_job(job)
    
    def notify(self, message: str, level: str = "INFO"):
        """Send notification"""
        if not self.config["notifications"]["enabled"]:
            return
        
        print(f"[{level}] {message}")
        # Add notification logic here (email, slack, telegram)
    
    def get_status(self) -> Dict:
        """Get current automation status"""
        return {
            "jobs": len(self.config["jobs"]),
            "running_jobs": len(self.running_jobs),
            "last_check": datetime.now().isoformat(),
            "config": {
                "jobs": self.config["jobs"],
                "notifications": self.config["notifications"]
            }
        }

def example_job():
    """Example automation job"""
    print("Running example job...")
    # Add your automation logic here

# Initialize and register example job
def main():
    engine = AIAutomationEngine()
    
    # Register example job if not already registered
    job_exists = any(job["name"] == "example_job" for job in engine.config["jobs"])
    if not job_exists:
        engine.register_job("example_job", example_job, interval_seconds=60)
    
    # Check and execute due jobs
    engine.check_jobs()
    
    # Print status
    status = engine.get_status()
    print(f"Automation status: {json.dumps(status, indent=2)}")

if __name__ == "__main__":
    main()