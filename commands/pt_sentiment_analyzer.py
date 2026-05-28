#!/usr/bin/env python3
"""
Advanced Portuguese Sentiment Analyzer - V2

Enhanced sentiment detection for Brazilian business:
- Portuguese/English code-switching
- Brazilian business formality levels
- Relationship-aware tone matching
"""

import re
from typing import Dict, Tuple

class PortugueseSentimentAnalyzer:
    """Advanced sentiment and tone analysis for Brazilian business context"""
    
    PORTUGUESE_POSITIVE = {
        'obrigado', 'obrigada', 'muito obrigado', 'agradeço', 'agradecimento',
        'excelente', 'ótimo', 'ótima', 'maravilhoso', 'maravilhosa',
        'perfeito', 'perfeita', 'excelência', 'parabéns', 'parabéns mesmo',
        'adorei', 'amei', 'top', 'bacana', 'legal', 'show',
        'sucesso', 'parceria', 'colaboração', 'excelente trabalho'
    }
    
    PORTUGUESE_NEGATIVE = {
        'problema', 'problema grave', 'erro', 'erro crítico', 'falha',
        'urgente', 'urgência', 'imediato', 'agora', 'já',
        'preocupado', 'preocupada', 'preocupação', 'difícil',
        'reclamação', 'reclamar', 'insatisfeito', 'insatisfeita',
        'atraso', 'atrasado', 'demorou', 'demora', 'lento'
    }
    
    ENGLISH_POSITIVE = {
        'thank', 'thanks', 'thank you', 'appreciate', 'great', 'excellent',
        'perfect', 'awesome', 'wonderful', 'fantastic', 'congratulations',
        'congrats', 'good job', 'well done', 'success', 'partnership'
    }
    
    ENGLISH_NEGATIVE = {
        'urgent', 'urgently', 'asap', 'immediately', 'problem', 'error',
        'issue', 'concerned', 'worried', 'complaint', 'difficult', 'delay',
        'late', 'slow', 'failure', 'failed', 'critical', 'important'
    }
    
    FORMALITY_INDICATORS = {
        'formal': ['prezado', 'prezada', 'atenciosamente', 'respeitosamente', 
                   'cordialmente', 'saudações', 'sr.', 'sra.', 'dr.', 'dra.'],
        'informal': ['oi', 'olá', 'td bem', 'tudo bem', 'fala', 'e aí', 'beleza']
    }
    
    def analyze(self, text: str) -> Dict:
        """Analyze text and return sentiment, formality, and language"""
        text_lower = text.lower()
        
        # Count Portuguese indicators
        pt_score = sum(1 for word in self.PORTUGUESE_POSITIVE if word in text_lower)
        pt_neg_score = sum(1 for word in self.PORTUGUESE_NEGATIVE if word in text_lower)
        
        # Count English indicators
        en_pos_score = sum(1 for word in self.ENGLISH_POSITIVE if word in text_lower)
        en_neg_score = sum(1 for word in self.ENGLISH_NEGATIVE if word in text_lower)
        
        # Determine language
        lang = self._detect_language(pt_score + pt_neg_score, en_pos_score + en_neg_score)
        
        # Calculate sentiment
        positive = pt_score + en_pos_score
        negative = pt_neg_score + en_neg_score
        
        if positive > negative:
            sentiment = 'positive'
        elif negative > positive:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        # Detect formality
        formality = self._detect_formality(text_lower)
        
        return {
            'sentiment': sentiment,
            'language': lang,
            'formality': formality,
            'positive_score': positive,
            'negative_score': negative,
            'confidence': max(positive, negative, 1) / max(positive + negative, 1)
        }
    
    def _detect_language(self, pt_count: int, en_count: int) -> str:
        """Detect primary language"""
        if pt_count > en_count * 1.5:
            return 'pt'
        elif en_count > pt_count * 1.5:
            return 'en'
        elif pt_count > 0 or en_count > 0:
            return 'mixed'
        return 'unknown'
    
    def _detect_formality(self, text_lower: str) -> str:
        """Detect formality level"""
        formal_count = sum(1 for word in self.FORMALITY_INDICATORS['formal'] if word in text_lower)
        informal_count = sum(1 for word in self.FORMALITY_INDICATORS['informal'] if word in text_lower)
        
        if formal_count > informal_count:
            return 'formal'
        elif informal_count > formal_count:
            return 'informal'
        return 'neutral'

def get_reply_tone(analysis: Dict) -> str:
    """Generate appropriate reply tone"""
    sentiment = analysis['sentiment']
    lang = analysis['language']
    formality = analysis['formality']
    
    pt_formal_positive = """Prezado(a),

Agradeço pela sua mensagem e retorno com satisfação.

Atenciosamente,
Kleber Garcia Alcatrão
Zion Tech Group"""
    
    pt_formal_negative = """Prezado(a),

Identifiquei a urgência da sua solicitação e estou analisando imediatamente.

Retorno em breve com atualizações.

Atenciosamente,
Kleber Garcia Alcatrão"""
    
    pt_informal_positive = """Obrigado pela mensagem!

Vou analisar e retorno rapidinho.

Abraço,
Kleber"""
    
    en_formal_positive = """Dear [Name],

Thank you for your message. I'm responding promptly.

Best regards,
Kleber Garcia Alcatrão
Zion Tech Group"""
    
    en_formal_negative = """Dear [Name],

I understand the urgency and am reviewing this immediately.

I'll return with updates shortly.

Best regards,
Kleber Garcia Alcatrão"""
    
    # Select appropriate template
    if lang == 'pt':
        if formality == 'formal':
            return pt_formal_positive if sentiment == 'positive' else pt_formal_negative
        else:
            return pt_informal_positive
    else:
        return en_formal_positive if sentiment == 'positive' else en_formal_negative

if __name__ == '__main__':
    analyzer = PortugueseSentimentAnalyzer()
    
    # Test cases
    tests = [
        "Prezado Sr. Silva, obrigado pela proposta. Agradeço a parceria.",
        "Urgente! Preciso de suporte imediato para resolver este problema.",
        "Hi Kleber, thanks for the update. Great work on the project!",
        "E aí, tudo bem? Show o retorno, vamos fechar isso!"
    ]
    
    for test in tests:
        result = analyzer.analyze(test)
        print(f"Text: {test[:40]}...")
        print(f"Result: {result}\n")