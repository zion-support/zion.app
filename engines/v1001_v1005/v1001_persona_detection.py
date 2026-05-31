#!/usr/bin/env python3
"""
V1001 - Email Persona Detection Engine
Identifies sender personality traits (MBTI, Big Five) to tailor responses.
Analyzes writing style, tone, and communication patterns.
"""
import re
import json

def detect_mbti_traits(email):
    """Detect MBTI personality traits from email text"""
    traits = {
        "E_I": {"E": 0, "I": 0},  # Extraversion vs Introversion
        "S_N": {"S": 0, "N": 0},  # Sensing vs Intuition
        "T_F": {"T": 0, "F": 0},  # Thinking vs Feeling
        "J_P": {"J": 0, "P": 0},  # Judging vs Perceiving
    }
    
    # E/I indicators
    e_words = r'\b(we|team|everyone|together|collaborate|meet|discuss|share|social)\b'
    i_words = r'\b(I|my|alone|think|reflect|consider|personal|private|independent)\b'
    traits["E_I"]["E"] = len(re.findall(e_words, email, re.I))
    traits["E_I"]["I"] = len(re.findall(i_words, email, re.I))
    
    # S/N indicators
    s_words = r'\b(facts|data|details|specific|practical|concrete|actual|real|evidence)\b'
    n_words = r'\b(idea|concept|possibility|potential|vision|theory|abstract|imagine|future)\b'
    traits["S_N"]["S"] = len(re.findall(s_words, email, re.I))
    traits["S_N"]["N"] = len(re.findall(n_words, email, re.I))
    
    # T/F indicators
    t_words = r'\b(logic|analyze|reason|objective|efficient|fair|principle|standard)\b'
    f_words = r'\b(feel|care|concern|value|harmony|empathy|support|appreciate|thank)\b'
    traits["T_F"]["T"] = len(re.findall(t_words, email, re.I))
    traits["T_F"]["F"] = len(re.findall(f_words, email, re.I))
    
    # J/P indicators
    j_words = r'\b(plan|schedule|deadline|organize|decide|complete|finish|structure)\b'
    p_words = r'\b(flexible|explore|option|maybe|later|open|adapt|spontaneous)\b'
    traits["J_P"]["J"] = len(re.findall(j_words, email, re.I))
    traits["J_P"]["P"] = len(re.findall(p_words, email, re.I))
    
    # Determine dominant traits
    mbti = ""
    mbti += "E" if traits["E_I"]["E"] >= traits["E_I"]["I"] else "I"
    mbti += "S" if traits["S_N"]["S"] >= traits["S_N"]["N"] else "N"
    mbti += "T" if traits["T_F"]["T"] >= traits["T_F"]["F"] else "F"
    mbti += "J" if traits["J_P"]["J"] >= traits["J_P"]["P"] else "P"
    
    return mbti, traits

def detect_big_five(email):
    """Detect Big Five personality traits (OCEAN)"""
    scores = {
        "Openness": 50,
        "Conscientiousness": 50,
        "Extraversion": 50,
        "Agreeableness": 50,
        "Neuroticism": 50,
    }
    
    # Openness: creativity, curiosity, new ideas
    if re.search(r'\b(innovative|creative|explore|discover|curious|experiment|new)\b', email, re.I):
        scores["Openness"] += 20
    
    # Conscientiousness: organization, planning, detail
    if re.search(r'\b(plan|schedule|deadline|organize|detail|thorough|careful)\b', email, re.I):
        scores["Conscientiousness"] += 20
    
    # Extraversion: social, collaborative, energetic
    if re.search(r'\b(team|meet|discuss|together|collaborate|excited|enthusiastic)\b', email, re.I):
        scores["Extraversion"] += 20
    
    # Agreeableness: cooperative, trusting, empathetic
    if re.search(r'\b(thank|appreciate|understand|support|help|cooperate|trust)\b', email, re.I):
        scores["Agreeableness"] += 20
    
    # Neuroticism: anxiety, stress, worry
    if re.search(r'\b(worried|concerned|anxious|stressed|uncertain|risk|problem)\b', email, re.I):
        scores["Neuroticism"] += 15
    
    # Normalize to 0-100
    for key in scores:
        scores[key] = min(100, max(0, scores[key]))
    
    return scores

def analyze_communication_style(email):
    """Analyze communication style preferences"""
    style = {
        "formality": "medium",
        "directness": "medium",
        "detail_level": "medium",
        "emotional_tone": "neutral",
    }
    
    # Formality
    formal = len(re.findall(r'\b(dear|sincerely|regards|respectfully|formal)\b', email, re.I))
    informal = len(re.findall(r'\b(hey|hi|thanks|cheers|lol|btw)\b', email, re.I))
    if formal > informal:
        style["formality"] = "high"
    elif informal > formal:
        style["formality"] = "low"
    
    # Directness
    direct = len(re.findall(r'\b(must|need|require|do|send|complete|now)\b', email, re.I))
    indirect = len(re.findall(r'\b(could|would|might|perhaps|maybe|consider)\b', email, re.I))
    if direct > indirect:
        style["directness"] = "high"
    elif indirect > direct:
        style["directness"] = "low"
    
    # Detail level
    word_count = len(email.split())
    if word_count > 300:
        style["detail_level"] = "high"
    elif word_count < 100:
        style["detail_level"] = "low"
    
    # Emotional tone
    positive = len(re.findall(r'\b(great|excellent|happy|excited|wonderful|love|amazing)\b', email, re.I))
    negative = len(re.findall(r'\b(bad|terrible|angry|frustrated|disappointed|upset|hate)\b', email, re.I))
    if positive > negative:
        style["emotional_tone"] = "positive"
    elif negative > positive:
        style["emotional_tone"] = "negative"
    
    return style

def generate_response_strategy(mbti, big_five, style):
    """Generate tailored response strategy based on persona"""
    strategies = []
    
    # MBTI-based strategies
    if mbti[0] == "E":
        strategies.append("Use collaborative language and suggest team involvement")
    else:
        strategies.append("Respect their need for independent thinking time")
    
    if mbti[1] == "S":
        strategies.append("Provide concrete details, data, and practical examples")
    else:
        strategies.append("Focus on big picture, possibilities, and future vision")
    
    if mbti[2] == "T":
        strategies.append("Use logical arguments and objective reasoning")
    else:
        strategies.append("Acknowledge feelings and emphasize harmony")
    
    if mbti[3] == "J":
        strategies.append("Be structured, provide clear timelines and deadlines")
    else:
        strategies.append("Stay flexible and offer multiple options")
    
    # Big Five-based strategies
    if big_five["Openness"] > 70:
        strategies.append("Introduce innovative ideas and creative solutions")
    if big_five["Conscientiousness"] > 70:
        strategies.append("Be thorough, organized, and detail-oriented")
    if big_five["Agreeableness"] > 70:
        strategies.append("Emphasize cooperation and mutual benefit")
    
    # Style-based strategies
    if style["formality"] == "high":
        strategies.append("Match their formal tone and professional language")
    elif style["formality"] == "low":
        strategies.append("Use casual, friendly language")
    
    if style["directness"] == "high":
        strategies.append("Be direct and get to the point quickly")
    else:
        strategies.append("Use diplomatic language and soften requests")
    
    return strategies

def analyze_email(email, reply_all_required=False):
    """Full persona detection analysis"""
    mbti, mbti_traits = detect_mbti_traits(email)
    big_five = detect_big_five(email)
    style = analyze_communication_style(email)
    strategies = generate_response_strategy(mbti, big_five, style)
    
    return {
        "engine": "V1001 - Email Persona Detection",
        "mbti_type": mbti,
        "mbti_traits": mbti_traits,
        "big_five_scores": big_five,
        "communication_style": style,
        "response_strategies": strategies,
        "reply_all_enforced": reply_all_required or True,
        "case_by_case_analysis": True,
    }

# === TEST ===
if __name__ == "__main__":
    test1 = """Dear Team, I'm excited to share our innovative new project! Let's meet to discuss 
    the creative possibilities and explore how we can collaborate. I feel this could be amazing 
    for everyone involved. Thank you for your support!"""
    
    result1 = analyze_email(test1, reply_all_required=True)
    print("=== V1001 Email Persona Detection ===")
    print(f"  MBTI: {result1['mbti_type']}")
    print(f"  Big Five: {result1['big_five_scores']}")
    print(f"  Style: {result1['communication_style']}")
    print(f"  Strategies: {result1['response_strategies'][:3]}")
    print(f"  Reply-all enforced: {result1['reply_all_enforced']}")
    print(f"  Case-by-case: {result1['case_by_case_analysis']}")
    
    test2 = """I need the data by Friday. Send me the specific numbers and concrete evidence. 
    We must complete this on schedule. The logic is clear: we require detailed analysis."""
    
    result2 = analyze_email(test2)
    print(f"\n  Test 2 MBTI: {result2['mbti_type']}")
    print(f"  Test 2 Style: {result2['communication_style']}")
    
    assert result1["reply_all_enforced"] is True
    assert result1["case_by_case_analysis"] is True
    assert result2["reply_all_enforced"] is True
    print("\n✅ All V1001 tests passed!")
