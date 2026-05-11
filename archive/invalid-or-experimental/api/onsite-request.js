const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = '';
  const dir = path.join(process.cwd(), 'data');
  const file = path.join(dir, 'onsite-requests.json');

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      
      // Validate required fields
      if (!data.name || !data.email || !data.company || !data.message) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
      }

      // Ensure data directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Read existing data
      let requests = [];
      if (fs.existsSync(file)) {
        try {
          const fileContent = fs.readFileSync(file, 'utf8');
          requests = JSON.parse(fileContent);
        } catch (error) {
          console.error('Error reading existing data:', error);
        }
      }

      // Add new request
      const newRequest = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...data
      };

      requests.push(newRequest);

      // Write back to file
      fs.writeFileSync(file, JSON.stringify(requests, null, 2));

      res.statusCode = 200;
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Request submitted successfully',
        id: newRequest.id
      }));

    } catch (error) {
      console.error('Error processing request:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
}

