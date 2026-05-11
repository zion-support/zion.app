// Placeholder script to validate promoted routes.
const https = require('https');
const fs = require('fs');
const path = require('path');
const routeFilePath = path.join(process.cwd(), 'docs/promoted-routes.json');

function checkRoute(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const { statusCode } = res;
      res.on('data', () => {}); // consume
      res.on('end', () => {
        if (statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

async function main() {
  if (!fs.existsSync(routeFilePath)) {
    console.warn('Promoted routes file not found. Skipping validation.');
    process.exit(0);
  }

  const routes = JSON.parse(fs.readFileSync(routeFilePath, 'utf8'));
  let allHealthy = true;

  for (const route of routes) {
    const url = `https://ziontechgroup.com${route.path}`;
    try {
      const healthy = await checkRoute(url);
      if (!healthy) {
        console.error(`⚠️ Route ${route.path} returned non-200 status`);
        allHealthy = false;
      } else {
        console.log(`✅ Route ${route.path} is healthy`);
      }
    } catch (error) {
      console.error(`❌ Error checking route ${route.path}:`, error.message);
      allHealthy = false;
    }
  }

  if (allHealthy) {
    console.log('🟢 All promoted routes are healthy');
    process.exit(0);
  } else {
    console.error('🔴 Some promoted routes are unhealthy');
    process.exit(1);
  }
}

main();