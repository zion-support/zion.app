#!/usr/bin/env python3
"""
AI Agent Communication Hub - Enables inter-agent messaging and coordination
"""

import sys, json, uuid
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')

AGENT_REGISTRY = Path('/root/.openclaw/workspace/zion.app/data/agent_registry.json')
MESSAGE_QUEUE = Path('/root/.openclaw/workspace/zion.app/data/agent_messages.json')

class AgentCommunicator:
    def __init__(self):
        self.registry = self._load_json(AGENT_REGISTRY, {'agents': {}, 'channels': {}})
        self.messages = self._load_json(MESSAGE_QUEUE, {'inbox': [], 'outbox': []})
    
    def _load_json(self, path, default):
        if path.exists():
            return json.loads(path.read_text())
        path.parent.mkdir(exist_ok=True)
        path.write_text(json.dumps(default, indent=2))
        return default
    
    def register_agent(self, agent_id: str, capabilities: List[str], endpoint: str):
        """Register an AI agent with capabilities"""
        self.registry['agents'][agent_id] = {
            'id': agent_id,
            'capabilities': capabilities,
            'endpoint': endpoint,
            'status': 'online',
            'last_seen': datetime.now(timezone.utc).isoformat()
        }
        self._save()
        return f"Agent {agent_id} registered"
    
    def send_message(self, from_agent: str, to_agent: str, message: str, priority: str = 'normal'):
        """Send message between agents"""
        msg = {
            'id': str(uuid.uuid4()),
            'from': from_agent,
            'to': to_agent,
            'message': message,
            'priority': priority,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'status': 'pending'
        }
        self.messages['inbox'].append(msg)
        self._save()
        return f"Message queued to {to_agent}"
    
    def get_messages(self, agent_id: str, limit: int = 10):
        """Get pending messages for an agent"""
        msgs = [m for m in self.messages['inbox'] if m['to'] == agent_id and m['status'] == 'pending']
        for m in msgs[:limit]:
            m['status'] = 'read'
        self._save()
        return msgs
    
    def broadcast(self, from_agent: str, message: str, capability_filter: str = None):
        """Broadcast to agents with specific capability"""
        targets = [a for a, d in self.registry['agents'].items() 
                   if capability_filter in d.get('capabilities', [])]
        for target in targets:
            self.send_message(from_agent, target, message, priority='broadcast')
        return f"Broadcast sent to {len(targets)} agents"
    
    def _save(self):
        AGENT_REGISTRY.write_text(json.dumps(self.registry, indent=2))
        MESSAGE_QUEUE.write_text(json.dumps(self.messages, indent=2))

def main():
    comm = AgentCommunicator()
    print("🤖 AI Communication Hub")
    print(f"Active agents: {len(comm.registry['agents'])}")
    print("Commands: register, send, broadcast, inbox")

if __name__ == '__main__':
    main()