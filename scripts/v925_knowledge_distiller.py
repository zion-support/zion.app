#!/usr/bin/env python3
"""V925: Email Knowledge Distiller"""
import re
from datetime import datetime
from typing import Dict, List, Any
from collections import Counter

class KnowledgeDistiller:
    def __init__(self):
        self.knowledge_base = {}
        self.faq_candidates = []
        self.processed_threads = 0

    def analyze_thread(self, thread_data: Dict[str, Any]) -> Dict[str, Any]:
        emails = thread_data.get('emails', [])
        subject = thread_data.get('subject', '')
        participants = thread_data.get('participants', [])
        if not emails:
            return {'action': 'no_data', 'knowledge_extracted': False}
        decisions = self._extract_decisions(emails)
        action_items = self._extract_actions(emails)
        key_facts = self._extract_facts(emails)
        faq_pair = self._generate_faq(emails, subject)
        process_steps = self._extract_process(emails)
        knowledge_entry = {
            'subject': subject, 'decisions': decisions, 'actions': action_items,
            'facts': key_facts, 'process': process_steps, 'participants': participants,
            'timestamp': datetime.now().isoformat()
        }
        self.knowledge_base[subject] = knowledge_entry
        self.processed_threads += 1
        if faq_pair:
            self.faq_candidates.append(faq_pair)
        response = self._generate_response(knowledge_entry, faq_pair, participants)
        return {
            'action': 'distill_knowledge', 'knowledge_extracted': True,
            'decisions': len(decisions), 'action_items': len(action_items),
            'key_facts': len(key_facts), 'process_steps': len(process_steps),
            'faq_generated': faq_pair is not None, 'response': response,
            'reply_all_required': len(participants) > 1
        }

    def _extract_decisions(self, emails: List[Dict]) -> List[str]:
        decisions = []
        patterns = ['decided to', 'we will', 'agreed that', 'conclusion:', 'final decision']
        for email in emails:
            body = email.get('body', '').lower()
            for p in patterns:
                if p in body:
                    idx = body.find(p)
                    decisions.append(body[idx:idx+100].strip())
                    break
        return decisions[:5]

    def _extract_actions(self, emails: List[Dict]) -> List[Dict[str, str]]:
        actions = []
        patterns = ['please', 'could you', 'need to', 'will', 'responsible for']
        for email in emails:
            body = email.get('body', '')
            for line in body.split('.'):
                ll = line.lower()
                if any(p in ll for p in patterns):
                    actions.append({'action': line.strip(), 'status': 'pending'})
        return actions[:5]

    def _extract_facts(self, emails: List[Dict]) -> List[str]:
        facts = []
        patterns = [r'\b\d+\s*(?:users|customers|employees|servers|days|weeks|months)\b',
                    r'(?:version|v)\s*\d+\.\d+', r'(?:deadline|due date|launch):\s*[\w\s]+']
        all_text = ' '.join(e.get('body', '') for e in emails)
        for p in patterns:
            matches = re.findall(p, all_text, re.IGNORECASE)
            facts.extend(matches[:3])
        return facts[:5]

    def _generate_faq(self, emails: List[Dict], subject: str) -> Dict[str, str]:
        if len(emails) < 2: return None
        q = emails[0].get('body', '').split('.')[0].strip()
        if not q or len(q) < 10: return None
        answers = [e.get('body', '').split('.')[0].strip() for e in emails[1:3] if e.get('body', '').split('.')[0].strip()]
        if answers:
            return {'question': q[:150], 'answer': '. '.join(answers)[:300], 'source': subject}
        return None

    def _extract_process(self, emails: List[Dict]) -> List[str]:
        steps = []
        patterns = ['step \d', 'first', 'then', 'next', 'finally', 'after that']
        for email in emails:
            body = email.get('body', '').lower()
            for i, p in enumerate(patterns):
                if p in body:
                    idx = body.find(p)
                    steps.append(f"Step {i+1}: {body[idx:idx+80].strip()}")
        return steps[:5]

    def _generate_response(self, entry, faq, participants):
        text = "Knowledge Distilled from Email Thread\n\n"
        text += f"Subject: {entry['subject']}\n"
        text += f"Decisions: {len(entry['decisions'])}\n"
        text += f"Action Items: {len(entry['actions'])}\n"
        text += f"Key Facts: {len(entry['facts'])}\n"
        text += f"Process Steps: {len(entry['process'])}\n"
        if faq:
            text += f"\nFAQ Generated:\nQ: {faq['question'][:80]}...\nA: {faq['answer'][:80]}...\n"
        text += "\nKnowledge saved to institutional database.\n"
        if len(participants) > 1:
            text += f"Reply All to {len(participants)} participants for knowledge sharing."
        return {'text': text, 'reply_all': len(participants) > 1, 'faq_created': faq is not None}

def main():
    distiller = KnowledgeDistiller()
    test_thread = {
        'subject': 'Q4 Product Launch Planning',
        'participants': ['pm@ex.com', 'dev@ex.com', 'marketing@ex.com', 'sales@ex.com'],
        'emails': [
            {'body': 'What is the timeline for the Q4 product launch? We need to coordinate with marketing.'},
            {'body': 'We decided to launch on November 15th. The development team will complete testing by October 30th.'},
            {'body': 'Please prepare the marketing materials by November 1st. We will need 50 demo accounts for sales.'},
            {'body': 'Step 1: Complete beta testing. Step 2: Final QA. Step 3: Marketing campaign launch. Step 4: Sales enablement.'}
        ]
    }
    print("=" * 60)
    print("V925 Email Knowledge Distiller")
    print("=" * 60)
    r = distiller.analyze_thread(test_thread)
    print(f"\nDecisions: {r['decisions']}, Actions: {r['action_items']}, Facts: {r['key_facts']}, Process: {r['process_steps']}")
    print(f"FAQ Generated: {r['faq_generated']}, Reply All: {r['reply_all_required']}")
    print("\nV925 Knowledge Distiller: OPERATIONAL")

if __name__ == '__main__':
    main()
