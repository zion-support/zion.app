"""
Generate stub pages for all broken links in the built site.
Each stub page redirects to the relevant section or provides useful content.
"""
import os

BASE = "/data/data/com.termux/files/home/zion-support.github.io/app"

def make_page(title, description, extra_links=None):
    links_html = ""
    if extra_links:
        for href, label in extra_links:
            links_html += f'        <Link href="{href}" className="text-emerald-400 hover:text-emerald-300 underline">{label}</Link>\n'
    
    return f'''import Link from 'next/link';

export const metadata = {{
  title: '{title} | Zion Tech Group',
  description: '{description}',
}};

export default function Page() {{
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-slate-400 text-lg mb-8">{description}</p>
        <div className="flex flex-wrap gap-4">
{links_html}        </div>
        <div className="mt-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-3">Get Started Today</h2>
          <p className="text-slate-400 mb-4">Contact our team for a free consultation.</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="tel:+13024640950" className="text-emerald-400">📞 +1 302 464 0950</a>
            <a href="mailto:kleber@ziontechgroup.com" className="text-emerald-400">✉️ kleber@ziontechgroup.com</a>
          </div>
        </div>
      </div>
    </main>
  );
}}
'''

# Map of broken paths to page definitions
pages = [
    # Blog posts referenced from free-resources
    ("blog/ai-driven-marketing-automation-strategies", "AI-Driven Marketing Automation Strategies", "Learn how AI is transforming marketing automation with predictive targeting, personalized campaigns, and intelligent workflows.", [("/blog", "All Blog Posts"), ("/services", "Our Services")]),
    ("blog/ai-security-best-practices-protecting-your-ai-systems-from-emerging-threats", "AI Security Best Practices", "Protect your AI systems from emerging threats with these essential security practices and frameworks.", [("/blog", "All Blog Posts"), ("/services", "Security Services")]),
    ("blog/cloud-migration-and-ai-modernizing-infrastructure-for-intelligent-workloads", "Cloud Migration & AI Infrastructure", "Modernize your infrastructure for intelligent workloads with cloud migration strategies and AI integration.", [("/blog", "All Blog Posts"), ("/services", "Cloud Services")]),
    
    # Docs pages
    ("docs", "Documentation Center", "Comprehensive documentation for all Zion Tech Group services, APIs, and integrations.", [("/services", "Services"), ("/contact", "Contact Us")]),
    ("docs/API_REGISTRY", "API Registry", "Complete reference of all supported APIs, providers, and configuration guides.", [("/docs", "Documentation"), ("/contact", "Get API Access")]),
    ("docs/FREE-AI-TOOLS", "Free AI Tools Directory", "Curated directory of free AI tools for developers, designers, and businesses.", [("/tools", "Developer Tools"), ("/services", "AI Services")]),
    ("docs/OPENROUTER-SETUP", "OpenRouter Setup Guide", "Step-by-step guide to configure OpenRouter for multi-model AI access.", [("/docs/API_REGISTRY", "API Registry"), ("/contact", "Get Help")]),
    
    # Solution sub-pages
    ("solutions/construction-engineering", "Construction & Engineering Solutions", "Digital transformation solutions for construction and engineering firms.", [("/services", "All Services"), ("/contact", "Request Demo")]),
    ("solutions/education-training", "Education & Training Technology", "EdTech solutions for schools, universities, and corporate training programs.", [("/services", "All Services"), ("/contact", "Request Demo")]),
    ("solutions/energy-utilities", "Energy & Utilities Technology", "Smart grid, IoT, and AI solutions for energy and utility companies.", [("/services", "All Services"), ("/contact", "Request Demo")]),
    ("solutions/media-entertainment", "Media & Entertainment Technology", "Streaming, content management, and audience analytics for media companies.", [("/services", "All Services"), ("/contact", "Request Demo")]),
    
    # Legal/policy pages
    ("cookie-policy", "Cookie Policy", "How Zion Tech Group uses cookies and similar technologies on our website.", [("/contact", "Contact Us")]),
    ("sla", "Service Level Agreements", "Our commitment to uptime, performance, and support response times.", [("/pricing", "Pricing Plans"), ("/contact", "Contact Sales")]),
    ("changelog", "Product Changelog", "Latest updates, new features, and improvements to our platform.", [("/services", "All Services")]),
    
    # Newsletter and community
    ("newsletter", "Newsletter", "Subscribe to our newsletter for AI insights, tech trends, and product updates.", [("/contact", "Contact Us")]),
    ("training", "Training & Certification", "Professional training and certification programs for AI and IT technologies.", [("/services", "All Services"), ("/contact", "Enroll Now")]),
    ("help", "Help Center", "Find answers to common questions and get support.", [("/contact", "Contact Support"), ("/docs", "Documentation")]),
    
    # Services hub pages
    ("ai-chatbot-builder", "AI Chatbot Builder", "Build intelligent chatbots with our AI-powered conversational platform.", [("/services", "View AI Chatbot Services"), ("/contact", "Get Started")]),
    ("ai-claims-automation", "AI Claims Automation", "Automate insurance claims processing with AI and machine learning.", [("/services/ai-claims-automation", "Claims Automation Service"), ("/contact", "Learn More")]),
    ("ai-customer-360", "AI Customer 360", "Unified customer view powered by AI for personalized experiences.", [("/services", "View CDP Services"), ("/contact", "Get Started")]),
    ("ai-customer-support-pro", "AI Customer Support Pro", "AI-powered customer support automation and ticket management.", [("/services", "Support Automation Services"), ("/contact", "Learn More")]),
    ("ai-fraud-detection", "AI Fraud Detection", "Real-time fraud detection and prevention powered by machine learning.", [("/services", "Fraud Detection Services"), ("/contact", "Get Started")]),
    ("ai-medical-diagnosis-assistant", "AI Medical Diagnosis Assistant", "AI-powered diagnostic assistance for healthcare professionals.", [("/services", "Healthcare AI Services"), ("/contact", "Learn More")]),
    ("ai-ml-platform", "AI/ML Platform", "End-to-end machine learning platform for training, deploying, and monitoring models.", [("/services", "ML Platform Services"), ("/contact", "Get Started")]),
    ("ai-predictive-analytics", "AI Predictive Analytics", "Predictive analytics platform for data-driven business decisions.", [("/services", "Analytics Services"), ("/contact", "Learn More")]),
    ("ai-predictive-maintenance", "AI Predictive Maintenance", "Predict equipment failures before they happen with IoT and AI.", [("/services", "Predictive Maintenance Services"), ("/contact", "Get Started")]),
    ("ai-price-optimizer", "AI Price Optimizer", "Dynamic pricing optimization using machine learning and market data.", [("/services", "Pricing Optimization Services"), ("/contact", "Learn More")]),
    ("ai-recommendation-engine", "AI Recommendation Engine", "Personalized recommendation system for e-commerce and content platforms.", [("/services", "Recommendation Services"), ("/contact", "Get Started")]),
    ("ai-route-optimizer", "AI Route Optimizer", "Optimize delivery routes and logistics with AI-powered planning.", [("/services", "Logistics AI Services"), ("/contact", "Learn More")]),
    ("ai-smart-inventory", "AI Smart Inventory", "Intelligent inventory management with demand forecasting and auto-replenishment.", [("/services", "Inventory Management Services"), ("/contact", "Get Started")]),
    ("ai-smart-invoice", "AI Smart Invoice", "Automated invoice processing with AI extraction and validation.", [("/services", "Invoice Automation Services"), ("/contact", "Learn More")]),
    ("ai-stock-portfolio-manager", "AI Stock Portfolio Manager", "AI-powered portfolio management and investment recommendations.", [("/services", "Financial AI Services"), ("/contact", "Get Started")]),
    ("ai-supply-chain", "AI Supply Chain Optimization", "End-to-end supply chain optimization with predictive analytics.", [("/services", "Supply Chain Services"), ("/contact", "Learn More")]),
    ("ai-workflow-automation", "AI Workflow Automation", "Automate complex business workflows with AI and intelligent routing.", [("/services", "Automation Services"), ("/contact", "Get Started")]),
    ("business-intelligence", "Business Intelligence", "Transform data into actionable insights with our BI platform.", [("/services", "BI Services"), ("/contact", "Learn More")]),
    ("cloud-infrastructure-management", "Cloud Infrastructure Management", "Manage and optimize your cloud infrastructure across providers.", [("/services", "Cloud Services"), ("/contact", "Get Started")]),
    ("cloud-infrastructure", "Cloud Infrastructure", "Scalable, secure cloud infrastructure solutions for enterprises.", [("/services", "Cloud Services"), ("/contact", "Learn More")]),
    ("cloud-services", "Cloud Services", "Comprehensive cloud services including migration, management, and optimization.", [("/services", "All Cloud Services"), ("/contact", "Get Started")]),
    ("computer-vision", "Computer Vision Solutions", "Image and video analysis powered by deep learning and computer vision.", [("/services", "Computer Vision Services"), ("/contact", "Learn More")]),
    ("custom-development", "Custom Software Development", "Bespoke software development tailored to your business needs.", [("/services", "Development Services"), ("/contact", "Get a Quote")]),
    ("cybersecurity", "Cybersecurity Services", "Comprehensive cybersecurity solutions to protect your digital assets.", [("/services", "Security Services"), ("/contact", "Get Protected")]),
    ("data-analytics-bi", "Data Analytics & BI", "Business intelligence and data analytics for data-driven decisions.", [("/services", "Analytics Services"), ("/contact", "Learn More")]),
    ("data-analytics", "Data Analytics", "Advanced data analytics platform with visualization and reporting.", [("/services", "Analytics Services"), ("/contact", "Get Started")]),
    ("data-services", "Data Services", "Data engineering, analytics, and management services.", [("/services", "Data Services"), ("/contact", "Learn More")]),
    ("devops-automation", "DevOps Automation", "CI/CD pipelines, infrastructure as code, and DevOps automation.", [("/services", "DevOps Services"), ("/contact", "Get Started")]),
    ("digital-transformation", "Digital Transformation", "End-to-end digital transformation consulting and implementation.", [("/services", "All Services"), ("/contact", "Start Your Journey")]),
    ("digital-twin-platform", "Digital Twin Platform", "Create digital twins of physical assets for simulation and optimization.", [("/services", "Digital Twin Services"), ("/contact", "Learn More")]),
    ("email-automation", "Email Automation", "AI-powered email automation for marketing, sales, and support.", [("/services", "Email Services"), ("/contact", "Get Started")]),
    ("enterprise-security", "Enterprise Security", "Enterprise-grade security solutions for large organizations.", [("/services", "Security Services"), ("/contact", "Get Protected")]),
    ("iot-edge", "IoT & Edge Computing", "IoT and edge computing solutions for real-time data processing.", [("/services", "IoT Services"), ("/contact", "Learn More")]),
    ("iot-platform", "IoT Platform", "Comprehensive IoT platform for device management and data analytics.", [("/services", "IoT Services"), ("/contact", "Get Started")]),
    ("it-services", "IT Services", "Comprehensive IT services including managed services, consulting, and support.", [("/services", "All IT Services"), ("/contact", "Get Started")]),
    ("marketing-automation", "Marketing Automation", "AI-powered marketing automation for lead generation and nurturing.", [("/services", "Marketing Services"), ("/contact", "Learn More")]),
    ("mobile-app-development", "Mobile App Development", "Native and cross-platform mobile app development services.", [("/services", "Development Services"), ("/contact", "Get a Quote")]),
    ("mobile-development", "Mobile Development", "iOS, Android, and cross-platform mobile development.", [("/services", "Development Services"), ("/contact", "Get Started")]),
    ("smart-inventory", "Smart Inventory Management", "AI-powered inventory management with real-time tracking.", [("/services", "Inventory Services"), ("/contact", "Learn More")]),
    ("system-integration", "System Integration", "Seamlessly integrate your systems with APIs, middleware, and custom connectors.", [("/services", "Integration Services"), ("/contact", "Get Started")]),
    ("telemedicine", "Telemedicine Platform", "HIPAA-compliant telemedicine platform for healthcare providers.", [("/services", "Healthcare Services"), ("/contact", "Learn More")]),
    
    # Micro-SaaS sub-pages
    ("micro-saas/ai-chatbot-builder", "AI Chatbot Builder Micro-SaaS", "White-label chatbot builder for agencies and SaaS companies.", [("/services", "View Chatbot Services"), ("/contact", "Get Started")]),
    ("micro-saas/ai-content-writer-pro", "AI Content Writer Pro", "AI-powered content generation for blogs, social media, and marketing.", [("/services", "Content AI Services"), ("/contact", "Learn More")]),
    ("micro-saas/ai-email-marketing-automation", "AI Email Marketing Automation", "Intelligent email marketing with AI segmentation and optimization.", [("/services", "Email Services"), ("/contact", "Get Started")]),
    ("micro-saas/ai-expense-tracker", "AI Expense Tracker", "Automated expense tracking with receipt scanning and categorization.", [("/services", "Financial AI Services"), ("/contact", "Learn More")]),
    ("micro-saas/ai-idea-generator", "AI Idea Generator", "AI-powered brainstorming and idea generation for product teams.", [("/services", "AI Services"), ("/contact", "Get Started")]),
    ("micro-saas/ai-inventory-manager", "AI Inventory Manager", "Smart inventory management for small and medium businesses.", [("/services", "Inventory Services"), ("/contact", "Learn More")]),
    ("micro-saas/ai-invoice-processing", "AI Invoice Processing", "Automated invoice processing with AI data extraction.", [("/services", "Invoice Services"), ("/contact", "Get Started")]),
    ("micro-saas/analytics-dashboard", "Analytics Dashboard", "Real-time analytics dashboard for SaaS metrics and KPIs.", [("/services", "Analytics Services"), ("/contact", "Learn More")]),
    ("micro-saas/appointment-scheduler", "Appointment Scheduler", "AI-powered appointment scheduling with calendar integration.", [("/services", "Scheduling Services"), ("/contact", "Get Started")]),
    ("micro-saas/seo-optimizer", "SEO Optimizer", "AI-powered SEO optimization and content analysis.", [("/services", "Marketing Services"), ("/contact", "Learn More")]),
    ("micro-saas/social-manager", "Social Media Manager", "AI-powered social media management and scheduling.", [("/services", "Social Media Services"), ("/contact", "Get Started")]),
]

created = 0
for path, title, desc, links in pages:
    full_path = os.path.join(BASE, path, "page.tsx")
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    if not os.path.exists(full_path):
        with open(full_path, 'w') as f:
            f.write(make_page(title, desc, links))
        created += 1

print(f"Created {created} stub pages for broken links")
