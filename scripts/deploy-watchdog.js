const https = require('https');
const url = 'https://ziontechgroup.com/health';

function checkHealth() {
  https.get(url, (res) => {
    const { statusCode } = res;
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      if (statusCode === 200) {
        console.log('✅ Deployment health check passed.');
      } else {
        console.error(`⚠️ Deployment health check failed with status ${statusCode}.`);
        // Here you could trigger alerts or auto-recovery actions.
      }
    });
  }).on('error', (e) => {
    console.error(`❌ Health check error: ${e.message}`);
    // Trigger alert or remediation.
  });
}

checkHealth();