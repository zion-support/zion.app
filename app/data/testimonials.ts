// Testimonials data — 6 client reviews with ratings and service references
// Used by TestimonialsSection component on the homepage

export interface Testimonial {
  id:           string;
  client_name:  string;
  role:         string;
  company:      string;
  avatar_emoji: string;
  rating:       number;      // 1–5
  review_text:  string;
  service_id:   string | null;
  featured:     boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    client_name:  "Sarah Chen",
    role:         "VP of Engineering",
    company:      "NovaStream Inc",
    avatar_emoji: "👩‍💼",
    rating:       5,
    review_text:  "Zion Tech Group's AI Customer Support Agent cut our ticket resolution time by 64% in the first month. Their team understood our stack instantly and had it live in 3 days.",
    service_id:   "ai-customer-support-agent",
    featured:     true,
  },
  {
    id: "t2",
    client_name:  "Marcus Thompson",
    role:         "CTO",
    company:      "DataPillar Analytics",
    avatar_emoji: "👨‍💻",
    rating:       5,
    review_text:  "The Automated Reporting Engine is a force multiplier. What used to take our data team 2 weeks every month now happens overnight. ROI was visible in the first billing cycle.",
    service_id:   "ai-automated-reporting",
    featured:     true,
  },
  {
    id: "t3",
    client_name:  "Dr. Aria Patel",
    role:         "Director of AI & Innovation",
    company:      "MediCore Health Systems",
    avatar_emoji: "👩‍🔬",
    rating:       5,
    review_text:  "Their AI Omnichannel Chatbot integration with our EHR system was seamless. Patient satisfaction scores jumped 28%. Impressive depth of healthcare AI knowledge.",
    service_id:   "ai-chatbot-omnichannel",
    featured:     false,
  },
  {
    id: "t4",
    client_name:  "James Okonkwo",
    role:         "Head of Security Operations",
    company:      "FortressGrid Cybersecurity",
    avatar_emoji: "👨‍🔐",
    rating:       5,
    review_text:  "Deployed the SIEM Security Platform across 3 data centers. The correlation rules and MITRE ATT&CK mapping alone saved us months of internal tooling work.",
    service_id:   "siem-security-platform",
    featured:     false,
  },
  {
    id: "t5",
    client_name:  "Elena Vasquez",
    role:         "COO",
    company:      "GreenPath Logistics",
    avatar_emoji: "👩‍💼",
    rating:       4,
    review_text:  "Supply Chain Visibility gave us real end-to-end tracking across 14 carriers. Disruption alerts let us reroute shipments before customers even noticed a delay.",
    service_id:   "supply-chain-visibility",
    featured:     false,
  },
  {
    id: "t6",
    client_name:  "Rajesh Kumar",
    role:         "Platform Lead",
    company:      "CloudNine SaaS",
    avatar_emoji: "👨‍✈️",
    rating:       5,
    review_text:  "Their Autonomous Code Deployment Agent now handles our entire CI-to-prod pipeline. We ship 3× more features per quarter without hiring additional DevOps engineers.",
    service_id:   "ai-autonomous-code-deployment",
    featured:     true,
  },
];
