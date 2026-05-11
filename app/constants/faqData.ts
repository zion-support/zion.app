export type FAQItem = {
  question: string;
  answer: string;
  group?: string;
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do we choose the right app to start with?',
    answer:
      'Start with one high-friction workflow that has clear business impact. We typically prioritize use cases tied to revenue acceleration, support volume reduction, or delivery speed.',
    group: 'Getting Started',
  },
  {
    question: 'How quickly can we launch a production-ready pilot?',
    answer:
      'Most teams launch an initial pilot in 2-4 weeks with clear KPI tracking, integration checkpoints, and a pragmatic handoff plan for operations.',
    group: 'Getting Started',
  },
  {
    question: 'How do you handle security and compliance requirements?',
    answer:
      'Security controls are defined during discovery and included in implementation scope, including access policies, auditability, and environment hardening.',
    group: 'Security & Compliance',
  },
  {
    question: 'Can Zion integrate with our existing tools and data stack?',
    answer:
      'Yes. Delivery plans are designed around existing systems, APIs, and team workflows so rollout improves operations instead of creating parallel complexity.',
    group: 'Integration',
  },
  {
    question: 'What does ownership look like after go-live?',
    answer:
      'You receive runbooks, observability guidance, and optimization recommendations so internal teams can operate confidently while continuing to improve outcomes.',
    group: 'Support',
  },
  {
    question: 'Do you offer industry-specific implementations?',
    answer:
      'Yes. We have tailored solutions for 47 verticals including financial services, healthcare, ecommerce, manufacturing, agriculture, construction, mining, pharmaceuticals, telecommunications, automotive, aerospace, maritime, food & beverage, oil & gas, banking, environmental & waste, gaming & esports, renewable energy & cleantech, sports & fitness, consumer goods & CPG, transportation & fleet, marketing & advertising, chemicals & materials, electronics & semiconductors, space & satellite, textiles & apparel, veterinary & animal health, home services & contractors, accounting & tax services, wholesale & distribution, asset management & investment, restaurants & food service, packaging & materials, warehousing & 3PL, staffing & recruiting, facilities & property management, and government. Each industry solution maps our apps to your compliance and workflow requirements.',
    group: 'Industries',
  },
  {
    question: 'Can we start with a single app or do we need a full bundle?',
    answer:
      'You can start with one app. Many teams begin with a single high-impact use case (e.g., AI Chatbot for support) and expand to bundles over time as they see results.',
    group: 'Products & Bundles',
  },
  {
    question: 'Where can I find implementation guides and best practices?',
    answer:
      'Our blog and resources section covers AI strategy, security-first deployment, ROI measurement, and implementation playbooks. Visit /blog for the latest insights.',
    group: 'Resources',
  },
  {
    question: 'What support options are available after go-live?',
    answer:
      'We offer runbooks, team training, and optional ongoing optimization support. Enterprise plans include dedicated success managers and 24/7 infrastructure monitoring.',
    group: 'Support',
  },
  {
    question: 'Can we combine multiple innovation bundles?',
    answer:
      'Yes. Many teams start with one bundle (e.g., Customer Success Engine) and add others (e.g., Revenue Command Center) as they expand use cases. We design for modular adoption.',
    group: 'Products & Bundles',
  },
  {
    question: 'Do you support R&D and life sciences workflows?',
    answer:
      'Yes. Our Research & Development Hub and Pharmaceuticals & Life Sciences solutions support document analysis, regulatory compliance, quality assurance, and knowledge extraction for research teams.',
    group: 'Industries',
  },
  {
    question: 'Do you support telecommunications and automotive industries?',
    answer:
      'Yes. Our Telecommunications and Automotive & Mobility solutions include predictive maintenance, supply chain optimization, customer support automation, and quality assurance. The Smart Fleet & Operations Hub bundles these capabilities for asset-intensive and logistics-focused operations.',
    group: 'Industries',
  },
  {
    question: 'Do you support aerospace, defense, and maritime industries?',
    answer:
      'Yes. Our Aerospace & Defense solution covers secure documentation, ITAR-aware compliance, and predictive maintenance. Maritime & Shipping includes fleet optimization, port logistics, cargo forecasting, and customs documentation. Both leverage our Supply Chain Optimizer and Compliance Manager.',
    group: 'Industries',
  },
  {
    question: 'Do you support food & beverage and oil & gas industries?',
    answer:
      'Yes. Our Food & Beverage solution covers demand forecasting, inventory optimization for perishables, and compliance tracking. Oil & Gas includes predictive maintenance for equipment, regulatory compliance automation, and supply chain visibility across upstream and downstream operations.',
    group: 'Industries',
  },
  {
    question: 'Do you support banking and environmental & waste industries?',
    answer:
      'Yes. Our Banking & Capital Markets solution covers fraud detection, AML workflows, risk assessment, and regulatory reporting. Environmental & Waste Management includes ESG reporting, emissions tracking, waste route optimization, and sustainability compliance. The AI Governance & Compliance Hub bundles these capabilities for regulatory-heavy operations.',
    group: 'Industries',
  },
  {
    question: 'Do you support gaming and renewable energy industries?',
    answer:
      'Yes. Our Gaming & Esports solution covers content moderation, fraud detection, player analytics, and community management for gaming platforms. Renewable Energy & Cleantech includes grid optimization, asset performance forecasting, sustainability reporting, and demand prediction for solar, wind, and cleantech operations. The AI Security & Threat Intelligence bundle supports gaming security workflows.',
    group: 'Industries',
  },
  {
    question: 'Do you support sports & fitness and consumer goods industries?',
    answer:
      'Yes. Our Sports & Fitness solution covers member engagement, retention analytics, personalized recommendations, and automated outreach for gyms, fitness apps, and wellness platforms. Consumer Goods & CPG includes demand forecasting, retail execution, trade promotion analytics, and supply chain optimization. The AI Wellness & Engagement Hub bundles sentiment tracking, chatbots, and analytics for fitness and wellness operations.',
    group: 'Industries',
  },
  {
    question: 'Do you support transportation and marketing & advertising industries?',
    answer:
      'Yes. Our Transportation & Fleet solution covers route optimization, driver scheduling, predictive maintenance, and demand forecasting for fleet operations and last-mile delivery. Marketing & Advertising includes campaign automation, creative analytics, ad spend optimization, and ROI measurement for agencies and in-house teams. The AI Fleet & Marketing Intelligence bundle combines supply chain optimization with marketing analytics for operations and growth teams.',
    group: 'Industries',
  },
  {
    question: 'Do you support chemicals & materials and electronics & semiconductors industries?',
    answer:
      'Yes. Our Chemicals & Materials solution covers supply chain optimization, quality control, batch traceability, and sustainability compliance for chemical and materials manufacturers. Electronics & Semiconductors includes yield optimization, predictive maintenance for equipment, quality assurance, and supply chain visibility for semiconductor and electronics operations. The AI Quality & Supply Intelligence bundle unifies quality assurance, supply chain optimization, and compliance tracking for manufacturing and materials workflows.',
    group: 'Industries',
  },
  {
    question: 'Do you support space & satellite and textiles & apparel industries?',
    answer:
      'Yes. Our Space & Satellite solution covers satellite health monitoring, ground station scheduling, orbital analytics, and mission planning with predictive maintenance and data pipeline workflows. Textiles & Apparel includes seasonal demand forecasting, raw material sourcing, inventory optimization, and sustainability compliance for textile and apparel manufacturers and retailers. The AI Orbital & Supply Intelligence bundle unifies predictive maintenance, supply chain optimization, and data pipelines for space and asset-intensive operations.',
    group: 'Industries',
  },
  {
    question: 'Do you support veterinary and home services industries?',
    answer:
      'Yes. Our Veterinary & Animal Health solution covers appointment scheduling, medical records management, inventory for supplies and medications, and client communications for veterinary clinics. Home Services & Contractors includes route optimization, technician scheduling, job dispatching, and inventory management for HVAC, plumbing, electrical, and home improvement contractors. The AI Care & Field Operations Hub unifies scheduling, document processing, and inventory workflows for care and field-service operations.',
    group: 'Industries',
  },
  {
    question: 'Do you support accounting and wholesale & distribution industries?',
    answer:
      'Yes. Our Accounting & Tax Services solution covers document processing, bookkeeping automation, invoicing, reconciliation, and compliance workflows for accounting firms and tax preparers. Wholesale & Distribution includes demand forecasting, warehouse optimization, order fulfillment automation, and B2B analytics for wholesalers and distributors. The AI Accounting & Tax Hub unifies document processing, accounting assistance, and invoicing for professional services and back-office operations.',
    group: 'Industries',
  },
  {
    question: 'Do you support asset management and restaurants & food service industries?',
    answer:
      'Yes. Our Asset Management & Investment solution covers portfolio analytics, risk assessment, regulatory reporting, and client communications for wealth managers and investment firms. Restaurants & Food Service includes demand forecasting, inventory optimization, scheduling automation, and compliance tracking for restaurants, catering, and food service operations. The AI Hospitality & Asset Intelligence Hub unifies demand prediction, scheduling, and inventory for hospitality and asset-intensive operations.',
    group: 'Industries',
  },
  {
    question: 'Do you offer data engineering and API development services?',
    answer:
      'Yes. Our Data Engineering service covers ETL/ELT pipeline design, real-time streaming, data warehouse architecture, data lake and lakehouse solutions, and data quality monitoring. API Development & Integration includes RESTful and GraphQL API design, API gateway management, third-party integrations, webhook systems, and enterprise-grade API security. Both services include production-grade orchestration and full documentation.',
    group: 'Services',
  },
  {
    question: 'Can you build mobile applications with AI features?',
    answer:
      'Yes. Our Mobile App Development service delivers cross-platform (React Native, Flutter) and native (iOS, Android) applications with AI-powered features, offline-first architecture, push notification campaigns, and App Store optimization. We support enterprise mobile apps, consumer applications, and IoT companion apps with secure authentication and MDM integration.',
    group: 'Services',
  },
  {
    question: 'What technology platforms do you integrate with?',
    answer:
      'We integrate with industry-leading platforms including AWS, Google Cloud, Microsoft Azure, Snowflake, Kubernetes, Terraform, OpenAI, Vercel, Datadog, Stripe, Salesforce, and HubSpot. Our integration-ready approach means we design for your existing systems, data pipelines, and team workflows from day one.',
    group: 'Integration',
  },
  {
    question: 'What new industries does Zion Tech Group support?',
    answer:
      'We now offer tailored AI solutions for Staffing & Recruiting and Facilities & Property Management, alongside 47 total industry verticals with specialized workflows. Staffing & Recruiting covers candidate sourcing, screening, and placement automation. Facilities & Property Management includes work order automation, preventive maintenance, and tenant services for commercial portfolios.',
    group: 'Industries',
  },
  {
    question: 'Do you support staffing and facilities management industries?',
    answer:
      'Yes. Our Staffing & Recruiting solution covers candidate sourcing, screening, pipeline management, and client engagement for staffing agencies and talent acquisition teams. Facilities & Property Management includes work order automation, preventive maintenance scheduling, tenant request workflows, and compliance tracking for commercial and multi-site property portfolios.',
    group: 'Industries',
  },
];
