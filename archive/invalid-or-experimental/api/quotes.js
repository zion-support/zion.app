export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const { name, email, phone, details, country, service } = req.body || {};

    if (!name || !email || !phone || !details) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Name, email, phone, and details are required' }));
      return;
    }

    // Process quote submission logic here
    const quote = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      details,
      country,
      service,
      timestamp: new Date().toISOString(),
    };

    // In a real application, you would save this to a database
    // For now, we'll just log it
    console.log('Quote submitted:', quote);

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      message: 'Quote request submitted successfully',
      quoteId: quote.id
    }));

  } catch (error) {
    console.error('Quote submission error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

