"""
V391 - Email Smart Reply Generator
Generates context-aware reply suggestions based on email content,
relationship history, and tone. Offers multiple reply options
(brief, detailed, formal, casual).
"""

import json
import hashlib
from datetime import datetime, timezone


def analyze_email_tone(content):
    """Analyze the tone of an email based on linguistic cues."""
    formal_indicators = ["dear", "sincerely", "regards", "please find", "kindly", "respectfully",
                         "would you be so kind", "at your earliest convenience", "please advise"]
    casual_indicators = ["hey", "hi", "thanks!", "btw", "lol", "sounds good",
                         "no worries", "cheers", "np", "sure thing"]
    urgent_indicators = ["asap", "urgent", "immediately", "deadline", "critical", "time-sensitive",
                         "eod", "by end of day", "need this today"]
    positive_indicators = ["great", "excellent", "wonderful", "thank you", "appreciate",
                           "looking forward", "excited", "fantastic"]
    negative_indicators = ["disappointed", "concern", "issue", "problem", "unfortunately",
                           "however", "but", "unacceptable", "frustrated"]

    lower_content = content.lower()
    scores = {
        "formal": sum(1 for ind in formal_indicators if ind in lower_content),
        "casual": sum(1 for ind in casual_indicators if ind in lower_content),
        "urgent": sum(1 for ind in urgent_indicators if ind in lower_content),
        "positive": sum(1 for ind in positive_indicators if ind in lower_content),
        "negative": sum(1 for ind in negative_indicators if ind in lower_content),
    }

    dominant_tone = max(scores, key=scores.get) if any(scores.values()) else "neutral"
    return {"scores": scores, "dominant_tone": dominant_tone}


def get_relationship_context(sender, recipient, history):
    """Determine relationship context from interaction history."""
    interaction_count = history.get("email_count", 0)
    avg_response_time = history.get("avg_response_hours", 24)
    relationship_type = history.get("relationship_type", "professional")

    if interaction_count > 50:
        familiarity = "high"
    elif interaction_count > 10:
        familiarity = "medium"
    else:
        familiarity = "low"

    return {
        "familiarity": familiarity,
        "relationship_type": relationship_type,
        "avg_response_time_hours": avg_response_time,
        "interaction_count": interaction_count,
    }


def extract_email_topics(content):
    """Extract key topics from email content for reply generation."""
    question_indicators = ["?", "could you", "would you", "can you", "do you",
                           "what", "when", "where", "how", "why", "who"]
    action_indicators = ["please", "need", "request", "submit", "review", "approve",
                         "schedule", "confirm", "update", "send"]

    lower_content = content.lower()
    has_questions = any(ind in lower_content for ind in question_indicators)
    has_action_items = any(ind in lower_content for ind in action_indicators)

    sentences = [s.strip() for s in content.replace("?", "?.").replace("!", "!.").split(".") if s.strip()]

    return {
        "has_questions": has_questions,
        "has_action_items": has_action_items,
        "sentence_count": len(sentences),
        "key_sentences": sentences[:5],
    }


def generate_reply_options(email_data, tone_analysis, relationship_ctx, topics):
    """Generate multiple reply options based on analysis."""
    sender = email_data.get("sender", "unknown")
    subject = email_data.get("subject", "")
    content = email_data.get("content", "")

    sender_first = sender.split("@")[0].split(".")[0].capitalize() if "@" in sender else sender

    replies = {}

    # Brief reply
    if topics["has_questions"]:
        brief = f"Hi {sender_first}, Thanks for reaching out. Let me look into this and get back to you shortly."
    elif topics["has_action_items"]:
        brief = f"Hi {sender_first}, Got it. I'll take care of this and keep you posted."
    else:
        brief = f"Hi {sender_first}, Thanks for the update. Noted."
    replies["brief"] = {"text": brief, "word_count": len(brief.split()), "style": "brief"}

    # Detailed reply
    if topics["has_questions"]:
        detailed = (f"Hi {sender_first},\n\nThank you for your email regarding '{subject}'. "
                    f"I've reviewed your questions and here are my thoughts:\n\n"
                    f"1. I'll need to gather some additional information before providing a complete answer.\n"
                    f"2. I'll consult with the relevant team members to ensure accuracy.\n"
                    f"3. You can expect a comprehensive response within 24-48 hours.\n\n"
                    f"Please let me know if there's anything else I can assist with in the meantime.\n\nBest regards")
    elif topics["has_action_items"]:
        detailed = (f"Hi {sender_first},\n\nThank you for your email. I've noted the action items:\n\n"
                    f"- I'll begin working on the requested tasks immediately.\n"
                    f"- I'll provide progress updates as I complete each item.\n"
                    f"- If I encounter any blockers, I'll reach out promptly.\n\n"
                    f"Expected completion timeline: within this week.\n\nBest regards")
    else:
        detailed = (f"Hi {sender_first},\n\nThank you for sharing this information. "
                    f"I've reviewed the content and appreciate the update.\n\n"
                    f"A few observations:\n"
                    f"- The points raised are well noted.\n"
                    f"- I'll incorporate this into our ongoing work.\n"
                    f"- I'll follow up if any questions arise.\n\nBest regards")
    replies["detailed"] = {"text": detailed, "word_count": len(detailed.split()), "style": "detailed"}

    # Formal reply
    formal = (f"Dear {sender_first},\n\n"
              f"Thank you for your correspondence regarding '{subject}'. "
              f"I acknowledge receipt of your message and appreciate the information provided.\n\n"
              f"I will review the matter thoroughly and respond with a detailed analysis "
              f"at the earliest opportunity.\n\n"
              f"Should you require any immediate assistance, please do not hesitate to contact me.\n\n"
              f"Kind regards")
    replies["formal"] = {"text": formal, "word_count": len(formal.split()), "style": "formal"}

    # Casual reply
    if tone_analysis["dominant_tone"] in ("casual", "positive"):
        casual = f"Hey {sender_first}! Thanks for this — I'm on it. Will circle back soon 👍"
    else:
        casual = f"Hey {sender_first}, Thanks for the email! Let me check on this and get back to you."
    replies["casual"] = {"text": casual, "word_count": len(casual.split()), "style": "casual"}

    return replies


def check_reply_all_required(recipients):
    """Check if reply-all is required for multi-recipient emails."""
    to_list = recipients.get("to", [])
    cc_list = recipients.get("cc", [])
    all_recipients = to_list + cc_list
    return len(all_recipients) > 1


def generate_smart_replies(email_data):
    """Main engine: generate smart reply suggestions for an email."""
    content = email_data.get("content", "")
    sender = email_data.get("sender", "")
    recipients = email_data.get("recipients", {"to": [], "cc": []})
    relationship_history = email_data.get("relationship_history", {})

    tone_analysis = analyze_email_tone(content)
    relationship_ctx = get_relationship_context(sender, list(recipients.get("to", ["unknown"]))[0], relationship_history)
    topics = extract_email_topics(content)

    reply_options = generate_reply_options(email_data, tone_analysis, relationship_ctx, topics)

    reply_all_required = check_reply_all_required(recipients)
    reply_all_enforced = reply_all_required

    all_recipients = recipients.get("to", []) + recipients.get("cc", [])
    for style, reply in reply_options.items():
        reply["reply_all"] = reply_all_enforced
        if reply_all_enforced:
            reply["recipients"] = all_recipients

    result = {
        "version": "V391",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "engine": "Email Smart Reply Generator",
        "reply_all_required": reply_all_required,
        "reply_all_enforced": reply_all_enforced,
        "email_analysis": {
            "sender": sender,
            "subject": email_data.get("subject", ""),
            "tone_analysis": tone_analysis,
            "relationship_context": relationship_ctx,
            "topics": topics,
        },
        "reply_options": reply_options,
        "recommended_reply": "detailed" if tone_analysis["dominant_tone"] == "formal" else
                             "brief" if tone_analysis["dominant_tone"] == "casual" else
                             "formal" if relationship_ctx["familiarity"] == "low" else "casual",
        "reply_all_recipients": all_recipients if reply_all_enforced else [],
    }

    return result


def main():
    """Run the Email Smart Reply Generator with sample data."""
    sample_email = {
        "sender": "alice.johnson@techcorp.com",
        "subject": "Q3 Budget Review - Action Items",
        "content": (
            "Dear Team,\n\n"
            "I hope this email finds you well. I wanted to follow up on our discussion "
            "regarding the Q3 budget review. Could you please provide the updated cost "
            "projections by end of day Friday? Additionally, we need to review the "
            "marketing spend allocation and ensure alignment with our strategic goals.\n\n"
            "Please also confirm whether the engineering team has submitted their resource "
            "requests. This is time-sensitive as we need to finalize before the board meeting.\n\n"
            "Thank you for your attention to this matter.\n\n"
            "Best regards,\nAlice Johnson\nVP of Finance"
        ),
        "recipients": {
            "to": ["bob.smith@techcorp.com", "carol.davis@techcorp.com"],
            "cc": ["david.lee@techcorp.com"]
        },
        "relationship_history": {
            "email_count": 35,
            "avg_response_hours": 8,
            "relationship_type": "professional"
        }
    }

    sample_email_2 = {
        "sender": "mike@startup.io",
        "subject": "Coffee next week?",
        "content": (
            "Hey! Great catching up at the conference last week. "
            "Would you be down to grab coffee sometime next week? "
            "I have some cool ideas to share about that project we talked about. "
            "No worries if you're swamped — just let me know!\n\nCheers, Mike"
        ),
        "recipients": {
            "to": ["bob.smith@techcorp.com"],
            "cc": []
        },
        "relationship_history": {
            "email_count": 5,
            "avg_response_hours": 4,
            "relationship_type": "casual"
        }
    }

    sample_email_3 = {
        "sender": "hr@company.com",
        "subject": "Updated PTO Policy - Please Review",
        "content": (
            "Dear All,\n\nPlease find attached the updated PTO policy document. "
            "Key changes include additional flex days and updated carry-over rules. "
            "Please review and submit any questions by March 15th.\n\nRegards, HR Team"
        ),
        "recipients": {
            "to": ["bob.smith@techcorp.com", "carol.davis@techcorp.com", "eve.wilson@techcorp.com"],
            "cc": ["manager@techcorp.com"]
        },
        "relationship_history": {
            "email_count": 120,
            "avg_response_hours": 48,
            "relationship_type": "formal"
        }
    }

    samples = [sample_email, sample_email_2, sample_email_3]

    print("=" * 70)
    print("V391 - Email Smart Reply Generator")
    print("=" * 70)

    for i, email in enumerate(samples, 1):
        print(f"\n--- Email {i}: {email['subject']} ---")
        result = generate_smart_replies(email)
        print(json.dumps(result, indent=2))
        print()


if __name__ == "__main__":
    main()
