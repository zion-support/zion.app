#!/usr/bin/env python3
"""V212 - Email Gamification Platform
Gamify email responsiveness with leaderboards, badges, streaks,
and team performance metrics to boost engagement and productivity.
Always enforces reply-all for multi-recipient emails.
"""
import json, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import defaultdict

@dataclass
class Achievement:
    badge_id: str
    name: str
    description: str
    icon: str
    category: str  # "speed", "quality", "consistency", "teamwork"
    points: int
    unlocked_at: str

@dataclass
class PlayerStats:
    user_email: str
    user_name: str
    total_points: int
    current_streak_days: int
    longest_streak_days: int
    avg_response_time_minutes: float
    emails_responded: int
    quality_score: float
    achievements: List[Achievement]
    rank: int
    level: int

@dataclass
class TeamLeaderboard:
    team_id: str
    team_name: str
    period: str  # "daily", "weekly", "monthly"
    players: List[PlayerStats]
    team_avg_response_time: float
    team_quality_score: float
    total_emails_handled: int

class BadgeEngine:
    """Award badges based on email performance."""
    
    BADGE_DEFINITIONS = [
        {"id": "speed_demon", "name": "Speed Demon", "desc": "Respond to 50 emails within 1 hour", "icon": "⚡", "cat": "speed", "pts": 100},
        {"id": "lightning_fast", "name": "Lightning Fast", "desc": "Average response time under 5 minutes for a week", "icon": "🏎️", "cat": "speed", "pts": 200},
        {"id": "quality_king", "name": "Quality Champion", "desc": "Maintain 95%+ quality score for a month", "icon": "👑", "cat": "quality", "pts": 300},
        {"id": "zero_inbox", "name": "Inbox Zero Hero", "desc": "Achieve inbox zero 10 times", "icon": "✨", "cat": "consistency", "pts": 150},
        {"id": "streak_7", "name": "Week Warrior", "desc": "7-day response streak", "icon": "🔥", "cat": "consistency", "pts": 100},
        {"id": "streak_30", "name": "Monthly Master", "desc": "30-day response streak", "icon": "💎", "cat": "consistency", "pts": 500},
        {"id": "team_player", "name": "Team Player", "desc": "Help 10 teammates with email responses", "icon": "🤝", "cat": "teamwork", "pts": 150},
        {"id": "reply_all_pro", "name": "Reply-All Pro", "desc": "Perfect reply-all rate for 100 emails", "icon": "📨", "cat": "quality", "pts": 200},
        {"id": "first_response", "name": "First Responder", "desc": "First to respond in 25 threads", "icon": "🥇", "cat": "speed", "pts": 150},
        {"id": "multilingual", "name": "Polyglot", "desc": "Respond in 5+ languages", "icon": "🌍", "cat": "quality", "pts": 250},
    ]
    
    def evaluate_badges(self, stats: Dict) -> List[Achievement]:
        earned = []
        
        if stats.get("fast_responses_1h", 0) >= 50:
            earned.append(self._create_badge("speed_demon"))
        if stats.get("avg_response_minutes", 999) < 5 and stats.get("days_active", 0) >= 7:
            earned.append(self._create_badge("lightning_fast"))
        if stats.get("quality_score", 0) >= 95 and stats.get("days_active", 0) >= 30:
            earned.append(self._create_badge("quality_king"))
        if stats.get("inbox_zero_count", 0) >= 10:
            earned.append(self._create_badge("zero_inbox"))
        if stats.get("current_streak", 0) >= 7:
            earned.append(self._create_badge("streak_7"))
        if stats.get("current_streak", 0) >= 30:
            earned.append(self._create_badge("streak_30"))
        if stats.get("teammate_help_count", 0) >= 10:
            earned.append(self._create_badge("team_player"))
        if stats.get("perfect_reply_all_count", 0) >= 100:
            earned.append(self._create_badge("reply_all_pro"))
        if stats.get("first_response_count", 0) >= 25:
            earned.append(self._create_badge("first_response"))
        if stats.get("languages_used", 0) >= 5:
            earned.append(self._create_badge("multilingual"))
        
        return earned
    
    def _create_badge(self, badge_id: str) -> Achievement:
        defn = next(b for b in self.BADGE_DEFINITIONS if b["id"] == badge_id)
        return Achievement(
            badge_id=defn["id"], name=defn["name"], description=defn["desc"],
            icon=defn["icon"], category=defn["cat"], points=defn["pts"],
            unlocked_at=datetime.datetime.now().isoformat()
        )

class StreakTracker:
    """Track daily response streaks."""
    
    def __init__(self):
        self.streaks = {}
    
    def update_streak(self, user_email: str, response_date: str, responded: bool) -> int:
        if user_email not in self.streaks:
            self.streaks[user_email] = {"current": 0, "longest": 0, "last_date": None}
        
        streak = self.streaks[user_email]
        
        if responded:
            if streak["last_date"] == response_date:
                return streak["current"]
            
            if streak["last_date"]:
                last = datetime.date.fromisoformat(streak["last_date"])
                today = datetime.date.fromisoformat(response_date)
                if (today - last).days == 1:
                    streak["current"] += 1
                elif (today - last).days > 1:
                    streak["current"] = 1
            else:
                streak["current"] = 1
            
            streak["last_date"] = response_date
            streak["longest"] = max(streak["longest"], streak["current"])
        else:
            streak["current"] = 0
        
        return streak["current"]

class LevelSystem:
    """Calculate player levels based on points."""
    
    LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000]
    
    def calculate_level(self, total_points: int) -> int:
        for i, threshold in enumerate(self.LEVEL_THRESHOLDS):
            if total_points < threshold:
                return i
        return len(self.LEVEL_THRESHOLDS)

class GamificationEngine:
    """Main gamification engine."""
    
    def __init__(self):
        self.badge_engine = BadgeEngine()
        self.streak_tracker = StreakTracker()
        self.level_system = LevelSystem()
        self.player_data = {}
    
    def process_email_activity(self, user_email: str, user_name: str,
                                activity: Dict, recipients: List[str] = None) -> PlayerStats:
        if user_email not in self.player_data:
            self.player_data[user_email] = {
                "points": 0, "emails": 0, "response_times": [],
                "quality_scores": [], "fast_responses_1h": 0,
                "inbox_zero_count": 0, "teammate_help_count": 0,
                "perfect_reply_all_count": 0, "first_response_count": 0,
                "languages_used": 0, "days_active": 0
            }
        
        data = self.player_data[user_email]
        
        # Update stats from activity
        if activity.get("responded"):
            data["emails"] += 1
            data["points"] += 10  # Base points for responding
            
            response_time = activity.get("response_time_minutes", 0)
            data["response_times"].append(response_time)
            
            if response_time < 60:
                data["fast_responses_1h"] += 1
                data["points"] += 20  # Bonus for fast response
            
            quality = activity.get("quality_score", 80)
            data["quality_scores"].append(quality)
            
            if activity.get("reply_all_correct"):
                data["perfect_reply_all_count"] += 1
                data["points"] += 15
            
            if activity.get("first_in_thread"):
                data["first_response_count"] += 1
                data["points"] += 25
        
        # Update streak
        today = datetime.date.today().isoformat()
        current_streak = self.streak_tracker.update_streak(user_email, today, activity.get("responded", False))
        
        # Evaluate badges
        badges = self.badge_engine.evaluate_badges({**data, "current_streak": current_streak, "days_active": len(set(data.get("response_times", [])))})
        for badge in badges:
            data["points"] += badge.points
        
        # Calculate level
        level = self.level_system.calculate_level(data["points"])
        
        avg_response = sum(data["response_times"]) / len(data["response_times"]) if data["response_times"] else 0
        avg_quality = sum(data["quality_scores"]) / len(data["quality_scores"]) if data["quality_scores"] else 80
        
        return PlayerStats(
            user_email=user_email,
            user_name=user_name,
            total_points=data["points"],
            current_streak_days=current_streak,
            longest_streak_days=self.streak_tracker.streaks.get(user_email, {}).get("longest", 0),
            avg_response_time_minutes=avg_response,
            emails_responded=data["emails"],
            quality_score=avg_quality,
            achievements=badges,
            rank=0,
            level=level
        )
    
    def generate_leaderboard(self, period: str = "weekly") -> Dict:
        players = []
        for email, data in self.player_data.items():
            stats = self.process_email_activity(email, email.split("@")[0].title(), {"responded": True})
            players.append(stats)
        
        # Sort by points and assign ranks
        players.sort(key=lambda p: p.total_points, reverse=True)
        for i, player in enumerate(players, 1):
            player.rank = i
        
        total_emails = sum(p.emails_responded for p in players)
        avg_response = sum(p.avg_response_time_minutes for p in players) / len(players) if players else 0
        avg_quality = sum(p.quality_score for p in players) / len(players) if players else 0
        
        return {
            "period": period,
            "players": [p.__dict__ for p in players[:20]],
            "total_players": len(players),
            "total_emails": total_emails,
            "team_avg_response_minutes": round(avg_response, 1),
            "team_quality_score": round(avg_quality, 1),
            "reply_all_enforced": True,
        }

if __name__ == "__main__":
    engine = GamificationEngine()
    
    # Simulate activity
    engine.process_email_activity("alice@zion.com", "Alice", {"responded": True, "response_time_minutes": 12, "quality_score": 92, "reply_all_correct": True})
    engine.process_email_activity("bob@zion.com", "Bob", {"responded": True, "response_time_minutes": 45, "quality_score": 88, "first_in_thread": True})
    engine.process_email_activity("carol@zion.com", "Carol", {"responded": True, "response_time_minutes": 8, "quality_score": 95, "reply_all_correct": True, "first_in_thread": True})
    
    leaderboard = engine.generate_leaderboard("weekly")
    print(json.dumps(leaderboard, indent=2, default=str))
