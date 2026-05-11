/**
 * Industry-specific FAQ items for solution pages.
 * Use with SolutionPageFAQ component.
 */

export type FAQItem = { question: string; answer: string };

export const SOLUTION_FAQS: Record<string, FAQItem[]> = {
  'packaging-materials': [
    {
      question: 'How do AI solutions integrate with our packaging and production systems?',
      answer:
        'We integrate with ERP, MES, and quality management systems. Discovery maps your production and supply chain tools to define integration scope.',
    },
    {
      question: 'Can we automate quality inspection and defect detection?',
      answer:
        'Yes. AI Quality Assurance and image recognition can automate visual inspection for packaging defects. Many manufacturers see 25–40% reduction in manual inspection time.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most packaging pilots launch in 3–4 weeks. We scope a focused use case (e.g., quality checks or demand forecasting) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'energy-utilities': [
    {
      question: 'How do AI solutions integrate with our SCADA or grid systems?',
      answer:
        'We integrate with common SCADA, EMS, and grid management platforms. Discovery maps your systems and defines integration scope for forecasting and monitoring.',
    },
    {
      question: 'Can we improve demand forecasting and load balancing?',
      answer:
        'Yes. AI Predictive Analytics and Energy Manager optimize demand forecasting, renewable integration, and load balancing. Many utilities see 15–25% improvement in forecast accuracy.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most utility pilots launch in 4–6 weeks. We scope a focused use case (e.g., demand forecasting or asset monitoring) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'textiles-apparel': [
    {
      question: 'How do AI solutions help with seasonal forecasting and inventory?',
      answer:
        'AI Sales Predictor and Smart Inventory Manager improve demand forecasting for seasonal lines. Many apparel brands see 30–40% improvement in forecast accuracy and fewer markdowns.',
    },
    {
      question: 'Can we automate design or visual content creation?',
      answer:
        'Yes. Content Studio and AI Image Generator can create product imagery, lookbooks, and marketing assets at scale while maintaining brand consistency.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most apparel pilots launch in 3–4 weeks. We scope a focused use case (e.g., demand forecasting or content creation) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'chemicals-materials': [
    {
      question: 'How do AI solutions integrate with our batch and quality systems?',
      answer:
        'We integrate with MES, LIMS, and quality management systems. Discovery maps your production and compliance tools to define integration scope.',
    },
    {
      question: 'Can we reduce batch defects and improve traceability?',
      answer:
        'Yes. AI Quality Assurance and Compliance Manager automate batch traceability and defect analysis. Many chemical producers see 25–35% reduction in non-conformance incidents.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most chemical pilots launch in 4–6 weeks. We scope a focused use case (e.g., quality traceability or compliance reporting) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'restaurants-food-service': [
    {
      question: 'How do AI solutions integrate with our POS or ordering systems?',
      answer:
        'We integrate with common POS, online ordering, and inventory platforms. Discovery maps your systems and defines integration scope for forecasting and operations.',
    },
    {
      question: 'Can we reduce food waste with better demand forecasting?',
      answer:
        'Yes. AI Sales Predictor and Smart Inventory Manager improve demand forecasting for perishables. Many food service operators see 20–30% reduction in waste.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most restaurant pilots launch in 2–3 weeks. We scope a focused use case (e.g., inventory forecasting or scheduling) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, staff training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'asset-management': [
    {
      question: 'How do AI solutions integrate with our portfolio and risk systems?',
      answer:
        'We integrate with common portfolio management, risk, and reporting platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we automate compliance and regulatory reporting?',
      answer:
        'Yes. Compliance Manager and AI Report Generator automate regulatory filings, audit trails, and client reporting. Many asset managers see 40–50% reduction in manual reporting time.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most asset management pilots launch in 4–6 weeks. We scope a focused use case (e.g., compliance reporting or risk analytics) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'mining-natural-resources': [
    {
      question: 'How do AI solutions integrate with our mining and fleet systems?',
      answer:
        'We integrate with fleet management, SCADA, and resource planning systems. Discovery maps your operations and defines integration scope.',
    },
    {
      question: 'Can we improve predictive maintenance and reduce downtime?',
      answer:
        'Yes. AI Predictive Maintenance and Data Pipeline monitor equipment signals and predict failures. Many mining operations see 20–30% reduction in unplanned downtime.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most mining pilots launch in 4–6 weeks. We scope a focused use case (e.g., predictive maintenance or compliance) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'veterinary-animal-health': [
    {
      question: 'How do AI solutions integrate with our practice management system?',
      answer:
        'We integrate with common veterinary practice management and scheduling platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we reduce no-shows and improve scheduling?',
      answer:
        'Yes. AI Scheduling Assistant and Chatbot Builder automate reminders and booking. Many clinics see 25–35% reduction in no-shows and improved client communication.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most veterinary pilots launch in 2–3 weeks. We scope a focused use case (e.g., scheduling or client communication) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, staff training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'pharmaceuticals-life-sciences': [
    {
      question: 'How do AI solutions integrate with our clinical and regulatory systems?',
      answer:
        'We integrate with CTMS, EDC, and document management systems. Discovery maps your systems and defines integration scope for trial and regulatory workflows.',
    },
    {
      question: 'Can we accelerate trial data analysis and regulatory submissions?',
      answer:
        'Yes. AI Document Analyzer and Report Generator automate data summaries and regulatory submissions. Many pharma teams see 40–60% faster analysis and submission cycles.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most pharma pilots launch in 6–8 weeks due to validation requirements. We scope a focused use case and follow GxP-aligned implementation.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, validation support, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'environmental-waste-management': [
    {
      question: 'How do AI solutions integrate with our routing and operations systems?',
      answer:
        'We integrate with fleet management, routing, and materials tracking systems. Discovery maps your operations and defines integration scope.',
    },
    {
      question: 'Can we improve recycling efficiency and route optimization?',
      answer:
        'Yes. AI Predictive Analytics and Supply Chain Optimizer improve route planning and material sorting. Many waste operators see 30–40% improvement in recovery rates and route efficiency.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most waste management pilots launch in 3–4 weeks. We scope a focused use case (e.g., routing or materials tracking) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'sports-fitness': [
    {
      question: 'How do AI solutions integrate with our membership or booking system?',
      answer:
        'We integrate with common gym and fitness membership platforms. Discovery maps your systems and defines integration scope for engagement and scheduling.',
    },
    {
      question: 'Can we improve member retention and engagement?',
      answer:
        'Yes. AI Customer Sentiment Tracker and Chatbot Builder personalize engagement and automate outreach. Many gym chains see 25–35% improvement in retention.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most fitness pilots launch in 2–3 weeks. We scope a focused use case (e.g., member communication or scheduling) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, staff training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'logistics-supply-chain': [
    {
      question: 'How do AI solutions integrate with our TMS or WMS?',
      answer:
        'We integrate with common TMS, WMS, and ERP systems. Discovery maps your logistics stack and defines integration scope for forecasting and optimization.',
    },
    {
      question: 'Can we reduce planning time and improve fulfillment accuracy?',
      answer:
        'Yes. Supply Chain Optimizer and AI Predictive Analytics automate demand forecasting and reduce bottlenecks. Many logistics providers see 50–60% faster planning cycles.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most logistics pilots launch in 3–4 weeks. We scope a focused use case (e.g., demand forecasting or route optimization) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'oil-gas': [
    {
      question: 'How do AI solutions integrate with our SCADA or asset systems?',
      answer:
        'We integrate with SCADA, asset management, and compliance platforms. Discovery maps your systems and defines integration scope for monitoring and reporting.',
    },
    {
      question: 'Can we reduce unplanned downtime with predictive maintenance?',
      answer:
        'Yes. AI Predictive Maintenance and Data Pipeline monitor equipment and predict failures. Many oil and gas operators see 20–30% reduction in unplanned downtime.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most oil and gas pilots launch in 4–6 weeks. We scope a focused use case (e.g., predictive maintenance or compliance reporting) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'construction-engineering': [
    {
      question: 'How do AI solutions integrate with our project and document systems?',
      answer:
        'We integrate with common project management, BIM, and document management platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we automate document review and compliance tracking?',
      answer:
        'Yes. AI Document Processor and Contract Analyzer automate RFI, submittal, and contract review. Many construction firms see 40–50% reduction in document review time.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most construction pilots launch in 4–5 weeks. We scope a focused use case (e.g., document processing or project reporting) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'electronics-semiconductors': [
    {
      question: 'How do AI solutions integrate with our fab and yield systems?',
      answer:
        'We integrate with MES, yield management, and equipment monitoring systems. Discovery maps your fab stack and defines integration scope.',
    },
    {
      question: 'Can we improve yield and reduce variability?',
      answer:
        'Yes. AI Predictive Maintenance and Data Pipeline correlate equipment signals with yield outcomes. Many fabs see 15–25% improvement in yield and reduced variability.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most semiconductor pilots launch in 6–8 weeks. We scope a focused use case (e.g., yield correlation or predictive maintenance) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, engineer training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'home-services-contractors': [
    {
      question: 'How do AI solutions integrate with our dispatch or scheduling system?',
      answer:
        'We integrate with common field service, dispatch, and CRM platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we improve dispatch efficiency and reduce no-shows?',
      answer:
        'Yes. AI Scheduling Assistant and Route Optimizer improve dispatch and routing. Many home services companies see 35–45% improvement in first-time completion and reduced no-shows.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most home services pilots launch in 2–3 weeks. We scope a focused use case (e.g., scheduling or dispatch) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, staff training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'media-entertainment': [
    {
      question: 'How do AI solutions integrate with our production and asset systems?',
      answer:
        'We integrate with MAM, production, and distribution platforms. Discovery maps your systems and defines integration scope for content and analytics.',
    },
    {
      question: 'Can we reduce content production time and scale output?',
      answer:
        'Yes. Content Studio and AI Video Generator automate asset creation and repurposing. Many studios see 40–50% reduction in production time and higher output.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most media pilots launch in 3–4 weeks. We scope a focused use case (e.g., content creation or analytics) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'agriculture-agritech': [
    {
      question: 'How do AI solutions integrate with our farm or equipment systems?',
      answer:
        'We integrate with precision ag, IoT, and farm management platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we improve yield forecasting and resource optimization?',
      answer:
        'Yes. AI Predictive Analytics and Data Pipeline improve yield forecasting and input optimization. Many ag operations see 20–30% improvement in forecast accuracy.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most agriculture pilots launch in 3–4 weeks. We scope a focused use case (e.g., yield forecasting or compliance) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'maritime-shipping': [
    {
      question: 'How do AI solutions integrate with our vessel and port systems?',
      answer:
        'We integrate with vessel management, port, and cargo systems. Discovery maps your operations and defines integration scope.',
    },
    {
      question: 'Can we reduce port delays and improve scheduling?',
      answer:
        'Yes. AI Supply Chain Optimizer and Predictive Maintenance improve vessel scheduling and cargo forecasting. Many shipping lines see 25–35% reduction in port delays.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most maritime pilots launch in 4–5 weeks. We scope a focused use case (e.g., scheduling or maintenance) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'marketing-advertising': [
    {
      question: 'How do AI solutions integrate with our ad and analytics platforms?',
      answer:
        'We integrate with common ad platforms, analytics, and CRM. Discovery maps your marketing stack and defines integration scope.',
    },
    {
      question: 'Can we improve campaign ROI and attribution?',
      answer:
        'Yes. AI Marketing Automation and Smart Analytics Dashboard optimize attribution and ad spend. Many agencies see 35–45% improvement in campaign ROI.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most marketing pilots launch in 2–3 weeks. We scope a focused use case (e.g., attribution or creative automation) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'renewable-energy-cleantech': [
    {
      question: 'How do AI solutions integrate with our generation or grid systems?',
      answer:
        'We integrate with SCADA, forecasting, and grid management platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we improve forecast accuracy and grid balancing?',
      answer:
        'Yes. AI Predictive Analytics and Energy Manager optimize production forecasting and grid decisions. Many renewable operators see 25–35% improvement in forecast accuracy.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most renewable pilots launch in 4–5 weeks. We scope a focused use case (e.g., forecasting or asset monitoring) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'wholesale-distribution': [
    {
      question: 'How do AI solutions integrate with our WMS or ERP?',
      answer:
        'We integrate with common WMS, ERP, and order management systems. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we improve inventory accuracy and reduce stockouts?',
      answer:
        'Yes. Smart Inventory Manager and AI Supply Chain Optimizer align demand with supply. Many distributors see 30–40% improvement in inventory accuracy and fewer stockouts.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most wholesale pilots launch in 3–4 weeks. We scope a focused use case (e.g., inventory optimization or demand forecasting) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'automotive-mobility': [
    {
      question: 'How do AI solutions integrate with our supply chain or manufacturing systems?',
      answer:
        'We integrate with ERP, MES, and supply chain platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we streamline parts supply and reduce stockouts?',
      answer:
        'Yes. AI Supply Chain Optimizer and Smart Inventory Manager align parts demand with supplier lead times. Many OEMs see 35–45% improvement in replenishment and fewer stockouts.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most automotive pilots launch in 4–6 weeks. We scope a focused use case (e.g., supply chain or quality) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'gaming-esports': [
    {
      question: 'How do AI solutions integrate with our game or platform systems?',
      answer:
        'We integrate with game engines, moderation, and analytics platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we reduce toxic content and fraudulent activity?',
      answer:
        'Yes. AI Content Moderator and Fraud Detector automate moderation and detect fraudulent accounts. Many gaming platforms see 45–55% reduction in policy violations.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most gaming pilots launch in 3–4 weeks. We scope a focused use case (e.g., moderation or fraud detection) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'consumer-goods-cpg': [
    {
      question: 'How do AI solutions integrate with our demand or supply systems?',
      answer:
        'We integrate with demand planning, ERP, and retail systems. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we improve demand forecast accuracy?',
      answer:
        'Yes. AI Sales Predictor and Smart Inventory Manager align production with retail demand. Many CPG brands see 35–45% improvement in forecast accuracy and less excess inventory.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most CPG pilots launch in 4–5 weeks. We scope a focused use case (e.g., demand forecasting or trade promotion) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'space-satellite': [
    {
      question: 'How do AI solutions integrate with our ground station or mission systems?',
      answer:
        'We integrate with ground station, mission planning, and telemetry platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we reduce ground station downtime and improve scheduling?',
      answer:
        'Yes. AI Predictive Maintenance and Data Pipeline monitor equipment and optimize scheduling. Many satellite operators see 20–25% reduction in ground station downtime.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most space pilots launch in 5–6 weeks. We scope a focused use case (e.g., predictive maintenance or data processing) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'aerospace-defense': [
    {
      question: 'How do AI solutions integrate with our document and compliance systems?',
      answer:
        'We integrate with document management, PLM, and compliance platforms. Discovery maps your systems and defines integration scope for ITAR and export control.',
    },
    {
      question: 'Can we reduce document review time and improve compliance?',
      answer:
        'Yes. AI Document Processor and Contract Analyzer automate compliance documentation. Many aerospace suppliers see 45–55% reduction in document review time.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most aerospace pilots launch in 5–6 weeks. We scope a focused use case and follow security and export control requirements.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'warehousing-3pl': [
    {
      question: 'How do AI solutions integrate with our WMS or TMS?',
      answer:
        'We integrate with common WMS, TMS, and ERP systems. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we improve inventory accuracy and fulfillment speed?',
      answer:
        'Yes. Smart Inventory Manager and AI Supply Chain Optimizer improve accuracy and reduce bottlenecks. Many 3PLs see 30–40% improvement in inventory accuracy and faster fulfillment.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most warehousing pilots launch in 3–4 weeks. We scope a focused use case (e.g., inventory optimization or demand forecasting) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'banking-and-capital-markets': [
    {
      question: 'How do AI solutions integrate with our core banking or trading systems?',
      answer:
        'We integrate with core banking, trading, and risk platforms. Discovery maps your systems and defines integration scope for compliance and monitoring.',
    },
    {
      question: 'Can we reduce fraud and improve transaction monitoring?',
      answer:
        'Yes. AI Fraud Detector and Risk Assessor enable real-time monitoring and adaptive scoring. Many banks see 30–40% reduction in fraud incidents.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most banking pilots launch in 6–8 weeks. We scope a focused use case (e.g., fraud detection or compliance) and follow regulatory requirements.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'accounting-tax-services': [
    {
      question: 'How do AI solutions integrate with our accounting or tax software?',
      answer:
        'We integrate with common accounting, tax prep, and practice management platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we automate document processing and reduce manual entry?',
      answer:
        'Yes. AI Document Processor and Accounting Assistant automate intake and reconciliation. Many accounting firms see 45–55% reduction in manual data entry.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most accounting pilots launch in 3–4 weeks. We scope a focused use case (e.g., document processing or reconciliation) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'staffing-recruiting': [
    {
      question: 'How do AI solutions integrate with our ATS or HR systems?',
      answer:
        'We integrate with common ATS, HRIS, and CRM platforms. Discovery maps your recruitment stack and defines integration scope for candidate sourcing and pipeline management.',
    },
    {
      question: 'Can we reduce time-to-fill and improve placement quality?',
      answer:
        'Yes. AI Recruitment Pro and Talent Analytics automate screening, matching, and pipeline prioritization. Many staffing agencies see 30–40% reduction in time-to-fill.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most staffing pilots launch in 3–4 weeks. We scope a focused use case (e.g., candidate screening or client reporting) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'facilities-property-management': [
    {
      question: 'How do AI solutions integrate with our CMMS or property management system?',
      answer:
        'We integrate with common CMMS, IWMS, and property management platforms. Discovery maps your systems and defines integration scope for work orders and maintenance.',
    },
    {
      question: 'Can we reduce work order backlog and improve tenant satisfaction?',
      answer:
        'Yes. AI Scheduling Assistant and Predictive Maintenance automate work order routing and preventive planning. Many property managers see 35–45% reduction in backlog.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most facilities pilots launch in 3–4 weeks. We scope a focused use case (e.g., work order automation or maintenance scheduling) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'food-beverage': [
    {
      question: 'How do AI solutions integrate with our demand or inventory systems?',
      answer:
        'We integrate with demand planning, ERP, and distribution platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we reduce waste with better demand forecasting?',
      answer:
        'Yes. AI Sales Predictor and Smart Inventory Manager improve demand forecasting for perishables. Many food distributors see 25–35% reduction in waste.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most food and beverage pilots launch in 3–4 weeks. We scope a focused use case (e.g., demand forecasting or inventory) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'hospitality-travel': [
    {
      question: 'How do AI solutions integrate with our PMS or booking systems?',
      answer:
        'We integrate with common PMS, booking, and CRM platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we improve guest experience and reduce no-shows?',
      answer:
        'Yes. AI Chatbot Builder and Scheduling Assistant automate guest communication and booking. Many hospitality operators see 25–35% improvement in no-shows and guest satisfaction.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most hospitality pilots launch in 2–3 weeks. We scope a focused use case (e.g., guest communication or revenue management) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, staff training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'non-profit-social-impact': [
    {
      question: 'How do AI solutions integrate with our donor or program systems?',
      answer:
        'We integrate with donor management, CRM, and program tracking platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we scale outreach and program impact?',
      answer:
        'Yes. AI Marketing Automation and Chatbot Builder automate donor communication and program support. Many non-profits see 30–40% improvement in engagement and efficiency.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most non-profit pilots launch in 3–4 weeks. We scope a focused use case (e.g., donor communication or program reporting) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, team training, and handoff guidance are included. We offer discounted rates for qualified non-profits.',
    },
  ],
  'transportation-fleet': [
    {
      question: 'How do AI solutions integrate with our fleet or dispatch systems?',
      answer:
        'We integrate with fleet management, dispatch, and routing platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we reduce route costs and improve dispatch?',
      answer:
        'Yes. AI Supply Chain Optimizer and Scheduling Assistant optimize routes and driver allocation. Many fleet operators see 25–35% reduction in routing costs.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most fleet pilots launch in 3–4 weeks. We scope a focused use case (e.g., route optimization or scheduling) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, dispatcher training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
  'real-estate-property': [
    {
      question: 'How do AI solutions integrate with our property or CRM systems?',
      answer:
        'We integrate with property management, CRM, and listing platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we automate tenant communication and maintenance scheduling?',
      answer:
        'Yes. AI Chatbot Builder and Scheduling Assistant automate inquiries and maintenance requests. Many property managers see 30–40% improvement in response time and tenant satisfaction.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most real estate pilots launch in 2–3 weeks. We scope a focused use case (e.g., tenant communication or document processing) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, staff training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
    },
  ],
  'telecommunications': [
    {
      question: 'How do AI solutions integrate with our network or OSS systems?',
      answer:
        'We integrate with network management, OSS, and ticketing platforms. Discovery maps your systems and defines integration scope.',
    },
    {
      question: 'Can we reduce outages with predictive maintenance?',
      answer:
        'Yes. AI Predictive Maintenance and Data Pipeline monitor infrastructure proactively. Many telecom operators see 35–45% reduction in network outages.',
    },
    {
      question: 'How quickly can we deploy a pilot?',
      answer:
        'Most telecom pilots launch in 4–5 weeks. We scope a focused use case (e.g., predictive maintenance or customer support) and expand from there.',
    },
    {
      question: 'What support is included after go-live?',
      answer:
        'Runbooks, operator training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 monitoring.',
    },
  ],
};
