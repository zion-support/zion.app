'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AI_CHAT_RESPONSES: Record<string, string> = {
  'hello': "Hello! I'm your Zion Tech AI assistant. How can I help you today? I can tell you about our AI services, help navigate the site, or answer questions about our technology solutions.",
  'hi': "Hi there! Welcome to Zion Tech Group. I'm here to help you discover our AI-powered solutions and answer any questions you might have.",
  'services': "We offer comprehensive AI solutions including: 1) AI Consulting & Strategy, 2) Custom AI Development, 3) AI Integration Services, 4) AI Training & Support, 5) AI-Powered Analytics. Which service interests you?",
  'pricing': "Our pricing is customized based on your needs. We offer: • Starter packages from $5k/mo • Business solutions from $20k/mo • Enterprise custom pricing. Would you like to schedule a consultation for a precise quote?",
  'contact': "You can reach us at: 📧 hello@ziontechgroup.com 📞 +1 (555) 123-4567 📍 123 Tech Avenue, San Francisco, CA. Our team responds within 24 hours.",
  'default': "I understand you're asking about '{query}'. Let me help you with that. Zion Tech Group specializes in AI automation, intelligent systems, and digital transformation. Would you like to know more about our AI capabilities or schedule a demo?"
};

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Zion Tech AI assistant. I'm here to help you explore our AI solutions and answer any questions. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return AI_CHAT_RESPONSES['hello'];
    }
    if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
      return AI_CHAT_RESPONSES['services'];
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return AI_CHAT_RESPONSES['pricing'];
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return AI_CHAT_RESPONSES['contact'];
    }

    return AI_CHAT_RESPONSES['default'].replace('{query}', userMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const response = getAIResponse(input);
    const assistantMessage: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const suggestedQuestions = [
    "What AI services do you offer?",
    "Tell me about pricing",
    "How can I contact you?",
    "What makes Zion Tech different?"
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Zion AI Assistant</h2>
            <p className="text-sm opacity-90">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-violet-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-violet-200' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 bg-gray-50 border-t">
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about Zion Tech..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}