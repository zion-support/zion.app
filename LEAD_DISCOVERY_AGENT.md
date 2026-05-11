# LEAD_DISCOVERY_AGENT.md

## Status: Active

### Configuration
- API Key: `CRUNCHBASE_API_KEY=your_key_here`
- Apollo API Endpoint: `https://api.apollo.io/v1/organizations/search`

### Cron Schedule
- `*/2 * * * *` (every 2 minutes)

### Dependencies
- Node.js 18.x
- Axios
- Dotenv

### Implementation
1. Fetch SaaS organizations from Crunchbase
2. Validate API credentials
3. Handle 401 errors gracefully
4. Store results in MEMORY.md

### Next Steps
- Implement error handling for API rate limits
- Add retry mechanism for failed requests
- Create monitoring alerts for API failures