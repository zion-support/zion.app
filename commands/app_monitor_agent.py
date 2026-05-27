#!/usr/bin/env python3
"""
Zion Tech Group App Monitor Agent
"""

import os
import json
import requests
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

load_dotenv()

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
MEMORY = WORKDIR / "MEMORY.md"

CURSOR_API_KEY = os.getenv("CURSOR_API_KEY")
APP_URL = "https://ziontechgroup.com"

class AppMonitorAgent:
    def __init__(self):
        self.cursor_headers = {
            "Authorization": f"Bearer {CURSOR_API_KEY}",
            "Content-Type": "application/json"
        }

    def log_memory(self, message: str):
        """Append a memory entry with timestamp."""
        ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        with MEMORY.open("a", encoding="utf-8") as f:
            f.write(f"- [AppMonitor] {ts} | {message}\n")

    def check_app_status(self):
        """Check app status and performance metrics"""
        try:
            response = requests.get(APP_URL, timeout=30)
            status = {
                "status_code": response.status_code,
                "response_time": response.elapsed.total_seconds(),
                "content_length": len(response.text),
                "last_modified": response.headers.get("last-modified", ""),
                "content_type": response.headers.get("content-type", "")
            }
            return status
        except Exception as e:
            self.log_memory(f"App check error: {e}")
            return None

    def analyze_app_for_improvements(self, status):
        """Analyze app and generate improvement prompts"""
        prompts = []
        
        # Performance improvements
        if status["response_time"] > 2.0:
            prompts.append({
                "category": "performance",
                "prompt": f"The app at {APP_URL} is taking {status['response_time']} seconds to load. Optimize the frontend by implementing lazy loading, code splitting, and caching strategies. Consider using a CDN and optimizing images and assets."
            })
        
        # Content and SEO improvements
        if "text/html" in status["content_type"]:
            prompts.append({
                "category": "seo",
                "prompt": f"Analyze the HTML structure of {APP_URL} for SEO improvements. Check for proper meta tags, semantic HTML5 structure, heading hierarchy, alt text for images, and schema markup. Ensure the site is mobile-friendly and has proper internal linking."
            })
        
        # User Experience improvements
        if status["content_length"] < 5000:  # Small content
            prompts.append({
                "category": "ux",
                "prompt": f"The content at {APP_URL} appears minimal. Enhance the user experience by adding more engaging content, improving navigation, adding interactive elements, and ensuring clear call-to-actions. Consider implementing a better visual hierarchy and responsive design."
            })
        
        # Technical improvements
        if status["status_code"] != 200:
            prompts.append({
                "category": "technical",
                "prompt": f"The app is returning status code {status['status_code']}. Investigate server configuration, error handling, and implement proper HTTP status codes. Add error pages and logging for better debugging."
            })
        
        # Security improvements
        prompts.append({
            "category": "security",
            "prompt": f"Review the security of {APP_URL} by checking for HTTPS implementation, security headers (CSP, HSTS), input validation, and protection against common vulnerabilities like XSS and CSRF. Ensure proper authentication and authorization mechanisms are in place."
        })
        
        return prompts

    def send_prompt_to_cursor(self, prompt):
        """Send improvement prompt to Cursor AI"""
        try:
            payload = {
                "prompt": prompt,
                "context": f"Analyze and improve the website {APP_URL}",
                "priority": "high"
            }
            
            response = requests.post(
                "https://api.cursor.com/v1/prompts",
                headers=self.cursor_headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log_memory(f"Prompt sent to Cursor: {result.get('id')}")
                return result.get("id")
            else:
                self.log_memory(f"Cursor API error: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            self.log_memory(f"Cursor send error: {e}")
            return None

    def follow_up_on_cursor_prompt(self, prompt_id):
        """Check status of Cursor prompt and retrieve results"""
        try:
            response = requests.get(
                f"https://api.cursor.com/v1/prompts/{prompt_id}",
                headers=self.cursor_headers,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                status = result.get("status")
                if status == "completed":
                    self.log_memory(f"Cursor prompt {prompt_id} completed with improvements")
                    return result.get("improvements")
                elif status == "in_progress":
                    self.log_memory(f"Cursor prompt {prompt_id} still in progress")
                else:
                    self.log_memory(f"Cursor prompt {prompt_id} status: {status}")
            else:
                self.log_memory(f"Cursor status check error: {response.status_code}")
        except Exception as e:
            self.log_memory(f"Cursor follow-up error: {e}")
        return None

    def run(self):
        self.log_memory("=== App Monitor Agent Started ===")
        
        try:
            # Check app status
            status = self.check_app_status()
            if status:
                self.log_memory(f"App status: {status['status_code']} - {status['response_time']}s")
                
                # Generate improvement prompts
                prompts = self.analyze_app_for_improvements(status)
                self.log_memory(f"Generated {len(prompts)} improvement prompts")
                
                # Send prompts to Cursor
                for prompt in prompts:
                    prompt_id = self.send_prompt_to_cursor(prompt["prompt"])
                    if prompt_id:
                        # Follow up after 10 minutes
                        import time
                        time.sleep(600)  # Wait 10 minutes
                        improvements = self.follow_up_on_cursor_prompt(prompt_id)
                        if improvements:
                            self.log_memory(f"Improvements received: {len(improvements)} items")
                            # TODO: Implement improvements
                        else:
                            self.log_memory(f"No improvements received for prompt {prompt_id}")
                    else:
                        self.log_memory(f"Failed to send prompt: {prompt['category']}")
            else:
                self.log_memory("Failed to check app status")
        except Exception as e:
            self.log_memory(f"Critical error in App Monitor Agent: {e}")
        
        self.log_memory("=== App Monitor Agent Completed ===")

if __name__ == "__main__":
    agent = AppMonitorAgent()
    agent.run()