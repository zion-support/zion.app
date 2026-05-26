// Blog posts data for Zion Tech Group
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // In a real app, this might be markdown or HTML
  date: string; // ISO date string
  readTime: string; // e.g., "5 min read"
  tags: string[];
  image?: string; // Optional image URL
}

export const blogPosts: BlogPost[] = [
  {
    id: 'ai-accessibility-auditor-launch',
    title: 'Launching Our AI Accessibility Auditor Service',
    excerpt: 'Discover how our new AI-powered accessibility auditor helps businesses achieve WCAG 2.1 AA compliance automatically.',
    content: 'Today we are excited to launch our AI Accessibility Auditor service. This service uses advanced AI to scan websites and applications for accessibility issues, providing detailed reports and remediation suggestions.',
    date: '2024-05-20',
    readTime: '3 min read',
    tags: ['AI', 'Accessibility', 'Launch'],
    image: '/images/blog/ai-accessibility-auditor.jpg'
  },
  {
    id: 'ai-carbon-footprint-optimizer',
    title: 'Introducing the AI Carbon Footprint Optimizer',
    excerpt: 'Learn how our new service helps companies track and reduce their carbon emissions across Scope 1-3.',
    content: 'Our AI Carbon Footprint Optimizer automates the process of collecting data from utility bills, cloud usage, travel itineraries, and supply chain activities to provide a comprehensive view of an organization'\''s carbon footprint.',
    date: '2024-05-15',
    readTime: '4 min read',
    tags: ['AI', 'Sustainability', 'New Service'],
    image: '/images/blog/ai-carbon-optimizer.jpg'
  },
  {
    id: 'ai-knowledge-management-update',
    title: 'Enhancements to Our AI Knowledge Management Platform',
    excerpt: 'See the latest improvements to our AI-driven knowledge management system, including better semantic search and auto-tagging.',
    content: 'We have updated our AI Knowledge Management platform with new features that make it easier for organizations to centralize their knowledge, improve search relevance, and automatically detect content gaps.',
    date: '2024-05-10',
    readTime: '3 min read',
    tags: ['AI', 'Knowledge Management', 'Update'],
    image: '/images/blog/ai-knowledge-management.jpg'
  },
  {
    id: 'ai-sales-intelligence-boost',
    title: 'Boost Your Sales Pipeline with AI Sales Intelligence',
    excerpt: 'Our AI Sales Intelligence service helps businesses increase revenue through predictive lead scoring and deal insights.',
    content: 'By leveraging AI to analyze historical sales data and current market trends, our service provides accurate lead scoring, pipeline forecasting, and automated outreach suggestions to help sales teams focus on the most promising opportunities.',
    date: '2024-05-05',
    readTime: '4 min read',
    tags: ['AI', 'Sales', 'Productivity'],
    image: '/images/blog/ai-sales-intelligence.jpg'
  },
  {
    id: 'devops-cicd-automation',
    title: 'Streamline Your Development with DevOps & CI/CD Automation',
    excerpt: 'Our DevOps and CI/CD automation services help teams deliver software faster and more reliably.',
    content: 'We offer end-to-end CI/CD pipelines, container orchestration, GitOps workflows, and site reliability engineering practices to help organizations accelerate their software delivery while maintaining high quality and stability.',
    date: '2024-05-01',
    readTime: '5 min read',
    tags: ['DevOps', 'Automation', 'CI/CD'],
    image: '/images/blog/devops-cicd.jpg'
  }
];