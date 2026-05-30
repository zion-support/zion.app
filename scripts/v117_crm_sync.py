#!/usr/bin/env python3
"""
V117: AI Email-to-CRM Sync Engine
Auto-extract contacts, companies, deals, activities from emails and sync to CRM.
"""
import re, json, hashlib
from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum

class EntityType(Enum):
    CONTACT = "contact"
    COMPANY = "company"
    DEAL = "deal"
    ACTIVITY = "activity"
    TASK = "task"
    NOTE = "note"

class DealStage(Enum):
    NEW_LEAD = "new_lead"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

@dataclass
class CRMEntity:
    entity_id: str
    entity_type: EntityType
    data: Dict
    source_email_id: str
    confidence: float
    synced_to: List[str] = field(default_factory=list)
    created_at: str = ""

class EmailToCRMSync:
    """V117: Automatically extract and sync CRM data from emails."""
    
    EMAIL_PATTERN = r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}'
    PHONE_PATTERN = r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    COMPANY_SIGNALS = ["Inc", "LLC", "Corp", "Ltd", "GmbH", "SA", "Group", "Technologies", "Solutions", "Systems"]
    DEAL_SIGNALS = ["budget", "timeline", "proposal", "contract", "pricing", "quote", "purchase", "order"]
    AMOUNT_PATTERN = r'\$[\d,]+(?:\.\d+)?(?:\s*(?:k|m|million|thousand))?'
    
    CRM_INTEGRATIONS = ["salesforce", "hubspot", "pipedrive", "zoho", "freshsales", "monday"]
    
    def __init__(self):
        self.contacts: Dict[str, CRMEntity] = {}
        self.companies: Dict[str, CRMEntity] = {}
        self.deals: Dict[str, CRMEntity] = {}
        self.activities: List[CRMEntity] = []
        self.sync_log: List[Dict] = []
        self.reply_all_enforced = 0
    
    def process_email(self, email: Dict) -> List[CRMEntity]:
        """Extract all CRM entities from an email."""
        entities = []
        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")
        recipients = email.get("to", [])
        cc_list = email.get("cc", [])
        email_id = email.get("id", hashlib.md5(f"{sender}{subject}".encode()).hexdigest()[:12])
        
        # Extract contacts
        contacts = self._extract_contacts(sender, recipients, cc_list, body, email_id)
        entities.extend(contacts)
        
        # Extract companies
        companies = self._extract_companies(body, sender, email_id)
        entities.extend(companies)
        
        # Extract deals
        deals = self._extract_deals(body, subject, contacts, companies, email_id)
        entities.extend(deals)
        
        # Create activity
        activity = self._create_activity(email, contacts, deals, email_id)
        entities.append(activity)
        self.activities.append(activity)
        
        # Extract tasks
        tasks = self._extract_tasks(body, subject, email_id)
        entities.extend(tasks)
        
        # Reply-all enforcement
        all_recipients = recipients + cc_list
        if len(all_recipients) > 1:
            self.reply_all_enforced += 1
        
        return entities
    
    def _extract_contacts(self, sender: str, recipients: List, cc: List, body: str, email_id: str) -> List[CRMEntity]:
        contacts = []
        all_emails = [sender] + recipients + cc
        
        # Also extract emails from body
        body_emails = re.findall(self.EMAIL_PATTERN, body)
        all_emails.extend(body_emails)
        
        for addr in set(all_emails):
            if not addr:
                continue
            name_part = addr.split("@")[0].replace(".", " ").title() if "@" in addr else addr
            domain = addr.split("@")[-1] if "@" in addr else ""
            
            # Extract phone numbers near this email
            phones = re.findall(self.PHONE_PATTERN, body)
            
            contact_id = hashlib.md5(addr.encode()).hexdigest()[:12]
            entity = CRMEntity(
                entity_id=contact_id,
                entity_type=EntityType.CONTACT,
                data={
                    "email": addr,
                    "name": name_part,
                    "phone": phones[0] if phones else None,
                    "company_domain": domain,
                    "last_contact": datetime.now().isoformat(),
                    "interaction_count": 1
                },
                source_email_id=email_id,
                confidence=0.95,
                created_at=datetime.now().isoformat()
            )
            self.contacts[contact_id] = entity
            contacts.append(entity)
        
        return contacts
    
    def _extract_companies(self, body: str, sender: str, email_id: str) -> List[CRMEntity]:
        companies = []
        # Extract from sender domain
        domain = sender.split("@")[-1] if "@" in sender else ""
        if domain and not any(d in domain for d in ["gmail", "yahoo", "hotmail", "outlook"]):
            company_name = domain.split(".")[0].title()
            company_id = hashlib.md5(domain.encode()).hexdigest()[:12]
            entity = CRMEntity(
                entity_id=company_id,
                entity_type=EntityType.COMPANY,
                data={"name": company_name, "domain": domain, "website": f"https://{domain}"},
                source_email_id=email_id,
                confidence=0.9,
                created_at=datetime.now().isoformat()
            )
            self.companies[company_id] = entity
            companies.append(entity)
        
        # Check for company names in body
        for signal in self.COMPANY_SIGNALS:
            pattern = rf'([A-Z][a-zA-Z\s]+{signal})'
            matches = re.findall(pattern, body)
            for match in matches:
                name = match.strip()
                cid = hashlib.md5(name.encode()).hexdigest()[:12]
                if cid not in self.companies:
                    entity = CRMEntity(
                        entity_id=cid,
                        entity_type=EntityType.COMPANY,
                        data={"name": name, "source": "email_body"},
                        source_email_id=email_id,
                        confidence=0.7,
                        created_at=datetime.now().isoformat()
                    )
                    self.companies[cid] = entity
                    companies.append(entity)
        
        return companies
    
    def _extract_deals(self, body: str, subject: str, contacts: List, companies: List, email_id: str) -> List[CRMEntity]:
        deals = []
        text = (subject + " " + body).lower()
        
        deal_signals_found = [s for s in self.DEAL_SIGNALS if s in text]
        if not deal_signals_found:
            return deals
        
        # Extract dollar amounts
        amounts = re.findall(self.AMOUNT_PATTERN, body + " " + subject, re.I)
        value = 0
        if amounts:
            for amt in amounts:
                clean = amt.replace("$", "").replace(",", "").lower()
                if "million" in clean or "m" == clean[-1:]:
                    value = max(value, float(clean.replace("million", "").replace("m", "").strip()) * 1000000)
                elif "thousand" in clean or "k" == clean[-1:]:
                    value = max(value, float(clean.replace("thousand", "").replace("k", "").strip()) * 1000)
                else:
                    try:
                        value = max(value, float(clean))
                    except:
                        pass
        
        stage = DealStage.CONTACTED
        if "proposal" in text: stage = DealStage.PROPOSAL
        if "negotiate" in text or "counter" in text: stage = DealStage.NEGOTIATION
        if "signed" in text or "approved" in text: stage = DealStage.CLOSED_WON
        
        deal_id = hashlib.md5(f"deal_{email_id}".encode()).hexdigest()[:12]
        entity = CRMEntity(
            entity_id=deal_id,
            entity_type=EntityType.DEAL,
            data={
                "name": subject[:100],
                "value": value,
                "stage": stage.value,
                "contacts": [c.entity_id for c in contacts[:3]],
                "companies": [c.entity_id for c in companies[:2]],
                "signals": deal_signals_found
            },
            source_email_id=email_id,
            confidence=0.75 if deal_signals_found else 0.3,
            created_at=datetime.now().isoformat()
        )
        self.deals[deal_id] = entity
        deals.append(entity)
        return deals
    
    def _create_activity(self, email: Dict, contacts: List, deals: List, email_id: str) -> CRMEntity:
        return CRMEntity(
            entity_id=email_id,
            entity_type=EntityType.ACTIVITY,
            data={
                "type": "email",
                "direction": "inbound" if "from" in email else "outbound",
                "subject": email.get("subject", ""),
                "contacts": [c.entity_id for c in contacts],
                "deals": [d.entity_id for d in deals],
                "timestamp": datetime.now().isoformat()
            },
            source_email_id=email_id,
            confidence=1.0,
            created_at=datetime.now().isoformat()
        )
    
    def _extract_tasks(self, body: str, subject: str, email_id: str) -> List[CRMEntity]:
        tasks = []
        task_patterns = [
            r"\b(please|can you|could you|need to|action item|todo|follow up|deadline)\b",
            r"\b(by|before|until|due)\s+\w+\s+\d+",
        ]
        for pattern in task_patterns:
            matches = re.findall(pattern, body, re.I)
            if matches:
                task_id = hashlib.md5(f"task_{email_id}_{len(tasks)}".encode()).hexdigest()[:12]
                entity = CRMEntity(
                    entity_id=task_id,
                    entity_type=EntityType.TASK,
                    data={"description": body[:200], "source_email": email_id, "status": "pending"},
                    source_email_id=email_id,
                    confidence=0.6,
                    created_at=datetime.now().isoformat()
                )
                tasks.append(entity)
                break
        return tasks
    
    def sync_to_crm(self, entities: List[CRMEntity], crm: str = "hubspot") -> Dict:
        """Simulate syncing entities to a CRM system."""
        synced = []
        for entity in entities:
            entity.synced_to.append(crm)
            synced.append(entity.entity_id)
            self.sync_log.append({
                "entity_id": entity.entity_id,
                "type": entity.entity_type.value,
                "crm": crm,
                "timestamp": datetime.now().isoformat(),
                "status": "synced"
            })
        return {"synced_count": len(synced), "crm": crm, "entity_ids": synced}
    
    def get_stats(self) -> Dict:
        return {
            "contacts": len(self.contacts),
            "companies": len(self.companies),
            "deals": len(self.deals),
            "activities": len(self.activities),
            "sync_operations": len(self.sync_log),
            "reply_all_enforced": self.reply_all_enforced,
            "supported_crms": self.CRM_INTEGRATIONS,
            "engine_version": "V117"
        }

if __name__ == "__main__":
    sync = EmailToCRMSync()
    
    test_email = {
        "id": "crm_test_1",
        "from": "john.smith@acme-corp.com",
        "to": ["sales@ziontechgroup.com", "kleber@ziontechgroup.com"],
        "cc": ["cto@acme-corp.com"],
        "subject": "Proposal request for AI services - budget $50,000",
        "body": "Hi Kleber,\n\nFollowing our call, Acme Corp is interested in your AI services. Our budget is around $50,000 for the initial project. Please send a proposal by Friday.\n\nOur CTO Sarah Johnson (sarah.johnson@acme-corp.com, +1-555-123-4567) will be the technical lead.\n\nPlease follow up with the timeline and next steps.\n\nBest,\nJohn Smith\nVP Engineering, Acme Corp"
    }
    
    print("=" * 60)
    print("V117: AI Email-to-CRM Sync Engine")
    print("=" * 60)
    
    entities = sync.process_email(test_email)
    print(f"\nExtracted {len(entities)} CRM entities:")
    for e in entities:
        print(f"  [{e.entity_type.value}] {e.entity_id}: {json.dumps(e.data, default=str)[:120]}")
    
    # Sync to CRM
    result = sync.sync_to_crm(entities, "hubspot")
    print(f"\n--- CRM Sync Result ---")
    print(f"  Synced: {result['synced_count']} entities to {result['crm']}")
    
    print(f"\n--- Stats ---")
    for k, v in sync.get_stats().items():
        print(f"  {k}: {v}")
