#!/usr/bin/env python3
"""
V934: Email Gamification Platform
Adds gamification to email workflows with points, badges, and leaderboards.
Rewards productive email habits and boosts engagement through behavioral psychology.
"""

import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict


class EmailGamificationPlatform:
    """Gamify email workflows to boost productivity and engagement."""

    def __init__(self):
        self.user_profiles = {}
        self.badge_definitions = {
            'inbox_zero': {'name': '🏆 Inbox Zero Hero', 'description': 'Achieved inbox zero', 'points': 50},
            'quick_responder': {'name': '⚡ Quick Responder', 'description': 'Replied within 1 hour', 'points': 20},
            'reply_all_master': {'name': '📨 Reply-All Master', 'description': 'Used reply-all correctly 10 times', 'points': 30},
            'concise_communicator': {'name': '✂️ Concise Communicator', 'description': 'Sent 10 emails under 100 words', 'points': 25},
            'streak_7': {'name': '🔥 7-Day Streak', 'description': 'Maintained productivity for 7 days', 'points': 100},
            'team_player': {'name': '🤝 Team Player', 'description': 'Responded to all team emails same day', 'points': 40},
            'accessibility_champion': {'name': '♿ Accessibility Champion', 'description': 'All emails pass accessibility audit', 'points': 35},
            'carbon_conscious': {'name': '🌱 Carbon Conscious', 'description': 'Kept carbon footprint under 100g/week', 'points': 30},
            'meeting_master': {'name': '📅 Meeting Master', 'description': 'Scheduled 5 meetings via email efficiently', 'points': 25},
            'followup_king': {'name': '👑 Follow-Up King', 'description': 'Zero missed follow-ups for 30 days', 'points': 75},
        }
        self.leaderboard = []

    def process_email_action(self, user_id: str, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process an email action and award points/badges."""
        # Ensure user profile exists
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'points': 0,
                'level': 1,
                'badges': [],
                'streak': 0,
                'last_activity': None,
                'stats': {
                    'emails_sent': 0,
                    'emails_responded': 0,
                    'avg_response_time_minutes': None,
                    'inbox_zero_count': 0,
                    'reply_all_correct': 0,
                    'concise_emails': 0,
                    'accessibility_passes': 0
                },
                'history': []
            }

        profile = self.user_profiles[user_id]
        action_type = email_data.get('action', 'send')  # send, respond, read
        body = email_data.get('body', '')
        recipients = email_data.get('recipients', [])
        response_time_minutes = email_data.get('response_time_minutes', None)
        is_reply_all = email_data.get('is_reply_all', False)
        accessibility_score = email_data.get('accessibility_score', None)
        inbox_count = email_data.get('current_inbox_count', None)

        points_earned = 0
        badges_earned = []
        achievements = []

        # Award points based on action
        if action_type == 'respond':
            profile['stats']['emails_responded'] += 1
            points_earned += 5  # Base response points

            # Quick response bonus
            if response_time_minutes is not None:
                profile['stats']['avg_response_time_minutes'] = response_time_minutes
                if response_time_minutes <= 30:
                    points_earned += 15
                    achievements.append("⚡ Lightning fast response!")
                elif response_time_minutes <= 60:
                    points_earned += 10
                    achievements.append("Quick response - well done!")
                elif response_time_minutes <= 240:
                    points_earned += 5

                # Badge: Quick Responder
                if response_time_minutes <= 60 and 'quick_responder' not in profile['badges']:
                    badges_earned.append('quick_responder')

            # Reply-all bonus
            if is_reply_all and len(recipients) > 1:
                profile['stats']['reply_all_correct'] += 1
                points_earned += 3
                if profile['stats']['reply_all_correct'] >= 10 and 'reply_all_master' not in profile['badges']:
                    badges_earned.append('reply_all_master')

        elif action_type == 'send':
            profile['stats']['emails_sent'] += 1
            points_earned += 3  # Base send points

            # Concise email bonus
            word_count = len(body.split())
            if word_count <= 100 and word_count > 10:
                profile['stats']['concise_emails'] += 1
                points_earned += 5
                achievements.append("✂️ Nice and concise!")
                if profile['stats']['concise_emails'] >= 10 and 'concise_communicator' not in profile['badges']:
                    badges_earned.append('concise_communicator')

        # Accessibility bonus
        if accessibility_score is not None and accessibility_score >= 90:
            profile['stats']['accessibility_passes'] += 1
            points_earned += 5
            if 'accessibility_champion' not in profile['badges']:
                badges_earned.append('accessibility_champion')

        # Inbox zero check
        if inbox_count is not None and inbox_count == 0:
            profile['stats']['inbox_zero_count'] += 1
            points_earned += 20
            achievements.append("🏆 Inbox Zero achieved!")
            if 'inbox_zero' not in profile['badges']:
                badges_earned.append('inbox_zero')

        # Update streak
        now = datetime.now()
        if profile['last_activity']:
            last = datetime.fromisoformat(profile['last_activity'])
            if (now - last).days == 1:
                profile['streak'] += 1
            elif (now - last).days > 1:
                profile['streak'] = 1
        else:
            profile['streak'] = 1

        profile['last_activity'] = now.isoformat()

        # Streak badge
        if profile['streak'] >= 7 and 'streak_7' not in profile['badges']:
            badges_earned.append('streak_7')
            achievements.append("🔥 7-day productivity streak!")

        # Award badge points
        for badge_id in badges_earned:
            badge = self.badge_definitions[badge_id]
            profile['badges'].append(badge_id)
            points_earned += badge['points']
            achievements.append(f"🏅 Badge earned: {badge['name']}")

        # Update total points and level
        profile['points'] += points_earned
        profile['level'] = (profile['points'] // 100) + 1

        # Record history
        profile['history'].append({
            'timestamp': now.isoformat(),
            'action': action_type,
            'points': points_earned,
            'badges': badges_earned
        })

        # Update leaderboard
        self._update_leaderboard(user_id)

        return {
            'user_id': user_id,
            'points_earned': points_earned,
            'total_points': profile['points'],
            'level': profile['level'],
            'badges_earned': [self.badge_definitions[b]['name'] for b in badges_earned],
            'all_badges': [self.badge_definitions[b]['name'] for b in profile['badges']],
            'streak': profile['streak'],
            'achievements': achievements,
            'leaderboard_position': self._get_position(user_id),
            'next_badge': self._get_next_badge(profile),
            'reply_all_required': len(recipients) > 1
        }

    def _update_leaderboard(self, user_id: str):
        """Update the leaderboard."""
        self.leaderboard = sorted(
            self.user_profiles.items(),
            key=lambda x: x[1]['points'],
            reverse=True
        )

    def _get_position(self, user_id: str) -> int:
        """Get user's position on leaderboard."""
        for i, (uid, _) in enumerate(self.leaderboard):
            if uid == user_id:
                return i + 1
        return len(self.leaderboard) + 1

    def _get_next_badge(self, profile: Dict) -> Optional[str]:
        """Get the next badge the user is closest to earning."""
        for badge_id, badge in self.badge_definitions.items():
            if badge_id not in profile['badges']:
                return badge['name']
        return None

    def get_leaderboard(self, top_n: int = 10) -> List[Dict]:
        """Get the top N leaderboard."""
        results = []
        for i, (uid, prof) in enumerate(self.leaderboard[:top_n]):
            results.append({
                'position': i + 1,
                'user_id': uid,
                'points': prof['points'],
                'level': prof['level'],
                'badges': len(prof['badges']),
                'streak': prof['streak']
            })
        return results


def main():
    """Test the Gamification Platform."""
    platform = EmailGamificationPlatform()

    # Simulate email actions for multiple users
    actions = [
        ('user_alice', {
            'action': 'respond', 'body': 'Thanks, will do!',
            'recipients': ['bob@example.com', 'carol@example.com'],
            'response_time_minutes': 15, 'is_reply_all': True,
            'accessibility_score': 95, 'current_inbox_count': 0
        }),
        ('user_bob', {
            'action': 'send', 'body': 'Quick update on the project status. ' * 5,
            'recipients': ['team@example.com'],
            'response_time_minutes': None, 'is_reply_all': False,
            'accessibility_score': 85, 'current_inbox_count': 12
        }),
        ('user_alice', {
            'action': 'send', 'body': 'Here is the concise update for the team.',
            'recipients': ['bob@example.com', 'carol@example.com', 'dave@example.com'],
            'response_time_minutes': None, 'is_reply_all': True,
            'accessibility_score': 92, 'current_inbox_count': 3
        }),
        ('user_carol', {
            'action': 'respond', 'body': 'Great work everyone. The quarterly numbers look fantastic and I am very pleased with the team performance.',
            'recipients': ['alice@example.com'],
            'response_time_minutes': 45, 'is_reply_all': False,
            'accessibility_score': 88, 'current_inbox_count': 5
        })
    ]

    print("=" * 60)
    print("V934: Email Gamification Platform - Test Results")
    print("=" * 60)

    for user_id, action in actions:
        result = platform.process_email_action(user_id, action)
        print(f"\n{user_id}:")
        print(f"  Points Earned: +{result['points_earned']} (Total: {result['total_points']})")
        print(f"  Level: {result['level']} | Streak: {result['streak']} days")
        if result['badges_earned']:
            print(f"  🏅 New Badges: {', '.join(result['badges_earned'])}")
        for a in result['achievements']:
            print(f"  {a}")
        print(f"  Leaderboard: #{result['leaderboard_position']}")

    print(f"\n{'='*60}")
    print("Leaderboard:")
    for entry in platform.get_leaderboard():
        print(f"  #{entry['position']} {entry['user_id']}: {entry['points']}pts, Lv{entry['level']}, {entry['badges']} badges, {entry['streak']}🔥")

    print(f"\n✅ V934 Email Gamification Platform: OPERATIONAL")


if __name__ == '__main__':
    main()
