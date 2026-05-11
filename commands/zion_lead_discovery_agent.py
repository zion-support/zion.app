#!/usr/bin/env python3
"""
Zion Tech Group - Lead Discovery Agent
Searches for potential clients from multiple sources and stores them in PostgreSQL.
"""

import os
import json
import requests
import psycopg2
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
import time
import logging

load_dotenv()

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
MEMORY = WORKDIR / "MEMORY.md"
LOG_FILE = WORKDIR / "logs" / "lead_discovery.log"

# Create logs directory if it doesn't exist
(WORKDIR / "logs").mkdir(exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class LeadDiscoveryAgent:
    def __init__(self):
        self.workspace = WORKDIR
        self.memory = MEMORY
        
    def log_memory(self, message: str):
        """Append a timestamped entry to MEMORY.md"""
        ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        try:
            with self.memory.open("a", encoding="utf-8") as f:
                f.write(f"- [LeadDiscovery] {ts} | {message}\n")
        except Exception as e:
            logger.error(f"Failed to write to memory: {e}")
    
    def get_db_connection(self):
        """Establish PostgreSQL connection"""
        try:
            conn = psycopg2.connect(
                host=os.getenv("POSTGRES_HOST", "localhost"),
                port=int(os.getenv("POSTGRES_PORT", "5432")),
                dbname=os.getenv("POSTGRES_DB", "zion"),
                user=os.getenv("POSTGRES_USER", "zion_user"),
                password=os.getenv("POSTGRES_PASSWORD", "zion_secret")
            )
            logger.info("Database connection established")
            return conn
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            self.log_memory(f"DB connection error: {e}")
            return None
    
    def fetch_crunchbase_leads(self, limit=50):
        """Fetch SaaS companies from Crunchbase API"""
        try:
            api_key = os.getenv("CRUNCHBASE_API_KEY")
            if not api_key:
                logger.warning("CRUNCHBASE_API_KEY not set")
                self.log_memory("Crunchbase API key missing")
                return []
            
            url = "https://api.crunchbase.com/v/4/organizations/search"
            headers = {"X-cb-user-key": api_key}
            params = {
                "query": "SaaS",
                "page": 1,
                "per_page": limit
            }
            
            response = requests.get(url, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            organizations = data.get("entities", [])
            
            leads = []
            for org in organizations:
                properties = org.get("properties", {})
                lead = {
                    "source": "crunchbase",
                    "company_id": org.get("uuid"),
                    "company_name": properties.get("name", ""),
                    "industry": properties.get("category", ""),
                    "region": properties.get("country_code", ""),
                    "company_size": str(properties.get("employee_count", "")),
                    "website": properties.get("website_url", ""),
                    "description": properties.get("short_description", ""),
                    "raw_data": org
                }
                leads.append(lead)
            
            logger.info(f"Fetched {len(leads)} leads from Crunchbase")
            return leads
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Crunchbase API error: {e}")
            self.log_memory(f"Crunchbase API error: {e}")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"Crunchbase JSON decode error: {e}")
            return []
    
    def fetch_apollo_leads(self, limit=50):
        """Fetch SaaS companies from Apollo.io API"""
        try:
            api_key = os.getenv("APOLLO_API_KEY")
            if not api_key:
                logger.warning("APOLLO_API_KEY not set")
                self.log_memory("Apollo API key missing")
                return []
            
            url = "https://api.apollo.io/v1/organizations/search"
            headers = {"Authorization": f"Bearer {api_key}"}
            
            payload = {
                "q_organization_keyword": "SaaS",
                "page": 1,
                "organization_per_page": limit
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            organizations = data.get("organizations", [])
            
            leads = []
            for org in organizations:
                lead = {
                    "source": "apollo",
                    "company_id": org.get("id"),
                    "company_name": org.get("name", ""),
                    "industry": org.get("industry", ""),
                    "region": org.get("country", ""),
                    "company_size": str(org.get("employee_count", "")),
                    "website": org.get("website_url", ""),
                    "description": org.get("description", ""),
                    "raw_data": org
                }
                leads.append(lead)
            
            logger.info(f"Fetched {len(leads)} leads from Apollo")
            return leads
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Apollo API error: {e}")
            self.log_memory(f"Apollo API error: {e}")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"Apollo JSON decode error: {e}")
            return []
    
    def fetch_linkedin_leads(self, keywords, limit=30):
        """Scrape LinkedIn for potential leads (simplified - in production use LinkedIn API)"""
        # This would use a headless browser to scrape or the official LinkedIn API
        # For now, return empty list as it requires more complex setup
        logger.info("LinkedIn integration requires API access - skipping")
        return []
    
    def score_lead(self, lead: dict) -> float:
        """Score lead based on ICP criteria"""
        try:
            icp = json.loads(os.getenv("ICP_CRITERIA_JSON", "{}"))
            score = 0.0
            
            # Industry match (30%)
            if icp.get("industries") and lead.get("industry"):
                lead_industries = [i.strip().lower() for i in str(lead["industry"]).split(",")]
                icp_industries = [i.strip().lower() for i in icp["industries"]]
                if any(li in icp_industries for li in lead_industries):
                    score += 0.3
            
            # Region match (20%)
            if icp.get("region") and lead.get("region"):
                if lead["region"].upper() == icp["region"].upper():
                    score += 0.2
            
            # Company size match (30%)
            if icp.get("company_size") and lead.get("company_size"):
                try:
                    lead_size = int(str(lead["company_size"]).replace("+", "").replace("-", "").split(" ")[0])
                    icp_size = int(str(icp["company_size"]).replace("+", "").replace("-", "").split(" ")[0])
                    if lead_size >= icp_size:
                        score += 0.3
                except (ValueError, IndexError):
                    pass
            
            # Website exists (10%)
            if lead.get("website"):
                score += 0.1
            
            # Description quality (10%)
            if lead.get("description") and len(lead["description"]) > 50:
                score += 0.1
            
            return min(score, 1.0)
            
        except Exception as e:
            logger.error(f"Scoring error: {e}")
            return 0.0
    
    def deduplicate_leads(self, leads: list) -> list:
        """Remove duplicate leads based on company_id and source"""
        seen = set()
        unique = []
        for lead in leads:
            key = (lead["source"], lead.get("company_id"))
            if key not in seen and lead.get("company_name"):
                seen.add(key)
                unique.append(lead)
        return unique
    
    def insert_lead(self, lead: dict) -> bool:
        """Insert lead into PostgreSQL, avoiding duplicates"""
        conn = None
        try:
            conn = self.get_db_connection()
            if not conn:
                return False
            
            cur = conn.cursor()
            
            # Check for existing lead by email (if available) or by company_id+source
            if lead.get("email"):
                cur.execute(
                    "SELECT id FROM leads WHERE email = %s AND source = %s",
                    (lead["email"], lead["source"])
                )
                if cur.fetchone():
                    logger.info(f"Lead already exists by email: {lead['email']}")
                    return False
            
            if lead.get("company_id"):
                cur.execute(
                    "SELECT id FROM leads WHERE company_id = %s AND source = %s",
                    (lead["company_id"], lead["source"])
                )
                if cur.fetchone():
                    logger.info(f"Lead already exists: {lead['company_name']}")
                    return False
            
            # Insert new lead
            cur.execute(
                """
                INSERT INTO leads (
                    source, company_id, company_name, industry, region,
                    company_size, website, description, email, first_name,
                    last_name, title, score, raw_data, discovered_at, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
                RETURNING id;
                """,
                (
                    lead["source"],
                    lead.get("company_id"),
                    lead.get("company_name"),
                    lead.get("industry"),
                    lead.get("region"),
                    lead.get("company_size"),
                    lead.get("website"),
                    lead.get("description"),
                    lead.get("email"),
                    lead.get("first_name", ""),
                    lead.get("last_name", ""),
                    lead.get("title", ""),
                    lead.get("score", 0.0),
                    json.dumps(lead.get("raw_data", {})),
                    "new"
                )
            )
            
            lead_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            
            logger.info(f"Inserted lead: {lead['company_name']} (ID: {lead_id})")
            self.log_memory(f"Inserted lead: {lead['company_name']} - {lead.get('email', 'no email')}")
            return True
            
        except psycopg2.Error as e:
            logger.error(f"Database error: {e}")
            self.log_memory(f"DB insert error: {e}")
            if conn:
                conn.rollback()
            return False
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            self.log_memory(f"Unexpected error: {e}")
            return False
        finally:
            if conn:
                conn.close()
    
    def run(self, limit_per_source=50):
        """Main execution method"""
        start_time = time.time()
        self.log_memory("=== Lead Discovery Agent Started ===")
        logger.info("Starting lead discovery process")
        
        try:
            # Fetch leads from all sources
            all_leads = []
            all_leads.extend(self.fetch_crunchbase_leads(limit_per_source))
            all_leads.extend(self.fetch_apollo_leads(limit_per_source))
            all_leads.extend(self.fetch_linkedin_leads([], limit_per_source))
            
            if not all_leads:
                logger.warning("No leads fetched from any source")
                self.log_memory("No leads fetched from any source")
                return
            
            # Deduplicate across sources
            unique_leads = self.deduplicate_leads(all_leads)
            logger.info(f"Total leads fetched: {len(all_leads)}, unique: {len(unique_leads)}")
            self.log_memory(f"Fetched {len(unique_leads)} unique leads")
            
            # Score each lead
            scored_leads = []
            for lead in unique_leads:
                lead["score"] = self.score_lead(lead)
                scored_leads.append(lead)
            
            # Sort by score (highest first)
            scored_leads.sort(key=lambda x: x["score"], reverse=True)
            
            # Insert into database
            inserted = 0
            for lead in scored_leads:
                if self.insert_lead(lead):
                    inserted += 1
            
            elapsed = time.time() - start_time
            logger.info(f"Lead discovery completed in {elapsed:.2f}s - inserted {inserted} leads")
            self.log_memory(f"=== Lead Discovery Completed: Inserted {inserted} new leads (elapsed: {elapsed:.2f}s) ===")
            
            return inserted
            
        except Exception as e:
            logger.error(f"Critical error in lead discovery: {e}")
            self.log_memory(f"Critical error: {e}")
            return 0

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Zion Tech Lead Discovery Agent")
    parser.add_argument("--limit", type=int, default=50, help="Limit per source")
    parser.add_argument("--test", action="store_true", help="Run in test mode (no DB insert)")
    args = parser.parse_args()
    
    agent = LeadDiscoveryAgent()
    
    if args.test:
        logger.info("Running in TEST mode - no database inserts")
        # Just fetch and score without inserting
        leads = []
        leads.extend(agent.fetch_crunchbase_leads(args.limit))
        leads.extend(agent.fetch_apollo_leads(args.limit))
        unique = agent.deduplicate_leads(leads)
        for lead in unique:
            lead["score"] = agent.score_lead(lead)
        logger.info(f"Test run: fetched {len(unique)} leads, would insert {len(unique)}")
    else:
        inserted = agent.run(args.limit)
        logger.info(f"Inserted {inserted} new leads")

if __name__ == "__main__":
    main()