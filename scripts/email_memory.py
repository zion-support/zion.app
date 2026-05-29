#!/usr/bin/env python3
"""Conversation Memory module for Email Intelligence Engine v5.0"""
import json, sqlite3
from datetime import datetime, timezone
from pathlib import Path

MEMORY_DB = Path.home() / ".hermes" / "email-memory" / "conversations.db"

class ConversationMemory:
    def __init__(self):
        MEMORY_DB.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(str(MEMORY_DB))
        self._init_db()
    
    def _init_db(self):
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS conversations (
                sender_email TEXT PRIMARY KEY,
                sender_name TEXT,
                total_emails INTEGER DEFAULT 0,
                first_contact TEXT,
                last_contact TEXT,
                relationship_score REAL DEFAULT 0.5,
                relationship_type TEXT DEFAULT 'unknown',
                sentiment_trend TEXT DEFAULT 'neutral',
                topics TEXT DEFAULT '[]',
                pending_actions TEXT DEFAULT '[]',
                last_draft_sent TEXT DEFAULT '',
                is_vip INTEGER DEFAULT 0,
                company TEXT DEFAULT '',
                notes TEXT DEFAULT ''
            );
            CREATE TABLE IF NOT EXISTS email_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_email TEXT,
                subject TEXT,
                date TEXT,
                intent TEXT,
                priority TEXT,
                sentiment TEXT,
                action_taken TEXT,
                draft_sent INTEGER DEFAULT 0,
                thread_id TEXT
            );
            CREATE TABLE IF NOT EXISTS feedback_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_email TEXT,
                email_subject TEXT,
                field TEXT, old_value TEXT, new_value TEXT, timestamp TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_sender ON email_history(sender_email);
            CREATE INDEX IF NOT EXISTS idx_thread ON email_history(thread_id);
        """)
        self.conn.commit()
    
    def record_email(self, sender_email, sender_name, subject, intent, priority, sentiment, action, thread_id="", draft_sent=False):
        now = datetime.now(timezone.utc).isoformat()
        row = self.conn.execute("SELECT total_emails, first_contact FROM conversations WHERE sender_email=?", (sender_email,)).fetchone()
        if row:
            score = min(1.0, 0.5 + (row[0] + 1) * 0.02)
            self.conn.execute("UPDATE conversations SET sender_name=?, total_emails=?, last_contact=?, relationship_score=? WHERE sender_email=?",
                (sender_name or sender_email, row[0]+1, now, score, sender_email))
        else:
            self.conn.execute("INSERT INTO conversations (sender_email, sender_name, total_emails, first_contact, last_contact, relationship_score) VALUES (?,?,1,?,?,0.1)",
                (sender_email, sender_name or sender_email, now, now))
        self.conn.execute("INSERT INTO email_history (sender_email,subject,date,intent,priority,sentiment,action_taken,draft_sent,thread_id) VALUES (?,?,?,?,?,?,?,?,?)",
            (sender_email, subject, now, intent, priority, sentiment, action, int(draft_sent), thread_id))
        self.conn.commit()
    
    def get_sender_context(self, sender_email):
        row = self.conn.execute("SELECT sender_name,total_emails,relationship_score,relationship_type,is_vip,pending_actions FROM conversations WHERE sender_email=?", (sender_email,)).fetchone()
        if not row:
            return {"known": False, "score": 0, "type": "new"}
        history = self.conn.execute("SELECT subject,intent,sentiment FROM email_history WHERE sender_email=? ORDER BY date DESC LIMIT 5", (sender_email,)).fetchall()
        return {
            "known": True, "name": row[0], "total_emails": row[1], "score": row[2],
            "type": row[3], "is_vip": bool(row[4]),
            "pending_actions": json.loads(row[5]) if row[5] else [],
            "recent_subjects": [h[0] for h in history],
            "recent_intents": [h[1] for h in history],
            "recent_sentiments": [h[2] for h in history],
        }
    
    def get_relationship_tier(self, sender_email):
        ctx = self.get_sender_context(sender_email)
        if not ctx["known"]: return "new"
        if ctx.get("is_vip"): return "vip"
        if ctx["score"] > 0.8: return "trusted"
        if ctx["score"] > 0.5: return "familiar"
        if ctx["score"] > 0.2: return "acquaintance"
        return "new"
    
    def get_stats(self):
        tc = self.conn.execute("SELECT COUNT(*) FROM conversations").fetchone()[0]
        te = self.conn.execute("SELECT COUNT(*) FROM email_history").fetchone()[0]
        vip = self.conn.execute("SELECT COUNT(*) FROM conversations WHERE is_vip=1").fetchone()[0]
        top = self.conn.execute("SELECT sender_name,total_emails,relationship_score FROM conversations ORDER BY relationship_score DESC LIMIT 5").fetchall()
        return {"conversations": tc, "emails": te, "vip": vip, "top": [(t[0],t[1],round(t[2],2)) for t in top]}
    
    def close(self):
        self.conn.close()
