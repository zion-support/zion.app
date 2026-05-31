#!/usr/bin/env python3
"""Insert Wave 51 + 52 + 53 services into servicesData.ts"""

path = "/data/data/com.termux/files/home/zion-support.github.io/app/data/servicesData.ts"

with open(path, 'r') as f:
    content = f.read()

last_close = content.rfind('];')
if last_close == -1:
    print("ERROR: Could not find closing ];")
    exit(1)

waves = """
  {
    id: "ai-micro-mobility-analytics",
    title: "AI Micro-Mobility Analytics Platform",
    description: "Smart analytics platform for e-scooter, e-bike, and micro-mobility fleet operators. Features demand prediction, optimal rebalancing routes, theft prevention, rider safety scoring, and regulatory compliance reporting. Integrates with Lime, Bird, and custom fleet management systems.",
    features: ["Demand prediction", "Fleet rebalancing optimization", "Theft prevention alerts", "Rider safety scoring", "Regulatory compliance", "Parking violation detection", "Battery management analytics"],
    benefits: ["35% higher fleet utilization", "50% reduced rebalancing costs", "Improved rider safety", "Regulatory compliance", "Lower theft losses"],
    pricing: { basic: "$399/mo", pro: "$1,199/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Bike",
    category: "ai",
    popular: false
  },
  {
    id: "ai-precision-brewing",
    title: "AI Precision Brewing System",
    description: "Machine learning platform for craft breweries and beverage producers. Optimizes fermentation parameters, predicts flavor profiles, detects contamination early, and manages inventory. Integrates with IoT sensors, SCADA, and ERP systems for end-to-end production optimization.",
    features: ["Fermentation optimization", "Flavor profile prediction", "Contamination early detection", "Inventory management", "IoT sensor integration", "SCADA/ERP connectivity", "Quality batch scoring"],
    benefits: ["30% fewer batch failures", "Consistent flavor quality", "Reduced waste", "Faster production cycles", "Regulatory compliance"],
    pricing: { basic: "$299/mo", pro: "$899/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Wine",
    category: "ai",
    popular: false
  },
  {
    id: "ai-sports-betting-analytics",
    title: "AI Sports Analytics & Betting Intelligence",
    description: "Advanced sports analytics platform that uses ML to predict game outcomes, player performance, and betting odds. Covers major leagues (NFL, NBA, MLB, Premier League, UFC). Features real-time odds comparison, value bet identification, and bankroll management tools.",
    features: ["Game outcome prediction", "Player performance analytics", "Real-time odds comparison", "Value bet identification", "Bankroll management", "Multi-league coverage", "Historical data analysis"],
    benefits: ["Higher prediction accuracy", "Value betting edge", "Risk management", "Real-time insights", "Data-driven decisions"],
    pricing: { basic: "$99/mo", pro: "$299/mo", enterprise: "$799/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Trophy",
    category: "ai",
    popular: false
  },
  {
    id: "ai-urban-farming",
    title: "AI Urban Farming Management",
    description: "Smart agriculture platform for urban farms, vertical farms, and rooftop gardens. Optimizes lighting, irrigation, nutrient delivery, and harvest timing using computer vision and IoT sensors. Integrates with e-commerce for direct-to-consumer sales and delivery management.",
    features: ["Growth optimization AI", "Nutrient delivery automation", "Harvest timing prediction", "Computer vision pest detection", "IoT sensor management", "E-commerce integration", "Delivery logistics"],
    benefits: ["40% higher yields", "50% water savings", "Pesticite-free growing", "Automated operations", "Direct sales integration"],
    pricing: { basic: "$199/mo", pro: "$599/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Sprout",
    category: "automation",
    popular: false
  },
  {
    id: "ai-translation-interpretation",
    title: "AI Simultaneous Interpretation Platform",
    description: "Real-time speech-to-speech translation for conferences, meetings, and events. Supports 80+ languages with near-zero latency. Features speaker identification, context-aware translation, technical terminology adaptation, and integration with Zoom, Teams, and WebEx.",
    features: ["Real-time speech-to-speech", "80+ language pairs", "Speaker identification", "Context-aware translation", "Technical terminology", "Meeting platform integration", "Live captioning"],
    benefits: ["Break language barriers", "Global audience reach", "Cost-effective interpretation", "Professional terminology", "Seamless integration"],
    pricing: { basic: "$149/event", pro: "$499/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Globe",
    category: "ai",
    popular: true
  },
  {
    id: "ai-fraud-detection-payments",
    title: "AI Payment Fraud Detection Engine",
    description: "Real-time fraud detection for payment processors, banks, and e-commerce. Uses ensemble ML models to detect fraudulent transactions with 99.5% accuracy while minimizing false positives. Features adaptive learning from new fraud patterns and regulatory reporting.",
    features: ["Real-time transaction scoring", "Ensemble ML models", "Adaptive learning", "False positive minimization", "Regulatory reporting", "Chargeback prevention", "Cross-channel detection"],
    benefits: ["99.5% detection accuracy", "50% fewer false positives", "Reduced chargebacks", "Adaptive to new threats", "Regulatory compliance"],
    pricing: { basic: "$999/mo", pro: "$2,999/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "CreditCard",
    category: "ai",
    popular: true
  },
  {
    id: "ai-document-generator",
    title: "AI Legal Document Generator",
    description: "Automated legal document generation for common contracts, agreements, and legal filings. Features clause library, jurisdiction-specific templates, redlining, and e-signature integration. Supports NDAs, employment contracts, leases, and corporate filings across 50+ jurisdictions.",
    features: ["Automated document generation", "Clause library (10K+)", "Jurisdiction-specific templates", "Redlining & comparison", "E-signature integration", "Version control", "Compliance checking"],
    benefits: ["90% faster document creation", "Reduced legal costs", "Consistent quality", "Jurisdiction compliance", "Version tracking"],
    pricing: { basic: "$199/mo", pro: "$599/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "FileText",
    category: "saas",
    popular: false
  },
  {
    id: "ai-petrochemical-optimization",
    title: "AI Petrochemical Process Optimization",
    description: "Machine learning platform for refinery and petrochemical plant optimization. Maximizes yield, reduces energy consumption, and ensures safety compliance. Integrates with DCS, historians, and laboratory information systems. Features predictive catalyst deactivation and blend optimization.",
    features: ["Yield maximization", "Energy consumption reduction", "Safety compliance monitoring", "Catalyst deactivation prediction", "Blend optimization", "DCS integration", "Environmental reporting"],
    benefits: ["5% yield improvement", "15% energy savings", "Improved safety", "Reduced emissions", "Optimized maintenance"],
    pricing: { basic: "Custom", pro: "Custom", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Factory",
    category: "ai",
    popular: false
  },
  {
    id: "ai-philanthropy-platform",
    title: "AI Philanthropy & Grant Management",
    description: "Intelligent grant management platform for foundations and nonprofits. Features AI-powered grantee discovery, impact measurement, donor management, and automated compliance reporting. Uses NLP to analyze proposals and predict project success rates.",
    features: ["Grantee discovery AI", "Impact measurement", "Donor management", "Automated compliance", "Proposal analysis", "Success prediction", "Tax reporting"],
    benefits: ["Data-driven giving", "Higher impact grants", "Reduced admin burden", "Donor retention", "Regulatory compliance"],
    pricing: { basic: "$149/mo", pro: "$449/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Heart",
    category: "saas",
    popular: false
  },
  {
    id: "ai-cultural-heritage-preservation",
    title: "AI Cultural Heritage Digitization",
    description: "AI platform for digitizing and preserving cultural heritage sites, artifacts, and documents. Features photogrammetry, 3D scanning, damage assessment, virtual tour generation, and multilingual audio guide creation. Used by museums, UNESCO, and cultural institutions in 40+ countries.",
    features: ["3D artifact scanning", "Damage assessment AI", "Virtual tour generation", "Multilingual audio guides", "Document transcription", "Restoration planning", "Digital archive management"],
    benefits: ["Preserve endangered heritage", "Global digital access", "Damage prevention", "Educational outreach", "Tourism enhancement"],
    pricing: { basic: "$399/mo", pro: "$1,199/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Landmark",
    category: "ai",
    popular: false
  },
  {
    id: "ai-ingredient-substitution",
    title: "AI Ingredient Substitution Engine",
    description: "ML-powered ingredient substitution for food manufacturers, restaurants, and dietary needs. Suggests alternatives based on nutrition, allergen profiles, cost, availability, and taste similarity. Includes regulatory compliance checking for target markets.",
    features: ["Nutritional equivalence matching", "Allergen-safe alternatives", "Cost optimization", "Availability checking", "Taste similarity scoring", "Regulatory compliance", "Recipe scaling"],
    benefits: ["Reduce ingredient costs", "Allergen-safe products", "Supply chain resilience", "Nutritional optimization", "Faster product development"],
    pricing: { basic: "$199/mo", pro: "$599/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "UtensilsCrossed",
    category: "ai",
    popular: false
  },
  {
    id: "ai-emotional-intelligence-coach",
    title: "AI Emotional Intelligence Coach",
    description: "AI-powered emotional intelligence training platform for corporate teams. Analyzes communication patterns in emails and messages to provide EI coaching. Features empathy scoring, conflict resolution suggestions, and personalized development plans. Integrates with Slack, Teams, and email clients.",
    features: ["EI scoring", "Communication pattern analysis", "Empathy coaching", "Conflict resolution suggestions", "Development plans", "Team health dashboard", "Integration with Slack/Teams"],
    benefits: ["Better team communication", "Reduced conflicts", "Higher empathy skills", "Improved leadership", "Measurable EI growth"],
    pricing: { basic: "$29/user/mo", pro: "$59/user/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "HeartHandshake",
    category: "saas",
    popular: true
  },
  {
    id: "ai-satellite-communication",
    title: "AI Satellite Communication Optimizer",
    description: "Machine learning platform for optimizing satellite communication links. Features adaptive coding and modification, interference prediction, bandwidth optimization, and link quality forecasting. Serves satellite operators, military, and maritime communications.",
    features: ["Adaptive coding & modulation", "Interference prediction", "Bandwidth optimization", "Link quality forecasting", "Multi-orbit support", "Spectrum management", "Handover optimization"],
    benefits: ["30% better bandwidth utilization", "Reduced interference", "Improved link reliability", "Lower operational costs", "Multi-orbit efficiency"],
    pricing: { basic: "Custom", pro: "Custom", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Satellite",
    category: "ai",
    popular: false
  },
  {
    id: "ai-warehouse-robotics",
    title: "AI Warehouse Robotics Coordinator",
    description: "Fleet management and coordination platform for warehouse robots (AMRs, AGVs, pick-and-place). Uses multi-agent RL for optimal task allocation, path planning, and collision avoidance. Integrates with WMS (Manhattan, Blue Yonder) and major robot manufacturers.",
    features: ["Multi-agent task allocation", "Collision-free path planning", "Dynamic replanning", "WMS integration", "Robot manufacturer agnostic", "Performance analytics", "Simulation environment"],
    benefits: ["45% faster order fulfillment", "Reduced labor costs", "Higher pick accuracy", "Scalable automation", "Measurable ROI"],
    pricing: { basic: "$1,499/mo", pro: "$4,499/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Bot",
    category: "automation",
    popular: true
  },
  {
    id: "ai-personal-finance-planner",
    title: "AI Personal Finance Planner",
    description: "Intelligent personal finance platform that analyzes spending patterns, optimizes budgets, and provides investment recommendations. Features goal-based planning, debt optimization, tax-loss harvesting, and retirement projections. Bank-level security with read-only account access via Plaid/Yodlee.",
    features: ["Spending pattern analysis", "Budget optimization", "Goal-based planning", "Debt payoff strategies", "Tax-loss harvesting", "Retirement projections", "Bank-grade security"],
    benefits: ["Smarter spending", "Faster debt payoff", "Optimized taxes", "Retirement readiness", "Financial confidence"],
    pricing: { basic: "$9/mo", pro: "$29/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Wallet",
    category: "saas",
    popular: true
  },
  {
    id: "ai-semiconductor-defect",
    title: "AI Semiconductor Defect Detection",
    description: "Computer vision platform for automated defect detection in semiconductor wafer fabrication. Uses deep learning to identify particles, pattern defects, and process variations at nanometer scale. Integrates with SEM, optical inspection tools, and fab MES systems.",
    features: ["Nanometer-scale defect detection", "Particle identification", "Pattern defect classification", "Process variation detection", "SEM/optical integration", "Fab MES connectivity", "Yield prediction"],
    benefits: ["99.9% defect detection", "Faster root cause analysis", "Higher yield", "Reduced scrap", "Process optimization"],
    pricing: { basic: "Custom", pro: "Custom", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Cpu",
    category: "ai",
    popular: false
  },
  {
    id: "ai-grief-therapy-companion",
    title: "AI Grief Therapy Companion",
    description: "Compassionate AI companion for individuals experiencing grief and loss. Provides 24/7 conversational support, journaling prompts, coping exercise recommendations, and therapist matching. Developed with licensed grief counselors. HIPAA compliant and available in 20+ languages.",
    features: ["Compassionate conversational AI", "Grief stage recognition", "Journaling prompts", "Coping exercise recommendations", "Therapist matching", "Crisis escalation", "Multilingual support"],
    benefits: ["24/7 available support", "Non-judgmental listening", "Coping skill development", "Bridge to professional help", "Accessible mental health"],
    pricing: { basic: "$29/mo", pro: "$59/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "HeartPulse",
    category: "saas",
    popular: false
  },
  {
    id: "ai-air-traffic-optimization",
    title: "AI Air Traffic Flow Optimization",
    description: "Machine learning platform for air traffic management and flow optimization. Predicts congestion, recommends routing changes, and optimizes runway sequencing. Integrates with FAA EUROCONTROL systems and airline operations centers. Reduces delays by up to 25% and fuel burn by 8%.",
    features: ["Congestion prediction", "Dynamic routing", "Runway sequencing optimization", "FAA/EUROCONTOL integration", "Fuel burn minimization", "Weather impact modeling", "Slot management"],
    benefits: ["25% delay reduction", "8% fuel savings", "Higher ATC efficiency", "Reduced emissions", "Better on-time performance"],
    pricing: { basic: "Custom", pro: "Custom", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Plane",
    category: "ai",
    popular: false
  },
  {
    id: "ai-competitive-intelligence",
    title: "AI Competitive Intelligence Platform",
    description: "Automated competitive intelligence gathering and analysis. Monitors competitors' pricing, product changes, hiring, patents, news, and social media. Generates battlecards, positioning recommendations, and market opportunity alerts. Covers 10M+ companies globally.",
    features: ["Competitor monitoring", "Pricing intelligence", "Product change tracking", "Hiring & org analysis", "Patent monitoring", "Battlecard generation", "Market opportunity alerts"],
    benefits: ["Real-time competitive insights", "Faster strategic response", "Pricing optimization", "Market opportunity identification", "Automated intelligence gathering"],
    pricing: { basic: "$499/mo", pro: "$1,499/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Search",
    category: "ai",
    popular: true
  },
  {
    id: "ai-waste-sorting-robotics",
    title: "AI Waste Sorting Robotics",
    description: "Computer vision and robotic sorting system for recycling facilities. Identifies and sorts materials at 80 items/minute with 99% accuracy. Features contamination detection, material composition analysis, and integration with conveyor systems. Reduces landfill waste by 40%.",
    features: ["High-speed material identification", "Contamination detection", "Material composition analysis", "Conveyor integration", "Robotic sorting arm control", "Waste stream analytics", "Contamination reporting"],
    benefits: ["99% sorting accuracy", "40% landfill reduction", "Lower labor costs", "Higher commodity purity", "Regulatory compliance"],
    pricing: { basic: "Custom", pro: "Custom", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Recycle",
    category: "automation",
    popular: false
  },
  {
    id: "ai-construction-site-safety",
    title: "AI Construction Site Safety Monitor",
    description: "Real-time computer vision platform for construction site safety monitoring. Detects PPE violations, unsafe zone entries, equipment hazards, and near-miss incidents. Generates safety reports, contractor scoring, and OSHA compliance documentation. Integrates with site cameras and wearables.",
    features: ["PPE violation detection", "Unsafe zone monitoring", "Equipment hazard detection", "Near-miss incident detection", "Contractor safety scoring", "OSHA compliance reporting", "Real-time alerts"],
    benefits: ["60% fewer safety incidents", "OSHA compliance", "Lower insurance costs", "Faster incident response", "Data-driven safety culture"],
    pricing: { basic: "$599/mo", pro: "$1,799/mo", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "HardHat",
    category: "ai",
    popular: true
  },
  {
    id: "ai-music-composition",
    title: "AI Music Composition Platform",
    description: "AI-powered music composition tool for content creators, advertisers, and game studios. Generates original music in any style, tempo, and mood. Features royalty-free licensing, stem separation, adaptive scoring for video, and integration with DAWs (Ableton, Logic, FL Studio).",
    features: ["Original music generation", "Style/tempo/mood control", "Royalty-free licensing", "Stem separation", "Adaptive video scoring", "DAW integration", "Custom voice/instrument training"],
    benefits: ["Instant music creation", "Royalty-free content", "Any style on demand", "Production-quality output", "Faster content creation"],
    pricing: { basic: "$49/mo", pro: "$149/mo", enterprise: "$499/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Music",
    category: "ai",
    popular: false
  },
  {
    id: "ai-telco-network-optimization",
    title: "AI Telecom Network Optimization",
    description: "Machine learning platform for telecom network optimization. Predicts capacity needs, optimizes cell tower placement, detects anomalies, and automates network slicing for 5G. Integrates with OSS/BSS systems and major vendor equipment (Ericsson, Nokia, Huawei).",
    features: ["Capacity prediction", "Cell tower optimization", "Anomaly detection", "5G network slicing", "OSS/BSS integration", "Churn prediction", "QoE optimization"],
    benefits: ["30% CAPEX savings", "Better QoE", "Faster 5G rollout", "Reduced churn", "Automated operations"],
    pricing: { basic: "Custom", pro: "Custom", enterprise: "Custom" },
    contactInfo: { website: "https://ziontechgroup.com", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    icon: "Wifi",
    category: "ai",
    popular: false
  }
"""

new_content = content[:last_close] + waves + content[last_close:]

with open(path, 'w') as f:
    f.write(new_content)

with open(path, 'r') as f:
    new = f.read()

import re
services = re.findall(r'\{\s*\n\s*id:', new)
print(f"Waves 51-53: Inserted successfully!")
print(f"Total service blocks: {len(services)}")
print(f"Total lines: {len(new.splitlines())}")
