'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Feature {
  name: string;
  href: string;
  category: string;
  icon: string;
  description: string;
}

const allFeatures: Feature[] = [
  // AI & Machine Learning
  { name: 'AI Business Advisor', href: '/ai-business-advisor', category: 'AI & ML', icon: '🤖', description: 'Get personalized AI solution recommendations' },
  { name: 'AI Chatbot Builder', href: '/zion-ai-chatbot-builder', category: 'AI & ML', icon: '💬', description: 'Build intelligent conversational AI chatbots' },
  { name: 'AI Code Assistant', href: '/zion-ai-code-assistant', category: 'AI & ML', icon: '💻', description: 'AI-powered coding assistance and suggestions' },
  { name: 'AI Code Reviewer', href: '/zion-ai-code-reviewer', category: 'AI & ML', icon: '🔍', description: 'Automated code review and quality analysis' },
  { name: 'AI Content Moderator', href: '/zion-ai-content-moderator', category: 'AI & ML', icon: '🛡️', description: 'Automated content moderation and filtering' },
  { name: 'AI Customer Service Pro', href: '/zion-ai-customer-service-pro', category: 'AI & ML', icon: '👥', description: 'Advanced AI customer support solutions' },
  { name: 'AI Customer Support Pro', href: '/zion-ai-customer-support-pro', category: 'AI & ML', icon: '🎧', description: 'Professional AI-powered customer support' },
  { name: 'AI Data Cleaner', href: '/zion-ai-data-cleaner', category: 'AI & ML', icon: '🧹', description: 'Intelligent data cleaning and preprocessing' },
  { name: 'AI Data Visualizer', href: '/zion-ai-data-visualizer', category: 'AI & ML', icon: '📊', description: 'Create stunning data visualizations with AI' },
  { name: 'AI Document Analyzer', href: '/zion-ai-document-analyzer', category: 'AI & ML', icon: '📄', description: 'AI-powered document analysis and extraction' },
  { name: 'AI Document Processor', href: '/zion-ai-document-processor', category: 'AI & ML', icon: '📑', description: 'Automated document processing and OCR' },
  { name: 'AI Email Assistant', href: '/zion-ai-email-assistant', category: 'AI & ML', icon: '📧', description: 'Smart email management and automation' },
  { name: 'AI Email Marketing Pro', href: '/zion-ai-email-marketing-pro', category: 'AI & ML', icon: '📨', description: 'AI-driven email marketing campaigns' },
  { name: 'AI Email Optimizer', href: '/zion-ai-email-optimizer', category: 'AI & ML', icon: '✉️', description: 'Optimize email performance with AI' },
  { name: 'AI Form Builder', href: '/zion-ai-form-builder', category: 'AI & ML', icon: '📝', description: 'Build intelligent forms with AI assistance' },
  { name: 'AI Fraud Detection', href: '/zion-ai-fraud-detection', category: 'AI & ML', icon: '🚨', description: 'Advanced fraud detection and prevention' },
  { name: 'AI Image Generator', href: '/zion-ai-image-generator', category: 'AI & ML', icon: '🎨', description: 'Generate images using AI technology' },
  { name: 'AI Image Recognition', href: '/zion-ai-image-recognition', category: 'AI & ML', icon: '👁️', description: 'Advanced image recognition and classification' },
  { name: 'AI Lead Scoring', href: '/zion-ai-lead-scoring', category: 'AI & ML', icon: '🎯', description: 'Intelligent lead scoring and prioritization' },
  { name: 'AI Marketing Automation', href: '/zion-ai-marketing-automation', category: 'AI & ML', icon: '📈', description: 'Automate marketing workflows with AI' },
  { name: 'AI Meeting Assistant', href: '/zion-ai-meeting-assistant', category: 'AI & ML', icon: '🎤', description: 'AI-powered meeting management and notes' },
  { name: 'AI Meeting Transcriber', href: '/zion-ai-meeting-transcriber', category: 'AI & ML', icon: '📹', description: 'Real-time meeting transcription with AI' },
  { name: 'AI Predictive Analytics', href: '/zion-ai-predictive-analytics', category: 'AI & ML', icon: '🔮', description: 'Predictive analytics and forecasting' },
  { name: 'AI Predictive Maintenance', href: '/zion-ai-predictive-maintenance', category: 'AI & ML', icon: '⚙️', description: 'Predict equipment failures before they happen' },
  { name: 'AI Price Optimizer', href: '/zion-ai-price-optimizer', category: 'AI & ML', icon: '💰', description: 'Dynamic pricing optimization with AI' },
  { name: 'AI Recruitment Pro', href: '/zion-ai-recruitment-pro', category: 'AI & ML', icon: '👔', description: 'AI-powered recruitment and hiring' },
  { name: 'AI Sales Predictor', href: '/zion-ai-sales-predictor', category: 'AI & ML', icon: '📊', description: 'Predict sales trends and opportunities' },
  { name: 'AI Scheduling Assistant', href: '/zion-ai-scheduling-assistant', category: 'AI & ML', icon: '📅', description: 'Intelligent scheduling and calendar management' },
  { name: 'AI SEO Optimizer', href: '/zion-ai-seo-optimizer', category: 'AI & ML', icon: '🔎', description: 'AI-powered SEO optimization tools' },
  { name: 'AI Social Media Manager', href: '/zion-ai-social-media-manager', category: 'AI & ML', icon: '📱', description: 'Manage social media with AI assistance' },
  { name: 'AI Social Scheduler Pro', href: '/zion-ai-social-scheduler-pro', category: 'AI & ML', icon: '📲', description: 'Advanced social media scheduling' },
  { name: 'AI Supply Chain Optimizer', href: '/zion-ai-supply-chain-optimizer', category: 'AI & ML', icon: '🚚', description: 'Optimize supply chain operations' },
  { name: 'AI Survey Builder', href: '/zion-ai-survey-builder', category: 'AI & ML', icon: '📋', description: 'Create intelligent surveys with AI' },
  { name: 'AI Task Scheduler', href: '/zion-ai-task-scheduler', category: 'AI & ML', icon: '✅', description: 'Smart task scheduling and management' },
  { name: 'AI Translation Service', href: '/zion-ai-translation-service', category: 'AI & ML', icon: '🌐', description: 'AI-powered translation services' },
  { name: 'AI Translator Pro', href: '/zion-ai-translator-pro', category: 'AI & ML', icon: '🗣️', description: 'Professional AI translation tools' },
  { name: 'AI Video Editor', href: '/zion-ai-video-editor', category: 'AI & ML', icon: '🎬', description: 'AI-powered video editing and production' },
  { name: 'AI Video Generator', href: '/zion-ai-video-generator', category: 'AI & ML', icon: '🎥', description: 'Generate videos using AI technology' },
  { name: 'AI Voice Assistant', href: '/zion-ai-voice-assistant', category: 'AI & ML', icon: '🎙️', description: 'Intelligent voice assistant solutions' },
  { name: 'AI Voice Synthesis', href: '/zion-ai-voice-synthesis', category: 'AI & ML', icon: '🔊', description: 'AI-powered voice synthesis and TTS' },
  { name: 'AI Website Analyzer', href: '/zion-ai-website-analyzer', category: 'AI & ML', icon: '🌐', description: 'Analyze website performance with AI' },
  { name: 'AI Workflow Automator', href: '/zion-ai-workflow-automator', category: 'AI & ML', icon: '⚡', description: 'Automate complex workflows with AI' },
  { name: 'AI Workflow Automator Pro', href: '/zion-ai-workflow-automator-pro', category: 'AI & ML', icon: '🚀', description: 'Advanced workflow automation platform' },
  
  // Business Solutions
  { name: 'Analytics Pro', href: '/zion-analytics-pro', category: 'Business', icon: '📈', description: 'Advanced analytics and business intelligence' },
  { name: 'Chat AI', href: '/zion-chat-ai', category: 'Business', icon: '💬', description: 'Enterprise chat and communication platform' },
  { name: 'Content Studio', href: '/zion-content-studio', category: 'Business', icon: '🎨', description: 'Content creation and management studio' },
  { name: 'CRM Intelligence', href: '/zion-crm-intelligence', category: 'Business', icon: '📊', description: 'Intelligent CRM and customer insights' },
  { name: 'Customer Insights', href: '/zion-customer-insights', category: 'Business', icon: '👁️', description: 'Deep customer analytics and insights' },
  { name: 'Customer Satisfaction Monitor', href: '/zion-customer-satisfaction-monitor', category: 'Business', icon: '😊', description: 'Monitor and improve customer satisfaction' },
  { name: 'Email Automation', href: '/zion-email-automation', category: 'Business', icon: '📧', description: 'Automated email marketing workflows' },
  { name: 'Invoice Genius', href: '/zion-invoice-genius', category: 'Business', icon: '🧾', description: 'Smart invoice generation and management' },
  { name: 'Lead Magnet', href: '/zion-lead-magnet', category: 'Business', icon: '🧲', description: 'Generate and nurture leads effectively' },
  { name: 'Project Master', href: '/zion-project-master', category: 'Business', icon: '📁', description: 'Comprehensive project management solution' },
  { name: 'Smart Analytics Dashboard', href: '/zion-smart-analytics-dashboard', category: 'Business', icon: '📊', description: 'Real-time analytics dashboard' },
  { name: 'Smart CRM Automation', href: '/zion-smart-crm-automation', category: 'Business', icon: '🤖', description: 'Automated CRM workflows and processes' },
  { name: 'Smart Expense Tracker', href: '/zion-smart-expense-tracker', category: 'Business', icon: '💳', description: 'Track and manage expenses intelligently' },
  { name: 'Social Scheduler', href: '/zion-social-scheduler', category: 'Business', icon: '📅', description: 'Schedule social media posts efficiently' },
  { name: 'Workflow Automation', href: '/zion-workflow-automation', category: 'Business', icon: '⚙️', description: 'Automate business workflows' },
  
  // Developer Tools
  { name: 'API Development', href: '/zion-api-development', category: 'Developer', icon: '🔌', description: 'Build and manage APIs efficiently' },
  { name: 'API Tester', href: '/zion-ai-api-tester', category: 'Developer', icon: '🧪', description: 'Test and debug APIs with AI assistance' },
  { name: 'Database Optimizer', href: '/zion-ai-database-optimizer', category: 'Developer', icon: '🗄️', description: 'Optimize database performance with AI' },
  { name: 'DevOps Automation', href: '/zion-devops-automation', category: 'Developer', icon: '⚙️', description: 'Automate DevOps workflows and processes' },
  { name: 'Performance Monitor', href: '/zion-performance-monitor', category: 'Developer', icon: '📊', description: 'Monitor application performance' },
  
  // Security & Compliance
  { name: 'Blockchain Solutions', href: '/zion-blockchain-solutions', category: 'Security', icon: '⛓️', description: 'Blockchain technology solutions' },
  { name: 'Cloud Vault', href: '/zion-cloud-vault', category: 'Security', icon: '☁️', description: 'Secure cloud storage and backup' },
  { name: 'Compliance Manager', href: '/zion-compliance-manager', category: 'Security', icon: '✅', description: 'Manage compliance and regulations' },
  { name: 'Cybersecurity Audit', href: '/zion-cybersecurity-audit', category: 'Security', icon: '🔒', description: 'Comprehensive cybersecurity auditing' },
  { name: 'Security Shield', href: '/zion-security-shield', category: 'Security', icon: '🛡️', description: 'Advanced security protection suite' },
  
  // Data & Infrastructure
  { name: 'Data Sync', href: '/zion-data-sync', category: 'Infrastructure', icon: '🔄', description: 'Synchronize data across systems' },
  { name: 'IoT Solutions', href: '/zion-iot-solutions', category: 'Infrastructure', icon: '🌐', description: 'Internet of Things solutions' },
  { name: 'Inventory Smart', href: '/zion-inventory-smart', category: 'Infrastructure', icon: '📦', description: 'Smart inventory management system' },
  { name: 'Smart Inventory Manager', href: '/zion-smart-inventory-manager', category: 'Infrastructure', icon: '📋', description: 'Intelligent inventory tracking' },
  
  // Additional AI Services
  { name: 'AI Accounting Assistant', href: '/zion-ai-accounting-assistant', category: 'AI & ML', icon: '📊', description: 'AI-powered accounting and bookkeeping' },
  { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer', category: 'AI & ML', icon: '📜', description: 'Analyze contracts with AI technology' },
  { name: 'AI Customer Churn Predictor', href: '/zion-ai-customer-churn-predictor', category: 'AI & ML', icon: '📉', description: 'Predict customer churn with AI' },
  { name: 'AI Customer Churn Predictor Pro', href: '/zion-ai-customer-churn-predictor-pro', category: 'AI & ML', icon: '📉', description: 'Advanced customer churn prediction' },
  { name: 'AI Customer Sentiment Tracker', href: '/zion-ai-customer-sentiment-tracker', category: 'AI & ML', icon: '😊', description: 'Track customer sentiment and feedback' },
  { name: 'AI Document AI', href: '/zion-ai-document-ai', category: 'AI & ML', icon: '📄', description: 'Advanced document AI processing' },
  { name: 'AI Energy Manager', href: '/zion-ai-energy-manager', category: 'AI & ML', icon: '⚡', description: 'Manage energy consumption with AI' },
  { name: 'AI Financial Forecaster', href: '/zion-ai-financial-forecaster', category: 'AI & ML', icon: '💰', description: 'Financial forecasting with AI' },
  { name: 'AI Inventory Optimizer Pro', href: '/zion-ai-inventory-optimizer-pro', category: 'AI & ML', icon: '📦', description: 'Advanced inventory optimization' },
  
  // Extended AI Services
  { name: 'AI-Powered DevOps', href: '/ai-powered-devops', category: 'Developer', icon: '⚙️', description: 'DevOps automation with AI' },
  { name: 'AI Email Analyzer', href: '/ai-powered-email-analyzer', category: 'AI & ML', icon: '📧', description: 'Analyze emails with AI intelligence' },
  
  // Additional AI Features
  { name: 'AI Expense Tracker Pro', href: '/ai-expense-tracker-pro', category: 'Business', icon: '💳', description: 'Advanced expense tracking with AI' },
  { name: 'AI Fashion Design', href: '/ai-fashion-design', category: 'AI & ML', icon: '👗', description: 'AI-powered fashion design tools' },
  { name: 'AI Financial Advisor', href: '/ai-financial-advisor', category: 'AI & ML', icon: '💰', description: 'AI financial advisory services' },
  { name: 'AI Financial Analyzer', href: '/ai-financial-analyzer', category: 'AI & ML', icon: '📊', description: 'Advanced financial analysis with AI' },
  { name: 'AI Financial Crime Detection Pro', href: '/ai-financial-crime-detection-pro', category: 'Security', icon: '🚨', description: 'Detect financial crimes with AI' },
  { name: 'AI Financial Forecasting', href: '/ai-financial-forecasting', category: 'AI & ML', icon: '📈', description: 'Financial forecasting and predictions' },
  { name: 'AI Financial Planner', href: '/ai-financial-planner', category: 'AI & ML', icon: '💼', description: 'AI-powered financial planning' },
  { name: 'AI Financial Services', href: '/ai-financial-services', category: 'AI & ML', icon: '🏦', description: 'Comprehensive AI financial services' },
  { name: 'AI Fintech', href: '/ai-fintech', category: 'AI & ML', icon: '💳', description: 'AI-powered fintech solutions' },
  { name: 'AI Fitness Coach', href: '/ai-fitness-coach', category: 'AI & ML', icon: '💪', description: 'Personalized AI fitness coaching' },
  { name: 'AI Form Builder', href: '/ai-form-builder', category: 'AI & ML', icon: '📝', description: 'Build intelligent forms with AI' },
  { name: 'AI Fraud Detection', href: '/ai-fraud-detection', category: 'Security', icon: '🚨', description: 'Advanced fraud detection systems' },
  { name: 'AI Fraud Detection Pro', href: '/ai-fraud-detection-pro', category: 'Security', icon: '🛡️', description: 'Professional fraud detection platform' },
  { name: 'AI Healthcare', href: '/ai-healthcare', category: 'AI & ML', icon: '🏥', description: 'AI healthcare solutions' },
  { name: 'AI Healthcare Diagnostics', href: '/ai-healthcare-diagnostics', category: 'AI & ML', icon: '🔬', description: 'AI-powered medical diagnostics' },
  { name: 'AI Healthcare Solutions', href: '/ai-healthcare-solutions', category: 'AI & ML', icon: '⚕️', description: 'Comprehensive healthcare AI solutions' },
  { name: 'AI Health Tracker', href: '/ai-health-tracker', category: 'AI & ML', icon: '📱', description: 'Track health metrics with AI' },
  { name: 'AI Holographic Workspace', href: '/ai-holographic-workspace', category: 'AI & ML', icon: '🌐', description: 'Immersive holographic workspace' },
  { name: 'AI HR', href: '/ai-hr', category: 'Business', icon: '👔', description: 'AI-powered HR solutions' },
  { name: 'AI HR Assistant', href: '/ai-hr-assistant', category: 'Business', icon: '🤝', description: 'AI assistant for HR tasks' },
  { name: 'AI HR Solutions', href: '/ai-hr-solutions', category: 'Business', icon: '💼', description: 'Complete HR AI solutions' },
  { name: 'AI Image Recognition', href: '/ai-image-recognition', category: 'AI & ML', icon: '👁️', description: 'Advanced image recognition' },
  { name: 'AI Image Recognition Pro', href: '/ai-image-recognition-pro', category: 'AI & ML', icon: '🔍', description: 'Professional image recognition' },
  { name: 'AI Infrastructure', href: '/ai-infrastructure', category: 'Infrastructure', icon: '🏗️', description: 'AI infrastructure solutions' },
  { name: 'AI Infrastructure Monitoring', href: '/ai-infrastructure-monitoring', category: 'Infrastructure', icon: '📊', description: 'Monitor infrastructure with AI' },
  { name: 'AI Insurance', href: '/ai-insurance', category: 'AI & ML', icon: '🛡️', description: 'AI-powered insurance solutions' },
  { name: 'AI Integration Services', href: '/ai-integration-services', category: 'Developer', icon: '🔌', description: 'AI integration and APIs' },
  { name: 'AI Inventory Management', href: '/ai-inventory-management', category: 'Infrastructure', icon: '📦', description: 'AI inventory management' },
  { name: 'AI Inventory Manager', href: '/ai-inventory-manager', category: 'Infrastructure', icon: '📋', description: 'Intelligent inventory management' },
  { name: 'AI Inventory Optimizer Pro', href: '/ai-inventory-optimizer-pro', category: 'Infrastructure', icon: '⚡', description: 'Advanced inventory optimization' },
  { name: 'AI Investment Optimizer', href: '/ai-investment-optimizer', category: 'AI & ML', icon: '📈', description: 'Optimize investments with AI' },
  { name: 'AI Invoice Generator', href: '/ai-invoice-generator', category: 'Business', icon: '🧾', description: 'Generate invoices with AI' },
  { name: 'AI IoT Analytics', href: '/ai-iot-analytics', category: 'Infrastructure', icon: '📊', description: 'IoT analytics with AI' },
  { name: 'AI Knowledge Management', href: '/ai-knowledge-management', category: 'Business', icon: '📚', description: 'AI-powered knowledge management' },
  { name: 'AI Lead Generation', href: '/ai-lead-generation', category: 'Business', icon: '🎯', description: 'Generate leads with AI' },
  { name: 'AI Lead Scoring', href: '/ai-lead-scoring', category: 'Business', icon: '⭐', description: 'Score leads intelligently' },
  { name: 'AI Lead Scoring Pro', href: '/ai-lead-scoring-pro', category: 'Business', icon: '🏆', description: 'Advanced lead scoring platform' },
  { name: 'AI Learning Platform', href: '/ai-learning-platform', category: 'AI & ML', icon: '🎓', description: 'AI-powered learning platform' },
  { name: 'AI Legal', href: '/ai-legal', category: 'AI & ML', icon: '⚖️', description: 'AI legal solutions' },
  { name: 'AI Legal Assistant', href: '/ai-legal-assistant', category: 'AI & ML', icon: '📜', description: 'AI legal assistant' },
  { name: 'AI Legal Document Analyzer', href: '/ai-legal-document-analyzer', category: 'AI & ML', icon: '📄', description: 'Analyze legal documents with AI' },
  { name: 'AI Legal Research Pro', href: '/ai-legal-research-pro', category: 'AI & ML', icon: '🔍', description: 'Advanced legal research tools' },
  { name: 'AI Load Testing', href: '/ai-load-testing', category: 'Developer', icon: '⚡', description: 'AI-powered load testing' },
  { name: 'AI Logo Designer', href: '/ai-logo-designer', category: 'AI & ML', icon: '🎨', description: 'Design logos with AI' },
  { name: 'AI Manufacturing', href: '/ai-manufacturing', category: 'AI & ML', icon: '🏭', description: 'AI manufacturing solutions' },
  { name: 'AI Marketing', href: '/ai-marketing', category: 'Business', icon: '📢', description: 'AI marketing solutions' },
  { name: 'AI Medical Assistant', href: '/ai-medical-assistant', category: 'AI & ML', icon: '⚕️', description: 'AI medical assistant' },
  { name: 'AI Medical Diagnosis Assistant', href: '/ai-medical-diagnosis-assistant', category: 'AI & ML', icon: '🔬', description: 'AI medical diagnosis support' },
  { name: 'AI Meeting Assistant', href: '/ai-meeting-assistant', category: 'Business', icon: '🎤', description: 'AI meeting management' },
  { name: 'AI Meeting Transcriber', href: '/ai-meeting-transcriber', category: 'Business', icon: '📝', description: 'Transcribe meetings with AI' },
  { name: 'AI Mental Health Companion', href: '/ai-mental-health-companion', category: 'AI & ML', icon: '🧠', description: 'AI mental health support' },
  { name: 'AI ML', href: '/ai-ml', category: 'AI & ML', icon: '🤖', description: 'Machine learning solutions' },
  { name: 'AI ML Platform', href: '/ai-ml-platform', category: 'AI & ML', icon: '🚀', description: 'Complete ML platform' },
  { name: 'AI Mobile App Builder', href: '/ai-mobile-app-builder', category: 'Developer', icon: '📱', description: 'Build mobile apps with AI' },
  { name: 'AI Mobile App Development', href: '/ai-mobile-app-development', category: 'Developer', icon: '💻', description: 'AI mobile development' },
  { name: 'AI Mobile Builder', href: '/ai-mobile-builder', category: 'Developer', icon: '🔨', description: 'AI mobile app builder' },
  { name: 'AI Music Composition', href: '/ai-music-composition', category: 'AI & ML', icon: '🎵', description: 'Compose music with AI' },
  { name: 'AI Neural Interface', href: '/ai-neural-interface', category: 'AI & ML', icon: '🧠', description: 'Neural interface technology' },
  { name: 'AI Neural Memory Assistant', href: '/ai-neural-memory-assistant', category: 'AI & ML', icon: '💾', description: 'AI memory assistance' },
  { name: 'AI NLP', href: '/ai-nlp', category: 'AI & ML', icon: '💬', description: 'Natural language processing' },
  { name: 'AI Ops', href: '/ai-ops', category: 'Developer', icon: '⚙️', description: 'AI operations platform' },
  { name: 'AI Password Manager', href: '/ai-password-manager', category: 'Security', icon: '🔐', description: 'AI-powered password management' },
  { name: 'AI Predictive Analytics', href: '/ai-predictive-analytics', category: 'AI & ML', icon: '🔮', description: 'Predictive analytics platform' },
  { name: 'AI Predictive Maintenance', href: '/ai-predictive-maintenance', category: 'Infrastructure', icon: '⚙️', description: 'Predictive maintenance solutions' },
  { name: 'AI Predictive Maintenance Pro', href: '/ai-predictive-maintenance-pro', category: 'Infrastructure', icon: '🔧', description: 'Advanced predictive maintenance' },
  { name: 'AI Predictive Modeling', href: '/ai-predictive-modeling', category: 'AI & ML', icon: '📊', description: 'Build predictive models' },
  { name: 'AI Price Optimizer', href: '/ai-price-optimizer', category: 'Business', icon: '💰', description: 'Dynamic pricing with AI' },
  { name: 'AI Price Optimizer Pro', href: '/ai-price-optimizer-pro', category: 'Business', icon: '💎', description: 'Advanced price optimization' },
  { name: 'AI Project Management', href: '/ai-project-management', category: 'Business', icon: '📁', description: 'AI project management' },
  { name: 'AI Project Management Pro', href: '/ai-project-management-pro', category: 'Business', icon: '🚀', description: 'Advanced project management' },
  { name: 'AI Project Manager', href: '/ai-project-manager', category: 'Business', icon: '👨‍💼', description: 'AI project manager assistant' },
  { name: 'AI Project Manager Pro', href: '/ai-project-manager-pro', category: 'Business', icon: '💼', description: 'Professional AI project manager' },
  { name: 'AI Quality Assurance', href: '/ai-quality-assurance', category: 'Developer', icon: '✅', description: 'AI quality assurance tools' },
  { name: 'AI Quantum Computing', href: '/ai-quantum-computing', category: 'AI & ML', icon: '⚛️', description: 'Quantum computing solutions' },
  { name: 'AI Quantum Computing Simulator', href: '/ai-quantum-computing-simulator', category: 'AI & ML', icon: '🔬', description: 'Quantum computing simulation' },
  { name: 'AI Quantum Financial Oracle', href: '/ai-quantum-financial-oracle', category: 'AI & ML', icon: '🔮', description: 'Quantum financial predictions' },
  { name: 'AI Quantum Optimization', href: '/ai-quantum-optimization', category: 'AI & ML', icon: '⚡', description: 'Quantum optimization algorithms' },
  { name: 'AI Quantum Task Optimizer', href: '/ai-quantum-task-optimizer', category: 'AI & ML', icon: '🎯', description: 'Quantum task optimization' },
  { name: 'AI Real Estate', href: '/ai-real-estate', category: 'Business', icon: '🏠', description: 'AI real estate solutions' },
  { name: 'AI Real Estate Analyzer', href: '/ai-real-estate-analyzer', category: 'Business', icon: '📊', description: 'Analyze real estate with AI' },
  { name: 'AI Recommendation Engine', href: '/ai-recommendation-engine', category: 'AI & ML', icon: '💡', description: 'AI recommendation systems' },
  { name: 'AI Recruitment Assistant', href: '/ai-recruitment-assistant', category: 'Business', icon: '👔', description: 'AI recruitment support' },
  { name: 'AI Robotics', href: '/ai-robotics', category: 'AI & ML', icon: '🤖', description: 'AI robotics solutions' },
  { name: 'AI Sales Automation', href: '/ai-sales-automation', category: 'Business', icon: '📈', description: 'Automate sales with AI' },
  { name: 'AI Scheduler', href: '/ai-scheduler', category: 'Business', icon: '📅', description: 'AI scheduling solutions' },
  { name: 'AI Scheduling Assistant', href: '/ai-scheduling-assistant', category: 'Business', icon: '🗓️', description: 'AI scheduling assistant' },
  { name: 'AI Security Monitor', href: '/ai-security-monitor', category: 'Security', icon: '🛡️', description: 'Monitor security with AI' },
  { name: 'AI Sentiment Analysis', href: '/ai-sentiment-analysis', category: 'AI & ML', icon: '😊', description: 'Analyze sentiment with AI' },
  { name: 'AI Sentiment Analyzer', href: '/ai-sentiment-analyzer', category: 'AI & ML', icon: '📊', description: 'Advanced sentiment analysis' },
  { name: 'AI SEO Optimizer', href: '/ai-seo-optimizer', category: 'Business', icon: '🔍', description: 'SEO optimization with AI' },
  { name: 'AI Smart Calendar', href: '/ai-smart-calendar', category: 'Business', icon: '📅', description: 'Intelligent calendar management' },
  { name: 'AI Smart City Solutions', href: '/ai-smart-city-solutions', category: 'Infrastructure', icon: '🏙️', description: 'Smart city AI solutions' },
  { name: 'AI Smart Contract Auditor', href: '/ai-smart-contract-auditor', category: 'Security', icon: '📜', description: 'Audit smart contracts with AI' },
  { name: 'AI Smart Home Controller', href: '/ai-smart-home-controller', category: 'Infrastructure', icon: '🏠', description: 'Control smart homes with AI' },
  { name: 'AI Smart Invoice', href: '/ai-smart-invoice', category: 'Business', icon: '🧾', description: 'Intelligent invoice management' },
  { name: 'AI Smart Scheduler', href: '/ai-smart-scheduler', category: 'Business', icon: '⏰', description: 'Smart scheduling solutions' },
  { name: 'AI Social Media Manager', href: '/ai-social-media-manager', category: 'Business', icon: '📱', description: 'Manage social media with AI' },
  { name: 'AI Social Media Scheduler', href: '/ai-social-media-scheduler', category: 'Business', icon: '📲', description: 'Schedule social posts with AI' },
  { name: 'AI Social Scheduler', href: '/ai-social-scheduler', category: 'Business', icon: '📅', description: 'Social media scheduling' },
  { name: 'AI Space Mission Optimizer', href: '/ai-space-mission-optimizer', category: 'AI & ML', icon: '🚀', description: 'Optimize space missions' },
  { name: 'AI Space Technology', href: '/ai-space-technology', category: 'AI & ML', icon: '🌌', description: 'Space technology solutions' },
  { name: 'AI Space Technology Pro', href: '/ai-space-technology-pro', category: 'AI & ML', icon: '⭐', description: 'Advanced space technology' },
  { name: 'AI Speech Synthesis', href: '/ai-speech-synthesis', category: 'AI & ML', icon: '🗣️', description: 'AI speech synthesis' },
  { name: 'AI Stock Portfolio Manager', href: '/ai-stock-portfolio-manager', category: 'AI & ML', icon: '📈', description: 'Manage portfolios with AI' },
  { name: 'AI Supply Chain', href: '/ai-supply-chain', category: 'Business', icon: '🚚', description: 'AI supply chain solutions' },
  { name: 'AI Supply Chain AI', href: '/ai-supply-chain-ai', category: 'Business', icon: '🤖', description: 'AI-powered supply chain' },
  { name: 'AI Supply Chain Optimization Pro', href: '/ai-supply-chain-optimization-pro', category: 'Business', icon: '⚡', description: 'Advanced supply chain optimization' },
  { name: 'AI Supply Chain Optimizer', href: '/ai-supply-chain-optimizer', category: 'Business', icon: '📦', description: 'Optimize supply chains' },
  { name: 'AI Task Manager', href: '/ai-task-manager', category: 'Business', icon: '✅', description: 'AI task management' },
  { name: 'AI Telepathic Interface', href: '/ai-telepathic-interface', category: 'AI & ML', icon: '🧠', description: 'Advanced neural interfaces' },
  { name: 'AI Time Tracker', href: '/ai-time-tracker', category: 'Business', icon: '⏱️', description: 'Track time with AI' },
  { name: 'AI Translation Service', href: '/ai-translation-service', category: 'AI & ML', icon: '🌐', description: 'AI translation services' },
  { name: 'AI Translation Services', href: '/ai-translation-services', category: 'AI & ML', icon: '🗣️', description: 'Professional translation services' },
  { name: 'AI Translator', href: '/ai-translator', category: 'AI & ML', icon: '💬', description: 'AI translator tool' },
  { name: 'AI Transportation', href: '/ai-transportation', category: 'Infrastructure', icon: '🚗', description: 'AI transportation solutions' },
  { name: 'AI Video Analysis', href: '/ai-video-analysis', category: 'AI & ML', icon: '🎬', description: 'Analyze videos with AI' },
  { name: 'AI Video Editor', href: '/ai-video-editor', category: 'AI & ML', icon: '✂️', description: 'Edit videos with AI' },
  { name: 'AI Video Generation', href: '/ai-video-generation', category: 'AI & ML', icon: '🎥', description: 'Generate videos with AI' },
  { name: 'AI Video Generator', href: '/ai-video-generator', category: 'AI & ML', icon: '🎞️', description: 'AI video generation' },
  { name: 'AI Vision', href: '/ai-vision', category: 'AI & ML', icon: '👁️', description: 'Computer vision solutions' },
  { name: 'AI Voice Assistant', href: '/ai-voice-assistant', category: 'AI & ML', icon: '🎙️', description: 'AI voice assistant' },
  { name: 'AI Voice Assistant Pro', href: '/ai-voice-assistant-pro', category: 'AI & ML', icon: '🔊', description: 'Advanced voice assistant' },
  { name: 'AI Voice Cloning', href: '/ai-voice-cloning', category: 'AI & ML', icon: '🎭', description: 'Clone voices with AI' },
  { name: 'AI Voice Cloning Studio', href: '/ai-voice-cloning-studio', category: 'AI & ML', icon: '🎨', description: 'Professional voice cloning' },
  { name: 'AI Voice Processing', href: '/ai-voice-processing', category: 'AI & ML', icon: '🔊', description: 'Process voice with AI' },
  { name: 'AI Voice Solutions', href: '/ai-voice-solutions', category: 'AI & ML', icon: '💬', description: 'Complete voice solutions' },
  { name: 'AI Voice Synthesis', href: '/ai-voice-synthesis', category: 'AI & ML', icon: '🗣️', description: 'Synthesize voice with AI' },
  { name: 'AI Website Analyzer', href: '/ai-website-analyzer', category: 'Business', icon: '🌐', description: 'Analyze websites with AI' },
  { name: 'AI Website Builder', href: '/ai-website-builder', category: 'Developer', icon: '🏗️', description: 'Build websites with AI' },
  { name: 'AI Workflow Automation', href: '/ai-workflow-automation', category: 'Business', icon: '⚙️', description: 'Automate workflows with AI' },
  { name: 'AI Writing Assistant', href: '/ai-writing-assistant', category: 'AI & ML', icon: '✍️', description: 'AI writing assistance' },
];

const categories = ['All', 'AI & ML', 'Business', 'Developer', 'Security', 'Infrastructure'];

export default function FeaturesShowcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFeatures = useMemo(() => {
    return allFeatures.filter(feature => {
      const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           feature.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || feature.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Explore All Our Features
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Discover {allFeatures.length}+ powerful AI and technology solutions designed to transform your business
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-400">
          Showing {filteredFeatures.length} of {allFeatures.length} features
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFeatures.map((feature) => (
          <a
            key={feature.href}
            href={feature.href}
            className="group bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl flex-shrink-0">{feature.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {feature.description}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <span className="text-xs text-purple-400 font-medium">{feature.category}</span>
            </div>
          </a>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No features found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
