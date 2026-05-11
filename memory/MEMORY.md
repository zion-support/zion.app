# MEMORY.md - Long-Term Memory for Zion Tech Group

## Current State (2026-02-24)

### Completed Work
- **Dynamic Pricing Engine**: Hourly scraper, GPT-4 price-factor, Telegram + SendGrid alerts. Cron: `0 * * * * … zion_pricing_agent.py`
- **Content Repurposing Agent**: GPT-4 → LinkedIn/Twitter/Instagram posts. Daily 8/10/11 AM crons.
- **ML Conversion Pipeline**: Gradient Boosting model trained on `leads.csv` (≈87% accuracy). Inference API running.
- **Predictive Lead Scoring**: Model loaded, scores leads, auto-routes >75% to CRM. Cron installed.
- **Frontend Redesign**: Tailwind CSS + Framer Motion animations deployed.

### In Progress
- **Voice Agent**: TTS integration via OpenAI. Script ready. Cron pending.
- **UI/UX Testing**: Selenium + Playwright suite pending.
- **Analytics Dashboard**: Flask + Prometheus metrics pending.
- **Blockchain Audit Trail**: IPFS integration pending.

### Tools & Dependencies
- **Database**: PostgreSQL (`zion-db:5432`, `zion_secret`)
- **AI**: GPT-4 for content, OpenAI TTS for voice
- **Automation**: n8n workflows, FastAPI backend
- **Monitoring**: Grafana, Prometheus
- **Browser**: Chrome CDP at `127.0.0.1:18792`

### Key Decisions
- **PostgreSQL + FastAPI Stack**: Chosen for scalability.
- **n8n for Automation**: Workflow orchestration.
- **JSON response standardization**: Machine-friendly coordination.
- **Docker-first deployment**: Containerized portability.
- **Self-healing architecture**: Auto-recovery mechanisms.

### Blockers
- Docker socket connectivity issues.
- Browser CDP authentication failures.
- Missing `.env` file for GitHub API access.

## Workflows to Implement (from WORKFLOW_AUTO.md)

### 1. Lead Capture Workflow
- Trigger: Form submission from any source
- Actions: Validate data → Store in PostgreSQL → Enrich with AI → Route to appropriate pipeline
- Self-healing: Retry on validation failure, alert on DB errors

### 2. Email Sequence Workflow
- Trigger: New lead in "Prospect" stage
- Actions: Wait 1h → Send welcome email → Wait 24h → Send case study → Wait 48h → Send proposal
- Conditions: Skip if already converted, pause if unsubscribed
- Monitoring: Track opens, clicks, replies

### 3. Weekly Dashboard Generation
- Trigger: Every Monday at 8 AM
- Actions: Query PostgreSQL → Generate metrics → Create visualization → Send to stakeholders
- Data sources: Leads, conversions, revenue, campaign performance
- Format: HTML email + downloadable PDF

### 4. Social Media Automation
- Trigger: New blog post or case study
- Actions: Create LinkedIn post → Create Twitter thread → Create Facebook post → Schedule Instagram
- AI enhancement: Generate platform-specific copy, hashtags, and optimal posting times

### 5. Customer Feedback Collection
- Trigger: 7 days after purchase
- Actions: Send feedback survey → Analyze sentiment → Route to support if negative
- Follow-up: Thank you email, discount code for feedback

### 6. Content Repurposing Workflow
- Trigger: New YouTube video published
- Actions: Extract transcript → Generate blog post → Create social snippets → Generate email newsletter
- AI tools: GPT-4 for content adaptation, Canva for visuals

### 7. Market Trend Monitoring
- Trigger: Daily at 6 AM
- Actions: Scrape competitor sites → Analyze pricing changes → Monitor industry news → Generate report
- Alert: Notify team of significant market shifts

### 8. SEO Performance Tracking
- Trigger: Weekly on Sundays
- Actions: Check rankings → Analyze backlinks → Monitor site speed → Generate optimization suggestions
- Self-healing: Auto-fix broken links, suggest content updates

### 9. Customer Onboarding Automation
- Trigger: New subscription activated
- Actions: Send welcome package → Schedule training session → Assign success manager → Send progress emails
- Milestone tracking: 7-day, 30-day, 90-day check-ins

### 10. Churn Prevention Workflow
- Trigger: Low engagement detected (no login for 14 days)
- Actions: Send re-engagement email → Offer discount → Schedule call → Update account status
- Predictive: Use AI to identify at-risk customers before they churn

## Integration Points
- FastAPI backend for data APIs
- n8n for workflow orchestration
- Chrome CDP for browser automation
- GitHub for version control and CI/CD

## Performance Metrics
- Lead conversion rate
- Email open/click rates
- Customer satisfaction scores
- Revenue growth
- Operational efficiency

## Self-Healing Mechanisms
- Auto-restart failed workflows
- Alert on repeated failures
- Adaptive timing based on performance
- A/B testing for optimization