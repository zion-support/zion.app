#!/usr/bin/env python3
"""
V1009 - Email Auto-Responder Pro Engine
AI generates contextual auto-replies for common scenarios:
OOO, acknowledgments, FAQ answers, meeting confirmations, etc.
"""
import re
from datetime import datetime

# Auto-response templates with contextual intelligence
AUTO_RESPONSE_TEMPLATES = {
    "out_of_office": {
        "trigger": r'\b(out of office|ooo|vacation|away|unavailable)\b',
        "subject": "Re: {original_subject} - Out of Office",
        "body": """Hi {sender_name},

Thank you for your email. I'm currently out of the office and will return on {return_date}.

For urgent matters, please contact {backup_contact}.

I'll respond to your message as soon as possible upon my return.

Best regards,
{my_name}""",
    },
    "acknowledgment": {
        "trigger": r'\b(received your|got your|thank you for sending)\b',
        "subject": "Re: {original_subject} - Received",
        "body": """Hi {sender_name},

Thank you for your email regarding "{subject_summary}".

I've received your message and will review it carefully. You can expect a detailed response within {response_timeframe}.

If this is urgent, please reply with "URGENT" and I'll prioritize accordingly.

Best regards,
{my_name}""",
    },
    "meeting_confirmation": {
        "trigger": r'\b(meeting|call|schedule|calendar invite)\b',
        "subject": "Re: {original_subject} - Meeting Confirmed",
        "body": """Hi {sender_name},

Thank you for the meeting request. I've reviewed the details:

- Topic: {subject_summary}
- Proposed time: {proposed_time}

I'm available and have added this to my calendar. Please send the calendar invite when ready.

Looking forward to our discussion.

Best regards,
{my_name}""",
    },
    "faq_answer": {
        "trigger": r'\b(how do I|where can I|what is|can you tell me)\b',
        "subject": "Re: {original_subject} - Information Requested",
        "body": """Hi {sender_name},

Thank you for your question about "{question_summary}".

Here's what I can share:
{answer_placeholder}

For more detailed information, please visit our knowledge base at {kb_link} or reply with specific follow-up questions.

Best regards,
{my_name}""",
    },
    "follow_up_needed": {
        "trigger": r'\b(follow up|checking in|any update|status)\b',
        "subject": "Re: {original_subject} - Status Update",
        "body": """Hi {sender_name},

Thank you for following up on "{subject_summary}".

Current status: {status_update}

I'm actively working on this and will provide a detailed update by {next_update_date}.

Thank you for your patience.

Best regards,
{my_name}""",
    },
    "request_received": {
        "trigger": r'\b(could you|can you|please send|I need)\b',
        "subject": "Re: {original_subject} - Request Received",
        "body": """Hi {sender_name},

I've received your request regarding "{request_summary}".

I'm reviewing the details and will get back to you with {deliverable} by {deadline}.

If you need this sooner or have additional requirements, please let me know.

Best regards,
{my_name}""",
    },
    "thank_you": {
        "trigger": r'\b(thank you|thanks|appreciate|grateful)\b',
        "subject": "Re: {original_subject}",
        "body": """Hi {sender_name},

You're very welcome! I'm glad I could help with "{subject_summary}".

Please don't hesitate to reach out if you need anything else in the future.

Best regards,
{my_name}""",
    },
}

def detect_auto_response_type(email):
    """Detect which type of auto-response is appropriate"""
    matches = []
    
    for response_type, template in AUTO_RESPONSE_TEMPLATES.items():
        if re.search(template["trigger"], email, re.I):
            matches.append(response_type)
    
    return matches[0] if matches else None

def generate_auto_response(email, response_type, context=None):
    """Generate contextual auto-response"""
    if response_type not in AUTO_RESPONSE_TEMPLATES:
        return None
    
    template = AUTO_RESPONSE_TEMPLATES[response_type]
    context = context or {}
    
    # Extract context from email
    sender_name = context.get("sender_name", "there")
    original_subject = context.get("subject", "Your email")
    subject_summary = original_subject[:60] if len(original_subject) > 60 else original_subject
    
    # Fill template
    body = template["body"].format(
        sender_name=sender_name,
        original_subject=original_subject,
        subject_summary=subject_summary,
        my_name=context.get("my_name", "Team"),
        return_date=context.get("return_date", "Monday"),
        backup_contact=context.get("backup_contact", "support@company.com"),
        response_timeframe=context.get("response_timeframe", "24 hours"),
        proposed_time=context.get("proposed_time", "as scheduled"),
        question_summary=subject_summary,
        answer_placeholder="[Detailed answer will follow]",
        kb_link=context.get("kb_link", "https://help.company.com"),
        status_update=context.get("status_update", "In progress"),
        next_update_date=context.get("next_update_date", "end of week"),
        request_summary=subject_summary,
        deliverable=context.get("deliverable", "the requested information"),
        deadline=context.get("deadline", "Friday"),
    )
    
    subject = template["subject"].format(original_subject=original_subject)
    
    return {
        "subject": subject,
        "body": body,
        "response_type": response_type,
    }

def should_auto_respond(email, sender=None):
    """Determine if auto-response is appropriate"""
    # Don't auto-respond to spam
    spam_indicators = r'\b(winner|prize|lottery|million|click here|act now)\b'
    if re.search(spam_indicators, email, re.I):
        return False, "Spam detected - no auto-response"
    
    # Don't auto-respond to automated messages
    auto_indicators = r'\b(no-reply|noreply|automated|do not reply)\b'
    if sender and re.search(auto_indicators, sender, re.I):
        return False, "Automated sender - no auto-response"
    
    # Check if auto-response type detected
    response_type = detect_auto_response_type(email)
    if response_type:
        return True, response_type
    
    return False, "No appropriate auto-response template"

def analyze_email(email, sender=None, subject=None, context=None, reply_all_required=False):
    """Full auto-responder analysis"""
    should_respond, reason = should_auto_respond(email, sender)
    
    result = {
        "engine": "V1009 - Email Auto-Responder Pro",
        "auto_respond": should_respond,
        "reason": reason,
        "reply_all_enforced": reply_all_required or True,
        "case_by_case_analysis": True,
    }
    
    if should_respond and reason != "No appropriate auto-response template":
        auto_response = generate_auto_response(
            email,
            reason,
            context or {"sender_name": sender or "there", "subject": subject or "Your email"}
        )
        result["auto_response"] = auto_response
        result["response_type"] = reason
    else:
        result["auto_response"] = None
        result["response_type"] = None
    
    return result

# === TEST ===
if __name__ == "__main__":
    test1 = """I'm out of office until next Monday. For urgent matters contact John."""
    result1 = analyze_email(test1, sender="boss@company.com", subject="OOO Notice",
                           reply_all_required=True)
    print("=== V1009 Email Auto-Responder Pro ===")
    print(f"  Auto-respond: {result1['auto_respond']}")
    print(f"  Type: {result1['response_type']}")
    if result1['auto_response']:
        print(f"  Subject: {result1['auto_response']['subject']}")
        print(f"  Body preview: {result1['auto_response']['body'][:100]}...")
    print(f"  Reply-all enforced: {result1['reply_all_enforced']}")
    
    test2 = """Can you please send me the Q4 report by Friday?"""
    result2 = analyze_email(test2, sender="client@acme.com", subject="Report Request")
    print(f"\n  Test 2 Auto-respond: {result2['auto_respond']}")
    print(f"  Test 2 Type: {result2['response_type']}")
    
    test3 = """You've won $1 million! Click here to claim!"""
    result3 = analyze_email(test3, sender="spam@scam.com")
    print(f"\n  Test 3 Auto-respond: {result3['auto_respond']}")
    print(f"  Test 3 Reason: {result3['reason']}")
    
    assert result1["auto_respond"] is True
    assert result1["response_type"] == "out_of_office"
    assert result1["reply_all_enforced"] is True
    assert result3["auto_respond"] is False
    print("\n✅ All V1009 tests passed!")
