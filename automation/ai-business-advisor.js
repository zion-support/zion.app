/**
 * AI Business Advisor Automation
 * Provides intelligent business recommendations and insights
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AIBusinessAdvisor {
  constructor() {
    this.conversationHistoryFile = join(__dirname, 'data', 'advisor-conversations.json');
    this.recommendationsFile = join(__dirname, 'data', 'advisor-recommendations.json');
    this.knowledgeBase = this.loadKnowledgeBase();
    this.conversationHistory = this.loadConversationHistory();
  }

  loadKnowledgeBase() {
    return {
      services: [
        {
          id: 'ai-analytics',
          name: 'AI Analytics & BI',
          category: 'analytics',
          benefits: ['data-driven decisions', 'predictive insights', 'real-time monitoring'],
          industries: ['finance', 'healthcare', 'retail', 'manufacturing'],
          useCases: ['revenue forecasting', 'customer behavior analysis', 'operational efficiency'],
          cost: 'medium',
          implementationTime: '2-3 months',
          roi: '200-300%'
        },
        {
          id: 'ai-automation',
          name: 'AI Process Automation',
          category: 'automation',
          benefits: ['cost reduction', 'error elimination', 'time savings'],
          industries: ['finance', 'healthcare', 'logistics', 'professional services'],
          useCases: ['document processing', 'workflow automation', 'task scheduling'],
          cost: 'low',
          implementationTime: '1-2 months',
          roi: '300-500%'
        },
        {
          id: 'conversational-ai',
          name: 'Conversational AI Solutions',
          category: 'customer-service',
          benefits: ['24/7 support', 'customer satisfaction', 'scalability'],
          industries: ['retail', 'healthcare', 'finance', 'hospitality'],
          useCases: ['customer support', 'lead qualification', 'appointment scheduling'],
          cost: 'medium',
          implementationTime: '1-2 months',
          roi: '250-400%'
        },
        {
          id: 'custom-ai-models',
          name: 'Custom AI Model Development',
          category: 'ml-development',
          benefits: ['tailored solutions', 'competitive advantage', 'proprietary technology'],
          industries: ['all'],
          useCases: ['custom predictions', 'specialized recognition', 'unique automation'],
          cost: 'high',
          implementationTime: '3-6 months',
          roi: '150-250%'
        },
        {
          id: 'ai-fraud-detection',
          name: 'AI Fraud Detection',
          category: 'security',
          benefits: ['loss prevention', 'risk mitigation', 'compliance'],
          industries: ['finance', 'insurance', 'e-commerce', 'healthcare'],
          useCases: ['transaction monitoring', 'anomaly detection', 'claim verification'],
          cost: 'medium',
          implementationTime: '2-3 months',
          roi: '400-600%'
        },
        {
          id: 'ai-predictive-maintenance',
          name: 'AI Predictive Maintenance',
          category: 'operations',
          benefits: ['downtime reduction', 'cost savings', 'asset longevity'],
          industries: ['manufacturing', 'logistics', 'energy', 'aviation'],
          useCases: ['equipment monitoring', 'failure prediction', 'maintenance scheduling'],
          cost: 'medium',
          implementationTime: '2-4 months',
          roi: '300-500%'
        }
      ],
      industries: {
        finance: {
          commonChallenges: ['fraud prevention', 'risk assessment', 'customer experience', 'regulatory compliance'],
          recommendedSolutions: ['ai-fraud-detection', 'ai-analytics', 'conversational-ai']
        },
        healthcare: {
          commonChallenges: ['patient care', 'operational efficiency', 'cost management', 'data analysis'],
          recommendedSolutions: ['ai-automation', 'ai-analytics', 'ai-predictive-maintenance']
        },
        retail: {
          commonChallenges: ['customer engagement', 'inventory management', 'sales optimization', 'personalization'],
          recommendedSolutions: ['conversational-ai', 'ai-analytics', 'ai-automation']
        },
        manufacturing: {
          commonChallenges: ['equipment downtime', 'quality control', 'supply chain', 'efficiency'],
          recommendedSolutions: ['ai-predictive-maintenance', 'ai-analytics', 'ai-automation']
        },
        logistics: {
          commonChallenges: ['route optimization', 'delivery tracking', 'cost reduction', 'capacity planning'],
          recommendedSolutions: ['ai-analytics', 'ai-automation', 'ai-predictive-maintenance']
        }
      },
      businessSizes: {
        startup: {
          priorities: ['cost-effectiveness', 'quick wins', 'scalability'],
          recommendations: ['ai-automation', 'conversational-ai']
        },
        small: {
          priorities: ['efficiency', 'growth', 'customer satisfaction'],
          recommendations: ['ai-automation', 'conversational-ai', 'ai-analytics']
        },
        medium: {
          priorities: ['competitive advantage', 'optimization', 'data insights'],
          recommendations: ['ai-analytics', 'custom-ai-models', 'ai-automation']
        },
        enterprise: {
          priorities: ['innovation', 'transformation', 'market leadership'],
          recommendations: ['custom-ai-models', 'ai-analytics', 'ai-predictive-maintenance']
        }
      }
    };
  }

  loadConversationHistory() {
    try {
      if (existsSync(this.conversationHistoryFile)) {
        const data = readFileSync(this.conversationHistoryFile, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
    return [];
  }

  saveConversationHistory() {
    try {
      writeFileSync(
        this.conversationHistoryFile,
        JSON.stringify(this.conversationHistory, null, 2)
      );
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  }

  analyzeBusinessNeeds(userInput) {
    const input = userInput.toLowerCase();
    
    const analysis = {
      industry: null,
      challenges: [],
      goals: [],
      businessSize: null,
      urgency: 'normal',
      budget: 'medium'
    };

    // Detect industry
    for (const [industry, data] of Object.entries(this.knowledgeBase.industries)) {
      if (input.includes(industry)) {
        analysis.industry = industry;
        break;
      }
    }

    // Detect business size
    if (input.match(/startup|new business|just started/i)) {
      analysis.businessSize = 'startup';
    } else if (input.match(/small business|small company|\d{1,2} employees/i)) {
      analysis.businessSize = 'small';
    } else if (input.match(/medium|growing|50-500 employees/i)) {
      analysis.businessSize = 'medium';
    } else if (input.match(/enterprise|large|corporation|500\+ employees/i)) {
      analysis.businessSize = 'enterprise';
    }

    // Detect challenges
    const challengeKeywords = {
      'efficiency': ['slow', 'inefficient', 'manual', 'time-consuming', 'labor-intensive'],
      'cost': ['expensive', 'costly', 'high costs', 'reduce costs', 'save money'],
      'customer-service': ['customer complaints', 'support tickets', 'response time', 'satisfaction'],
      'data': ['data analysis', 'insights', 'reporting', 'analytics', 'metrics'],
      'automation': ['automate', 'repetitive', 'manual tasks', 'workflow'],
      'security': ['fraud', 'security', 'risk', 'compliance', 'breach'],
      'maintenance': ['downtime', 'equipment', 'breakdown', 'maintenance']
    };

    for (const [challenge, keywords] of Object.entries(challengeKeywords)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        analysis.challenges.push(challenge);
      }
    }

    // Detect urgency
    if (input.match(/urgent|asap|immediately|critical|emergency/i)) {
      analysis.urgency = 'high';
    } else if (input.match(/planning|future|considering|exploring/i)) {
      analysis.urgency = 'low';
    }

    // Detect budget
    if (input.match(/budget|low cost|affordable|cheap|economical/i)) {
      analysis.budget = 'low';
    } else if (input.match(/premium|best|enterprise|unlimited budget/i)) {
      analysis.budget = 'high';
    }

    return analysis;
  }

  generateRecommendations(analysis) {
    const recommendations = [];
    const { industry, challenges, businessSize, budget } = analysis;

    // Get industry-specific recommendations
    if (industry && this.knowledgeBase.industries[industry]) {
      const industryData = this.knowledgeBase.industries[industry];
      for (const serviceId of industryData.recommendedSolutions) {
        const service = this.knowledgeBase.services.find(s => s.id === serviceId);
        if (service) {
          const score = this.calculateRecommendationScore(service, analysis);
          recommendations.push({ ...service, score, reason: 'Industry best practice' });
        }
      }
    }

    // Get challenge-specific recommendations
    for (const challenge of challenges) {
      const matchingServices = this.knowledgeBase.services.filter(service => {
        return service.category === challenge || 
               service.benefits.some(b => b.includes(challenge.replace('-', ' ')));
      });
      
      for (const service of matchingServices) {
        const existing = recommendations.find(r => r.id === service.id);
        if (existing) {
          existing.score += 10;
          existing.reason += ', Addresses your challenges';
        } else {
          const score = this.calculateRecommendationScore(service, analysis);
          recommendations.push({ ...service, score: score + 10, reason: 'Solves your specific challenges' });
        }
      }
    }

    // Get business size recommendations
    if (businessSize && this.knowledgeBase.businessSizes[businessSize]) {
      const sizeData = this.knowledgeBase.businessSizes[businessSize];
      for (const serviceId of sizeData.recommendations) {
        const service = this.knowledgeBase.services.find(s => s.id === serviceId);
        if (service) {
          const existing = recommendations.find(r => r.id === service.id);
          if (existing) {
            existing.score += 5;
            existing.reason += ', Ideal for your business size';
          } else {
            const score = this.calculateRecommendationScore(service, analysis);
            recommendations.push({ ...service, score: score + 5, reason: 'Perfect fit for your business size' });
          }
        }
      }
    }

    // Filter by budget
    const budgetFilter = {
      'low': ['low'],
      'medium': ['low', 'medium'],
      'high': ['low', 'medium', 'high']
    };
    
    const filteredRecommendations = recommendations.filter(r => 
      budgetFilter[budget].includes(r.cost)
    );

    // Sort by score and return top 3
    return filteredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  calculateRecommendationScore(service, analysis) {
    let score = 50; // Base score

    // Industry match
    if (analysis.industry && service.industries.includes(analysis.industry)) {
      score += 20;
    } else if (service.industries.includes('all')) {
      score += 10;
    }

    // Budget match
    if (service.cost === analysis.budget) {
      score += 15;
    }

    // Challenge alignment
    const challengeMatches = analysis.challenges.filter(challenge =>
      service.category === challenge || service.benefits.some(b => b.includes(challenge))
    ).length;
    score += challengeMatches * 10;

    return score;
  }

  generateResponse(userInput, conversationId = null) {
    const analysis = this.analyzeBusinessNeeds(userInput);
    const recommendations = this.generateRecommendations(analysis);

    const response = {
      id: conversationId || Date.now().toString(),
      timestamp: new Date().toISOString(),
      userInput,
      analysis,
      recommendations,
      message: this.formatResponseMessage(analysis, recommendations)
    };

    // Save to history
    this.conversationHistory.push({
      id: response.id,
      timestamp: response.timestamp,
      userInput,
      analysis,
      recommendationCount: recommendations.length
    });
    this.saveConversationHistory();

    return response;
  }

  formatResponseMessage(analysis, recommendations) {
    let message = "Based on your needs, here's what I recommend:\n\n";

    if (analysis.industry) {
      message += `🏢 **Industry**: ${analysis.industry.charAt(0).toUpperCase() + analysis.industry.slice(1)}\n`;
    }

    if (analysis.businessSize) {
      message += `📊 **Business Size**: ${analysis.businessSize.charAt(0).toUpperCase() + analysis.businessSize.slice(1)}\n`;
    }

    if (analysis.challenges.length > 0) {
      message += `🎯 **Key Challenges**: ${analysis.challenges.map(c => c.replace('-', ' ')).join(', ')}\n\n`;
    }

    message += "### Recommended Solutions:\n\n";

    recommendations.forEach((rec, index) => {
      message += `**${index + 1}. ${rec.name}**\n`;
      message += `   - **Why**: ${rec.reason}\n`;
      message += `   - **Benefits**: ${rec.benefits.join(', ')}\n`;
      message += `   - **ROI**: ${rec.roi}\n`;
      message += `   - **Timeline**: ${rec.implementationTime}\n`;
      message += `   - **Investment**: ${rec.cost} budget\n\n`;
    });

    if (recommendations.length === 0) {
      message += "I'd love to learn more about your specific needs to provide tailored recommendations. ";
      message += "Could you tell me more about your industry, business size, or specific challenges?\n";
    } else {
      message += "\n💡 **Next Steps**: Schedule a free consultation to discuss how these solutions can transform your business!\n";
      message += "🔗 Visit our contact page or explore our services for more details.";
    }

    return message;
  }

  getConversationStats() {
    return {
      totalConversations: this.conversationHistory.length,
      recentConversations: this.conversationHistory.slice(-10),
      commonIndustries: this.getCommonValues('industry'),
      commonChallenges: this.getCommonValues('challenges')
    };
  }

  getCommonValues(field) {
    const counts = {};
    this.conversationHistory.forEach(conv => {
      const value = conv.analysis[field];
      if (Array.isArray(value)) {
        value.forEach(v => {
          counts[v] = (counts[v] || 0) + 1;
        });
      } else if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => ({ key, count }));
  }
}

// Export for use in other modules
export default AIBusinessAdvisor;

// CLI functionality
if (import.meta.url === `file://${process.argv[1]}`) {
  const advisor = new AIBusinessAdvisor();
  
  const command = process.argv[2];
  const input = process.argv.slice(3).join(' ');

  switch (command) {
    case 'ask':
      if (!input) {
        console.log('Usage: node ai-business-advisor.js ask "your question"');
        process.exit(1);
      }
      const response = advisor.generateResponse(input);
      console.log('\n' + response.message);
      break;

    case 'stats':
      const stats = advisor.getConversationStats();
      console.log('📊 Conversation Statistics:');
      console.log(JSON.stringify(stats, null, 2));
      break;

    default:
      console.log('AI Business Advisor - Usage:');
      console.log('  node ai-business-advisor.js ask "your question"');
      console.log('  node ai-business-advisor.js stats');
  }
}

