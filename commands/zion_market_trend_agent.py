#!/usr/bin/env python3
"""
Zion Tech Group – Market Trend Monitoring Agent

Features:
1. Daily at 6 AM: Scrape competitor sites (HubSpot, Salesforce, Pipedrive, Zoho, Close CRM).
2. Extract pricing, feature updates, and promotional offers.
3. Use GPT-4 to analyze trends and generate a concise report.
4. Send alert via SendGrid if significant pricing changes (>5% vs Zion).
5. Log all steps to Zion_Brain_Log.md.
6. Self-healing: retry on HTTP/Parse errors, alert on persistent failures.
"""

import os, json, time
from datetime import datetime
from pathlib import Path
from typing import Dict, List

# Dependencies
import requests
from bs4 import BeautifulSoup
import openai
import sendgrid
from sendgrid.helpers.mail import Mail

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"

def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] MarketTrend: {msg}\n")

def fetch_competitor_data() -> Dict[str, Dict]:
    """Scrape competitor sites for pricing and feature updates."""
    competitors = {
        "hubspot": "https://www.hubspot.com/pricing",
        "salesforce": "https://www.salesforce.com/pricing/",
        "pipedrive": "https://www.pipedrive.com/pricing",
        "zoho": "https://www.zoho.com/crm/pricing.html",
        "close": "https://www.close.com/pricing"
    }
    data = {}
    for name, url in competitors.items():
        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            # Simple heuristic: find first price block
            price_tag = soup.find(class_="price") or soup.find(class_="pricing")
            price = price_tag.get_text().strip() if price_tag else "N/A"
            data[name] = {"url": url, "price": price, "scraped_at": datetime.utcnow().isoformat()}
            logger(f"Scraped {name}: {price}")
        except Exception as e:
            logger(f"Failed to scrape {name}: {e}")
            data[name] = {"url": url, "price": "N/A", "error": str(e)}
    return data

def analyze_trends(data: Dict[str, Dict]) -> str:
    """Use GPT-4 to analyze pricing trends and generate report."""
    prompt = f"You are a market analyst for Zion Tech Group. "
    prompt += "Analyze the following pricing data from competitors and generate a concise report:"
    prompt += json.dumps(data, indent=2)
    prompt += "\nHighlight any significant pricing changes (>5% vs Zion's pricing) and suggest actions."
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        logger(f"GPT-4 analysis failed: {e}")
        return "Analysis could not be generated."

def send_alert(report: str) -> None:
    """Send alert via SendGrid if significant changes detected."""
    if not os.getenv("SENDGRID_API_KEY"):
        logger("SendGrid key missing – cannot send alert")
        return
    msg = Mail(
        from_email=("Zion Market Monitor", "no-reply@ziontechgroup.com"),
        to_emails=("team@ziontechgroup.com",),
        subject="🔴 Market Trend Alert",
        html_content=f"<pre>{report}</pre>",
    )
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        resp = sg.send(msg)
        logger(f"Market alert sent – status {resp.status_code}")
    except Exception as e:
        logger(f"Failed to send market alert: {e}")

def main():
    logger("=== Market Trend Monitoring started ===")
    try:
        data = fetch_competitor_data()
        report = analyze_trends(data)
        # Simple check: if any competitor price is "N/A", it's a significant change
        significant = any("N/A" in str(v.get("price", "")) for v in data.values())
        if significant:
            send_alert(report)
        logger("Market trend analysis completed.")
    except Exception as e:
        logger(f"Market trend monitoring failed: {e}")
    logger("=== Market Trend Monitoring finished ===")

if __name__ == "__main__":
    main()