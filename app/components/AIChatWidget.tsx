'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  typing?: boolean;
}

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
}

const quickQuestions = [
  "What AI services do you offer?",
  "How can I get a quote?",
  "Show me your pricing",
  "Talk to a human"
];

export default function AIChatWidget({ position = 'bottom-right', primaryColor = 'violet' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! 👋 I'm Zion's AI Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    violet: 'from-violet-600 to-indigo-600',
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-emerald-600',
    amber: 'from-amber-600 to-orange-600'
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowOptions(false);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('pricing') || lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      return "We offer flexible pricing for all sizes:\n\n• **Starter**: $499/month\n• **Professional**: $999/month\n• **Enterprise**: Custom pricing\n\nAll plans include 24/7 support and continuous AI optimization. Would you like to schedule a demo?";
    }
    
    if (lowerQuery.includes('service') || lowerQuery.includes('offer')) {
      return "We offer 200+ AI-powered solutions including:\n\n• Machine Learning & NLP\n• Computer Vision\n• Predictive Analytics\n• Voice AI & Chatbots\n• Cybersecurity\n• Cloud Solutions\n\nExplore our services at ziontechgroup.com";
    }
    
    if (lowerQuery.includes('quote') || lowerQuery.includes('quote')) {
      return "I'd be happy to help you get a quote! Please share:\n\n1. Your company name\n2. What AI services you're interested in\n3. Your team size\n\nOr directly email sales@ziontechgroup.com";
    }
    
    if (lowerQuery.includes('human') || lowerQuery.includes('talk to someone') || lowerQuery.includes('agent')) {
      return "I can connect you with a human representative! 📞\n\n**Contact options:**\n• Email: sales@ziontechgroup.com\n• Phone: +1 (555) 123-4567\n\nOr I can take your message for the team.";
    }

    if (lowerQuery.includes('contact') || lowerQuery.includes('reach')) {
      return "You can reach us:\n\n📧 **Email**: sales@ziontechgroup.com\n📞 **Phone**: +1 (555) 123-4567\n🌐 **Website**: ziontechgroup.com/contact\n\nOur team is available 24/7!";
    }

    if (lowerQuery.includes('demo') || lowerQuery.includes('trial')) {
      return "We'd love to show you around! 🎉\n\nBook a free demo at:\n**ziontechgroup.com/demo**\n\nOr use our AI Tools at no cost: **ziontechgroup.com/ai-tools**";
    }

    if (lowerQuery.includes('thank')) {
      return "You're welcome! 😊 Is there anything else I can help you with?";
    }

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! 👋 How can I assist you today?";
    }

    return "Thanks for your question! I've connected this to our AI knowledge base. For detailed inquiries, I'd recommend speaking with our team at sales@ziontechgroup.com or visiting ziontechgroup.com for a full overview of our services.";
  };

  const positionClasses = position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6';
  const gradientClass = colorClasses[primaryColor as keyof typeof colorClasses] || colorClasses.violet;

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-[380px] h-[500px] flex flex-col overflow-hidden border border-slate-700"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradientClass} p-4 flex items-center justify-between shrink-0`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    Zion AI 
                    <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Online
                    </span>
                  </h3>
                  <p className="text-white/70 text-xs">Typically replies in seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user' 
                      ? `bg-gradient-to-r ${gradientClass} text-white` 
                      : 'bg-slate-700/50 text-slate-100'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/60' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/50 rounded-2xl px-4 py-3 flex items-center gap-1">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                      className="w-2 h-2 bg-violet-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                      className="w-2 h-2 bg-violet-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                      className="w-2 h-2 bg-violet-400 rounded-full"
                    />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Options */}
            <AnimatePresence>
              {showOptions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-2"
                >
                  <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-700/50 text-white placeholder-slate-400 px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={`p-2.5 bg-gradient-to-r ${gradientClass} text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsMinimized(false)}
          className={`w-14 h-14 bg-gradient-to-r ${gradientClass} rounded-full shadow-lg flex items-center justify-center text-white`}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 bg-gradient-to-r ${gradientClass} rounded-full shadow-lg flex items-center justify-center text-white`}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
