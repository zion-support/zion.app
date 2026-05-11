// Error reporting API endpoint
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const { error, stack, componentStack, timestamp, userAgent, url } = req.body;

    // Log error details (in production you would send this to your monitoring service)
    // In a real application, you would:
    // 1. Send to Sentry, LogRocket, Bugsnag, etc.
    // 2. Store in database
    // 3. Send alerts to development team
    console.error('Error reported:', { error, stack, componentStack, timestamp, userAgent, url });
    
    res.status(200).json({ 
      success: true, 
      message: 'Error reported successfully'
    });
  } catch (error) {
    console.error('Error reporting failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to report error' 
    });
  }
}
