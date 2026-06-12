const fs = require('fs');
const path = require('path');

const dir = 'automation/reports';
const file = path.join(dir, 'deploy-status-latest.json');

fs.mkdirSync(dir, { recursive: true });

const data = {
  status: process.env.DEPLOY_STATUS || 'triggered',
  source: process.env.DEPLOY_STATUS_SOURCE || 'unknown',
  timestamp: new Date().toISOString()
};

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('✅ Deploy status written:', data);
